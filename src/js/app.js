function App() {
	
	var self = this;
	
	this.funnel = new Funnel();
	
	this.canvas = $("#vf").get(0);
	
	this.canvasWidth = self.canvas.width;
	this.canvasHeight = self.canvas.height;
	
	this.context = self.canvas.getContext("2d");
	
	this.paint = function () {
		
		var centerX = self.canvasWidth / 2;
		var centerY = self.canvasHeight / 2;
		
		console.log("center: (" + centerX + ", " + centerY + ")");
		
		self.context.beginPath();
		
		self.context.moveTo(centerX - self.funnel.topPerimeter() / 2, centerY - self.funnel.height() / 2);
		self.context.lineTo(centerX + self.funnel.topPerimeter() / 2, centerY - self.funnel.height() / 2);
		
		for (var h = self.funnel.height() - 1; h > 0; --h) {
			var peri = self.funnel.getVolume(h);
			self.context.lineTo(centerX + peri / 2, centerY + self.funnel.height() / 2 - h);
		}
		
		self.context.lineTo(centerX + self.funnel.bottomPerimeter() / 2, centerY + self.funnel.height() / 2);
		self.context.lineTo(centerX - self.funnel.bottomPerimeter() / 2, centerY + self.funnel.height() / 2);

		for (var h = 1; h < self.funnel.height(); h++) {
			var peri = self.funnel.getVolume(h);
			self.context.lineTo(centerX - peri / 2, centerY + self.funnel.height() / 2 - h);
		}

		self.context.lineTo(centerX - self.funnel.topPerimeter() / 2, centerY - self.funnel.height() / 2);

		self.context.lineWidth = 1;
		self.context.strokeStyle = "white";
		
		self.context.stroke();
				
	};
	
}

$(function () {
	var app = new App();
	app.paint();
})


