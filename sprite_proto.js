var spriteProto = {
	name: undefined,
	x: 100,
	y: 100,
	width: 50,
	height: 50,
	image: null,

	draw: function() {
  		ctx.drawImage(this.image, this.x,this.y, this.width, this.height);
	},

	genRandomLocation: function() {
		var coordsObj = genRandomXYOnWalkableTile();
		this.x = coordsObj.x;
		this.y = coordsObj.y;

	}
};