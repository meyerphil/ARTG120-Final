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
        this.moveSpeed = 150;
        this.canMove = true;
        
        // create animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('vet', { frames: [9,10,9,11] }),
            frameRate: 4,
            repeat: -1,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('vet', { frames: [3,4,3,5] }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('vet', { frames: [6,7,6,8] }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('vet', { frames: [0,1,0,2] }),
            frameRate: 4,
            repeat: -1
        });
      
    }
  
    update() {

        // horizontal
        if(this.canMove){
            if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown)
            {
                this.setVelocityX(-this.moveSpeed);
                this.anims.play('left', true);
                this.setVelocityY(0);
            }
            else if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown)
            {
                this.setVelocityX(this.moveSpeed);
                this.anims.play('right', true);
                this.setVelocityY(0);
            }
            else
            // vertical movement

            if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).isDown)
            {
                this.setVelocityY(-this.moveSpeed);
                this.anims.play('up', true);
                this.setVelocityX(0);
            }
            else if (this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).isDown)
            {
                this.setVelocityY(this.moveSpeed);
                this.anims.play('down', true);
                this.setVelocityX(0);
            }
            else if (this.body)
            {
                this.setVelocityY(0);
                this.setVelocityX(0);

                    let first = this.anims.currentAnim;
                    if(first)
                        this.setFrame(first.frames[0].textureFrame);
                        this.anims.stop();

            }
        } 
        else
        {
            this.setVelocityY(0);
            this.setVelocityX(0);

                let first = this.anims.currentAnim;
                if(first)
                    this.setFrame(first.frames[0].textureFrame);
                    this.anims.stop();

        }
        
    }

    
  }