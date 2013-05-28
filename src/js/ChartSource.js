function ChartSource(dt) {
	
	var self = this;
	
	this.x = [];
	
	this.v = [];
	this.h = [];
	
	for (var i = -1000 * dt; i < 0; i += 0.1) {
		this.x.push(i);
		this.v.push(0);
		this.h.push(0);
	}
	
	this.lineChart = null;
	
	this.r = null;
	
	this.init = function (container) {
		self.r = Raphael(container);
			    
	}
	
	this.add = function (x, v) {
		self.x.push(x * dt);
		self.v.push(v);
		self.h.push(v * v / 2.0 / 9.81);
				
		self.x.shift();
		self.v.shift();
		self.h.shift();
	}
	
	this.draw = function () {
		if (self.lineChart) {
			self.lineChart.remove();
		}
	    self.lineChart = self.r.linechart(0, 0, 1000, 100, self.x, [self.v, self.h]);
	}
	
}
