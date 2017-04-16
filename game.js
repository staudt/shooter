window.onload = function() {
    var player;
    var map;
    var layer;
    var buttons;
    var door;
    var monsters;
    var gameLevel = 0;
    var remainingMonsters;
    var healthbar;
    var scoreText;
    var gameOverText;
    var LevelText;

    var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-example', { 
        preload: function() {
            game.load.image('bullet', 'assets/sprites/bullet.png');
            game.load.image('bullet_monster', 'assets/sprites/bullet_monster.png');
            game.load.image('door', 'assets/sprites/door.png');
            game.load.spritesheet('player', 'assets/sprites/player.png', 42, 48);
            game.load.spritesheet('skel', 'assets/sprites/monster_skel.png', 42, 48);
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
            
            player = this.add.sprite(600, 360, 'player');
            player.animations.add('idle_up', [10]);
            player.animations.add('idle_down', [0]);
            player.animations.add('idle_left', [2]);
            player.animations.add('idle_right', [4]);
            player.animations.add('walk_up', [12,13]);
            player.animations.add('walk_down', [8,9]);
            player.animations.add('walk_left', [2,3]);
            player.animations.add('walk_right', [4,5]);
            player.hp = 100;
            player.speed = 250;
            player.score = 0;
            player.firePower = 3;
            game.physics.arcade.enable(player);
            player.anchor.set(0.5);
            player.body.collideWorldBounds = true;
            player.weapon = game.add.weapon(20, 'bullet');
            player.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            player.weapon.bulletSpeed = 500;
            player.weapon.fireRate = 300;
            player.weapon.bulletAngleVariance = 6;
            player.weapon.trackSprite(player);
            
            floor = new Phaser.Rectangle(0, 550, 800, 50);

            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            buttons = {
                up: this.input.keyboard.addKey(Phaser.KeyCode.W),
                down: this.input.keyboard.addKey(Phaser.KeyCode.S),
                left: this.input.keyboard.addKey(Phaser.KeyCode.A),
                right: this.input.keyboard.addKey(Phaser.KeyCode.D)
            };

            healthbar = game.add.graphics();
            healthbar.fixedToCamera = true;

            gameOverText = game.add.text(game.camera.x + (game.width/2), game.camera.y + (game.height/2), "GAME OVER", { font: "bold 60px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });
            gameOverText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            gameOverText.setTextBounds(0, 0, 0, 0);
            gameOverText.fixedToCamera = true;
            gameOverText.visible = false;

            scoreText = game.add.text(game.camera.x + (game.width/2), 40, "Score: 0", { font: "bold 24px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });
            scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            scoreText.setTextBounds(0, 0, 0, 0);
            scoreText.fixedToCamera = true;

            levelText = game.add.text(game.camera.x + (game.width/2), game.camera.y + (game.height/2), "Level 1", { font: "bold 60px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });
            levelText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            levelText.setTextBounds(0, 0, 0, 0);
            levelText.fixedToCamera = true;
            levelText.visible = false;
            nextLevel();
            player.bringToTop();
        },




        update: function() {        
            update_healthbar();
            player.weapon.fireAngle = Phaser.Math.radToDeg(game.physics.arcade.angleToPointer(player));

            game.physics.arcade.collide(player, layer);
            game.physics.arcade.collide(monsters, monsters);
            game.physics.arcade.collide(player.weapon.bullets, layer, function(bullet, wall) { bullet.kill(); });
            game.physics.arcade.collide(player.weapon.bullets, monsters, function(bullet, monster) {
                bullet.kill();
                monster.hp -= player.firePower;
                player.score += 10;
            });
            game.physics.arcade.collide(monsters, layer, function(monster, layer) {
                monster.reel = 30;
                game.physics.arcade.moveToXY(monster, game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.height), monster.speed);
            });
            game.physics.arcade.collide(player, monsters, function(player, monster) {
                game.camera.shake(0.005, 20);
                player.hp -= 2;
            });
            
            if (player.hp <= 0) {
                player.kill();
                gameOverText.visible = true;
                return;
            }
            
            if (remainingMonsters <=0) {
                nextLevel();
            };

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
            //player.animations.play('walk_'+getDirection(player.weapon.fireAngle), 12, true);

            monsters.forEach(function(monster) {
                if (monster.hp <= 0) {
                    monster.kill();
                    monsters.remove(monster);
                    remainingMonsters -= 1;
                    if (monster.type == 'frank') {
                        player.score += 20;
                    } else {
                        player.score += 30;
                    }
                }
                // AI
                angle = Phaser.Math.radToDeg(game.physics.arcade.angleBetween(monster, player));
                if (monster.reel<=0) {
                    game.physics.arcade.moveToObject(monster, player, monster.speed);
                } else {
                    monster.reel -= 1;
                }
                if (monster.type == 'skel') {
                    monster.weapon.fireAngle = angle;
                    monster.weapon.fire();
                    game.physics.arcade.collide(player, monster.weapon.bullets, function(player, bullet) {
                        bullet.kill();
                        game.camera.shake(0.01, 50);
                        player.hp -= 20;
                    });
                }
                monster.animations.play('walk_'+getDirection(angle), 12, true);
            })
            scoreText.setText('Score: ' + player.score);

        },
        render: function() {
            //game.debug.cameraInfo(game.camera, 32, 32);
        }
    });


    function nextLevel() {
        gameLevel += 1;
        player.hp += 15;
        if (player.hp > 100)
            player.hp = 100;
        showLevelText();
        remainingMonsters = gameLevel*3;            
        for (var i=0;i<remainingMonsters; i++) {
            game.time.events.add(Phaser.Timer.SECOND * (i+1)*game.rnd.integerInRange(1, 2)+1, generate_monster, game);
        }
    }

    function generate_monster() {
        if (game.rnd.integerInRange(1, 3) < 3) {
            var monster = game.add.sprite(door.x, door.y, 'frank');
            monster.animations.add('walk_down', [1,2]);
            monster.animations.add('walk_up', [3,4]);
            monster.animations.add('walk_left', [7,8]);
            monster.animations.add('walk_right', [5,6]);
            monster.hp = 15;
            monster.speed = 180;
            monster.type = 'frank';
        } else {
            var monster = game.add.sprite(door.x, door.y, 'skel');
            monster.animations.add('walk_down', [1,2]);
            monster.animations.add('walk_up', [4,5]);
            monster.animations.add('walk_left', [8,9]);
            monster.animations.add('walk_right', [6,7]);
            monster.hp = 36;
            monster.speed = 70;
            monster.type = 'skel';

            monster.weapon = game.add.weapon(2, 'bullet_monster');
            monster.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            monster.weapon.bulletSpeed = 350;
            monster.weapon.fireRate = 600;
            monster.weapon.bulletAngleVariance = 8;
            monster.weapon.trackSprite(monster);            
        }
        monster.reel = 0;
        game.physics.arcade.enable(monster);
        monster.anchor.set(0.5);
        monster.body.collideWorldBounds = true;
        monsters.add(monster);
    }

    function update_healthbar() {
        healthbar.clear()
        healthbar.beginFill(0x000000, 0.2);
        healthbar.drawRect(60, 30, 250, 30);
        healthbar.beginFill((player.hp <= 20 ? 0xaa0000 : 0x505099), 1);
        healthbar.drawRect(60, 30, player.hp>0 ? (250*player.hp)/100 : 0, 30);
    }

    function showLevelText() {
        levelText.setText('Level ' + gameLevel);
        levelText.visible = true;
        game.time.events.add(Phaser.Timer.SECOND * 2, hideLevelText, game);
        levelText.bringToTop();
    }

    function hideLevelText() {
        levelText.visible = false;
    }

    function getDirection(vangle) {
        angle = parseInt(vangle);
        if (angle < 45 && angle >- 45) {
            return 'right';
        } else if (angle < -45 && angle > -135) {
            return 'up';
        } else if (angle > -135 && angle < 135) {
            return 'down';
        }
        return 'left';
    }

};
