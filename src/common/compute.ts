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

interface Options {
    party_id?: string;
    secret_key?: any;
    public_key?: any;
    __internal_socket?: InternalSocket;
    [key: string]: any; // for additional properties
}

/*
    * Create a computation instance for a server.
    * @param {Object} jiff - the jiff library instance.
    * @param {string} computation_id - the id of the computation.
    * @param {Object} options - the options to initialize the server with.
    * @returns {Object} - the server instance.
*/
function create_computation_instance
    (jiff: typeof JiffClient, computation_id: string, options: Options): any {
    options = Object.assign({}, options);
    options.party_id = 's1';

    options.secret_key = null;
    options.public_key = null;
    options.__internal_socket = new InternalSocket(jiff, computation_id);
    var computation_instance = new JiffClient(options.party_id, computation_id, options);

    // @TODO - Figure out where the server member in jiff codebase is
    computation_instance.server = jiff;

    return computation_instance;
}
