import * as sodium from 'libsodium-wrappers';
import * as $ from 'jquery-deferred';


export class JIFFServer 
{
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
}