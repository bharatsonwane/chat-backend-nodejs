class LoggerInstance {
  constructor() {
    this.log = process.env.NODE_ENV === 'development' ? console.log : () => {};
    this.info =
      process.env.NODE_ENV === 'development' ? console.info : () => {};
    this.warn =
      process.env.NODE_ENV === 'development' ? console.warn : () => {};
    this.error =
      process.env.NODE_ENV === 'development' ? console.error : () => {};
  }
}

const logger = new LoggerInstance();

export default logger;
