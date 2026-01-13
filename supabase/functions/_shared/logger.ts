/**
 * Logging Utilities for Edge Functions
 * 
 * This module provides standardized logging for Edge Functions.
 * Logs are structured JSON for easy parsing and analysis.
 * 
 * Usage:
 *   import { logger, createRequestLogger } from '../_shared/logger.ts';
 */

/**
 * Log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry structure
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  function_name: string;
  message: string;
  correlation_id?: string;
  user_id?: string;
  company_id?: string;
  duration_ms?: number;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Gets the current log level from environment.
 * Default is 'info' in production, 'debug' in development.
 */
function getLogLevel(): LogLevel {
  const env = Deno.env.get('ENVIRONMENT') || 'development';
  const configuredLevel = Deno.env.get('LOG_LEVEL') as LogLevel;
  
  if (configuredLevel) {
    return configuredLevel;
  }
  
  return env === 'production' ? 'info' : 'debug';
}

/**
 * Log level priority for filtering
 */
const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Checks if the message should be logged based on current log level
 */
function shouldLog(messageLevel: LogLevel): boolean {
  const currentLevel = getLogLevel();
  return logLevelPriority[messageLevel] >= logLevelPriority[currentLevel];
}

/**
 * Formats and outputs a log entry
 */
function outputLog(entry: LogEntry): void {
  const output = JSON.stringify(entry);
  
  switch (entry.level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}

/**
 * Main logger instance
 */
export const logger = {
  /**
   * Debug level log - for detailed debugging information
   */
  debug(
    functionName: string,
    message: string,
    data?: Record<string, unknown>,
    correlationId?: string
  ): void {
    if (!shouldLog('debug')) return;
    
    outputLog({
      timestamp: new Date().toISOString(),
      level: 'debug',
      function_name: functionName,
      message,
      correlation_id: correlationId,
      data,
    });
  },

  /**
   * Info level log - for general operational information
   */
  info(
    functionName: string,
    message: string,
    data?: Record<string, unknown>,
    correlationId?: string
  ): void {
    if (!shouldLog('info')) return;
    
    outputLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      function_name: functionName,
      message,
      correlation_id: correlationId,
      data,
    });
  },

  /**
   * Warning level log - for potentially problematic situations
   */
  warn(
    functionName: string,
    message: string,
    data?: Record<string, unknown>,
    correlationId?: string
  ): void {
    if (!shouldLog('warn')) return;
    
    outputLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      function_name: functionName,
      message,
      correlation_id: correlationId,
      data,
    });
  },

  /**
   * Error level log - for error conditions
   */
  error(
    functionName: string,
    message: string,
    error?: Error,
    data?: Record<string, unknown>,
    correlationId?: string
  ): void {
    if (!shouldLog('error')) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      function_name: functionName,
      message,
      correlation_id: correlationId,
      data,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: Deno.env.get('ENVIRONMENT') !== 'production' ? error.stack : undefined,
      };
    }

    outputLog(entry);
  },
};

/**
 * Request logger for tracking request lifecycle
 */
export interface RequestLogger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, error?: Error, data?: Record<string, unknown>): void;
  complete(status: number, data?: Record<string, unknown>): void;
}

/**
 * Creates a request-scoped logger with correlation ID and timing
 * 
 * @param functionName - The Edge Function name
 * @param correlationId - Correlation ID for request tracking
 * @returns RequestLogger instance
 */
export function createRequestLogger(
  functionName: string,
  correlationId: string
): RequestLogger {
  const startTime = Date.now();

  return {
    debug(message: string, data?: Record<string, unknown>) {
      logger.debug(functionName, message, data, correlationId);
    },

    info(message: string, data?: Record<string, unknown>) {
      logger.info(functionName, message, data, correlationId);
    },

    warn(message: string, data?: Record<string, unknown>) {
      logger.warn(functionName, message, data, correlationId);
    },

    error(message: string, error?: Error, data?: Record<string, unknown>) {
      logger.error(functionName, message, error, data, correlationId);
    },

    complete(status: number, data?: Record<string, unknown>) {
      const durationMs = Date.now() - startTime;
      
      outputLog({
        timestamp: new Date().toISOString(),
        level: status >= 400 ? 'error' : 'info',
        function_name: functionName,
        message: 'Request completed',
        correlation_id: correlationId,
        duration_ms: durationMs,
        data: {
          ...data,
          status_code: status,
        },
      });
    },
  };
}

/**
 * Generates a correlation ID for request tracking
 */
export function generateCorrelationId(): string {
  return crypto.randomUUID();
}

/**
 * Extracts correlation ID from request headers or generates new one
 */
export function getCorrelationId(req: Request): string {
  return req.headers.get('x-correlation-id') || generateCorrelationId();
}
