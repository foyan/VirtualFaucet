function ShapeDecoder(dt) {
	
	var self = this;
	
	this.x = [0];
	this.y = [0];
	
	this.prevh = 0;
	
	this.canvas = $("#shapeC").get(0);
	
	this.canvasWidth = self.canvas.width;
	this.canvasHeight = self.canvas.height;
	
	this.context = self.canvas.getContext("2d");
		
	this.report = function (inflow, outflow, outflowVelocity) {

		var h = outflowVelocity * outflowVelocity / (2 * 9.81);
		if (h != 0) {
			var dh = h - self.prevh;
			var dV = inflow - outflow;
			
			var r = dV/dh/2;
						
			self.x.push(h);
			self.y.push(r);
			
			if (self.x.length > 1000) {
				self.x.shift();
				self.y.shift();
			}
			
			self.prevh = h;
		}
		
	}
	
	this.clear = function () {
		this.x = [0];
		this.y = [0];
	}
	
	this.draw = function () {
		if (self.x.length > 10) {
			self.guess();
		}
		
		self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
		if (self.regressionFunction) {
			self.context.strokeStyle = "blue";
			
			self.context.beginPath();
			self.context.moveTo(self.canvasWidth / 2 - self.regressionFunction(self.canvasHeight), 0);
			for (var i = self.canvasHeight - 1; i >= 0; --i) {
				self.context.lineTo(self.canvasWidth / 2 - self.regressionFunction(i), self.canvasHeight - i);
			}
			for (var i = 0; i < self.canvasHeight; i++) {
				self.context.lineTo(self.canvasWidth / 2 + self.regressionFunction(i), self.canvasHeight - i);
			}
			
			self.context.stroke();
		}
		for (var i = 0; i < self.x.length; i++) {
			self.context.fillStyle = "red";
			self.context.fillRect(self.canvasWidth / 2 - self.y[i], self.canvasHeight - 1 - self.x[i], 1, 1);
			self.context.fillRect(self.canvasWidth / 2 + self.y[i], self.canvasHeight - 1 - self.x[i], 1, 1);
		}
	}
	
	this.regressionFunction = null;
	
	this.guess = function () {
		var reg = new LinearRegression();
		self.regressionFunction = reg.calculateFunction(self.x, self.y, LinearRegression.Polynomial(3));
	}
	
}
