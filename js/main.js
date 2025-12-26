const CONTROL_BAR_HEIGHT = 140;
const WORLD_WIDTH = 2000;

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
let idleTime = 0;

function preload() {}

function create() {
    const WORLD_HEIGHT = config.height - CONTROL_BAR_HEIGHT;

    // ✅ FIX: SET PHYSICS WORLD SIZE
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // ===== GROUND =====
    ground = this.add.rectangle(
        WORLD_WIDTH / 2,
        WORLD_HEIGHT - 20,
        WORLD_WIDTH,
        40,
        0x666666
    );
    this.physics.add.existing(ground, true);

    // ===== PLAYER (AZUL) =====
    player = this.add.text(100, 200, '🐱', {
        fontSize: '64px',
        shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 12 }
    });
    this.physics.add.existing(player);
    setupBody(player, 0.2);

    // ===== MOCHKIL (TUXEDO) =====
    mochkil = this.add.text(30, 200, '🐈‍⬛', {
        fontSize: '64px',
        shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
    });
    this.physics.add.existing(mochkil);
    setupBody(mochkil, 0.3);

    // ===== FOOD =====
    foods = this.physics.add.group();

    ['🍕', '🌮'].forEach((emoji, i) => {
        const food = this.add.text(400 + i * 300, 0, emoji, {
            fontSize: '48px',
            shadow: { offsetX: 0, offsetY: 0, color: '#ffcc00', blur: 10 }
        });
        this.physics.add.existing(food);
        food.body.setBounce(0.7);
        foods.add(food);
    });

    // ===== COLLISIONS =====
    this.physics.add.collider(player, ground);
    this.physics.add.collider(mochkil, ground);
    this.physics.add.collider(foods, ground);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // ===== CAMERA =====
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // ===== UI BAR =====
    this.add.rectangle(
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

    createButton(this, 80, buttonY, '◀', () => leftDown = true, () => leftDown = false);
    createButton(this, 180, buttonY, '▶', () => rightDown = true, () => rightDown = false);
    createButton(this, config.width - 120, buttonY, '⬆', () => jumpDown = true, () => jumpDown = false);
}

function update() {
    idleTime += 0.05;

    // ===== PLAYER MOVE =====
    if (leftDown) {
        player.body.setVelocityX(-220);
        player.scaleX = -1;
    } else if (rightDown) {
        player.body.setVelocityX(220);
        player.scaleX = 1;
    } else {
        player.body.setVelocityX(0);
    }

    if (jumpDown && player.body.blocked.down) {
        player.body.setVelocityY(-450);
        this.cameras.main.shake(120, 0.004);
    }

    // ===== MOCHKIL AI =====
    const dx = player.x - mochkil.x;
    mochkil.body.setVelocityX(Math.abs(dx) > 60 ? Math.sign(dx) * 160 : 0);

    // ===== IDLE BOUNCE =====
    if (player.body.blocked.down) {
        player.y += Math.sin(idleTime) * 0.2;
        mochkil.y += Math.sin(idleTime + 1) * 0.25;
    }
}

function eatFood(mochkil, food) {
    this.tweens.add({
        targets: food,
        scale: 2,
        alpha: 0,
        duration: 200,
        onComplete: () => food.destroy()
    });

    this.tweens.add({
        targets: mochkil,
        scaleX: 1.3,
        scaleY: 1.3,
        yoyo: true,
        duration: 120
    });
}

function setupBody(obj, bounce) {
    obj.body.setCollideWorldBounds(true);
    obj.body.setBounce(bounce);
    obj.body.setSize(40, 40);
    obj.body.setOffset(10, 20);
}

function createButton(scene, x, y, label, onDown, onUp) {
    const btn = scene.add.text(x, y, label, {
        fontSize: '56px',
        backgroundColor: '#ffcc00',
        color: '#000',
        padding: { x: 20, y: 12 },
        stroke: '#000000',
        strokeThickness: 6
    })
    .setScrollFactor(0)
    .setDepth(1000)
    .setInteractive();

    btn.on('pointerdown', onDown);
    btn.on('pointerup', onUp);
    btn.on('pointerout', onUp);
}
