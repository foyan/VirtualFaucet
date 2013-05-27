function App() {
	
	var self = this;
	
	this.funnel = new Funnel();
	
	this.canvas = $("#vf").get(0);
	
	this.canvasWidth = self.canvas.width;
	this.canvasHeight = self.canvas.height;
	
	this.context = self.canvas.getContext("2d");
	
	this.volume = 15500;
	
	this.integrator = new RungeKuttaIntegrator();
	
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
	
	this.paint = function () {
		
		var cx = self.canvasWidth / 2;
		var cy = self.canvasHeight / 2 + self.funnel.height() / 2;
			
		var fillHeight = self.funnel.height() / 2;
		//var fillHeight = self.integrator.integrate(0, );

		self.context.lineWidth = 0;
		self.context.strokeStyle = "none";
		self.context.fillStyle = "blue";
		self.paintFunnel(self.context, cx, cy, fillHeight, self.funnel.radius, self.context.fill);

		self.context.lineWidth = 2;
		self.context.strokeStyle = "white";
		self.paintFunnel(self.context, cx, cy, self.funnel.height(), self.funnel.radius, self.context.stroke);
		
		
		//console.log(fillHeight);
		
	};
	
}

$(function () {
	var app = new App();
	app.paint();
})


