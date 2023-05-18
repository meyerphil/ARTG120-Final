export default class NovicePlayer extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        // Add the player sprite to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set player properties
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.setDepth(1);
        this.keyboard = scene.input.keyboard;
        this.setScale(1.2);

        // create health
        this.health = [];
        this.maxHealth = 3;
        
      
    }
  
    update() {

        // horizontal movement

        if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown)
        {
            this.setVelocityX(-300);
        }
        else if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown)
        {
            this.setVelocityX(300);
        }
        else
        {
            this.setVelocityX(0);
        }

        // vertical movement

        if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown)
        {
            this.setVelocityY(-300);
        }
        else if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown)
        {
            this.setVelocityY(300);
        }
        else
        {
            this.setVelocityY(0);
        }

        
    }

    
  }