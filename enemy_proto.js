var enemy = Object.create(spriteProto);

enemy.health = Number;
enemy.damage = Number;
enemy.MapTileNum = Number;

enemy.attack = function(opponent) {
	opponent.health -= this.damage;
}

enemy.die = function() {
	hero.exp += this.expPoints;
}

var nightMare = Object.create(enemy);

nightMare.name = "Nightmare";
nightMare.width  = 100;
nightMare.height = 100;

nightMare.health = 50;
nightMare.damage = 20;
nightMare.expPoints = 20;

var darkSlender = Object.create(enemy);

darkSlender.MapTileNum = 9;
darkSlender.name = "Dark Slender";
darkSlender.width  = 80;
darkSlender.height = 100;
darkSlender.image = undefined;

darkSlender.health = 200;
darkSlender.damage = 40;

var golem = Object.create(enemy);

golem.MapTileNum = 10;
golem.x = 100;
golem.y = 200;
golem.name = "Golem";
golem.width  = 80;
golem.height = 80;
golem.image = undefined;

golem.health = 200;
golem.damage = 60;

var snowMan = Object.create(enemy);

snowMan.MapTileNum = 11;
snowMan.name = "Da Big Bad Boss";
snowMan.width  = 200;
snowMan.height = 200;
snowMan.image = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/shadow_sprites3.png";

snowMan.health = 1000;
snowMan.damage = 100;