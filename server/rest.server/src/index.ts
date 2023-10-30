import './env';
import app from '@server';
import logger from '@shared/logger';

import { HeartBeatCheckerService, PollerService } from '@services/index';

// Start heartBeat checker service
HeartBeatCheckerService.start();

// Start polling service
PollerService.start();

// Start the API
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('API has been started on port: ' + port);
});


