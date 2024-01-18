import { helpers } from './common/helpers';

export class JiffClient {
    hostname: string;
    computation_id: string;
    options: any;
    server: any;
    helpers: any; // keeps compiler happy, we don't want `any` types anywhere ideally
    share_helpers: any; 

    constructor(hostname: string, computation_id: string, options: any) {
        this.hostname = hostname;
        this.computation_id = computation_id;
        this.options = Object.assign({}, options);
        this.options.party_id = 's1';
        this.options.secret_key = null;
        this.options.public_key = null;
        this.helpers = {};
        
        // defs
        helpers(this)
    }
}