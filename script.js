import NovicePlayer from './novicePlayer.js';
import VeteranPlayer from './veteranPlayer.js';


class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }
    preload(){
        this.load.image('dude', 'assets/ewok.png');
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
        this.player = new NovicePlayer(this, 500, 300, 'dude');

        // follow camera
        cam.startFollow(this.player, true, 0.05, 0.05);
        
        // create world
        this.walls = this.physics.add.staticGroup();
        let square = this.add.image(200,250, 'noviceHouse').setOrigin(0,0).setScale(3);
        let wall = this.add.rectangle(50,500,1600,100, 0x0000aa).setOrigin(0,0);
        this.walls.add(wall);
        this.walls.add(square);

        // add physics
        this.physics.add.collider(this.player, this.walls);

    }

    update(){
        this.player.update();
    }

}

// Scene 2 class
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
        this.player = new VeteranPlayer(this, 500, 300, 'dude');
        
        // follow camera
        cam2.startFollow(this.player, true, 0.05, 0.05);

        // create world
        this.walls = this.physics.add.staticGroup();
        let square = this.add.image(600,100, 'veteranHouse').setOrigin(0,0).setScale(3);
        let wall = this.add.rectangle(50,500,1600,100, 0xaa0000).setOrigin(0,0);
        this.walls.add(wall);
        this.walls.add(square);

        // add physics
        this.physics.add.collider(this.player, this.walls);

    }

    update(){
        this.player.update();
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
    scene: [Start, Novice, Veteran],
    checkpt: false,
}

let game = new Phaser.Game(config);
