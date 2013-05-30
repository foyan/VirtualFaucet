function Funnel() {
	
	var self = this;
	
	this.height = ko.observable(300);
		
	this.radius = function (h) {
		if (h <= 1) {
			return 4;
		}
		return 4 + self.r_h()(h-1);
	}
	
	this.rofh = ko.observable("h*h*h * 0.00002 + h*h * 0.0002");
	
	this.prototypes = [
		"Math.sqrt(h) * 15",
		"(Math.floor(h / 100)) * 100",
		"h < 30 ? 200 : h > 250 ? 200 : 1",
		"h*0.7"
	];
	
	this.r_h = ko.computed(function () {
		var fn = "[function (h) { return " + self.rofh() + ";}][0]";
		return eval(fn);
	});
		
}
