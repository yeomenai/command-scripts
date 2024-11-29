importScripts(`${self.location.origin}/projects/lattice/fly/build/bundle.js`);
console.log(YeomenLibrary)

const PopSystemId = '0x7379706f704372616674000000000000506f70437261667453797374656d0000';

const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');


        const accountAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;
        const playerAddress = YeomenAI.ACCOUNT.address;




        const { createPublicClient, getContract, fallback, webSocket, http, createWalletClient, encodeFunctionData, decodeEventLog } = YeomenLibrary.viem;
        const { defineWorld } = YeomenLibrary.latticexyz_world;
        const { createWorld, defineSystem, runQuery, Has, HasValue, getComponentValue, getComponentValueStrict, UpdateType, SyncStep } = YeomenLibrary.latticexyz_recs;
        const { singletonEntity } = YeomenLibrary.latticexyz_storeSync_recs;

        const chain = {
            id: 690,
            name: 'Redstone',
            rpcUrls: {
                default: {
                    http: ["https://rpc.redstonechain.com"],
                    webSocket: ['wss://rpc.redstonechain.com'],
                },
            },
            blockExplorers: {
                default: {
                    url: "https://explorer.redstone.com",
                    name: "redstone",
                },
            },
            nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
            }
        };

        const clientOptions = {
            chain: chain,
            transport: webSocket(),
            pollingInterval: 1000
        };

        const publicClient = createPublicClient(clientOptions);


        const mudConfig = defineWorld({
            namespace: "popCraft",
            enums: {
                Level: ["Easy", "Intermediate", "Hard"]
            },
            tables: {
                TCMPopStar: {
                    key: ["owner"],
                    schema: {
                        owner: "address",
                        x: "uint32",
                        y: "uint32",
                        startTime: "uint256",
                        gameFinished: "bool",
                        matrixArray: "uint256[]",
                        tokenAddressArr: "address[]"
                    }
                },
                TokenBalance: {
                    key: [
                        "owner",
                        "tokenAddress",
                    ],
                    schema: {
                        owner: "address",
                        tokenAddress: "address",
                        balance: "uint256",
                    }
                },
                TokenSold: {
                    key: [
                        "tokenAddress"
                    ],
                    schema: {
                        tokenAddress: "address",
                        soldNow: "uint256",
                        soldAll: "uint256"
                    }
                },
                GameRecord: {
                    key: [
                        "owner"],
                    schema: {
                        owner: "address",
                        times: "uint256",
                        successTimes: "uint256",
                        unissuedRewards: "uint256"
                    }
                },
                // ______________________ SCORE ____________________________
                StarToScore: {
                    key: [
                        "amount"],
                    schema: {
                        amount: "uint256",
                        score: "uint256",
                    }
                },
                DayToScore: {
                    key: [
                        "day"],
                    schema: {
                        day: "uint256",
                        score: "uint256",
                    }
                },
                RankingRecord: {
                    key: [
                        "owner"
                    ],
                    schema: {
                        owner: "address",
                        totalScore: "uint256",
                        highestScore: "uint256",
                        latestScores: "uint256",
                        shortestTime: "uint256"
                    }
                },
                // ______________________ TOKEN ____________________________
                Token: {
                    key: [
                        "index"],
                    schema: {
                        index: "uint256",
                        tokenAddress: "address[]",
                    }
                },
            },
            systems: {
                PopCraftSystem: {
                    name: "PopCraftSystem",
                    openAccess: false
                },
                MatchSystem: {
                    name: "MatchSystem",
                    openAccess: false
                },
            }
        });

        const world = createWorld();

        const { components, latestBlock$, storedBlockLogs$ } = await YeomenLibrary.latticexyz_storeSync_recs.syncToRecs({
            world,
            config: mudConfig,
            address: "0x784844480280ca865ac8ef89bb554283dddff737",
            publicClient,
            startBlock: BigInt(7695257),
            indexerUrl: "https://indexer.mud.redstonechain.com"
        });

        latestBlock$.subscribe({
            next: (blockData) => {
                console.log("New block data received:", blockData.number);

            },
            error: (err) => {
                console.error("Error in latestBlock$ subscription:", err);
            },
            complete: () => {

            },
        });


        storedBlockLogs$.subscribe((blockData) => {
            console.log("stored block data received:", blockData.blockNumber);
            useComponents();
        });

        function useComponents() {
            const owners = runQuery([
                Has(components.TCMPopStar)
            ]);

            const padEthAddress = (address) => "0x" + "0".repeat(64 - address.slice(2).length) + address.slice(2);

            const paddedAccountAddress = padEthAddress(accountAddress.toLowerCase());
console.log(paddedAccountAddress)
            const tcmPopStarRecord = getComponentValue(components.TCMPopStar, paddedAccountAddress);
            console.log(tcmPopStarRecord)
            console.log(owners)
        }


        async function start() {

            let params = {
                "for_player": playerAddress,
                "for_app": "popCraft",
                "position": { "x": 0, "y": 0 },
                "color": "#ffffff"
            };


            try {
                await YeomenAI.estimateContractGas('interact', [params], PopSystemId);
                try {
                    // Send the transaction
                    YeomenAI.statusMessage(`Start game`);
                    await YeomenAI.sendTransaction('interact', [params], PopSystemId);
                    YeomenAI.statusMessage(`Successfully started`, YeomenAI.MESSAGE_TYPES.SUCCESS);

                } catch (err) {
                    YeomenAI.statusMessage(`Failed to start game: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    YeomenAI.exit(1);
                }
            } catch (err) {
                console.log(JSON.stringify(err))
                YeomenAI.statusMessage(`Failed to start game: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
            }

            await YeomenAI.delay(5);

            const startTime = Date.now();
            const duration = 120 * 1000; // 120 seconds in milliseconds

            while (true) { // Infinite loop to repeat the process
                // Reverse loop from x 179 to 170
                for (let y = 9; y >= 5; y--) {
                    for (let x = 179; x >= 170; x--) {

                        if (Date.now() - startTime >= duration) {
                            YeomenAI.statusMessage("120 seconds have passed. Exiting loop.");
                            YeomenAI.exit(0);
                            return; // Exits the entire function or loop
                        }


                        console.log(`x: ${x}, y: ${y}`);
                        console.log(`x: ${x}, y: ${y}`);
                        params = {
                            "for_player": playerAddress,
                            "for_app": "popCraft",
                            "position": { "x": x, "y": y },
                            "color": "#ffffff"
                        };


                        try {
                            //await YeomenAI.estimateContractGas('pop', [params], PopSystemId);
                            try {
                                // Send the transaction
                                //YeomenAI.statusMessage(`Triggering pop action`);
                                YeomenAI.sendTransaction('pop', [params], PopSystemId);
                                //YeomenAI.statusMessage(`Successfully completed pop action`, YeomenAI.MESSAGE_TYPES.SUCCESS);

                            } catch (err) {
                                //YeomenAI.statusMessage(`Failed to complete pop action: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                            }
                        } catch (err) {
                            console.log(JSON.stringify(err))
                        }

                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }

        }


    } catch (err) {
        console.error(err);
        YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
