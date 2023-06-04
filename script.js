import NovicePlayer from './novicePlayer.js';
import VeteranPlayer from './veteranPlayer.js';


class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }
    preload(){
        this.load.image('dude', 'assets/ewok.png');
        this.load.spritesheet('vet', 'assets/Player/Veteran_Sheet_02.png', { frameWidth: 55, frameHeight: 90 });
        this.load.spritesheet('nov', 'assets/Player/Novice_Sheet_02.png', { frameWidth: 50, frameHeight: 76});
        this.load.image('noviceHouse', 'assets/oasishouse-3.png');
        this.load.image('veteranHouse', 'assets/deserthouse-3.png');
        this.load.image('diaBox', 'assets/UIAssets/Text_Box.png');
        this.load.image('civBubble', 'assets/UIAssets/Blurb_Civilians.png');
        this.load.image('novicePortrait', 'assets/Player/NoviceMCPort.png');
        this.load.image('npcCiv1', 'assets/NPC/CivilianNPC_01.png');
        this.load.image('npcCiv1Portrait', 'assets/NPC/CivilianNPCport_01.png');
        this.load.image('npcCiv2', 'assets/NPC/CivilianNPC_02.png');
        this.load.image('npcCiv2Portrait', 'assets/NPC/CivilianNPCport_02.png');
    }
    create(){
        //this.cameras.main.setBackgroundColor(0x00ff00);
        this.scale.setZoom(0.8);

        this.scene.launch('Novice');
        this.scene.launch('Veteran');
        // this.addFullScreen();

        // this.add.text(500,200, "The Last Extraction").setTint(0xaa00aa).setFontSize(75);
        // let start = this.add.text(800,500, "Start").setTint(0xaa00aa).setFontSize(75)
        // .setInteractive();
        
        // start.on('pointerdown', () => {
        //     this.cameras.main.fade(1000, 0,0,0);
        //     this.time.delayedCall(1000, () => {
        //         this.scene.launch('Novice');
        //         this.scene.launch('Veteran');
        // });
        // });

        

    }
    update(){
        //this.player.update();
    }

    addFullScreen(){
        this.input.keyboard.on('keydown-ESC',  () => {
            // Set the zoom level to 0.8
            this.scale.setZoom(0.8);
        }, this);
        this.add.text(1700,1050, "FULLSCREEN")
            .setStyle({ fontSize: `30px` })
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                    this.scale.setZoom(0.8);
                } else {
                    this.scale.startFullscreen();
                    this.scale.setZoom(1);
                }
        });
    }
}


// Scene 1 class
class Novice extends Phaser.Scene {
    constructor() {
      super('Novice');
    }
    
    create(){
        // create camera
        let cam = this.cameras.add(0,0,955,1080);
        //cam.setViewport(800,0,800,1000);
        cam.setBackgroundColor(0x440022);
        cam.zoom = 1.9;
        // cam.scrollY +=100;
        //this.cameras.main = cam;
        this.cameras.main.setVisible(false);

        // create player
        this.player = new NovicePlayer(this, 500, 300, 'nov');

        // follow camera
        cam.startFollow(this.player, true, 0.05, 0.05);
        
        // create world
        this.walls = this.physics.add.staticGroup();
        let square = this.add.image(200,250, 'noviceHouse').setOrigin(0,0).setScale(3);
        let wall = this.add.rectangle(50,500,1600,100, 0x0000aa).setOrigin(0,0);
        this.walls.add(wall);
        this.walls.add(square);

        this.door = this.add.rectangle(900,200,100,100, 0xaaaa00).setOrigin(0,0);
        this.physics.add.existing(this.door);

        // add dialog

        this.diaBox = this.add.image(480,600, 'diaBox')
        .setOrigin(0.5,0)
        .setScale(1)
        .setScrollFactor(0)
        .setAlpha(1)
        .setDepth(20);

        this.novicePortrait = this.add.image(310,600, 'novicePortrait')
        .setOrigin(0,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);

        this.npcCiv1Portrait = this.add.image(650,600, 'npcCiv1Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);

        this.npcCiv2Portrait = this.add.image(650,600, 'npcCiv2Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);

        this.diaBoxText = this.add.text(320, 621, "Placeholder, hello and welcome to my code! I didn't expect anyone reading this. I am writing this at 1:17am, 6/4/23", {
            fontFamily: 'Century Gothic',
            fontSize: 22,
            color: '#ffffff',
            align: "left",
            wordWrap: { width: 350, useAdvancedWrap: true},
            lineSpacing: 15,
        })
        .setAlpha(1)
        .setScrollFactor(0)
        .setScale(1)
        .setDepth(20);

        // add NPCS
        this.npcs = this.physics.add.staticGroup();
        this.NPCArray = [];
        //this.addNPC(300,100, '...', '0xaaaaee');
        this.addNPC(600,200, [{self: false, text: 'I don’t understand why they are even complaining. A strike is unnecessary.'},
                                {self: false, text: 'They enjoy the work. If you ask me, I should be the one to complain.'},
                                {self: true, text: 'ok.'}], 'npcCiv1', 'civBubble', 
                                this.novicePortrait, this.npcCiv1Portrait);

        this.addNPC(300,100, [{self: false, text: 'They should put in more effort instead of using the strike as an excuse to get out of work.'}, 
                                {self: false, text: 'If they really want to be respected they should work.'}],
                                'npcCiv2', 'civBubble', 
                                this.novicePortrait, this.npcCiv2Portrait);

        // add physics
        this.physics.add.collider(this.player, this.walls);

        // // Step 4: Listen for 'e' key press event
        this.physics.add.overlap(this.player, this.npcs, (player, npc)=>{
            //console.log('touching');
            
            if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown){
                let npc222 = this.NPCArray[this.NPCArray.findIndex(obj => obj.npc == npc)];
                
                if(npc222.pause)
                    return;
                npc222.pause = true;

                if(npc222.convoIndex > 0){
                    if(npc222.text[npc222.convoIndex - 1].self){ // disable portraits
                        npc222.self.setAlpha(0);
                    } else {
                        npc222.npcPort.setAlpha(0);
                    }
                }
                this.dialogNext(npc222);
            }

        });

        this.physics.add.collider(this.player, this.door, ()=>{
            this.game.gameOptions.noviceLocation = 'desert';
            console.log('to desert!');
            this.scene.stop();
            if(this.scene.isActive('Desert'))
                this.scene.resume('Desert');
            else
                this.scene.launch('Desert');

        });

        //console.log(this.NPCArray);

    }

    dialogNext(npc222){
        if(npc222.convoIndex == npc222.text.length){
            console.log('done');
            this.diaBox.setAlpha(0);
            this.diaBoxText.setAlpha(0);
            npc222.bubble.setAlpha(0);
            npc222.convoIndex = 0;
            this.player.canMove = true;
            this.time.addEvent({
                delay: 1000,
                callback: ()=> {npc222.pause = false;},
                loop: false
            });
        } else {

            this.diaBox.setAlpha(1);
            this.diaBoxText.setAlpha(1);
            npc222.bubble.setAlpha(1);
            if(npc222.text[npc222.convoIndex].self){ // enable portraits
                npc222.self.setAlpha(1);
            } else {
                npc222.npcPort.setAlpha(1);
            }
            this.player.canMove = false;

            // Split the text into individual words
            let words = npc222.text[npc222.convoIndex].text.split(" ");
            this.diaBoxText.text = "";
            let currentIndex = 0;

            // Start displaying the text one word at a time
            let event = this.time.addEvent({
                delay: 100, // Delay between each word (in milliseconds)
                callback: () => {
                    // Check if there are more words to display
                    if (currentIndex < words.length) {
                        // Get the next word to display
                        var word = words[currentIndex];
                
                        // Increment the current index
                        currentIndex++;
                
                        // Update the text content
                        this.diaBoxText.text = this.diaBoxText.text + " " + word;
                    } else {
                        // All words have been displayed, stop the event
                        npc222.pause = false;
                        npc222.convoIndex++;

                        event.remove();
                    }
                },
                callbackScope: this,
                loop: true
            });
        }
    }

    

    addNPC(x,y, text, image, bubble, selfPort, NPCPort){
        let NPC = this.add.image(x, y, image).setOrigin(0,0);
        
        let textObj = this.add.image(x+50, y-30, bubble)
        .setOrigin(0.5,0)
        .setScale(2)
        .setAlpha(0);
        //this.add.text(x+50, y-50, '...', { font: '16px Arial', fill: '#ffffff' }).setOrigin(0.5,1).setAlpha(0);
        let textNPC = text;
        this.npcs.add(NPC);
        this.NPCArray.push({npc: NPC, text: textNPC, convoIndex: 0, bubble: textObj, 
                            pause: false,
                            self: selfPort,
                            npcPort: NPCPort});

        //console.log(this.NPCArray[this.NPCArray.findIndex(obj => obj.npc == NPC)].text.text);
    }

    update(){
        this.player.update();
    }

}

class Veteran extends Phaser.Scene {
    constructor() {
        super('Veteran');
    }

    preload(){
        this.load.image('tiles', 'assets/lower/bridgeMap.png');
        this.load.tilemapCSV('map', 'assets/lower/ground.csv');

        this.load.image('houseTiles', 'assets/lower/houses.png');
        this.load.tilemapCSV('houseMap', 'assets/lower/house.csv');
    }

    create(){

        // create map
        let map = this.make.tilemap({ key: 'map', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('tiles', null, 100,100);
        let layer = map.createLayer(0, tileset, 0, 0);

        let map2 = this.make.tilemap({ key: 'houseMap', tileWidth: 100, tileHeight: 100 });
        let houseTileset = map2.addTilesetImage('houseTiles', null, 100,100);
        let layer2 = map2.createLayer(0, houseTileset, 0, 0);
        

        // create camera
        let cam2 = this.cameras.add(960,0,960,1080);
        //cam.setViewport(800,0,800,1000);
        cam2.setBackgroundColor(0x002244);
        cam2.zoom = 1.9;
        //this.cameras.main = cam2;
        this.cameras.main.setVisible(false);
        cam2.setBounds(0, 0, 1920, 1080);
        this.addFullScreen();

        //create player
        this.player = new VeteranPlayer(this, 500, 300, 'vet');
        
        // follow camera
        cam2.startFollow(this.player, true, 0.05, 0.05);

        // create world
        // this.walls = this.physics.add.staticGroup();
        // let square = this.add.image(600,100, 'veteranHouse').setOrigin(0,0).setScale(3);
        // let wall = this.add.rectangle(50,500,1600,100, 0xaa0000).setOrigin(0,0);
        // this.walls.add(wall);
        // this.walls.add(square);

        this.door = this.add.rectangle(0,300,100,100, 0xaaaa00).setOrigin(0,0);
        this.physics.add.existing(this.door);
        
        this.npcs = this.physics.add.staticGroup();
        this.NPCArray = [];
        this.addNPC(600,400, "hi", '0xaaaaee');
        this.addNPC(400,200, "yo", '0xeeaaaa');

        // add physics
        // Enable collision for specific tiles
        layer2.setCollisionByExclusion([-1], true, layer2);
        layer2.setDepth(5);

        //layer2.setCollision([4, 5, 6, 2, 3, 0, 1, 20, 21, 22, 18, 19, 16, 17, 2, 3, 18, 19, 4, 5, 6, 20, 21, 22]);
        this.player.body.setSize(20,20);//, false).setOffset(50,50);
        // Set up colliders for the layer
        //this.physics.world.setBounds(0, 0, layer2.widthInPixels, layer2.heightInPixels);
        this.physics.add.collider(this.player, layer2, (player, tile) => {
            console.log('player' + this.player.y + " tile " + tile.y * 100);
            if (this.player.y < tile.y * 100) {
                this.player.setDepth(0);  // Render player underneath the tiles
            } else {
                this.player.setDepth(10);  // Render player above the tiles
            }
        });
        

        // Customizing tile properties for collision
        //layer.setTileLocationCallback(x, y, width, height, callback, context);

        this.physics.add.collider(this.player, this.walls);

        this.physics.add.collider(this.player, this.door, ()=>{
            this.game.gameOptions.veteranLocation = 'desert';
            console.log('to desert!');
            this.scene.stop();

            if(this.scene.isActive('Desert'))
                this.scene.resume('Desert');
            else
                this.scene.launch('Desert');

        });


        // // Step 4: Listen for 'e' key press event
        this.physics.add.overlap(this.player, this.npcs, (player, npc)=>{
            //console.log('touching');

            if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M).isDown){
                //console.log('interact');
                this.tweens.add({
                    targets: this.NPCArray[this.NPCArray.findIndex(obj => obj.npc == npc)].text,
                    alpha: 1,
                    duration: 500, // Fade-in duration in milliseconds
                    //delay: 500, // Delay before the fade-in animation starts in milliseconds
                    hold: 3000, // Text will remain visible for 3 seconds
                    onComplete: () => {
                        this.tweens.add({
                          targets:  this.NPCArray[this.NPCArray.findIndex(obj => obj.npc == npc)].text,
                          alpha: 0,
                          duration: 1000,
                          delay: 0
                        });
                    }
                  });
            }

        });

    }

    update(){
        this.player.update();
    }

    addNPC(x,y, text, color){
        let NPC = this.add.rectangle(x,y,100,100, color).setOrigin(0,0);
        
        let textObj = this.add.text(x+50, y-50, text, { font: '16px Arial', fill: '#ffffff' }).setOrigin(0.5,1).setAlpha(0);
        
        this.npcs.add(NPC);
        this.NPCArray.push({npc: NPC, text: textObj});

        //console.log(this.NPCArray[this.NPCArray.findIndex(obj => obj.npc == NPC)].text.text);
    }

    addFullScreen(){
        this.input.keyboard.on('keydown-ESC',  () => {
            // Set the zoom level to 0.8
            this.scale.setZoom(0.8);
        }, this);
        this.add.text(750,1050, "FULLSCREEN")
            .setScrollFactor(0)
            .setStyle({ fontSize: `30px` })
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                    this.scale.setZoom(0.8);
                } else {
                    this.scale.startFullscreen();
                    this.scale.setZoom(1);
                }
        });
    }

}

class DoubleScene extends Phaser.Scene {
    constructor(key,name) {
        super(key);
        this.sceneName = name;
    }
    
    preload(){
    }

    create(){
        this.cameras.main.setVisible(false);
        this.addFullScreen();

        console.log(this.game.gameOptions.noviceLocation);
        // create player(s)
        if(this.game.gameOptions.noviceLocation == this.sceneName)
            this.createNovice();

        if(this.game.gameOptions.veteranLocation == this.sceneName)
            this.createVeteran();


    }

    update(){
        if(this.player)
            this.player.update();
        else if(this.game.gameOptions.noviceLocation == this.sceneName)
            this.createNovice();

        if(this.player2)
            this.player2.update();
        else if(this.game.gameOptions.veteranLocation == this.sceneName)
            this.createVeteran();
    }

    createNovice(){
        // create camera
        let cam = this.cameras.add(0,0,955,1080);
        //cam.setViewport(800,0,800,1000);
        cam.setBackgroundColor(0x440022);
        cam.zoom = 1.9;
        // cam.scrollY +=100;
        //this.cameras.main = cam;
        this.cameras.main.setVisible(false);

        // create player
        this.player = new NovicePlayer(this, 100, 300, 'nov');
        
        // follow camera
        cam.startFollow(this.player, true, 0.05, 0.05);
    }
    
    createVeteran(){
        // create camera
        let cam2 = this.cameras.add(960,0,960,1080);
        //cam.setViewport(800,0,800,1000);
        cam2.setBackgroundColor(0x002244);
        cam2.zoom = 1.9;
        //this.cameras.main = cam2;
        this.cameras.main.setVisible(false);

        //create player
        this.player2 = new VeteranPlayer(this, 1200, 300, 'vet');
        
        // follow camera
        cam2.startFollow(this.player2, true, 0.05, 0.05);
    }

    addFullScreen(){
        this.input.keyboard.on('keydown-ESC',  () => {
            // Set the zoom level to 0.8
            this.scale.setZoom(0.8);
        }, this);
        this.add.text(1700,1050, "FULLSCREEN")
            .setStyle({ fontSize: `30px` })
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                    this.scale.setZoom(0.8);
                } else {
                    this.scale.startFullscreen();
                    this.scale.setZoom(1);
                }
        });
    }

}

class Desert extends DoubleScene {
    constructor() {
        super('Desert', 'desert');
    }
    
    preload(){
        this.load.image('tiles', 'assets/bridgeMap.png');
        this.load.tilemapCSV('roadmap', 'assets/bridge.csv');
    }

    create(){
        // create map
        let map = this.make.tilemap({ key: 'roadmap', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('tiles', null, 100,100);
        let layer = map.createLayer(0, tileset, 0, 0);

        // create world
        // this.walls = this.physics.add.staticGroup();
        // let square = this.add.image(600,100, 'veteranHouse').setOrigin(0,0).setScale(3);
        // let wall = this.add.rectangle(50,500,500,100, 0xaa0000).setOrigin(0,0);
        // this.walls.add(wall);
        // this.walls.add(square);

        // add physics
        //this.physics.add.collider(this.player, this.walls);

    }

}


let config = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1080,
    backgroundColor: 0x000000,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 600 }
        }
    },
    scene: [Start, Novice, Veteran, Desert],
    checkpt: false,
    pixelArt: true,
}

let game = new Phaser.Game(config);

game.gameOptions = {
    noviceLocation: 'upper',
    veteranLocation: 'lower',
}