/*
This will give us an error for now
*/

import * as $ from 'jquery-deferred';
import { JIFFClient } from '../jiffClient.ts'; // Adjust import path as needed

type JIFFServer = {
  computation_instances_deferred: { [key: string]: JQueryDeferred<any> };
  computation_instances_map: { [key: string]: any };
  computationMaps: {
    maxCount: { [key: string]: number };
    secretKeys: { [key: string]: any };
    keys: { [key: string]: { [key: string]: any } };
  };
  handlers: any;
};

type Options = {
  party_id?: string;
  party_count?: number;
  secret_key?: any;
  public_key?: any;
  __internal_socket?: InternalSocket;
};

export = function (JIFFServer: JIFFServer) {
  JIFFServer.prototype.compute = function (computation_id: string, options: Options) {
    if (!this.computation_instances_deferred[computation_id]) {
      this.computation_instances_deferred[computation_id] = $.Deferred();
    }
    this.computation_instances_map[computation_id] = create_computation_instance(this, computation_id, options);
    return this.computation_instances_map[computation_id];
  };
};

function create_computation_instance(jiff: JIFFServer, computation_id: string, options: Options) {
  options = { ...options, party_id: 's1', party_count: jiff.computationMaps.maxCount[computation_id] };
  options.__internal_socket = new InternalSocket(jiff, computation_id);

  const computation_instance = new JIFFClient('<server_instance>', computation_id, options);
  computation_instance.server = jiff;
  return computation_instance;
}

class InternalSocket {
  callbacks: { [key: string]: Function };
  jiff: JIFFServer;
  computation_id: string;

  constructor(jiff: JIFFServer, computation_id: string) {
    this.callbacks = {};
    this.jiff = jiff;
    this.computation_id = computation_id;
  }

  on(tag: string, callback: Function) {
    this.callbacks[tag] = callback;
  }

  connect() {
    const computation_instance = this.jiff.computation_instances_map[this.computation_id];
    const msg = computation_instance.handlers.build_initialization_message();
    const output = this.jiff.handlers.initializeParty(this.computation_id, 's1', computation_instance.party_count, msg, true);

    if (output.success) {
      computation_instance.secret_key = this.jiff.computationMaps.secretKeys[this.computation_id];
      computation_instance.public_key = this.jiff.computationMaps.keys[this.computation_id]['s1'];
      computation_instance.socket.receive('initialization', JSON.stringify(output.message));
      this.jiff.computation_instances_deferred[this.computation_id].resolve();
    } else {
      throw new Error(`Cannot initialize computation instance ${this.computation_id}. Error: ${output.error}`);
    }
  }

  receive(tag: string, param: any) {
    this.callbacks[tag](param);
  }

  emit(label: string, msg: string) {
    const from_id = 's1';
    const parsedMsg = JSON.parse(msg);
    const labels = ['share', 'open', 'custom', 'crypto_provider'];

    if (labels.includes(label)) {
      const output = this.jiff.handlers[label](this.computation_id, from_id, parsedMsg);
      if (!output.success) {
        const errorMsg = JSON.stringify({ label, error: output.error });
        this.receive('error', errorMsg);
      }
    }
  }
}
