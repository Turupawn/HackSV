var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var questionText;
var image_a;
var image_b;
var image_c;
var image_d;
var button_select
var button_collect
var velocity = 160

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', './assets/sky.png');
  this.load.image('ground', './assets/platform.png');
  this.load.image('star', './assets/star.png');
  this.load.image('bomb', './assets/bomb.png');
  this.load.image('a', './assets/A.png');
  this.load.image('b', './assets/B.png');
  this.load.image('c', './assets/C.png');
  this.load.image('d', './assets/D.png');
  this.load.image('seleccionar', './assets/seleccionar.png');
  this.load.image('collect', './assets/collect.png');
  this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
  //  A simple background for our game
  this.add.image(400, 300, 'sky');
  image_a = this.add.image(200, 210, 'a');
  image_b = this.add.image(400, 210, 'b');
  image_c = this.add.image(200, 420, 'c');
  image_d = this.add.image(400, 420, 'd');

  button_select = this.add.image(600, 500, 'seleccionar');
  
  button_collect = this.add.image(600, 50, 'collect');

  var selected_color = 0xff0000

  image_a.setInteractive().on('pointerdown', function() {
    image_a.setTint(selected_color)
    image_b.setTint(0xffffff)
    image_c.setTint(0xffffff)
    image_d.setTint(0xffffff)
  });

  image_b.setInteractive().on('pointerdown', function() {
    image_a.setTint(0xffffff)
    image_b.setTint(selected_color)
    image_c.setTint(0xffffff)
    image_d.setTint(0xffffff)
  });

  image_c.setInteractive().on('pointerdown', function() {
    image_a.setTint(0xffffff)
    image_b.setTint(0xffffff)
    image_c.setTint(selected_color)
    image_d.setTint(0xffffff)
  });

  image_d.setInteractive().on('pointerdown', function() {
    image_a.setTint(0xffffff)
    image_b.setTint(0xffffff)
    image_c.setTint(0xffffff)
    image_d.setTint(selected_color)
  });

  button_select.setInteractive().on('pointerdown', function() {
    image_a.setTint(0xffffff)
    image_b.setTint(0xffffff)
    image_c.setTint(0xffffff)
    image_d.setTint(0xffffff)

    score += 10;
    scoreText.setText('Score: ' + score);
  });

  button_collect.setInteractive().on('pointerdown', function() {
    collect()
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  bombs = this.physics.add.group();
  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  questionText = this.add.text(16, 70, 'Elige la palabra correcta', { fontSize: '32px', fill: '#000' });
}

function update ()
{
  if (gameOver)
  {
    return;
  }
}

function collectStar (player, star)
{
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0)
  {
    //  A new batch of stars to collect
    stars.children.iterate(function (child) {

        child.enableBody(true, child.x, 0, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

  }
}

function hitBomb (player, bomb)
{
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}

function playerBalanceCallback(balance)
{
  if(balance >= 1)
  {
    player.setTint(0xFFD700)
    velocity = 320
  }
}