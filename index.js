//import Paddle from "paddle.js";
var canvas=document.getElementById("gamescreen");

var c=canvas.getContext('2d');

const GAME_WIDTH=800;
const GAME_HEIGHT=600;

//c.clearRect(0,0,800,600);
class Game
{
    constructor(gameWidth,gameHeight)
    {
        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
    }
    start()
    { 
        this.ball=new Ball(this);
        this.paddle = new Paddle(this);
        var bricks=[];
        for(var i=0;i<15;i++)
        {
         for(var j=0;j<4;j++)
         {
            bricks.push(new Brick(this,{x:i*52,y:30*j})) 
         }  
        }
        this.gameObject=[this.ball,this.paddle,...bricks]
        new InputHandler(this.paddle);
    }

    update(dt)
    {
        this.gameObject.forEach(object=>object.update(dt));

        this.gameObject=this.gameObject.filter(object=>!object.markdelete);
    }

    draw(c)
    {
        this.gameObject.forEach(object=>object.draw(c));
    }
}
var game =new Game(GAME_WIDTH,GAME_HEIGHT);
function collisionDetection(ball,gameObject)
{
        var topofBall=ball.position.y;
       
        var bottomofBall =ball.position.y+ball.size;


        var topofObject =gameObject.position.y;

        var leftsideofObject=gameObject.position.x;
       
        var rightsideofObject=gameObject.position.x+gameObject.width;
       
        var bottomofObject=gameObject.position.y+gameObject.height;
       
        if(bottomofBall>=topofObject && topofBall<=bottomofObject&&ball.position.x>=leftsideofObject&&
            ball.position.x+ball.size<=rightsideofObject)
        {
            return true;
        }
        else{
            return false;
        }
}

//ball class
class Ball{
    constructor(game)
    {
        this.image=document.getElementById('ball');
        this.position={x:20,y:90};
        this.speed={x:4,y:4};
        this.gameWidth=game.gameWidth;
        this.gameHeight=game.gameHeight;
        this.size=30;
        this.game=game;
    }

    draw(c)
    {
        c.drawImage(this.image,this.position.x,this.position.y,this.size,this.size);
    }

    update(dt)
    {
        this.position.x+=this.speed.x;
        this.position.y+=this.speed.y;
        if(this.position.x+this.size>this.gameWidth||this.position.x<0)
        {this.speed.x=-this.speed.x}
        if(this.position.y+this.size>this.gameHeight||this.position.y<0)
        {this.speed.y=-this.speed.y}


        var bottomofBall2 =this.position.y+this.size;
        
        if(collisionDetection(this,this.game.paddle))
        {
            this.speed.y=-this.speed.y;
            this.position.y=this.game.paddle.position.y-this.size;
        }
       if(bottomofBall2==600)
       {
           alert('game over!!!');
           function reloadPage(){
            location.reload(true);
            reloadPage();
        }
        
       }
    }


}

//bricks
class Brick{
        constructor(game,position)
        {
            this.image=document.getElementById('brick');
            this.position=position;
            this.game=game;
            
            this.size=50;
            this.width=52;
            this.height=24;
            this.markdelete=false;
        }

        update()
        {
            if(collisionDetection(this.game.ball,this))
            {
                this.game.ball.speed.y=-this.game.ball.speed.y;
                this.markdelete=true;
            }
        }
        draw()
        {
            c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height);
        }
}
//paddle

var dt;
class Paddle{
    constructor(game)
    {
        this.width=150;
        this.height=30;
        this.maxSpeed=7;
        this.speed=0;
        this.gameWidth=game.gameWidth;
        this.position={
        
            x: game.gameWidth/2 - this.width/2,
    
            y: game.gameHeight - this.height - 10
        };

    }

    moveLeft()
    {
        this.speed=-this.maxSpeed;
    }

    moveRight()
    {
        this.speed=this.maxSpeed;
    }


    draw(c)
    {
        c.fillStyle = "#FF0000";
        c.fillRect(this.position.x,this.position.y,this.width,this.height);

    }

    stop()
    {
        this.speed=0;
    }

    update(dt)//update postion of paddle
    {
        if(!dt)
        {
            return;
        }
        this.position.x+=this.speed;
        if(this.position.x<0)this.position.x=0;
        if(this.position.x+this.width>this.gameWidth)this.position.x=this.gameWidth-this.width;

    }

}
//for input
class InputHandler{

    constructor(paddle){
        document.addEventListener('keydown',event=>
        {
            //alert(event.keyCode);
            switch(event.keyCode)
            {
                case 37:
                paddle.moveLeft();
                break;

                case 39:
                paddle.moveRight();
                break;
            

                    ////for touch
            function swipedetect(el, callback){
  
                var touchsurface = el,
                swipedir,
                startX,
                startY,
                distX,
                distY,
                threshold = 150, //required min distance traveled to be considered swipe
                restraint = 100, // maximum distance allowed at the same time in perpendicular direction
                allowedTime = 300, // maximum time allowed to travel that distance
                elapsedTime,
                startTime,
                handleswipe = callback || function(swipedir){}
              
                touchsurface.addEventListener('touchstart', function(e){
                    var touchobj = e.changedTouches[0]
                    swipedir = 'none'
                    dist = 0
                    startX = touchobj.pageX
                    startY = touchobj.pageY
                    startTime = new Date().getTime() // record time when finger first makes contact with surface
                    e.preventDefault()
                }, false)
              
                touchsurface.addEventListener('touchmove', function(e){
                    e.preventDefault() // prevent scrolling when inside DIV
                }, false)
              
                touchsurface.addEventListener('touchend', function(e){
                    var touchobj = e.changedTouches[0]
                    distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
                    distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
                    elapsedTime = new Date().getTime() - startTime // get time elapsed
                    if (elapsedTime <= allowedTime){ // first condition for awipe met
                        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                            swipedir = (distX < 0)? 'paddle.moveLeft()' : 'paddle.moveRight()' // if dist traveled is negative, it indicates left swipe
                        }
                        
                    }
                    handleswipe(swipedir)
                    e.preventDefault()
                }, false)
            }
            ////////////touch code end
            }

        });


        document.addEventListener('keyup',event=>
        {
            //alert(event.keyCode);
            switch(event.keyCode)
            {
                case 37:
                if(paddle.speed<0)paddle.stop();
                break;

                case 39:
                    if(paddle.speed>0)paddle.stop();
                break;
            }

            ////for touch
            function swipedetect(el, callback){
  
                var touchsurface = el,
                swipedir,
                startX,
                startY,
                distX,
                distY,
                threshold = 150, //required min distance traveled to be considered swipe
                restraint = 100, // maximum distance allowed at the same time in perpendicular direction
                allowedTime = 300, // maximum time allowed to travel that distance
                elapsedTime,
                startTime,
                handleswipe = callback || function(swipedir){}
              
                touchsurface.addEventListener('touchstart', function(e){
                    var touchobj = e.changedTouches[0]
                    swipedir = 'none'
                    dist = 0
                    startX = touchobj.pageX
                    startY = touchobj.pageY
                    startTime = new Date().getTime() // record time when finger first makes contact with surface
                    e.preventDefault()
                }, false)
              
                touchsurface.addEventListener('touchmove', function(e){
                    e.preventDefault() // prevent scrolling when inside DIV
                }, false)
              
                touchsurface.addEventListener('touchend', function(e){
                    var touchobj = e.changedTouches[0]
                    distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
                    distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
                    elapsedTime = new Date().getTime() - startTime // get time elapsed
                    if (elapsedTime <= allowedTime){ // first condition for awipe met
                        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                            swipedir = (distX < 0)? 'paddle.moveRight()' : 'paddle.moveLeft()' // if dist traveled is negative, it indicates left swipe
                        }
                        
                    }
                    handleswipe(swipedir)
                    e.preventDefault()
                }, false)
            }
            ////////////touch code end


        });
    }
}
//for moving paddle
var lastTime=0;
//game


game.start();
function gameLoop(timestamp)
{   
    dt=timestamp-lastTime;
    lastTime=timestamp;
    c.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    game.update(dt);
    game.draw(c);

    requestAnimationFrame(gameLoop);  
}
//moving paddle end




gameLoop();
