const chalk = require('chalk');

class GameAnimator {
    constructor() {
        // Character animations for different entities and states
        this.frames = {
            player: {
                idle: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|\\ \n / \\ "
                ],
                walk: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|\\ \n / \\  ",
                    "  O  \n /|\\ \n /  \\",
                    "  O  \n /|\\ \n/   \\"
                ],
                equip_dagger: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|\\ \n / \\ \n  ⚔️ ",
                    "  O  \n /|⚔ \n / \\ ",
                    "  O  \n /|⚔ \n / \\ "
                ],
                equip_shield: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|\\ \n / \\ \n  🛡️ ",
                    "  O  \n🛡️|\\ \n / \\ ",
                    "  O  \n🛡️|🛡️ \n / \\ "
                ],
                equip_generic: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|\\ \n / \\ \n  ▼ ",
                    "  O  \n /|\\ \n / \\ \n  ⚡",
                    "  O  \n /|\\ \n / \\ \n  ✔️"
                ],
                equip_bow: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|🏹 \n / \\ ",
                    "  O  \n /|🏹 \n / \\ \n   ➹",
                    "  O  \n /|🏹 \n / \\ \n  ➹➹"
                ],
                equip_axe: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|Ɑ \n / \\ \n   🔪",
                    "  O  \n /|𐃏 \n / \\ ",
                    "  O  \n /|𐃏 \n / \\ \n  ⚔️"
                ],
                equip_staff: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|🜁 \n / \\ ",
                    "  O  \n /|🜂 \n / \\ \n   ✨",
                    "  O  \n /|🜄 \n / \\ \n  ✨✨"
                ],
                equip_armor: [
                    "    O    \n   /|\\   \n   / \\   ",
                    "    O    \n  🛡️|🛡️  \n   / \\   ",
                    "   🛡️O🛡️  \n  🛡️|🛡️  \n  🛡️/🛡️\\  ",
                    "   ⚔️O⚔️  \n  🛡️|🛡️  \n  🛡️/🛡️\\  "
                ],
                equip_axe: [
                    "    O    \n   /|\\   \n   / \\   ",
                    "    O    \n   /|Ɑ  \n   / \\   ",
                    "   \\O/   \n    |𐃏  \n   / \\   ",
                    "   \\O/   \n    |𐃏  \n  ⚔️/ ⚔️  "
                ],
                attack: [
                    "  O  \n /|⟩ \n / \\ ",
                    " O   \n /|⟩ \n / \\ "
                ],
                magic: [
                    "  O  \n /|✨ \n / \\ ",
                    "  O  \n /|✨ \n / \\ ",
                    "  O  \n/|✨ \n / \\ "
                ],
                hurt: [
                    "  O  \n \\|\\ \n / \\ ",
                    " *O* \n \\|\\ \n / \\ "
                ],
                victory: [
                    "\\O/  \n |  \n/ \\ ",
                    " \\O/ \n  |  \n / \\"
                ],
                death: [
                    "  O  \n /|\\ \n / \\ ",
                    "  O  \n /|\\  \n/ \\  ",
                    "  o\\  \n /|  \n/    ",
                    "   \\o \n    | \n     ",
                    "     x_x\n     |  \n    / \\"
                ]
            },
            goblin: {
                idle: [
                    " ,^, \n ◕‿◕ \n╭-|-╮\n/ \\ ",
                    " ,^, \n ◕~◕ \n╭-|-╮\n/ \\ ",
                    " ,^, \n ◕◡◕ \n╭-|-╮\n/ \\ "
                ],
                attack: [
                    " ,^, \n ◕‿◕ \n╭-|⟩╮\n/ \\ ",
                    " ,^, \n >◕< \n╭-|⟩╮\n/ \\ ",
                    " ,^, \n ≧◠≦ \n╭-|⟩╮\n/ \\ "
                ],
                hurt: [
                    " ,^, \n x_x \n╭-|-╮\n / \\ ",
                    " ,^, \n @_@ \n╭-|-╮\n / \\ "
                ],
                death: [
                    " ,^, \n >_< \n╭-|-╮\n / \\ ",
                    " ,^, \n x_x \n╭-|-╮\n /   ",
                    " ,^, \n x_x \n\\-|-  \n     ",
                    "  ^  \n x_x \n     \n     "
                ]
            },
            troll: {
                idle: [
                    "  ⚆_⚆ \n ╭|█|╮ \n  / \\ ",
                    "  ⚆_⚆ \n ╭|▓|╮ \n  / \\ ",
                    "  ⚆_⚆ \n ╭|▒|╮ \n  / \\ "
                ],
                attack: [
                    "  ⚆_⚆ \n ╭|█⟩╮ \n  / \\  ",
                    "  >⚆< \n ╭|█⟩╮ \n  / \\  ",
                    "  ≋⚆≋ \n ╭|█⟩╮ \n  / \\  "
                ],
                hurt: [
                    "  @_@ \n ╭|█|╮ \n  / \\ ",
                    "  x_x \n ╭|█|╮ \n  / \\ "
                ],
                death: [
                    "  X_X \n ╭|█|╮ \n  / \\ ",
                    "  X_X \n ╭|█|  \n  /    ",
                    "   X_X\n    █|  \n       ",
                    "      \n   X_X  \n       "
                ]
            },
            dragon: {
                flight: [
                    `
                       .,-;-;-,. /'_\\
                     _/_/_/_|_\\_\\) / 
                   '-<_><_><_><_>=/\\ 
                      \`-<_><_><_><_\\ 
                          ~//^\\\\~ 
                    (◣____◢) 
                      ◥◤    `,
                    `
                       .,-;-;-,. /'_\\
                     _/_/_/_|_\\_\\) / 
                   '-<_><_><_><_>=/\\ 
                      \`-<_><_><_><_\\ 
                          ~//^\\\\~ 
                    (◣~~~~◢)~~~ 
                      ◥◤    `,
                    `
                       .,-;-;-,. /'_\\
                     _/_/_/_|_\\_\\) / 
                   '-<_><_><_><_>=/\\ 
                      \`-<_><_><_><_\\ 
                      ~~~\\\\^//~~ 
                    (◣⌒⌒◢)~~~~ 
                      ◥◤    `
                ],

                idle: [
                    "    /\\                   /\\\n" +
                    "   /  \\                 /  \\\n" +
                    "  / /\\ \\               / /\\ \\\n" +
                    " / /  \\ \\             / /  \\ \\\n" +
                    "/ /    \\ \\___________/ /    \\ \\\n" +
                    "\\/      \\/_____________\\/      \\/\n" +
                    "          (◣___◢)\n" +
                    "            ◥◤",

                    "    /\\                   /\\\n" +
                    "   /  \\                 /  \\\n" +
                    "  / /\\ \\               / /\\ \\\n" +
                    " / /  \\ \\             / /  \\ \\\n" +
                    "/ /    \\ \\___________/ /    \\ \\\n" +
                    "\\/      \\/_____________\\/      \\/\n" +
                    "          (◣~~~◢)\n" +
                    "            ◥◤"
                ],
                attack: [
                    "    /^\\                  /^\\\n" +
                    "   /   \\                /   \\\n" +
                    "  / /\\ \\               / /\\ \\\n" +
                    " / /  \\ \\             / /  \\ \\\n" +
                    "/ /    \\ \\___________/ /    \\ \\\n" +
                    "\\/      \\/_____________\\/      \\/\n" +
                    "          (◣⌒⌒◢)~~~♨\n" +
                    "            ◥◤",

                    "    /^\\                  /^\\\n" +
                    "   /   \\                /   \\\n" +
                    "  / /\\ \\               / /\\ \\\n" +
                    " / /  \\ \\             / /  \\ \\\n" +
                    "/ /    \\ \\___________/ /    \\ \\\n" +
                    "\\/      \\/_____________\\/      \\/\n" +
                    "          (>◣◢<)~♨♨♨\n" +
                    "            ◥◤"
                ],
                hurt: [
                    "    /\\                   /\\\n" +
                    "   /  \\                 /  \\\n" +
                    "  / /\\ \\               / /\\ \\\n" +
                    " / /  \\ \\             / /  \\ \\\n" +
                    "/ /    \\ \\___________/ /    \\ \\\n" +
                    "\\/      \\/_____________\\/      \\/\n" +
                    "          (x___x)\n" +
                    "            ◥◤",
                ],
                death: [
                    "    /\\                   /\\\n" +
                    "   /  \\                 /  \\\n" +
                    "  / /\\ \\               / /\\ \\\n" +
                    " / /  \\ \\             / /  \\ \\\n" +
                    "/ /    \\ \\___________/ /    \\ \\\n" +
                    "\\/      \\/_____________\\/      \\/\n" +
                    "          (X___X)\n" +
                    "            ◥◤",

                    "    /\\                   /\\\n" +
                    "   /  \\                 /  \\\n" +
                    "  / /\\ \\               / /\\ \\\n" +
                    " / /  \\ \\             / /  \\ \\\n" +
                    "/ /    \\ \\___________/ /    \\ \\\n" +
                    "\\/      \\/_____________\\/      \\/\n" +
                    "        ~(X___X)~\n" +
                    "            ~",

                    "    /                    /\n" +
                    "   /                    /\n" +
                    "  / /              / /\n" +
                    " / /              / /\n" +
                    "/ /              / /\n" +
                    "\\/               \\/\n" +
                    "        ~~~~~~~~~~~\n" +
                    "        ~~~~~~~~~~~"
                ]
            }
        };

        // Room transition animations
        this.transitions = {
            default: [
                "    >>    ",
                "    >>>   ",
                "     >>>  ",
                "      >>> ",
                "       >>>"
            ],
            north: [
                "    ^     ",
                "   ^^^    ",
                "  ^^^^^   ",
                " ^^^^^^^ "
            ],
            south: [
                " vvvvvvv  ",
                "  vvvvv   ",
                "   vvv    ",
                "    v     "
            ],
            east: [
                "    >>    ",
                "    >>>   ",
                "     >>>  ",
                "      >>> ",
                "       >>>"
            ],
            west: [
                "<<<       ",
                " <<<      ",
                "  <<<     ",
                "   <<<    ",
                "    <<    "
            ],
            door: [
                "🚪✨        ",
                " 🔑🚪✨     ",
                "  🗝️🚪✨   ",
                "   🏰🚪✨  ",
                "    🌟🚪   ",
                "     🚪✨  ",
                "      🚪   "
            ],
            up: [
                "🪢🧗♂️⛰️    ",
                " 🪢🧗♂️⛰️   ",
                "  🪢🧗♂️⛰️  ",
                "   🪢🧗♂️⛰️ ",
                "    🪢🧗♂️⛰️",
                "     🪢🧗♂️ ",
                "      🪢🧗♂️"
            ],
            down: [
                "🧗♂️🪢⛰️    ",
                " ⬇️🧗♂️🪢⛰️  ",
                "  🪨⬇️🧗♂️⛰️",
                "   🪨⬇️🧗♂️ ",
                "    🪨⬇️🧗♂️",
                "     🪨⬇️  ",
                "      🪨   "
            ],
        };

        // Item usage animations
        this.itemEffects = {
            healing_potion: [
                "   \\o/   \n    |    \n   / \\   ",
                "   \\o/   \n    |    \n   / \\   \n    ❤️    ",
                "   \\o/   \n    |    \n   / \\   \n   ❤️❤️   ",
                "   \\o/   \n    |    \n   / \\   \n  ❤️❤️❤️  "
            ],
            shield: [
                "    O    \n   /|\\   \n   / \\   ",
                "    O    \n   /|\\   \n   / \\   \n    🛡️    ",
                "    O    \n   /|🛡️  \n   / \\   ",
                "    O    \n  🛡️|🛡️  \n   / \\   "
            ],
            ancient_book: [
                "    O    \n   /|\\   \n   / \\   ",
                "    O    \n   /|📕  \n   / \\   ",
                "    O    \n   /|📖  \n   / \\   \n    ✨    ",
                "    O    \n   /|📖  \n   / \\   \n   ✨✨   "
            ],
            crystal: [
                "    O    \n   /|\\   \n   / \\   ",
                "    O    \n   /|💎  \n   / \\   ",
                "    O    \n   /|💎  \n   / \\   \n    ✨    ",
                "   \\O/   \n    |💎  \n   / \\   \n   ✨✨   "
            ],
            golden_sword: [
                "    O    \n   /|\\   \n   / \\   ",
                "    O    \n   /|🗡️  \n   / \\   ",
                "   \\O/   \n    |🗡️  \n   / \\   ",
                "   \\O/   \n    |⚔️   \n   / \\   "
            ],
            dragon_scale: [
                "    O    \n   /|\\   \n   / \\   ",
                "    O    \n   /|🔶  \n   / \\   ",
                "    O    \n   /|🔶  \n   / \\   \n    ✨    ",
                "   \\O/   \n    |🔶  \n   / \\   \n  ✨✨✨  "
            ],
            chest: [
                "    O    \n   /|\\   \n   / \\   \n    📦    ",
                "    O    \n   /|\\   \n   / \\   \n    📦    \n    🔑    ",
                "    O    \n   /|\\   \n   / \\   \n    📦    \n   🔑🔓   ",
                "    O    \n   /|\\   \n   / \\   \n    📭    \n   ✨✨✨  "
            ],
            berries: [
                "    O    \n   /|\\   \n   / \\   ",
                "    O    \n   /|\\🍓 \n   / \\   ",
                "   \\O/   \n    |🍓  \n   / \\   \n   🌿🌿   ",
                "   \\O/   \n    |    \n   / \\   \n  🌿🍓🌿  "
            ],
            climbing_rope: [
                "    O    \n   /|\\   \n   / \\🪢 ",
                "    O⬆️   \n   /|\\🪢 \n   / \\   ",
                "    O⬆️⬆️  \n   /|\\🪢 \n   / \\   ",
                "    O⬆️⬆️⬆️ \n   /|\\🪢 \n   / \\   "
            ],
            dragon_scale: [
                "    O    \n   /|\\   \n   / \\🐉 ",
                "   \\O/   \n    |🐉  \n   / \\   \n  ✨✨✨ ",
                "   \\O/   \n   🔥|🔥  \n   / \\   \n 🐉✨🐉 ",
                "   \\O/   \n    |    \n   / \\   \n  🛡️🛡️🛡️  "
            ],
            stone_axe: [
                "    O    \n   /|\\   \n   / \\🪓 ",
                "    O    \n   /|\\⛏️ \n   / \\🪓 ",
                "   \\O/   \n    |🪓  \n   / \\   \n  💥💥💥 ",
                "   \\O/   \n    |🪓  \n   / \\   \n  🪨🪨🪨 "
            ],
            heavy_armor: [
                "    O    \n   /|\\   \n   / \\🛡️ ",
                "   🤖O🤖 \n  🛡️|🛡️  \n   / \\   ",
                "   🛡️O🛡️  \n  🛡️|🛡️  \n  🛡️/🛡️\\  ",
                "   ⚙️O⚙️  \n  ⚒️|⚒️  \n  🛡️/🛡️\\  "
            ],
            climbing_confirmation: [
                "⛰️🧗♂️🪢     ",
                "⛰️🧗♂️🪢⬆️   ",
                "⛰️🧗♂️🪢⬆️⬆️ ",
                "⛰️🧗♂️🪢⬆️⬆️⬆️"
            ],
            descending_confirmation: [
                "⛰️🧗♂️🪢     ",
                "⛰️⬇️🧗♂️🪢   ",
                "⛰️⬇️🧗♂️🪢   ",
                "⛰️⬇️🧗♂️🪢⬇️ "
            ],
        };

        // Environment effects for different room types
        this.environments = {
            start: [
                "  ......  \n  |    |  \n  |    |  \n  ------  ",
                "  ......  \n  |    |  \n  |    |  \n  ------  "
            ],
            north: [
                "   ❄️ ❄️   \n   ❄️ ❄️   \n  ------  ",
                "   ❄️  ❄️  \n  ❄️   ❄️  \n  ------  "
            ],
            east: [
                "  📚 📚 📚  \n  📚 📚 📚  \n  ------  ",
                "  📚 📚 📚  \n  📚 📚 📚  \n  ------  "
            ],
            west: [
                "🔑🚪💎 ",  
                "✨🔑🚪💎",
                " 🗝️✨🔑🚪",
                "  🏰✨🔑 ",
                "   🏰✨  "
            ],
            south: [
                "   🕯️    🕯️   \n  🌫️  🌫️  🌫️  \n  ~~~~~~~  ",
                "   🕯️    🕯️   \n   🌫️ 🌫️ 🌫️   \n  ~~~~~~~  "
            ],
            treasure_room: [
                "  💰 👑 💰  \n  💎 💎 💎  \n  ------  ",
                "  💰 👑 💰  \n  💎 💎 💎  \n  ------  "
            ],
            cave: [
                "  🔮 🔮 🔮  \n  🌫️ 🌫️ 🌫️  \n  ~~~~~~~  ",
                "  🔮 🔮 🔮  \n   🌫️ 🌫️ 🌫️   \n  ~~~~~~~  "
            ],
            dragon_lair: [
                "  🔥  🔥  🔥  \n   🔥 🔥 🔥   \n  ~~~~~~~  ",
                "   🔥 🔥 🔥   \n  🔥  🔥  🔥  \n  ~~~~~~~  "
            ],
            forest: [
                "  🌲 🌳 🌲  \n  🌿 🌱 🌿  \n  ------  ",
                "  🌲 🌳 🌲  \n  🌱 🌿 🌱  \n  ------  "
            ],
            mountain: [
                "   🏔️ 🏔️ 🏔️   \n  ⛰️ ⛰️ ⛰️  \n  ------  ",
                "   🏔️ 🏔️ 🏔️   \n  ⛰️ ⛰️ ⛰️  \n  ------  "
            ],
            mountain_climb: [
                "🪨🪨🪨🪨🪨",
                "⛰️⛰️⛰️⛰️⛰️",
                "🏔️🏔️🏔️🏔️🏔️",
                "🗻🗻🗻🗻🗻"
            ],
            mountain_descent: [
                "🗻⬇️🗻⬇️🗻",
                "⛰️⬇️⛰️⬇️⛰️",
                "🪨⬇️🪨⬇️🪨",
                "🏔️⬇️🏔️⬇️🏔️"
            ],
            rain: [
                "・・・☔・・・\n・・・🌧️・・・",
                "・・☔・・\n・🌧️・🌧️・"
            ],
            wind: [
                "〜〜〜🌬️〜〜〜",
                "〜🌬️〜🌬️〜🌬️〜"
            ],
        };

        this.cutscenes = {
            dragon_intro: [
                `
                A dark shadow passes overhead...
                      __-----___ 
                   ..;;;--'~~~'--;;;\\
                 /;-~INTO THE-~-\\;\\
                /      DUNGEON      \\ 
               |       OF DOOM       |\\
                \\      ~~~~~~      / 
                 \\;;;---____---;;;/
                      ~~-----~~    `,
                `
                You hear a terrifying roar!
                \\|/       \\|/       \\|/
               ---◣~~~~~~◢---◣~~~~~~◢---
                \\/       \\/       \\/
                / \\     / \\     / \\
               /   \\   /   \\   /   \\`,
                `
                The Ancient Dragon awakens!
                    /\\_____/\\
                   /  o   o  \\
                  ( ==  ^  == )
                   )         (
                  (           )
                 ( (  )   (  )
                (__(__)___(__)__)`
            ]
        }
    }

    async animateCutscene(sceneName, speed = 200, loopCount = 1) {
        const scene = this.cutscenes[sceneName];
        if (!scene) {
            console.log(`Cutscene ${sceneName} not found!`);
            return;
        }

        const lines = this.countLines(scene[0]);
        console.log('\n'.repeat(2));

        for (let loop = 0; loop < loopCount; loop++) {
            for (const frame of scene) {
                if (loop > 0 || scene.indexOf(frame) > 0) {
                    this.clearLines(lines + 2);
                }

                // Apply color based on scene and frame
                let coloredFrame = frame;
                if (sceneName === 'dragon_intro') {
                    if (scene.indexOf(frame) === 2) { // Dragon frame
                        coloredFrame = chalk.red(frame);
                    } else {
                        coloredFrame = chalk.yellow(frame);
                    }
                }

                console.log(coloredFrame);
                await this.sleep(speed);
            }
        }

        this.clearLines(lines + 2);
        await this.sleep(500);
    }

    // Clear specific number of lines in console
    clearLines(lines) {
        process.stdout.write('\x1b[' + lines + 'A');
        for (let i = 0; i < lines; i++) {
            console.log('\x1b[K');
        }
        process.stdout.write('\x1b[' + lines + 'A');
    }

    // Count the number of lines in a text frame
    countLines(frame) {
        return frame.split('\n').length;
    }

    // Sleep function for animation timing
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Animate a character action (Basic animation)
    async animateCharacter(character, action, color = 'white', frameCount = 4, speed = 150) {
        if (!this.frames[character] || !this.frames[character][action]) {
            console.log(`Animation not found for ${character}:${action}`);
            return;
        }

        const animFrames = this.frames[character][action];
        const lines = this.countLines(animFrames[0]);

        for (let i = 0; i < frameCount; i++) {
            const frameIndex = i % animFrames.length;

            // Clear previous frame if not the first one
            if (i > 0) this.clearLines(lines);

            // Draw current frame
            console.log(chalk[color](animFrames[frameIndex]));

            await this.sleep(speed);
        }

        return lines;
    }

    // FEATURE 1: Room Transition Animation
    async animateRoomTransition(direction, speed = 100) {
        console.log('\n'); // Space for animation

        const transitionFrames = this.transitions[direction] || this.transitions.default;
        const lines = 1; // Transitions are single line

        for (let i = 0; i < transitionFrames.length; i++) {
            if (i > 0) this.clearLines(lines);

            console.log(chalk.blue(transitionFrames[i]));

            await this.sleep(speed);
        }

        await this.sleep(speed);
        this.clearLines(lines);

        // Animate player walking
        await this.animateCharacter('player', 'walk', 'green', 4, speed);

        return true;
    }

    // FEATURE 2: Item Usage Animation
    async animateItemUse(itemName, speed = 150) {
        console.log('\n'); // Space for animation

        const itemFrames = this.itemEffects[itemName];
        if (!itemFrames) {
            console.log(`No animation for item: ${itemName}`);
            return;
        }

        const lines = this.countLines(itemFrames[0]);

        for (let i = 0; i < itemFrames.length; i++) {
            if (i > 0) this.clearLines(lines);

            // Color based on item type
            let color = 'white';
            if (itemName.includes('potion')) color = 'red';
            else if (itemName.includes('shield')) color = 'blue';
            else if (itemName.includes('sword')) color = 'yellow';
            else if (itemName.includes('book')) color = 'cyan';
            else if (itemName.includes('crystal')) color = 'magenta';

            console.log(chalk[color](itemFrames[i]));

            await this.sleep(speed);
        }

        await this.sleep(speed * 2);
        this.clearLines(lines);

        return true;
    }

    // FEATURE 3: Environment Animation
    async animateEnvironment(roomType, frames = 4, speed = 250) {
        const envFrames = this.environments[roomType] || this.environments.start;
        const lines = this.countLines(envFrames[0]);

        console.log('\n'); // Space for animation

        for (let i = 0; i < frames; i++) {
            const frameIndex = i % envFrames.length;

            if (i > 0) this.clearLines(lines);

            // Select color based on room type
            let color = 'white';
            if (roomType === 'north') color = 'blue';
            else if (roomType === 'east') color = 'cyan';
            else if (roomType === 'west') color = 'yellow';
            else if (roomType === 'south') color = 'gray';
            else if (roomType === 'dragon_lair') color = 'red';
            else if (roomType === 'treasure_room') color = 'yellow';
            else if (roomType === 'forest') color = 'green';
            else if (roomType === 'mountain') color = 'gray';

            console.log(chalk[color](envFrames[frameIndex]));

            await this.sleep(speed);
        }

        await this.sleep(speed);
        this.clearLines(lines);

        return true;
    }

    // FEATURE 4: Dynamic Battle Animation
    async animateBattle(playerWeapon, enemyType, playerHealth, enemyHealth) {
        // Determine player attack animation based on weapon
        let playerAttackType = 'attack';
        if (playerWeapon === 'golden_sword') playerAttackType = 'sword';
        else if (playerWeapon === 'crystal') playerAttackType = 'magic';

        console.log('\n'); // Space for battle animation
        console.log(chalk.yellow('⚔️ ⚔️ ⚔️  BATTLE!  ⚔️ ⚔️ ⚔️'));

        // Show starting health
        console.log(chalk.green(`Player: ${playerHealth} HP`) + '    ' +
            chalk.red(`${this.capitalizeFirstLetter(enemyType)}: ${enemyHealth} HP`));

        // Show both combatants
        console.log(chalk.green(this.frames.player.idle[0]));
        console.log(chalk.gray('--------- VS ---------'));
        console.log(chalk.red(this.frames[enemyType].idle[0]));

        await this.sleep(1000);

        // Clear battle scene
        const totalLines = 5 +
            this.countLines(this.frames.player.idle[0]) +
            this.countLines(this.frames[enemyType].idle[0]);
        this.clearLines(totalLines);

        // Player attacks
        console.log('\n');
        console.log(chalk.yellow('⚔️ ⚔️ ⚔️  BATTLE!  ⚔️ ⚔️ ⚔️'));
        console.log(chalk.green(`Player attacks!`));
        console.log(chalk.green(this.frames.player[playerAttackType][0]));
        console.log(chalk.yellow('------------>'));
        console.log(chalk.red(this.frames[enemyType].idle[0]));

        await this.sleep(500);

        // Clear and show enemy getting hit
        this.clearLines(totalLines - 2);

        console.log('\n');
        console.log(chalk.yellow('⚔️ ⚔️ ⚔️  BATTLE!  ⚔️ ⚔️ ⚔️'));
        console.log(chalk.green(`Hit!`));
        console.log(chalk.green(this.frames.player[playerAttackType][1]));
        console.log(chalk.yellow('------------>'));
        console.log(chalk.red(this.frames[enemyType].hurt ?
            this.frames[enemyType].hurt[0] :
            this.frames[enemyType].idle[0]));

        await this.sleep(800);

        // Enemy attacks back
        this.clearLines(totalLines - 2);

        console.log('\n');
        console.log(chalk.yellow('⚔️ ⚔️ ⚔️  BATTLE!  ⚔️ ⚔️ ⚔️'));
        console.log(chalk.red(`${this.capitalizeFirstLetter(enemyType)} attacks!`));
        console.log(chalk.green(this.frames.player.idle[0]));
        console.log(chalk.yellow('<------------'));
        console.log(chalk.red(this.frames[enemyType].attack[0]));

        await this.sleep(500);

        // Player gets hit
        this.clearLines(totalLines - 2);

        console.log('\n');
        console.log(chalk.yellow('⚔️ ⚔️ ⚔️  BATTLE!  ⚔️ ⚔️ ⚔️'));
        console.log(chalk.red(`You are hit!`));
        console.log(chalk.green(this.frames.player.hurt[0]));
        console.log(chalk.yellow('<------------'));
        console.log(chalk.red(this.frames[enemyType].attack[1]));

        await this.sleep(1000);
        this.clearLines(totalLines);

        return true;
    }

    // FEATURE 5: Equip Animation
    async animateEquipItem(itemType, speed = 200) {
        const action = `equip_${itemType}`;

        // First check for specific animation
        if (this.frames.player[action]) {
            await this.animateCharacter('player', action, 'yellow', 4, speed);
            return;
        }

        if (!this.frames.player[itemType]) {
            console.log(`No equip animation for ${itemType}`);
            return;
        }

        // Then check weapon categories
        const fallbackMap = {
            dagger: 'sword',
            mace: 'axe',
            wand: 'staff'
        };

        const fallbackAction = fallbackMap[itemType] ?
            `equip_${fallbackMap[itemType]}` :
            'equip_generic';

        await this.animateCharacter('player', fallbackAction, 'yellow', 4, speed);
    }

    // FEATURE 6: Health Bar Animation
    async generateHealthBar(current, max, width = 20) {
        const filled = Math.round((current / max) * width);
        return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${current}/${max}`;
    }

    async animateDamage(damageValue) {
        const damageFrames = [
            chalk.red(`  ${damageValue}  `),
            chalk.redBright(` >>${damageValue}<< `),
            chalk.red(`  ${damageValue}  `)
        ];

        for (const frame of damageFrames) {
            process.stdout.write('\x1b[1A'); // Move up
            console.log(frame);
            await this.sleep(100);
        }
        await this.sleep(300);
        this.clearLines(1);
    }

    // Animate victory 
    async animateVictory(enemyType) {
        console.log('\n');
        console.log(chalk.yellow('✨ ✨ ✨  VICTORY!  ✨ ✨ ✨'));

        // Enemy death animation
        await this.animateCharacter(enemyType, 'death', 'red', 3, 300);
        this.clearLines(this.countLines(this.frames[enemyType].death[0]) + 2);

        // Player victory animation
        console.log(chalk.yellow('✨ ✨ ✨  VICTORY!  ✨ ✨ ✨'));
        await this.animateCharacter('player', 'victory', 'green', 4, 200);

        await this.sleep(800);
        this.clearLines(this.countLines(this.frames.player.victory[0]) + 2);

        return true;
    }

    // Animate player death
    async animatePlayerDeath() {
        console.log('\n');
        console.log(chalk.red('💀 💀 💀  DEFEAT  💀 💀 💀'));

        await this.animateCharacter('player', 'death', 'red', this.frames.player.death.length, 400);

        await this.sleep(1000);
        this.clearLines(this.countLines(this.frames.player.death[0]) + 2);

        return true;
    }

    // Animate the final victory scene
    async animateFinalVictory() {

        const frames = [
            "   \\o/   \n    |    \n   / \\   \n    👑    ",
            "    \\o/    \n     |     \n    / \\    \n     👑     \n    ✨✨    ",
            "     \\o/     \n      |      \n     / \\     \n      👑      \n     ✨✨     \n    🏆🏆🏆    ",
            "      \\o/      \n       |       \n      / \\      \n       👑       \n      ✨✨      \n     🏆🏆🏆     \n    🎊🎊🎊🎊    "
        ];

        for (let i = 0; i < frames.length; i++) {
            if (i > 0) this.clearLines(this.countLines(frames[i - 1]) + 4);

            console.log('\n');
            console.log(chalk.yellow('✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨'));
            console.log(chalk.yellow('✨✨    CONGRATULATIONS    ✨✨'));
            console.log(chalk.yellow('✨✨      YOU HAVE WON     ✨✨'));
            console.log(chalk.yellow('✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨'));
            console.log(chalk.yellow(frames[i]));

            await this.sleep(600);
        }

        await this.sleep(2000);
        return true;
    }

    // Helper function to capitalize the first letter
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async titleScreen(){
        const SIMPLE_TITLE = chalk.red.bold(`
            __      ________ _____ _       _____ _____ _____ _____  ______ 
            \\ \\    / /  ____|_   _| |     / ____|  __ \\_   _|  __ \\|  ____|
             \\ \\  / /| |__    | | | |    | (___ | |__) || | | |__) | |__   
              \\ \\/ / |  __|   | | | |     \\___ \\|  ___/ | | |  _  /|  __|  
               \\  /  | |____ _| |_| |____ ____) | |    _| |_| | \\ \\| |____ 
                \\/   |______|_____|______|_____/|_|   |_____|_|  \\_\\______|
                                                                           
           `);
        console.log(SIMPLE_TITLE);
        return;
    }
}

module.exports = GameAnimator;