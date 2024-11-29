

importScripts(`${self.location.origin}/projects/lattice/fly/build/bundle.js`);
console.log(YeomenLibrary)

const directions = ["North", "East", "South", "West"];
const characterTypes = ["Fly", "Frog"];

const radius = 1;

const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');

            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;

            let stats = {
                moveSuccess: 0,
                moveFailed: 0,
                startTime: new Date().getTime(),
                endTime: new Date().getTime(),
                debug: {
                    storedBlock: 0,
                    latestBlock: 0
                }
            };
            await displayStats();


            const { createPublicClient, getContract, webSocket, http, createWalletClient, encodeFunctionData, decodeEventLog } = YeomenLibrary.viem;

            const chain = {
                id: 17420,
                name: 'rhodolitechain',
                rpcUrls: {
                    default: {
                        http: ["https://rpc.rhodolitechain.com"],
                        webSocket: ['wss://rpc.rhodolitechain.com'],
                    },
                    wiresaw: {
                        http: ["https://rpc.rhodolitechain.com"],
                        webSocket: ['wss://rpc.rhodolitechain.com'],
                    },
                },
                blockExplorers: {
                    default: {
                        url: "https://explorer.rhodolitechain.com",
                        name: "rhodolitechain",
                    },
                },
                nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                },
                testnet: true
            };

            const clientOptions = {
                chain: chain,
                transport: webSocket(),
                pollingInterval: 1000
            };

            const publicClient = createPublicClient(clientOptions);
            const { defineWorld } = YeomenLibrary.latticexyz_world;
            const { createWorld, defineSystem, runQuery, Has, HasValue, getComponentValue, getComponentValueStrict, UpdateType, SyncStep } = YeomenLibrary.latticexyz_recs;
            const { singletonEntity } = YeomenLibrary.latticexyz_storeSync_recs;
            const { Grid, Astar } = YeomenLibrary.fast_astar;

            const mudConfig = defineWorld({
                namespace: "app",
                userTypes: {
                    Entity: {
                        type: "bytes32",
                        filePath: "./contracts/Entity.sol"
                    }
                },
                enums: {
                    Direction: ["North", "East", "South", "West"],
                    CharacterType: ["Fly", "Frog"],
                    TerrainType: ["None", "Tree", "Boulder"]
                },
                tables: {
                    EntityCount: {
                        schema: {
                            count: "uint256"
                        },
                        key: []
                    },
                    Map: {
                        schema: {
                            width: "uint32",
                            height: "uint32",
                            terrain: "uint8[]"
                        },
                        key: []
                    },
                    Owner: {
                        id: "Entity",
                        owner: "address"
                    },
                    Character: {
                        id: "Entity",
                        characterType: "CharacterType"
                    },
                    Position: {
                        id: "Entity",
                        x: "uint32",
                        y: "uint32",
                        heading: "Direction"
                    },
                    Health: {
                        id: "Entity",
                        health: "uint256"
                    },
                    Score: {
                        id: "Entity",
                        score: "uint256"
                    },
                    SpawnedAt: {
                        id: "Entity",
                        time: "uint256"
                    },
                    DiedAt: {
                        id: "Entity",
                        time: "uint256",
                        killer: "Entity"
                    },
                    EntityAtPosition: {
                        schema: {
                            x: "uint32",
                            y: "uint32",
                            entity: "Entity"
                        },
                        key: ["x", "y"]
                    }
                },
            });

            const world = createWorld();

            const { components, latestBlock$, storedBlockLogs$ } = await YeomenLibrary.latticexyz_storeSync_recs.syncToRecs({
                world,
                config: mudConfig,
                address: "0xbd17c11482718efc54281b34c5d1b49a970eff4e",
                publicClient,
                startBlock: BigInt(14664),
                indexerUrl: "https://indexer.mud.rhodolitechain.com"
            });

            latestBlock$.subscribe({
                next: (blockData) => {
                    console.log("New block data received:", blockData.number);
                    stats.debug.latestBlock = blockData.number;
                    displayStats();
                },
                error: (err) => {
                    console.error("Error in latestBlock$ subscription:", err);
                },
                complete: () => {
                    console.log("latestBlock$ observable completed");
                },
            });


            storedBlockLogs$.subscribe((blockData) => {
                console.log("stored block data received:", blockData.blockNumber);
                stats.debug.storedBlock = blockData.blockNumber;
                displayStats();
                useComponents();
            });


            let map, grid, astar;
            let characters;
            let playerCharacters;
            let playerCharacter;
            let playerEntity = null;
            components.SyncProgress.update$.subscribe(({ value }) => {
                console.log('SyncProgress', value)
                const SyncProgress = value[0];
                YeomenAI.statusMessage(`${SyncProgress.message} - ${SyncProgress.percentage}%`);
                if (SyncProgress.step == 'snapshot' && SyncProgress.percentage == 100 && SyncProgress.message == 'Hydrated from snapshot') {
                    map = getComponentValue(components.Map, singletonEntity);
                    //console.log(map)

                    grid = new Grid({ col: map.width, row: map.height });
                    for (let x = 0; x < map.width; x++) {
                        for (let y = 0; y < map.height; y++) {
                            const tile = map.terrain.at(y * map.width + x);
                            //console.log(y * map.width + x, tile)
                            if (tile && tile !== "None") {
                                //console.log('obstacle at ', [x, y], tile)
                                grid.set([x, y], "value", 1);
                            }
                        }
                    }
                    astar = new Astar(grid);

                    useComponents();
                    start();
                }

            });


            function useComponents() {

                const ownerIds = runQuery([
                    Has(components.Owner)
                ])
                //console.log(ownerIds)
                // // Retrieve the Owner component values for each matching entity
                characters = Array.from(ownerIds).map(entity => {
                    // Retrieve each component value and store it in a variable
                    const ownerRecord = getComponentValue(components.Owner, entity);
                    const spawnedAtRecord = getComponentValue(components.SpawnedAt, entity);
                    const characterRecord = getComponentValue(components.Character, entity);
                    const scoreRecord = getComponentValue(components.Score, entity);
                    const healthRecord = getComponentValue(components.Health, entity);
                    const positionRecord = getComponentValue(components.Position, entity);
                    //console.log(ownerRecord, scoreRecord, healthRecord, positionRecord)

                    // Construct and return the object using the stored variables
                    return {
                        id: entity,
                        owner: ownerRecord.owner,
                        spawnedAt: spawnedAtRecord.time,
                        characterType: characterRecord.characterType,
                        score: scoreRecord?.score || 0n,
                        health: healthRecord.health,
                        isAlive: healthRecord.health > 0n,
                        x: positionRecord.x,
                        y: positionRecord.y,
                        heading: positionRecord.heading,
                    };
                });

                playerCharacters = characters.filter((character) => character.owner.toLowerCase() == playerAddress.toLowerCase());
                playerCharacter = playerCharacters.find((character) => character.id == playerEntity);
                //console.log('ddd',characters, playerCharacters, playerCharacter)

            }


            async function start() {
                let characterType = 1;

                //let playerAliveCharacter = !playerEntity ? playerCharacters.find((character) => character.characterType == characterType && character.isAlive) : null;
                let playerAliveCharacter = !playerEntity
                    ? playerCharacters
                        .filter(character => character.characterType == characterType && character.isAlive)
                        .sort((a, b) => parseInt(b.spawnedAt) - parseInt(a.spawnedAt))  // Sort by latest spawnedAt
                        .shift()  // Get the first character in the sorted list
                    : null;

                if (playerAliveCharacter) {
                    playerEntity = playerAliveCharacter.id;
                } else {

                    let spawnTx = await spawn(characterType);
                    let receipt = await YeomenAI.waitForTransactionReceipt(spawnTx);
                    playerEntity = await getEntityId(receipt);
                }

                if (!playerEntity) {
                    YeomenAI.statusMessage('Unable to get entityId of character');
                    YeomenAI.exit(1);
                }

                //wait for playerCharacter to be ready in store
                console.log('wait for playerCharacter')
                await new Promise(resolve => {
                    if (playerCharacter) {
                        resolve(playerCharacter); // Resolve immediately if `playerCharacter` is ready
                    } else {
                        // Check periodically if `playerCharacter` is ready
                        const interval = setInterval(() => {
                            if (playerCharacter) {
                                clearInterval(interval); // Clear the interval when ready
                                resolve(playerCharacter);
                            }
                        }, 1000);
                    }
                });

                while (playerCharacter.isAlive) {
                    console.log('playerCharacter ready')
                    let positionRecord = await getPositionRecord(playerEntity);
                    console.log('positionRecord', positionRecord)
                    playerCharacter.x = positionRecord.x;
                    playerCharacter.y = positionRecord.y;
                    playerCharacter.heading = positionRecord.heading;
                    console.log('new position set', playerCharacter.x, playerCharacter.y)

                    let opponentCharacters = characters.filter((character) => character.owner.toLowerCase() != playerAddress.toLowerCase() && character.isAlive);
                    console.log(playerCharacter, opponentCharacters)

                    const getDistance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

                    const nearestOpponentCharacter = opponentCharacters.reduce((nearest, opponent) => {
                        const distance = getDistance(playerCharacter, opponent);
                        return distance < nearest.distance ? { opponent, distance } : nearest;
                    }, { opponent: null, distance: Infinity }).opponent;

                    console.log('nearestOpponentCharacter', nearestOpponentCharacter);

                    if (!nearestOpponentCharacter) continue;

                    const directionOffsets = {
                        0: { dx: 0, dy: -1 },  // North
                        1: { dx: 1, dy: 0 },  // East
                        2: { dx: 0, dy: 1 }, // South
                        3: { dx: -1, dy: 0 }  // West
                    };

                    for (const [directionIndex, { dx, dy }] of Object.entries(directionOffsets)) {
                        // Check if the opponent is in the direction of the current offset
                        if (nearestOpponentCharacter.x === playerCharacter.x + dx &&
                            nearestOpponentCharacter.y === playerCharacter.y + dy) {

                            console.log(`Opponent is in the ${directions[directionIndex]} direction`);
                            // Move the player in that direction
                            await move(playerEntity, directionIndex, characterType);
                        }
                    }

                    // // Get the offset based on the current heading
                    // const { dx, dy } = directionOffsets[playerCharacter.heading];

                    // // Check if the entity is in the expected position based on the heading
                    // if (nearestOpponentCharacter.x === playerCharacter.x + dx && nearestOpponentCharacter.y === playerCharacter.y + dy) {
                    //     await move(playerEntity, playerCharacter.heading, characterType);
                    // }

                }

                if (!playerCharacter.isAlive) {
                    start();
                }
            }






            async function spawn(characterType) {
                let tx;
                try {

                    await YeomenAI.estimateContractGas('app__spawn', [characterType]);
                    try {
                        YeomenAI.statusMessage(`Spawn character ${characterTypes[characterType]}`);
                        tx = await YeomenAI.sendTransaction('app__spawn', [characterType]);
                        YeomenAI.statusMessage(`Successfully spawned character ${characterTypes[characterType]}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                } catch (err) {
                    console.log(JSON.stringify(err))
                    throw err
                }
                return tx;
            }

            async function move(entityId, direction, characterType) {
                try {
                    await YeomenAI.estimateContractGas('app__move', [entityId, direction]);
                    try {
                        YeomenAI.statusMessage(`Moving character ${characterTypes[characterType]} to ${directions[direction]}`);
                        await YeomenAI.sendTransaction('app__move', [entityId, direction]);
                        stats.moveSuccess++;
                        await displayStats();
                        YeomenAI.statusMessage(`Successfully moved character ${characterTypes[characterType]} to ${directions[direction]}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        stats.moveFailed++;
                        await displayStats();
                        YeomenAI.statusMessage(`move Failed: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                } catch (err) {
                    console.log('move error', JSON.stringify(err))
                    throw err
                }
            }

            async function getEntityId(receipt) {
                if (receipt && receipt.logs && receipt.logs.length > 0) {
                    for (const log of receipt.logs) {

                        if (log.topics[0] === '0x8dbb3a9672eebfd3773e72dd9c102393436816d832c7ba9e1e1ac8fcadcac7a9'
                        ) {
                            // Decode the log using the ABI
                            const decodedLog = await YeomenAI.decodeEventLog(log);

                            // Assuming the event name or field in the event is `entityId`
                            if (decodedLog && decodedLog.args && decodedLog.args.keyTuple[0]) {
                                console.log("Entity ID found:", decodedLog.args.keyTuple[0]);
                                return decodedLog.args.keyTuple[0];
                            }
                        }
                    }
                }
                return null;
            }

            async function getPositionRecord(entity) {
                const TABLE_ID = '0x74626170700000000000000000000000506f736974696f6e0000000000000000';

                const KEY_TUPLE = [entity];
                const TABLE_SCHEMA = {
                    "schema": {
                        "id": "bytes32",
                        "x": "uint32",
                        "y": "uint32",
                        "heading": "uint8"
                    },
                    "key": [
                        "id"
                    ]
                };
                const record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);


                const recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record);
                //console.log(recordDecoded)

                return recordDecoded;
            };

            async function displayStats() {
                stats.endTime = new Date().getTime();
                console.log(stats);

                let markdown = ``;

                markdown += `\n#### Overall Stats\n`;
                markdown += `|                     |       |       |\n`;
                markdown += `|---------------------|-------|-------|\n`;
                markdown += `| Movements success   |       |   ${stats.moveSuccess}   |\n`;
                markdown += `| Movements failed    |       |   ${stats.moveFailed}   |\n`;

                const totalTimeInSeconds = Math.floor((stats.endTime - stats.startTime) / 1000);
                markdown += `| Total Time (s)      |       |   ${totalTimeInSeconds}   |\n`;

                // Check if totalTimeInSeconds is greater than 0 to avoid division by zero
                const movementsPerSecond = totalTimeInSeconds > 0
                    ? (stats.moveSuccess / totalTimeInSeconds).toFixed(2)
                    : "N/A";
                markdown += `| Movements per second |       |   ${movementsPerSecond}   |\n`;

                markdown += `| Latest Block         |       |   ${stats.debug.latestBlock}   |\n`;
                markdown += `| Stored Block         |       |   ${stats.debug.storedBlock}   |\n`;

                await YeomenAI.markdown(markdown);
            }

            //YeomenAI.statusMessage('Running code script completed', YeomenAI.MESSAGE_TYPES.SUCCESS);
            //YeomenAI.exit(0);
        } catch (err) {
            console.log(err);
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();
