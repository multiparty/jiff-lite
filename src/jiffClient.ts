// to be used as jiff: client.jiffClient;
export function JiffClient(hostname: string, computation_id: string, options: any): any {
    options = Object.assign({}, options);
    options.party_id = 's1';

    options.secret_key = null;
    options.public_key = null;

    options.__internal_socket = new Client(hostname, computation_id, options);

    // @ts-ignore
    return computation_instance;
}