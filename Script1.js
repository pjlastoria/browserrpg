var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");
gameCanvas.style.marginLeft = "275px";

var gridW = 50;
var gridH = 50;
var rows = 20;
var cols = 20;

var camPanX = 0.0;
var camPanY = 0.0;

var userDistX = 150;
var userDistY = 100;

var userSprite;
var enemySprite2, enemyX = 300, enemyY = 300;
var userW = 50;
var userH = 50;
var userX = 100;
var userY = 100;
var userSpeed = 5;

var keyUp = false;
var keyLeft = false;
var keyDown = false;
var keyRight = false;

var map = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 8,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 3, 0, 0, 0, 0, 7, 9,
            0, 0, 0, 6, 8, 0,10,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 3, 0, 7, 9, 0,14,15, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0,
            0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 6, 4, 4, 8, 0, 0, 0, 0,10,12, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 4, 5, 5, 4, 0, 1, 0,10,15,14, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 7, 4, 4, 9, 0, 0,10,15,14,14, 0, 0, 0, 3, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,10,15,14,14,15,12, 0, 0, 0, 0, 0,
            0, 0, 0, 2, 0, 0, 0, 0, 0,14,14,14,14,14,14, 0, 2, 0, 0, 0,
            0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
            0, 3, 0, 0, 0, 6, 5, 4, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 5, 4, 4, 4, 8, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 4, 4, 4, 5, 4, 8, 0, 0, 2, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 2, 0, 7, 4, 4, 4, 5, 9, 0, 0, 0, 0, 0, 0, 2, 0, 0,
            0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 3, 0,
            0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
			
var walkableTileIndices = [];

map.forEach(function(e,i) {
	if(e < 3) walkableTileIndices.push(i);
});

var mapTiles = [];

window.addEventListener("keydown", userMove);
window.addEventListener("keyup", userStop);

(function() {//load images
  for(var i = 0; i < 16; i++) {
    var mapTile = document.createElement("img");
    mapTile.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/snowscape/map_tiles" +i+ ".png";

    mapTiles.push( mapTile );
  }

  userSprite = document.createElement("img");
  userSprite.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/sprite_3.png";
  enemySprite2 = document.createElement("img");
  enemySprite2.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/shadow_sprites0.png";
  //enemySprite1 = document.createElement("img");
  //enemySprite1.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/shadow_sprites1.png";
  //enemySprite2 = document.createElement("img");
  //enemySprite2.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/shadow_sprites2.png";
}())

function userMove(e) {
  var keyCode = e.keyCode;

  if(keyCode === 87) { keyUp = true; }
  if(keyCode === 65) { keyLeft = true; }
  if(keyCode === 83) { keyDown = true; }
  if(keyCode === 68) { keyRight = true; }
  
  e.preventDefault();
}

function userStop(e) {//119 97 115 100 WASD 38 37 40 39 UPLEFTDOWNRIGHT
  var keyCode = e.keyCode;

  if(keyCode === 87) { keyUp = false; }
  if(keyCode === 65) { keyLeft = false; }
  if(keyCode === 83) { keyDown = false; }
  if(keyCode === 68) { keyRight = false; }
  
  e.preventDefault();
}


var id = setInterval(move, 1000/30);

function move(){
  
  drawRect(0,0, gameCanvas.width,gameCanvas.height, "aqua");
  
  ctx.save();
  ctx.translate(-camPanX, -camPanY);
  //console.log(camPanX, camPanY);
  //drawBackgroundWithinView();
  drawBackground();
  //drawRect(userX,userY, userW,userH, "white");
  drawSprites();
  
  ctx.restore();
  //ctx.fillStyle = "white";
  
  camFollow();
  moveUser();
}

/*function drawBackgroundWithinView() {
  var camLeftMostCol = Math.floor(camPanX / gridW);
  var camTopMostRow = Math.floor(camPanY / gridH);
  
  var colsThatFitOnScreen = Math.floor(gameCanvas.width / gridW);
  var rowsThatFitOnScreen = Math.floor(gameCanvas.height / gridH);
  
}*/

function drawBackground() {
  
  for(var row = 0; row < rows; row++) {
    for(var col = 0; col < cols; col++) {
      var mapIndex = rowColToIndex(row,col);
      var tileNum = map[mapIndex];
      
      if(tileNum !== 0) {
        //drawRect(col*gridW, row*gridH, gridW, gridH, "gray");
        ctx.drawImage(mapTiles[tileNum], col*gridW,row*gridH, gridW,gridH);
        continue;
      }
      ctx.drawImage(mapTiles[0], col*gridW,row*gridH, gridW,gridH);
    }
  }
  
}

function rowColToIndex(r,c) {
  return r*cols+c;
}

function getMapPos(x,y) {
  var centerX = x+userW/2, 
      centerY = y+userH/2;
  
  var currCol = Math.floor( centerX / gridW), 
      currRow = Math.floor( centerY / gridH);
      
  return rowColToIndex(currRow, currCol);
}

function drawSprites() {
  ctx.drawImage(userSprite, userX,userY);
  
  ctx.drawImage(enemySprite2, enemyX,enemyY, 100,100);
}

function checkforCollision(x, y) {
  var currUserMapIndex = getMapPos(x,y);
  
  return map[currUserMapIndex] > 3;
}

function moveUser() {
  if(document.hidden) { keyUp = false; keyDown = false; keyRight = false; keyLeft = false; }
  
  var goBackX = userX;
  var goBackY = userY;
  
  var furthestX = gridW*cols - userW;
  var furthestY = gridH*rows - userH;

  if(keyUp) { userY -= userSpeed }
  if(keyLeft) { userX -= userSpeed }
  if(keyDown) { userY += userSpeed }
  if(keyRight) { userX += userSpeed }
  
  if(userX >= furthestX) { userX = furthestX }
  if(userY >= furthestY) { userY = furthestY }
  if(userX <= 0) { userX = goBackX }
  if(userY <= 0) { userY = goBackY }
  
  if(checkforCollision(userX, userY)) {
    userX = goBackX;
    userY = goBackY;
  }
}

function instaCamFollow() {
  camPanX = userX - gameCanvas.width/2;
  camPanY = userY - gameCanvas.height/2;
}

function camFollow() {
  var camFocX = camPanX + gameCanvas.width/2;
  var camFocY = camPanY + gameCanvas.height/2;
  
  var playerDistFromCamFocX = Math.abs(userX - camFocX);
  var playerDistFromCamFocY = Math.abs(userY - camFocY);
  
  if(playerDistFromCamFocX > userDistX) {
    if(camFocX < userX) {
      camPanX += userSpeed;
    } else {
      camPanX -= userSpeed;
    }
  }
  if(playerDistFromCamFocY > userDistY) {
    if(camFocY < userY) {
      camPanY += userSpeed;
    } else {
      camPanY -= userSpeed;
    }
  }
  
  if(camPanX < 0) {
    camPanX = 0;
  }
  if(camPanY < 0) {
    camPanY = 0;
  }
  var maxPanRight = cols * gridW - gameCanvas.width;
  var maxPanTop = rows * gridH - gameCanvas.height;
  if(camPanX > maxPanRight) {
    camPanX = maxPanRight;
  }
  if(camPanY > maxPanTop) {
    camPanY = maxPanTop;
  }
}

function drawRect(topLeftX, topLeftY, boxWidth, boxHeight, color) {
  ctx.fillStyle = color;
  ctx.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}