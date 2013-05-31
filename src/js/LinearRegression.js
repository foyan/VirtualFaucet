function LinearRegression() {
	
	var self = this;
	
	this.calculateFunction = function (u, v, mode) {
		
		var A = mode.getA(u);
		var R = self.getR(A, v);
		var b = mode.getB(v);
		var Qb = self.transformB(b, v, mode.coeffs);
		var x = self.solve(Qb, R, mode.coeffs);
		
		return x;
	}
	
	this.getR = function (A, v) {
		
	}
	
	this.transformB = function(b, v, coeffs) {
		
	}
	
	this.solve = function(Qb, R, coeffs) {
		
	}
	
}

LinearRegression.Polynomial = function (grade) {
	
	return {
		
		getA: function(u) {
			var a = [];
			for (var i = 0; i < u.length; i++) {
				a[i] = [];
				for (var j = 0; j <= grade; j++) {
					a[i][j] = Math.pow(u[i], j);
				}
			}
			return a;
		},
		
		getB: function(v) {
			var b = [];
			for (var i = 0; i < v.length; i++) {
				b[i] = v[i];
			}
			return b;
		},
		
		calculate: function (u, x) {
			var r = 0;
			for (var i = 0; i < u.length; i++) {
				r += Math.pow(u, i);
			}
			return r;
		},
		
		coeffs: grade + 1
		
	};
	
}
