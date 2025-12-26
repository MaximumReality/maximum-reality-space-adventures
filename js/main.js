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
let platforms;
let foods;

// TOUCH STATE
let moveLeft = false;
let moveRight = false;
let jump = false;

function preload() {}

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

    // FOOD 🍕🌮
    foods = this.physics.add.group();
    addFood(this, 400, 520, '🍕');
    addFood(this, 700, 520, '🌮');
    addFood(this, 1000, 520, '🍕');

    this.physics.add.collider(foods, platforms);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // CAMERA
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 1600, 600);

    // TOUCH CONTROLS
    createButton(this, 80, 520, '◀', () => moveLeft = true, () => moveLeft = false);
    createButton(this, 180, 520, '▶', () => moveRight = true, () => moveRight = false);
    createButton(this, 720, 520, '⬆', () => jump = true, () => jump = false);
}

function createButton(scene, x, y, label, onDown, onUp) {
    const btn = scene.add.text(x, y, label, {
        fontSize: '48px',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setInteractive();

    btn.on('pointerdown', onDown);
    btn.on('pointerup', onUp);
    btn.on('pointerout', onUp);
}

function addFood(scene, x, y, emoji) {
    const food = scene.add.text(x, y, emoji, { fontSize: '36px' });
    scene.physics.add.existing(food);
    food.body.setBounce(0.3);
    foods.add(food);
}

function eatFood(mochkil, food) {
    food.destroy();
    mochkil.body.setVelocityY(-200);
}

function update() {
    const speed = 200;

    // PLAYER MOVEMENT (TOUCH)
    if (moveLeft) {
        player.body.setVelocityX(-speed);
    } else if (moveRight) {
        player.body.setVelocityX(speed);
    } else {
        player.body.setVelocityX(0);
    }

    if (jump && player.body.blocked.down) {
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
