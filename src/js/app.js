function App() {
	
	var self = this;
	
	this.funnel = new Funnel();
	
	this.canvas = $("#vf").get(0);
	
	this.canvasWidth = 500;
	this.canvasHeight = 500;
	
	this.context = self.canvas.getContext("2d");
	
	this.paint = function () {
		
		var centerX = self.canvasWidth / 2;
		var centerY = self.canvasHeight / 2;
		
		console.log("center: (" + centerX + ", " + centerY + ")");
		
		
		
	}
	
}

$(function () {
	var app = new App();
	app.paint();
})


