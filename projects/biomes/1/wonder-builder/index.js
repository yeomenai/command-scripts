importScripts(`${self.location.origin}/projects/biomes/1/services.js`);


const MineSystemId = BiomesYeomen.SYSTEMS.MineSystemId;
const BuildSystemId = BiomesYeomen.SYSTEMS.BuildSystemId;
const PlayerLoginSystemId = BiomesYeomen.SYSTEMS.PlayerLoginSystemId;

const buildStartPositionCoord = formFields['buildStartPositionCoord'];
const buildingId = formFields['buildingId'];

const useColoredObjects = formFields['useColoredObjects'];

const materialOptions = [
    'BLUE_COTTON',
    'BROWN_COTTON',
    'GREEN_COTTON',
    'MAGENTA_COTTON',
    'ORANGE_COTTON',
    'PINK_COTTON',
    'PURPLE_COTTON',
    'RED_COTTON',
    'TAN_COTTON',
    'WHITE_COTTON',
    'YELLOW_COTTON',
    'BLACK_COTTON',
    'SILVER_COTTON'
];

// Function to find the closest color
function findClosestColor(inputColor) {
    let inputRgb;
    // Define the color list
    const colorList = {
        green: [0, 255, 0],      // RGB for green
        red: [255, 0, 0],        // RGB for red
        blue: [0, 0, 255],       // RGB for blue
        yellow: [255, 255, 0],   // RGB for yellow
        brown: [139, 69, 19],    // RGB for brown
        magenta: [255, 0, 255],  // RGB for magenta
        orange: [255, 165, 0],   // RGB for orange
        pink: [255, 192, 203],   // RGB for pink
        purple: [128, 0, 128],   // RGB for purple
        tan: [210, 180, 140],    // RGB for tan
        white: [255, 255, 255],  // RGB for white
        black: [0, 0, 0],        // RGB for black
        silver: [192, 192, 192]  // RGB for silver
    };

    // Function to convert HEX to RGB
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;

        if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }

        return [r, g, b];
    }

    // Function to convert RGB string to an array
    function rgbToRgbArray(rgb) {
        const matches = rgb.match(/\d+/g);
        return matches ? matches.map(Number) : null;
    }

    // Function to calculate Euclidean distance between two RGB colors
    function calculateDistance(color1, color2) {
        const rDiff = color1[0] - color2[0];
        const gDiff = color1[1] - color2[1];
        const bDiff = color1[2] - color2[2];
        return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    }

    // Determine if the input is in HEX or RGB format
    if (inputColor.startsWith('#')) {
        inputRgb = hexToRgb(inputColor);
    } else if (inputColor.startsWith('rgb')) {
        inputRgb = rgbToRgbArray(inputColor);
    }

    // Find the closest color in the list
    let closestColor = null;
    let smallestDistance = Infinity;
    for (let [colorName, colorRgb] of Object.entries(colorList)) {
        const distance = calculateDistance(inputRgb, colorRgb);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestColor = colorName;
        }
    }

    return closestColor;
}


const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');

            if (!buildingId) {
                YeomenAI.statusMessage('Building Id required', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

            if (!buildStartPositionCoord) {
                YeomenAI.statusMessage('Start position to create building required', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }
            try {
                importScripts(`https://www.grabcraft.com/js/RenderObject/myRenderObject_${buildingId}.js`);
            } catch (err) {
                YeomenAI.statusMessage('Unable to get the building prototype.', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;

            }

            if (!myRenderObject) {
                YeomenAI.statusMessage('Unable to get the building prototype.', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }


            let stats = {
                levels: 0,
                blocks: 0,
                buildBlocks: 0,
                skippedBlocks: 0,
                failedBlocks: 0,
                remainingBlocks: 0,
                currentLevel: 0,
                currentBuildPosition: null,
                startTime: new Date().getTime(),
                endTime: new Date().getTime(),
                failedBlocksList: [],
                buildingMaterials: []
            };
            await displayStats();

            let buildingMaterials = {};
            //generating stats
            for (const level in myRenderObject) {
                stats.levels++;
                for (const coordX in myRenderObject[level]) {
                    for (const coordY in myRenderObject[level][coordX]) {
                        const coord = myRenderObject[level][coordX][coordY];
                        stats.buildingMaterials[coord.name] = (stats.buildingMaterials[coord.name] ?? 0) + 1;

                        stats.blocks++;
                    }
                }
            }

            // Sort buildingMaterials by value in descending order
            stats.buildingMaterials = Object.fromEntries(
                Object.entries(stats.buildingMaterials).sort(([, a], [, b]) => b - a)
            )

            await displayStats();

            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;
            const playerRecord = await BiomesYeomen.getPlayerRecord(ethers.utils.hexZeroPad(playerAddress, 32));
            if (!playerRecord || playerRecord?.entityId == '0x0000000000000000000000000000000000000000000000000000000000000000') {
                YeomenAI.statusMessage('Player not found. Please ensure the delegator is set for session signing and verify that the address is correct.', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }
            const playerEntityId = playerRecord.entityId;

            let currentPositionCoord = await getPlayerCurrentPosition();

            if (!currentPositionCoord) {
                YeomenAI.statusMessage('Player position not found', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }


            await loginPlayer();

            //Prompt user for colors
            let materialMappingsData = await YeomenAI.getStorageItem('materialMappingsData') || {};
            if (useColoredObjects) {
                materialMappingsData = await YeomenAI.prompt([
                    ...Object.keys(stats.buildingMaterials).map((materialName) => ({
                        type: 'select',
                        id: materialName,
                        label: materialName,
                        placeholder: "Select mapping",
                        required: false,
                        options: materialOptions,
                        value: materialMappingsData[materialName] || null
                    })),
                    {
                        type: 'submit',
                        id: 'setMappings',
                        label: 'Set Mappings'
                    }
                ]);

                console.log(materialMappingsData)
                await YeomenAI.setStorageItem('materialMappingsData', materialMappingsData);
            }


            for (const level in myRenderObject) {
                for (const coordX in myRenderObject[level]) {
                    for (const coordY in myRenderObject[level][coordX]) {
                        try {
                            const coord = myRenderObject[level][coordX][coordY];
                            let objectId = 41;//Gravel   
                            if (useColoredObjects) {
                                const closestColor = findClosestColor(coord.hex);
                                const mappingColorObjectType = materialMappingsData[coord.name] || null;

                                let colorObjectType;
                                if (mappingColorObjectType) {
                                    colorObjectType = mappingColorObjectType;
                                } else if (closestColor) {
                                    colorObjectType = `${closestColor.toUpperCase()}_COTTON`;
                                }

                                if (colorObjectType) {
                                    const colorObjectTypeId = BiomesYeomen.ObjectTypes[colorObjectType];
                                    const inventoryCountRecord = await BiomesYeomen.getInventoryCountRecord(playerEntityId, ethers.utils.hexZeroPad(colorObjectTypeId, 32));
                                    console.log(coord.name, coord.hex, coord.rgb, closestColor, mappingColorObjectType, colorObjectTypeId, inventoryCountRecord)
                                    if (inventoryCountRecord && inventoryCountRecord.count > 0) {
                                        objectId = colorObjectTypeId;
                                    }

                                }
                            }

                            let buildPositionCoord = { x: parseInt(buildStartPositionCoord.x) + parseInt(coord.x), y: parseInt(buildStartPositionCoord.y) + parseInt(coord.y), z: parseInt(buildStartPositionCoord.z) + parseInt(coord.z) }

                            stats.currentLevel = level;
                            stats.currentBuildPosition = buildPositionCoord;
                            await displayStats();

                            let chainBlock = await BiomesYeomen.getChainBlock(buildPositionCoord.x, buildPositionCoord.y, buildPositionCoord.z);
                            console.log(chainBlock)
                            console.log(buildPositionCoord)

                            if (chainBlock && chainBlock == objectId) {
                                stats.skippedBlocks++;
                                await displayStats();
                                YeomenAI.statusMessage(`Build exists, skipping at Level ${level}, Coord { x: ${coord.x}, y: ${coord.y}, z: ${coord.z} }`, YeomenAI.MESSAGE_TYPES.INFO);
                                continue;
                            } else if (chainBlock && chainBlock != 0) {
                                await demolish(level, objectId, buildPositionCoord)
                            }


                            await build(level, objectId, buildPositionCoord);
                        } catch (err) {
                            throw err;
                        }


                    }
                }

            }


            async function getPlayerCurrentPosition() {
                let currentPositionCoord = null;
                const positionRecord = await BiomesYeomen.getPositionRecord(playerEntityId);
                console.log('positionRecord', positionRecord);
                if (positionRecord && (positionRecord.x !== 0 || positionRecord.y !== 0 || positionRecord.z !== 0)) {
                    currentPositionCoord = { x: positionRecord.x, y: positionRecord.y, z: positionRecord.z };
                }

                const lastKnownPositionRecord = await BiomesYeomen.getLastKnownPositionRecord(playerEntityId);
                console.log('lastKnownPositionRecord', lastKnownPositionRecord);
                if (lastKnownPositionRecord && (lastKnownPositionRecord.x !== 0 || lastKnownPositionRecord.y !== 0 || lastKnownPositionRecord.z !== 0)) {
                    currentPositionCoord = { x: lastKnownPositionRecord.x, y: lastKnownPositionRecord.y, z: lastKnownPositionRecord.z };
                }

                return currentPositionCoord;
            }


            async function loginPlayer() {
                //Login player
                try {

                    await YeomenAI.estimateContractGas('loginPlayer', [currentPositionCoord], PlayerLoginSystemId);
                    try {
                        YeomenAI.statusMessage(`Start loginPlayer`);
                        await YeomenAI.sendTransaction('loginPlayer', [currentPositionCoord], PlayerLoginSystemId);
                        YeomenAI.statusMessage(`Successfully loginPlayer`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to loginPlayer: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    }
                } catch (err) {
                    //YeomenAI.statusMessage('Player not loggedin', YeomenAI.MESSAGE_TYPES.ERROR);
                    //YeomenAI.exit(1);
                    //return;
                }
            }

            async function build(level, objectId, coord) {
                //Build
                try {
                    await YeomenAI.estimateContractGas('build', [objectId, coord, "0x"], BuildSystemId);
                } catch (err) {
                    const reason = err.message.match(/The contract function.*reverted with the following reason:\s([^\n]+)/);
                    stats.failedBlocksList.push([level, objectId, coord, reason ? reason[1] : '']);
                    stats.failedBlocks++;
                    await displayStats();
                    YeomenAI.statusMessage(`Build failed at Level ${level}, Coord { x: ${coord.x}, y: ${coord.y}, z: ${coord.z} }: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    console.log(JSON.stringify(err))
                    //throw err
                    return;
                }
                try {
                    YeomenAI.statusMessage(`Build at Level ${level}, Coord { x: ${coord.x}, y: ${coord.y}, z: ${coord.z} }`);
                    await YeomenAI.sendTransaction('build', [objectId, coord, "0x"], BuildSystemId);
                    YeomenAI.statusMessage(`Build success at Level ${level}, Coord { x: ${coord.x}, y: ${coord.y}, z: ${coord.z} }`);
                    stats.buildBlocks++;
                    await displayStats();
                    await YeomenAI.delay(2);
                    await BiomesYeomen.syncTerrains([[coord.x, coord.y, coord.z]]);
                    await BiomesYeomen.syncPlayer(playerAddress);
                    await YeomenAI.delay(2);
                } catch (err) {
                    const reason = errorMessage.match(/execution reverted:\s([^\n]+)/);
                    stats.failedBlocksList.push([level, objectId, coord, reason ? reason[1] : '']);
                    stats.failedBlocks++;
                    await displayStats();
                    YeomenAI.statusMessage(`Build failed at Level ${level}, Coord { x: ${coord.x}, y: ${coord.y}, z: ${coord.z} }: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                    console.log(JSON.stringify(err))
                    //throw err;
                }

            }

            async function demolish(level, objectId, coord) {
                try {
                    await YeomenAI.estimateContractGas('mine', [coord], MineSystemId);
                    try {

                        YeomenAI.statusMessage(`Demolishing at { x: ${coord.x}, y: ${coord.y}, z: ${coord.z} } to rebuild`);

                        await YeomenAI.sendTransaction('mine', [coord], MineSystemId);

                        YeomenAI.statusMessage(`Successfully demolished at { x: ${coord.x}, y: ${coord.y}, z: ${coord.z} } to rebuild`, YeomenAI.MESSAGE_TYPES.SUCCESS);

                        await YeomenAI.delay(2);
                        await BiomesYeomen.syncTerrains([[coord.x, coord.y, coord.z]]);
                        await BiomesYeomen.syncPlayer(playerAddress);
                        await YeomenAI.delay(2);
                    } catch (err) {
                        YeomenAI.statusMessage(`Failed to demolish: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                        throw err;
                    }
                } catch (err) {
                    console.log(JSON.stringify(err))
                    //throw err
                }
            }



            async function displayStats() {
                // Ensure endTime is set to the current time
                stats.endTime = new Date().getTime();

                stats.remainingBlocks = stats.blocks - stats.buildBlocks - stats.failedBlocks - stats.skippedBlocks;

                console.log(stats);

                // Initialize markdown content
                let markdown = ``;

                markdown += `\n#### Wonder building stats\n`;
                markdown += `|                            |       |                                              |\n`;
                markdown += `|----------------------------|-------|----------------------------------------------|\n`;
                markdown += `| Levels                     |       |            ${stats.levels || 0}             |\n`;
                markdown += `| Blocks                     |       |            ${stats.blocks || 0}             |\n`;
                markdown += `| Blocks built               |       |            ${stats.buildBlocks || 0}        |\n`;
                markdown += `| Blocks failed              |       |            ${stats.failedBlocks || 0}        |\n`;
                markdown += `| Blocks skipped             |       |            ${stats.skippedBlocks || 0}      |\n`;
                markdown += `| Blocks remaining           |       |            ${stats.remainingBlocks || 0}      |\n`;
                markdown += `| Current Level              |       |            ${stats.currentLevel || 0}       |\n`;
                markdown += `| Current Build Position     |       |  ${stats.currentBuildPosition ? `x: ${stats.currentBuildPosition.x}, y: ${stats.currentBuildPosition.y}, z: ${stats.currentBuildPosition.z}` : 'N/A'} |\n`;

                // Calculate total time in seconds, with default to avoid errors
                const totalTimeInSeconds = stats.startTime
                    ? Math.floor((stats.endTime - stats.startTime) / 1000)
                    : 0;
                markdown += `| Total Time (s)             |       |            ${totalTimeInSeconds}            |\n`;

                if (stats.remainingBlocks > 0) {
                    markdown += `| Status             |       |            IN PROGRESS              |\n`;
                } else if ((stats.buildBlocks + stats.skippedBlocks === stats.blocks) && stats.failedBlocks === 0) {
                    markdown += `| Status             |       |            COMPLETED            |\n`;
                } else {
                    markdown += `| Status             |       |            NOT COMPLETED        |\n`;
                }

                if (stats.failedBlocksList.length > 0) {
                    markdown += `\n#### Build failed at\n`;
                    markdown += `| Level |       | Object ID |       | Coordinates       |       | Coordinates       |\n`;
                    markdown += `|-------|-------|-----------|-------|-------------------|-------|-------------------|\n`;

                    const latestFailedBlocksList = stats.failedBlocksList.slice(-10);
                    latestFailedBlocksList.forEach(([level, objectId, coord, reason]) => {
                        markdown += `| ${level} |       | ${objectId} |       | x: ${coord.x}, y: ${coord.y}, z: ${coord.z} |       | ${reason} |\n`;
                    });
                }
                // Display the markdown through YeomenAI
                await YeomenAI.markdown(markdown);
            }

            //Check if building is completed
            if ((stats.buildBlocks + stats.skippedBlocks === stats.blocks) && stats.failedBlocks === 0) {
                YeomenAI.statusMessage('Building completed successfully!', YeomenAI.MESSAGE_TYPES.SUCCESS);
                YeomenAI.exit(0);
            } else {
                YeomenAI.statusMessage(`Building not completed: ${stats.failedBlocks} block(s) failed`, YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
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
