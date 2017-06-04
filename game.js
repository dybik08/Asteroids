// inicjowanie gry po załadowaniu strony
window.onload = function(){
	Game.init();
}
// poniżej obiekt var gdzie są podręczne wartości
VAR = {
	fps:60,
	W:0,
	H:0,
	lastTime:0,
	lastUpdate:-1,
	rand:function(min,max){
		return Math.floor(Math.random()*(max-min+1))+min;
	}
}
//obiekt game zawierający w sobie funkcje
Game = {
	init:function(){
		// tworzenie canvas
		Game.canvas = document.createElement('canvas');
		// tworzenie drugiej canvas specjalnie na potrzeby zderzeń
		Game.hit_canvas = document.createElement('canvas');
		// przypisanie kontekstu 2D do canvas
		Game.ctx = Game.canvas.getContext('2d');
		Game.hit_ctx = Game.hit_canvas.getContext('2d');
		this.hit_ctx = this.hit_canvas.getContext('2d');
		//odpalenie metodę obiektu ala pudełke - game
		Game.layout();
		// zmiana wielkości okna - dopasowanie
		window.addEventListener('resize', Game.layout, false);

		//dodanie canvas do DOM'u
		document.body.appendChild(Game.canvas);
		//dodanie trzech kamieni do gry
		for(var i =0; i<4; i++){
			new Rock();
		}
		// dodanie statku
		Game.ship = new Ship();

		// reakcja na przyciski
		window.addEventListener('keydown', Game.onKey, false);
		window.addEventListener('keyup', Game.onKey, false);
		// pętla gry
		Game.animationLoop();
	},
	stop: function(){
		window.removeEventListener('keydown', Game.onKey, false);
		window.removeEventListener('keyup', Game.onKey, false);
	},
	// fukcje kierowania statkiem
	onKey: function(event){
		// ifka która steruje statkiem
		if(event.keyCode==32 || event.keyCode==37 || event.keyCode==38 || event.keyCode==39){
			event.preventDefault();
			//
			if(event.type=='keydown' && !Game['key_'+event.keyCode]){
				Game['key_'+event.keyCode] = true;
				// jeśli przyciskasz w lewo to wyłącza się w prawo
				if(event.keyCode==37){
					Game.key_39 = false;
				}else if(event.keyCode==39){
					Game.key_37 = false;
				}else if(event.keyCode==32){
					new Bullet();
				}
			}else if (event.type=='keyup'){ // gdy skończysz przyciskanie to kończ akcję
				Game['key_'+event.keyCode] = false;
			}
		}
	}, // metoda służąca do zmiany wielkości okna
	layout:function(ev){
		VAR.W = window.innerWidth;
		VAR.H = window.innerHeight;
		// Wiele wielkości będzie bazowało na krótszym boku wielkości okna, dlatego można od razu przypisać go do właściwości obiektu VAR
		VAR.d = Math.min(VAR.W, VAR.H);
		// zmiana wielkości canvas
		Game.canvas.width = VAR.W;
		Game.canvas.height = VAR.H;
		//
		Game.hit_canvas.width = VAR.W;
		Game.hit_canvas.height = VAR.H;
		Game.hit_ctx.fillStyle = 'red';
		// nowa definicja kolorów po każdej zmianie wielkości okna
		Game.ctx.fillStyle = 'white'
		Game.ctx.strokeStyle = 'white'
		Game.ctx.lineWidth = 3
		Game.ctx.lineJoin = 'round'	

	}, // funckja która odpala się 60x na minutę
	animationLoop: function(time){
		requestAnimationFrame ( Game.animationLoop );
		if(time-VAR.lastTime>=1000/VAR.fps){
			VAR.lastTime = time;
			//
			// oczyszczenie canvas ala okna
			Game.ctx.clearRect(0,0,VAR.W, VAR.H);
			
			// no i rysowanko
			Game.ship.draw();
			//
			Rock.draw();
			Bullet.draw();
			//
			Dot.draw();
			
		}
	}
}