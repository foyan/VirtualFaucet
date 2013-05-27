function Funnel() {
	
	var self = this;
	
	this.topPerimeter = ko.observable(150);
	
	this.bottomPerimeter = ko.observable(10);
	
	this.height = ko.observable(200);
	
	this.volume = function (h, H, A1, A0) {
		return A0 + h / H * (A1 - A0);
	}
	
	this.getVolume = function (h) {
		return self.volume(h, self.height(), self.topPerimeter(), self.bottomPerimeter());
	}
	
}
