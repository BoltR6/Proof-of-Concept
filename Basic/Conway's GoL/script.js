let tick = 0;
let resettick = false;
let gmap = {
	x: 70,
	y: 30,
	main: []
}
for(var i = 0;i < gmap.y;i++){
	var arr = []
	for(var g = 0;g < gmap.x;g++){
		arr.push(Math.round(Math.random()))
	}
	gmap.main.push(arr);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
    background(255);
}

function draw() {
	tick ++;

	try{
	gmap.main[Math.round(mouseY/15)][Math.round(mouseX/15)] = 1
	gmap.main[Math.round(pmouseY/15)][Math.round(pmouseX/15)] = 1
	}catch(e){
		
	}
	
	var newmap = [];
	for(var i = 0;i < gmap.y;i++){
		newmap.push(new Array(gmap.x));
	}
	for(var i = 0;i < gmap.main.length;i++){
		for(var g = 0;g < gmap.main[i].length;g++){
			fill(gmap.main[i][g] == 0 ? 0 : 255);
			noStroke();
			rect(g*15,i*15,15,15);
			
			if(tick == 1){
				resettick = true;
			var neighbors = 0;
			for(var gg = -1;gg < 2;gg++){
				for(var ii = -1;ii < 2;ii++){
					try{
						if(ii == 0 && gg == 0){
						}else{
						if(gmap.main[i+gg][g+ii] == 1){
							neighbors ++;
						}
						}
					}catch(e){
						
					}
				}
			}
			/**
			if(gmap.main[i][g] == 1){
				switch(neighbors){
					case 0:
						fill(255,0,0)
						break;
					case 1:
						fill(0,255,0);
						break;
					case 2:
						fill(0,0,255);
						break;
					default:
						fill(255,255,255);
				}
			}**/
			if(gmap.main[i][g] == 1){
				switch(neighbors){
					case 0: 
						newmap[i][g] = 0;
						break;
					case 1:
						newmap[i][g] = 0;
						break;
					case 2:
						newmap[i][g] = 1;
						break;
					case 3:
						newmap[i][g] = 1;
						break;
					default:
						newmap[i][g] = 0;
				}
			}else{
				switch(neighbors){
					case 3:
						newmap[i][g] = 1;
						break;
					default:
						newmap[i][g] = 0;
				}
			}
			}
		}
	}
	if(resettick){
		tick = 0;
		resettick = false;
	  gmap.main = newmap;
	}
	
}
