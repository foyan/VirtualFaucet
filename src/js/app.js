function App() {
	
	var self = this;
	
	this.outflowDecoder = null;
	
	this.funnel = new Funnel();
	
	this.canvas = $("#vf").get(0);
	
	this.canvasWidth = self.canvas.width;
	this.canvasHeight = self.canvas.height;
	
	this.context = self.canvas.getContext("2d");
	
	this.volume = 0;
	this.formattedVolume = ko.observable("V = 0.00 m²")
	
	this.integrator = new RungeKuttaIntegrator(); 
	
	this.lastInflow = 0;
	
	this.tap = function() {
		self.volume += 200;
		self.lastInflow = 200;
		self.paint();
	}
	
	this.fullThrottle = ko.observable(false);
	
	this.paintFunnel = function (ctx, cx, cy, H, r, draw) {
		ctx.beginPath();
		
		var rh1 = r(H);
		var rh0 = r(0);
		
		ctx.moveTo(cx - rh1, cy - H);
		ctx.moveTo(cx + rh1, cy - H);
		
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
	
	this.formattedFillHeight = ko.observable("2 * <span style=\"font-size:1.5em\">∫</span><sub>0</sub><sup style=\"margin-left:-7px;\">h(t)</sup>  r(x) dx = V => h = 0.000 m");
	
	this.calculateFillHeight = function () {
		self.fillHeight = self.integrator.integrateReverse(0, 0, self.funnel.radius, self.volume / 2);
	}
	
	this.paintOutflow = function (cx, cy, ctx, r0) {
		if (self.outflowVelocity > 0) {
			ctx.strokeStyle = "none";
			ctx.fillStyle = "blue";
			ctx.fillRect(cx - r0, cy, 2 * r0, self.canvas.height - cy);
		}
	}
	
	this.paintInflow = function (cx, cy, ctx, height) {
		if (self.lastInflow > 0) {
			ctx.strokeStyle = "none";
			ctx.fillStyle = "blue";
			var r = Math.sqrt(self.lastInflow) / 2;

			ctx.fillRect(cx - r - 117, 0, 2 * r, cy - self.funnel.height());
			
			ctx.save();
			self.paintFunnel(ctx, cx, cy, self.funnel.height(), self.funnel.radius, self.context.clip);
			ctx.fillRect(cx - r - 117, 0, 2 * r, cy - height);
			ctx.restore();
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

		self.paintInflow(cx, cy, self.context, self.fillHeight);
		self.paintOutflow(cx, cy, self.context, self.funnel.radius(0));

		self.context.lineWidth = 2;
		self.context.strokeStyle = "white";
		self.paintFunnel(self.context, cx, cy, self.funnel.height(), self.funnel.radius, self.context.stroke);
		
	};
	
	this.dt = 0.2;

	this.looper = null;
	
	this.outflowVelocity = 0;
	this.formattedOutflowVelocity = ko.observable("v(h) = sqrt(2gh) = 0.000 m/s");
	
	this.start = function () {
		self.looper = setInterval(self.play, 500 * self.dt);
	}
	
	this.stop = function () {
		clearInterval(self.looper);
		self.looper = null;
	}
	
	this.flowOut = function () {
		self.outflowVelocity = Math.sqrt(2*9.81*self.fillHeight);
		self.volume -= Math.min(self.volume, 2 * self.funnel.radius(0) * self.outflowVelocity * self.dt);
	}
	
	this.playCount = 0;
	
	this.play = function () {
		
		if (self.encodedMessage.length > 0) {
			if (self.encodedMessage[0] == "1") {
				self.tap();
			}
			self.encodedMessage = self.encodedMessage.substr(1);
		}
		
		if (self.fullThrottle()) {
			self.volume += 200;
			self.lastInflow = 200;
		}
		
		self.calculateFillHeight();
		self.flowOut();
		self.calculateFillHeight();
		
		if (self.playCount % 3 == 0) {
			self.lastInflow = 0;
		}
		
		self.paint();
		
		if (self.playCount % 2 == 0) {
			self.formattedOutflowVelocity("v(h) = sqrt(2gh) = " + (self.outflowVelocity).toFixed(3) + " m/s");
			self.formattedVolume("V = " + self.volume.toFixed(2) + " m²");
			self.formattedFillHeight("2 * <span style=\"font-size:1.5em\">∫</span><sub>0</sub><sup style=\"margin-left:-9px;\">h(t)</sup>  r(x) dx = V => h = " + self.fillHeight.toFixed(3) + " m");
		}
		
		self.outflowDecoder.add(self.playCount, self.outflowVelocity);
				
		if (self.playCount % 5 == 0) {
			self.outflowDecoder.draw();
		}
		
		self.playCount++;
	}
	
	this.message = ko.observable("Fauceteering brings fresh possibilities to espionage communications.");
	
	this.encode = function () {
		var enc = "";
		for (var i = 0; i < self.message().length; i++) {
			var bin = "0000000" + self.message().charCodeAt(i).toString(2);
			enc += bin.substr(bin.length - 8, 8);
		}
		self.encodedMessage = enc;
	}
	
	this.encodedMessage = "";
	
}

$(function () {
	var app = new App();
	app.paint();
	
	var od = new OutflowDecoder(app.dt);
	app.outflowDecoder = od;
	od.init("graph");
	od.funnel = app.funnel;
	
	ko.applyBindings(app);
	
	app.start();
		
});


