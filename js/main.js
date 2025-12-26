const CONTROL_BAR_HEIGHT = 140;
const WORLD_HEIGHT = 600 - CONTROL_BAR_HEIGHT;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
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
let leftDown = false, rightDown = false, jumpDown = false;
let road, foods;
let idleTime = 0;

function preload() {}

function create() {
    // ---- Smooth Road ----
    road = this.add.rectangle(0, WORLD_HEIGHT - 20, Number.MAX_SAFE_INTEGER, 40, 0x666666)
        .setOrigin(0,0);
    this.physics.add.existing(road, true); // static body

    // ---- Groups ----
    foods = this.physics.add.group();

    const spawnY = WORLD_HEIGHT - 64; // y position on top of road

    // ---- Player Azul ----
    player = this.add.text(100, spawnY, '🐱', { fontSize:'64px', shadow:{offsetX:0, offsetY:0,color:'#00ffff',blur:12} });
    this.physics.add.existing(player);
    setupBody(player, 0.2);

    // ---- Mochkil ----
    mochkil = this.add.text(30, spawnY, '🐈‍⬛', { fontSize:'64px', shadow:{offsetX:0, offsetY:0,color:'#ffffff',blur:10} });
    this.physics.add.existing(mochkil);
    setupBody(mochkil, 0.3);
    mochkil.body.checkCollision.none = true; // prevent blocking Azul

    // ---- Collisions ----
    this.physics.add.collider(player, road);
    this.physics.add.collider(mochkil, road);
    this.physics.add.collider(foods, road);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // ---- Camera follow ----
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,600);

    // ---- UI Bar & Buttons ----
    this.add.rectangle(config.width/2, WORLD_HEIGHT+CONTROL_BAR_HEIGHT/2, config.width, CONTROL_BAR_HEIGHT, 0x111111).setScrollFactor(0).setDepth(500);
    const buttonY = WORLD_HEIGHT + 30;
    createButton(this, 80, buttonY, '◀', ()=>leftDown=true, ()=>leftDown=false);
    createButton(this, 180, buttonY, '▶', ()=>rightDown=true, ()=>rightDown=false);
    createButton(this, config.width-120, buttonY, '⬆', ()=>jumpDown=true, ()=>jumpDown=false);
}

function update() {
    idleTime += 0.05;

    // ---- Player movement ----
    if(leftDown){ player.body.setVelocityX(-220); player.scaleX=-1; }
    else if(rightDown){ player.body.setVelocityX(220); player.scaleX=1; }
    else player.body.setVelocityX(0);
    if(jumpDown && player.body.blocked.down){ player.body.setVelocityY(-450); }

    // ---- Mochkil follow ----
    const followSpeed = 160;
    const dx = player.x - mochkil.x;
    mochkil.body.setVelocityX(Phaser.Math.Clamp(dx,-followSpeed,followSpeed));

    // ---- Idle bounce ----
    if(player.body.blocked.down){ 
        player.y += Math.sin(idleTime)*0.2; 
        mochkil.y += Math.sin(idleTime+1)*0.25; 
    }

    // ---- Spawn food periodically ----
    if(Phaser.Math.Between(0,100) < 2){ // ~2% chance per frame
        const foodX = player.x + Phaser.Math.Between(300,800);
        const food = this.add.text(foodX, WORLD_HEIGHT - 64, Phaser.Math.RND.pick(['🍕','🌮']), { fontSize:'48px', shadow:{offsetX:0,offsetY:0,color:'#ffcc00',blur:10} });
        this.physics.add.existing(food);
        food.body.setBounce(0.7);
        foods.add(food);
    }

    // ---- Remove old food ----
    foods.children.iterate(f => { if(f.x < player.x - 800) f.destroy(); });
}

// ---- Helpers ----
function setupBody(obj,bounce){
    obj.body.setCollideWorldBounds(false);
    obj.body.setBounce(bounce);
    obj.body.setSize(64,64);
    obj.body.setOffset(0,0);
}

function eatFood(mochkil,food){
    this.tweens.add({ targets:food, scale:2, alpha:0, duration:200, onComplete:()=>food.destroy() });
    this.tweens.add({ targets:mochkil, scaleX:1.3, scaleY:1.3, yoyo:true, duration:120 });
}

function createButton(scene,x,y,label,onDown,onUp){
    const btn = scene.add.text(x,y,label,{
        fontSize:'56px',
        backgroundColor:'#ffcc00',
        color:'#000',
        padding:{x:20,y:12},
        stroke:'#000',
        strokeThickness:6
    }).setScrollFactor(0).setDepth(1000).setInteractive();
    btn.on('pointerdown', onDown);
    btn.on('pointerup', onUp);
    btn.on('pointerout', onUp);
}
