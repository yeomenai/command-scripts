
importScripts(`${self.location.origin}/projects/lattice/fly/build/bundle.js`);
console.log(YeomenLibrary)

const directions = ["North", "East", "South", "West"];
const characterTypes = ["Fly", "Frog"];

const radius = parseInt(formFields['radius']);
const delay = parseInt(formFields['delay']);

const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');

            let stats = {
                moveSuccess: 0,
                moveFailed: 0,
                startTime: new Date().getTime(),
                endTime: new Date().getTime()
            };
            await displayStats();

            const { createPublicClient, getContract, http, createWalletClient, encodeFunctionData, decodeEventLog } = YeomenLibrary.viem;

            const chain = {
                id: 17420,
                name: 'rhodolitechain',
                rpcUrls: {
                    default: {
                        http: ["https://rpc.rhodolitechain.com"],
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
                transport: http()
            };

            const publicClient = createPublicClient(clientOptions);
            const { defineWorld } = YeomenLibrary.latticexyz_world;
            const { createWorld, defineSystem, runQuery, Has, HasValue, getComponentValueStrict, UpdateType, SyncStep } = YeomenLibrary.latticexyz_recs;

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

            components.SyncProgress.update$.subscribe(({ value }) => {
                console.log('SyncProgress', value)
                const SyncProgress = value[0];
                YeomenAI.statusMessage(`${SyncProgress.message} - ${SyncProgress.percentage}%`);
                if (SyncProgress.step == 'snapshot' && SyncProgress.percentage == 100 && SyncProgress.message == 'Hydrated from snapshot') {
                    start();
                }

            });



            latestBlock$.subscribe({
                next: (blockData) => {
                    console.log("New block data received:", blockData.number);
                },
                error: (err) => {
                    console.error("Error in latestBlock$ subscription:", err);
                },
                complete: () => {
                    console.log("latestBlock$ observable completed");
                },
            });


            storedBlockLogs$.subscribe({
                next: (blockData) => {
                    console.log("stored block data received:", blockData.blockNumber);
                },
                error: (err) => {
                    console.error("Error in storedBlockLogs$ subscription:", err);
                },
                complete: () => {
                    console.log("storedBlockLogs$ observable completed");
                },
            });

            let positionSubscription = null;
            let diedAtSubscription = null;
            let isAlive = false;
            async function start() {
                // Unsubscribe if subscriptions already exist
                if (positionSubscription) positionSubscription.unsubscribe();
                if (diedAtSubscription) diedAtSubscription.unsubscribe();


                let characterType = 0;

                let spawnTx = await spawn(characterType);
                const receipt = await YeomenAI.waitForTransactionReceipt(spawnTx);
                const entityId = await getEntityId(receipt);
                isAlive = true;

                if (!entityId) {
                    YeomenAI.statusMessage('Unable to get entityId of character');
                    YeomenAI.exit(1);
                }

                let currentPosition = { x: 0, y: 0 };
                //let currentPosition = null;

                function isWithinBounds(position) {
                    return (
                        position.x >= -radius &&
                        position.x <= radius &&
                        position.y >= -radius &&
                        position.y <= radius
                    );
                }

                //watch position updates
                positionSubscription = components.Position.update$.subscribe(async ({ entity, value }) => {
                    let entityPosition = value[0];
                    if (entityId == entity) {
                        currentPosition = { x: entityPosition.x, y: entityPosition.y };
                        return;
                    }
                });

                diedAtSubscription = components.DiedAt.update$.subscribe(async ({ entity, value }) => {
                    let entityDiedAt = value[0];
                    console.log('entityDiedAt', entityDiedAt)
                    if (entityId == entity) {
                        console.log('player died', entityDiedAt)
                        isAlive = false;
                        start();
                    }
                });


                async function moveCharacter(entityId, currentPosition) {
                    if (!isAlive) return;
                    // Filter valid directions within radius
                    const validDirections = directions.filter((direction) => {
                        let newPosition = { ...currentPosition };

                        switch (direction) {
                            case 'North': newPosition.y -= 1; break; // Move north
                            case 'East': newPosition.x += 1; break; // Move east
                            case 'South': newPosition.y += 1; break; // Move south
                            case 'West': newPosition.x -= 1; break; // Move west
                            // Add more cases if there are more directions
                        }

                        //return getDistance(startPosition, newPosition) <= radius;
                        return isWithinBounds(newPosition);
                    });


                    // Pick a random valid direction
                    let direction = validDirections[Math.floor(Math.random() * validDirections.length)];


                    if (direction !== undefined) {
                        let directionIndex = directions.indexOf(direction);
                        await move(entityId, directionIndex, characterType);

                        // Update the current position
                        switch (direction) {
                            case 'North': currentPosition.y -= 1; break; // Move north
                            case 'East': currentPosition.x += 1; break; // Move east
                            case 'South': currentPosition.y += 1; break; // Move south
                            case 'West': currentPosition.x -= 1; break; // Move west
                            // Update cases for more directions
                        }
                    }

                    // Recursive call for next move if alive
                    if (isAlive) {
                        setTimeout(() => moveCharacter(entityId, currentPosition), delay); // Delay next move if needed
                    }
                }
                moveCharacter(entityId, currentPosition);


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
                    //await YeomenAI.estimateContractGas('app__move', [entityId, direction]);
                    try {
                        YeomenAI.statusMessage(`Moving character ${characterTypes[characterType]} to ${directions[direction]}`);
                        YeomenAI.sendTransaction('app__move', [entityId, direction]);
                        stats.moveSuccess++;
                        displayStats();
                        YeomenAI.statusMessage(`Successfully moved character ${characterTypes[characterType]} to ${directions[direction]}`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        stats.moveFailed++;
                        displayStats();
                        YeomenAI.statusMessage(`Failed: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                } catch (err) {
                    console.log(JSON.stringify(err))
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
