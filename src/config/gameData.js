const chalk = require('chalk');

const gameMap = {
    start: {
        name: 'start',
        description: `A damp stone chamber lit by flickering torches. Carved runes on the walls ${chalk.yellow('glow faintly')} in the dim light.`,
        items: ['flashlight']
    },
    north: {
        name: 'north',
        description: 'You enter a cold chamber. There are doors to the south and west.',
        items: ['key']
    },
    east: {
        name: 'east',
        description: 'You find yourself in a library. There is a door to the west and a hidden passage to the south.',
        items: ['ancient_book']
    },
    west: {
        name: 'west',
        description: 'You discover a mysterious door, but it requires a key to enter. but there is a chest lying in the corner.',
        items: ['chest'],
    },
    south: {
        name: 'south',
        description: 'You enter a dark cavern. The air feels heavy. There is a door to the north and a mysterious tunnel to the east.',
        items: ['torch']
    },
    'treasure_room': {
        name: 'treasure room',
        description: 'A magnificent room filled with gold and jewels.',
        items: ['crown', 'golden_sword'],
        special: 'Congratulations! You found the royal treasures!',
        locked: true
    },
    'cave': {
        name: 'cave',
        description: 'A damp cave with strange glowing crystals. There is a passage back west and a dark tunnel to the south.',
        items: ['dragon_scale', 'dragon_tooth'],
        locked: true,
    },
    'dragon_lair': {
        name: "dragon's lair",
        description: 'A massive cavern with scorch marks... The legendary dragon rests here!',
        enemy: 'dragon',
        enemyInstance: null,
        items: ['bow', 'arrows'],
        locked: true
    },
    'forest': {
        name: 'forest',
        description: 'A lush green forest with sunlight filtering through the leaves. There is a path to the east and a dark cave to the west.',
        enemy: 'goblin',
        enemyInstance: null,
        items: ['berries', 'crystal'],
    },
    'mountain': {
        name: 'mountain',
        description: 'A rocky mountain path with a breathtaking view. There is a path down to the south and a strange door embedded in the cliff.',
        enemy: 'troll',
        enemyInstance: null,
        items: ['stone_pickaxe'],
    }
};

const baseEnemy = {
    behavior: {
        basic: 40,
        special: 15,
        critical: 0
    },
    attacks: {
        basic: { damageMultiplier: 1 },
        special: { damageMultiplier: 1.5 },
        critical: { damageMultiplier: 2 }
    }
};

const enemies = {
    goblin: {
        ...baseEnemy,
        name: 'Forest Goblin',
        health: 100,
        damage: 10,
        defense: 0,
        behavior: {
            basicAttack: 14,
        },
        attacks: {
            ...baseEnemy.attacks,
        },
        dropItems: ['shield', 'healing_potion', 'climbing_rope']
    },
    troll: {
        ...baseEnemy,
        name: 'Mountain Troll',
        health: 250,
        damage: 23,
        defense: 3,
        behavior: {
            basic: 23,
            rockThrow: 20
        },
        attacks: {
            ...baseEnemy.attacks,
            rockThrow: { damageMultiplier: 2 }
        },
        dropItems: ['small_dagger', 'heavy_armor']
    },
    dragon: {
        ...baseEnemy,
        name: 'Ancient Dragon',
        health: 500,
        damage: 120,
        defense: 5,
        behavior: {
            basic: 120,
            fireBreath: 120,
            tailSwipe: 100,
        },
    attacks: {
        ...baseEnemy.attacks,
        fireBreath: { 
            damageMultiplier: 2.0, // 40 dmg
        },
        tailSwipe: {
            damageMultiplier: 1.3, // 20 dmg
        },
    },
    dropItems: ['dragon_heart', 'scaled_armor', 'ancient_tear']
},
}


const items = {
    golden_sword: {
        name: 'Golden Sword',
        description: 'A legendary sword forged from pure gold',
        type: 'dagger',
        damage: 32,
        use: function () {
            console.log(require('chalk').yellow('You equip the golden sword. Your attacks now deal +32 damage!'));
            this.player.strength += 32;
            return false;
        },
    },
    small_dagger: {
        name: 'Small Dagger',
        description: 'A sharp dagger that can be used for close combat',
        type: 'dagger',
        damage: 12,
    },
    stone_pickaxe: {
        name: 'Stone Axe',
        description: 'A heavy double-headed axe',
        type: 'axe',
        damage: 15
    },
    bow: {
        name: 'Bow',
        description: 'A powerful bow that can shoot arrows',
        type: 'bow',
        damage: 10,
    },
    shield: {
        name: 'Shield',
        description: 'A large shield that provides extra protection',
        defense: 20,
        type: 'shield',
        use: function () {
            this.player.defense = this.player.defense + 20;
            console.log(require('chalk').green(`You equip the shield and feel safer! Your defense increases by 20!`));
            return false;
        },
    },
    heavy_armor: {
        name: 'Heavy Armor',
        description: 'A suit of heavy armor that provides excellent protection',
        defense: 30,
        type: 'armor',
        use: function () {
            this.player.defense = this.player.defense + 30;
            console.log(require('chalk').green(`You equip the heavy armor and feel invincible! Your defense increases by 30!`));
            return false;
        },
    },
    healing_potion: {
        name: 'Healing Potion',
        description: 'A potion that heals wounds',
        type: 'healing',
        use: function () {
            console.log(require('chalk').green('You drink the healing potion and feel rejuvenated! (+30 health)'));
            this.player.health = Math.min(this.player.maxHealth, this.player.health + 30);
            return true;
        },
    },
    berries: {
        name: 'Berries',
        description: 'A handful of ripe berries that look edible',
        type: 'healing',
        use: function () {
            console.log(require('chalk').green('You eat the berries and feel refreshed!'));
            this.player.health += 10;
            return true;
        },
    },
    chest: {
        name: 'Chest',
        description: `A large chest filled with gold and jewels\n${chalk.magenta("you will have to type (use chest) to unlock it with the key!")}`,
        type: 'utility',
        use: function () {
            if (this.player.inventory.includes('key')) {
                console.log(require('chalk').yellowBright('You open the treasure chest and find the royal treasures!'));
                console.log('Inside you find a map to the dragon\'s lair.');
                this.player.inventory.push('map');
                return true;
            } else {
                console.log(require('chalk').red('The treasure chest is locked! You need a key to open it.'));
                return false;
            }
        },
    },
    map: {
        name: 'Map',
        description: `A detailed map showing the way to the dragon\'s lair!`,
        type: 'utility',
        use: function () {
            console.log(require('chalk').green('The map guides you to the dragon\'s lair!'));
            this.gameMap['cave'].description = 'A damp cave with strange glowing crystals. There is a passage back west and a dark tunnel to the south. The map shows a hidden passage to the dragon\'s lair to the north.';
            this.gameMap['dragon_lair'].locked = false;
            return true;
        },
    },
    dragon_scale: {
        name: 'Dragon Scales',
        description: `Shimmering scales from the legendary dragon\n${chalk.magenta("you will have to use it!")}`,
        type: 'healing',
        use: function () {
            console.log(require('chalk').green('The dragon scales provide excellent protection, Your maximum health increases by 250! and 150 defense!'));
            this.player.defense += 150;
            this.player.maxHealth += 250;
            this.player.health += 250;
            return true;
        },
    },
    ancient_book: {
        name: 'Ancient Book',
        description: 'A dusty tome filled with mysterious symbols',
        type: 'utility',
        use: function () {
            console.log(require('chalk').yellow('You read the ancient book and learn about a hidden treasure room!'));
            this.gameMap['east'].description = 'You find yourself in a library. There is a door to the west and a hidden passage to the south. A secret passage to the treasure room is revealed to the east.';
            console.log(require('chalk').green('The book mentions that a key and a flashlight are needed to access the true treasures.'));
            return false;
        }
    },
    key: {
        name: 'Key',
        description: `An old rusty key that glints in the light`,
        type: 'utility',
        use: function () {
            console.log(require('chalk').green('You have found the way to the treasure room!'));
            this.gameMap['treasure_room'].locked = false;
            return true;
        },
    },
    climbing_rope: {
        name: 'Climbing Rope',
        description: 'A sturdy rope that can be used for climbing',
        type: 'utility',
        use: function () {
            console.log(require('chalk').green('use this rope to climb up the mountain'));
            this.gameMap['cave'].locked = false;
            return true;
        }
    },
    arrows: {
        name: 'Arrows',
        description: 'A quiver of sharp arrows for the bow',
        type: 'miscellaneous',
    },
    flashlight: {
        name: 'Flashlight',
        description: 'A small flashlight that flickers to life',
        type: 'miscellaneous',
    },
    torch: {
        name: 'Torch',
        description: 'A burning torch that illuminates the darkness',
        type: 'miscellaneous',
    },
    dragon_tooth: {
        name: 'Dragon Tooth',
        description: 'A sharp tooth from the legendary dragon',
        type: 'miscellaneous',
    },
    dragon_heart: {
        name: 'Dragon Heart',
        description: 'The heart of the ancient dragon, a trophy of your victory',
        type: 'miscellaneous',
    },
    ancient_tear: {
        name: 'Ancient Tear',
        description: 'A tear from the ancient dragon, said to have magical properties',
        type: 'miscellaneous',
    },
    scaled_armor: {
        name: 'Scaled Armor',
        description: 'Armor made from the scales of the ancient dragon',
        type: 'armor',
        defense: 50,
        use: function () {
            console.log(require('chalk').green('You equip the scaled armor and feel invincible! Your defense increases by 50!'));
            this.player.defense = this.player.defense + 50;
            return false;
        },
    },
    crown: {
        name: 'Crown',
        description: 'A magnificent crown fit for a king',
        type: 'miscellaneous',
    },
    crystal: {
        name: 'Glowing Crystal',
        description: 'A crystal that emits a soft glow',
        type: 'miscellaneous',
    },
}

module.exports = { gameMap, enemies, items };