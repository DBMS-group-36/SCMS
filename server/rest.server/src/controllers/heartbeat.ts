import { Response, Request } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes'
import CheckConfiguration from "@models/check-configuration";
import HeartBeatRecord from "@models/heartbeat-record";

export async function upsert(request: Request, response: Response) {
    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.status(HttpStatusCodes.BAD_REQUEST).send({ errors: result.array() });
    }

    const checkConfiguration = await CheckConfiguration.findOne({
        name: request.params.name,
        accountName: request.params.account_name
    })

    if (!checkConfiguration || checkConfiguration.type !== "heartbeat") {
        return response.status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
            .json({ error: "Heart beat check configuration with provided name not exists", status: 'failed' }).end();;
    }

    const data = await HeartBeatRecord.findOneAndUpdate({ checkId: checkConfiguration.id }, { lastRecordedTime: new Date() }, { upsert: true, new: true });
    return response.status(HttpStatusCodes.OK).json({ data, status: 'success' }).end();
}
