var hero = Object.create(spriteProto);
var walking = false;
hero.name = "Jack";
hero.x = 100;
hero.y = 100;
hero.image = undefined;

hero.int = null
hero.speed = 7;
hero.health = 100;
hero.healthMax = 100;
hero.exp = 0;
hero.expMax = 100;
hero.damage = 10;
hero.level = 1;
hero.weapon = "None";
hero.dead = false;

hero.sprites = (function() {
	var spriteSheet = [];
	for(var i = 0; i < 15; i++) {
		var sprite = document.createElement("img");
		sprite.src = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/hero_sprites/hero_sprites" +i+ ".png";

		spriteSheet.push( sprite );
	}
	return spriteSheet;
}());

hero.walkingSprites = {
	"still": [ hero.sprites[10],  hero.sprites[10],  hero.sprites[10]  ],

	"up":    [ hero.sprites[4],  hero.sprites[5],  hero.sprites[6]  ],
	"right": [ hero.sprites[10], hero.sprites[11], hero.sprites[12] ],
	"down":  [ hero.sprites[1],  hero.sprites[2],  hero.sprites[3] ],
	"left":  [ hero.sprites[7],  hero.sprites[8],  hero.sprites[9] ]
};

/*hero.move = function() {

	var goBackX = this.x;
	var goBackY = this.y;

	var furthestX = gridW*cols - userW;
	var furthestY = gridH*rows - userH;

	if(keyUp)    { this.y -= this.speed }
	if(keyRight) { this.x += this.speed }
	if(keyDown)  { this.y += this.speed }
	if(keyLeft)  { this.x -= this.speed }

	if( checkforCollision(this.x, this.y) ||
		this.x >= furthestX ||
		this.y >= furthestY ||
		this.x <= 0		    ||
		this.y <= 0 ) {

		this.x = goBackX;
		this.y = goBackY;

	}
}*/

hero.animate = function(curr, direction) {
	if( keyUp === false &&
		keyLeft === false &&
		keyDown === false &&
		keyRight === false ) {
			//direction = "still";
			return hero.image = hero.walkingSprites[direction][0];
		}
	
	if(keyUp   ) { direction = "up"   ; }
	if(keyLeft ) { direction = "left" ; }
	if(keyDown ) { direction = "down" ; }
	if(keyRight) { direction = "right"; }
	
	hero.image = hero.walkingSprites[direction][curr];
	
}


hero.equip = function(weapon) {
	hero.weapon = weapon.name;
	hero.damage = weapon.damage;
}

hero.attack = function(opponent) {
	opponent.health -= this.damage;
}

hero.addExp = function() {
	this.exp += 15;
	if(this.exp >= this.expMax) { this.levelUp(); }
}

hero.levelUp = function() {
	this.level++;
	this.damage += 20;
	this.maxHealth += 20;
	this.exp = 0;
}

hero.heal = function(potion) {
	if(this.health === this.healthMax) { return false; }
	if(this.health + potion.healPoints > this.healthMax) {
		this.health = this.healthMax;
		return true;
	}
	this.health += potion.healPoints;
	return true;
}

hero.die = function() {
	this.speed = 0;
	this.image = userDeathSprite;
	this.dead = true;
}

hero.reset = function() {
	hero.x = 100;
	hero.y = 100;

	hero.speed = 7;
	hero.health = 100;
	hero.damage = 10;
	hero.exp = 0;
	hero.level = 1;
	hero.weapon = "Bare Knuckles";
}