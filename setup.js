let gameChar_x, gameChar_world_x, gameChar_y;
let scrollPos;
let isJumping, spaceReleased;
let flagpole;
let game_score;
let lives;
let lifechecker;
let upgrades;
let isLeft, isRight, isFalling, isPlummeting;
let isPlatformContact;
let level;
let jumpSound;

const trees_x = [];
const lock = [];
const collectable_body = [];
const collectable_feet = [];
const collectable_hat = [];
const collectables = [];
const undoUpgrades = [];
const canyons = [];
const mountains = [];
const clouds = [];
const enemies = [];
const platforms = [];
const floorPos_y = 432;
const gravityChange = 8; // allows for changing jump and fall speed without altering code

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.05);
}

function setup()
{
    createCanvas(1024, 576);
    restart();
}

function restart()
{
    lives = 4;
    level = 1;
    game_score = 0;
    startGame();
}

function startGame()
{
	gameChar_y = floorPos_y;
    gameChar_x = 0; // must be initialized in startGame before level check to keep from falling deaths from looping
    jumpGravity = 0;
    lifechecker = true;
    upgrades = {hat: false, body: false, feet: false};

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isJumping = false;
    spaceReleased = true;
    isFound = false;
    isPlatformContact = false;
    
    //Initialise arrays of scenery objects.
    clouds.splice(0);
    for (i=0; i<15; i++)
    {
        clouds.push ({
            pos_x: random(100,5000), 
            pos_y: random(0,150), 
            speed: random (0.5,1.5),
            size: random(20,80), 
            color: random(135,235), 
            extend: Math.round(random(0,1))
        });
    }
    
    if (level == 1);
    {   
        clearObjects(); //Clear objects from other levels, keeps objects from copying upon deaths
        
        gameChar_x = 100;
        flagpole = {pos_x: 1250, pos_y: floorPos_y-110, isReached: false}
        
        lock.push (
            {pos_x:980, isUnlocked: false}
        );
        
        collectable_feet.push (
            {pos_x:219, pos_y:320, isFound: false},
            {pos_x:1400, pos_y:323, isFound: false}
        );
        
        collectable_hat.push (
            {pos_x:735, pos_y:155, isFound: false},
            {pos_x:1470, pos_y:320, isFound: false}
        );
        
        collectable_body.push (
            {pos_x:420, pos_y:215, isFound: false},
            {pos_x:1520, pos_y:320, isFound: false}
        );
        
        collectables.push (
            {pos_x:85, pos_y:250, isFound: false}
        );
        
        undoUpgrades.push(
            {start_x:10, start_y:floorPos_y-90, end_x:175, end_y:floorPos_y-90},
            {start_x:1600, start_y:floorPos_y-150, end_x:1600, end_y:floorPos_y-20}
        );
        
        canyons.push (
            {pos_x:620, width: 90},
            {pos_x:1400, width: 160},
            {pos_x:1800, width: 960},
        );

        mountains.push (
            {pos_x: 50, size: 415},
            {pos_x: 800, size: 200}
        );
        
        enemies.push(new Enemy(795,floorPos_y-10, 125));

        //x, y, length, will it fall?, isFalling
        platforms.push(new createPlatforms(210,floorPos_y-110,50,false,false));
        platforms.push(new createPlatforms(260,floorPos_y-210,50,false,false));
        platforms.push(new createPlatforms(410,floorPos_y-210,50,false,false));
        platforms.push(new createPlatforms(495,floorPos_y-380,50,true,false));
        platforms.push(new createPlatforms(560,floorPos_y-210,50,false,false));
        platforms.push(new createPlatforms(620,floorPos_y-380,50,true,false));
        platforms.push(new createPlatforms(700,floorPos_y-270,70,false,false));
        platforms.push(new createPlatforms(1100,floorPos_y-110,200,false,false));
        platforms.push(new createPlatforms(1400,floorPos_y-110,150,false,false));
    }

    if (level == 2)
    {
        clearObjects();
        
        gameChar_x = 250;
        flagpole = {pos_x: 2060, pos_y: floorPos_y, isReached: false}
        
        for (i=0; i<4; i++)
        {
            trees_x.push ((180*i)+45);
        }
        
        lock.push (
            {pos_x:2000, isUnlocked: false}
        );
        
        collectable_feet.push (
            {pos_x:1430, pos_y:300, isFound: false}
        );
        
        collectable_hat.push (
            {pos_x:538, pos_y:floorPos_y-112, isFound: false},
            {pos_x:1430, pos_y:floorPos_y-330, isFound: false}
        );
        
        collectable_body.push (
            {pos_x:120, pos_y: floorPos_y-5, isFound: false},
            {pos_x:1530, pos_y:floorPos_y-20, isFound: false}
        );
        
        collectables.push (
            {pos_x:1800, pos_y:floorPos_y-20, isFound: false}
        );
        
        undoUpgrades.push (
            {start_x:200, start_y:floorPos_y-90, end_x:200, end_y:floorPos_y},
            {start_x:875, start_y:floorPos_y-150, end_x:1000, end_y:floorPos_y-150},
            {start_x:1180, start_y:floorPos_y-325, end_x:1180, end_y:floorPos_y-125}
        );
        
        canyons.push (
            {pos_x:670, width: 450},
            {pos_x:2160, width: 950}
        );
        
        enemies.push(new Enemy(20,floorPos_y-135, 100));
        enemies.push(new Enemy(20,floorPos_y-260, 100));
        enemies.push(new Enemy(20,floorPos_y-385, 100));
        enemies.push(new Enemy(1220,floorPos_y-135, 460));
        
        //x, y, length, will it fall?, isFalling
        platforms.push(new createPlatforms(-10,floorPos_y-125,160,false,false));
        platforms.push(new createPlatforms(-10,floorPos_y-250,160,false,false));
        platforms.push(new createPlatforms(-10,floorPos_y-375,160,false,false));
        platforms.push(new createPlatforms(510,floorPos_y-110,55,false,false));
        platforms.push(new createPlatforms(610,floorPos_y-205,55,false,false));
        platforms.push(new createPlatforms(725,floorPos_y-285,75,true,false));
        platforms.push(new createPlatforms(900,floorPos_y-285,75,true,false));
        platforms.push(new createPlatforms(1200,floorPos_y-125,500,false,false));
        platforms.push(new createPlatforms(1200,floorPos_y-225,400,false,false));
        platforms.push(new createPlatforms(1200,floorPos_y-325,300,false,false));
        
    }
}

function clearObjects ()
{
    enemies.splice(0);
    platforms.splice(0);
    mountains.splice(0);
    canyons.splice(0);
    trees_x.splice(0);
    undoUpgrades.splice(0);
    collectables.splice(0);
    collectable_body.splice(0);
    collectable_feet.splice(0);
    collectable_hat.splice(0);
    lock.splice(0);
}