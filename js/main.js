const CONTROL_BAR_HEIGHT = 140;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
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
let leftDown = false;
let rightDown = false;
let jumpDown = false;
let ground, foods;

function preload() {}

function create() {
    // =====================
    // WORLD HEIGHT (scene)
    // =====================
    const WORLD_HEIGHT = config.height - CONTROL_BAR_HEIGHT;

    // ===== GROUND =====
    ground = this.add.rectangle(
        1000,
        WORLD_HEIGHT - 20,
        2000,
        40,
        0x666666
    );
    this.physics.add.existing(ground, true);

    // ===== PLAYER (AZUL) =====
    player = this.add.text(100, 200, '🐱', { fontSize: '64px' });
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setBounce(0.2);
    player.body.setSize(40, 40);
    player.body.setOffset(10, 20);

    // ===== MOCHKIL (TUXEDO) =====
    mochkil = this.add.text(30, 200, '🐈‍⬛', { fontSize: '64px' });
    this.physics.add.existing(mochkil);
    mochkil.body.setCollideWorldBounds(true);
    mochkil.body.setBounce(0.3);
    mochkil.body.setSize(40, 40);
    mochkil.body.setOffset(10, 20);

    // ===== FOOD =====
    foods = this.physics.add.group();

    ['🍕', '🌮'].forEach((emoji, i) => {
        const food = this.add.text(400 + i * 200, 0, emoji, {
            fontSize: '48px'
        });
        this.physics.add.existing(food);
        food.body.setBounce(0.6);
        foods.add(food);
    });

    // ===== COLLISIONS =====
    this.physics.add.collider(player, ground);
    this.physics.add.collider(mochkil, ground);
    this.physics.add.collider(foods, ground);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // ===== CAMERA (WORLD ONLY) =====
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 2000, WORLD_HEIGHT);

    // =====================
    // UI CONTROL BAR
    // =====================
    const uiBar = this.add.rectangle(
        config.width / 2,
        WORLD_HEIGHT + CONTROL_BAR_HEIGHT / 2,
        config.width,
        CONTROL_BAR_HEIGHT,
        0x111111
    )
    .setScrollFactor(0)
    .setDepth(500);

    // ===== BUTTONS =====
    const buttonY = WORLD_HEIGHT + 30;

    createButton(this, 80, buttonY, '◀',
        () => leftDown = true,
        () => leftDown = false
    );

    createButton(this, 180, buttonY, '▶',
        () => rightDown = true,
        () => rightDown = false
    );

    createButton(this, config.width - 120, buttonY, '⬆',
        () => jumpDown = true,
        () => jumpDown = false
    );
}

function update() {
    // ===== PLAYER MOVEMENT =====
    if (leftDown) {
        player.body.setVelocityX(-220);
    } else if (rightDown) {
        player.body.setVelocityX(220);
    } else {
        player.body.setVelocityX(0);
    }

    if (jumpDown && player.body.blocked.down) {
        player.body.setVelocityY(-450);
    }

    // ===== MOCHKIL AI =====
    const dx = player.x - mochkil.x;
    if (Math.abs(dx) > 60) {
        mochkil.body.setVelocityX(Math.sign(dx) * 160);
    } else {
        mochkil.body.setVelocityX(0);
    }
}

function eatFood(mochkil, food) {
    food.destroy();
}

function createButton(scene, x, y, label, onDown, onUp) {
    const btn = scene.add.text(x, y, label, {
        fontSize: '56px',
        backgroundColor: '#ffcc00',
        color: '#000',
        padding: { x: 20, y: 12 },
        stroke: '#ff0000',
        strokeThickness: 4
    })
    .setScrollFactor(0)
    .setDepth(1000)
    .setInteractive();

    btn.on('pointerdown', onDown);
    btn.on('pointerup', onUp);
    btn.on('pointerout', onUp);
}
