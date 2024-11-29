importScripts(`${self.location.origin}/projects/lattice/fly/build/bundle.js`);
console.log(YeomenLibrary)

const directions = ["North", "East", "South", "West"];
const characterTypes = ["Fly", "Frog"];
const terrainTypes = ["None", "Tree", "Boulder"];


const delay = parseInt(formFields['delay']);

const excludeAddresses = [
    '0x816AC4Da434bE034bb3bdE72A3bDA9D307298A47',//Y-JustAFly
    '0xCCa175142A2fc38F740Ef61Eb1C4a7C4269761BF',//Y-SmartFly
    '0xE169CBB7E25E2aBA445E4A6939250b422aeF9907',//Y-LazyFrog
    '0x304f42D454d06D5d8aa6d743c79039cE90DfAd0A',//Y-HungryFrog
];

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


            const { createPublicClient, getContract, fallback, webSocket, http, createWalletClient, encodeFunctionData, decodeEventLog } = YeomenLibrary.viem;

            const { transportObserver } = YeomenLibrary.latticexyz_common;
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
                startBlock: BigInt(319782),
                indexerUrl: "https://indexer.mud.rhodolitechain.com"

            });

            latestBlock$.subscribe({
                next: (blockData) => {
                    //console.log("New block data received:", blockData.number);
                    const syncProgress = getComponentValue(components.SyncProgress, singletonEntity);
                    //console.log('syncProgress', syncProgress)
                    stats.debug.latestBlock = blockData.number;
                    displayStats();


                },
                error: (err) => {
                    console.error("Error in latestBlock$ subscription:", err);
                },
                complete: () => {

                },
            });


            storedBlockLogs$.subscribe((blockData) => {
                //console.log("stored block data received:", blockData.blockNumber);
                stats.debug.storedBlock = blockData.blockNumber;
                displayStats();
                useComponents();
            });

            let map;
            let characters;
            let playerCharacters;
            let playerCharacter;
            let playerEntity = null;
            components.SyncProgress.update$.subscribe(({ value }) => {
                //console.log('SyncProgress', value)
                const SyncProgress = value[0];
                YeomenAI.statusMessage(`${SyncProgress.message} - ${SyncProgress.percentage}%`);
                if (SyncProgress.step == 'snapshot' && SyncProgress.percentage == 100 && SyncProgress.message == 'Hydrated from snapshot') {
                    map = getComponentValue(components.Map, singletonEntity);
                    //console.log(map)

                    // grid = new Grid({ col: map.width, row: map.height });
                    // for (let x = 0; x < map.width; x++) {
                    //     for (let y = 0; y < map.height; y++) {
                    //         const tile = map.terrain.at(y * map.width + x);
                    //         //console.log(y * map.width + x, tile)
                    //         if (tile && tile !== "None") {
                    //             //console.log('obstacle at ', [x, y], tile)
                    //             grid.set([x, y], "value", 1);
                    //         }
                    //     }
                    // }
                    // astar = new Astar(grid);

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
                //console.log(characters, playerCharacters, playerCharacter)

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

                let pathIndex = 1; // Start from the first move after the starting point
                let path = [];
                let nearestOpponentCharacter;
                while (playerCharacter.isAlive) {
                    console.log('playerCharacter ready')


                    //let opponentCharacters = characters.filter((character) => character.owner.toLowerCase() != playerAddress.toLowerCase() && character.isAlive);
                    let opponentCharacters = characters.filter((character) =>
                        character.owner.toLowerCase() !== playerAddress.toLowerCase() &&
                        character.isAlive &&
                        !excludeAddresses.some(address => address.toLowerCase() === character.owner.toLowerCase())
                    );
                    console.log(playerCharacter, opponentCharacters)
                    console.log('player psoition', playerCharacter.x, ' ', playerCharacter.y)

                    const getDistance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

                    function getHeading(from, to, weighted) {
                        const deltaX = to.x - from.x;
                        const deltaY = to.y - from.y;

                        if (deltaX === 0) return deltaY > 0 ? "South" : "North";
                        if (deltaY === 0) return deltaX > 0 ? "East" : "West";

                        return weighted === "vertical"
                            ? deltaY > 0
                                ? "South"
                                : "North"
                            : deltaX > 0
                                ? "East"
                                : "West";
                    }

                    // Check if we need a new path
                    if (path.length === 0 || pathIndex >= path.length) {
                        nearestOpponentCharacter = opponentCharacters.reduce((nearest, opponent) => {
                            const distance = getDistance(playerCharacter, opponent);
                            return distance < nearest.distance ? { opponent, distance } : nearest;
                        }, { opponent: null, distance: Infinity }).opponent;

                        if (!nearestOpponentCharacter) {
                            console.log('No opponents active now - ' + opponentCharacters.length);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            continue;
                        }

                        console.log('Finding new path to nearest opponent');
                        console.log('player psoition inside', playerCharacter.x, ' ', playerCharacter.y)

                        let grid = new Grid({ col: map.width, row: map.height });
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
                        let astar = new Astar(grid);

                        path = astar.search([playerCharacter.x, playerCharacter.y], [nearestOpponentCharacter.x, nearestOpponentCharacter.y], {
                            rightAngle: true,
                            optimalResult: true
                        });
                        for (let i = 0; i < path.length; i++) {
                            const previousPath = path[i - 1] || [playerCharacter.x, playerCharacter.y]; // Current path point [x, y]
                            const currentPath = path[i]; // Current path point [x, y]
                            //const [x, y] = currentPath;

                            // If it's the first point, we start from the player's position
                            const heading = (i == 0 ? directions[playerCharacter.heading] : getHeading({ x: previousPath[0], y: previousPath[1] }, { x: currentPath[0], y: currentPath[1] }));

                            // Update the path with heading
                            path[i] = [...currentPath, heading]; // Add heading to the [x, y] pair

                        }
                        pathIndex = 1;
                        console.log('path', JSON.stringify(path))
                    }

                    const nextMove = path[pathIndex] || null;
                    if (nextMove) {
                        try {
                            const [x, y, heading] = nextMove;
                            //const heading = getHeading({ x: playerCharacter.x, y: playerCharacter.y }, { x, y });

                            console.log(`Next move: ${x}, ${y}, heading: ${heading}`);

                            const directionIndex = directions.indexOf(heading);
                            await move(playerEntity, directionIndex, characterType, { x, y }, nearestOpponentCharacter);
                            await new Promise(resolve => setTimeout(resolve, delay));

                            pathIndex++;
                        } catch (err) {
                            console.error("Error in movement:", err);
                        }
                    } else {
                        // Reset path when completed
                        path = [];
                        pathIndex = 1;
                    }
                    //await new Promise(resolve => setTimeout(resolve, 800));
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

            async function move(entityId, direction, characterType, toPosition, opponentCharacter) {
                try {
                    //await YeomenAI.estimateContractGas('app__move', [entityId, direction]);
                    try {
                        YeomenAI.statusMessage(`Moving character ${characterTypes[characterType]} {x:${toPosition.x},y:${toPosition.y}} to ${directions[direction]} to capture ${characterTypes[opponentCharacter.characterType]} {x:${opponentCharacter.x},y:${opponentCharacter.y}}`);
                        YeomenAI.sendTransaction('app__move', [entityId, direction]);
                        stats.moveSuccess++;
                        displayStats();
                        YeomenAI.statusMessage(`Successfully moved character ${characterTypes[characterType]} to ${directions[direction]}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        stats.moveFailed++;
                        displayStats();
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
                //console.log(stats);

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


        } catch (err) {

            console.log(err);
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();
