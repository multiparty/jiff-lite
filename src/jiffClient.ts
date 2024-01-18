export class JiffClient {
    hostname: string;
    computation_id: string;
    options: any;
    server: any;

    constructor(hostname: string, computation_id: string, options: any) {
        this.hostname = hostname;
        this.computation_id = computation_id;
        this.options = Object.assign({}, options);
        this.options.party_id = 's1';
        this.options.secret_key = null;
        this.options.public_key = null;
    }
}
