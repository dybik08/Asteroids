Dot.all = {};
Dot.count = 0;
Dot.max_d = 25;

function Dot(x,y){
	Dot.count++;
	this.id = 'd_'+Dot.count;
	Dot.all[this.id] = this;
	this.x = x;
	this.y = y;
	// jak długo będzie widoczny punkt
	this.d = 0;
	// jak się przesuwa 
	this.mod_x = VAR.rand(3,7)*(VAR.rand(0,1) ? 1 : -1);
	this.mod_y = VAR.rand(3,7)*(VAR.rand(0,1) ? 1 : -1);


}
Dot.prototype.draw = function (){
	this.x += this.mod_x;
	this.y += this.mod_y;
	this.d ++;
	Game.ctx.fillRect(this.x, this.y, 3, 3);
	// jeśl d przekroczy d max czyli 25 to usuń pkt
	if(this.d>Dot.max_d){
		delete Dot.all[this.id];
	}
};
// metoda obiektu dot
Dot.add = function(x,y){
	// rysowanie losowej ilości kropek w punkcie ,, wybuchu''
	var n = VAR.rand(10,20);
	for(var i=0; i<n; i++){
		new Dot(x,y);
	}
};
// metoda rysowania kropek
Dot.draw = function(){
	for(var d in Dot.all){
		Dot.all[d].draw();

	}
};