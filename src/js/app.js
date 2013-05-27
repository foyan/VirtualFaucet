function App() {
	
	var self = this;
	
	this.funnel = new Funnel();
	
	this.canvas = $("#vf").get(0);
	
	this.canvasWidth = self.canvas.width;
	this.canvasHeight = self.canvas.height;
	
	this.context = self.canvas.getContext("2d");
	
	this.volume = 0;
	
	this.integrator = new RungeKuttaIntegrator();
	
	this.tap = function() {
		self.volume += 200;
		self.paint();
	}
	
	this.paintFunnel = function (ctx, cx, cy, H, r, draw) {
		ctx.beginPath();
		
		var rh1 = r(H);
		var rh0 = r(0);
		
		ctx.moveTo(cx - rh1, cy - H);
		ctx.lineTo(cx + rh1, cy - H);
		
		for (var h = H - 1; h > 0; --h) {
			var rh = r(h);
			ctx.lineTo(cx + rh, cy - h);
		}
		
		ctx.lineTo(cx + rh0, cy);
		ctx.lineTo(cx - rh0, cy);

		for (var h = 1; h < H; h++) {
			var rh = r(h);
			ctx.lineTo(cx - rh, cy - h);
		}

		ctx.lineTo(cx - rh1, cy - H);

		draw.call(ctx);
		
	}
	
	this.fillHeight = 0;
	
	this.calculateFillHeight = function () {
		var fillHeight = 0;
		
		var vol = 0;
		while (vol < self.volume) {
			vol = self.integrator.integrate(vol, fillHeight, self.funnel.radius, fillHeight + 1);
			fillHeight++;
		}
		
		self.fillHeight = fillHeight;		
	}
	
	this.paintOutflow = function (cx, cy, ctx, r0) {
		if (self.outflowVelocity > 0) {
			ctx.strokeStyle = "none";
			ctx.fillStyle = "blue";
			ctx.fillRect(cx - r0, cy, 2 * r0, self.canvas.height - cy);
		}
	}
	
	this.paint = function () {
		
		self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
		
		var cx = self.canvasWidth / 2;
		var cy = self.canvasHeight / 2 + self.funnel.height() / 2;
			
		self.context.lineWidth = 0;
		self.context.strokeStyle = "none";
		self.context.fillStyle = "blue";
		self.paintFunnel(self.context, cx, cy, self.fillHeight, self.funnel.radius, self.context.fill);

		self.paintOutflow(cx, cy, self.context, self.funnel.radius(0));

		self.context.lineWidth = 2;
		self.context.strokeStyle = "white";
		self.paintFunnel(self.context, cx, cy, self.funnel.height(), self.funnel.radius, self.context.stroke);
		
	};
	
	this.dt = 0.1;

	this.looper = null;
	
	this.outflowVelocity = 0;
	this.formattedOutflowVelocity = ko.observable("0.000 m/s");
	
	this.start = function () {
		self.looper = setInterval(self.play, 1000 * self.dt);
	}
	
	this.stop = function () {
		clearInterval(self.looper);
		self.looper = null;
	}
	
	this.flowOut = function () {
		self.outflowVelocity = Math.sqrt(2*9.81*self.fillHeight) * 0.2;
		self.volume -= Math.min(self.volume, 2 * self.funnel.radius(0) * self.outflowVelocity);
	}
	
	this.playCount = 0;
	
	this.play = function () {
		
		if (self.encodedMessage.length > 0) {
			if (self.encodedMessage[0] == "1") {
				self.tap();
			}
			self.encodedMessage = self.encodedMessage.substr(1);
		}
		
		self.calculateFillHeight();
		self.flowOut();
		self.calculateFillHeight();
		
		self.paint();
		
		if (self.playCount % 2 == 0) {
			self.formattedOutflowVelocity((self.outflowVelocity*5).toFixed(3) + " m/s");
		}
		
		self.playCount++;
	}
	
	this.message = ko.observable("Type something gangsta");
	
	this.encode = function () {
		var enc = "";
		for (var i = 0; i < self.message().length; i++) {
			enc += self.message().charCodeAt(i).toString(2);
		}
		self.encodedMessage = enc;
	}
	
	this.encodedMessage = "";
	
}

$(function () {
	var app = new App();
	app.paint();
	
	ko.applyBindings(app);
	
	app.start();
})


