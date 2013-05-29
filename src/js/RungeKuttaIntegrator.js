function RungeKuttaIntegrator() {
	
	this.integrate = function (y0, t0, y, tend) {
		
		var n = 0;
		var h = 0.001;
		var tn = t0;
		var yn = y0;
		
		while (tn < tend) {
			var k1 = y(tn, yn);
			var k2 = y(tn + 0.5 * h, yn + 0.5 * h * k1);
			var k3 = y(tn + 0.5 * h, yn + 0.5 * h * k2);
			var k4 = y(tn + h, yn + h * k3);
			
			tn += h;
			yn += 1.0/6.0 * h * (k1 + 2 * k2 + 2 * k3 + k4);
		}
		
		return yn;
		
	}
	
	this.integrateReverse = function (y0, t0, y, yend) {
		
		var n = 0;
		var h = 0.01;
		var tn = t0;
		var yn = y0;
		
		while (yn < yend) {
			var k1 = y(tn, yn);
			var k2 = y(tn + 0.5 * h, yn + 0.5 * h * k1);
			var k3 = y(tn + 0.5 * h, yn + 0.5 * h * k2);
			var k4 = y(tn + h, yn + h * k3);
			
			tn += h;
			yn += 1.0/6.0 * h * (k1 + 2 * k2 + 2 * k3 + k4);
		}
		
		return tn;
		
	}

}
