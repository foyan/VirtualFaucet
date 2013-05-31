function RungeKuttaIntegrator() {
	
	var self = this;
	
	this.bogackiShampine = function (y0, t0, y, end, h, tol, breakonY) {

		h = h || 0.01;
		tol = tol || 0.00001;

		//console.log("entering bogackiShampine(y0="+ y0 + ", t0="+t0+", end=" + end + ", h=" + h + ", tol=" + tol +", breakonY=" + breakonY +")" );

		var tn = t0;
		var yn = y0;
		var tnm1 = t0;
		var ynm1 = y0;
		var n = 0;
		
		while ((!breakonY && tn < end) || (breakonY && yn < end)) {
			var R = 1.0;
			
			var yn2 = 0;
			var tn2 = 0;
			
			ynm1 = yn;
			tnm1 = tn;
			
			while (R >= tol) {
			
				var k1 = y(tn, yn);
				var k2 = y(tn + 1.0/2.0 * h, yn + 1.0/2.0 * h * k1);
				var k3 = y(tn + 3.0/4.0 * h, yn + 3.0/4.0 * h * k2);
				
				var yn1 = yn + h * (2.0/9.0 * k1 + 1.0/3.0 * k2 + 4.0/9.0 * k3);
				
				var k4 = y(tn + h, yn1);
				
				yn2 = yn + h * (7.0/24.0 * k1 + 1.0/4.0 * k2 + 1.0/3.0 * k3 + 1.0/8.0 * k4);
				
				R = Math.abs(yn1 - yn2) / (tol + tol * yn);
				if (R == 0) {
					R = 0.00000000001;
				}
				
				tn2 = tn + h;
				h = Math.min(5.0, 0.8 * h * Math.pow(tol / R, 1.0/3.0));
				
				n++;
			}
			
			yn = yn2;
			tn = tn2;
		}
		
		//console.log("exiting bogackiShampine(), n="+n);
		var ret = {
			y: yn,
			ym1: ynm1,
			t: tn,
			tm1: tnm1
		};
		
		//console.log(ret);
		
		return ret;
		
	}
	
	this.rungeKutta4 = function (y0, t0, y, tend, factor) {
		
		//console.log("entering rungeKutta4(y0="+ y0 + ", t0="+t0+", tend=" + tend + ", factor=" +factor +")" );

		factor = factor || 0.001;
		var h = (tend - t0) * factor;
		var tn = t0;
		var yn = y0;
		var tnm1 = t0;
		var ynm1 = y0;
		var n = 0;
		var maxN = 1 / factor + 2;
		
		while (Math.abs(tn - tend) > 0.000000001 && n < maxN) {
			tnm1 = tn;
			ynm1 = yn;
			
			var k1 = y(tn, yn);
			var k2 = y(tn + 0.5 * h, yn + 0.5 * h * k1);
			var k3 = y(tn + 0.5 * h, yn + 0.5 * h * k2);
			var k4 = y(tn + h, yn + h * k3);
			
			tn += h;
			yn += 1.0/6.0 * h * (k1 + 2 * k2 + 2 * k3 + k4);
			
			n++;
		}
		
		//console.log("exiting rungeKutta4(), n="+n);

		return {
			y: yn,
			ym1 : ynm1,
			t: tn,
			tm1 : tnm1
		};
		
	}
	
	this.integrate = function (y0, t0, y, tend) {
		var r = self.bogackiShampine(y0, t0, y, tend, 0.01, 0.00001);
		return self.rungeKutta4(r.ym1, r.tm1, y, tend).y;
	}
	
	this.integrateReverse = function (y0, t0, y, yend) {
		var r = self.bogackiShampine(y0, t0, y, yend, 0.01, 0.00001, true);
		
		var t0 = r.tm1;
		var tend = r.t;
		var y0 = r.ym1;
		
		for (var i = 0; i < 5; i++) {
			r2 = self.rungeKutta4(y0, t0, y, tend, 0.5);
			if (r2.ym1 > yend) {
				tend = r2.tm1;
			} else {
				t0 = r2.tm1;
				y0 = r2.ym1;
			}
		}

		return t0;
	}
	
}
