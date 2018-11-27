console.log("I am connected");

var config = {
    width: 512,
    height: 512,
    type: Phaser.AUTO,
    
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    
    physics: {
        default: 'arcade',
        
        arcade: {
            gravity: {y: 350}
        }
    },
    
    pixelArt: true
}

var game = new Phaser.Game(config);
var platforms;
var player;
var cursors;
var jewels;
var score = 0;
var skulls;
var scoreText;

function preload(){
    console.log(this);
    this.load.image("background", "../assets/background.png");
    this.load.image("platform", "../assets/platform.png");
    this.load.spritesheet("player", "../assets/player.png", {frameWidth: 24, frameHeight: 24});
    this.load.image("jewel", "../assets/jewel.png");
    this.load.image("skull", "../assets/skull.png");
}

function create(){
    var background = this.add.image(config.width/2, config.height/2, "background");    
    background.setScale(2.2, 2.5);
    
    platforms = this.physics.add.staticGroup();
    platforms.create(300, 300, "platform");    
    //platforms.create(100, 300, "platform");    
    var floor = platforms.create(config.width/2, config.height-16, "platform");
    console.log(floor);
    floor.setScale(2.8, 2).refreshBody();
    
    
    player = this.physics.add.sprite(100, 100, "player", 1);
    player.setCollideWorldBounds(true);
    
    this.physics.add.collider(player, platforms);
    
    cursors = this.input.keyboard.createCursorKeys();
    
    this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers("player", {start: 4, end: 10}),
        repeat: -1,
        frameRate: 15
    });
    
    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("player", {frames:[1,4]}),
        repeat: -1,
        frameRate: 3
    });
    
    jewels = this.physics.add.group({
        key: "jewel",
        setXY: {x: 16, y: 16, stepX: 50},
        repeat: 8
    });
    
    jewels.children.iterate(function(jewel){
        jewel.setBounce(Math.random() + 0.3);
    });
    
    this.physics.add.collider(jewels, platforms);
    this.physics.add.overlap(player, jewels, pickUpJewel);
    
    skulls = this.physics.add.group();
    this.physics.add.collider(skulls, platforms);
    createSkull();
    
    this.physics.add.overlap(player, skulls, killPlayer);
    
    scoreText = this.add.text(10,10, 'Score: 0', {fontSize: '32px', fill: '#000'});
}

function update(){
    if(cursors.right.isDown){
        player.body.setVelocityX(100);
        player.anims.play("walk", true);
        player.flipX = false;
    } else if(cursors.left.isDown){
        player.body.setVelocityX(-100);
        player.anims.play("walk", true);
        player.flipX = true;
    } else {
        player.body.setVelocityX(0);
        player.anims.play("idle", true);
    }
    
    if(cursors.space.isDown && player.body.touching.down){
        player.body.setVelocityY(-400);
    }
}

function pickUpJewel(player, jewel){
    score++;
    scoreText.setText("Score: " + score);
    jewel.disableBody(true, true);
    
    if(jewels.countActive() === 0){
        jewels.children.iterate(function(jewel){
            jewel.enableBody(true, jewel.x, 16, true, true);
            jewel.setBounce(Math.random() + 0.3);
        }); 
        
        createSkull();
    }
}

function createSkull(){
    var skull = skulls.create(300, 16, "skull");
    skull.setCollideWorldBounds(true);
    skull.setBounce(1);
    skull.setVelocityX(Math.random()*200);
}

function killPlayer(){
    this.physics.pause();
    player.setTint("#000000");
}
















