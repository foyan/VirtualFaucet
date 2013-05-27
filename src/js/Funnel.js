function Funnel() {
	
	var self = this;
	
	this.height = ko.observable(200);
	
	// 200 * 5 = 1000
	// 200 * 145 / 2 = 14500
	// => 15500 * 2 = 31000
	
	this.radius = function (h) {
		if (h <= 30) {
			return 5;
		}
		return 5 + (h-30) * 0.5;
	}
		
}
