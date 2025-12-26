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
    this.load.image('azul', 'assets/sprites/azul.png');
    this.load.image('mochkil', 'assets/sprites/mochkil.png');
}

function create() {
    // WORLD SIZE
    this.physics.world.setBounds(0, 0, 1600, 600);

    // GROUND (solid, visible, no tiles)
    platforms = this.physics.add.staticGroup();

    const ground = this.add.rectangle(800, 580, 1600, 40, 0x444444);
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // AZUL (player)
    player = this.physics.add.sprite(100, 450, 'azul');
    player.setScale(0.5);
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    // MOCHKIL (tuxedo kitten 🖤🤍)
    mochkil = this.physics.add.sprite(50, 450, 'mochkil');
    mochkil.setScale(0.5);
    mochkil.setBounce(0.1);
    mochkil.setCollideWorldBounds(true);

    // COLLISIONS
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(mochkil, platforms);

    // INPUT
    cursors = this.input.keyboard.createCursorKeys();

    // CAMERA
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 1600, 600);
}

function update() {
    // PLAYER MOVEMENT
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }

    // MOCHKIL FOLLOW AI
    const followDistance = 60;
    const followSpeed = 120;

    if (Math.abs(player.x - mochkil.x) > followDistance) {
        if (player.x > mochkil.x) {
            mochkil.setVelocityX(followSpeed);
        } else {
            mochkil.setVelocityX(-followSpeed);
        }
    } else {
        mochkil.setVelocityX(0);
    }
}
