const RUN_SPEED = 5.5;

  var camPanX = 0.0;
  var camPanY = 0.0;
  const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X = 150;
  const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y = 100;

  const KEY_LEFT_ARROW = 37;
  const KEY_UP_ARROW = 38;
  const KEY_RIGHT_ARROW = 39;
  const KEY_DOWN_ARROW = 40;
  var holdLeft = false;
  var holdRight = false;
  var holdUp = false;
  var holdDown = false;
  
  function initInput() {
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);
  }
  
  function setKeyHoldState(thisKey, setTo) {
    if(thisKey == KEY_LEFT_ARROW) {
      holdLeft = setTo;
    }
    if(thisKey == KEY_RIGHT_ARROW) {
      holdRight = setTo;
    }
    if(thisKey == KEY_UP_ARROW) {
      holdUp = setTo;
    }
    if(thisKey == KEY_DOWN_ARROW) {
      holdDown = setTo;
    }
  }
  
  function keyPressed(evt) {
    setKeyHoldState(evt.keyCode, true);
    evt.preventDefault(); // without this, arrow keys scroll the browser!
  }
  
  function keyReleased(evt) {
    setKeyHoldState(evt.keyCode, false);
  }

  const BRICK_W = 60;
  const BRICK_H = 60;
  const BRICK_GAP = 1;
  const BRICK_COLS = 20;
  const BRICK_ROWS = 15;
  var brickGrid =
      [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1,
        1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1,
        1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1,
        1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];;
  
  var canvas, canvasContext;
  
  function brickTileToIndex(tileCol, tileRow) {
    return (tileCol + BRICK_COLS*tileRow);
  }

  function isBrickAtTileCoord(brickTileCol, brickTileRow) {
    var brickIndex = brickTileToIndex(brickTileCol, brickTileRow);
    return (brickGrid[brickIndex] == 1);
  }
  
  function isBrickAtPixelCoord(hitPixelX, hitPixelY) {
    var tileCol = hitPixelX / BRICK_W;
    var tileRow = hitPixelY / BRICK_H;
    
    // using Math.floor to round down to the nearest whole number
    tileCol = Math.floor( tileCol );
    tileRow = Math.floor( tileRow );

    // first check whether the slider is within any part of the brick wall
    if(tileCol < 0 || tileCol >= BRICK_COLS ||
       tileRow < 0 || tileRow >= BRICK_ROWS) {
       return false;
    }
    
    var brickIndex = brickTileToIndex(tileCol, tileRow);
    return (brickGrid[brickIndex] == 1);
  }
  
  function sliderMove() {
    var nextX = sliderX;
    var nextY = sliderY;

    if(holdLeft) {
      nextX += -RUN_SPEED;
    }
    if(holdRight) {
      nextX += RUN_SPEED;
    }
    if(holdUp) {
      nextY += -RUN_SPEED;
    }
    if(holdDown) {
      nextY += RUN_SPEED;
    }

    if(isBrickAtPixelCoord(nextX,nextY) == false) {
      sliderX = nextX;
      sliderY = nextY;
    }
  }

  window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    initInput();
    
    // these next few lines set up our game logic and render to happen 30 times per second
    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
      }, 1000/framesPerSecond);
      
    sliderReset();
  }
  
  function sliderReset() {
    // center slider on screen
    sliderX = canvas.width/2;
    sliderY = canvas.height/2;
  }

  function instantCamFollow() {
    camPanX = sliderX - canvas.width/2;
    camPanY = sliderY - canvas.height/2;
  }

  function cameraFollow() {
    var cameraFocusCenterX = camPanX + canvas.width/2;
    var cameraFocusCenterY = camPanY + canvas.height/2;

    var playerDistFromCameraFocusX = Math.abs(sliderX-cameraFocusCenterX);
    var playerDistFromCameraFocusY = Math.abs(sliderY-cameraFocusCenterY);

    if(playerDistFromCameraFocusX > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X) {
      if(cameraFocusCenterX < sliderX)  {
        camPanX += RUN_SPEED;
      } else {
        camPanX -= RUN_SPEED;
      }
    }
    if(playerDistFromCameraFocusY > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y) {
      if(cameraFocusCenterY < sliderY)  {
        camPanY += RUN_SPEED;
      } else {
        camPanY -= RUN_SPEED;
      }
    }

    // instantCamFollow();

    // this next code blocks the game from showing out of bounds
    // (this isn't required, if you don't mind seeing beyond edges)
    if(camPanX < 0) {
      camPanX = 0;
    }
    if(camPanY < 0) {
      camPanY = 0;
    }
    var maxPanRight = BRICK_COLS * BRICK_W - canvas.width;
    var maxPanTop = BRICK_ROWS * BRICK_H - canvas.height;
    if(camPanX > maxPanRight) {
      camPanX = maxPanRight;
    }
    if(camPanY > maxPanTop) {
      camPanY = maxPanTop;
    }
  }
  
  function moveEverything() {
    sliderMove();
    cameraFollow();
  }
  
  function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
  }
  
  function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
  }
  
  function drawBricks() {
    for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) { // in each column...
      for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) { // in each row within that col
      
        if( isBrickAtTileCoord(eachCol, eachRow) ) {
          var brickLeftEdgeX = eachCol * BRICK_W;
          var brickTopEdgeY = eachRow * BRICK_H;
          colorRect(brickLeftEdgeX, brickTopEdgeY,
                   BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue' );
        } // end of isBrickAtTileCoord()
      } // end of for eachRow
    } // end of for eachCol
  } // end of drawBricks()

  function drawOnlyBricksOnScreen() {
    // what are the top-left most col and row visible on canvas?
    var cameraLeftMostCol = Math.floor(camPanX / BRICK_W);
    var cameraTopMostRow = Math.floor(camPanY / BRICK_H);

    // how many columns and rows of tiles fit on one screenful of area?
    var colsThatFitOnScreen = Math.floor(canvas.width / BRICK_W);
    var rowsThatFitOnScreen = Math.floor(canvas.height / BRICK_H);

    // finding the rightmost and bottommost tiles to draw.
    // the +1 and + 2 on each pushes the new tile popping in off visible area
    // +2 for columns since BRICK_W doesn't divide evenly into canvas.width
    var cameraRightMostCol = cameraLeftMostCol + colsThatFitOnScreen + 2;
    var cameraBottomMostRow = cameraTopMostRow + rowsThatFitOnScreen + 1;
    
    for(var eachCol=cameraLeftMostCol; eachCol<cameraRightMostCol; eachCol++) {
      for(var eachRow=cameraTopMostRow; eachRow<cameraBottomMostRow; eachRow++) {
      
        if( isBrickAtTileCoord(eachCol, eachRow) ) {
          var brickLeftEdgeX = eachCol * BRICK_W;
          var brickTopEdgeY = eachRow * BRICK_H;
          colorRect(brickLeftEdgeX, brickTopEdgeY,
                   BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue' );
        } // end of isBrickAtTileCoord()
      } // end of for eachRow
    } // end of for eachCol
  } // end of drawBricks()
  
  function drawEverything() {
    // drawing black to erase previous frame, doing before .translate() since
    // its coordinates are not supposed to scroll when the camera view does
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    canvasContext.save(); // needed to undo this .translate() used for scroll

    // this next line is like subtracting camPanX and camPanY from every
    // canvasContext draw operation up until we call canvasContext.restore
    // this way we can just draw them at their "actual" position coordinates
    canvasContext.translate(-camPanX,-camPanY);

    //drawBricks();
    drawOnlyBricksOnScreen();
    
    colorCircle(sliderX, sliderY, 10, 'white');

    canvasContext.restore(); // undoes the .translate() used for cam scroll

    // doing this after .restore() so it won't scroll with the camera pan
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Arrow keys to slide, scrolling demo",8,14);
  }