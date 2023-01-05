/**
 * Current equation is a 'traveling wave' equation of
       y = a * sin( (2pi/w)*x )
			 paired with 
			 v = w * f
 */
var pulses = [
	/**
	{
		amplitude: 1.5,     //Meters
		wavelength: 4,      //Meters
		frequency: 20,       //Hertz
		phase: 'up',        //Up/down

		_points: [],
	},
	{
		amplitude: 0.3,     //Meters
		wavelength: 4,      //Meters
		frequency: 5,       //Hertz
		phase: 'up',        //Up/down

		_points: [],
	},
	**/
];
var quality = 5;
var friction = 0.001;
var lineY = 0;
var lastSent = 1000;

var settings = [
	false,//openEnd
	0.3,//amplitude
	4,//wavelength
	20,//frequency
	'up',//phase
	0.5,//efficiency
	1,//material 1
	1,//material 2
];

function slider(_x, _y, _text, _min, _max, _inc, _setting, _index, _l) {
	fill(0);
	stroke(0);
	strokeWeight(1);
	textSize(18);
	textAlign(LEFT);
	text(_text, _x, _y);

	fill(0);
	noStroke();
	rect(_x + 100, _y - 7.5, _l, 4);

	let s = _max - _min;
	for (var i = 0; i < s; i += _inc) {
		let c = (100 / _max) * i;

		noStroke();
		if (Math.round((_min + i) * 10) / 10 == _setting[_index]) {
			fill(255, 0, 0);
		} else {
			fill(0);
		}
		rect(_x + 100 + c, _y - 14, 5, 15);

		if (mouseIsPressed && mouseX > _x + 100 + c && mouseX < _x + 100 + c + 5 && mouseY > _y - 14 && mouseY < _y - 14 + 15) {
			_setting[_index] = Math.round((_min + i) * 100) / 100;
			console.log(_setting[_index])
		}
	}
}
function tickBox(_x, _y, _setting, _index, _text, _which, _reset) {
	fill(175);
	noStroke();
	ellipse(_x, _y, 17, 17);

	if (_setting[_index] == _which) {
		fill(105);
		noStroke();
		ellipse(_x, _y, 9, 9);
	}

	fill(0);
	textSize(18);
	stroke(0);
	strokeWeight(1);
	textAlign(LEFT);
	text(_text, _x + 12, _y + 6);

	if (mouseIsPressed && dist(_x, _y, mouseX, mouseY) < 8.5) {
		_setting[_index] = _which;
		if (_reset) {
			pulses = [];
		}
	}
}
function info(_x, _y, _box, _offset) {
	fill(145);
	noStroke();
	ellipse(_x, _y, 17, 17);

	fill(0);
	stroke(0);
	strokeWeight(1);
	textSize(14);
	textAlign(CENTER);
	text('?', _x + 0.1, _y + 5);

	if (dist(_x, _y, mouseX, mouseY) < 8.5) {
		if (_offset) {
			push();
			translate(_offset.x, _offset.y);
			fill(235);
			stroke(200);
			rect(_x + 10, _y - 8.5, _box.x, _box.y);

			fill(0);
			noStroke();
			textSize(14);
			textAlign(LEFT);
			text(_box.t, _x + 14, _y + 7);
			pop();
		} else {

			fill(235);
			stroke(200);
			rect(_x + 10, _y - 8.5, _box.x, _box.y);

			fill(0);
			noStroke();
			textSize(14);
			textAlign(LEFT);
			text(_box.t, _x + 14, _y + 7);
		}
	}
}
function mousePressed() {
	if (mouseX > 265 && mouseX < 415 && mouseY > 420 && mouseY < 470) {
		pulses = [];
	}
	if (mouseX > 65 && mouseX < 215 && mouseY > 420 && mouseY < 470 && lastSent > 30) {
		lastSent = 0;
		pulses.push({
			amplitude: settings[1],
			wavelength: settings[2],
			frequency: settings[3],
			phase: settings[4],
			split: false,
			mustflip: false,

			_points: []
		})
		let m = pulses.length - 1;
		let _x = 0;
		while ((TWO_PI / pulses[m].wavelength) * _x < 180) {
			let y = pulses[m].amplitude * sin((TWO_PI / pulses[m].wavelength) * _x)
			let velocity = 800 / Math.floor(800 / (pulses[m].wavelength * pulses[m].frequency));
			velocity = Math.floor(velocity / 20) * 20;
			if (pulses[m].phase == 'up') {
				pulses[m]._points.push([_x, y, velocity]);
			} else {
				pulses[m]._points.push([_x, -1 * y, velocity]);
			}
			_x++;

		}
	}
}
function setup() {
	createCanvas(1000, 600);
	angleMode(DEGREES);
	for (var m = 0; m < pulses.length; m++) {
		let _x = 0;
		while ((TWO_PI / pulses[m].wavelength) * _x < 180) {
			let y = pulses[m].amplitude * sin((TWO_PI / pulses[m].wavelength) * _x)
			if (pulses[m].phase == 'up') {
				pulses[m]._points.push([_x, y, pulses[m].wavelength * pulses[m].frequency]);
			} else {
				pulses[m]._points.push([_x, -1 * y, pulses[m].wavelength * pulses[m].frequency]);
			}
			_x++;

		}
	}
}
function draw() {
	lastSent += deltaTime/6;
	for (var k = 0; k < pulses.length; k++) {
		pulses[k].amplitude -= pulses[k].amplitude * friction;
		for (var u = 0; u < pulses[k]._points.length; u++) {
			if (pulses[k]._points[u][0] > 400 && pulses[k]._points[u][2] > 0 && pulses[k].mustflip == true && settings[6] !== settings[7]) {
				let flip = (settings[7] > settings[6]) ? -1 : 1;
				pulses[k]._points[u][2] = pulses[k]._points[u][2] * -1;
				pulses[k]._points[u][1] = pulses[k]._points[u][1] * flip * 0.3;

				if (u == 0) {
					pulses[k].mustflip = false;
				}
			}
			if (u == pulses[k]._points.length - 1 && pulses[k]._points[u][0] >= 305 && pulses[k]._points[u][0] <= 405 && pulses[k].split === false && settings[6] !== settings[7]) {
				if (pulses[k]._points[Math.floor(pulses[k]._points.length / 2)][1] > 0.005) {
					console.log('Split.' + pulses.length + ":" + k);
					pulses[k].split = true;
					pulses[k]._points = pulses[k]._points.map(i => {
						let n = i;
						n[1] = n[1] / 2;
						return n;
					});

					let obj = JSON.parse(JSON.stringify(pulses[k]));
					obj.mustflip = true;
					obj.split = true;
					pulses.push(obj)
				}
			}
			if (!settings[0]) {
				if (pulses[k]._points[u][0] > 800 && pulses[k]._points[u][2] > 0) {
					pulses[k]._points[u][2] = pulses[k]._points[u][2] * -1;
					pulses[k]._points[u][1] = pulses[k]._points[u][1] * -1 * settings[5];
					pulses[k].split = false;
				} else if (pulses[k]._points[u][0] <= 0 && pulses[k]._points[u][2] < 0) {
					pulses[k]._points[u][2] = pulses[k]._points[u][2] * -1;
					pulses[k]._points[u][1] = pulses[k]._points[u][1] * -1 * settings[5];
					pulses[k].split = false;
				}
			} else {
				if (pulses[k]._points[u][0] > 800 && pulses[k]._points[u][2] > 0) {
					pulses[k]._points[u][2] = pulses[k]._points[u][2] * -1;
					pulses[k]._points[u][1] = pulses[k]._points[u][1] * -1 * (1 - settings[5]);
					pulses[k].split = false;
				} else if (pulses[k]._points[u][0] <= 0 && pulses[k]._points[u][2] < 0) {
					pulses[k]._points[u][2] = pulses[k]._points[u][2] * -1;
					pulses[k]._points[u][1] = pulses[k]._points[u][1] * -1 * (1 - settings[5]);
					pulses[k].split = false;
				}
			}
			pulses[k]._points[u][0] += pulses[k]._points[u][2] / 20;
			pulses[k]._points[u][1] *= 0.995;
		}
		let spliced = false;
		if (Math.abs(pulses[k]._points[Math.floor(pulses[k]._points.length / 2)][1]) < 0.001 && !(settings[0] && settings[5] == 1)) {
			pulses.splice(k, 1);
			console.log('spliced' + pulses.length)
			spliced = true;
		}
		if (!spliced && settings[0] && pulses[k]._points[0][0] > 850 && settings[5] == 1) {
			pulses.splice(k, 1);
		}
	}
	background(235);
	noFill();
	stroke(255, 0, 0);

	push();
	translate(100, 0);
	beginShape();
	strokeJoin(ROUND);
	strokeWeight(5 * settings[6]);
	for (var i = 0; i <= 801; i += quality) {
		let x = i;
		let displacement = 0;
		let fdisplacement = 0;
		for (var g = 0; g < pulses.length; g++) {
			for (var b = 0; b < pulses[g]._points.length; b++) {
				let px = pulses[g]._points[b][0];
				if (px == x) {
					displacement += pulses[g]._points[b][1];
				}
				if (px == x + 1) {
					fdisplacement += pulses[g]._points[b][1];
				}
			}
		}
		if (i == 795) {
			lineY = displacement;
		}
		if (i == 400) {
			//curveVertex(i, 200 - displacement * 100);
			//curveVertex(i, 200 - displacement * 100);
			endShape();

			if (settings[6] !== settings[7]) {
				stroke(255, 0, 0);
				strokeWeight(3);
				noFill();
				ellipse(i, 200 - ((displacement * 100) + (fdisplacement * 100)) / 2, 15, 15);
			}

			beginShape();
			strokeJoin(ROUND);
			strokeWeight(5 * settings[7])
			//curveVertex(i, 200 - displacement * 100);
			//curveVertex(i, 200 - displacement * 100);
		} else {
			curveVertex(i, 200 - displacement * 100);
		}

	}
	endShape();
	pop();

	if (settings[0]) {
		noFill();
		ellipse(900, 200 - lineY * 100, 50, 50);
	} else {
		fill(0, 0, 0);
		stroke(0);
		strokeWeight(5);
		rect(895, 100, 25, 200);
	}
	fill(0, 0, 0);
	stroke(0);
	strokeWeight(5);
	rect(75, 100, 25, 200);

	tickBox(80, 510, settings, 0, 'Open End', true, true);
	tickBox(80, 540, settings, 0, 'Closed End', false, true);

	tickBox(280, 510, settings, 4, 'Phase Up', 'up');
	tickBox(280, 540, settings, 4, 'Phase Down', 'down');

	slider(460, 516, 'Amplitude', 0.1, 1, 0.1, settings, 1, 95);
	slider(460, 546, 'Wavelength', 1, 10, 1, settings, 2, 85);
	slider(720, 516, 'Frequency', 8, 28, 2, settings, 3, 65);
	slider(720, 546, 'Efficiency', 0.1, 1, 0.1, settings, 5, 95);

	slider(460, 450, 'Density 1', 0.1, 1, 0.1, settings, 6, 95);
	slider(720, 450, 'Density 2', 0.1, 1, 0.1, settings, 7, 95);

	info(200, 510, { t: 'Open End is where\nthe wave is allowed\nto travel into infinity', x: 130, y: 56 })
	info(200, 540, { t: 'Closed End is a set\nboundary that waves\nare forced to bounce off of', x: 175, y: 56 })

	info(410, 510, { t: 'Up-Facing', x: 74, y: 22 })
	info(410, 540, { t: 'Down-Facing', x: 92, y: 22 })

	info(673, 510, { t: "Displacement from\nequilibrium", x: 129, y: 40 })
	info(673, 540, { t: "Distance from\npeak-to-peak", x: 99, y: 40 })
	info(933, 510, { t: "Cycles per\nsecond", x: 76, y: 40 }, { x: -50, y: -50 })
	info(933, 540, { t: "How efficient\nthe end is", x: 89, y: 40 }, { x: -50, y: -50 })

	fill(0, 255, 0);
	stroke(0, 150, 0);
	strokeWeight(5);
	rect(65, 420, 150, 50, 3);

	fill(0, 75, 0);
	stroke(0);
	strokeWeight(1);
	textSize(25);
	textAlign(CENTER);
	text("Pulse", 138, 453);

	push();
	translate(200, 0);
	fill(255, 0, 0);
	stroke(150, 0, 0);
	strokeWeight(5);
	rect(65, 420, 150, 50, 3);

	fill(75, 0, 0);
	stroke(0);
	strokeWeight(1);
	textSize(25);
	textAlign(CENTER);
	text("Reset", 138, 453);
	pop();
	if (pulses > 15) {
		quality = 5;
	} else {
		quality = 1;
	}
	if (pulses.length > 30) {
		let lowest;
		for (var i = 0; i < pulses.length; i++) {
			lowest = (lowest < pulses[i]._points[Math.floor(pulses[i]._points.length / 2)]) ? i : lowest;
		}
		pulses.splice(lowest, 1);
	}
}
