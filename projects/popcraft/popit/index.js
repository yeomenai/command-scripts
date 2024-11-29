importScripts(`${self.location.origin}/projects/lattice/fly/build/bundle.js`);
console.log(YeomenLibrary)

const PopSystemId = '0x7379706f704372616674000000000000506f70437261667453797374656d0000';

const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');


        const accountAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;
        const playerAddress = YeomenAI.ACCOUNT.address;

        const padEthAddress = (address) => "0x" + "0".repeat(64 - address.slice(2).length) + address.slice(2);
        const paddedAccountAddress = padEthAddress(accountAddress.toLowerCase());


        function isGameOver(tcmPopStarRecord) {
            // Add 120 seconds to the start time
            const expiryTime = tcmPopStarRecord.startTime + 120n;

            // Get the current time in seconds
            const currentTime = BigInt(Math.floor(Date.now() / 1000));

            return currentTime >= expiryTime;
        }

        // Directions for adjacent cells (left, right, up, down, diagonal)
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],   // cardinal directions
            [-1, -1], [-1, 1], [1, -1], [1, 1]   // diagonal directions
        ];

        function checkAdjacent(matrix, x, y) {
            const value = matrix[x][y];
            const matches = [];

            //If 0 then no need to check
            if (value == 0n) {
                return matches;
            }

            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;

                // Check if the new position is within the bounds of the matrix
                if (nx >= 0 && nx < matrix.length && ny >= 0 && ny < matrix[0].length) {
                    // If the value at the new position is the same as the current value
                    if (matrix[nx][ny] === value) {
                        matches.push([nx, ny]);
                    }
                }
            }

            return matches;
        }


        let tcmPopStarRecord = await getTcmPopStarRecord(paddedAccountAddress);
        let matrix = Array.from({ length: Math.ceil(tcmPopStarRecord.matrixArray.length / 10) }, (_, i) =>
            tcmPopStarRecord.matrixArray.slice(i * 10, i * 10 + 10)
        );

        console.log(matrix);




        if (!isGameOver(tcmPopStarRecord)) {
            YeomenAI.statusMessage(`A game is already in progress. Game simulation will start shortly after the current game completes...`);

            //wait for game start sync
            await new Promise(resolve => {
                if (tcmPopStarRecord && isGameOver(tcmPopStarRecord)) {
                    resolve(tcmPopStarRecord);
                } else {
                    // Check periodically if `playerCharacter` is ready
                    const interval = setInterval(async () => {
                        tcmPopStarRecord = await getTcmPopStarRecord(paddedAccountAddress);
                        if (tcmPopStarRecord && isGameOver(tcmPopStarRecord)) {
                            clearInterval(interval); // Clear the interval when ready
                            resolve(tcmPopStarRecord);
                        }
                    }, 30 * 1000);
                }
            });
        }


        let params = {
            "for_player": playerAddress,
            "for_app": "popCraft",
            "position": { "x": 0, "y": 0 },
            "color": "#ffffff"
        };


        if (isGameOver(tcmPopStarRecord)) {
            params = {
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
        }

        tcmPopStarRecord = await getTcmPopStarRecord(paddedAccountAddress);

        console.log(tcmPopStarRecord.x, tcmPopStarRecord.y, tcmPopStarRecord.owner);

        YeomenAI.statusMessage(`Waiting for the game to start. Please click "Play" in the UI to begin if not started.`);

        //wait for game start sync
        await new Promise(resolve => {
            if (tcmPopStarRecord && !isGameOver(tcmPopStarRecord)) {
                resolve(tcmPopStarRecord);
            } else {
                // Check periodically if `playerCharacter` is ready
                const interval = setInterval(async () => {
                    tcmPopStarRecord = await getTcmPopStarRecord(paddedAccountAddress);
                    if (tcmPopStarRecord && !isGameOver(tcmPopStarRecord)) {
                        clearInterval(interval); // Clear the interval when ready
                        resolve(tcmPopStarRecord);
                    }
                }, 1000);
            }
        });



        while (true) { // Infinite loop to repeat the process
            // Reverse loop from x 179 to 170
            for (let y = 9; y >= 5; y--) {
                tcmPopStarRecord = await getTcmPopStarRecord(paddedAccountAddress);
                matrix = Array.from({ length: Math.ceil(tcmPopStarRecord.matrixArray.length / 10) }, (_, i) =>
                    tcmPopStarRecord.matrixArray.slice(i * 10, i * 10 + 10)
                );
                for (let x = tcmPopStarRecord.x + 9; x >= tcmPopStarRecord.x; x--) {

                    if (isGameOver(tcmPopStarRecord)) {
                        YeomenAI.statusMessage("Game over! Thanks for playing. Try again to beat your high score!");
                        YeomenAI.exit(0);
                        return; // Exits the entire function or loop
                    }

                    //x is subtracted to match the matrix index whihc is 0,0 start index
                    let adjacentMatches = checkAdjacent(matrix, x - tcmPopStarRecord.x, y);
                    if (adjacentMatches.length == 0) continue;

                    console.log(adjacentMatches)

                    params = {
                        "for_player": playerAddress,
                        "for_app": "popCraft",
                        "position": { "x": x, "y": y },
                        "color": "#ffffff"
                    };


                    try {
                        await YeomenAI.estimateContractGas('pop', [params], PopSystemId);
                        try {
                            // Send the transaction
                            YeomenAI.statusMessage(`Trigger pop at {x:${params.position.x}, y:${params.position.y}}`);
                            await YeomenAI.sendTransaction('pop', [params], PopSystemId);
                            YeomenAI.statusMessage(`Successfully trigerred pop at {x:${params.position.x}, y:${params.position.y}}`, YeomenAI.MESSAGE_TYPES.SUCCESS);


                        } catch (err) {
                            YeomenAI.statusMessage(`Failed to trigger pop at {x:${params.position.x}, y:${params.position.y}}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        }
                    } catch (err) {
                        console.log(JSON.stringify(err))
                    }

                }
            }
        }




        async function getTcmPopStarRecord(entity) {
            const TABLE_ID = '0x7462706f70437261667400000000000054434d506f7053746172000000000000';

            const KEY_TUPLE = [entity];
            const TABLE_SCHEMA = {
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
            };
            const record = await YeomenAI.getContractData('getRecord', [TABLE_ID, KEY_TUPLE]);


            const recordDecoded = await YeomenAI.decodeMudRecord(TABLE_SCHEMA, KEY_TUPLE, record);
            //console.log(recordDecoded)

            return recordDecoded;
        };




    } catch (err) {
        console.error(err);
        YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
