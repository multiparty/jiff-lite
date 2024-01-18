import * as sodium from 'libsodium-wrappers';
import * as $ from 'jquery-deferred';

import * as helpers from './common/helpers';
import * as computer from './common/compute';

import Hooks from './server/hooks';

interface ComputationMaps {
    clientIds: { [key: string]: string[] };
    spareIds: { [key: string]: any };
    maxCount: { [key: string]: number };
    keys: { [key: string]: { [partyId: string]: string } };
    secretKeys: { [key: string]: string };
    freeParties: { [key: string]: { [partyId: string]: boolean } };
}

interface SocketMaps {
    socketId: { [key: string]: string };
    computationId: { [key: string]: string };
    partyId: { [key: string]: string };
}

class JIFFServer
{
    options: any;
    http: any;
    sodium: typeof sodium | undefined;
    computationMaps: ComputationMaps;
    socketMaps: SocketMaps;
    mailbox: { [key: string]: any };
    extensions: any[];
    computation_instances_map: { [key: string]: any };
    // computation_instances_deferred: { [key: string]: JQuery.Deferred<any, any, any> };
    hooks: Hooks;
    cryptoMap: { [key: string]: any };
    // cryptoProviderHandlers: CryptoProviderHandlers;
}

export default JIFFServer;