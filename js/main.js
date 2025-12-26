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

function preload() {
    // No images needed for emojis
}

function create() {
    // WORLD SIZE
    this.physics.world.setBounds(0, 0, 1600, 600);

    // GROUND (solid gray)
    platforms = this.physics.add.staticGroup();
    const ground = this.add.rectangle(800, 580, 1600, 40, 0x444444);
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // AZUL (🟢 player)
    player = this.add.text(100, 450, '🐱', { fontSize: '48px' });
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // MOCHKIL (🟢 sidekick)
    mochkil = this.add.text(50, 450, '🐈‍⬛', { fontSize: '48px' });
    this.physics.add.existing(mochkil);
    mochkil.body.setCollideWorldBounds(true);
    this.physics.add.collider(mochkil, platforms);

    // INPUT
    cursors = this.input.keyboard.createCursorKeys();

    // CAMERA
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 1600, 600);
}

function update() {
    // PLAYER MOVEMENT
    const speed = 200;
    if (cursors.left.isDown) player.body.setVelocityX(-speed);
    else if (cursors.right.isDown) player.body.setVelocityX(speed);
    else player.body.setVelocityX(0);

    if (cursors.up.isDown && player.body.blocked.down) player.body.setVelocityY(-400);

    // MOCHKIL FOLLOW AI
    const followDistance = 60;
    const followSpeed = 120;

    if (Math.abs(player.x - mochkil.x) > followDistance) {
        if (player.x > mochkil.x) mochkil.body.setVelocityX(followSpeed);
        else mochkil.body.setVelocityX(-followSpeed);
    } else {
        mochkil.body.setVelocityX(0);
    }
}
