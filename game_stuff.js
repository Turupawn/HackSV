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
var feedbackText;
var image_a;
var image_b;
var image_c;
var image_d;
var button_select
var button_collect
var button_pay
var velocity = 160
var questions = ["Lizard", "Dinosaur", "Turtle", "Crocodile"]
var current_question = 0
var selected_image = ""

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
  this.load.image('seleccionar', './assets/select.png');
  this.load.image('collect', './assets/collect.png');
  this.load.image('pay', './assets/pay.png');
  this.load.image('logo', './assets/logo.png');
  this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
  //  A simple background for our game
  this.add.image(400, 300, 'sky');
  this.add.image(740, 60, 'logo');

  button_pay = this.add.image(300, 300, 'pay');
  button_pay.setInteractive().on('pointerdown', function() {
    //collect(score)
    payEntry(score)
  });

  scoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#000', fontFamily: 'Open Sans, sans-serif' });
  questionText = this.add.text(16, 70, '', { fontSize: '32px', fill: '#000', fontFamily: 'Open Sans, sans-serif' });
  feedbackText = this.add.text(400, 250, '', { fontSize: '32px', fill: '#000', fontFamily: 'Open Sans, sans-serif' });


  image_a = this.add.image(100, 220, 'a');
  image_b = this.add.image(270, 220, 'b');
  image_c = this.add.image(100, 440, 'c');
  image_d = this.add.image(270, 440, 'd');
  
  button_select = this.add.image(450, 550, 'seleccionar');
  
  button_collect = this.add.image(170, 160, 'collect');

  var selected_color = 0x00FFFF

  image_a.setInteractive().on('pointerdown', function() {
    image_a.setTint(selected_color)
    image_b.setTint(0xffffff)
    image_c.setTint(0xffffff)
    image_d.setTint(0xffffff)
    selected_image = "Dinosaur"
    feedbackText.setText('');
  });

  image_b.setInteractive().on('pointerdown', function() {
    image_a.setTint(0xffffff)
    image_b.setTint(selected_color)
    image_c.setTint(0xffffff)
    image_d.setTint(0xffffff)
    selected_image = "Lizard"
    feedbackText.setText('');
  });

  image_c.setInteractive().on('pointerdown', function() {
    image_a.setTint(0xffffff)
    image_b.setTint(0xffffff)
    image_c.setTint(selected_color)
    image_d.setTint(0xffffff)
    selected_image = "Crocodile"
    feedbackText.setText('');
  });

  image_d.setInteractive().on('pointerdown', function() {
    image_a.setTint(0xffffff)
    image_b.setTint(0xffffff)
    image_c.setTint(0xffffff)
    image_d.setTint(selected_color)
    selected_image = "Turtle"
    feedbackText.setText('');
  });

  button_select.setInteractive().on('pointerdown', function() {
    image_a.setTint(0xffffff)
    image_b.setTint(0xffffff)
    image_c.setTint(0xffffff)
    image_d.setTint(0xffffff)

    console.log(questions[current_question])
    console.log(selected_image)
    if(questions[current_question] == selected_image)
    {
      score += 10;
      feedbackText.setText('Correct!\nNext question...');
    }else
    {
      feedbackText.setText('Incorrect\nPlease try again...');
    }
    
    current_question++
    questionText.setText('Select the image for: ' + questions[current_question]);
    scoreText.setText('Score: ' + score);

    if(questions[current_question] == null)
    {
      feedbackText.setText('');
      endGame()
    }
  });

  button_collect.setInteractive().on('pointerdown', function() {
    collect(score)
    //score = 0
    //scoreText.setText('Score: ' + score);
  });

  image_a.visible = false
  image_b.visible = false
  image_c.visible = false
  image_d.visible = false
  button_select.visible = false
  button_collect.visible = false
  button_pay.visible = true

  initGame()
}

function update ()
{
  if (gameOver)
  {
    return;
  }
}

function initGame()
{
  score = 0
  scoreText.setText('Score: ' + score);
  questionText.setText('Select the image for: ' + questions[current_question]);

  image_a.visible = true
  image_b.visible = true
  image_c.visible = true
  image_d.visible = true
  button_select.visible = true
  button_collect.visible = false
  button_pay.visible = false
}

function endGame()
{
  questionText.setText('Congratulations! Level 1 completed');

  image_a.visible = false
  image_b.visible = false
  image_c.visible = false
  image_d.visible = false
  button_select.visible = false
  button_collect.visible = true
  button_pay.visible = false
}