function ChartSource(dt) {
	
	var self = this;
	
	this.x = [];
	
	this.v = [];
	this.h = [];
	this.V = [];
	
	this.plainText = [];
	
	var pt = "";
	/*for (var i = 0; i < 200; i++) {
		pt += ".\u200B";
	}*/
	for (var i = 0; i < 8; i++) {
		this.plainText[i] = ko.observable(pt);
	}
	
	for (var i = -1000 * dt; i < 0; i += 0.1) {
		this.x.push(i);
		this.v.push(0);
		this.h.push(0);
		this.V.push(0);
	}
	
	this.integrator = new RungeKuttaIntegrator();
	this.funnel = null;
	
	this.lineChart = null;
	
	this.r = null;
	
	this.init = function (container) {
		self.r = Raphael(container);   
	}
	
	this.currentByte = 0;
	
	this.prevV = 0;
	
	this.add = function (x, v) {
		var h = v * v / 2.0 / 9.81;
		var V = self.integrator.integrate(0, 0, self.funnel.radius, h) * 2 / 100.0;
		
		self.x.push(x * dt);
		
		self.v.push(v);
		self.h.push(h);
		self.V.push(V);
				
		self.x.shift();
		self.v.shift();
		self.h.shift();
		self.V.shift();
		
		var bit = V > self.prevV ? 1 : 0;
		self.prevV = V;
		
		self.currentByte = ((self.currentByte << 1) + bit) & 255;
		var ch = self.currentByte > 31 ? String.fromCharCode(self.currentByte) : " ";
		//self.plainText[x % 8](self.plainText[x % 8]().substr(2) + ch + "\u200B");
		self.plainText[x % 8](self.plainText[x % 8]() + ch + "");
				
	}
	
	this.draw = function () {
		if (self.lineChart) {
			self.lineChart.remove();
		}
	    self.lineChart = self.r.linechart(0, 0, 1000, 100, self.x, [self.v, self.h, self.V]);
	}
	
}
