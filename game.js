window.onload = function() {
    var player;
    var map;
    var layer;
    var enemy;
    var buttons;

    var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-example', { 
        preload: function() {
            game.load.image('bullet', 'assets/sprites/bullet.png');
            game.load.spritesheet('player', 'assets/sprites/player.png', 42, 48);
            game.load.image('enemy', 'assets/sprites/monster.png');

            game.load.tilemap('map', 'assets/mapa.csv', null, Phaser.Tilemap.CSV);
            game.load.image('tiles', 'assets/tiles.png');
        },
        create: function() {
            map = game.add.tilemap('map', 64, 64);
            map.addTilesetImage('tiles');
            layer = map.createLayer(0);
            layer.resizeWorld();
            map.setCollisionBetween(0, 11);
            map.setCollisionBetween(16, 24);

            player = this.add.sprite(400, 300, 'player');
            player.animations.add('idle_up', [10]);
            player.animations.add('idle_down', [0]);
            player.animations.add('idle_left', [2]);
            player.animations.add('idle_right', [4]);
            player.animations.add('walk_up', [12,13]);
            player.animations.add('walk_down', [8,9]);
            player.animations.add('walk_left', [2,3]);
            player.animations.add('walk_right', [4,5]);
            player.speed = 200;
            game.physics.arcade.enable(player);
            player.anchor.set(0.5);
            player.body.collideWorldBounds = true;
            player.weapon = game.add.weapon(30, 'bullet');
            player.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            player.weapon.bulletSpeed = 600;
            player.weapon.fireRate = 100;
            player.weapon.bulletAngleVariance = 6;
            player.weapon.trackSprite(player, 0, 0, true);

            game.physics.arcade.enable(player.weapon);
            enemy = this.add.sprite(600, 400, 'enemy');
            game.physics.arcade.enable(enemy);
            enemy.anchor.set(0.5);
            enemy.body.immovable = true;

            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            buttons = {
                up: this.input.keyboard.addKey(Phaser.KeyCode.W),
                down: this.input.keyboard.addKey(Phaser.KeyCode.S),
                left: this.input.keyboard.addKey(Phaser.KeyCode.A),
                right: this.input.keyboard.addKey(Phaser.KeyCode.D)
            };
        },
        update: function() {
            direction = Number(game.physics.arcade.angleToPointer(player));
            
            game.physics.arcade.collide(player, enemy);
            game.physics.arcade.collide(player, layer);
            game.physics.arcade.collide(player.weapon.bullets, layer, function(bullet, wall) { bullet.kill(); });

            player.body.velocity.setTo(0, 0);
            if (buttons.up.isDown) {
                player.body.velocity.y = -player.speed;
            } else if (buttons.down.isDown) {
                player.body.velocity.y = player.speed;
            }

            if (buttons.left.isDown) {
                player.body.velocity.x = -player.speed;
            } else if (buttons.right.isDown) {
                player.body.velocity.x = player.speed;
            }

            if (game.input.activePointer.isDown) {
                player.weapon.fire();
            }

        },
        render: function() {
            //game.debug.cameraInfo(game.camera, 32, 32);
        }
    });

};
