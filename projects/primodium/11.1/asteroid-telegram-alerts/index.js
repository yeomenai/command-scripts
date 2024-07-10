const asteroidEntity = formFields['asteroidEntity'];
const alertOnAttack = formFields['alertOnAttack'];

const simulateGame = async () => {
    try {
        YeomenAI.statusMessage('Running code script started');
		
		//YeomenAI.telegramAlert(`Your asteroid is being attacked`);	
		
		if(alertOnAttack){
			console.log('yes attack')
			YeomenAI.getQuerySubscription(`
				subscription GetAsteroidBattleResultSubscription {
				  ${PrimodiumYeomen.SCHEMA}pri_11__battle_result(where: {asteroid_entity: {_eq: "${asteroidEntity}"}}) {            
					battle_entity
					aggressor_entity
					aggressor_damage
					target_entity
					target_damage
					winner_entity
					asteroid_entity
					player_entity
					target_player_entity
					timestamp
					aggressor_allies
					target_allies
				  }
				}`).subscribe({
				next: async (result) => {
					console.log('inside Subscription result:', result);   
					const battleResult = result[`${PrimodiumYeomen.SCHEMA}pri_11__battle_result`][0] || null;
					
					if (battleResult) {
                        // Parse the timestamp and calculate the difference from now
                        const battleTimestamp = new Date(battleResult.timestamp).getTime();
                        const currentTimestamp = new Date().getTime();
                        const timeDifference = currentTimestamp - battleTimestamp;

                        // Check if the time difference is within 2 minutes (2 * 60 * 1000 milliseconds)
                        if (timeDifference <= 2 * 60 * 1000) {
                            YeomenAI.telegramAlert(`Your asteroid is being attacked`);	
                        }
                    }
					
				},
				error: (error) => {
					console.error('inside Subscription error:', error);
					
				},
			});
		}

	   
	   //YeomenAI.exit(0);
    } catch (err) {
        console.error('Error in simulateGame:', err);
        YeomenAI.statusMessage('Running code script failed');
        YeomenAI.exit(1);
    }
};

// Call the simulateGame function
simulateGame();
