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
		for (var i = 0; i < self.guesses.length; i++) {
			self.guesses[i].func = null;
		}
	}
	
	this.draw = function () {
		if (self.x.length > 10) {
			self.guess();
		}
		
		self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
		for (var g = 0; g < self.guesses.length; g++) {
			var guess = self.guesses[g];
			if (guess.func) {
				self.context.strokeStyle = guess.color;
				
				self.context.beginPath();
				self.context.moveTo(self.canvasWidth / 2 - guess.func(self.canvasHeight), 0);
				for (var i = self.canvasHeight - 1; i >= 0; --i) {
					self.context.lineTo(self.canvasWidth / 2 - guess.func(i), self.canvasHeight - i);
				}
				for (var i = 0; i < self.canvasHeight; i++) {
					self.context.lineTo(self.canvasWidth / 2 + guess.func(i), self.canvasHeight - i);
				}
				
				self.context.stroke();
			}
		}
		for (var i = 0; i < self.x.length; i++) {
			self.context.fillStyle = "white";
			self.context.fillRect(self.canvasWidth / 2 - self.y[i], self.canvasHeight - 1 - self.x[i], 3, 3);
			self.context.fillRect(self.canvasWidth / 2 + self.y[i], self.canvasHeight - 1 - self.x[i], 3, 3);
		}
	}
	
	this.guesses = [
		new Guess(LinearRegression.Polynomial([3, 2, 1, 0]), "blue"),
		new Guess(LinearRegression.Polynomial([3, 2]), "orange"),
		new Guess(LinearRegression.Polynomial([2, 1, 0]), "green"),
		new Guess(LinearRegression.Polynomial([1, 0]), "yellow")
	];
	
	function Guess(mode, color) {
		
		var sself = this;
		
		this.mode = mode;
		this.x = ko.observable(null);
		this.func = null;
		this.name = ko.computed(function () {
			return sself.mode.describe(sself.x());
		});
		this.color = color;
		
	}
		
	this.guess = function () {
		var reg = new LinearRegression();
		for (var i = 0; i < self.guesses.length; i++) {
			var res = reg.calculate(self.x, self.y, self.guesses[i].mode);
			self.guesses[i].func = res.func;
			self.guesses[i].x(res.x);
		}
	}
	
}
