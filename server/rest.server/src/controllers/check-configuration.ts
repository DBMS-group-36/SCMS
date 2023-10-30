import { Response, Request } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes'
import CheckConfiguration, { ICheckConfiguration } from "@models/check-configuration";
import {
    DEFAULT_INTERVAL,
    DEFAULT_MAXIMUM_LATENCY,
    DEFAULT_POLLING_METHOD,
    DEFAULT_TIME_PERIOD
} from "@shared/constants";
import { HeartBeatCheckerService, PollerService } from "@services/index";
import {
    CONFIGURATION_CREATED,
    CONFIGURATION_REMOVED,
    CONFIGURATION_UPDATED,
} from '@services/messages';

export async function get(request: Request, response: Response) {
    const data = await CheckConfiguration.findOne({ name: request.params.name });
    if (!data) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ status: 'failed' });
    }

    return response.status(HttpStatusCodes.OK).json({ status: 'success', data });
}

export async function index(request: Request, response: Response) {
    const data = await CheckConfiguration.find({ accountName: request.params.account_name });
    return response.status(HttpStatusCodes.OK).json({ status: 'success', data });
}

export function sendChangedMessageToServiceWorker(configurationType: string, messageName: string, configurationName: string) {
    let message = {
        name: messageName,
        configurationName
    }

    if (configurationType === 'poll') {
        PollerService.tell(message);
    } else if (configurationType === 'heartbeat') {
        HeartBeatCheckerService.tell(message);
    }
}

export async function create(request: Request, response: Response) {
    const result = validationResult(request);
    
    if (!result.isEmpty()) {
        return response.status(HttpStatusCodes.BAD_REQUEST).send({ errors: result.array() });
    }

    let checkConfiguration = new CheckConfiguration({
        accountName: request.params.account_name,
        type: request.body.type,
        name: request.body.name,
        ...(request.body.type === 'poll') ? {
            action: request.body.action,
            model: request.body.model,
            interval: request.body.interval || DEFAULT_INTERVAL,
            maximumLatency: request.body.maximumLatency || DEFAULT_MAXIMUM_LATENCY,
        } : { timePeriod: request.body.timePeriod || DEFAULT_TIME_PERIOD }
    });

    let data: ICheckConfiguration = await checkConfiguration.save();

    sendChangedMessageToServiceWorker(data.type, CONFIGURATION_CREATED, data.name);

    return response.status(HttpStatusCodes.OK).json({ data, status: 'success' }).end();

}

export async function update(request: Request, response: Response) {
    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ errors: result.array() });
    }

    const existingCheckConfiguration = await CheckConfiguration.findOne({
        name: request.params.name,
        accountName: request.params.account_name
    });

    if (!existingCheckConfiguration) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ status: 'failed' });
    }

    if (request.body.type && existingCheckConfiguration.type !== request.body.type) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ status: 'failed', message: 'type cannot be edited' });
    }

    const { action, model, interval, maximumLatency, timePeriod, type } = request.body;

    const data = await CheckConfiguration.findOneAndUpdate({ name: request.params.name }, {
        ...(existingCheckConfiguration.type === 'poll') ? {
            ...action ? { action } : {},
            ...model ? { model } : {},
            ...interval ? { interval } : {},
            ...maximumLatency ? { maximumLatency } : {},
        } : { ...timePeriod ? { timePeriod } : {}, }
    }, {
        new: true
    });

    data && sendChangedMessageToServiceWorker(data.type, CONFIGURATION_UPDATED, data.name);

    return response.status(HttpStatusCodes.OK).json({ data, status: 'success' }).end();
}

export async function remove(request: Request, response: Response) {

    const existingCheckConfiguration = await CheckConfiguration.findOne({
        name: request.params.name,
        accountName: request.params.account_name
    });

    if (!existingCheckConfiguration) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ status: 'failed' });
    }

    await existingCheckConfiguration.deleteOne();

    sendChangedMessageToServiceWorker(existingCheckConfiguration.type, CONFIGURATION_REMOVED, existingCheckConfiguration.name);

    return response.status(HttpStatusCodes.OK).json({ status: 'success' }).end();
}
