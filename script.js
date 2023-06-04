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

        // dialog and NPCs
        this.load.image('diaBox', 'assets/UIAssets/Text_Box.png');
        this.load.image('civBubble', 'assets/UIAssets/Blurb_Civilians.png');
        this.load.image('novicePortrait', 'assets/Player/NoviceMCport.png');
        this.load.image('npcCiv1', 'assets/NPC/CivilianNPC_01.png');
        this.load.image('npcCiv1Portrait', 'assets/NPC/CivilianNPCport_01.png');
        this.load.image('npcCiv2', 'assets/NPC/CivilianNPC_02.png');
        this.load.image('npcCiv2Portrait', 'assets/NPC/CivilianNPCport_02.png');

        this.load.image('memBubble', 'assets/UIAssets/Blurb_Members.png');
        this.load.image('veteranPortrait', 'assets/Player/VeteranMCport.png');
        this.load.image('npcVet1', 'assets/NPC/LizardNPC_01.png');
        this.load.image('npcVet1Portrait', 'assets/NPC/LizardNPC_Por_01.png');
        this.load.image('npcVet2', 'assets/NPC/MuleNPC_02.png');
        this.load.image('npcVet2Portrait', 'assets/NPC/MuleNPCPor_03.png');
    }
    create(){
        //this.cameras.main.setBackgroundColor(0x00ff00);
        this.scale.setZoom(0.8);

        this.scene.launch('NoviceHouse');
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

        this.initDialog();

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

        this.noviceInteractionNPC();

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

    noviceInteractionNPC(){
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
    }

    initDialog(){
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
        let cam2 = this.cameras.add(965,0,960,1080);
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
        this.add.text(600,800, "FULLSCREEN")
            .setScrollFactor(0)
            .setStyle({ fontSize: `20px` })
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
    constructor(key,name, coords1, coords2) {
        super(key);
        this.sceneName = name;
        this.p1Cords = coords1;
        this.p2Cords = coords2;
    }
    
    preload(){
    
    }

    init(){
        this.camIgnoreList = [];
        this.cam2IgnoreList = [];

        // add NPCS
        this.npcs = this.physics.add.staticGroup();
        this.NPCArray = [];
    }

    create(){
        this.cameras.main.setVisible(false);

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
        this.cam = this.cameras.add(0,0,955,1080);
        //cam.setViewport(800,0,800,1000);
        this.cam.setBackgroundColor(0x440022);
        this.cam.zoom = 1.9;
        this.cam.setBounds(0, 0, 1900, 1000);
        // cam.scrollY +=100;
        //this.cameras.main = cam;
        this.cameras.main.setVisible(false);
        

        // create player
        if(this.p1Cords) {
            this.player = new NovicePlayer(this, this.p1Cords[0], this.p1Cords[1], 'nov');
        } else {
            this.player = new NovicePlayer(this, 100, 300, 'nov');
        }
        // add dialog
        //this.initDialogNovice();

        this.noviceInteractionNPC();

        // follow camera
        this.cam.startFollow(this.player, true, 0.05, 0.05);

        this.cam.ignore(this.camIgnoreList);

        // overlap with players and ignore check
        if(this.player2){
            this.cam2.ignore(this.cam2IgnoreList);


            this.physics.add.overlap(this.player, this.player2, () => {
                console.log('player2 ' + this.player2.y + " player " + this.player.y );
                if (this.player2.y < this.player.y ) {
                    this.player2.setDepth(10);
                    this.player.setDepth(20);
                } else {
                    this.player2.setDepth(20);  
                    this.player.setDepth(10);  
                }
            });
        }
        
    }
    
    createVeteran(){
        // create camera
        this.cam2 = this.cameras.add(965,0,955,1080);
        //cam.setViewport(800,0,800,1000);
        this.cam2.setBackgroundColor(0x002244);
        this.cam2.zoom = 1.9;
        this.cam2.setBounds(0, 0, 1900, 1000);
        //this.cameras.main = cam2;
        this.cameras.main.setVisible(false);
        this.addFullScreen();

        
        // create player
        if(this.p2Cords) {
            this.player2 = new VeteranPlayer(this, this.p2Cords[0], this.p2Cords[1], 'vet');
        } else {
            this.player2 = new VeteranPlayer(this, 1200, 300, 'vet');
        }
        // add dialog
        //this.initDialogVeteran();

        this.veteranInteractionNPC();
        
        // follow camera
        this.cam2.startFollow(this.player2, true, 0.05, 0.05);
        this.cam2.ignore(this.cam2IgnoreList);

        // overlap with players and ignore check
        if(this.player){
            this.cam.ignore(this.camIgnoreList);

            this.physics.add.overlap(this.player, this.player2, () => {
                console.log('player2 ' + this.player2.y + " player " + this.player.y );
                if (this.player2.y < this.player.y ) {
                    this.player2.setDepth(10);  
                    this.player.setDepth(20); 
                } else {
                    this.player2.setDepth(20);  
                    this.player.setDepth(10);  
                }
            });
        }

    }

    addFullScreen(){
        this.input.keyboard.on('keydown-ESC',  () => {
            // Set the zoom level to 0.8
            this.scale.setZoom(0.8);
        }, this);
        let fullscreen = this.add.text(600,800, "FULLSCREEN")
            .setScrollFactor(0)
            .setStyle({ fontSize: `20px` })
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

        this.camIgnoreList.push(fullscreen);
    }

    initDialogNovice(){
        this.diaBox = this.add.image(480,600, 'diaBox')
        .setOrigin(0.5,0)
        .setScale(1)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.cam2IgnoreList.push(this.diaBox);

        this.novicePortrait = this.add.image(310,600, 'novicePortrait')
        .setOrigin(0,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.cam2IgnoreList.push(this.novicePortrait);

        this.npcCiv1Portrait = this.add.image(650,600, 'npcCiv1Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.cam2IgnoreList.push(this.npcCiv1Portrait);

        this.npcCiv2Portrait = this.add.image(650,600, 'npcCiv2Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.cam2IgnoreList.push(this.npcCiv2Portrait);

        this.npcVet1Portrait = this.add.image(650,600, 'npcVet1Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.cam2IgnoreList.push(this.npcVet1Portrait);
        

        this.npcVet2Portrait = this.add.image(650,600, 'npcVet2Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.cam2IgnoreList.push(this.npcVet2Portrait);

        

        this.diaBoxText = this.add.text(320, 621, "Placeholder, hello and welcome to my code! I didn't expect anyone reading this. I am writing this at 1:17am, 6/4/23", {
            fontFamily: 'Century Gothic',
            fontSize: 22,
            color: '#ffffff',
            align: "left",
            wordWrap: { width: 350, useAdvancedWrap: true},
            lineSpacing: 15,
        })
        .setAlpha(0)
        .setScrollFactor(0)
        .setScale(1)
        .setDepth(20);

        this.cam2IgnoreList.push(this.diaBoxText);
    }

    initDialogVeteran(){
        this.diaBox2 = this.add.image(480,600, 'diaBox')
        .setOrigin(0.5,0)
        .setScale(1)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.camIgnoreList.push(this.diaBox2);

        this.veteranPortrait = this.add.image(310,600, 'veteranPortrait')
        .setOrigin(0,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.camIgnoreList.push(this.veteranPortrait);

        this.npcCiv1Portrait2 = this.add.image(650,600, 'npcCiv1Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.camIgnoreList.push(this.npcCiv1Portrait2);

        this.npcCiv2Portrait2 = this.add.image(650,600, 'npcCiv2Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.camIgnoreList.push(this.npcCiv2Portrait2);

        this.npcVet1Portrait2 = this.add.image(650,600, 'npcVet1Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.camIgnoreList.push(this.npcVet1Portrait2);
        

        this.npcVet2Portrait2 = this.add.image(650,600, 'npcVet2Portrait')
        .setOrigin(1,1)
        .setScale(1.5)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(20);
        this.camIgnoreList.push(this.npcVet2Portrait2);
        

        this.diaBoxText2 = this.add.text(320, 621, "Placeholder, hello and welcome to my code! I didn't expect anyone reading this. I am writing this at 1:17am, 6/4/23", {
            fontFamily: 'Century Gothic',
            fontSize: 22,
            color: '#ffffff',
            align: "left",
            wordWrap: { width: 350, useAdvancedWrap: true},
            lineSpacing: 15,
        })
        .setAlpha(0)
        .setScrollFactor(0)
        .setScale(1)
        .setDepth(20);
        this.camIgnoreList.push(this.diaBoxText2);

        
    }

    noviceInteractionNPC(){
        // // Step 4: Listen for 'e' key press event
        this.physics.add.overlap(this.player, this.npcs, (player, npc)=>{
            //console.log('touching');
            if (this.player.y < npc.y + 50) {
                this.player.setDepth(0);  // Render player underneath the tiles
            } else {
                this.player.setDepth(10);  // Render player above the tiles
            }

            if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown){
                let npc222 = this.NPCArray[this.NPCArray.findIndex(obj => obj.npc == npc)];
                //console.log(npc222);
                
                if(npc222.pause || npc222.convoIndexVet > 0 || npc222.textNovice == null)
                    return;
                npc222.pause = true;

                if(npc222.convoIndexNov > 0){
                    if(npc222.textNovice[npc222.convoIndexNov - 1].self){ // disable portraits
                        npc222.novPort.self.setAlpha(0);
                    } else {
                        npc222.novPort.npc.setAlpha(0);
                    }
                }
                this.dialogNextNovice(npc222);
            }

        });
    }

    veteranInteractionNPC(){
        // Listen for 'm' key press event
        this.physics.add.overlap(this.player2, this.npcs, (player, npc)=>{
            //console.log('touching');
            if (this.player2.y < npc.y + 50) {
                this.player2.setDepth(0);  // Render player underneath the tiles
            } else {
                this.player2.setDepth(10);  // Render player above the tiles
            }

            if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M).isDown){
                let npc222 = this.NPCArray[this.NPCArray.findIndex(obj => obj.npc == npc)];
                //console.log(npc222);
                
                if(npc222.pause || npc222.convoIndexNov > 0 || npc222.textVeteran == null)
                    return;
                npc222.pause = true;

                if(npc222.convoIndexVet > 0){
                    if(npc222.textVeteran[npc222.convoIndexVet - 1].self){ // disable portraits
                        npc222.vetPort.self.setAlpha(0);
                    } else {
                        npc222.vetPort.npc.setAlpha(0);
                    }
                }
                this.dialogNextVeteran(npc222);
            }

        });
    }

    dialogNextNovice(npc222){
        if(npc222.convoIndexNov == npc222.textNovice.length){
            console.log('done');
            this.diaBox.setAlpha(0);
            this.diaBoxText.setAlpha(0);
            npc222.bubble.setAlpha(0);
            npc222.convoIndexNov = 0;
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
            if(npc222.textNovice[npc222.convoIndexNov].self){ // enable portraits
                npc222.novPort.self.setAlpha(1);
            } else {
                npc222.novPort.npc.setAlpha(1);
            }
            this.player.canMove = false;

            // Split the text into individual words
            let words = npc222.textNovice[npc222.convoIndexNov].text.split(" ");
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
                        npc222.convoIndexNov++;

                        event.remove();
                    }
                },
                callbackScope: this,
                loop: true
            });
        }
    }

    dialogNextVeteran(npc222){
        if(npc222.convoIndexVet == npc222.textVeteran.length){
            console.log('done');
            this.diaBox2.setAlpha(0);
            this.diaBoxText2.setAlpha(0);
            npc222.bubble.setAlpha(0);
            npc222.convoIndexVet = 0;
            this.player2.canMove = true;
            this.time.addEvent({
                delay: 1000,
                callback: ()=> {npc222.pause = false;},
                loop: false
            });
        } else {

            this.diaBox2.setAlpha(1);
            this.diaBoxText2.setAlpha(1);
            npc222.bubble.setAlpha(1);
            if(npc222.textVeteran[npc222.convoIndexVet].self){ // enable portraits
                npc222.vetPort.self.setAlpha(1);
            } else {
                npc222.vetPort.npc.setAlpha(1);
            }
            this.player2.canMove = false;

            // Split the text into individual words
            let words = npc222.textVeteran[npc222.convoIndexVet].text.split(" ");
            this.diaBoxText2.text = "";
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
                        this.diaBoxText2.text = this.diaBoxText2.text + " " + word;
                    } else {
                        // All words have been displayed, stop the event
                        npc222.pause = false;
                        npc222.convoIndexVet++;

                        event.remove();
                    }
                },
                callbackScope: this,
                loop: true
            });
        }
    }

    

    addNPC(x,y, textNov, textVet, image, bubble, PortNov, PortVet){
        let NPC;
        if(image)
            NPC = this.add.image(x, y, image).setOrigin(0,0).setDepth(7);
        else
            NPC = this.add.rectangle(x-10,y-10,120,120, "0x000000").setOrigin(0,0).setAlpha(0).setDepth(7);

        let textObj = this.add.image(x+50, y-30, bubble)
        .setOrigin(0.5,0)
        .setScale(2)
        .setAlpha(0)
        .setDepth(7);
        //this.add.text(x+50, y-50, '...', { font: '16px Arial', fill: '#ffffff' }).setOrigin(0.5,1).setAlpha(0);

        this.npcs.add(NPC);
        this.NPCArray.push({npc: NPC, textNovice: textNov, textVeteran: textVet, convoIndexNov: 0, convoIndexVet: 0,
                            bubble: textObj, 
                            pause: false,
                            novPort: PortNov,
                            vetPort: PortVet});

        //console.log(this.NPCArray[this.NPCArray.findIndex(obj => obj.npc == NPC)].text.text);
    }

}

class NoviceHouse extends DoubleScene {
    constructor() {
        super('NoviceHouse', 'NoviceHouse',[550,150]);
    }
    
    preload(){
        this.load.image('noviceRoomTiles', 'assets/NoviceRoom/NoviceRoomSpriteSheet.png');
        this.load.tilemapCSV('NoviceRoom-ground', 'assets/NoviceRoom/NoviceRoom_ground.csv');
        this.load.tilemapCSV('NoviceRoom-objects', 'assets/NoviceRoom/NoviceRoom_objects.csv');
    }

    create(){
        // create map
        let map = this.make.tilemap({ key: 'NoviceRoom-ground', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('noviceRoomTiles', null, 100,100);
        this.layer = map.createLayer(0, tileset, 0, 0);

        let map2 = this.make.tilemap({ key: 'NoviceRoom-objects', tileWidth: 100, tileHeight: 100 });
        let houseTileset = map2.addTilesetImage('noviceRoomTiles', null, 100,100);
        this.layer2 = map2.createLayer(0, houseTileset, 0, 0);


        this.door = this.add.rectangle(400,450,100,100, 0xaaaaaa).setOrigin(0,0);
        this.physics.add.existing(this.door);

        // add physics
        
        // Enable collision for specific tiles
        this.layer2.setCollisionByExclusion([-1]);
        this.layer2.setDepth(5);
        this.layer.setCollision([5]);

        this.p1Init = false;

        // add dialog
        super.initDialogNovice();

        //book
        super.addNPC(600,300, [{self: true, text: 'The textbook is opened to a page about the purple rocks used to power everything within the city.'},
                                {self: true, text: 'Its pure unrefined form is only found above the surface.'}],
                                null,
                                null, 'civBubble', 
                                {self: this.novicePortrait}, null);

        //rocks
        super.addNPC(200,100, [{self: true, text: 'A collection of gems I’ve earned. There is a spot open for my next gem.'}],
                                null,
                                null, 'civBubble', 
                                {self: this.novicePortrait}, null);

    }

    update(){

        super.update();

        if(this.player && !this.p1Init){
            this.cam.setBackgroundColor(0x000000);
            this.p1Init = true;

            this.player.body.setSize(20,75);
            this.physics.add.collider(this.player, this.layer);
            this.physics.add.collider(this.player, this.layer2, (player, tile) => {
                //console.log('player' + this.player.y + " tile " + tile.y * 100);
                if (this.player.y < tile.y * 100) {
                    this.player.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player.setDepth(10);  // Render player above the tiles
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

        }
        
    }
}

class Desert extends DoubleScene {
    constructor() {
        super('Desert', 'desert');
    }
    
    preload(){
        this.load.image('desertTiles', 'assets/desert/bridgeMap.png');
        this.load.tilemapCSV('desert-ground', 'assets/desert/desert_ground.csv');
        this.load.tilemapCSV('desert-objects', 'assets/desert/desert_objects.csv');
    }

    create(){
        // create map
        let map = this.make.tilemap({ key: 'desert-ground', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('desertTiles', null, 100,100);
        let layer = map.createLayer(0, tileset, 0, 0);

        let map2 = this.make.tilemap({ key: 'desert-objects', tileWidth: 100, tileHeight: 100 });
        let houseTileset = map2.addTilesetImage('desertTiles', null, 100,100);
        this.layer2 = map2.createLayer(0, houseTileset, 0, 0);


        // add physics
        // Enable collision for specific tiles
        this.layer2.setCollisionByExclusion([-1]);
        this.layer2.setDepth(5);

        this.p1Init = false;
        this.p2Init = false;

        //this.addNPC(300,100, '...', '0xaaaaee');
        super.initDialogNovice();
        super.addNPC(500,300, [{self: false, text: 'I don’t understand why they are even complaining. A strike is unnecessary.'},
                                {self: false, text: 'They enjoy the work. If you ask me, I should be the one to complain.'},
                                {self: true, text: 'ok.'}], 
                                null,
                                null, 'civBubble', 
                                {self: this.novicePortrait, npc: this.npcCiv1Portrait}, null);

        super.addNPC(300,600, [{self: false, text: 'They should put in more effort instead of using the strike as an excuse to get out of work.'}, 
                                {self: false, text: 'If they really want to be respected they should work.'}],
                                null,
                                'npcCiv2', 'civBubble', 
                                {self: this.novicePortrait, npc: this.npcCiv2Portrait}, null);

        super.initDialogVeteran();

        super.addNPC(1000,300, [{self: false, text: 'Ello mate'}, 
                                {self: true, text: 'oi.'}],
                                [{self: false, text: 'jimbo went on strike for milk'}, 
                                {self: true, text: 'what haponm.'}],
                                'npcVet2', 'memBubble', 
                                {self: this.novicePortrait, npc: this.npcVet2Portrait}, {self: this.veteranPortrait, npc: this.npcVet2Portrait2});

        super.addNPC(1500,400, [{self: false, text: 'Who tf are you'}, 
                                {self: true, text: 'idk bruh.'}],

                                [{self: false, text: 'cactus Fred hit me :('}, 
                                {self: true, text: 'Prickly pear beware amigo.'}],
                                'npcVet1', 'memBubble', 
                                {self: this.novicePortrait, npc: this.npcVet1Portrait}, {self: this.veteranPortrait, npc: this.npcVet1Portrait2});
        

    }

    update(){

        super.update();

        if(this.player && !this.p1Init){
            this.p1Init = true;

            this.player.body.setSize(20,20);
            this.physics.add.collider(this.player, this.layer2, (player, tile) => {
                console.log('player' + this.player.y + " tile " + tile.y * 100);
                if (this.player.y < tile.y * 100) {
                    this.player.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player.setDepth(10);  // Render player above the tiles
                }
            });

        }

        if(this.player2 && !this.p2Init){
            this.p2Init = true;

            this.player2.body.setSize(20,20);
            this.physics.add.collider(this.player2, this.layer2, (player, tile) => {
                console.log('player' + this.player2.y + " tile " + tile.y * 100);
                if (this.player2.y < tile.y * 100) {
                    this.player2.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player2.setDepth(10);  // Render player above the tiles
                }
            });

        }
        
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
    scene: [Start, Novice, Veteran, Desert, NoviceHouse],
    checkpt: false,
    pixelArt: true,
}

let game = new Phaser.Game(config);

game.gameOptions = {
    noviceLocation: 'NoviceHouse',
    veteranLocation: 'lower',
}