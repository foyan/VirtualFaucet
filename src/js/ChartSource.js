function ChartSource() {
	
	var self = this;
	
	this.x = [];
	
	this.y = [];
	
	this.lineChart = null;
	
	this.r = null;
	
	this.init = function (container) {
		self.r = Raphael(container);
			    
	}
	
	this.add = function (x, y) {
		self.x.push(x);
		self.y.push(y);
	}
	
	this.draw = function () {
		if (self.lineChart) {
			self.lineChart.remove();
		}
	    self.lineChart = self.r.linechart(0, 0, 800, 220, self.x, self.y);
	}
	
}
