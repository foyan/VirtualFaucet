function ChartSource(dt) {
	
	var self = this;
	
	this.x = [];
	
	this.v = [];
	this.h = [];
	this.V = [];
	
	this.plainText = [];
	
	this.gibberishFactors = [4, 4, 4, 4, 4, 4, 4, 4];
	
	this.minGibberishIndex = ko.observable(0);
	
	for (var i = 0; i < 8; i++) {
		this.plainText[i] = ko.observable("\u00A0");
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
		var V = self.integrator.integrate(0, 0, self.funnel.radius, h) * 2 / 10.0;
		
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
		var ch = self.isPrintable(self.currentByte) ? String.fromCharCode(self.currentByte) : "\u00A0";
		var newText = self.plainText[x % 8]() + ch;
		if (newText.length > 100) {
			newText = newText.substr(newText.length - 100, 100);
		}

		for (var i = 0; i < 8; i++) {
			self.gibberishFactors[i] *= 0.99;
		}

		self.gibberishFactors[x % 8] += self.isGibberish(self.currentByte) ? 0.0 : 0.125;
		
		var minIndex = self.minGibberishIndex();
		var minGibberish = self.gibberishFactors[minIndex];
		for (var i = 0; i < 8; i++) {
			if (self.gibberishFactors[i] > minGibberish) {
				minGibberish = self.gibberishFactors[i];
				minIndex = i;
			}
		}
		self.minGibberishIndex(minIndex);

		self.plainText[x % 8](newText);
				
	}
	
	this.isGibberish = function (byte) {
		if (byte <= 31) {
			return true;
		}
		if (byte >= 127) {
			return true;
		}
		return false;
	}
	
	this.isPrintable = function (byte) {
		if (byte <= 31) {
			return false;
		}
		if (byte == 127) {
			return false;
		}
		if (byte >= 128) {
			return false;
		}
		return true;
	}
	
	this.draw = function () {
		if (self.lineChart) {
			self.lineChart.remove();
		}
	    self.lineChart = self.r.linechart(0, 0, 1000, 100, self.x, [self.v, self.h, self.V], {
	    	axis: "0 0 1 1",
	    	colors: [
	    		"blue", "orange", "green"
	    	],
	    });
	}
	
}
