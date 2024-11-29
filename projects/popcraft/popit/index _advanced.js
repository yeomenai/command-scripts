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


        let tcmPopStarRecord = await getTcmPopStarRecord(paddedAccountAddress);



        if (!isGameOver(tcmPopStarRecord)) {
            YeomenAI.statusMessage('A game is already in progress. Resuming game simulation shortly...');

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

        console.log(tcmPopStarRecord);

        //wait for game start sync
        // await new Promise(resolve => {
        //     if (tcmPopStarRecord && !isGameOver(tcmPopStarRecord)) {
        //         resolve(tcmPopStarRecord);
        //     } else {
        //         // Check periodically if `playerCharacter` is ready
        //         const interval = setInterval(async () => {
        //             tcmPopStarRecord = await getTcmPopStarRecord(paddedAccountAddress);
        //             if (tcmPopStarRecord && !isGameOver(tcmPopStarRecord)) {
        //                 clearInterval(interval); // Clear the interval when ready
        //                 resolve(tcmPopStarRecord);
        //             }
        //         }, 1000);
        //     }
        // });



        let matrix = Array.from({ length: Math.ceil(tcmPopStarRecord.matrixArray.length / 10) }, (_, i) =>
            tcmPopStarRecord.matrixArray.slice(i * 10, i * 10 + 10)
        );
        console.log([...matrix]);


        // Directions for adjacent cells: left, right, up, down
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        function findCluster(matrix, x, y, visited) {
            let stack = [[x, y]];
            let cluster = [];
            const value = matrix[x][y];

            while (stack.length > 0) {
                const [curX, curY] = stack.pop();
                if (visited[curX][curY]) continue;

                visited[curX][curY] = true;
                cluster.push([curX, curY]);

                for (const [dx, dy] of directions) {
                    const nx = curX + dx;
                    const ny = curY + dy;
                    if (nx >= 0 && nx < matrix.length && ny >= 0 && ny < matrix[0].length && !visited[nx][ny] && matrix[nx][ny] === value) {
                        stack.push([nx, ny]);
                    }
                }
            }
            return cluster;
        }

        function findClicks(matrix) {
            const visited = Array.from({ length: matrix.length }, () => Array(matrix[0].length).fill(false));
            const clicks = [];

            for (let x = 0; x < matrix.length; x++) {
                for (let y = 0; y < matrix[0].length; y++) {
                    if (matrix[x][y] !== 0n && !visited[x][y]) {
                        const cluster = findCluster(matrix, x, y, visited);
                        if (cluster.length >= 2) {
                            clicks.push(...cluster);
                        }
                    }
                }
            }
            return clicks;
        }

        function applyGravity(matrix) {
            for (let col = 0; col < matrix[0].length; col++) {
                // Collect all non-zero values in the column
                const columnItems = [];
                for (let row = 0; row < matrix.length; row++) {
                    if (matrix[row][col] !== 0n) {
                        columnItems.push(matrix[row][col]);
                    }
                }

                // Fill the column from bottom to top
                let row = matrix.length - 1;
                for (let item of columnItems) {
                    matrix[row][col] = item;
                    row--;
                }

                // Set remaining top cells in the column to empty
                while (row >= 0) {
                    matrix[row][col] = 0n;
                    row--;
                }
            }
        }

        async function popit(matrix) {
            let clicks;
            let isChanged;

            do {


                clicks = findClicks(matrix);
                isChanged = clicks.length > 0;

                if (isChanged) {
                    // Clear the clicked items
                    // clicks.forEach(([x, y]) => {
                    //     matrix[x][y] = 0n;
                    // });


                    for (const [x, y] of clicks) {
                        
                        if (isGameOver(tcmPopStarRecord)) {
                            YeomenAI.statusMessage("Game over! Thanks for playing. Try again to beat your high score!");
                            YeomenAI.exit(0);
                            return; // Exits the entire function or loop
                        }

                        params = {
                            "for_player": playerAddress,
                            "for_app": "popCraft",
                            "position": { "x": tcmPopStarRecord.x + x, "y": tcmPopStarRecord.y + y },
                            "color": "#ffffff"
                        };
                        console.log(params)

                        try {

                            await YeomenAI.estimateContractGas('pop', [params], PopSystemId);
                            try {

                                YeomenAI.statusMessage(`Trigger pop at {x:${params.position.x}, y:${params.position.y}}`);
                                // Await the transaction for each cleared item
                                await YeomenAI.sendTransaction('pop', [params], PopSystemId);
                                YeomenAI.statusMessage(`Successfully trigerred pop at {x:${params.position.x}, y:${params.position.y}}`, YeomenAI.MESSAGE_TYPES.SUCCESS);


                                matrix[x][y] = 0n;  // Clear the clicked item by setting the matrix position to 0n
                            } catch (err) {
                                YeomenAI.statusMessage(`Failed to trigger pop at {x:${params.position.x}, y:${params.position.y}}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                            }
                        } catch (err) {
                            console.log(JSON.stringify(err))
                        }
                    }


                    // Apply gravity to make the items fall
                    applyGravity(matrix);
                }
            } while (isChanged);

            return matrix;
        }

        const finalMatrix = await popit(matrix);
        console.log('finalMatrix', finalMatrix)


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
