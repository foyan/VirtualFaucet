function Funnel() {
	
	var self = this;
	
	this.height = ko.observable(300);
	
	// 200 * 5 = 1000
	// 200 * 145 / 2 = 14500
	// => 15500 * 2 = 31000
	
	this.radius = function (h) {
		if (h <= 1) {
			return 4;
		}
		return 4 + self.r_h()(h-1);
		//return 2 + (h-1)*(h-1)*(h-1) * 0.00004 + (h-1)*(h-1) * 0.0002;
		//return 2 * (h-1) + Math.sin(h-1) * (h-1) * 1;
		//return 2 + Math.sqrt(h-1) * 15;
		//return 2 + (h-1);
	}
	
	//this.rofh = ko.observable("Math.sqrt(h) * 15");
	//this.rofh = ko.observable("(Math.floor(h / 100)) * 100");
	//this.rofh = ko.observable("h < 30 ? 200 : 1");
	this.rofh = ko.observable("h*h*h * 0.0000299 + h*h * 0.0002")
	
	this.r_h = ko.computed(function () {
		var fn = "[function (h) { return " + self.rofh() + ";}][0]";
		return eval(fn);
	});
		
}
