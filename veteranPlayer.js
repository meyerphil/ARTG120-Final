export default class VeteranPlayer extends Phaser.Physics.Arcade.Sprite {

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
        //this.setScale(1.2);
        

        // create health
        this.health = [];
        this.maxHealth = 3;
        
        // create animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('vet', { frames: [2] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('vet', { frames: [3] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('vet', { frames: [1] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('vet', { frames: [0] }),
            frameRate: 8,
            repeat: -1
        });
      
    }
  
    update() {

        // horizontal

        if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown)
        {
            this.setVelocityX(-300);
            this.anims.play('left');
        }
        else if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown)
        {
            this.setVelocityX(300);
            this.anims.play('right');
        }
        else
        {
            this.setVelocityX(0);
        }

        // vertical movement

        if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).isDown)
        {
            this.setVelocityY(-300);
            this.anims.play('up');
        }
        else if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).isDown)
        {
            this.setVelocityY(300);
            this.anims.play('down');
        }
        else
        {
            this.setVelocityY(0);
        }
        
    }

    
  }