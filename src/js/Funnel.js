function Funnel() {
	
	var self = this;
	
	this.height = ko.observable(200);
	
	// 200 * 5 = 1000
	// 200 * 145 / 2 = 14500
	// => 15500 * 2 = 31000
	
	this.radius = function (h) {
		if (h <= 1) {
			return 2;
		}
		//return 2 + (h-30)*(h-30)*(h-30) * 0.00004 + (h-30)*(h-30) * 0.0002;
		//return 2 * (h-30) + Math.sin(h-30) * (h-30) * 1;
		//return 2 + Math.sqrt(h-1) * 15;
		return 2 + (h-1);
	}
		
}
