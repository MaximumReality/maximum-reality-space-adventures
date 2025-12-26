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

function preload() {}

function create() {
    platforms = this.physics.add.staticGroup();
    foods = this.physics.add.group();

    // Initial platform
    spawnPlatform(this, 0, 580, 400);
    lastPlatformX = 400;

    // Player
    player = this.add.text(100, 450, '🐱', { fontSize: '64px' });
    this.physics.add.existing(player);
    player.body.setBounce(0.2);
    player.body.setCollideWorldBounds(false);

    // Mochkil
    mochkil = this.add.text(50, 450, '🐈‍⬛', { fontSize: '64px' });
    this.physics.add.existing(mochkil);
    mochkil.body.setBounce(0.2);
    mochkil.body.checkCollision.none = true;

    // Colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(mochkil, platforms);
    this.physics.add.collider(foods, platforms);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // Cursors
    cursors = this.input.keyboard.createCursorKeys();

    // Camera follow
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 600);
}

function update() {
    // Player movement
    if (cursors.left.isDown) player.body.setVelocityX(-200);
    else if (cursors.right.isDown) player.body.setVelocityX(200);
    else player.body.setVelocityX(0);

    if (cursors.up.isDown && player.body.touching.down) player.body.setVelocityY(-400);

    // Mochkil horizontal AI
    const dx = player.x - mochkil.x;
    const speed = 120;
    if (Math.abs(dx) > 5) {
        mochkil.body.setVelocityX(dx > 0 ? speed : -speed);
    } else {
        mochkil.body.setVelocityX(0);
    }

    // Spawn new platforms ahead
    while (player.x + 600 > lastPlatformX) {
        const width = Phaser.Math.Between(150, 250);
        const y = Phaser.Math.Between(500, 580);
        spawnPlatform(this, lastPlatformX, y, width);

        // Random food
        if (Phaser.Math.Between(0, 1)) {
            const food = this.add.text(lastPlatformX + width/2, y - 40, Phaser.Math.RND.pick(['🍕','🌮']), { fontSize: '48px' });
            this.physics.add.existing(food);
            food.body.setGravityY(800);
            foods.add(food);
        }

        lastPlatformX += width;

        // Remove old platforms
        platforms.children.iterate(p => {
            if (p.x + p.displayWidth < player.x - 800) p.destroy();
        });
        foods.children.iterate(f => {
            if (f.x < player.x - 800) f.destroy();
        });
    }
}

function spawnPlatform(scene, x, y, width) {
    const platform = scene.add.rectangle(x + width/2, y, width, 20, 0x666666);
    scene.physics.add.existing(platform, true); // static body
    platforms.add(platform);
}

function eatFood(mochkil, food) {
    food.destroy();
}
