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
        // //this.cameras.main.setBackgroundColor(0x00ff00);
        this.scale.setZoom(0.8);

        // this.scene.launch('NoviceHouse');
        // this.scene.launch('UndergroundMine');
        this.addFullScreen();

        this.add.text(400,150, "The Last Extraction").setTint(0xaa00aa).setFontSize(100);
        this.add.text(500,800, "Movement: (wasd) / (arrows)\nInteract: (E) / (M)").setTint(0xaaaaaa).setFontSize(50);
        this.add.text(270,250, "Created by Alejandro Hernandez, Nailea Llamas,\nPhil Meyer, and Tau Carmichael").setTint(0xaaaaaa).setFontSize(50);
        let start = this.add.text(800,500, "Start").setTint(0xaa00aa).setFontSize(75)
        .setInteractive();
        
        start.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => {
                this.scene.launch('NoviceHouse');
                this.scene.launch('UndergroundMine');
        });
        });

        start.on('pointerover', () => {
            start.setTint(0xdd00dd);
        });

        

    }
    update(){
        //this.player.update();
    }

    addFullScreen(){
        this.input.keyboard.on('keydown-ESC',  () => {
            // Set the zoom level to 0.8
            this.scale.setZoom(0.8);
        }, this);
        this.fsText = this.add.text(1700,1050, "FULLSCREEN")
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

        this.positions = [{'name' : "desert1", coord: [550,450]},
                        {'name' : "NoviceHouse", coord: [200,450]},
                        {'name' : "City", coord: [400,400]},
                        {'name' : "City2", coord: [450,400]},
                        {'name' : "Town", coord: [1750,400]},
                        {'name' : "Town2", coord: [950,700]},
                        {'name' : "desert2", coord: [150,500]},
                        {'name' : "UndergroundMine", coord: [700,550]}];
        
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
        if(this.player  && this.player.body)
            this.player.update();
        else if(this.game.gameOptions.noviceLocation == this.sceneName)
            this.createNovice();

        if(this.player2  && this.player2.body )
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
        if(this.cameras.main)
            this.cameras.main.setVisible(false);
        
        console.log('novprev');
        console.log(this.game.gameOptions.novPrev);
        let novPos = this.positions[this.positions.findIndex(obj => obj.name == this.game.gameOptions.novPrev)];

        if(novPos)
            this.p1Cords = novPos.coord;
        

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
        if(this.cameras.main)
            this.cameras.main.setVisible(false);
        this.addFullScreen();


        console.log('vetprev');
        console.log(this.game.gameOptions.vetPrev);
        let vetPos = this.positions[this.positions.findIndex(obj => obj.name == this.game.gameOptions.vetPrev)];

        if(vetPos)
            this.p2Cords = vetPos.coord;
        
        console.log(vetPos);
        
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
        this.fullscreen = this.add.text(600,800, "FULLSCREEN")
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

        this.camIgnoreList.push(this.fullscreen);
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

        this.load.image('cityTiles', 'assets/City/CitySheet.png');
        this.load.tilemapCSV('city-ground', 'assets/City/City_ground.csv');
        this.load.tilemapCSV('city-objects', 'assets/City/City_objects.csv');
    }

    create(){
        // create map
        let map = this.make.tilemap({ key: 'NoviceRoom-ground', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('noviceRoomTiles', null, 100,100);
        this.layer = map.createLayer(0, tileset, 0, 0);

        let map2 = this.make.tilemap({ key: 'NoviceRoom-objects', tileWidth: 100, tileHeight: 100 });
        let houseTileset = map2.addTilesetImage('noviceRoomTiles', null, 100,100);
        this.layer2 = map2.createLayer(0, houseTileset, 0, 0);
        
        //hi
        //this.layer2.removeTileAt(tile.x,tile.y); remove test


        this.door = this.add.rectangle(400,450,100,100, 0xaaaaaa).setOrigin(0,0).setAlpha(0.5);
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

        if(this.player && this.player.body && !this.p1Init){
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
                
                this.game.gameOptions.novPrev = 'NoviceHouse';
                this.game.gameOptions.noviceLocation = 'City';
                console.log('to City!');
                this.scene.stop();
                if(this.scene.isActive('City'))
                    this.scene.resume('City');
                else
                    this.scene.launch('City');
    
            });

        }
        
    }
}

class City extends DoubleScene {
    constructor() {
        super('City', 'City',[150,400]);
    }
    
    preload(){
        
    }

    create(){
        // create map
        let map = this.make.tilemap({ key: 'city-ground', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('cityTiles', null, 100,100);
        this.layer = map.createLayer(0, tileset, 0, 0);

        let map2 = this.make.tilemap({ key: 'city-objects', tileWidth: 100, tileHeight: 100 });
        //let houseTileset = map2.addTilesetImage('noviceRoomTiles', null, 100,100);
        this.layer2 = map2.createLayer(0, tileset, 0, 0);
        
        //hi
        //this.layer2.removeTileAt(tile.x,tile.y); remove test


        this.door = this.add.rectangle(500,310,200,100, 0xaaaaaa).setOrigin(0,0).setAlpha(0.5);
        this.physics.add.existing(this.door);

        this.door2 = this.add.rectangle(100,310,100,100, 0xaaaaaa).setOrigin(0,0).setAlpha(0.5);
        this.physics.add.existing(this.door2);

        // add physics
        
        // Enable collision for specific tiles
        this.layer2.setCollisionByExclusion([-1]);
        this.layer2.setDepth(5);
        this.layer.setCollision([5]);

        this.p1Init = false;

        // add dialog
        super.initDialogNovice();
        super.addNPC(700,400, [{self: false, text: 'I don’t understand why they are even complaining. A strike is unnecessary.'},
                                {self: false, text: 'They enjoy the work. If you ask me, I should be the one to complain.'},
                                {self: true, text: 'ok.'}], 
                                null,
                                'npcCiv1', 'civBubble', 
                                {self: this.novicePortrait, npc: this.npcCiv1Portrait}, null);

        super.addNPC(300,600, [{self: false, text: 'They should put in more effort instead of using the strike as an excuse to get out of work.'}, 
                                {self: false, text: 'If they really want to be respected they should work.'}],
                                null,
                                'npcCiv2', 'civBubble', 
                                {self: this.novicePortrait, npc: this.npcCiv2Portrait}, null);

    }

    update(){

        super.update();

        if(this.player && this.player.body && !this.p1Init){
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
                this.game.gameOptions.novPrev = 'City';
                this.game.gameOptions.noviceLocation = 'desert';
                console.log('to desert!');
                this.scene.stop();
                if(this.scene.isActive('Desert'))
                    this.scene.resume('Desert');
                else
                    this.scene.launch('Desert');
    
            });

            this.physics.add.collider(this.player, this.door2, ()=>{
                this.game.gameOptions.novPrev = 'City2';
                this.game.gameOptions.noviceLocation = 'NoviceHouse';
                console.log('to home!');
                this.scene.stop();
                if(this.scene.isActive('NoviceHouse'))
                    this.scene.resume('NoviceHouse');
                else
                    this.scene.launch('NoviceHouse');
    
            });

        }
        
    }
}

class UndergroundMine extends DoubleScene {
    constructor() {
        super('UndergroundMine', 'UndergroundMine',[950,500], [950,250]);
    }
    
    preload(){
        this.load.image('mineTiles', 'assets/Mine/mineSpriteSheet.png');
        this.load.tilemapCSV('mine-cave', 'assets/Mine/Mine_cave.csv');
        this.load.tilemapCSV('mine-objects', 'assets/Mine/Mine_objects.csv');
    }

    create(){
        // create map
        let map = this.make.tilemap({ key: 'mine-cave', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('mineTiles', null, 100,100);
        this.layer = map.createLayer(0, tileset, 0, 0);

        let map2 = this.make.tilemap({ key: 'mine-objects', tileWidth: 100, tileHeight: 100 });
        //let houseTileset = map2.addTilesetImage('noviceRoomTiles', null, 100,100);
        this.layer2 = map2.createLayer(0, tileset, 0, 0);
        
        //hi
        //this.layer2.removeTileAt(tile.x,tile.y); remove test


        this.door = this.add.rectangle(900,750,100,100, 0xaaaaaa).setOrigin(0,0).setAlpha(0.5);
        this.physics.add.existing(this.door);

        // add physics
        
        // Enable collision for specific tiles
        this.layer2.setCollisionByExclusion([-1]);
        this.layer2.setDepth(5);
        this.layer.setCollision([0,4]);

        this.p1Init = false;
        this.p2Init = false;



        // add dialog
        super.initDialogNovice();
        super.initDialogVeteran();

        super.addNPC(1600,400, [{self: false, text: 'Take whatever.'}, 
                                {self: true, text: 'thanks.'}],

                                [{self: false, text: 'Seems like everyone left the mines to go on strike.'}, 
                                {self: true, text: "Rookies, I'll go take a look and see what's going on."}],
                                'npcVet1', 'memBubble', 
                                {self: this.novicePortrait, npc: this.npcVet1Portrait}, {self: this.veteranPortrait, npc: this.npcVet1Portrait2});

        //rocks
        super.addNPC(700,200, [{self: true, text: 'This is what I deserve, it’s owed to me.'}],
                            [{self: true, text: 'These rocks litter the ground and fill the mines with their foreboding glow.'},
                            {self: true, text: 'It’s not best for me to stay around them for too long.'}],
                                null, 'memBubble', 
                                {self: this.novicePortrait}, {self: this.veteranPortrait});
        
        super.addNPC(700,600, [{self: true, text: 'A beautiful purple rock to add to my collection.'}],
                            [{self: true, text: 'I harvested these rocks for years.'},
                            {self: true, text: 'Somehow there is still a demand for them.'}],
                                null, 'memBubble', 
                                {self: this.novicePortrait}, {self: this.veteranPortrait});

    }

    update(){

        super.update();

        if(this.player && this.player.body && !this.p1Init){
            this.p1Init = true;

            this.cam.setBackgroundColor(0x000000);

            this.player.body.setSize(20,20);
            this.physics.add.collider(this.player, this.layer);
            this.physics.add.overlap(this.player, this.layer2, (player, tile) => {
                //console.log(tile);
                //console.log('player' + this.player.y + " tile " + tile.y * 100);
                if (this.player.y < tile.y * 100) {
                    this.player.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player.setDepth(10);  // Render player above the tiles
                }
                if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown && (tile.index == 2 || tile.index == 3)){
                    this.layer2.removeTileAt(tile.x,tile.y);
                    this.game.gameOptions.rocksCollected++;
                    console.log('total rocks:' + this.game.gameOptions.rocksCollected);

                    if (this.game.gameOptions.rocksCollected == 9)
                        this.goBackDialog("I got everything I wanted. Time to go back and add it to my collection.");
                }
            });

            this.physics.add.overlap(this.player, this.door, ()=>{
                if (this.game.gameOptions.rocksCollected < 9)
                {   
                    this.goBackDialog("I can't leave without grabbing all the pretty rocks..");
                    this.player.x = 950;
                    this.player.y = 500;
                    return;
                }
                this.game.gameOptions.novPrev = 'UndergroundMine';
                this.game.gameOptions.noviceLocation = 'Town';
                console.log('to Town!');

                    this.player.destroy();
                    this.p1Init = false;
                    this.cam.setVisible(false);
                
                if(this.scene.isActive('Town'))
                    this.scene.resume('Town');
                else
                    this.scene.launch('Town');
    
            });

        }

        if(this.player2 && this.player2.body && !this.p2Init){
            this.p2Init = true;
            this.cam2.setBackgroundColor(0x000000);

            this.player2.body.setSize(20,20);

            this.physics.add.collider(this.player2, this.layer);
            this.physics.add.collider(this.player2, this.layer2, (player, tile) => {
                console.log('player' + this.player2.y + " tile " + tile.y * 100);
                if (this.player2.y < tile.y * 100) {
                    this.player2.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player2.setDepth(10);  // Render player above the tiles
                }
            });

            this.physics.add.overlap(this.player2, this.door, ()=>{
                
                this.game.gameOptions.vetPrev = 'UndergroundMine';
                this.game.gameOptions.veteranLocation = 'Town';
                console.log('to Town!');

                    this.player2.destroy();
                    this.p2Init = false;
                    this.cam2.setVisible(false);
                

                if(this.scene.isActive('Town'))
                    this.scene.resume('Town');
                else
                    this.scene.launch('Town');
    
            });

        }
        
    }

    goBackDialog(inputText){
        this.player.canMove = false;

        this.diaBox.setAlpha(1);
        this.diaBoxText.setAlpha(1);
        this.novicePortrait.setAlpha(1);

        // Split the text into individual words
        let words = inputText.split(" ");
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
                    this.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            this.player.canMove = true;
                            this.diaBox.setAlpha(0);
                            this.diaBoxText.setAlpha(0);
                            this.novicePortrait.setAlpha(0);
                            event.remove();
                        }
                    });
                }
            },
            callbackScope: this,
            loop: true
        });
    }
}

class Desert extends DoubleScene {
    constructor() {
        super('Desert', 'desert', [400, 400],[1700, 400]);
    }
    
    preload(){
        this.load.image('desertTiles', 'assets/desert/bridgeMap.png');
        this.load.tilemapCSV('desert-ground', 'assets/desert/desert_ground.csv');
        this.load.tilemapCSV('desert-objects', 'assets/desert/desert_objects.csv');
        this.load.tilemapCSV('desert-elevator', 'assets/desert/desert_elevator.csv');
    }

    create(){
        // create map
        let map = this.make.tilemap({ key: 'desert-ground', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('desertTiles', null, 100,100);
        let layer = map.createLayer(0, tileset, 0, 0);

        let map2 = this.make.tilemap({ key: 'desert-objects', tileWidth: 100, tileHeight: 100 });
        let houseTileset = map2.addTilesetImage('desertTiles', null, 100,100);
        this.layer2 = map2.createLayer(0, houseTileset, 0, 0);

        let map3 = this.make.tilemap({ key: 'desert-elevator', tileWidth: 100, tileHeight: 100 });
        let ele = map2.addTilesetImage('cityTiles', null, 100,100);
        this.layer3 = map3.createLayer(0, ele, 0, 0);

        this.door = this.add.rectangle(1800,400,100,100, 0xaaaaaa).setOrigin(0,0).setAlpha(0.5);
        this.physics.add.existing(this.door);

        this.door2 = this.add.rectangle(210,400,100,100, 0xaaaaaa).setOrigin(0,0).setAlpha(0.5);
        this.physics.add.existing(this.door2);

        // add physics
        // Enable collision for specific tiles
        this.layer2.setCollisionByExclusion([-1]);
        this.layer2.setDepth(5);
        this.layer3.setCollisionByExclusion([-1]);
        this.layer3.setDepth(20);

        this.p1Init = false;
        this.p2Init = false;

        super.initDialogNovice();
        super.initDialogVeteran();

        super.addNPC(900,400, [{self: true, text: 'Hmm, I will just go around'}],
                            [{self: true, text: 'The roadblock is still firmly in place. We thought this would be enough to get their attention.'},
                            {self: true, text: 'We were wrong.'}],
                                null, 'memBubble', 
                                {self: this.novicePortrait}, {self: this.veteranPortrait});

        super.addNPC(300,400, [{self: true, text: 'I have priviledged access to this elevator thanks to my family.'}],
                            [{self: true, text: 'We are not allowed down there. Tomorrow will be different though…'},
                            {self: true, text: 'I should head back.'}],
                                null, 'civBubble', 
                                {self: this.novicePortrait}, {self: this.veteranPortrait});

        //this.addNPC(300,100, '...', '0xaaaaee');
        // super.initDialogNovice();
        // super.addNPC(500,300, [{self: false, text: 'I don’t understand why they are even complaining. A strike is unnecessary.'},
        //                         {self: false, text: 'They enjoy the work. If you ask me, I should be the one to complain.'},
        //                         {self: true, text: 'ok.'}], 
        //                         null,
        //                         null, 'civBubble', 
        //                         {self: this.novicePortrait, npc: this.npcCiv1Portrait}, null);

        // super.addNPC(300,600, [{self: false, text: 'They should put in more effort instead of using the strike as an excuse to get out of work.'}, 
        //                         {self: false, text: 'If they really want to be respected they should work.'}],
        //                         null,
        //                         'npcCiv2', 'civBubble', 
        //                         {self: this.novicePortrait, npc: this.npcCiv2Portrait}, null);

        // super.initDialogVeteran();

        // super.addNPC(1000,300, [{self: false, text: 'Ello mate'}, 
        //                         {self: true, text: 'oi.'}],
        //                         [{self: false, text: 'jimbo went on strike for milk'}, 
        //                         {self: true, text: 'what haponm.'}],
        //                         'npcVet2', 'memBubble', 
        //                         {self: this.novicePortrait, npc: this.npcVet2Portrait}, {self: this.veteranPortrait, npc: this.npcVet2Portrait2});

        // super.addNPC(1500,400, [{self: false, text: 'Who tf are you'}, 
        //                         {self: true, text: 'idk bruh.'}],

        //                         [{self: false, text: 'cactus Fred hit me :('}, 
        //                         {self: true, text: 'Prickly pear beware amigo.'}],
        //                         'npcVet1', 'memBubble', 
        //                         {self: this.novicePortrait, npc: this.npcVet1Portrait}, {self: this.veteranPortrait, npc: this.npcVet1Portrait2});
        

    }

    update(){

        super.update();

        if(this.player && this.player.body && !this.p1Init){
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

            this.physics.add.collider(this.player, this.layer3, (player, tile) => {
                console.log('player' + this.player.y + " tile " + tile.y * 100);
                if (this.player.y < tile.y * 100) {
                    this.player.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player.setDepth(10);  // Render player above the tiles
                }
            });

            this.physics.add.overlap(this.player, this.door, ()=>{
                this.game.gameOptions.novPrev = 'desert2';
                this.game.gameOptions.noviceLocation = 'Town';
                console.log('to Town!');

                    this.player.destroy();
                    this.p1Init = false;
                    this.cam.setVisible(false);
                
                    

                if(this.scene.isActive('Town'))
                    this.scene.resume('Town');
                else
                    this.scene.launch('Town');
    
            });

            this.physics.add.overlap(this.player, this.door2, ()=>{
                if(this.game.gameOptions.rocksCollected == 9){
                    this.game.gameOptions.noviceLocation = 'Ending';
                    this.player.destroy();
                    this.p1Init = false;
                    this.cam.setVisible(false);

                    if(this.scene.isActive('Ending'))
                        this.scene.resume('Ending');
                    else
                        this.scene.launch('Ending');

                    return;
                }
                
                this.game.gameOptions.novPrev = 'desert1';
                this.game.gameOptions.noviceLocation = 'City';
                console.log('to City!');
          
                    this.player.destroy();
                    this.p1Init = false;
                    this.cam.setVisible(false);
                
                    

                if(this.scene.isActive('City'))
                    this.scene.resume('City');
                else
                    this.scene.launch('City');
    
            });

        }

        if(this.player2 && this.player2.body && !this.p2Init){
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

            this.physics.add.collider(this.player2, this.layer3, (player, tile) => {
                console.log('player' + this.player2.y + " tile " + tile.y * 100);
                if (this.player2.y < tile.y * 100) {
                    this.player2.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player2.setDepth(10);  // Render player above the tiles
                }
            });

            this.physics.add.overlap(this.player2, this.door, ()=>{
                this.game.gameOptions.vetPrev = 'desert2';
                this.game.gameOptions.veteranLocation = 'Town';
                console.log('to Town!');
                    this.player2.destroy();
                    this.p2Init = false;
                    this.cam2.setVisible(false);
                
                    
                if(this.scene.isActive('Town'))
                    this.scene.resume('Town');
                else
                    this.scene.launch('Town');
    
            });

            this.physics.add.overlap(this.player2, this.door2, ()=>{
                this.game.gameOptions.touchedEle = true;
                console.log('touched');
    
            });

        }
        
    }

}

class Town extends DoubleScene {
    constructor() {
        super('Town', 'Town', [100,550], [650,600]);
    }
    
    preload(){
        this.load.image('desertTiles', 'assets/desert/bridgeMap.png');
        this.load.image('housesTiles', 'assets/Town/houses.png');
        this.load.image('mineciteTiles', 'assets/Town/Miningcite.png');
        this.load.tilemapCSV('town-ground', 'assets/Town/town_ground.csv');
        this.load.tilemapCSV('town-objects', 'assets/Town/town_objects.csv');
        this.load.tilemapCSV('town-houses', 'assets/Town/town_houses.csv');
        this.load.tilemapCSV('town-mine', 'assets/Town/town_mine.csv');
    }

    create(){
        // create map
        let map = this.make.tilemap({ key: 'town-ground', tileWidth: 100, tileHeight: 100 });
        let tileset = map.addTilesetImage('desertTiles', null, 100,100);
        let layer = map.createLayer(0, tileset, 0, 0);

        let map2 = this.make.tilemap({ key: 'town-houses', tileWidth: 100, tileHeight: 100 });
        let houseTileset = map2.addTilesetImage('housesTiles', null, 100,100);
        this.layer2 = map2.createLayer(0, houseTileset, 0, 0);

        let map3 = this.make.tilemap({ key: 'town-objects', tileWidth: 100, tileHeight: 100 });
        this.layer3 = map3.createLayer(0, tileset, 0, 0);

        let map4 = this.make.tilemap({ key: 'town-mine', tileWidth: 100, tileHeight: 100 });
        let miningTile = map4.addTilesetImage('mineciteTiles', null, 100,100);
        this.layer4 = map4.createLayer(0, miningTile, 0, 0);

        this.door = this.add.rectangle(650,405,100,100, 0xaaaaaa).setOrigin(0,0).setAlpha(0.5);
        this.physics.add.existing(this.door);

        this.door2 = this.add.rectangle(0,500,50,100, 0xaaaaaa).setOrigin(0,0).setAlpha(0.5);
        this.physics.add.existing(this.door2);

        // add physics
        // Enable collision for specific tiles
        this.layer2.setCollisionByExclusion([-1]);
        this.layer2.setDepth(5);
        this.layer3.setCollisionByExclusion([-1]);
        this.layer3.setDepth(5);
        this.layer4.setCollisionByExclusion([-1]);
        this.layer4.setDepth(5);

        this.p1Init = false;
        this.p2Init = false;

        super.initDialogNovice();
        super.initDialogVeteran();

        super.addNPC(400,300, [{self: false, text: 'I’m not going back to work, if you want the rock go get it yourself. What do you think going on strike means?'}, 
                                {self: true, text: 'Fine.'}],
                                [{self: false, text: 'They have ignored us for too long. Worked us to the bone…'},
                                {self: false, text: 'Tomorrow they will have to listen to us… I wonder what’s going on past the roadblock.'}, 
                                {self: true, text: 'Hopefully...'}],
                                'npcVet2', 'memBubble', 
                                {self: this.novicePortrait, npc: this.npcVet2Portrait}, {self: this.veteranPortrait, npc: this.npcVet2Portrait2});

        super.addNPC(800,500, [{self: true, text: 'Hi! Is this where the purple rocks are coming from?'}, 
                                {self: false, text: '...'}],

                                [{self: false, text: 'Another day on strike. Let’s hope we finally get their attention today.'},
                                {self: false, text: 'We should check on the roadblock.'}, 
                                {self: true, text: 'There is a roadblock?'},
                                {self: false, text: 'Yeah just down the road.'}],
                                'npcVet1', 'memBubble', 
                                {self: this.novicePortrait, npc: this.npcVet1Portrait}, {self: this.veteranPortrait, npc: this.npcVet1Portrait2});
        


    }

    update(){

        super.update();

        if(this.player && this.player.body && !this.p1Init){
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

            this.physics.add.collider(this.player, this.layer3, (player, tile) => {
                console.log('player' + this.player.y + " tile " + tile.y * 100);
                if (this.player.y < tile.y * 100) {
                    this.player.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player.setDepth(10);  // Render player above the tiles
                }
            });
            this.physics.add.collider(this.player, this.layer4, (player, tile) => {
                console.log('player' + this.player.y + " tile " + tile.y * 100);
                if (this.player.y < tile.y * 100) {
                    this.player.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player.setDepth(10);  // Render player above the tiles
                }
            });

            this.physics.add.overlap(this.player, this.door, ()=>{
                this.game.gameOptions.novPrev = 'Town2';
                this.game.gameOptions.noviceLocation = 'UndergroundMine';
                console.log('to mines!');
       
                    this.player.destroy();
                    this.p1Init = false;
                    this.cam.setVisible(false);
                
                    

                if(this.scene.isActive('UndergroundMine'))
                    this.scene.resume('UndergroundMine');
                else
                    this.scene.launch('UndergroundMine');
    
            });

            this.physics.add.overlap(this.player, this.door2, ()=>{
                this.game.gameOptions.novPrev = 'Town';
                this.game.gameOptions.noviceLocation = 'desert';
                console.log('to desert!');
           
                    this.player.destroy();
                    this.p1Init = false;
                    this.cam.setVisible(false);
                

                if(this.scene.isActive('Desert'))
                    this.scene.resume('Desert');
                else
                    this.scene.launch('Desert');
    
            });

        }

        if(this.player2 && this.player2.body && !this.p2Init){
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

            this.physics.add.collider(this.player2, this.layer3, (player, tile) => {
                console.log('player' + this.player2.y + " tile " + tile.y * 100);
                if (this.player2.y < tile.y * 100) {
                    this.player2.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player2.setDepth(10);  // Render player above the tiles
                }
            });

            this.physics.add.collider(this.player2, this.layer4, (player, tile) => {
                console.log('player' + this.player2.y + " tile " + tile.y * 100);
                if (this.player2.y < tile.y * 100) {
                    this.player2.setDepth(0);  // Render player underneath the tiles
                } else {
                    this.player2.setDepth(10);  // Render player above the tiles
                }
            });

            this.physics.add.overlap(this.player2, this.door, ()=>{
                if(this.game.gameOptions.touchedEle){
                    this.game.gameOptions.veteranLocation = 'Ending';
                    this.player2.destroy();
                    this.p2Init = false;
                    this.cam2.setVisible(false);

                    if(this.scene.isActive('Ending'))
                        this.scene.resume('Ending');
                    else
                        this.scene.launch('Ending');

                    return;
                }
                this.game.gameOptions.vetPrev = 'Town2';
                this.game.gameOptions.veteranLocation = 'UndergroundMine';
                console.log('to mines!');
         
                    this.player2.destroy();
                    this.p2Init = false;
                    this.cam2.setVisible(false);
                
                    
                if(this.scene.isActive('UndergroundMine'))
                    this.scene.resume('UndergroundMine');
                else
                    this.scene.launch('UndergroundMine');
    
            });

            this.physics.add.overlap(this.player2, this.door2, ()=>{
                this.game.gameOptions.vetPrev = 'Town';
                this.game.gameOptions.veteranLocation = 'desert';
                console.log('to desert!');
                this.player2.destroy();
                this.p2Init = false;
                this.cam2.setVisible(false);
            

                if(this.scene.isActive('Desert'))
                    this.scene.resume('Desert');
                else
                    this.scene.launch('Desert');
    
            });

        }
        
    }

}

class Ending extends DoubleScene {
    constructor() {
        super('Ending', 'Ending');
    }


    create(){

        this.p1Init = false;
        this.p2Init = false;

    }

    update(){

        super.update();

        if(this.player && this.player.body && !this.p1Init){
            this.p1Init = true;
            this.cam.setBackgroundColor(0x000000);
            this.cam.setZoom(1);
            this.player.setAlpha(0);

            this.dude = this.add.image(400,190, 'novicePortrait').setScale(4).setScrollFactor(0).setAlpha(1);
            this.diaBoxText = this.add.text(40, 400, "The Novice along with their civilization choose to ignore what goes on above ground. This includes where their resources come from, and the means of how they are obtained.\n\n Due to this, the Novice was not properly educated on the dangers of this rock. In their journey, they become gravely affected by the radiation, and unintentionally condemn the civilization to the same fate as them.", {
                fontFamily: 'Century Gothic',
                fontSize: 37,
                color: '#ffffff',
                align: "left",
                wordWrap: { width: 900, useAdvancedWrap: true},
                lineSpacing: 15,
            })
            .setAlpha(1)
            .setScrollFactor(0)
            .setScale(1)
            .setDepth(20);
    
            this.cam2IgnoreList.push(this.diaBoxText);
            this.cam2IgnoreList.push(this.dude);

            this.cam.ignore(this.camIgnoreList);

            if(this.cam2)
                this.cam2.ignore(this.cam2IgnoreList);

        }

        if(this.player2 && this.player2.body && !this.p2Init){
            this.p2Init = true;
            this.cam2.setBackgroundColor(0x000000);
            this.cam2.setZoom(1);
            this.player2.setAlpha(0);
            this.fullscreen.x = 800;
            this.fullscreen.y = 1020;
            
            this.dude2 = this.add.image(400,190, 'veteranPortrait').setScale(4).setScrollFactor(0);
            this.diaBoxText2 = this.add.text(40, 400, "The community has tried time and time again to inform the civilians about their poor working conditions and exposure to toxic materials, only to be ignored.\n\nThe Veteran returns to the community after concluding that once again, another day has gone by with their strike being unnoticed. Tomorrow the community will have a march where they will go down into the underground city for the first time. They will make themselves known. ", {
                fontFamily: 'Century Gothic',
                fontSize: 37,
                color: '#ffffff',
                align: "left",
                wordWrap: { width: 900, useAdvancedWrap: true},
                lineSpacing: 15,
            })
            .setAlpha(1)
            .setScrollFactor(0)
            .setScale(1)
            .setDepth(20);
    
            this.camIgnoreList.push(this.diaBoxText2);
            this.camIgnoreList.push(this.dude2);

            this.cam2.ignore(this.cam2IgnoreList);

            if(this.cam)
                this.cam.ignore(this.camIgnoreList);
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
    scene: [Start, Desert, NoviceHouse, UndergroundMine, City, Town, Ending],
    checkpt: false,
    pixelArt: true,
}

let game = new Phaser.Game(config);

game.gameOptions = {
    noviceLocation: 'NoviceHouse',
    novPrev: null,
    veteranLocation: 'UndergroundMine',
    vetPrev: null,
    rocksCollected: 0,
    touchedEle: false
}
