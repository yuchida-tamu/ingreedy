export const logger = {
  info: (message: string): void => {
    console.info(`ℹ️ [INFO]: ${message}`);
  },
  error: (message: string): void => {
    console.error(`❌ [ERROR]: ${message}`);
  },
};
