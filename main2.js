var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");
gameCanvas.style.marginLeft = "275px";
gameCanvas.style.borderRadius = "2%";

var gridW = 80;
var gridH = 80;
var rows = 20;
var cols = 20;

var camPanX = 0.0;
var camPanY = 0.0;

var userDistX = 15;
var userDistY = 10;

var userSprite, userDeathSprite;
var enemySprite1, enemySprite2, enemySprite3, enemyX = 300, enemyY = 300;
var int, id;
var userW = 50;
var userH = 50;
var userX = 100;
var userY = 100;
var attacking = true, walking = false;
var curr = 0, currDirection = "still", currMap = 1;

var keyUp = false;
var keyLeft = false;
var keyDown = false;
var keyRight = false;
var R = 11, B = 12; 
//The Rs are reserved tiles. Reserved for tiles that the user may walk on but enemies or items cannot appear on. Mainly for user spawns.
var map = map3;
			
var walkableTileIndices = [],
	enemiesOnCurrMap =    [],
	itemsOnCurrMap = [];

var enemiesOnMap = {
	"1": [],
	"2": [],
	"3": []
};

var itemsOnMap = {
	"1": [],
	"2": [],
	"3": []
};
	
resetWalkableTiles();
function resetWalkableTiles() {
	walkableTileIndices.length = 0;
	map.forEach(function(e,i) {
		if(e === 11) { return; }
		if(e === 0) walkableTileIndices.push(i);
	});
	console.log(map);
}

var mapTileImgs = [],
	enemyImgs =   [],
	itemImgs =    [];

window.addEventListener("keydown", userMoveInput);
window.addEventListener("keyup", userStopInput);



(function() {//load images

	userSprite = document.createElement("img");
	userSprite.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/sprite_3.png";

	userDeathSprite = document.createElement("img");
	userDeathSprite.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/jack_sprites4.png";

	for(var i = 0; i < 11; i++) {
		var mapTile = document.createElement("img");
		mapTile.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/snowscape/snowscape/snowscape" +i+ ".png";

		mapTileImgs.push( mapTile );
	}

	for(var i = 0; i < 4; i++) {
		var enemyImg = document.createElement("img");
		enemyImg.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/snowscape/shadows" +i+ ".png";

		enemyImgs.push( enemyImg );
	}

	for(var i = 0; i < 5; i++) {
		var itemImg = document.createElement("img");
		itemImg.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/items" +i+ ".png";

		itemImgs.push( itemImg );
	}
	
	hero.image = hero.sprites[10];
	console.log(itemImgs[4]);
}())


createPotionSprites(14, 2);
createEnemySprites(10, 2);


function createEnemySprites(howMany, world) {

	for(var i = 0, m; i < howMany; i++) {
		
		n = Object.create(nightMare);
		n.genRandomLocation();
		n.image = enemyImgs[0];
		enemiesOnMap[world].push( n );

	}

	s = Object.create(darkSlender);
	s.genRandomLocation();
	s.image = enemyImgs[1];
	enemiesOnMap[world].push( s );

	enemiesOnCurrMap = enemiesOnMap[world];
}

function createPotionSprites(howMany, world) {
	var w;
	for(var i = 0, m; i < howMany; i++) {
		
		m = Object.create(milk);
		m.genRandomLocation();
		m.image = itemImgs[0];
		itemsOnMap[world].push( m );

	}

	w = Object.create(stick);
	w.genRandomLocation();
	w.image = itemImgs[1];
	itemsOnMap[world].push( w );

	pS = Object.create(proteinShake);
	pS.genRandomLocation();
	pS.image = itemImgs[4];
	itemsOnMap[world].push( pS );

	itemsOnCurrMap = itemsOnMap[world];
}

function genRandomXYOnWalkableTile() {
	var howManyAvailableTiles = walkableTileIndices.length;
	var randomTileIndex = Math.floor( Math.random() * howManyAvailableTiles );
	var randomTile = walkableTileIndices[randomTileIndex];
	var rowAndColOfRandomTileIndex = indexToRowCol(randomTile);
	var XandYofRowAndCol = rowColToXY(rowAndColOfRandomTileIndex.r, rowAndColOfRandomTileIndex.c);

	walkableTileIndices.splice(randomTileIndex, 1);
	//itemCoordinates.push( XandYofRowAndCol.x, XandYofRowAndCol.y );
	return XandYofRowAndCol;

}

function userMoveInput(e) {
  var keyCode = e.keyCode;
  //if( keyUp || keyLeft || keyDown || keyRight) { return; }
  if(keyCode === 87) { keyUp = true;    currDirection = "up"   ; }
  if(keyCode === 65) { keyLeft = true;  currDirection = "left" ; }
  if(keyCode === 83) { keyDown = true;  currDirection = "down" ; }
  if(keyCode === 68) { keyRight = true; currDirection = "right"; }
  
  e.preventDefault();
}

function userStopInput(e) {//119 97 115 100 WASD 38 37 40 39 UPLEFTDOWNRIGHT
  var keyCode = e.keyCode;
  
  if(keyCode === 87) { keyUp = false; }
  if(keyCode === 65) { keyLeft = false; }
  if(keyCode === 83) { keyDown = false; }
  if(keyCode === 68) { keyRight = false; }
  
  e.preventDefault();
}

id = setInterval(gameLoop, 1000/30);
int = setInterval(function() {
	curr++;
	if(curr > 2) { curr = 0; }
	hero.animate(curr, currDirection);
}, 100);

function gameLoop(){
  
  drawRect(0,0, gameCanvas.width,gameCanvas.height, "#decbcb");
  
  ctx.save();
  ctx.translate(-camPanX, -camPanY);
  //drawBackgroundWithinView();
  drawBackground();

  drawSprites();

  ctx.restore();
  //ctx.fillStyle = "white";
  
  camFollow();
  moveUser();

  writeText("Level: " +  hero.level,  20,538, "25px", "Fantasy", "darkblue");
  writeText("Weapon: " + hero.weapon, 20,555, "25px", "Fantasy", "darkblue");
  drawRect(20, 560, 100, 10, "black");
  drawRect(20, 560, hero.health/hero.healthMax * 100, 10, "red"); //health meter

  drawRect(20, 570, 100, 10, "black");
  drawRect(20, 570, hero.exp/hero.expMax * 100, 10, "green"); //health meter
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

      if(tileNum !== 0 && tileNum !== 11) {
        ctx.drawImage(mapTileImgs[tileNum], col*gridW,row*gridH, gridW,gridH);
        continue;
      }
      ctx.drawImage(mapTileImgs[0], col*gridW,row*gridH, gridW,gridH);
    }
  }
  
}

function rowColToIndex(r,c) {
  return r*cols+c;
}

function indexToRowCol(i) {
	var r = Math.floor( i / cols );
	var c = Math.abs( r*cols-i );
	return {r, c};
}

function rowColToXY(r,c) {
	var x = c*gridW;
	var y = r*gridH;

	return {x, y};
}

function getMapPos(x,y) {
  var centerX = x+userW/2, 
      centerY = y+userH/2;
  
  var currCol = Math.floor( centerX / gridW), 
      currRow = Math.floor( centerY / gridH);
      
  return rowColToIndex(currRow, currCol);
}

function drawSprites() {
  
  hero.draw();
 
  for(var i = 0; i < itemsOnCurrMap.length; i++) {
	itemsOnCurrMap[i].draw();
  }

  for(var k = 0; k < enemiesOnCurrMap.length; k++) {
	enemiesOnCurrMap[k].draw();
  }
  
}

function itemDetection(x,y) {
	var centerX = x+userW/2, 
		centerY = y+userH/2;

	for(var ind = 0; ind < itemsOnCurrMap.length; ind++) {

		if( centerX > itemsOnCurrMap[ind].x && 
			centerY > itemsOnCurrMap[ind].y &&
			centerX < itemsOnCurrMap[ind].x + itemsOnCurrMap[ind].width && 
			centerY < itemsOnCurrMap[ind].y + itemsOnCurrMap[ind].height ) {
			return itemsOnCurrMap[ind];
		}

	}
}

function enemyDetection(x,y) {
	var centerX = x+userW/2, 
		centerY = y+userH/2;

	for(var ind = 0; ind < enemiesOnCurrMap.length; ind++) {

		if( centerX > enemiesOnCurrMap[ind].x && 
			centerY > enemiesOnCurrMap[ind].y &&
			centerX < enemiesOnCurrMap[ind].x + enemiesOnCurrMap[ind].width && 
			centerY < enemiesOnCurrMap[ind].y + enemiesOnCurrMap[ind].height ) {
			return enemiesOnCurrMap[ind];
		}

	}
}


function itemHandler(item) {
	var healed;
	if(item.type === "Potion") {
		healed = hero.heal(item);

		if(healed) {
			remove(item);
		}
	}

	if(item.type === "Weapon") {
		hero.equip(item);
		remove(item);
	}
	
}

function enemyHandler(enemy) {

	if(enemy.name === "Nightmare") {
		delayAttacks(enemy);
	}
	if(enemy.name === "Dark Slender") {
		delayAttacks(enemy);
	}
}

function remove(obj) {
	var len = itemsOnCurrMap;
	for(var i = 0; i < len.length; i++) {
		if(len[i].x === obj.x && len[i].y === obj.y) {
			itemsOnCurrMap.splice(i, 1);
		}
	}

}

function kill(enemy) {
	var len = enemiesOnCurrMap;
	for(var i = 0; i < len.length; i++) {
		if(len[i].x === enemy.x && len[i].y === enemy.y) {
			enemiesOnCurrMap.splice(i, 1);
		}
	}
	hero.addExp();
}

function checkForUnwalkableTileCollision(x, y) {
	var currUserMapIndex = getMapPos(x,y);
    if(map[currUserMapIndex] === 11) { return false; }
	if(map[currUserMapIndex] === 9) { 
		gotToNextWorld();
		return false; 
	}
	if(map[currUserMapIndex] === 10) { 
		gotToLastWorld();
		return false; 
	}
	return map[currUserMapIndex] > 0;
}

function gotToNextWorld() {//currMap
	hero.x = 100;
	if(map === map2) {
		map = map3;
		return resetWalkableTiles();
	}
	map = map2;
	resetWalkableTiles();
}

function gotToLastWorld() {//currMap
	hero.x = gridW*cols - 100;
	if(map === map2) {
		map = map1;
		return resetWalkableTiles();
	}
	map = map2;
	resetWalkableTiles();
}

function delayAttacks(enemy) {
	if(!attacking) { return; }
	attacking = false;

	var delayBetweenAttacks = 500;

	setTimeout(function() {//without this battles would be instant
		attacking = true;
	}, delayBetweenAttacks);


	startBattle(enemy);
}

function startBattle(enemy) {
	hero.attack(enemy);
	enemy.attack(hero);

	if(enemy.health <= 0) {
		kill(enemy);
	}
	if(hero.health <= 0) {
		hero.die();
	}
}

function moveUser() {
  if(document.hidden) { keyUp = false; keyDown = false; keyRight = false; keyLeft = false; }
  var whichEnemy, whichItem;

  var goBackX = hero.x;
  var goBackY = hero.y;
  
  var furthestX = gridW*cols - userW;
  var furthestY = gridH*rows - userH;

  if(keyUp) {    hero.y -= hero.speed;  }
  if(keyLeft) {  hero.x -= hero.speed; }
  if(keyDown) {  hero.y += hero.speed;  }
  if(keyRight) { hero.x += hero.speed;  }
  
  if(hero.x >= furthestX) { hero.x = goBackX }
  if(hero.y >= furthestY) { hero.y = goBackY }
  if(hero.x <= 0) { hero.x = goBackX }
  if(hero.y <= 0) { hero.y = goBackY }

  if(checkForUnwalkableTileCollision(hero.x, hero.y)) {

    hero.x = goBackX;
    hero.y = goBackY;
  }

 if(itemDetection(hero.x,hero.y)) {
	whichItem = itemDetection(hero.x,hero.y);
	itemHandler(whichItem);
 }

 if(enemyDetection(hero.x,hero.y)) {
	whichEnemy = enemyDetection(hero.x,hero.y);
	enemyHandler(whichEnemy);

	hero.x = goBackX;
    hero.y = goBackY;
 }
  
}

function instaCamFollow() {
  camPanX = hero.x - gameCanvas.width/2;
  camPanY = hero.y - gameCanvas.height/2;
}

function camFollow() {
  var camFocX = camPanX + gameCanvas.width/2;
  var camFocY = camPanY + gameCanvas.height/2;
  
  var playerDistFromCamFocX = Math.abs(hero.x - camFocX);
  var playerDistFromCamFocY = Math.abs(hero.y - camFocY);
  
  if(playerDistFromCamFocX > userDistX) {
    if(camFocX < hero.x) {
      camPanX += hero.speed;
    } else {
      camPanX -= hero.speed;
    }
  }
  if(playerDistFromCamFocY > userDistY) {
    if(camFocY < hero.y) {
      camPanY += hero.speed;
    } else {
      camPanY -= hero.speed;
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

function writeText(text, topLeftX,topLeftY, fontSize, fontFam, color) {
	ctx.font = fontSize + " " + fontFam;
	ctx.fillStyle = color;
	ctx.fillText(text,topLeftX,topLeftY); 
}