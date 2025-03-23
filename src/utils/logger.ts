export const logger = {
  info: (message: string): void => {
    console.log(`ℹ️ [INFO]: ${message}`);
  },
  error: (message: string): void => {
    console.error(`❌ [ERROR]: ${message}`);
  },
};
