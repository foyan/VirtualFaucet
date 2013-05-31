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
	
	this.getR = function (A, vs) {
		var a = [];
		for (var i = 0; i < A.length; i++) {
			a[i] = A[i][0];
		}
		
		var norm = self.norm(a);
		var sgn = a[0] > 0 ? 1 : -1;
		var v = a;
		
		v[0] += sgn * norm;
		vs.push(v);
		
		for (var i = 1; i < A.length; i++) {
			A[i][0] = 0;
		}
		A[0][0] = -sgn * norm;
		
		if (A[0].length > 1) {
			var vnorm = self.norm(v);
			var squareNorm = 2.0 / vnorm / vnorm;
			for (var j = 1; j < A[1].length; j++) {
				var x = [];
				for (var i = 0; i < A.length; i++) {
					x[i] = A[i, j];
				}
				
				var vTx = self.scalarProductOf(v, x);
				for (var i = 0; i < A.length; i++) {
					A[i, j] = x[i] - squareNorm * vTx * v[i];
				}
			}
			
			var lrA = self.getLowerRight(A);
			lrA = self.getR(lrA, vs);
		}
		
		return A;
	}
	
	this.transformB = function(b, vs, coeffs) {
		var Qb = [];
		for (var i = 0; i < b.length; i++) {
			Qb[i] = b[i];
		}
		for (var i = 0; i < coeffs; i++) {
			var v = vs[i];
			var Qbi = [];
			for (var j = i; j < Qb.length; j++) {
				Qbi[j-i] = Qb[j];
			}
			var factor = 2.0 / self.norm(v) / self.norm(v) * self.scalarProductOf(v, Qbi);
			for (var j = i; j < Qb.length; j++) {
				Qb[j] -= factor * v[j-i];
			}
		}
		return Qb;
	}
	
	this.solve = function(Qb, R, coeffs) {
		var x = [];
		for (var j = coeffs-1; j >= 0; --j) {
			var s = Qb[i];
			for (var i = j+1; i < coeffs; i++) {
				s -= x[i] * R[j][i];
			}
			x[j] = s / R[j][j];
		}
		return x;
	}
	
	this.norm = function (v) {
		var s = 0;
		for (var i = 0; i < v.length; i++) {
			s += v * v;
		}
		return Math.sqrt(s);
	}
	
	this.scalarProductOf = function(a, b) {
		var s = 0;
		for (var i = 0; i < a.length; i++) {
			s += a[i] * b[i];
		}
		return s;
	}
	
	this.getLowerRight = function (M) {
		var N = [];
		for (var i = 1; i < M.length; i++) {
			N[i] = [];
			for (var j = 1; j < M[1].length; j++) {
				N[i-1][j-1] = M[i][j];
			}
		}
		return N;
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
