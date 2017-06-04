// tutaj przechowywane są wszystkie instancje rock
Rock.all = {};
// liczy asteroidy aby każda miała unikatowe id
Rock.count = 0;
// promień, kąty trójkątów tworzących kamień (wpisanych w okrąg), ilość minimalna, ilość max
Rock.data = [
	{r: 0.025, speed:0.0005,    minAngle:60, maxAngle:90, minSmallerRocks:0, maxSmallerRocks:0},
	{r: 0.08,  speed:0.00025,   minAngle:50, maxAngle:70, minSmallerRocks:2, maxSmallerRocks:3},
	{r: 0.2,   speed:0.0000625, minAngle:30, maxAngle:45, minSmallerRocks:3, maxSmallerRocks:4}
];
//
function Rock (size, x, y){ // gdy size = 2 - największa kamienie
	// liczenie kamieni
	Rock.count++;
	// nadawanie id każdemu kamieniowi
	this.id = Rock.count;

	Rock.all[this.id] = this;
	// gdy size jest podany to wielkość =  size, gdy nie to wielkość równa się max size czyli 2
	this.size = size!==undefined ? size : 2;
	// tablica z punktami tworzącymi asteroidę
	this.points = [];
	// promień ,,pobiera się'' z tablicy z informacjami o kamieniach
	this.r = Rock.data[this.size].r;
	// losowanie pozycji x i y kamienia (chyba że tworzy się nowy z rozwalonego dużego)
	this.x = x!==undefined ? x : (VAR.rand(0,1) ? VAR.rand(0,3) : VAR.rand(7,10)/10)*VAR.W;

	this.y = y!==undefined ? y : (VAR.rand(0,1) ? VAR.rand(0,3) : VAR.rand(7,10)/10)*VAR.H;
	// prędkość asteroidy
	this.modX = Rock.data[this.size].speed*VAR.rand(1,10)*(VAR.rand(0,1) ? 1 : -1);
	this.modY = Rock.data[this.size].speed*VAR.rand(1,10)*(VAR.rand(0,1) ? 1 : -1);
	
	// kamień jest bryłą nieforemną, punkty na okręgu są losowane a następnie łączone liniami
	// rozpoczęcie losowym kątem
	var a = VAR.rand(0,40);
	// dopóki kąt jest mniejszy niż 360 stopni dodawaj nowe punkty
	while(a<360){
		// zwiększ kąt o losową wartość z przedziału zadeklarowanego w Rock.data
		a+=VAR.rand(Rock.data[this.size].minAngle,Rock.data[this.size].maxAngle);
		// wrzucenie pkt do tablicy
		this.points.push({
			x:Math.sin(Math.PI/180*a)*this.r,
			y:Math.cos(Math.PI/180*a)*this.r
		});
	}
	}
	Rock.prototype.hitTest = function(x,y){
		// pierwszy test, sprawdzenie czy pocisk mieści się w kwadracie w który wpisany jest kamień
		if(x>this.x-this.r*VAR.d && x<this.x+this.r*VAR.d && y>this.y-this.r*VAR.d && y<this.y+this.r*VAR.d){
			// jeśli pocisk znajduje się w kwadracie to przejdź do precyzyjnego testu
			// w canvas stworzonej na potrzebę testu czyszczony jest kwadrat
			Game.ctx.clearRect(this.x-this.r*VAR.d, this.y-this.r*VAR.d,this.r*2*VAR.d, this.r*2*VAR.d);
			// rysuję kopię kamienia wypełnioną na czerowno.
		// rysowanie takie jak w metodzie draw() instancji obiektu Rock
			Game.hit_ctx.beginPath();
			for (var i = 0; i < this.points.length; i++) {
		
		Game.hit_ctx[i===0 ? 'moveTo' : 'lineTo'](this.points[i].x*VAR.d+this.x, this.points[i].y*VAR.d+this.y);		
	}
	Game.hit_ctx.closePath()
	Game.hit_ctx.fill()
		
		// zwrócenie tablicy z wartościami R,G,B,A każdego piksela w obszarze testu
		if(Game.hit_ctx.getImageData(x,y,1,1).data[0]==255){
			// jeśli testowany punkt trafia w kamień to zwracane jest ,,true''
			return true
		}
		
	}
	return false
}
// rysowanie pojedyńczego kamienia
Rock.prototype.draw = function(){
	// aktualny x i y
	this.x+=this.modX*VAR.d;
	this.y+=this.modY*VAR.d;
	// sprawdzenie czy przeleciał za ekran (podobnie jak w statku)
	if(this.x+this.r*VAR.d<0){
		this.x += (VAR.d*this.r*2)+VAR.W;
	}else if (this.x-this.r*VAR.d>VAR.W){
		this.x -= (VAR.d*this.r*2)+VAR.W;
	}
	//
	if(this.y+this.r*VAR.d<0){
		this.y += (VAR.d*this.r*2)+VAR.H;
	}else if(this.y-this.r*VAR.d>VAR.H){
		this.y -= (VAR.d*this.r*2)+VAR.H;
	}

	Game.ctx.beginPath();
	
	for (var i = 0; i < this.points.length; i++) {
		Game.ctx[i===0 ? 'moveTo' : 'lineTo'](this.points[i].x*VAR.d+this.x, this.points[i].y*VAR.d+this.y);
				
	}
	Game.ctx.closePath();
	Game.ctx.stroke();
	
};
Rock.prototype.remove = function(){
	if(this.size>0){
		// jeśli to nie był mały kamień wstaw na jego miejsce nowe - mniejsze
		for(var i = 0, j = VAR.rand(Rock.data[this.size].minSmallerRocks, Rock.data[this.size].maxSmallerRocks); i<j; i++){
			new Rock(this.size-1, this.x, this.y)

		}
	}
	// rysowanie ,, wybuchu'' w miejscu kamienia
	Dot.add(this.x, this.y);
	delete Rock.all[this.id];
}
// rysowanie wszystkich kamieni
Rock.draw = function(){
	// liczenie wszystkich kamieni - gdy dojdzie do 0 to gracz wygrał bo wszystkie zastrzelił
	Rock.num = 0;
	for(var r in Rock.all){
		Rock.num++;
		// rysuj ten konkretny kamień
		Rock.all[r].draw();
	}
};