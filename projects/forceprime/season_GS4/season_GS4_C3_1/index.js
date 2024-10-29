const user_id = formFields['walletAddress'];

const map_id = 'season_GS4_C3_1';
const endpoint = "https://forceprime.io";
const access_token = 'd1d3fe0f4832512e28a0c1a514ac508f71dcbdbd7357f44e99eab1a04b69014f';

const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');

        const createRecord = await fetch(`${endpoint}/forceprime/starknet/account/dummy/create`, {
            method: 'POST',
            body: new URLSearchParams({
                user_id: user_id,
                access_token: access_token
            })
        }).then(response => response.json());

        const mapConfig = await fetch(`${endpoint}/heroes/map/config`, {
            method: 'POST',
            headers: {
                'x-auth-token': createRecord.auth_token
            },
            body: new URLSearchParams({
                map_id: map_id
            })
        }).then(response => response.json());

        const playerGame = await fetch(`${endpoint}/dojo/player_game?${new URLSearchParams({
            player_id: createRecord.wallet.address,
            world_id: mapConfig.map_config.world
        })}`, {
            method: 'GET',
        }).then(response => response.json());

        const actions = [
            {call: 'move', params: '0x6,0x3,0x3,0x1,0x3,0x3,0x1'},
            {call: 'pickup', params: '0x8,0x8'},
            {call: 'move', params: '0x7,0x1,0x4,0x1,0x4,0x4,0x4,0x1'},
            {call: 'pickup', params: '0x6,0xD'},
            {call: 'move', params: '0x6,0x2,0x4,0x2,0x4,0x4,0x4'},
            {call: 'pickup', params: '0x9,0x10'},
            {call: 'move', params: '0x5,0x2,0x2,0x4,0x2,0x2'},
            {call: 'next_day', params: ''},
            {call: 'move', params: '0x3,0x2,0x2,0x4'},
            {call: 'pickup', params: '0xE,0x13'},
            {call: 'move', params: '0x5,0x3,0x3,0x3,0x3,0x3'},
            {call: 'pickup', params: '0xE,0xC'},
            {call: 'move', params: '0x7,0x3,0x2,0x2,0x2,0x3,0x2,0x2'},
            {call: 'pickup', params: '0x14,0xB'},
            {call: 'move', params: '0x4,0x2,0x4,0x2,0x2'},
            {call: 'fight', params: '0x17,0xC'},
            {call: 'move', params: '0x5,0x2,0x2,0x2,0x2,0x3'},
            {call: 'next_day', params: ''},
            {call: 'move', params: '0x2,0x2,0x2'},
            {call: 'capture', params: '0x1C,0xA'},
            {call: 'purchase_unit', params: '0x1C,0xA,0x10'},
            {call: 'move', params: '0x2,0x2,0x4'},
            {call: 'pickup', params: '0x1D,0xD'},
            {call: 'move', params: '0x4,0x1,0x1,0x1,0x4'},
            {call: 'pickup', params: '0x1A,0xE'},
            {call: 'move', params: '0x5,0x2,0x2,0x2,0x4,0x2'},
            {call: 'fight', params: '0x1F,0xE'},
            {call: 'move', params: '0x2,0x2,0x2'},
            {call: 'use_object', params: '0x20,0xD'},
            {call: 'move', params: '0x3,0x2,0x3,0x2'},
            {call: 'capture', params: '0x26,0xC'},
            {call: 'move', params: '0x6,0x2,0x2,0x2,0x3,0x3,0x3'},
            {call: 'next_day', params: ''},
            {call: 'move', params: '0x5,0x2,0x2,0x2,0x2,0x2'},
            {call: 'fight', params: '0x2F,0xA'},
            {call: 'move', params: '0x2,0x2,0x3'},
            {call: 'capture', params: '0x2F,0x8'},
            {call: 'move', params: '0xC,0x4,0x4,0x2,0x2,0x2,0x4,0x4,0x4,0x2,0x2,0x3,0x2'},
            {call: 'capture', params: '0x35,0xC'},
            {call: 'purchase_unit', params: '0x35,0xC,0xC'},
            {call: 'move', params: '0x5,0x1,0x4,0x1,0x4,0x4'},
            {call: 'next_day', params: ''},
            {call: 'fight', params: '0x33,0x11'},
            {call: 'level_up', params: '0x1'},
            {call: 'move', params: '0x7,0x4,0x4,0x4,0x2,0x4,0x2,0x2'},
            {call: 'pickup', params: '0x37,0x14'},
            {call: 'move', params: '0x11,0x1,0x1,0x1,0x4,0x4,0x1,0x1,0x1,0x4,0x4,0x4,0x1,0x1,0x4,0x4,0x1,0x1'},
            {call: 'pickup_artifact', params: '0x2C,0x1C'},
            {call: 'equip_artifact', params: '0x1,0x1'},
            {call: 'next_day', params: ''},
            {call: 'move', params: '0x6,0x1,0x1,0x1,0x1,0x1,0x1'},
            {call: 'pickup', params: '0x25,0x1B'},
            {call: 'move', params: '0x1,0x1'},
            {call: 'capture', params: '0x24,0x1B'},
            {call: 'purchase_unit', params: '0x24,0x1B,0xC'},
            {call: 'move', params: '0x3,0x4,0x4,0x4'},
            {call: 'fight', params: '0x24,0x1E'},
            {call: 'level_up', params: '0x1'},
            {call: 'move', params: '0x2,0x1,0x1'},
            {call: 'use_object', params: '0x23,0x1D'},
            {call: 'move', params: '0x6,0x1,0x1,0x1,0x1,0x1,0x1'},
            {call: 'pickup', params: '0x14,0x21'},
            {call: 'move', params: '0x5,0x3,0x3,0x3,0x3,0x1'},
            {call: 'pickup', params: '0x14,0x1C'},
            {call: 'move', params: '0x1,0x3'},
            {call: 'capture', params: '0x15,0x1C'},
            {call: 'next_day', params: ''},
            {call: 'purchase_unit', params: '0x15,0x1C,0x8'},
            {call: 'move', params: '0x5,0x1,0x3,0x1,0x1,0x3'},
            {call: 'visit', params: '0x10,0x1A'},
            {call: 'move', params: '0xF,0x4,0x1,0x1,0x4,0x1,0x1,0x4,0x4,0x4,0x4,0x4,0x1,0x1,0x1,0x1'},
            {call: 'pickup', params: '0x9,0x22'},
            {call: 'pickup', params: '0x8,0x21'},
            {call: 'move', params: '0x1,0x1'},
            {call: 'capture', params: '0x7,0x21'},
            {call: 'purchase_unit', params: '0x7,0x21,0x4'},
            {call: 'move', params: '0x3,0x2,0x4,0x4'},
            {call: 'next_day', params: ''},
            {call: 'move', params: '0x4,0x4,0x4,0x4,0x4'},
            {call: 'visit', params: '0x9,0x28'},
            {call: 'move', params: '0x2,0x3,0x1'},
            {call: 'pickup', params: '0x7,0x26'},
            {call: 'move', params: '0x12,0x2,0x2,0x2,0x3,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2,0x2'},
            {call: 'next_day', params: ''},
            {call: 'move', params: '0x2,0x2,0x4'},
            {call: 'visit', params: '0x1A,0x27'},
            {call: 'move', params: '0x3,0x1,0x1,0x1'},
            {call: 'pickup', params: ' 0x17,0x27'},
            {call: 'move', params: '0x7,0x3,0x1,0x1,0x1,0x1,0x1,0x1'},
            {call: 'visit', params: '0x11,0x26'},
            {call: 'move', params: '0xC,0x3,0x1,0x1,0x3,0x1,0x1,0x3,0x3,0x1,0x1,0x1,0x3'},
            {call: 'next_day', params: ''},
            {call: 'move', params: '0x9,0x3,0x3,0x3,0x3,0x3,0x3,0x1,0x1,0x1'},
            {call: 'fight', params: '0x7,0x19'}
        ];

        for (const action of actions) {
            try {
                YeomenAI.statusMessage(`Execute Contract call: ${action.call} params: ${action.params}`);
                const callContractResponse = await fetch(`${endpoint}/forceprime/starknet/call_contract`, {
                    method: 'POST',
                    body: new URLSearchParams({
                        access_token: access_token,
                        private_key: createRecord.wallet.privateKey,
                        public_key: createRecord.wallet.publicKey,
                        address: createRecord.wallet.address,
                        call: action.call,
                        params: action.params,
                        contract: mapConfig.map_config.contract,
                        sid: createRecord.sid,
                        uid: createRecord.user_id,
                        user_token: createRecord.auth_token,
                        game_id: playerGame.game_id
                    })
                }).then(response => response.json());                
                YeomenAI.statusMessage(`Executed Contract call: ${action.call} params: ${action.params}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
            } catch (err) {
                YeomenAI.statusMessage(`Failed Contract call ${action.call}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        YeomenAI.statusMessage('Running code script completed');
        YeomenAI.exit(0);
    } catch (err) {
        console.error('Error in simulateGame:', err);
        YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
