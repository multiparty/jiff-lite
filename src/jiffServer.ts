import * as sodium from 'libsodium-wrappers';
import * as $ from 'jquery-deferred';

import * as helpers from './common/helpers';
import * as compute from './server/compute';
import Hooks from './server/hooks';
import * as extensions from './server/extensions';
import * as mailbox from './server/mailbox';
import * as socket from './server/socket';
import * as handlers from './server/handlers';
import CryptoProviderHandlers from '.rver/cryptoprovider';

export class JIFFServer {
  options: any;
  http: any;
  sodium?: typeof sodium;
  computationMaps: any;
  socketMaps: any;
  mailbox: any;
  extensions: any[];
  computation_instances_map: any;
  computation_instances_deferred: any;
  cryptoMap: any;
  cryptoProviderHandlers: any;
  hooks: any;

  constructor(http: any, options: any) {
    this.options = {...options};
    this.http = http;

    if (options.sodium !== false) {
      this.sodium = sodium;
    }

    // ... other initializations ...

    this.initSocket();
    handlers(this);
    this.hooks = new Hooks(this);
    this.cryptoProviderHandlers = new CryptoProviderHandlers(this);
  }

  initComputation(computation_id: string, party_id: string, party_count: number): void {
    // ... implementation ...
  }

  freeComputation(computation_id: string): void {
    // ... implementation ...
  }

  repr(): any {
    const copy = {...this};
    copy.sodium = '<sodium>';
    copy.http = '<http>';
    // ... other replacements ...
    return copy;
  }

  // ... other methods ...
}

// Fill in prototype
Object.assign(JIFFServer.prototype, helpers);

extensions(JIFFServer);
compute(JIFFServer);

socket(JIFFServer);
mailbox.initPrototype(JIFFServer);
