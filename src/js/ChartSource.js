function ChartSource(dt) {
	
	var self = this;
	
	this.x = [];
	
	this.v = [];
	this.h = [];
	this.V = [];
	this.dVo = [];
	this.dVi = [];
	
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
		this.dVo.push(0);
		this.dVi.push(0);
	}
	
	this.showv = ko.observable(true);
	this.showh = ko.observable(true);
	this.showV = ko.observable(true);
	this.showdVo = ko.observable(true);
	this.showdVi = ko.observable(true);
	
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
		var h = v > 0 ? v * v / 2.0 / 9.81 : 0;
		var V = self.integrator.integrate(0, 0, self.funnel.radius, h) * 2;
		
		var dVo = v * self.funnel.radius(0) * 2 * dt;
		var dVi = V - self.prevV - dVo;
				
		self.x.push(x * dt);
		self.v.push(v);
		self.h.push(h);
		self.V.push(V / 10.0);
		self.dVo.push(dVo);
		self.dVi.push(dVi);
				
		self.x.shift();
		self.v.shift();
		self.h.shift();
		self.V.shift();
		self.dVo.shift();
		self.dVi.shift();
		
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
		var series = [];
		var colors = [];
		if (self.showv()) {
			series.push(self.v);
			colors.push("blue");
		}
		if (self.showh()) {
			series.push(self.h);
			colors.push("orange");
		}
		if (self.showV()) {
			series.push(self.V);
			colors.push("green");
		}
		if (self.showdVo()) {
			series.push(self.dVo);
			colors.push("red");
		}
		if (self.showdVi()) {
			series.push(self.dVi);
			colors.push("purple");
		}
	    self.lineChart = self.r.linechart(0, 0, 1000, 100, self.x, series, {
	    	axis: "0 0 1 1",
	    	colors: colors
	    });
	}
	
}
