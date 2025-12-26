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
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player, mochkil, cursors, platforms;

function preload() {
    this.load.image('tiles', 'assets/sprites/tileset.png');
    this.load.image('azul', 'assets/sprites/azul.png');
    this.load.image('mochkil', 'assets/sprites/mochkil_tuxedo.png');
}

function create() {
    // Simple scrolling background / platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'tiles').setScale(50, 1).refreshBody(); // Ground
    platforms.create(600, 450, 'tiles');
    platforms.create(200, 350, 'tiles');

    // Player (Azul)
    player = this.physics.add.sprite(100, 450, 'azul');
    player.setScale(0.5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    this.physics.add.collider(player, platforms);

    // Mochkil (tuxedo kitten)
    mochkil = this.physics.add.sprite(50, 450, 'mochkil');
    mochkil.setScale(0.5);
    mochkil.setBounce(0.2);
    mochkil.setCollideWorldBounds(true);
    
    this.physics.add.collider(mochkil, platforms);

    // AI follow behavior
    mochkil.update = function() {
        const speed = 100;
        if (Math.abs(player.x - mochkil.x) > 50) {
            if (player.x > mochkil.x) mochkil.setVelocityX(speed);
            else mochkil.setVelocityX(-speed);
        } else {
            mochkil.setVelocityX(0);
        }
    };

    // Cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    // Camera follow
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 1600, 600);
}

function update() {
    // Player movement
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

    // Mochkil AI update
    mochkil.update();
}
