import CheckConfiguration from '@models/check-configuration';
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import * as CheckConfigurationController from "@controllers/check-configuration";
import * as CheckResultController from "@controllers/check-result";
import * as HeartBeatController from "@controllers/heartbeat";

const checksRouter = Router({ mergeParams: true });

const validateCreateData: Array<ValidationChain | Middleware> = [
    body('type').isIn(['poll', 'heartbeat']).bail(),
    body('name').trim().notEmpty().custom(async (value, { req }) => {
        if (await CheckConfiguration.findOne({ name: value, accountName: req.params?.account_name })) {
            throw new Error('name already exists. name should be unique');
        }
    }).escape(),
    oneOf([
        [
            body('type').equals('poll'),
            body('action').notEmpty().trim().escape(),
            body('model').notEmpty().trim().escape(),
            body('interval').optional({ checkFalsy: true }).isNumeric(),
            body('maximumLatency').optional({ checkFalsy: true }).isNumeric(),
        ],
        [
            body('type').equals('heartbeat'),
            body('timePeriod').optional({ checkFalsy: true }).isNumeric(),
        ]
    ])
];

const validateUpdateData: Array<ValidationChain | Middleware> = [
    param('name').notEmpty(),
    body('action').optional({ checkFalsy: true }).notEmpty().trim().escape(),
    body('model').optional({ checkFalsy: true }).notEmpty().trim().escape(),
    body('interval').optional({ checkFalsy: true }).isNumeric(),
    body('maximumLatency').optional({ checkFalsy: true }).isNumeric(),
    body('timePeriod').optional({ checkFalsy: true }).isNumeric(),
];

const validateGetCheckResults: Array<ValidationChain | Middleware> = [
    param('name').notEmpty(),
    query('from').isISO8601().toDate().escape(),
    query('to').isISO8601().toDate().escape(),
];

// Check Router
checksRouter.get('/checks/', CheckConfigurationController.index);
checksRouter.get('/checks/:name', param('name').notEmpty(), CheckConfigurationController.get);
checksRouter.post('/checks/', validateCreateData, CheckConfigurationController.create);
checksRouter.put('/checks/:name', validateUpdateData, CheckConfigurationController.update);
checksRouter.delete('/checks/:name', param('name').notEmpty(), CheckConfigurationController.remove);

// Add new heartbeat record
checksRouter.post('/checks/:name/heartbeat', [param('name').trim().notEmpty().escape()], HeartBeatController.upsert);

// Get check results
checksRouter.get('/checks/:name/results', validateGetCheckResults, CheckResultController.getAll);

export default checksRouter;
