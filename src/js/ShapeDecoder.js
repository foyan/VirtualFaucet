function ShapeDecoder(dt, displays) {
	
	var self = this;
	
	this.x = [0];
	this.y = [0];
	this.yr = [0];
	
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
			self.yr.push(r-4);
			
			if (self.x.length > 5000) {
				self.x.shift();
				self.y.shift();
				self.yr.shift();
			}
			
			self.prevh = h;

			if (self.x.length > 10 && self.x.length % 5 == 0 && displays.analyze()) {
				self.guess();
			}

		}
		
	}
	
	this.clear = function () {
		self.x = [0];
		self.y = [0];
		self.yr = [0];
		for (var i = 0; i < self.guesses.length; i++) {
			self.guesses[i].func = null;
		}
	}
	
	this.draw = function () {
		
		self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);

		if (!displays.recordII()) {
			return;
		}
				
		for (var g = 0; g < self.guesses.length; g++) {
			var guess = self.guesses[g];
			if (guess.func) {
				self.context.strokeStyle = guess.displayColor();
				self.context.lineWidth = guess.isLeader() ? 2 : 1;
				
				self.context.beginPath();
				self.context.moveTo(self.canvasWidth / 2 - guess.func(self.canvasHeight)-4, 0);
				for (var i = self.canvasHeight - 1; i >= 0; --i) {
					self.context.lineTo(self.canvasWidth / 2 - guess.func(i)-4, self.canvasHeight - i);
				}
				for (var i = 0; i < self.canvasHeight; i++) {
					self.context.lineTo(self.canvasWidth / 2 + guess.func(i)+4, self.canvasHeight - i);
				}
				
				self.context.stroke();
			}
		}
		for (var i = 0; i < self.x.length; i++) {
			self.context.fillStyle = "white";
			self.context.fillRect(self.canvasWidth / 2 - self.y[i], self.canvasHeight - 1 - self.x[i], 1, 1);
			self.context.fillRect(self.canvasWidth / 2 + self.y[i], self.canvasHeight - 1 - self.x[i], 1, 1);
		}
	}
	
	this.guesses = [
		new Guess(LinearRegression.Polynomial([4, 3, 2, 1, 0]), "blue"),
		new Guess(LinearRegression.Polynomial([3, 2]), "orange"),
		new Guess(LinearRegression.Polynomial([2, 1]), "green"),
		new Guess(LinearRegression.Polynomial([1]), "yellow"),
		new Guess(LinearRegression.Polynomial([0.5]), "purple")
	];
	
	function Guess(mode, color) {
		
		var sself = this;
		
		this.mode = mode;
		this.x = ko.observable(null);
		this.func = null;
		this.residual = ko.observable(null);
		this.name = ko.computed(function () {
			return "y = " + sself.mode.describe(sself.x()) + (sself.x() != null ? ", ║R║<sub>2</sub> = " + (sself.residual() ? sself.residual().toFixed(2) : "?") + "]" : "");
		});
		this.color = color;
		this.isLeader = ko.observable(false);
		
		this.displayColor = ko.computed(function () {
			return sself.isLeader() ? sself.color : "#333333";
		});
		
	}
		
	this.guess = function () {
		var reg = new LinearRegression();
		
		var minR = 99999999;
		var minRguess = -1;
		for (var i = 0; i < self.guesses.length; i++) {
			var res = reg.calculate(self.x, self.yr, self.guesses[i].mode);
			self.guesses[i].func = res.func;
			self.guesses[i].x(res.x);
			self.guesses[i].residual(res.residual);
			self.guesses[i].isLeader(false);
			
			if (res.residual < minR) {
				minRguess = i;
				minR = res.residual;
			}
		}
		
		if (minRguess != -1) {
			self.guesses[minRguess].isLeader(true);
		}
	}
	
}
