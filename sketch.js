var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var jumpGravity;
var isJumping;
var spaceReleased;
var gravityChange;
var trees_x;
var clouds;
var mountains;
var canyons;
var collectables;
var flagpole;
var game_score;
var lives;
var lifechecker;
var changeAnim;
var animTimer;
var trees_color;
var upgrades;
var collectable_hat;
var collectable_feet;
var collectable_body;
var undoUpgrades;
var lock;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var enemies;
var platforms;
var isPlatformContact;
var level;

function setup()
{
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    restart();
}

function restart()
{
    changeAnim = false;
    animTimer = 0;
    trees_color = false;
    lives = 4;
    level = 1;
    game_score = 0;
    startGame();
}

function startGame()
{
	gameChar_y = floorPos_y;
    gameChar_x = 0; // must be initialized in startGame before level check to keep from falling deaths counting twice
    jumpGravity = 0;
    gravityChange = 8; // allows for changing jump and fall speed without altering code
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
    
    clouds = [];
    
    for (i=0; i<15; i++)
    {
        clouds.push ({
            pos_x: random(100,5000), 
            pos_y: random(0,150), 
            speed: random (0.2,0.5),
            size: random(20,80), 
            color: random(135,235), 
            extend: Math.round(random(0,1))
        });
    }
    
    //Initialise arrays of scenery objects.
    if (level == 1);
    {
        gameChar_x = 100;
        trees_x = [];
        mountains = [
            {pos_x: 50, size: 415},
            {pos_x: 800, size: 200},
        ];
        canyons = [
            {pos_x:620, width: 90},
            {pos_x:1400, width: 105}
        ];
        collectable_feet = [
            {pos_x:215, pos_y:320, isFound: false}
        ];
        collectable_hat = [
            {pos_x:735, pos_y:145, isFound: false}
        ];
        collectable_body =[
            {pos_x:420, pos_y:220, isFound: false}
        ];
        collectables = [
            {pos_x:75, pos_y:250, isFound: false}
        ];
        flagpole = {pos_x: 1250, isReached: false}
        undoUpgrades = [
            {start_x:10, start_y:floorPos_y-90, end_x:175, end_y:floorPos_y-90}
        ];
        lock = [
            {pos_x:980, isUnlocked: false}
        ];

        enemies = [];
        enemies.push(new Enemy(795,floorPos_y-10, 125));

        platforms = [];
        platforms.push(new createPlatforms(210,floorPos_y-110,50));
        platforms.push(new createPlatforms(260,floorPos_y-210,50));
        platforms.push(new createPlatforms(410,floorPos_y-210,50));
        platforms.push(new createPlatforms(560,floorPos_y-210,50));
        platforms.push(new createPlatforms(700,floorPos_y-270,70));
    }

    if (level == 2)
    {
        gameChar_x = 250;
        trees_x = [];
        mountains = [];
        canyons = [
            {pos_x:650, width: 500}
        ];
        collectable_feet = [
            {pos_x:215, pos_y:320, isFound: false}
        ];
        collectable_hat = [
            {pos_x:738, pos_y:floorPos_y-112, isFound: false}
        ];
        collectable_body =[
            {pos_x:420, pos_y: floorPos_y, isFound: false}
            ];
        collectables = [
            {pos_x:75, pos_y:250, size:40, isFound: false}
        ];
        flagpole = {pos_x: 2250, isReached: false}
        undoUpgrades = [
            {start_x:200, start_y:floorPos_y-90, end_x:200, end_y:floorPos_y}
        ];
        lock = [
            {pos_x:2000, isUnlocked: false}
        ];
        enemies = [];    
        enemies.push(new Enemy(20,floorPos_y-135, 100));
        enemies.push(new Enemy(20,floorPos_y-260, 100));
        enemies.push(new Enemy(20,floorPos_y-385, 100));

        platforms = [];
        platforms.push(new createPlatforms(-10,floorPos_y-125,160));
        platforms.push(new createPlatforms(-10,floorPos_y-250,160));
        platforms.push(new createPlatforms(-10,floorPos_y-375,160));
        platforms.push(new createPlatforms(710,floorPos_y-110,55));
        platforms.push(new createPlatforms(610,floorPos_y-215,55));
        platforms.push(new createPlatforms(700,floorPos_y-315,305));
    }

    if (level == 3)
    {
        gameChar_x = 100;
        trees_x = [];
        mountains = [];
        canyons = [];
        collectable_feet = [];
        collectable_hat = [];
        collectable_body =[];
        collectables = [];
        flagpole = {pos_x: 1250, isReached: false}
        undoUpgrades = [];
        lock = [
            {pos_x:2000, isUnlocked: false}
        ];
        enemies = [];    
        platforms = [];
    }
}

function draw()
{   
    checkPlayerDie();
    for (i=0; i < clouds.length; i++) //create more clouds as clouds move offscreen.
    {
        if (clouds[i].pos_x < -100)
        {
            clouds.splice([i],1);
            clouds.push ({
                pos_x: 5000, 
                pos_y: random(0,150), 
                speed: random (0.2,0.5),
                size: random(20,80), 
                color: random(130,230), 
                extend: Math.round(random(0,1))
            });
        }
    }
    
    background(0, 0, 0); // fill the sky black
    
    push(); //draw grid
    translate(scrollPos/2,0); //create paralax
    for (i=0; i < 5000 / 30; i++)
    {
        stroke(180,0,0,70);
        line (0, i*30+10, 5000, i*30+10);
        noStroke();
    }
    
    for (i=0; i < 5000 / 30; i++)
    {
        stroke(180,0,0,70);
        line (i*30+10, 0, i*30+10, height);
        noStroke();
    }
    
    drawMountains();

    for (i=0; i < clouds.length; i++)
    {
        drawClouds();
    }
    pop();
    
    // Draw trees.
    push();
    translate(scrollPos/1.5,0);
    drawTrees();
    pop();

    // Draw canyons and ground
    push();
    translate(scrollPos,0);
    
    for (i=0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    drawGround();
    
    for(e=0; e < enemies.length; e++) //breaks if i instead. Why?
        {
            enemies[e].draw();
            enemies[e].update(gameChar_world_x,gameChar_y);
            var isContact = enemies[e].checkContact(gameChar_world_x, gameChar_y);
            
            if(isContact)
            {
                lives -=1;
                if (lives >= 0)
                {
                    startGame();
                }
                if (lives < 0)
                {
                    break;
                }
            }
        }
    
    for(i=0;i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }

	// Draw collectable items
    for(i=0;i < collectables.length; i++)
    {
        if (collectables[i].isFound == false)
        {
            drawCollectable(collectables[i], lock[i]);
            checkCollectable(collectables[i], lock[i]);
        }
            
    }
    
    // Draw flagpole
    renderFlagpole(flagpole[i]);

    if (flagpole.isReached == false)
    {
        checkFlagpole(flagpole);
    }
    
    //Draw upgrade items
    for (i=0; i < collectable_hat.length; i++)
    {
        if (collectable_hat[i].isFound == false)
        {
            drawHat(collectable_hat[i]);
            checkHat(collectable_hat[i]);
        }
    }
    
    for (i=0; i < collectable_feet.length; i++)
    {
        if (collectable_feet[i].isFound == false)
        {
            drawFeet(collectable_feet[i]);
            checkFeet(collectable_feet[i]);
        }
    }
    
    for (i=0; i < collectable_body.length; i++)
    {
        if (collectable_body[i].isFound == false)
        {
            drawBody(collectable_body[i]);
            checkBody(collectable_body[i]);
        }
    }
    
    for (i=0; i< undoUpgrades.length; i++)
    {   
        drawUndoUpgrades(undoUpgrades[i]);
        checkUndoUpgrades(undoUpgrades[i]);
    }
    
    pop();
    
	// Draw game character.
	drawGameChar();

    //Draw score and lives    
    push();
    translate (0,500); //Already had created it in top left, this easily moves it to bottom left
    fill(0,0,0,90);
    rect (10,0,205,65);
    for (var n=0; n < lives; n++) //weird interaction with enemies loop breaks if both use i.
    {
        fill (255,140,0); //hat color
        ellipse(100+n*30,80-60,24);
        rect(100+n*30-1,80-73,2,1);
        fill(139,69,19); // hat brim
        stroke(215,100,0);
        ellipse(100+n*30,80-57,23,13);
        noStroke();
        fill(250,235,215); //skin color
        rect(100+n*30-12,80-60,24,14);
    }
    
    fill(255,255,255);
    textSize(20);
    text("Lives:",20,30);
    text("Score: " + game_score,20,60);
    pop();
    
    if (lives < 0)
    {
        fill (0,0,0,100);
        rect(0,0,width,height);
        fill(255,255,255);
        textSize(50);
        text("Game Over",width/2-150,height/2-25);
        textSize(30);
        text("Press Space to continue",width/2-175,height/2+25);
    }
    
    if (flagpole.isReached && level < 3)
    {
        level += 1;
        startGame();  
    }
    if (flagpole.isReached && level == 3)
    {
        fill (0,0,0,100);
        rect(0,0,width,height);
        fill(255,255,255);
        textSize(50);
        text("Game Complete",width/2-150,height/2-25);
        textSize(30);
        text("Press Space to replay",width/2-135,height/2+25);
        return; 
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
        for (i=0; i<lock.length; i++)
        {
            if (gameChar_world_x >= lock[i].pos_x+30 && lock[i].isUnlocked==false || gameChar_x <= 20 || lives < 0)
            {
                gameChar_x += 0;
            }
            else if (gameChar_x > width * 0.2 || gameChar_world_x <= width *0.2 && gameChar_x > 0)
            {
                gameChar_x -= 5;
            }
            else
            {
                scrollPos += 5;
            }
        }
	}

	if(isRight)
	{
        for (i=0; i<lock.length; i++)
        {
            if (gameChar_world_x >= lock[i].pos_x-15 && lock[i].isUnlocked==false || lives < 0)
            {
                gameChar_x += 0;
            }
            else if(gameChar_x < width * 0.8)
            {
                gameChar_x  += 5;
            }
            else
            {
                scrollPos -= 5; // negative for moving against the background
            }
        }
	}
    
    //Gravity Code
    
    for (i=0; i < platforms.length; i++)
    {
        if (platforms[i].checkContact(gameChar_world_x,gameChar_y) == true)
        {
            isPlatformContact = true;
            break;
        }
        else
        {
            isPlatformContact = false;
        }
    }
    
    if (isPlummeting == false)
    { 
        if (isJumping == true && jumpGravity < 125)
        {  
            isFalling = true;
            gameChar_y = gameChar_y-gravityChange; //gravityChange set in setup
            jumpGravity = jumpGravity+gravityChange;
        }
        else if (isJumping == false && gameChar_y != floorPos_y && isPlatformContact == false || gameChar_y < floorPos_y && jumpGravity >= 125 && isPlatformContact == false) // stops at 125 or first tally past or when button is lifted
        {
            isFalling = true;
            gameChar_y = gameChar_y+gravityChange;
            gameChar_y = min(gameChar_y,floorPos_y); //doesn't allow character to fall below floor 
        }
        else if (gameChar_y == floorPos_y && spaceReleased == false || isPlatformContact && spaceReleased == false) // won't reset jumpGravity to allow another jump until space is released
        {
            isFalling = false;
            isJumping = false;
        }
        else if (gameChar_y == floorPos_y && spaceReleased || isPlatformContact && spaceReleased)
        {
            isFalling = false;
            jumpGravity = 0;
            isJumping = false;
        }   
    }

     // Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if(keyCode == 32 && flagpole.isReached == true || keyCode == 32 && lives < 0) // end of level or death reset
    {
        restart();
    }

    if (isPlummeting == false)
    {
        if(keyCode == 37 && flagpole.isReached == false && lives >= 0 || keyCode == 65 && flagpole.isReached == false && lives >= 0) //left
        {
            isLeft = true;
        }
        else if(keyCode == 39 && flagpole.isReached == false && lives >= 0 || keyCode == 68 && flagpole.isReached == false && lives >= 0) //right
        {
            isRight = true;
        }
        if(keyCode == 32 && jumpGravity == 0 && spaceReleased && isFalling == false || keyCode == 87 && jumpGravity == 0 && spaceReleased && isFalling == false) // space
        {
            isJumping = true;
            spaceReleased = false;
        }
    }
}

function keyReleased()
{
    if (isPlummeting == false)
    {
        if(keyCode == 37 || keyCode == 65) //left
        {
            isLeft = false;
        }
        else if(keyCode == 39 || keyCode == 68) //right
        {
            isRight = false;
        }
        if(keyCode == 32 || keyCode == 87) // space
        {
            isJumping = false;
            spaceReleased = true;
        }
    }
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
    if(isLeft && isFalling)
	{
        if (upgrades.body == false)
        {
            noFill();
            stroke(255,0,0);
            rect(gameChar_x-8,gameChar_y-44,23,10); //shirt
            rect(gameChar_x-6,gameChar_y-34,21,10);
            ellipse(gameChar_x+8,gameChar_y-51,6,22);
        }
        else
        {
            noStroke();
            fill (139,0,0) //shirt color
            rect(gameChar_x-8,gameChar_y-44,23,10);
            rect(gameChar_x-6,gameChar_y-34,21,10);
            fill(0,0,0,30); //shadow on arm
            ellipse(gameChar_x+7,gameChar_y-51,6,22);
            fill(250,235,215); //skin color
            ellipse(gameChar_x+8,gameChar_y-51,6,22);
        }
        
        if (upgrades.hat == false)
        {
            noFill()
            stroke(255,0,0);
            arc (gameChar_x+4,gameChar_y-60,24,23,6.5*PI/6,0); //hat
            rect(gameChar_x+3,gameChar_y-73,2,2);
            line(gameChar_x-2,gameChar_y-60,gameChar_x-10,gameChar_y-65);
            rect(gameChar_x-8,gameChar_y-60,24,16); //face
            rect(gameChar_x+6,gameChar_y-60,10,6); //hair
            rect(gameChar_x-8,gameChar_y-50,8,1);
            rect(gameChar_x-5,gameChar_y-58,2,4);
            rect(gameChar_x-3,gameChar_y-57,1,3);
        }
        else
        {
            noStroke();
            fill (255,140,0); //hat color
            ellipse (gameChar_x+4,gameChar_y-60,24,23);
            rect(gameChar_x+3,gameChar_y-73,2,2);
            fill(139,69,19); // hair
            triangle(gameChar_x-8, gameChar_y-60, gameChar_x-7, gameChar_y-64,gameChar_x-2,gameChar_y-60);
            stroke(215,100,0); // hat brim
            line(gameChar_x-2,gameChar_y-60,gameChar_x-10,gameChar_y-67)
            noStroke()
            fill(250,235,215); //skin color
            rect(gameChar_x-8,gameChar_y-60,24,16);
            fill(255);
            rect(gameChar_x+14,gameChar_y-48,2,4); // neck countour
            rect(gameChar_x-8,gameChar_y-48,2,4);
            fill(139,69,19); // hair
            rect(gameChar_x+6,gameChar_y-60,10,6);
            fill(139,69,19,60); //mouth
            rect(gameChar_x-8,gameChar_y-50,8,1);
            fill(80,80,140); //eye
            rect(gameChar_x-5,gameChar_y-58,2,4);
            fill(255);
            rect(gameChar_x-3,gameChar_y-57,1,3);
        }
        
        if (upgrades.feet == false)
        {
            noFill();
            stroke(255,0,0);
            ellipse(gameChar_x+16,gameChar_y-7,3,8) //shoes
            ellipse(gameChar_x+3,gameChar_y-7,3,8)
            rect (gameChar_x-6,gameChar_y-24,21,1); //belt
            rect(gameChar_x+4,gameChar_y-19,10,4); //leg part 1
            ellipse(gameChar_x+8,gameChar_y-13,10,8);
            rect(gameChar_x+5,gameChar_y-11,10,4); //leg part 3
            rect(gameChar_x-6,gameChar_y-25,21,6); //top
            rect(gameChar_x+5,gameChar_y-19,10,4); //right leg part 1
            rect(gameChar_x+6,gameChar_y-11,10,4); //right leg part 
            rect(gameChar_x-7,gameChar_y-19,10,4); //left leg part 1
            rect(gameChar_x-6,gameChar_y-11,10,4); //left leg part
        }
        else
        {
            noStroke();
            fill (220,220,220); //shoes color
            ellipse(gameChar_x+16,gameChar_y-7,3,8)
            ellipse(gameChar_x+3,gameChar_y-7,3,8)
            noStroke();
            fill(149,79,29); // belt
            rect (gameChar_x-6,gameChar_y-24,21,1);
            fill (220,228,235); //pants shadow
            rect(gameChar_x+4,gameChar_y-19,10,4); //leg part 1
            ellipse(gameChar_x+8,gameChar_y-13,10,8);
            rect(gameChar_x+5,gameChar_y-11,10,4); //leg part 3
            fill (240,248,255); //pants color
            rect(gameChar_x-6,gameChar_y-25,21,6); //top
            rect(gameChar_x+5,gameChar_y-19,10,4); //right leg part 1
            ellipse(gameChar_x+9,gameChar_y-13,10,8); //right knee
            rect(gameChar_x+6,gameChar_y-11,10,4); //right leg part 
            rect(gameChar_x-7,gameChar_y-19,10,4); //left leg part 1
            ellipse(gameChar_x-4,gameChar_y-13,10,8); //right knee
            rect(gameChar_x-6,gameChar_y-11,10,4); //left leg part
        }
        
        noStroke();
        noFill();

	}
	else if(isRight && isFalling)
	{
        if (upgrades.body == false)
        {
            noFill();
            stroke(255,0,0);
            rect(gameChar_x-14,gameChar_y-44,23,10);//shirt
            rect(gameChar_x-14,gameChar_y-34,21,10);
            ellipse(gameChar_x-6,gameChar_y-37,6,8); //arm
        }
        else
        {
            noStroke();
            fill (139,0,0) //shirt color
            rect(gameChar_x-14,gameChar_y-44,23,10);
            rect(gameChar_x-14,gameChar_y-34,21,10);
            fill(250,235,215); //skin color
            ellipse(gameChar_x-6,gameChar_y-37,6,8); 
        }
        
        if (upgrades.hat == false)
        {
            noFill();
            stroke (255,0,0);
            arc (gameChar_x-3,gameChar_y-60,24,23,PI,11*PI/6); //hat
            rect(gameChar_x-4,gameChar_y-73,2,2);
            line(gameChar_x+3,gameChar_y-60,gameChar_x+10,gameChar_y-65) //hat brim
            rect(gameChar_x-15,gameChar_y-60,24,16); //face
            rect(gameChar_x-15,gameChar_y-60,10,6); //hair
            rect(gameChar_x,gameChar_y-50,8,1); //mouth
            rect(gameChar_x+3,gameChar_y-58,2,4);//eyes
            rect(gameChar_x+2,gameChar_y-57,1,3);
        }
        else
        {
            noStroke()
            fill (255,140,0); //hat color
            ellipse (gameChar_x-4,gameChar_y-60,24,23);
            rect(gameChar_x-5,gameChar_y-73,2,2);
            fill(139,69,19); // hair
            triangle(gameChar_x+8, gameChar_y-60, gameChar_x+7, gameChar_y-64,gameChar_x+2,gameChar_y-60);
            stroke(215,100,0); // hat brim
            line(gameChar_x,gameChar_y-60,gameChar_x+10,gameChar_y-67)
            noStroke()
            fill(250,235,215); //skin color
            rect(gameChar_x-16,gameChar_y-60,24,16);
            fill(139,69,19); // hair
            rect(gameChar_x-16,gameChar_y-60,10,6);
            fill(139,69,19,60); //mouth
            rect(gameChar_x,gameChar_y-50,8,1);
            fill(80,80,140); //eye
            rect(gameChar_x+3,gameChar_y-58,2,4);
            fill(255);
            rect(gameChar_x+2,gameChar_y-57,1,3);
        }
        
        if (upgrades.feet == false)
        {
            noFill();
            stroke(255,0,0);
            ellipse(gameChar_x-16,gameChar_y-7,3,8); //shoes
            ellipse(gameChar_x-2,gameChar_y-7,3,8);
            rect (gameChar_x-14,gameChar_y-26,21,1); //belt
            rect(gameChar_x-13,gameChar_y-19,10,4); //leg part1
            ellipse(gameChar_x-8,gameChar_y-13,10,8);
            rect(gameChar_x-15,gameChar_y-11,10,4); //leg part 3
            rect(gameChar_x-14,gameChar_y-25,21,6); //top
            rect(gameChar_x-14,gameChar_y-19,10,4); //left leg part 1
            rect(gameChar_x-16,gameChar_y-11,10,4); //left leg part 3
            rect(gameChar_x-2,gameChar_y-19,10,4); //right leg part 1
            rect(gameChar_x-2,gameChar_y-11,10,4); //right leg part 3
        }
        else
        {
            noStroke();
            fill (220,220,220); //shoes color
            ellipse(gameChar_x-16,gameChar_y-7,3,8);
            ellipse(gameChar_x-2,gameChar_y-7,3,8);
            noStroke();
            fill(149,79,29); // belt
            rect (gameChar_x-14,gameChar_y-26,21,1);
            fill (220,228,235); //pants shadow
            rect(gameChar_x-13,gameChar_y-19,10,4); //leg part1
            ellipse(gameChar_x-8,gameChar_y-13,10,8);
            rect(gameChar_x-15,gameChar_y-11,10,4); //leg part 3
            fill (240,248,255); //pants color
            rect(gameChar_x-14,gameChar_y-25,21,6); //top
            rect(gameChar_x-14,gameChar_y-19,10,4); //left leg part 1
            ellipse(gameChar_x-9,gameChar_y-13,10,8); //left knee
            rect(gameChar_x-16,gameChar_y-11,10,4); //left leg part 3
            rect(gameChar_x-2,gameChar_y-19,10,4); //right leg part 1
            ellipse(gameChar_x+4,gameChar_y-13,10,8); //right knee
            rect(gameChar_x-2,gameChar_y-11,10,4); //right leg part 3
        }    
        
        noStroke();
        noFill();
	}
	else if(isLeft)
	{
        
        if (upgrades.body == false)
        {
            noFill();
            stroke(255,0,0);
            rect(gameChar_x-8,gameChar_y-44,23,10); //stroke
            rect(gameChar_x-6,gameChar_y-34,21,10);
            ellipse(gameChar_x+8,gameChar_y-34,6,18); //arm
        }
        else
        {
            noStroke();
            fill (139,0,0) //shirt color
            rect(gameChar_x-8,gameChar_y-44,23,10);
            rect(gameChar_x-6,gameChar_y-34,21,10);
            fill(250,235,215); //skin color
            ellipse(gameChar_x+8,gameChar_y-34,6,18); 
        }
        
        if (upgrades.hat == false)
        {
            noFill()
            stroke(255,0,0);
            arc (gameChar_x+4,gameChar_y-60,24,23,6.5*PI/6,0); //hat
            rect(gameChar_x+3,gameChar_y-73,2,2);
            line(gameChar_x-2,gameChar_y-60,gameChar_x-10,gameChar_y-65);
            rect(gameChar_x-8,gameChar_y-60,24,16); //face
            rect(gameChar_x+6,gameChar_y-60,10,6); //hair
            rect(gameChar_x-8,gameChar_y-50,8,1);
            rect(gameChar_x-5,gameChar_y-58,2,4);
            rect(gameChar_x-3,gameChar_y-57,1,3);
        }
        else
        {
            noStroke();
            fill (255,140,0); //hat color
            ellipse (gameChar_x+4,gameChar_y-60,24,23);
            rect(gameChar_x+3,gameChar_y-73,2,2);
            fill(139,69,19); // hair
            triangle(gameChar_x-8, gameChar_y-60, gameChar_x-8, gameChar_y-63,gameChar_x-2,gameChar_y-60);
            stroke(215,100,0); // hat brim
            line(gameChar_x-2,gameChar_y-60,gameChar_x-10,gameChar_y-65)
            noStroke()
            fill(250,235,215); //skin color
            rect(gameChar_x-8,gameChar_y-60,24,16);
            fill(139,69,19); // hair
            rect(gameChar_x+6,gameChar_y-60,10,6);
            fill(139,69,19,60); //mouth
            rect(gameChar_x-8,gameChar_y-50,8,1);
            fill(80,80,140); //eye
            rect(gameChar_x-5,gameChar_y-58,2,4);
            fill(255);
            rect(gameChar_x-3,gameChar_y-57,1,3);
        }
        
        if (upgrades.feet == false)
        {
            noFill();
            stroke(255,0,0);
            arc(gameChar_x-7,gameChar_y-4,10,7, 2*PI, PI) //shoes
            arc(gameChar_x+10,gameChar_y-4,10,7, 2*PI, PI)
            rect (gameChar_x-6,gameChar_y-26,21,1);
            rect(gameChar_x+5,gameChar_y-25,10,21); //leg
            beginShape();
            vertex (gameChar_x-12,gameChar_y-4);
            vertex (gameChar_x-2,gameChar_y-4);
            vertex (gameChar_x+4,gameChar_y-25);
            vertex (gameChar_x-6,gameChar_y-25);
            endShape(CLOSE);
        }
        else
        {
            noStroke();
            fill (220,220,220); //shoes color
            ellipse(gameChar_x-9,gameChar_y-4,12,7)
            ellipse(gameChar_x+9,gameChar_y-4,12,7)
            fill(149,79,29); // belt
            rect (gameChar_x-6,gameChar_y-26,21,1);
            fill (220,228,235); //pants shadow
            rect(gameChar_x+3,gameChar_y-25,10,16); //leg
            fill (240,248,255); //pants color
            rect(gameChar_x+5,gameChar_y-25,10,21); //leg
            rect(gameChar_x-5,gameChar_y-25,20,6); //top
            triangle(gameChar_x-12,gameChar_y-4,gameChar_x-6,gameChar_y-25,gameChar_x+4,gameChar_y-25);
            triangle(gameChar_x-12,gameChar_y-4,gameChar_x-2,gameChar_y-4,gameChar_x+1,gameChar_y-24);
        }

        noStroke();
        noFill();

	}
	else if(isRight)
	{
        
        if (upgrades.body == false)
        {
            noFill();   
            stroke(255,0,0);
            rect(gameChar_x-14,gameChar_y-44,23,10); //shirt
            rect(gameChar_x-14,gameChar_y-34,21,10);
            ellipse(gameChar_x-6,gameChar_y-34,6,18); //arm
        }
        else
        {
            noStroke();
            fill (139,0,0) //shirt color
            rect(gameChar_x-14,gameChar_y-44,23,10);
            rect(gameChar_x-14,gameChar_y-34,21,10);
            fill(250,235,215); //skin color
            ellipse(gameChar_x-6,gameChar_y-34,6,18);
        }
        
        if (upgrades.hat == false)
        {
            noFill();
            stroke (255,0,0);
            arc (gameChar_x-3,gameChar_y-60,24,23,PI,11*PI/6); //hat
            rect(gameChar_x-4,gameChar_y-73,2,2);
            line(gameChar_x+3,gameChar_y-60,gameChar_x+10,gameChar_y-65) //hat brim
            rect(gameChar_x-15,gameChar_y-60,24,16); //face
            rect(gameChar_x-15,gameChar_y-60,10,6); //hair
            rect(gameChar_x,gameChar_y-50,8,1); //mouth
            rect(gameChar_x+3,gameChar_y-58,2,4);//eyes
            rect(gameChar_x+2,gameChar_y-57,1,3);
        }
        else
        {
            noStroke();
            fill (255,140,0); //hat color
            ellipse (gameChar_x-4,gameChar_y-60,24,23);
            rect(gameChar_x-5,gameChar_y-73,2,2);
            fill(139,69,19); // hair
            triangle(gameChar_x+8, gameChar_y-60, gameChar_x+8, gameChar_y-63,gameChar_x+2,gameChar_y-60);
            stroke(215,100,0); // hat brim
            line(gameChar_x+2,gameChar_y-60,gameChar_x+10,gameChar_y-65)
            noStroke()
            fill(250,235,215); //skin color
            rect(gameChar_x-16,gameChar_y-60,24,16);
            fill(139,69,19); // hair
            rect(gameChar_x-16,gameChar_y-60,10,6);
            fill(139,69,19,60); //mouth
            rect(gameChar_x,gameChar_y-50,8,1);
            fill(80,80,140); //eye
            rect(gameChar_x+3,gameChar_y-58,2,4);
            fill(255);
            rect(gameChar_x+2,gameChar_y-57,1,3);
        }
        
        if (upgrades.feet == false)
        {
            noFill();
            stroke(255,0,0);
            arc(gameChar_x-9,gameChar_y-4,10,7,2*PI, PI);
            arc(gameChar_x+7,gameChar_y-4,10,7,2*PI, PI);
            rect (gameChar_x-14,gameChar_y-26,21,1); //belt
            rect(gameChar_x-14,gameChar_y-25,10,21); //leg
            beginShape();
            vertex(gameChar_x+12,gameChar_y-4);
            vertex(gameChar_x+3,gameChar_y-4);
            vertex(gameChar_x,gameChar_y-25);
            vertex(gameChar_x+8,gameChar_y-25);
            endShape(CLOSE);
        }
        else
        {
            noStroke();
            fill (220,220,220); //shoes color
            ellipse(gameChar_x-8,gameChar_y-4,12,7);
            ellipse(gameChar_x+9,gameChar_y-4,12,7);
            fill(149,79,29); // belt
            rect (gameChar_x-14,gameChar_y-26,21,1);
            fill (220,228,235); //pants shadow
            rect(gameChar_x-12,gameChar_y-25,10,16); //leg
            fill (240,248,255); //pants color
            rect(gameChar_x-14,gameChar_y-25,10,21); //leg
            rect(gameChar_x-14,gameChar_y-25,21,6); //top
            triangle(gameChar_x+12,gameChar_y-4,gameChar_x-6,gameChar_y-25,gameChar_x+8,gameChar_y-25);
            triangle(gameChar_x+12,gameChar_y-4,gameChar_x+3,gameChar_y-4,gameChar_x,gameChar_y-25);
        }
        
        noStroke();
        noFill();

	}
	else if(isFalling || isPlummeting)
	{
        if (upgrades.body == false)
        {
            noFill();
            stroke(255,0,0);
            arc(gameChar_x-12,gameChar_y-42,20,4,PI/2,3*PI/2); //left arm
            ellipse(gameChar_x+12,gameChar_y-50,4,24); //right arm
            rect(gameChar_x-12,gameChar_y-46,24,16); //shirt
        }
        else
        {
            noStroke();
            fill(250,235,215); //skin color
            ellipse(gameChar_x-12,gameChar_y-42,20,4); //left arm hides behind shirt and pants
            fill (139,0,0); //shirt color
            ellipse(gameChar_x,gameChar_y-40,24,50);
            fill(0,0,0,30); //shadow on arm
            ellipse(gameChar_x+11,gameChar_y-50,4,24);
            fill(250,235,215); //skin color
            ellipse(gameChar_x+12,gameChar_y-50,4,24);  //right arm moved in front to grab hat
        }
        
        if (upgrades.hat == false)
        {
            noFill();
            stroke(255,0,0);
            arc(gameChar_x,gameChar_y-60,24,24,PI,PI/180); //hat
            rect(gameChar_x-1,gameChar_y-73,2,1); //hat top
            arc (gameChar_x,gameChar_y-57,24,13,PI,PI/180); //hat brim
            rect(gameChar_x-12,gameChar_y-60,24,14); //face
            rect(gameChar_x-5,gameChar_y-58,2,4); //eyes
            rect(gameChar_x+3,gameChar_y-58,2,4);
            rect(gameChar_x-3,gameChar_y-58,1,3);
            rect(gameChar_x+5,gameChar_y-58,1,3);
            rect(gameChar_x-4,gameChar_y-50,8,1); //mouth
        }
        else
        {
            fill (255,140,0); //hat color
            ellipse(gameChar_x,gameChar_y-60,24,24);
            rect(gameChar_x-1,gameChar_y-73,2,1);
            fill(139,69,19); // hat brim and hair
            stroke(215,100,0);
            ellipse(gameChar_x,gameChar_y-60,23,13);
            
            noStroke();
            fill(250,235,215); //skin color
            rect(gameChar_x-12,gameChar_y-60,24,14);
            fill(255);
            rect(gameChar_x-12,gameChar_y-52,2,8); // face countour
            rect(gameChar_x+10,gameChar_y-52,2,8);
            
            fill(80,80,140); //eyes
            rect(gameChar_x-5,gameChar_y-58,2,4);
            rect(gameChar_x+3,gameChar_y-58,2,4);
            fill(255);
            rect(gameChar_x-3,gameChar_y-57,1,3);
            rect(gameChar_x+5,gameChar_y-57,1,3);
            
            fill(139,69,19,60); //mouth
            rect(gameChar_x-4,gameChar_y-50,8,1);
        }
        
        if (upgrades.feet == false)
        {
            noFill();
            stroke(255,0,0);
            arc(gameChar_x-6,gameChar_y-9,10,10,PI/180,PI); //shoes
            arc(gameChar_x+6,gameChar_y-9,10,10,PI/180,PI);
            stroke(235,0,0); //laces
            line(gameChar_x-9.5,gameChar_y-8,gameChar_x-3,gameChar_y-9);
            line(gameChar_x-8.5,gameChar_y-6,gameChar_x-4,gameChar_y-7);
            line(gameChar_x+9,gameChar_y-8,gameChar_x+2.5,gameChar_y-9);
            line(gameChar_x+8,gameChar_y-6,gameChar_x+3.5,gameChar_y-7);
            stroke(255,0,0);
            rect(gameChar_x-11,gameChar_y-30,10,20); //leg
            rect (gameChar_x-12,gameChar_y-24,1,8);
            rect(gameChar_x+1,gameChar_y-30,10,20); //leg
            rect (gameChar_x+11,gameChar_y-24,1,8);
            rect(gameChar_x-11,gameChar_y-29,22,6); //top
            rect (gameChar_x-11,gameChar_y-30,22,1); //belt
        
        }
        else
        {
            noStroke();
            fill (220,220,220); //shoes color
            ellipse(gameChar_x-6,gameChar_y-9,10,10);
            ellipse(gameChar_x+6,gameChar_y-9,10,10);
            stroke(0,0,0,70); //laces
            line(gameChar_x-10,gameChar_y-8,gameChar_x-3,gameChar_y-9);
            line(gameChar_x-9,gameChar_y-6,gameChar_x-4,gameChar_y-7);
            line(gameChar_x+9,gameChar_y-8,gameChar_x+2,gameChar_y-9);
            line(gameChar_x+8,gameChar_y-6,gameChar_x+3,gameChar_y-7);
            noStroke();
            fill (240,248,255); //pants color
            rect(gameChar_x-11,gameChar_y-30,10,20); //leg
            rect (gameChar_x-12,gameChar_y-24,1,8);
            rect(gameChar_x+1,gameChar_y-30,10,20); //leg
            rect (gameChar_x+11,gameChar_y-24,1,8);
            rect(gameChar_x-11,gameChar_y-29,22,6); //top
            fill (220,228,235); //pants shadow
            rect (gameChar_x-2,gameChar_y-25,3,10);
            fill (220,228,235,80);
            ellipse(gameChar_x-7,gameChar_y-20,6,8);
            ellipse(gameChar_x+7,gameChar_y-20,6,8);
            fill(149,79,29); // belt
            rect (gameChar_x-11,gameChar_y-30,22,1);
        }
        
        noStroke();
        noFill();
        
	}
	else //Standing
	{
        
        if (upgrades.body == false)
        { 
            noFill();
            stroke(255,0,0);
            arc(gameChar_x-12,gameChar_y-36,7,18,1.48,3*PI/2); //arms
            arc(gameChar_x+13,gameChar_y-36,7,18,3*PI/2,1.66);
            rect(gameChar_x-12,gameChar_y-46,24,16); //torso
        }
        else
        {
            noStroke();
            fill(250,235,215); //skin color
            ellipse(gameChar_x-11.5,gameChar_y-35,5,18); //arms hide behind shirt and pants
            ellipse(gameChar_x+12.5,gameChar_y-35,5,18); 
            fill (139,0,0); //shirt color
            rect(gameChar_x-12,gameChar_y-46,24,16);
        }
        
        if (upgrades.hat == false)
        {
            noFill();
            stroke(255,0,0);
            arc(gameChar_x,gameChar_y-60,24,24,PI,PI/180); //hat
            rect(gameChar_x-1,gameChar_y-73,2,1); //hat top
            arc (gameChar_x,gameChar_y-57,24,13,PI,PI/180); //hat brim
            rect(gameChar_x-12,gameChar_y-60,24,14); //face
            rect(gameChar_x-5,gameChar_y-58,2,4); //eyes
            rect(gameChar_x+3,gameChar_y-58,2,4);
            rect(gameChar_x-3,gameChar_y-58,1,3);
            rect(gameChar_x+5,gameChar_y-58,1,3);
            rect(gameChar_x-4,gameChar_y-50,8,1); //mouth
        } 
        else
        {
            noStroke();
            fill (255,140,0); //hat color
            ellipse(gameChar_x+0.5,gameChar_y-60,24,24);
            rect(gameChar_x,gameChar_y-73,2,1);
            fill(139,69,19); // hat brim
            stroke(215,100,0);
            ellipse(gameChar_x+0.5,gameChar_y-57,23,13);
            noStroke();
            fill(250,235,215); //skin color
            rect(gameChar_x-11.5,gameChar_y-60,24,14);
            fill(80,80,140); //eyes
            rect(gameChar_x-5,gameChar_y-58,2,4);
            rect(gameChar_x+3,gameChar_y-58,2,4);
            fill(255); //eye shadow
            rect(gameChar_x-3,gameChar_y-58,1,3);
            rect(gameChar_x+5,gameChar_y-58,1,3); 
            fill(139,69,19,60); //mouth
            rect(gameChar_x-4,gameChar_y-50,8,1);
        }

        if (upgrades.feet == false)
        {
            noFill();
            stroke(255,0,0);
            arc(gameChar_x-6,gameChar_y-3,10,10,PI/180,PI); //shoes
            arc(gameChar_x+6,gameChar_y-3,10,10,PI/180,PI);
            stroke(235,0,0); //laces
            line(gameChar_x-9.5,gameChar_y-2.5,gameChar_x-3,gameChar_y-2.5);
            line(gameChar_x-8.5,gameChar_y-0.5,gameChar_x-4,gameChar_y-0.5);
            line(gameChar_x+9,gameChar_y-2.5,gameChar_x+2.5,gameChar_y-2.5);
            line(gameChar_x+8,gameChar_y-0.5,gameChar_x+3.5,gameChar_y-0.5);
            stroke(255,0,0);; //pants color
            rect(gameChar_x-11,gameChar_y-30,10,26); //leg
            rect(gameChar_x+1,gameChar_y-30,10,26); //leg
            rect(gameChar_x-10,gameChar_y-30,20,1); //belt
        }
        else
        {
            noStroke();
            fill (220,220,220); //shoes color
            ellipse(gameChar_x-6,gameChar_y-3,10,10)
            ellipse(gameChar_x+6,gameChar_y-3,10,10)
            stroke(0,0,0,70); //laces 
            line(gameChar_x-9.5,gameChar_y-3,gameChar_x-3,gameChar_y-3);
            line(gameChar_x-8.5,gameChar_y-1,gameChar_x-4,gameChar_y-1);
            line(gameChar_x+9.5,gameChar_y-3,gameChar_x+2,gameChar_y-3);
            line(gameChar_x+8.5,gameChar_y-1,gameChar_x+3,gameChar_y-1);
            noStroke();
            fill (240,248,255); //pants color
            rect(gameChar_x-11,gameChar_y-30,10,26); //leg
            rect(gameChar_x+1,gameChar_y-30,10,26); //leg
            rect(gameChar_x-11,gameChar_y-29,22,6); //top
            fill (220,228,235); //pants shadow
            rect (gameChar_x-1,gameChar_y-25,2,16);
            fill(149,79,29); // belt
            rect (gameChar_x-11,gameChar_y-30,22,1);
        }
        
        noStroke();
        noFill();
	}
}

// ---------------------------
// Background render functions
// ---------------------------
function drawClouds()
    {
        for (var i=0; i < clouds.length; i++)
        {
            fill(clouds[i].color,55,55);
                ellipse(clouds[i].pos_x,clouds[i].pos_y,clouds[i].size,clouds[i].size);
                ellipse(clouds[i].pos_x-clouds[i].size*.5,clouds[i].pos_y,clouds[i].size*.75,clouds[i].size*.75);
                ellipse(clouds[i].pos_x+clouds[i].size*.5,clouds[i].pos_y,clouds[i].size*.75,clouds[i].size*.75);

            if (clouds[i].extend == 1) //adds more puffs
            {
                ellipse(clouds[i].pos_x-clouds[i].size*.85,clouds[i].pos_y,clouds[i].size*.5,clouds[i].size*.5);
                ellipse(clouds[i].pos_x+clouds[i].size*.85,clouds[i].pos_y,clouds[i].size*.5,clouds[i].size*.5);
            }
            
            clouds[i].pos_x -= clouds[i].speed / 5;
        }
    }

function drawMountains()
{
    for (var i=0; i < mountains.length; i++)
    {
        fill(55,0,0); //body
        strokeWeight(3);
        triangle(mountains[i].pos_x,floorPos_y,mountains[i].pos_x+mountains[i].size*.5,floorPos_y-mountains[i].size,mountains[i].pos_x+mountains[i].size,floorPos_y);
        triangle(mountains[i].pos_x+mountains[i].size*.375,floorPos_y,mountains[i].pos_x+mountains[i].size*.875,floorPos_y-mountains[i].size*0.8,mountains[i].pos_x+mountains[i].size*1.375,floorPos_y);
        fill(235,185,185); //snowcap
        triangle(mountains[i].pos_x+mountains[i].size*.5,floorPos_y-mountains[i].size,mountains[i].pos_x+mountains[i].size*.4,floorPos_y-mountains[i].size*.8,mountains[i].pos_x+mountains[i].size*.6,floorPos_y-mountains[i].size*.8);
        noFill();
        noStroke();
    }
}

function drawTrees()
{

    if (trees_color == false)
    {
        trees_x.forEach(element =>
        {
            noFill();
            stroke(175,0,0);
            strokeWeight(3);
            rect(element,floorPos_y-100,60,101);
            beginShape();
            vertex(element+30,floorPos_y-250);
            vertex(element-50,floorPos_y-150);
            vertex(element-10,floorPos_y-150);
            vertex(element-50,floorPos_y-100);
            vertex(element+110,floorPos_y-100);
            vertex(element+70,floorPos_y-150);
            vertex(element+110,floorPos_y-150);
            endShape(CLOSE);
        });
    }
    
//    if (trees_color == true)
//    {
//        trees_x.forEach(element =>
//        {
//            fill(90,50,0); //trunk
//            rect(element,floorPos_y-150,60,151);
//            fill(0,140,0); //leaves
//            triangle(element-50,floorPos_y-150+50,element+30,floorPos_y-150-50,element+110,floorPos_y-150+50); 
//            triangle(element-50,floorPos_y-150,element+30,floorPos_y-150-100,element+110,floorPos_y-150);
//        });
//    }
    
    noStroke();
    noFill();
}

function drawGround()
{
    noStroke();
	fill(160,0,0);
	rect(0, floorPos_y, flagpole.pos_x + width, height/4); // draw some red ground
    noFill();
    stroke(0,0,0);
    for (i=0; i < 8; i++) //create bricks
    {
        for (j=-1; j < (flagpole.pos_x + width) / 50; j++)
        {
            if (i % 2 == 0)
            {
                rect(j*50,i*20+floorPos_y,50,20);
            }
            else
            {   
                rect(j*50+25,i*20+floorPos_y,50,20);
            }
        }
    }
    for (i=0; i<119; i+=7) //create gradient
    {
        stroke(0,0,0,i/2+50);
        strokeWeight(i/10); 
        for (j=0; j<flagpole.pos_x + width; j+=8)
        {
            point (j, height+i-119);
        }
    }
    noStroke(); 
    strokeWeight(1);
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(0,0,0);
    rect(t_canyon.pos_x,floorPos_y,t_canyon.width,height-floorPos_y);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
      if (isJumping==false && gameChar_world_x > t_canyon.pos_x +10 && gameChar_world_x < t_canyon.pos_x+t_canyon.width - 10 && gameChar_y == floorPos_y) 
        {
            isPlummeting = true; 
            isLeft = false; //end movement so you don't clip through ground
            isRight = false; 
        }
    
    if (isPlummeting == true)
        {
            gameChar_y = gameChar_y + gravityChange * 1.5;
        }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawHat(t_hat)
{
    
    if (upgrades.hat == false)
    {
            noStroke();
            fill(255,140,0);
            arc(t_hat.pos_x,t_hat.pos_y-3,48,48,PI,PI/180); //hat
            rect(t_hat.pos_x-2,t_hat.pos_y-28,4,2); //hat top
            fill(0,0,0);
            arc (t_hat.pos_x,t_hat.pos_y,48,26,PI,PI/180); //hat brim
            noFill();
            strokeWeight(3);
            stroke(215,100,0);
            arc (t_hat.pos_x,t_hat.pos_y-2,46,26,PI,PI/180); //hat brim
    }
    else
    {
            noFill();
            stroke(255,0,0);
            arc(t_hat.pos_x,t_hat.pos_y-3,48,48,PI,PI/180); //hat
            rect(t_hat.pos_x-2,t_hat.pos_y-28,4,2); //hat top
            arc (t_hat.pos_x,t_hat.pos_y,48,26,PI,PI/180); //hat brim
    }
    
            strokeWeight(1);
            noStroke();
            noFill();
}

function drawFeet(t_feet)
{
    if (upgrades.feet == false)
    {
        noStroke();
        fill (112,128,144) // gray
        rect (t_feet.pos_x + 3, t_feet.pos_y-30, 14, 20);
        fill (225,185,0); //gold
        rect (t_feet.pos_x, t_feet.pos_y-30,20,6);
        rect (t_feet.pos_x, t_feet.pos_y-20,20,6);
        rect (t_feet.pos_x, t_feet.pos_y-10,30,6);
  
    }
    else
    {
        noFill();
        stroke(255,0,0);
        rect (t_feet.pos_x + 3, t_feet.pos_y-30, 14, 20);
        rect (t_feet.pos_x, t_feet.pos_y-30,20,6);
        rect (t_feet.pos_x, t_feet.pos_y-20,20,6);
        rect (t_feet.pos_x, t_feet.pos_y-10,30,6);
    }
    
    noStroke();
    noFill();
}

function drawBody(t_body)
{
    if (upgrades.body == false)
    {
        textSize(50);
        fill(0,255,0);
        text('B',t_body.pos_x,t_body.pos_y);
    }
    else
    {
        
    }
    
    noStroke();
    noFill();
 }

function drawCollectable(t_collectable, t_lock)
{

    if (upgrades.hat && upgrades.body && upgrades.feet)
    {
        noStroke();
        fill (247,220,111);
        ellipse (t_collectable.pos_x,t_collectable.pos_y,18,18);
        rect (t_collectable.pos_x+8,t_collectable.pos_y-4,20,5);
        rect (t_collectable.pos_x+12,t_collectable.pos_y,4,7);
        rect (t_collectable.pos_x+18,t_collectable.pos_y,4,4);
        rect (t_collectable.pos_x+24,t_collectable.pos_y,4,7);
        fill (0,0,0);
        ellipse (t_collectable.pos_x,t_collectable.pos_y,11,11);
    }
    else
    {
        noFill();
        stroke(255,0,0);
        ellipse (t_collectable.pos_x,t_collectable.pos_y,18,18);
        rect (t_collectable.pos_x+8,t_collectable.pos_y-4,20,5);
        rect (t_collectable.pos_x+12,t_collectable.pos_y,4,7);
        rect (t_collectable.pos_x+18,t_collectable.pos_y,4,4);
        rect (t_collectable.pos_x+24,t_collectable.pos_y,4,7);
        ellipse (t_collectable.pos_x,t_collectable.pos_y,11,11);
    }
       
    stroke (40,40,40);
    strokeWeight(5);
    fill(150,150,150);
    rect (t_lock.pos_x, floorPos_y-200, 30,200);
    push();
    noStroke();
    translate(9,25);
    fill (247,220,111);
    ellipse (t_lock.pos_x,floorPos_y-200,9,9);
    rect (t_lock.pos_x+3,floorPos_y-200-2,12,2.5);
    rect (t_lock.pos_x+6,floorPos_y-200,2,3.5);
    rect (t_lock.pos_x+9,floorPos_y-200,2,2);
    rect (t_lock.pos_x+12,floorPos_y-200,2,3.5);
    fill(150,150,150);
    ellipse (t_lock.pos_x,floorPos_y-200,5,5);
    pop()
    noFill();
    strokeWeight(1);
}

// Function to check character has collected an item or upgrade

function checkCollectable(t_collectable, t_lock)
{
    if (upgrades.hat && upgrades.body && upgrades.feet)
    {
        if (dist(t_collectable.pos_x,t_collectable.pos_y,gameChar_world_x,gameChar_y) < 30 || dist(t_collectable.pos_x,t_collectable.pos_y,gameChar_world_x,gameChar_y-73) < 30 ) 
        {
            t_collectable.isFound = true;
            t_lock.isUnlocked = true;
            game_score +=1;
        }
    }
};

function checkHat(t_hat)
{
    if (dist(t_hat.pos_x,t_hat.pos_y,gameChar_world_x,gameChar_y) < 25 || dist(t_hat.pos_x,t_hat.pos_y,gameChar_world_x,gameChar_y-73) < 35) 
    {
        t_hat.isFound = true;
        upgrades.hat = true;
    }
};

function checkFeet(t_feet)
{
    if (dist(t_feet.pos_x,t_feet.pos_y,gameChar_world_x,gameChar_y) < 25 || dist(t_feet.pos_x,t_feet.pos_y,gameChar_world_x,gameChar_y-73) < 35) 
    {
        t_feet.isFound = true;
        upgrades.feet = true;
    }
};

function checkBody(t_body)
{
    if (dist(t_body.pos_x,t_body.pos_y,gameChar_world_x,gameChar_y) < 25 || dist(t_body.pos_x,t_body.pos_y,gameChar_world_x,gameChar_y-73) < 35) 
    {
        t_body.isFound = true;
        upgrades.body = true;
    }
};

function drawUndoUpgrades(t_upgrade)
{
     stroke(0,0,255);
        strokeWeight(2);
        noFill();
        
        for (j=0; j<20; j++)
        {
            rect(random(t_upgrade.start_x-5,t_upgrade.end_x+5),
                 random(t_upgrade.start_y-5,t_upgrade.end_y+5),
                 random(0,20),
                 random(0,20));
        }
        strokeWeight(1);
        noStroke();
}

function checkUndoUpgrades(t_undo)
{
    for (i=0; i < undoUpgrades.length; i++)
    {
        if (gameChar_world_x >= t_undo.start_x-2 && gameChar_world_x <= t_undo.end_x+2 && gameChar_y >= t_undo.start_y-30 && gameChar_y <= t_undo.end_y+30)
        {
            upgrades.body = false;
            upgrades.feet = false;
            upgrades.hat = false;
            collectable_feet[i].isFound = false;
            collectable_hat[i].isFound = false;
            collectable_body[i].isFound = false;
        }
    }

}

// ----------------------------------
// Flagpole render and check function
// ----------------------------------

function renderFlagpole()
{
    fill (0,0,0);
    rect (flagpole.pos_x,floorPos_y-80,3,80);
    fill (200,0,0);

    if (flagpole.isReached == false)
    {
        fill (200,0,0);
        triangle (flagpole.pos_x+3,floorPos_y-78,flagpole.pos_x+18,floorPos_y-68,flagpole.pos_x+3,floorPos_y-58);
    }
    else if (flagpole.isReached)
    {
        fill (0,200,0);
        triangle (flagpole.pos_x+3,floorPos_y-78,flagpole.pos_x+18,floorPos_y-68,flagpole.pos_x+3,floorPos_y-58);
    }
}

function checkFlagpole ()
{
    if (dist(flagpole.pos_x,floorPos_y,gameChar_world_x,gameChar_y) < 10 || dist(flagpole.pos_x,floorPos_y,gameChar_world_x,gameChar_y-73) < 10) 
    {
        flagpole.isReached = true;
    }

}

// ----------------------------------
// Check to see if player is dead
// ----------------------------------

function checkPlayerDie()
{
    if (gameChar_y > height + 200 && lifechecker)
    {
        lives -=1;
        lifechecker = false;
        
        if (lives >= 0)
        {
            startGame();
        }
    }
}

function Enemy(x,y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 0;
    this.bullet = [
        {x: this.currentX, y: this.y-35, travel: 0},
        {x: this.currentX, y: this.y-35, travel: 0}
    ];
    this.bulletAuto = false;
    this.rocket = {x: this.currentX, y: y-25, incX:0, incY:0};
    
    this.draw = function()
    {
        this.bulletDraw();
        this.rocketDraw(); 
        fill (234,236,238);// gray
        rect (this.currentX, this.y-35, 10,30);
        fill (247,220,111); // yellow
        quad (this.currentX - 25, this.y+10, this.currentX + 35, this.y + 10, this.currentX + 25, this.y-10, this.currentX - 15, this.y-10);
        quad (this.currentX - 15, this.y-20, this.currentX + 25, this.y - 20, this.currentX + 15, this.y-35, this.currentX - 5, this.y-35);
    };
    
    this.update = function(gcx, gcy)
    {
         this.currentX += this.inc;

            if (upgrades.feet == false)
            {
                if (this.currentX >=  this.x + this.range)
                {
                    this.inc = -3;
                }
                else if (this.currentX <= this.x)
                {
                    this.inc = 3;
                }
            }
            else
            {
                this.inc = this.inc *3; //needed to create immediate speed change, not at end of cycle
                this.inc = constrain(this.inc,-7,7);
                
                if (this.currentX >=  this.x + this.range)
                {
                    this.inc = -7;
                }
                else if (this.currentX <= this.x)
                {
                    this.inc = 7;
                }
            }

//Begin Code for automatic bullet firing
            if (upgrades.body)
            { 
                this.bulletAuto = true;
            
                if (this.bulletAuto)
                {
                    for (i=0; i < this.bullet.length; i++)
                    {
                        this.bulletInc = -40;
                        this.bullet[i].travel -= this.bulletInc;
                        
                        if (i % 2 == 0)
                        {
                            this.bullet[i].x += this.bulletInc;
                        }
                        else
                        {
                            this.bullet[i].x -= this.bulletInc;
                        }
                        
                        if (this.bullet[i].travel > 1500)
                        {
                            this.bullet[i].x = this.currentX;
                            this.bulletAuto = false;
                            this.bullet[i].travel = 0;
                        }
                    }
                }
            }
            else
            {
                for (i=0; i < this.bullet.length; i++)
                {
                    this.bullet[i].x = this.currentX;
                    this.bulletInc = 0;
                }
            }
         
//Begin Code for Rocket Tracking
            this.rocket.incX = constrain(this.rocket.incX, -3, 3);
            this.rocket.incY = constrain(this.rocket.incY, -3, 3);
            this.rocket.x += this.rocket.incX;
            this.rocket.y += this.rocket.incY;
            
            if (this.rocket.x > gcx)
            {
                this.rocket.incX -= random(0.2, 0.3);
            }
            else
            {
                this.rocket.incX += random(0.2, 0.3);
            }
            if (this.rocket.y > gcy-35)
            {
                
                this.rocket.incY -= random(0.2, 0.3);
            }
            else
            {
                this.rocket.incY += random(0.2, 0.3);
            }
        if (upgrades.hat == false) //reset rockets if you cross undo line
        {
                this.rocket.x = this.currentX;
                this.rocketIncX = 0;
                this.rocketIncY = 0;
                this.rocket.y = this.y-25;
        }

    }
    
    this.bulletDraw = function()
    {
        for (i=0; i < this.bullet.length; i++)
        {
            fill (247,220,111); // yellow
            rect (this.bullet[i].x, this.bullet[i].y, 10,5);
        }
    }
    
    this.rocketDraw = function()
    {        
        if (upgrades.hat)
        {
            fill (234,236,238); // gray
            for (i=0; i < 4; i++)
            {
                rect(random(this.rocket.x-5,this.rocket.x+5),
                     random(this.rocket.y-5,this.rocket.y+5),
                     random(0,10),
                     random(0,10));
            }
            noFill();
        }
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y-30, this.currentX+5, this.y-5);
        var b2 = 50; //set to 50 to not trigger interaction upon load, needed to solve weird interaction with right side bullets not checking properly inside the for loop on the same line as the rocket check
        
    if (upgrades.hat || upgrades.body)
    {
        for (j=0; j < this.bullet.length; j++)
        {
            if (j % 2 == 0) {}
            else
            {
                b2 = dist (gc_x, gc_y-30, this.bullet[j].x+5, this.bullet[j].y);
            }
            if (dist (gc_x, gc_y-45, this.rocket.x+5, this.rocket.y) < 35 || dist (gc_x, gc_y-30, this.bullet[j].x+5, this.bullet[j].y) < 40)
            {
                return true;
            }
        }
    }
        
        if (d < 30 || b2 < 40)
        {
            return true;
        }
        
        return false;
        
    }
}

function createPlatforms(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function() {
            strokeWeight(2);
            stroke(155,155,155);
            fill(125,125,125,225);
            rect(this.x, this.y, this.length, 20);
            noStroke();
            strokeWeight(1);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x - 10 && gc_x < this.x + 10 + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d <= 6)
                {
                    return true;
                }
            }
            
            return false;
    
        }
    }

    return p;
}