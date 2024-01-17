import { JiffClient } from '../jiffClient';

class InternalSocket {
    callbacks: { [key: string]: Function[] };
    jiff: typeof JiffClient;
    computation_id: string;

    constructor(jiff: typeof JiffClient, computation_id: string) {
        this.callbacks = {};
        this.jiff = jiff;
        this.computation_id = computation_id;
    }

    __(): void { }

    on(tag: string, callback: any): void {
        this.callbacks[tag] = callback;
    }
}

function create_computation_instance
    (jiff: typeof JiffClient, computation_id: string, options: any): any {
    options = Object.assign({}, options);
    options.party_id = 's1';

    options.secret_key = null;
    options.public_key = null;

    options.__internal_socket = new Client('<server_instance>', computation_id, options);

    computation_instance.server = jiff; 

    return computation_instance;
}