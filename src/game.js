const readline = require('readline');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { gameMap, enemies, items } = require('./config/gameData');
const GameAnimator = require('./config/animations');

class AdventureGame {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

        //initiating player data
        this.player = {
            maxHealth: 100,
            health: 100,
            strength: 1,
            defense: 0,
            inventory: [],
            defeatedEnemies: [],
            enemiesDefeated: 0,
            currentRoom: 'start',
            hasWon: false,
            isDead: false,
            equippedItem: null,
            equippedArmor: null,
        }

        // initating game data
        this.gameMap = gameMap;
        this.enemies = enemies;
        this.items = items;

        //initating animations
        this.gameAnimator = new GameAnimator();

        this.roomsDirections = {
            'start': {
                north: 'north',
                east: 'east',
            },
            'north': {
                west: 'west',
                south: 'south'
            },
            'east': {
                west: 'west',
                south: 'south',
                previous: 'start',
            },
            'west': {
                door: 'treasure_room',
                previous: 'east',
            },
            south: {
                north: 'north',
                east: 'east',
            },
            'treasure_room': {
                north: 'forest',
                previous: 'west',
            },
            'mountain': {
                south: 'cave',
                previous: 'forest',
            },
            'forest': {
                up: 'mountain',
                previous: 'treasure_room',
            },
            'cave': {
                door: 'dragon_lair',
                previous: 'mountain',
            },
            'dragon_lair': {
                previous: 'cave',
            },
        }
    }

    async start() {

        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.bold.yellow('       Welcome To Veilspire: Shattered Legacy       '));
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log('You find yourself in a mysterious dungeon. Explore, find treasures, and defeat the ancient dragon!');
        await this.displayHelp();
        await this.displayRoom();
        this.gameLoop();
    }

    async gameLoop() {

        this.rl.on('line', async (input) => {
            const [command, ...args] = input.toLowerCase().split(' ');
            const target = args.join(' ');

            if (this.player.hasWon || this.player.isDead) {
                this.handleGameEnd();
                return;
            }

            switch (command) {
                case 'go':
                    await this.movePlayer(target);
                    break;
                case 'take':
                    await this.takeItem(target);
                    break;
                case 'use':
                    await this.itemUse(target);
                    break;
                case 'equip':
                    await this.equipItem(target);
                    break;
                case 'inventory':
                    await this.displayInventory();
                    break;
                case 'look':
                    await this.displayRoom();
                    break;
                case 'status':
                    await this.displayStatus();
                    break;
                case 'help':
                    await this.displayHelp();
                    break;
                case 'quit':
                    await this.handleGameExit();
                    break;
                default:
                    console.log(`Invalid command. Try: ${chalk.red('go')}, ${chalk.red('take')}, ${chalk.red('use')}, ${chalk.red('equip')}, ${chalk.red('inventory')}, ${chalk.red('look')}, ${chalk.red('status')}, ${chalk.red('quit')}`);
            }
        });
    };

    async movePlayer(direction) {
        try {

            const currentRoom = this.player.currentRoom;
            const connections = this.roomsDirections[currentRoom];

            if (!connections[direction]) {
                console.log("You can't go that way!");
                return;
            };

            if (this.player.currentRoom === direction) {
                console.log(chalk.red(`you're already in ${this.player.currentRoom}`))
            }

            const targetRoom = connections[direction];
            const roomData = this.gameMap[targetRoom];
            const enemyData = this.enemies[roomData.enemy];

            // check for locked doors
            if (roomData.locked) {

                if (targetRoom === 'treasure_room' && !this.player.inventory.includes('key')) {
                    console.log(chalk.red("The treasure room is locked! Find a key."));
                    return;
                }

                if (targetRoom === 'dragon_lair' && !this.player.inventory.includes('map')) {
                    console.log(chalk.red("You need the dragon map to enter the lair."));
                    return;
                }

                if (currentRoom === 'forest' && !this.player.inventory.includes('climbing_rope')) {
                    console.log(chalk.red("You need ropes to go up the mountain."));
                    return;
                }
            }

            // Handle special transitions
            if (currentRoom === 'cave' && direction === 'door') {
                if (!this.player.inventory.includes('map')) {
                    console.log(chalk.red("You need the dragon map to enter the lair."));
                    return;
                }
            }

            if (currentRoom === 'forest' && direction === 'up') {
                if (!this.player.inventory.includes('climbing_rope')) {
                    console.log(chalk.red("You need ropes to go up the mountain."));
                    return;
                }
            }

            if (currentRoom === 'start' && direction === 'west') {
                if (!this.player.inventory.includes('key')) {
                    console.log(chalk.red("You need a key to enter this room."));
                    return;
                }
            }

            if(currentRoom === 'west' && direction === 'door' || currentRoom === 'cave' && direction === 'door') {
                await this.gameAnimator.animateRoomTransition('door');
            }

            if(currentRoom === 'forest' && direction === 'up') {
                await this.gameAnimator.animateItemUse('climbing_rope');
                await this.gameAnimator.animateRoomTransition('up');
                await this.gameAnimator.animateEnvironment('mountain_climb');
                await this.gameAnimator.animateItemUse('climbing_confirmation');
            }

            if(currentRoom === 'cave' && direction === 'previous') {
                // When descending mountains
                await this.gameAnimator.animateRoomTransition('down');
                await this.gameAnimator.animateEnvironment('mountain_descent');
                await this.gameAnimator.animateItemUse('descending_confirmation');
            }

            // handle player movement
            this.player.currentRoom = targetRoom;
            await this.gameAnimator.animateCharacter(
                'player',
                'walk',
                'green',
                4,  // frames
                150 // speed
            );
            await this.gameAnimator.animateRoomTransition(direction);
            await this.displayRoom();

            // handle enemy encounters
            if (roomData.enemy) {
                
                const spawnEnemy = (room) => {
                    if (room.enemy && !room.enemyInstance) {
                        room.enemyInstance = structuredClone(this.enemies[room.enemy]);
                    }
                };
                
                // Capture target room reference to avoid race conditions
                const targetRoomRef = this.gameMap[targetRoom];
                setTimeout(async () => {
                    spawnEnemy(targetRoomRef); // Spawn in the target room
                    await this.startCombat(targetRoomRef.enemy); // Pass enemy type
                }, 15000);

                console.log(`\nBEWARE ${chalk.red.italic(enemyData.name)} LIES HERE!,\nYOU GOT ${chalk.red.italic('15 SECONDS')} TO EQUIP YOUR GEAR !`);
            }

        } catch (error) {
            console.log(chalk.red(`failed to move player: ${error.message}`));
            console.log(chalk.grey(`${error.stack}`))
        }
    }

    async displayRoom() {
        try {
            const room = this.gameMap[this.player.currentRoom];
            const connections = this.roomsDirections[this.player.currentRoom];

            if (!connections) {
                throw new Error(`No exits found for room: ${this.player.currentRoom}`);
            }

            const enemyData = room.enemy ? this.enemies[room.enemy] : null;

            // Animate environment first
            await this.gameAnimator.animateEnvironment(room.name);

            console.log(`\n${chalk.white.bold(`Location: ${room.name}`)}`);
            console.log(`\n${chalk.cyanBright.italic(room.description)}`);

            // Process exits with validation
            const exitLists = Object.entries(connections).map(([direction, targetRoom]) => {
                if (!this.gameMap[targetRoom]) {
                    console.error(chalk.red(`Invalid connection: ${targetRoom} from ${this.player.currentRoom}`));
                    return `${direction} → (Invalid Destination)`;
                }
                return `${direction.padEnd(6)}`;
            });

            console.log(chalk.hex('ffe5db')(`\nAvailable Exits:\n${exitLists.join('\n')}`));

            // Display items
            if (room.items?.length > 0) {
                console.log(chalk.yellow(`\nItems here:`) +
                    `\n${room.items.map(item => `- ${this.items[item].name || item}`).join('\n')}`);
            }

            // Display enemy info
            if (room.enemyInstance) {
                console.log(`\n${chalk.red('! DANGER !')} ${chalk.red(enemyData.name)} lurks here!`);
                console.log(`${chalk.red('Enemy Health:')} ${enemyData.health}`);
            }

        } catch (error) {
            console.error(chalk.red(`Room display error: ${error.message}`));
            console.error(chalk.grey(`Stack: ${error.stack}`));
        }
    }

    async displayInventory() {
        try {
            console.log(chalk.yellow.bold("Equipped:"));
            console.log(`Weapon: ${this.items[this.player.equippedItem]?.name || "None"}`);
            console.log(`Armor: ${this.items[this.player.equippedArmor]?.name || "None"}\n`);
            console.log(chalk.yellow.bold("Items:"));
            this.player.inventory.forEach(item =>
                console.log(`- ${this.items[item]?.name || item}`)
            );
        } catch (error) {
            console.log(chalk.red(`Inventory display failed: ${error.message}`));
            console.log(chalk.grey(`${error.stack}`));
        }
    }

    async takeItem(item) {
        try {

            const room = this.gameMap[this.player.currentRoom];

            // Find the item codename that matches the input name
            const itemEntry = Object.entries(this.items).find(
                ([codeName, itemData]) => itemData.name.toLowerCase() === item.toLowerCase()
            );

            if (!itemEntry) {
                console.log(chalk.red('There is no such item here!'));
                return;
            }

            const [itemCodename, itemData] = itemEntry;

            if (!room.items.includes(itemCodename)) {
                console.log(chalk.red('There is no such item here!'));
                return;
            }

            // Remove from room and add to inventory
            room.items = room.items.filter((i) => i !== itemCodename);
            this.player.inventory.push(itemCodename);
            console.log(chalk.green(`You picked up ${itemData.name}!\n${chalk.italic(itemData.description)}`));

        } catch (error) {
            console.log(chalk.red(`Item take failed: ${error.message}`));
            console.log(chalk.grey(`${error.stack}`));
        }
    }

    async equipItem(item) {

        // Find the item codename that matches the input name
        const itemEntry = Object.entries(this.items).find(
            ([codeName, itemData]) => itemData.name.toLowerCase() === item.toLowerCase()
        );

        if (!itemEntry || !item) {
            console.log(chalk.red(`No Such item: ${item}`));
            return;
        }

        const [itemCodename, itemData] = itemEntry;


        if (!this.player.inventory.includes(itemCodename)) {
            console.log(chalk.red.italic(`You don't have ${itemData.name} in your inventory!`));
            return;
        }

        if (itemCodename === this.player.equippedItem || itemCodename === this.player.equippedArmor) {
            console.log(chalk.magenta.italic(`${itemData.name} is already equipped`));
            return false;
        }

        const weaponTypes = {
            sword: 'sword',
            axe: 'axe',
            bow: 'bow',
            dagger: 'dagger',
            staff: 'staff',
            shield: 'shield',
            armor: 'armor',
        };

        try {
            // Animate based on weapon type
            const animType = weaponTypes[itemData.type] || itemEntry[0];
            await this.gameAnimator.animateEquipItem(animType);

            // Handle stats
            if (itemData.damage) {
                this.player.equippedItem = itemCodename
                this.player.strength += itemData.damage;
                console.log(chalk.yellow.bold(`Equipped ${itemData.name} (+${itemData.damage} damage)`));
            }
            if (itemData.magic) {
                this.player.magicPower = (this.player.magicPower || 0) + itemData.magic;
                console.log(chalk.blue.bold(`Equipped ${itemData.name} (+${itemData.magic} magic)`));
            }
            if (itemData.type === 'shield' || itemData.type === 'armor') {
                this.player.equippedArmor = itemCodename;
                this.player.defense += itemData.defense;
                console.log(chalk.cyan.bold(`Equipped ${itemData.name} (+${itemData.defense} defense)`));
            }

            if (itemData.type === 'healing' || itemData.type === 'miscellaneous') {
                console.log(chalk.magenta.italic(`You can't equip ${itemData.name}, maybe try using it instead`));
                return;
            }

            if (itemData.type === 'miscellaneous') {
                console.log(chalk.magenta.italic(`You can't equip this item: ${itemData.name}, maybe try using it instead`));
            }


        } catch (error) {
            console.log(chalk.red(`Failed to equip ${itemData.name}: ${error.message}`));
            console.log(chalk.red(`${error.stack}`));
        }
    }

    async itemUse(item) {

        let shouldConsume = false;

        // Find the item codename that matches the input name
        const itemEntry = Object.entries(this.items).find(
            ([codeName, itemData]) => itemData.name.toLowerCase() === item.toLowerCase()
        );

        if (!itemEntry || !item) {
            console.log(chalk.red.italic(`No such item: ${item}, try rechecking your spelling or remove _`));
            return;
        }

        const [itemCodename, itemData] = itemEntry;


        if (!this.player.inventory.includes(itemCodename)) {
            console.log(chalk.red(`You don't have ${itemData.name} in your inventory!`));
            return;
        }


        if (!this.player.inventory.includes(itemCodename)) {
            console.log(chalk.red(`You don't have ${itemData.name} in your inventory!`));
            return;
        }

        try {

            await this.gameAnimator.animateItemUse(itemCodename);
            if (itemData.use) {
                shouldConsume = itemData.use.call({
                    player: this.player,
                    gameMap: this.gameMap,
                    animator: this.gameAnimator,
                    items: this.items
                });
            }

            if (shouldConsume) {
                this.player.inventory = this.player.inventory.filter((i) => i !== item);
                console.log(chalk.yellow(`${item} was consumed!`));
            }

            if (!itemData.use) {
                console.log(chalk.red.italic(`${itemData.name} is not useable`));
                return;
            }

            // if(itemData.type === 'healing') {
            //     this.player.health = Math.min(this.player.maxHealth, this.player.health + itemData.healAmount);
            //     console.log(chalk.green(`You used ${itemData.name} and restored ${itemData.healAmount} health!`));
            // }

            // if(itemData.type === 'healing' && this.player.health === this.player.maxHealth) {
            //     console.log(chalk.red.italic(`You are already at full health!`));
            //     return;
            // }

        } catch (error) {
            console.log(chalk.red(`Failed to use ${itemData.name}: ${error.message}`));
            console.log(chalk.red(`${error.stack}`));
        }
    }

    async startCombat(enemyType) {
        try {
            const room = this.gameMap[this.player.currentRoom];
            const enemy = this.enemies[enemyType];

            if (!room.enemyInstance) {
                room.enemyInstance = structuredClone(enemy)
            }

            console.log(await this.gameAnimator.generateHealthBar(this.player.health, this.player.maxHealth));

            if (enemyType === 'dragon') {
                await this.gameAnimator.animateCutscene('dragon_intro');
            }

            //combat loop
            while (this.player.health > 0 && room.enemyInstance.health > 0) {
                // Player attack
                const playerDamage = Math.max(1, this.player.strength - room.enemyInstance.defense);
                room.enemyInstance.health = Math.max(0, room.enemyInstance.health - playerDamage);;

                await this.gameAnimator.animateBattle(this.player.equippedItem ? 'sword' : 'attack', enemyType, this.player.health, room.enemyInstance.health);

                console.log(chalk.yellow(`You hit the ${room.enemyInstance.name} for ${playerDamage} damage!`));
                await this.gameAnimator.animateDamage(playerDamage);

                if (room.enemyInstance.health <= 0) break;

                //enemy attack
                const attackType = this.getEnemyAttack(enemyType);
                const attackData = this.enemies[enemyType].attacks[attackType] || { damageMultiplier: 1 };
                const baseDamage = room.enemyInstance.damage * attackData.damageMultiplier;
                const enemyDamage = Math.max(1,
                    baseDamage - this.player.defense
                );

                //apply damage to player
                this.player.health = Math.max(0, this.player.health - enemyDamage);
                console.log(chalk.red(`${room.enemyInstance.name} hits you for ${enemyDamage} damage!`));
                await this.gameAnimator.animateDamage(enemyDamage);

                if (this.player.health <= 0) break;

                // Add flavor text
                const attackMessages = {
                    fireBreath: "The dragon unleashes fiery hell!",
                    tailSwipe: "The dragon's tail smashes into you!",
                    rockThrow: "The troll hurls a massive boulder!",
                    basic: "The enemy attacks!"
                };

                console.log(chalk.red(attackMessages[attackType] || attackMessages.basic));
            }

            // handle combat end
            if (this.player.health === 0) {
                await this.handleGameEnd();
            } else {
                await this.handleEnemyDefeat(enemyType);
            }

        } catch (error) {
            console.log(chalk.red(`Combat failed: ${error.message}`));
            console.log(chalk.red(`${error.stack}`));
        }
    }

    getEnemyAttack(enemyType) {
        try {
            const enemy = this.enemies[enemyType];
            const behaviors = enemy.behavior;
            const total = Object.values(behaviors).reduce((a, b) => a + b, 0);

            // Generate random attack
            let random = Math.random() * total;
            for (const [attackType, chance] of Object.entries(behaviors)) {
                if (random < chance) {
                    return attackType;
                }
                random -= chance;
            }
            return 'basic'; // Fallback

        } catch (error) {
            console.log(chalk.red(`Enemy Attack failed: ${error.message}`));
        }
    }

    async handleEnemyDefeat(enemyType) {
        try {
            const room = this.gameMap[this.player.currentRoom];

            // Validate enemy existence using instance
            const isValidDefeat = room.enemyInstance && room.enemyInstance.health <= 0;
            if (!isValidDefeat) {
                console.log(chalk.red('No defeated enemy to process!'));
                return;
            }

            // Process defeated enemy
            console.log(chalk.green(`\nYou defeated the ${room.enemyInstance.name}!`));
            await this.gameAnimator.animateVictory(enemyType);

            // Add drops if available
            if (room.enemyInstance.dropItems?.length > 0) {
                this.player.inventory.push(...room.enemyInstance.dropItems);
                console.log(chalk.green(`Loot obtained:\n- ${room.enemyInstance.dropItems.join('\n- ')}`));
            }

            // Update game state
            this.player.enemiesDefeated++;
            this.player.defeatedEnemies.push(enemyType);

            // Clear enemy instance from room
            room.enemyInstance = null;

            // Special victory cases
            if (enemyType.toLowerCase().includes('dragon')) {
                this.player.hasWon = true;
                console.log(chalk.yellow.bold('\nDRAGON VANQUISHED! The realm is saved!'));
                await this.gameAnimator.animateFinalVictory();
                await this.restartPrompt();
                return;
            }

            // General victory check
            if (this.checkAllEnemiesDefeated()) {
                console.log(chalk.yellow.bold('\nALL ENEMIES DEFEATED! Peace reigns!'));
            }

        } catch (error) {
            console.log(chalk.red(`Enemy defeat error: ${error.message}`));
            console.error(chalk.grey(error.stack));
        }
    }

    async handleGameEnd() {
        try {
            if (this.player.isDead) return;
    
            if (this.player.health === 0) {
                this.player.health = 0;
                this.player.isDead = true;
    
                console.log(chalk.red.bold('\nYou have been defeated...'));
                await this.gameAnimator.animatePlayerDeath();
                await this.restartPrompt();
                return;
            }
    
            // if (this.player.hasWon === true) {
            //     console.log(chalk.yellow.bold('\nCONGRATULATIONS! YOU HAVE WON!'));
            // }

            if (this.checkAllEnemiesDefeated()) {
                console.log(chalk.yellow.bold('\nAll enemies vanquished! Peace restored!'));
            }
            
        } catch (error) {
            console.log(chalk.red('failed to end the game'))
            console.log(chalk.grey(`${error.stack}`));
            this.handleForceExit();
        }
    }

    checkAllEnemiesDefeated() {
        return Object.values(this.gameMap).every(room =>
            !room.enemy ||  // If room has no enemy, it's automatically "cleared"
            (room.enemyInstance && room.enemyInstance.health <= 0) // Check instance health
        );
    }

    async restartPrompt() {
        try {
            const { end } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'end',
                    message: 'Game over! Play again?',
                    choices: ['Yes', 'No']
                }
            ]);

            if (end === 'Yes') {
                if (this.rl) {
                    this.rl.close();
                }
    
                // Create NEW interface instance
                this.rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                // Reset the game
                this.player = {
                    maxHealth: 100,
                    health: 100,
                    strength: 1,
                    defense: 0,
                    inventory: [],
                    enemiesDefeated: 0,
                    currentRoom: 'start',
                    hasWon: false,
                    isDead: false,
                    equippedItem: null,
                    equippedArmor: null,
                };

                 // Clear previous gameLoop listeners
                this.rl.removeAllListeners('line');

                await this.start();
                this.gameLoop();
            } else {
                await this.handleGameExit();
            }

        } catch (error) {
            console.log(chalk.red(`Failed to handle game end: ${error.message}`));
            this.handleForceExit(); // emergency exit
        }
    }

    async handleGameExit() {
        console.log(chalk.yellowBright(`
            ╔══════════════════════════════╗
            ║  Thanks for playing!         ║
            ║  GitHub:github.com/hamood268 ║
            ║   Discord: @ha268            ║
            ╚══════════════════════════════╝
            
            `));

        let countdown = 15;

        const quitInterval = setInterval(() => {
            console.log(chalk.cyan(
                `\nClosing in ${countdown}s - ` +
                `Follow for updates: ` +
                `GitHub: ${chalk.hex('#ffdb00')('github.com/hamood268')} | ` +
                `Discord: ${chalk.hex('#ffdb00')('@ha268')} | ` +
                `Support: ${chalk.hex('#ffdb00')('https://paypal.me/Mohammed0268')}`
            ));

            if (countdown-- <= 0) {
                clearInterval(quitInterval);
                console.log(chalk.green('\nStay awesome! Closing game...'));
                this.rl.close();
                process.exit();
            }
        }, 1000);
    }

    handleForceExit() {
        console.log(chalk.red('Emergency shutdown!'));
        console.log(chalk.yellowBright(`
            ╔══════════════════════════════╗
            ║  Thanks for playing!         ║
            ║  GitHub:github.com/hamood268 ║
            ║   Discord: @ha268            ║
            ╚══════════════════════════════╝
            
            `));
        let countdown = 15;

        const quitInterval = setInterval(() => {
            console.log(chalk.cyan(
                `\nClosing in ${countdown}s - ` +
                `Follow for updates: ` +
                `GitHub: ${chalk.hex('#ffdb00')('github.com/hamood268')} | ` +
                `Discord: ${chalk.hex('#ffdb00')('@ha268')} | ` +
                `Support: ${chalk.hex('#ffdb00')('https://paypal.me/Mohammed0268')}`
            ));

            if (countdown-- <= 0) {
                clearInterval(quitInterval);
                console.log(chalk.green('\nStay awesome! Closing game...'));
                this.rl.close();
                process.exit();
            }
        }, 1000);
    }

    async displayHelp() {
        console.log('\nCommands:');
        console.log(`  ${chalk.green.bold('go <direction>')} - Move in a direction`);
        console.log(`  ${chalk.green.bold('take <item>')} - Pick up an item`);
        console.log(`  ${chalk.green.bold('use <item>')} - Use an item from your inventory`);
        console.log(`  ${chalk.green.bold('equip <item>')} - Equip weapons/armor (swords, bows, axes, shields)`);
        console.log(`  ${chalk.green.bold('look')} - Look around the room`);
        console.log(`  ${chalk.green.bold('inventory')} - Show your inventory`);
        console.log(`  ${chalk.green.bold('status')} - Show your health and player stats`);
        console.log(`  ${chalk.green.bold('help')} - Show this help menu`);
        console.log(`  ${chalk.green.bold('quit')} - Quit the game`);
    }

    async displayStatus() {
        console.log(chalk.yellow.bold('\n─── Character Status ───'));
        console.log(`Health: ${this.player.health}/${this.player.maxHealth}`);
        console.log(`Strength: ${this.player.strength}`);
        console.log(`Defense: ${this.player.defense}`);
        console.log(`Enemies Defeated: ${this.player.enemiesDefeated}`);
        console.log(`Inventory: ${this.player.inventory.length} items`);
        console.log('Equipped:',
            chalk.hex('#d8d8d8')(this.items[this.player.equippedItem]?.name || 'None'), '/',
            chalk.blue(this.items[this.player.equippedArmor]?.name || 'None')
        );
        console.log(chalk.yellow('───────────────────────\n'));
    }
}

module.exports = AdventureGame;