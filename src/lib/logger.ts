type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  
  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };

    if (import.meta.env.DEV) {
      console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error) {
    this.log('error', message, {
      message: error?.message,
      stack: error?.stack,
    });
  }

  debug(message: string, data?: any) {
    if (import.meta.env.DEV) {
      this.log('debug', message, data);
    }
  }
}

export const logger = Logger.getInstance();