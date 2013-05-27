function App() {
	
	var self = this;
	
	this.funnel = new Funnel();
	
	this.canvas = $("#vf").get(0);
	
	this.canvasWidth = self.canvas.width;
	this.canvasHeight = self.canvas.height;
	
	this.context = self.canvas.getContext("2d");
	
	this.volume = 15500;
	
	this.integrator = new RungeKuttaIntegrator();
	
	this.paintBorder = function (ctx, cx, cy, H, r) {
		ctx.beginPath();
		
		var rh1 = r(H);
		var rh0 = r(0);
		
		ctx.moveTo(cx - rh1, cy - H / 2);
		ctx.lineTo(cx + rh1, cy - H / 2);
		
		for (var h = H - 1; h > 0; --h) {
			var rh = r(h);
			ctx.lineTo(cx + rh, cy + H / 2 - h);
		}
		
		ctx.lineTo(cx + rh0, cy + H / 2);
		ctx.lineTo(cx - rh0, cy + H / 2);

		for (var h = 1; h < H; h++) {
			var rh = r(h);
			ctx.lineTo(cx - rh, cy + H / 2 - h);
		}

		ctx.lineTo(cx - rh1, cy - H / 2);

		ctx.lineWidth = 1;
		ctx.strokeStyle = "white";
		ctx.stroke();		
	}

	this.paint = function () {
		
		var cx = self.canvasWidth / 2;
		var cy = self.canvasHeight / 2;
				
		self.paintBorder(self.context, cx, cy, self.funnel.height(), self.funnel.radius);
		
		//var fillHeight = self.integrator.integrate(0, );
		
		//console.log(fillHeight);
		
	};
	
}

$(function () {
	var app = new App();
	app.paint();
})


