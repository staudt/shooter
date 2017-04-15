window.onload = function() {

    var sprite;
    var weapon;
    var cursors;
    var buttons;
    var player_speed = 6;

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { 
        preload: function() {
            game.load.image('bullet', 'assets/sprites/bullet.png');
            game.load.image('ship', 'assets/sprites/ship.png');
        },
        create: function() {
            weapon = game.add.weapon(30, 'bullet');
            weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            weapon.bulletSpeed = 600;
            weapon.fireRate = 100;
            weapon.bulletAngleVariance = 8;
            player = this.add.sprite(400, 300, 'ship');
            player.anchor.set(0.5);
            game.physics.arcade.enable(player);

            player.body.maxVelocity.set(400);

            weapon.trackSprite(player, 0, 0, true);
            cursors = this.input.keyboard.createCursorKeys();
            buttons = {
                up: this.input.keyboard.addKey(Phaser.KeyCode.W),
                down: this.input.keyboard.addKey(Phaser.KeyCode.S),
                left: this.input.keyboard.addKey(Phaser.KeyCode.A),
                right: this.input.keyboard.addKey(Phaser.KeyCode.D)
            };
        },
        update: function() {
            player.rotation = game.physics.arcade.angleToPointer(player);
            if (buttons.up.isDown)
            {
                player.y -= player_speed;
            }
            else if (buttons.down.isDown)
            {
                player.y += player_speed;
            }

            if (buttons.left.isDown)
            {
                player.x -= player_speed;
            }
            else if (buttons.right.isDown)
            {
                player.x += player_speed;
            }

            if (game.input.activePointer.isDown)
            {
                weapon.fire();
            }

            game.world.wrap(player, 16);
        },
        render: function() {
        }
    });
};
