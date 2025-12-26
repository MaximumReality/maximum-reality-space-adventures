const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
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
let cursors;
let platforms;
let foods;
let lastPlatformX = 0;
const PLATFORM_WIDTH = 200;

function preload() {}

function create() {
    // Platforms
    platforms = this.physics.add.staticGroup();

    // Initial platform
    spawnPlatform(this, 0, 580, PLATFORM_WIDTH);
    lastPlatformX = PLATFORM_WIDTH;

    // Player
    player = this.physics.add.sprite(100, 450, null);
    player.setDisplaySize(64, 64);
    player.setBounce(0.2);
    player.setCollideWorldBounds(false);

    // Mochkil
    mochkil = this.physics.add.sprite(50, 450, null);
    mochkil.setDisplaySize(64, 64);
    mochkil.setBounce(0.2);
    mochkil.body.checkCollision.none = true; // doesn’t block player

    // Food group
    foods = this.physics.add.group();

    // Colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(mochkil, platforms);
    this.physics.add.collider(foods, platforms);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // Cursors
    cursors = this.input.keyboard.createCursorKeys();

    // Camera
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 600);
}

function update() {
    // Player movement
    if (cursors.left.isDown) player.setVelocityX(-200);
    else if (cursors.right.isDown) player.setVelocityX(200);
    else player.setVelocityX(0);

    if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-400);

    // Mochkil AI horizontal follow
    const speed = 120;
    if (Math.abs(player.x - mochkil.x) > 5) {
        mochkil.setVelocityX(player.x > mochkil.x ? speed : -speed);
    } else {
        mochkil.setVelocityX(0);
    }

    // Spawn new platforms ahead
    while (player.x + 600 > lastPlatformX) {
        const y = Phaser.Math.Between(500, 580);
        const width = Phaser.Math.Between(150, 250);
        spawnPlatform(this, lastPlatformX, y, width);

        // Random food
        if (Phaser.Math.Between(0, 1)) {
            const food = this.physics.add.sprite(lastPlatformX + width/2, y - 40, null);
            food.setDisplaySize(48, 48);
            food.setGravityY(800);
            foods.add(food);
        }

        lastPlatformX += width;
    }

    // Remove old platforms/food
    platforms.children.iterate(p => {
        if (p.x + p.displayWidth < player.x - 800) p.destroy();
    });
    foods.children.iterate(f => {
        if (f.x < player.x - 800) f.destroy();
    });
}

function spawnPlatform(scene, x, y, width) {
    const platform = scene.add.rectangle(x + width/2, y, width, 20, 0x666666);
    scene.physics.add.existing(platform, true);
    platform.body.setSize(width, 20);
    platforms.add(platform);
}

function eatFood(mochkil, food) {
    food.destroy();
}
