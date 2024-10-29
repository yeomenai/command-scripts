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

            YeomenAI.statusMessage(`Searching for ores within radius ${radius}`);
            let allOresBlocks = [];
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
                    let oresBlocks = blocks.filter(b => objectTypeIds.includes(b.block));
                    for (let oreBlock of oresBlocks) {
                        const distance = Math.sqrt(
                            Math.pow(oreBlock.x - currentPositionCoord.x, 2) +
                            Math.pow(oreBlock.y - currentPositionCoord.y, 2) +
                            Math.pow(oreBlock.z - currentPositionCoord.z, 2)
                        );
                        oreBlock.distance = distance
                    }
                    //console.log(oresBlocks)
                    allOresBlocks = [...allOresBlocks, ...oresBlocks];
                }
            }

            // for (let x = currentPositionCoord.x - radius; x <= currentPositionCoord.x + radius; x++) {
            //     for (let z = currentPositionCoord.z - radius; z <= currentPositionCoord.z + radius; z++) {
            //         let coord = { x, y: currentPositionCoord.y, z };
            //         YeomenAI.statusMessage(`Checking coordinates: ${JSON.stringify(coord)}`);
            //         const blocks = await BiomesYeomen.getBlocks(coord);
            //         //console.log(blocks)

            //         // Check if any block in the current coordinate matches the ores types
            //         let oresBlocks = blocks.filter(b => objectTypeIds.includes(b.block));
            //         for (let oreBlock of oresBlocks) {
            //             const distance = Math.sqrt(
            //                 Math.pow(oreBlock.x - currentPositionCoord.x, 2) +
            //                 Math.pow(oreBlock.y - currentPositionCoord.y, 2) +
            //                 Math.pow(oreBlock.z - currentPositionCoord.z, 2)
            //             );
            //             oreBlock.distance = distance
            //         }
            //         //console.log(oresBlocks)
            //         allOresBlocks = [...allOresBlocks, ...oresBlocks];
            //     }
            // }

            // Sort all ores by distance
            allOresBlocks.sort((a, b) => a.distance - b.distance);

            console.log(allOresBlocks)

            await YeomenAI.markdown(null);

            let markdown = `#### Ores\n`;
            markdown += `| Coordinates         | Ore  |\n`;
            markdown += `|---------------------|------|\n`;

            for (let oresBlock of allOresBlocks) {
                const oreType = Object.keys(BiomesYeomen.ObjectTypes).find(key => BiomesYeomen.ObjectTypes[key] === oresBlock.block) || "Unknown";
                markdown += `| { x: ${oresBlock.x}, y: ${oresBlock.y}, z: ${oresBlock.z} } | ${oreType} |\n`;
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