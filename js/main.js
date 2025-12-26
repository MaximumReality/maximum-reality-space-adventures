ground = this.add.rectangle(
    1000,
    config.height - CONTROL_BAR_HEIGHT - 20,
    2000,
    40,
    0x666666
);
this.physics.add.existing(ground, true);
