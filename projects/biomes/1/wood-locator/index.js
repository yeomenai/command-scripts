importScripts(`${self.location.origin}/projects/biomes/1/services.js`);


const objectTypes = formFields['objectTypes'];
const objectTypeIds = objectTypes.map((objectType) => BiomesYeomen.ObjectTypes[objectType] || 0);

const radius = parseInt(formFields['radius']);

const simulateGame = async () => {
    do {
        try {

            YeomenAI.statusMessage('Running code script started');



            const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;

            const playerRecord = await BiomesYeomen.getPlayerRecord(ethers.utils.hexZeroPad(playerAddress, 32));
            const playerEntityId = playerRecord.entityId;

            let currentPositionCoord = null;


            const positionRecord = await BiomesYeomen.getPositionRecord(playerEntityId);
            console.log('positionRecord', positionRecord)
            if (positionRecord && positionRecord.x != 0 && positionRecord.y != 0 && positionRecord.z != 0) {
                currentPositionCoord = { x: positionRecord.x, y: positionRecord.y, z: positionRecord.z };
            }

            const lastKnownPositionRecord = await BiomesYeomen.getLastKnownPositionRecord(playerEntityId);
            console.log('lastKnownPositionRecord', lastKnownPositionRecord)
            if (lastKnownPositionRecord && lastKnownPositionRecord.x != 0 && lastKnownPositionRecord.y != 0 && lastKnownPositionRecord.z != 0) {
                currentPositionCoord = { x: lastKnownPositionRecord.x, y: lastKnownPositionRecord.y, z: lastKnownPositionRecord.z };
            }

            if (!currentPositionCoord) {
                YeomenAI.statusMessage('Player position not found', YeomenAI.MESSAGE_TYPES.ERROR);
                YeomenAI.exit(1);
                return;
            }

            YeomenAI.statusMessage(`Searching for wood within radius ${radius}`);
            let allObjectsBlocks = [];
            let rangeStartCoord = { x: currentPositionCoord.x - radius, y: currentPositionCoord.y + 1000, z: currentPositionCoord.z - radius };
            let rangeEndCoord = { x: currentPositionCoord.x + radius, y: currentPositionCoord.y + 1000, z: currentPositionCoord.z + radius };
            let rangeBlocks = await BiomesYeomen.generateRangeBlocks(rangeStartCoord, rangeEndCoord, 0);

            
            for (let x = rangeStartCoord.x; x <= rangeEndCoord.x; x++) {
                for (let z = rangeStartCoord.z; z <= rangeEndCoord.z; z++) {
                    let coord = { x, y: rangeStartCoord.y, z };
                    console.log(`Checking coordinates: ${JSON.stringify(coord)}`);
                    const blocks = await BiomesYeomen.getBlocksV2(coord.x, coord.y, coord.z, rangeBlocks);
                    //console.log(blocks)

                    // Check if any block in the current coordinate matches the ores types
                    let objectsBlocks = blocks.filter(b => objectTypeIds.includes(b.block));
                    for (let objectBlock of objectsBlocks) {
                        const distance = Math.sqrt(
                            Math.pow(objectBlock.x - currentPositionCoord.x, 2) +
                            Math.pow(objectBlock.y - currentPositionCoord.y, 2) +
                            Math.pow(objectBlock.z - currentPositionCoord.z, 2)
                        );
                        objectBlock.distance = distance
                    }
                    //console.log(objectsBlocks)
                    allObjectsBlocks = [...allObjectsBlocks, ...objectsBlocks];
                }
            }

          

            // Sort all ores by distance
            allObjectsBlocks.sort((a, b) => a.distance - b.distance);

            console.log(allObjectsBlocks)

            await YeomenAI.markdown(null);

            let markdown = `#### Wood\n`;
            markdown += `| Coordinates         | Wood  |\n`;
            markdown += `|---------------------|------|\n`;

            for (let objectsBlock of allObjectsBlocks) {
                const oreType = Object.keys(BiomesYeomen.ObjectTypes).find(key => BiomesYeomen.ObjectTypes[key] === objectsBlock.block) || "Unknown";
                markdown += `| { x: ${objectsBlock.x}, y: ${objectsBlock.y}, z: ${objectsBlock.z} } | ${oreType} |\n`;
            }

            await YeomenAI.markdown(markdown);


            YeomenAI.statusMessage('Running code script completed', YeomenAI.MESSAGE_TYPES.SUCCESS);
            YeomenAI.exit(0);
        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();   