const param1 = parseFloat(formFields['param1']);
const param2 = parseInt(formFields['param2']);

const simulateGame = async () => {
    do {
        try {
            YeomenAI.statusMessage('Running code script started');
                       

           
                try {
                    YeomenAI.statusMessage(`Sample Action`);
                    await YeomenAI.sendTransaction('executeTyped', [param1, param2]);
                    YeomenAI.statusMessage(`Successfully executed sample action `, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    break;
                } catch (err) {
                    YeomenAI.statusMessage(`Failed sample action: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                }
          

        } catch (err) {
            console.log(err)
            YeomenAI.statusMessage('Running code script failed', YeomenAI.MESSAGE_TYPES.ERROR);
            YeomenAI.exit(1);
        }
    } while (false);
};

// Call the simulateGame function
simulateGame();   