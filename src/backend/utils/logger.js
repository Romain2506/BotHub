import { createWriteStream } from 'fs';
import { join } from 'path';

const logStream = createWriteStream(join(process.cwd(), 'data', 'logs', 'app.log'), { flags: 'a' });

export class Logger {
  static error(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}\n`;
    console.error(logMessage.trim());
    logStream.write(logMessage);
  }

  static warn(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}\n`;
    console.warn(logMessage.trim());
    logStream.write(logMessage);
  }

  static info(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}\n`;
    console.info(logMessage.trim());
    logStream.write(logMessage);
  }

  static debug(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] DEBUG: ${message}\n`;
    console.debug(logMessage.trim());
    logStream.write(logMessage);
  }
}

// Initialize data/logs directory
import { mkdirSync, existsSync } from 'fs';
const logsDir = join(process.cwd(), 'data', 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}