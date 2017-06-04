function Ship(){
	// promień statku (trójkąt wpisany w okrąg)
	this.r = 0.04;
	// rufa - linie pod kątem 50 i -50 stopni
	this.rear_a = 50;
	// kąt obrotu
	this.a = 0;
	// x i y w pikselach
	this.x = VAR.W/2;

	this.y = VAR.H/2;
	// ruch statku wartości w pikselach
	this.modX = 0;
	this.modY = 0;
	// przyspieszenie
	this.acc = 0.0004;
	// predkosc max wzgledem wielkosci okna
	this.maxMod = 0.019;
	// składowe statku,3 punkty w tablicy
	this.points = [{},{},{}];
}
// test zderzeniowy
Ship.prototype.hitTest = function(){
	// sprawdzenie czy którykolwiek z punktów statku pokrywa się z asteroidą
	for(var i=0; i<this.points.length; i++){
		for(var r in Rock.all){
			if(Rock.all[r].hitTest(this.points[i].x, this.points[i].y)){
				// jeśli się pokrywa to rozwal kamień i zwróć true - koniec testowania dla innych kamieni
			Rock.all[r].remove()
			return true	
			}		
		}
	}
	return false
}


// rysowanie statku
Ship.prototype.draw = function(){
	// jeśli statek nie jest zniszczony
	if(!this.destroyed){

		// sprawdzenie czy statek nie rozwalił się o skały
	if(this.hitTest()){
		this.destroyed = true;
		Game.stop();
	}else{
		// jeśli gracz klika przyciski lewo/prawo to statek skręca o 7 stopni
	if(Game.key_37 || Game.key_39){
		this.a = this.a + 7 *( Game.key_37 ? -1 : 1)
	}
	// przyśpieszenie 
	if(Game.key_38){
		// rysowanie -  prędkość maksymalna i ,,minus'' maksymalna ( aby nie zejść poniżej tych wartości)
		this.modX = Math.max(-this.maxMod*VAR.d, Math.min(this.maxMod*VAR.d, this.modX+Math.sin(Math.PI/180*this.a)*this.acc*VAR.d))
		this.modY = Math.max(-this.maxMod*VAR.d, Math.min(this.maxMod*VAR.d, this.modY-Math.cos(Math.PI/180*this.a)*this.acc*VAR.d))

	}else{
		// zwalnianie statkiem - 98% prędkości wyjściowej, jeśli wartość mniejsza niż 0.0001 to statek staje w miejscu
		this.modX = this.modX*0.98;
		this.modX = Math.abs(this.modX)<0.0001? 0 : this.modX
		this.modY = this.modY*0.98;
		this.modY = Math.abs(this.modY)<0.0001? 0 : this.modY
	}
	this.x+=this.modX;
	this.y+=this.modY;

	Game.ctx.beginPath();
	// rysowanie, 4 razy bo najpierw rusza się przód a później zostają dorysowane boki

	for(var i = 0; i<3; i++){
		// przypisanie aktualnego kąta w zależności od rysowanego punktu
				// dziób ma 180 stopni (i==0), rufa 50 (i==1) i -50 (i==2)
		this.tmp_a = i===0 ? this.a : (this.a+180+(i==1 ? this.rear_a : -this.rear_a) );

		this.tmp_r = i===0 ? this.r*1 : this.r*0.6;

		// przechowywanie punktów w tablicy obiektów - konieczne do testu zderzeniowego
		// wszystko mnożymy przez VAR.d bo promień jest wartością względną (dla przypomnienia VAR.d jest szerokością lub wysokością cavnas, zależy co aktualnie któtsze)
		// na koniec dodajemy aktualny x i y (wartości)
		this.points[i].x = Math.sin(Math.PI/180*this.tmp_a)*this.r*VAR.d+this.x;

		this.points[i].y = -Math.cos(Math.PI/180*this.tmp_a)*this.r*VAR.d+this.y;
		//rysowanie
		// w notacji kwadratowej - przesuwamy piórko rysując linię, ostatni odcinek linii kończy ścieżkę (zamyka)
		Game.ctx[i===0? 'moveTo' : 'lineTo' ](this.points[i].x, this.points[i].y);
	}
	Game.ctx.closePath()

	Game.ctx.stroke()

	
	if(Game.key_38 && this.draw_thrust){
		// rysowanie ,,odrzutu''
		Game.ctx.beginPath();
		this.draw_thrust = false;
		for(var i=0; i<3; i++){
			this.tmp_a = i!=1 ? this.a+180+(i===0 ? -this.rear_a+14 : this.rear_a-14) : this.a+180;
			this.tmp_r = i==1 ? this.r : this.r*0.5;
			Game.ctx[i===0 ? 'moveTo' : 'lineTo'](
				Math.sin(Math.PI/180*this.tmp_a)*this.tmp_r*VAR.d+this.x,
				-Math.cos(Math.PI/180*this.tmp_a)*this.tmp_r*VAR.d+this.y
				);
		}
		Game.ctx.stroke();
		// 
	}else if(Game.key_38 && !this.draw_thrust){
		this.draw_thrust = true;
	}
	// sprawdzenie czy statek wyleciał poza ekran
	if(this.points[0].x<0 && this.points[1].x<0 && this.points[2].x<0){
		// powiększenie x o szerokość ekranu powiększoną o 90% najbardziej wystającego punktu statku
		this.x+=VAR.W - Math.min(this.points[0].x, this.points[1].x, this.points[2].x)*0.9;
	}else if(this.points[0].x>VAR.W && this.points[1].x>VAR.W && this.points[2].x>VAR.W){
		// tutaj odwrotnie, pomniejsznie x o 90% wystającego punktu
		this.x-=VAR.W - (VAR.W-Math.max(this.points[0].x, this.points[1].x, this.points[2].x))*0.9;
	}

	// to samo dla y co dla x (wyżej)
	if(this.points[0].y<0 && this.points[1].y<0 && this.points[2].y<0){
		this.y+=VAR.H - Math.min(this.points[0].y, this.points[1].y, this.points[2].y)*0.9;
	}else if(this.points[0].y>VAR.H && this.points[1].y>VAR.H && this.points[2].x>VAR.H){
		this.y-=VAR.H - (VAR.H-Math.max(this.points[0].y, this.points[1].y, this.points[2].y))*0.9;	
			}
		}
	}
}