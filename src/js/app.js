function App() {
	
	var self = this;
	
	this.funnel = new Funnel();
	
	this.canvas = $("#vf").get(0);
	
	this.canvasWidth = self.canvas.width;
	this.canvasHeight = self.canvas.height;
	
	this.context = self.canvas.getContext("2d");
	
	this.volume = 65;
	
	this.paintBorder = function (ctx, cx, cy, tp, bp, H, v) {
		ctx.beginPath();
		
		ctx.moveTo(cx - tp / 2, cy - H / 2);
		ctx.lineTo(cx + tp / 2, cy - H / 2);
		
		for (var h = H - 1; h > 0; --h) {
			var peri = v(h);
			ctx.lineTo(cx + peri / 2, cy + H / 2 - h);
		}
		
		ctx.lineTo(cx + bp / 2, cy + H / 2);
		ctx.lineTo(cx - bp / 2, cy + H / 2);

		for (var h = 1; h < H; h++) {
			var peri = v(h);
			ctx.lineTo(cx - peri / 2, cy + H / 2 - h);
		}

		ctx.lineTo(cx - tp / 2, cy - H / 2);

		ctx.lineWidth = 1;
		ctx.strokeStyle = "white";
		ctx.stroke();		
	}

	this.paint = function () {
		
		var centerX = self.canvasWidth / 2;
		var centerY = self.canvasHeight / 2;
				
		self.paintBorder(self.context, centerX, centerY, self.funnel.topPerimeter(), self.funnel.bottomPerimeter(), self.funnel.height(), self.funnel.getVolume);
		
	};
	
}

$(function () {
	var app = new App();
	app.paint();
})


