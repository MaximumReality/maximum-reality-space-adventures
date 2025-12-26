const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
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

const game = new Phaser.Game(config);

let player;
let mochkil;
let cursors;
let platforms;
let foods;

function preload() {
    // No assets needed
}

function create() {
    // WORLD
    this.physics.world.setBounds(0, 0, 1600, 600);

    // GROUND
    platforms = this.physics.add.staticGroup();
    const ground = this.add.rectangle(800, 580, 1600, 40, 0x444444);
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // AZUL 🐱
    player = this.add.text(100, 450, '🐱', { fontSize: '48px' });
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // MOCHKIL 🐈‍⬛
    mochkil = this.add.text(50, 450, '🐈‍⬛', { fontSize: '48px' });
    this.physics.add.existing(mochkil);
    mochkil.body.setCollideWorldBounds(true);
    this.physics.add.collider(mochkil, platforms);

    // FOOD GROUP 🍕🌮
    foods = this.physics.add.group();

    addFood(this, 400, 520, '🍕');
    addFood(this, 650, 520, '🌮');
    addFood(this, 900, 520, '🍕');
    addFood(this, 1200, 520, '🌮');

    // COLLISIONS
    this.physics.add.collider(foods, platforms);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // INPUT
    cursors = this.input.keyboard.createCursorKeys();

    // CAMERA
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 1600, 600);
}

function addFood(scene, x, y, emoji) {
    const food = scene.add.text(x, y, emoji, { fontSize: '36px' });
    scene.physics.add.existing(food);
    food.body.setBounce(0.3);
    foods.add(food);
}

function eatFood(mochkil, food) {
    food.destroy();

    // Tiny bounce when Mochkil eats
    mochkil.body.setVelocityY(-200);
}

function update() {
    // PLAYER MOVEMENT
    const speed = 200;

    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
    } else {
        player.body.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.body.setVelocityY(-400);
    }

    // MOCHKIL FOLLOW AI
    const followDistance = 60;
    const followSpeed = 120;

    if (Math.abs(player.x - mochkil.x) > followDistance) {
        mochkil.body.setVelocityX(
            player.x > mochkil.x ? followSpeed : -followSpeed
        );
    } else {
        mochkil.body.setVelocityX(0);
    }
}
