const CONTROL_BAR_HEIGHT = 140;
const WORLD_HEIGHT = 600 - CONTROL_BAR_HEIGHT;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // disable global gravity
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);

let player, mochkil;
let leftDown = false;
let rightDown = false;
let jumpDown = false;
let platforms = [];
let foods = [];
let lastPlatformX = 0;

// Space zones
const spaceZones = [
    { start: 800, end: 1400 },
    { start: 2200, end: 2800 },
];

function preload() {}

function create() {
    // Player
    player = this.add.text(100, WORLD_HEIGHT - 60, '🐱', { fontSize: '64px', shadow: { offsetX:0, offsetY:0, color:'#00ffff', blur:12 } });
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(false);
    player.inSpace = false;

    // Mochkil
    mochkil = this.add.text(30, WORLD_HEIGHT - 60, '🐈‍⬛', { fontSize: '64px', shadow: { offsetX:0, offsetY:0, color:'#ffffff', blur:10 } });
    this.physics.add.existing(mochkil);
    mochkil.body.setCollideWorldBounds(false);

    // Initial platform
    spawnPlatform(0, WORLD_HEIGHT - 20, 400);
    lastPlatformX = 400;

    // Camera
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 600);

    // UI Bar
    this.add.rectangle(
        config.width/2,
        WORLD_HEIGHT + CONTROL_BAR_HEIGHT/2,
        config.width,
        CONTROL_BAR_HEIGHT,
        0x111111
    ).setScrollFactor(0).setDepth(500);

    const buttonY = WORLD_HEIGHT + 30;
    createButton(this, 80, buttonY, '◀', () => leftDown = true, () => leftDown = false);
    createButton(this, 180, buttonY, '▶', () => rightDown = true, () => rightDown = false);
    createButton(this, config.width-120, buttonY, '⬆', () => jumpDown = true, () => jumpDown = false);
}

function update() {
    // ===== PLAYER MOVEMENT =====
    if (leftDown) player.x -= 5;
    else if (rightDown) player.x += 5;

    if (jumpDown && player.y >= WORLD_HEIGHT - 60) player.y -= 80;

    // Gravity simulation: float back down
    if (player.y < WORLD_HEIGHT - 60) player.y += 5;

    // Space zones popups (no effect on gravity here)
    let inSpace = false;
    spaceZones.forEach(zone => { if(player.x >= zone.start && player.x <= zone.end) inSpace=true; });
    if (inSpace && !player.inSpace) showScienceMessage(this, "In space, gravity is weaker!");
    player.inSpace = inSpace;

    // ===== MOCHKIL AI =====
    const dx = player.x - mochkil.x;
    const speed = 3; // horizontal speed
    if (Math.abs(dx) > 2) mochkil.x += Math.sign(dx)*speed;

    // Mochkil Y pinned to platform under him
    mochkil.y = getPlatformYUnder(mochkil) - 40;

    // ===== FOOD PINNED TO PLATFORMS =====
    foods.forEach(f => {
        f.y = getPlatformYUnder(f) - 50;
    });

    // ===== SPAWN NEW PLATFORMS =====
    if (player.x + 600 > lastPlatformX) {
        const width = Phaser.Math.Between(200,400);
        const newY = WORLD_HEIGHT - 20;
        spawnPlatform(lastPlatformX, newY, width);

        // Random food
        if (Phaser.Math.Between(0,1)) {
            const food = this.add.text(lastPlatformX + width/2, newY - 50, Phaser.Math.RND.pick(['🍕','🌮']), {
                fontSize:'48px', shadow:{offsetX:0,offsetY:0,color:'#ffcc00',blur:10}
            });
            foods.push(food);
        }

        lastPlatformX += width;

        // Remove old platforms & food
        platforms = platforms.filter(p => {
            if(p.x + p.width < player.x - 800) p.destroy();
            else return true;
        });
        foods = foods.filter(f => {
            if(f.x < player.x - 800) f.destroy();
            else return true;
        });
    }
}

// ===== PLATFORM FUNCTIONS =====
function spawnPlatform(x, y, width){
    const platform = this.add.rectangle(x + width/2, y, width, 40, 0x666666);
    platform.width = width;
    platform.x = x + width/2;
    platforms.push(platform);
}

function getPlatformYUnder(obj){
    let closest = WORLD_HEIGHT;
    platforms.forEach(p=>{
        if(obj.x >= p.x - p.width/2 && obj.x <= p.x + p.width/2){
            closest = p.y;
        }
    });
    return closest;
}

// ===== BUTTONS =====
function createButton(scene,x,y,label,onDown,onUp){
    const btn = scene.add.text(x,y,label,{
        fontSize:'56px',
        backgroundColor:'#ffcc00',
        color:'#000',
        padding:{x:20,y:12},
        stroke:'#000000',
        strokeThickness:6
    }).setScrollFactor(0).setDepth(1000).setInteractive();
    btn.on('pointerdown', onDown);
    btn.on('pointerup', onUp);
    btn.on('pointerout', onUp);
}

// ===== SCIENCE POPUPS =====
function showScienceMessage(scene,text){
    const msg = scene.add.text(scene.cameras.main.scrollX + 400, 100, text,
        {fontSize:'32px',fill:'#00ffff',backgroundColor:'#111',padding:10}
    ).setScrollFactor(0);
    scene.tweens.add({targets:msg,alpha:0,duration:3000,ease:'Power1',onComplete:()=>msg.destroy()});
}
