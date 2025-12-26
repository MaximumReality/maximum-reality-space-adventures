const CONTROL_BAR_HEIGHT = 140;
const WORLD_HEIGHT = 600 - CONTROL_BAR_HEIGHT;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222222', // visible background
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
let platforms, foods;
let lastPlatformX = 0;
let idleTime = 0;

// Define space zones
const spaceZones = [
    { start: 800, end: 1400 },
    { start: 2200, end: 2800 },
];

function preload() {}

function create() {
    // Groups
    platforms = this.physics.add.staticGroup();
    foods = this.physics.add.group();

    // Initial platform
    const initialPlatformY = WORLD_HEIGHT - 60;
    spawnPlatform(this, 0, initialPlatformY, 400);
    lastPlatformX = 400;

    // Player (Azul)
    player = this.add.text(100, initialPlatformY - 64, '🐱', {
        fontSize: '64px',
        shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 12 }
    });
    this.physics.add.existing(player);
    setupBody(player, 0.2);
    player.inSpace = false;

    // Mochkil (Tuxedo)
    mochkil = this.add.text(30, initialPlatformY - 64, '🐈‍⬛', {
        fontSize: '64px',
        shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 10 }
    });
    this.physics.add.existing(mochkil);
    setupBody(mochkil, 0.3);
    mochkil.body.checkCollision.none = true;

    // Collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(mochkil, platforms);
    this.physics.add.collider(foods, platforms);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // Camera follow
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 600);

    // UI Bar
    this.add.rectangle(
        config.width / 2,
        WORLD_HEIGHT + CONTROL_BAR_HEIGHT / 2,
        config.width,
        CONTROL_BAR_HEIGHT,
        0x111111
    ).setScrollFactor(0).setDepth(500);

    // Buttons below the game
    const buttonY = WORLD_HEIGHT + 30;
    createButton(this, 80, buttonY, '◀', () => leftDown = true, () => leftDown = false);
    createButton(this, 180, buttonY, '▶', () => rightDown = true, () => rightDown = false);
    createButton(this, config.width - 120, buttonY, '⬆', () => jumpDown = true, () => jumpDown = false);
}

function update() {
    idleTime += 0.05;

    // SPACE ZONES
    let inSpace = false;
    spaceZones.forEach(zone => {
        if (player.x >= zone.start && player.x <= zone.end) inSpace = true;
    });
    player.body.gravity.y = inSpace ? 300 : 900;
    mochkil.body.gravity.y = inSpace ? 300 : 900;

    if (inSpace && !player.inSpace) {
        showScienceMessage(this, "In space, gravity is weaker!");
    }
    player.inSpace = inSpace;

    // PLAYER MOVEMENT
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

    // MOCHKIL AI
    const followSpeed = 160;
    const dx = player.x - mochkil.x;
    mochkil.body.setVelocityX(Phaser.Math.Clamp(dx, -followSpeed, followSpeed));

    // Idle bounce
    if (player.body.blocked.down) {
        player.y += Math.sin(idleTime) * 0.2;
        mochkil.y += Math.sin(idleTime + 1) * 0.25;
    }

    // SPAWN NEW PLATFORMS & FOOD
    if (player.x + 600 > lastPlatformX) {
        const width = Phaser.Math.Between(200, 400);
        const newY = Phaser.Math.Clamp(WORLD_HEIGHT - Phaser.Math.Between(40, 80), 300, WORLD_HEIGHT - 40);
        spawnPlatform(this, lastPlatformX, newY, width);

        // Random food
        if (Phaser.Math.Between(0,1)) {
            const food = this.add.text(lastPlatformX + width/2, newY - 50, Phaser.Math.RND.pick(['🍕','🌮']), {
                fontSize: '48px',
                shadow: { offsetX: 0, offsetY: 0, color: '#ffcc00', blur: 10 }
            });
            this.physics.add.existing(food);
            food.body.setBounce(0.7);
            foods.add(food);
        }

        lastPlatformX += width;

        // Remove old platforms and food
        platforms.children.iterate(p => { if (p.x + p.width/2 < player.x - 800) p.destroy(); });
        foods.children.iterate(f => { if (f.x < player.x - 800) f.destroy(); });
    }
}

// HELPERS
function spawnPlatform(scene, x, y, width = 200) {
    const platform = scene.add.rectangle(x + width/2, y, width, 40, 0x666666);
    scene.physics.add.existing(platform, true);
    platforms.add(platform);
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
    obj.body.setCollideWorldBounds(false);
    obj.body.setBounce(bounce);
    obj.body.setSize(64, 64);
    obj.body.setOffset(0, 0);
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

function showScienceMessage(scene, text) {
    const msg = scene.add.text(
        scene.cameras.main.scrollX + 400,
        100,
        text,
        { fontSize: '32px', fill: '#00ffff', backgroundColor: '#111', padding: 10 }
    ).setScrollFactor(0);
    scene.tweens.add({
        targets: msg,
        alpha: 0,
        duration: 3000,
        ease: 'Power1',
        onComplete: () => msg.destroy()
    });
}const CONTROL_BAR_HEIGHT = 140;
const WORLD_HEIGHT = 600 - CONTROL_BAR_HEIGHT;

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
let platforms, foods;
let idleTime = 0;
let lastPlatformX = 0;

function preload() {}

function create() {
    // ✅ Infinite world
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, WORLD_HEIGHT);

    // ===== GROUPS =====
    platforms = this.physics.add.staticGroup();
    foods = this.physics.add.group();

    // ===== INITIAL PLATFORM =====
    spawnPlatform(this, 0, WORLD_HEIGHT - 20, 400);
    lastPlatformX = 400;

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

    // ===== COLLISIONS =====
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(mochkil, platforms);
    this.physics.add.collider(foods, platforms);
    this.physics.add.overlap(mochkil, foods, eatFood, null, this);

    // ===== CAMERA =====
    this.cameras.main.startFollow(player);

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

    // ===== SPAWN NEW PLATFORM =====
    if (player.x + 600 > lastPlatformX) {
        const width = Phaser.Math.Between(200, 400);
        const heightOffset = Phaser.Math.Between(-50, 50);
        const newY = Phaser.Math.Clamp(WORLD_HEIGHT - 20 + heightOffset, 300, WORLD_HEIGHT - 20);
        spawnPlatform(this, lastPlatformX, newY, width);
        lastPlatformX += width;

        // Random food on platform
        if (Phaser.Math.Between(0,1)) {
            const food = this.add.text(lastPlatformX - width/2, newY - 50, Phaser.Math.RND.pick(['🍕','🌮']), {
                fontSize: '48px',
                shadow: { offsetX: 0, offsetY: 0, color: '#ffcc00', blur: 10 }
            });
            this.physics.add.existing(food);
            food.body.setBounce(0.7);
            foods.add(food);
        }

        // Remove old platforms to save memory
        platforms.children.iterate(p => {
            if (p.x + p.width/2 < player.x - 800) p.destroy();
        });

        foods.children.iterate(f => {
            if (f.x < player.x - 800) f.destroy();
        });
    }
}

function spawnPlatform(scene, x, y, width = 200) {
    const platform = scene.add.rectangle(x + width/2, y, width, 40, 0x666666);
    scene.physics.add.existing(platform, true);
    platforms.add(platform);
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
    obj.body.setCollideWorldBounds(false); // allow infinite scroll
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
