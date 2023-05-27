import NovicePlayer from './novicePlayer.js';
import VeteranPlayer from './veteranPlayer.js';


class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }
    preload(){
        this.load.image('dude', 'assets/ewok.png');
        this.load.spritesheet('vet', 'assets/veteranSheet.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('nov', 'assets/noviceSheet.png', { frameWidth: 100, frameHeight: 100 });
        this.load.image('noviceHouse', 'assets/oasishouse-3.png');
        this.load.image('veteranHouse', 'assets/deserthouse-3.png');
    }
    create(){
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.scene.launch('Novice');
        this.scene.launch('Veteran');

    }
    update(){
        //this.player.update();
    }
}


// Scene 1 class
class Novice extends Phaser.Scene {
    constructor() {
      super('Novice');
    }
    
    create(){
        // create camera
        let cam = this.cameras.add(0,0,800,1000);
        //cam.setViewport(800,0,800,1000);
        cam.setBackgroundColor(0x440022);
        cam.zoom = 1.5;
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

        this.npcs = this.physics.add.staticGroup();
        this.NPCArray = [];
        this.addNPC(300,100, '...', '0xaaaaee');
        this.addNPC(600,200, '???', '0xeeaaaa');

        // add physics
        this.physics.add.collider(this.player, this.walls);

        // // Step 4: Listen for 'e' key press event
        this.physics.add.overlap(this.player, this.npcs, (player, npc)=>{
            //console.log('touching');

            if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown){
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

    addNPC(x,y, text, color){
        let NPC = this.add.rectangle(x,y,100,100, color).setOrigin(0,0);
        
        let textObj = this.add.text(x+50, y-50, text, { font: '16px Arial', fill: '#ffffff' }).setOrigin(0.5,1).setAlpha(0);
        
        this.npcs.add(NPC);
        this.NPCArray.push({npc: NPC, text: textObj});

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

    create(){
        // create camera
        let cam2 = this.cameras.add(800,0,800,1000);
        //cam.setViewport(800,0,800,1000);
        cam2.setBackgroundColor(0x002244);
        cam2.zoom = 1.5;
        //this.cameras.main = cam2;
        this.cameras.main.setVisible(false);

        //create player
        this.player = new VeteranPlayer(this, 500, 300, 'vet');
        
        // follow camera
        cam2.startFollow(this.player, true, 0.05, 0.05);

        // create world
        this.walls = this.physics.add.staticGroup();
        let square = this.add.image(600,100, 'veteranHouse').setOrigin(0,0).setScale(3);
        let wall = this.add.rectangle(50,500,1600,100, 0xaa0000).setOrigin(0,0);
        this.walls.add(wall);
        this.walls.add(square);

        this.door = this.add.rectangle(200,200,100,100, 0xaaaa00).setOrigin(0,0);
        this.physics.add.existing(this.door);
        
        this.npcs = this.physics.add.staticGroup();
        this.NPCArray = [];
        this.addNPC(600,300, "hi", '0xaaaaee');
        this.addNPC(400,100, "yo", '0xeeaaaa');

        // add physics
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

}

class Desert extends Phaser.Scene {
    constructor() {
        super('Desert');
    }
    
    preload(){
        this.load.image('tiles', 'assets/bridgeMap.png');
        this.load.tilemapCSV('map', 'assets/bridge.csv');
    }

    create(){
        this.cameras.main.setVisible(false);

        console.log(this.game.gameOptions.noviceLocation);
        // create player(s)
        if(this.game.gameOptions.noviceLocation == 'desert')
            this.createNovice();

        if(this.game.gameOptions.veteranLocation == 'desert')
            this.createVeteran();


        // create map
        const map = this.make.tilemap({ key: 'map', tileWidth: 100, tileHeight: 100 });
        const tileset = map.addTilesetImage('tiles', null, 100,100);
        const layer = map.createLayer(0, tileset, 0, 0);

        // create world
        // this.walls = this.physics.add.staticGroup();
        // let square = this.add.image(600,100, 'veteranHouse').setOrigin(0,0).setScale(3);
        // let wall = this.add.rectangle(50,500,500,100, 0xaa0000).setOrigin(0,0);
        // this.walls.add(wall);
        // this.walls.add(square);

        // add physics
        //this.physics.add.collider(this.player, this.walls);

    }

    createNovice(){
        // create camera
        let cam = this.cameras.add(0,0,800,1000);
        //cam.setViewport(800,0,800,1000);
        cam.setBackgroundColor(0x440022);
        cam.zoom = 1.5;
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
        let cam2 = this.cameras.add(800,0,800,1000);
        //cam.setViewport(800,0,800,1000);
        cam2.setBackgroundColor(0x002244);
        cam2.zoom = 1.5;
        //this.cameras.main = cam2;
        this.cameras.main.setVisible(false);

        //create player
        this.player2 = new VeteranPlayer(this, 1200, 300, 'vet');
        
        // follow camera
        cam2.startFollow(this.player2, true, 0.05, 0.05);
    }

    update(){
        if(this.player)
            this.player.update();
        else if(this.game.gameOptions.noviceLocation == 'desert')
            this.createNovice();

        if(this.player2)
            this.player2.update();
        else if(this.game.gameOptions.veteranLocation == 'desert')
            this.createVeteran();
    }

}


let config = {
    type: Phaser.WEBGL,
    width: 1600,
    height: 1000,
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