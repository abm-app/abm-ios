const logger = {
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
  info: (...args: unknown[]) => console.info(...args),
  log: (...args: unknown[]) => console.log(...args),
};

export default logger;
