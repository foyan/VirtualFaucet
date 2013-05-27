function Funnel() {
	
	var self = this;
	
	this.topPerimeter = ko.observable(200);
	
	this.bottomPerimeter = ko.observable(10);
	
	this.height = ko.observable(50);
	
	this.border = function (h, tp, bp) {
		return self.bottomPerimeter + h / self.height * (self.topPerimeter - self.bottomPerimeter);
	}
	
}
