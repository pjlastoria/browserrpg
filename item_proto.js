var item = Object.create(spriteProto);

item.pickUp = function() {
	this.x = undefined;
	this.y = undefined;
}

/*item.genRandomLocation = function() {
	var coordsObj = genRandomXYOnWalkableTile();
	this.x = coordsObj.x;
	this.y = coordsObj.y;

}*/

var weapon = Object.create(item);

weapon.type = "Weapon";
weapon.damage = Number;

var stick = Object.create(weapon);

stick.name = "Stick";
stick.x = 222;
stick.y = 222;
stick.width = 40;
stick.height = 40;
stick.image = undefined;
stick.damage = 20;

var spear = Object.create(weapon);

spear.name = "Spear";
spear.x = 333;
spear.y = 333;
spear.image = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/items2.png";
spear.damage = 50;

var fireSword = Object.create(weapon);

fireSword.name = "Fire Sword";
fireSword.x = 222;
fireSword.y = 222;
fireSword.image = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/items3.png";
fireSword.damage = 100;

var potion = Object.create(item);

potion.width = 30;
potion.height = 30;
potion.type = "Potion";

var milk = Object.create(potion);

milk.name = "Milk";
milk.healPoints = 50;

var proteinShake = Object.create(potion);

proteinShake.name = "Protein Shake";
proteinShake.healPoints = 100;

var elixir = Object.create(potion);

elixir.name = "Elixir";
elixir.x = 377;
elixir.y = 277;
elixir.image = "https://raw.githubusercontent.com/pjlastoria/pjlastoria.github.io/master/Images/items0.png";
elixir.healPoints = 200;