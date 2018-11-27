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

function preload(){
    console.log(this);
    this.load.image("background", "../assets/background.png");
    this.load.image("platform", "../assets/platform.png");
    this.load.spritesheet("player", "../assets/player.png", {frameWidth: 24, frameHeight: 24});
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








