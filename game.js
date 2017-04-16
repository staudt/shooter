window.onload = function() {
    var player;
    var map;
    var layer;
    var buttons;
    var door;
    var monsters;
    var gameLevel = 0;
    var remainingMonsters;

    var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-example', { 
        preload: function() {
            game.load.image('bullet', 'assets/sprites/bullet.png');
            game.load.image('door', 'assets/sprites/door.png');
            game.load.spritesheet('player', 'assets/sprites/player.png', 42, 48);
            game.load.spritesheet('skel', 'assets/sprites/monster_skel.png', 39, 48);
            game.load.spritesheet('frank', 'assets/sprites/monster_frank.png', 39, 48);

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

            door = this.add.sprite(200, 200, 'door');
            door.anchor.set(0.5);
            monsters = game.add.group();
            
            player = this.add.sprite(400, 300, 'player');
            player.animations.add('idle_up', [10]);
            player.animations.add('idle_down', [0]);
            player.animations.add('idle_left', [2]);
            player.animations.add('idle_right', [4]);
            player.animations.add('walk_up', [12,13]);
            player.animations.add('walk_down', [8,9]);
            player.animations.add('walk_left', [2,3]);
            player.animations.add('walk_right', [4,5]);
            player.speed = 250;
            player.firePower = 3;
            game.physics.arcade.enable(player);
            player.anchor.set(0.5);
            player.body.collideWorldBounds = true;
            player.weapon = game.add.weapon(30, 'bullet');
            player.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            player.weapon.bulletSpeed = 600;
            player.weapon.fireRate = 100;
            player.weapon.bulletAngleVariance = 6;
            player.weapon.trackSprite(player);
            
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            buttons = {
                up: this.input.keyboard.addKey(Phaser.KeyCode.W),
                down: this.input.keyboard.addKey(Phaser.KeyCode.S),
                left: this.input.keyboard.addKey(Phaser.KeyCode.A),
                right: this.input.keyboard.addKey(Phaser.KeyCode.D)
            };

            nextLevel();
        },




        update: function() {
            if (remainingMonsters <=0) {
                nextLevel();
            };

            player.weapon.fireAngle = Phaser.Math.radToDeg(game.physics.arcade.angleToPointer(player));
            player.bringToTop();
            game.physics.arcade.collide(player, layer);
            game.physics.arcade.collide(player, monsters, function(player, monster) {
                player.body.velocity
            });

            //game.physics.arcade.collide(monsters, monsters);
            game.physics.arcade.collide(player.weapon.bullets, layer, function(bullet, wall) { bullet.kill(); });
            game.physics.arcade.collide(player.weapon.bullets, monsters, function(bullet, monster) {
                bullet.kill();
                monster.hp -= player.firePower;
            });

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

            monsters.forEach(function(monster) {
                if (monster.hp <= 0) {
                    monster.kill();
                    monsters.remove(monster);
                    remainingMonsters -= 1;
                }
                game.physics.arcade.collide(monster, layer);
                game.physics.arcade.collide(monster, player);
                // AI
                game.physics.arcade.moveToObject(monster, player, 180);
            })

        },
        render: function() {
            //game.debug.cameraInfo(game.camera, 32, 32);
        }
    });


    function nextLevel() {
        gameLevel += 1;
        console.log(gameLevel);
        remainingMonsters = gameLevel*3;            
        for (var i=0;i<remainingMonsters; i++) {
            game.time.events.add(Phaser.Timer.SECOND * (i+1)*game.rnd.integerInRange(1, 2)+1, generate_monster, game);
        }
    }

    function generate_monster() {
        var monster = game.add.sprite(door.x, door.y, 'frank');
        game.physics.arcade.enable(monster);
        monster.anchor.set(0.5);
        monster.body.collideWorldBounds = true;
        monster.hp = 10;
        monsters.add(monster);
    }
};
