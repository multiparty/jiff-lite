// import * as shamir_share from '../client/protocols/shamir/share.js';
// import * as intervals from './datastructures/intervals.js';
// import * as mailbox from './mailbox.js';
import JIFFServer from '../jiffServer';

// Keeps compiler happy, but this needs a lot of work!
class ServerHooks {
  jiff: JIFFServer;

  beforeInitialization: ((jiff: JIFFServer, computation_id: string, msg: any, params: any) => any)[];
  afterInitialization: ((...args: any[]) => any)[];
  beforeOperation: ((...args: any[]) => any)[];
  afterOperation: ((...args: any[]) => any)[];
  onDisconnect: ((...args: any[]) => any)[];
  beforeFree: ((...args: any[]) => any)[];
  afterFree: ((...args: any[]) => any)[];

  constructor(jiffServer: JIFFServer) {
    this.jiff = jiffServer;

    for (const hook in ServerHooks.prototype) {
      if (ServerHooks.prototype.hasOwnProperty(hook) && Array.isArray(ServerHooks.prototype[hook])) {
        this[hook] = [...ServerHooks.prototype[hook]];
      }
    }

    const optionHooks = jiffServer.options.hooks || {};
    for (const hook in optionHooks) {
      if (optionHooks.hasOwnProperty(hook)) {
        if (hook === 'beforeInitialization') {
          this[hook] = optionHooks[hook].concat(this[hook]);
        } else {
          this[hook] = optionHooks[hook];
        }
      }
    }
  }

  log(jiff: JIFFServer, ...args: any[]) {
    if (jiff.options.logs) {
      console.log(...args);
    }
  }
}

ServerHooks.prototype.beforeInitialization = [
  function (jiff: JIFFServer, computation_id: string, msg: any, params: any) {
      // @TODO:  stub
  },
];

export default ServerHooks;
