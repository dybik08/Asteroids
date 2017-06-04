// maksymalna ilość pocisków
Bullet.max = 5;
// obiekt z wszystkimi pociskami
Bullet.all = {};
// prędkość pocisku (względna)
Bullet.speed = 0.022;
// liczy ile pocisków jest w grze i niżej ile jest aktywnych  
Bullet.count = 0;
Bullet.active_count = 0;
// długość życia pocisku (klatki) zanim zostanie usunięty
Bullet.life = 35;

// funkcja konstrukcji pocisku
function Bullet(){
	// jeśli liczba pocisków widocznych na ekranie jest mniejsza niż max ilość
	if(Bullet.active_count<Bullet.max){
		Bullet.count++;
		Bullet.active_count++;
		// unikalny numer każdego pocisku
		this.id = Bullet.count.toString();
		// wrzucenie pocisku do obiektu aktywnych pocisków
		Bullet.all[this.id] = this;
		// aktualny stan ,,życia'' pocisku
		this.life = 0;
		// kąt wystrzału pocisku zgodny z kątem ustawienia dzioba statku
		this.a = Game.ship.a;
		// punkt ,, startowy'' pocisku
		this.x = Game.ship.points[0].x;
		this.y = Game.ship.points[0].y;
		//this.modX = Math.sin(Math.PI/180*this.a)*Bullet.speed*VAR.d; - obie linijki niepotrzebne w tym układzie ale zostawiam w ramach treningu
		//this.modY = -Math.cos(Math.PI/180*this.a)*Bullet.speed*VAR.d;
	}
}
// statyczna metoda obiektu Bullet ( nie jest to metoda każdej instancji)
Bullet.draw = function(){
	// pętla for in przeszukuje wszystki pociski przechowywane w Bullet.all
	for(var b in Bullet.all){
		// czy jeszcze żyje
		for(var r in Rock.all){
				// test zderzenia pocisku z asteroidą, jeśli pokrywają się punkty to usuwa pocisk
				if(Rock.all[r].hitTest(Bullet.all[b].x, Bullet.all[b].y)){
					Bullet.all[b].life += Bullet.life;
					Rock.all[r].remove();
					// przerwanie testowania pocisku bo został już wymazany
					break;
				}
			}
		if(Bullet.all[b].life>Bullet.life){
			
			// jeśli nie żyje zmniejsz ilość aktywnych pocisków o jeden
			Bullet.active_count--;
			// i usuń pocisk z Bullet.all
			delete Bullet.all[b];
		}else{
			// starzeje się
			Bullet.all[b].life++;
			// leci pocisk (znowu trygonometria)
			Bullet.all[b].x += Math.sin(Math.PI/180*Bullet.all[b].a)*Bullet.speed*VAR.d;
			Bullet.all[b].y -= Math.cos(Math.PI/180*Bullet.all[b].a)*Bullet.speed*VAR.d;
			// czy się przelatuje przez krawędź ekranu - x
			if(Bullet.all[b].x<0){
				Bullet.all[b].x+=VAR.W;
			}else if(Bullet.all[b].x>VAR.W){
				Bullet.all[b].x-=VAR.W;
			}// to samo dla y
			if(Bullet.all[b].y<0){
				Bullet.all[b].y+=VAR.H;
			}else if(Bullet.all[b].y>VAR.H){
				Bullet.all[b].y-=VAR.H;
			}
			// rysuj pocisk
			Game.ctx.beginPath();
			Game.ctx.arc(Bullet.all[b].x,Bullet.all[b].y,3,0,Math.PI/180*360);
			Game.ctx.closePath();
			Game.ctx.fill();
	}
	}
};