window.onload = function() {
//game.stage.backgroundColor = '#992d2d';
    var player;
    var enemy;
    var weapon;
    var cursors;
    var buttons;
    var player_speed = 280;

    var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-example', { 
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
            game.physics.arcade.enable(weapon);

            player = this.add.sprite(400, 300, 'ship');
            game.physics.arcade.enable(player);
            player.anchor.set(0.5);
            player.body.collideWorldBounds = true;
            //player.body.maxVelocity = 200;

            enemy = this.add.sprite(600, 400, 'ship');
            game.physics.arcade.enable(enemy);
            enemy.anchor.set(0.5);
            enemy.body.immovable = true;
            //enemy.body.bounce.set(0);
            //enemy.body.collideWorldBounds = true;

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
            game.physics.arcade.collide(player, enemy);

            player.body.velocity.setTo(0, 0);
            if (buttons.up.isDown) {
                player.body.velocity.y = -player_speed;
            }
            else if (buttons.down.isDown) {
                player.body.velocity.y = player_speed;
            }

            if (buttons.left.isDown) {
                player.body.velocity.x = -player_speed;
            }
            else if (buttons.right.isDown) {
                player.body.velocity.x = player_speed;
            }

            if (game.input.activePointer.isDown) {
                weapon.fire();
            }

            game.physics.arcade.overlap(weapon, enemy, function(weapon, enemy) {
                weapon.kill();
                enemy.kill();
            }, null, this);
            //game.world.wrap(player, 16);
        },
        render: function() {
        }
    });
};
