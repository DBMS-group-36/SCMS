import { createLogger, format, transports } from "winston";
import { ConsoleTransportOptions, FileTransportOptions, ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports";
import { isMainThread, workerData } from "worker_threads";

export enum LOG_LEVEL {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly"
}

export enum LOG_TRANSPORT {
  FILE,
  CONSOLE,
  BOTH
}

const APPLICATION_NAME: string = "scms-application";

let LOGGER_NAME: string;

if(isMainThread){
  LOGGER_NAME = "api";
} else{
  LOGGER_NAME = `worker-${(workerData.name as string).toLowerCase()}`;
}

const DEFAULT_LOG_FILENAME: string = getLogFilename();
const DEFAULT_LOG_LOCATION: string = __dirname + "./../../logs";
const DEFAULT_LOG_LEVEL: LOG_LEVEL = LOG_LEVEL.INFO;
const DEFAULT_MAX_FILES: number = 10;
const DEFAULT_MAX_FILESIZE: number = 10 * 1024 * 1024; // 10 Mb

function getLogFilename(): string {
  let date: Date = new Date();
  let pid: number = process.pid;

  return `${APPLICATION_NAME}:${LOGGER_NAME}-${formatDate(date)}-[${pid}].log`;
}

function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()}.${date.getUTCHours()}.${date.getUTCMinutes()}.${date.getUTCSeconds()}`;
}


function getConsoleOptions(): ConsoleTransportOptions {
  return {
    handleExceptions: true,
  };
}
function getFileOptions(): FileTransportOptions {
  return {
    dirname: DEFAULT_LOG_LOCATION,
    filename: getLogFilename() || DEFAULT_LOG_FILENAME,
    handleExceptions: true,
    maxFiles: DEFAULT_MAX_FILES,
    maxsize: DEFAULT_MAX_FILESIZE,
  };
}
function getLogFormat(label: string): any {
  return format.combine(
    format.label({ label }),
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(info => {
      return `${info.timestamp}:[${info.level}]: ${info.message}`;
    })
  );
}

function getConsoleTransport(label: string): ConsoleTransportInstance {
  let logFormat: any = getLogFormat(label);
  let consoleOptions: ConsoleTransportOptions = getConsoleOptions();
  consoleOptions.format = format.combine(
    format.colorize(),
    logFormat, 
  );

  return new transports.Console(consoleOptions);
}

function getFileTransport(): FileTransportInstance {
  return new transports.File(getFileOptions());
}

const logger = createLogger({
  transports: [
    getConsoleTransport(LOGGER_NAME),
    getFileTransport()
  ],
  format: getLogFormat(LOGGER_NAME),
});

export default logger;