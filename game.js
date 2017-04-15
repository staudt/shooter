window.onload = function() {
//game.stage.backgroundColor = '#992d2d';
    var player;
    var map;
    var layer;
    var enemy;
    var weapon;
    var cursors;
    var buttons;
    var stick;
    var player_speed = 280;

    var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-example', { 
        preload: function() {
            game.load.image('bullet', 'assets/sprites/bullet.png');
            game.load.image('player', 'assets/sprites/player.png');
            game.load.image('enemy', 'assets/sprites/monster.png');

            game.load.tilemap('map', 'assets/mapa.csv', null, Phaser.Tilemap.CSV);
            game.load.image('tiles', 'assets/tiles.png');
        },
        create: function() {
            //game.world.setBounds(0, 0, 3000, 1000);
            map = game.add.tilemap('map', 64, 64);
            map.addTilesetImage('tiles');
            layer = map.createLayer(0);
            layer.resizeWorld();
            map.setCollisionBetween(0, 83);

            weapon = game.add.weapon(30, 'bullet');
            weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            weapon.bulletSpeed = 600;
            weapon.fireRate = 100;
            weapon.bulletAngleVariance = 8;
            game.physics.arcade.enable(weapon);

            player = this.add.sprite(400, 300, 'player');
            game.physics.arcade.enable(player);
            player.anchor.set(0.5);
            player.body.collideWorldBounds = true;
            weapon.trackSprite(player, 0, 0, true);

            enemy = this.add.sprite(600, 400, 'enemy');
            game.physics.arcade.enable(enemy);
            enemy.anchor.set(0.5);
            enemy.body.immovable = true;
            //enemy.body.bounce.set(0);
            //enemy.body.collideWorldBounds = true;

            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

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
            game.physics.arcade.collide(player, layer);
            game.physics.arcade.collide(weapon.bullets, layer, function(bullet, wall) { bullet.kill(); });

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

        },
        render: function() {
            game.debug.cameraInfo(game.camera, 32, 32);
        }
    });
};
