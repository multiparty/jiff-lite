import * as sodium from 'libsodium-wrappers';
import * as $ from 'jquery-deferred';

import * as helpers from './common/helpers';
import * as computer from './common/compute';


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

