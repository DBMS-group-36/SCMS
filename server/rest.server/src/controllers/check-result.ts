import { Response, Request } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes'
import CheckConfiguration from "@models/check-configuration";
import HeartBeatRecord from "@models/heartbeat-record";
import CheckResult from "@models/check-result";

export async function getAll(request: Request, response: Response) {
    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.status(HttpStatusCodes.BAD_REQUEST).send({ errors: result.array() }).end();
    }

    const checkConfiguration = await CheckConfiguration.findOne({
        name: request.params.name,
        accountName: request.params.account_name
    })

    if (!checkConfiguration) {
        return response.status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
            .json({ error: "Check configuration with provided name not exists", status: 'failed' }).end();;
    }

    const from = request.query.from as any as Date
    const to = request.query.to as any as Date

    const data = await CheckResult.find({ 'recordedTime': { '$gte': from, '$lt': to } });
    
    return response.status(HttpStatusCodes.OK).json({ data, status: 'success' }).end();
}
