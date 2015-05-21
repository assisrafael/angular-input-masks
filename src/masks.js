/**
 * angular-mask
 * Personalized input masks for AngularJS
 * @version v1.2.3
 * @link http://github.com/assisrafael/angular-input-masks
 * @license MIT
 */
(function (angular) {

var StringMask = (function() {
	var tokens = {
		'0': {pattern: /\d/, default: '0'},
		'9': {pattern: /\d/, optional: true},
		'#': {pattern: /\d/, optional: true, recursive: true},
		'S': {pattern: /[a-zA-Z]/},
		'$': {escape: true}
	};
	var isEscaped = function(pattern, pos) {
		var count = 0;
		var i = pos - 1;
		var token = {escape: true};
		while (i >= 0 && token && token.escape) {
			token = tokens[pattern.charAt(i)];
			count += token && token.escape ? 1 : 0;
			i--;
		}
		return count > 0 && count%2 === 1;
	};
	var calcOptionalNumbersToUse = function(pattern, value) {
		var numbersInP = pattern.replace(/[^0]/g,'').length;
		var numbersInV = value.replace(/[^\d]/g,'').length;
		return numbersInV - numbersInP;
	};
	var concatChar = function(text, character, options) {
		if (options.reverse) return character + text;
		return text + character;
	};
	var hasMoreTokens = function(pattern, pos, inc) {
		var pc = pattern.charAt(pos);
		var token = tokens[pc];
		if (pc === '') return false;
		return token && !token.escape ? true : hasMoreTokens(pattern, pos + inc, inc);
	};
	var insertChar = function(text, char, position) {
		var t = text.split('');
		t.splice(position >= 0 ? position: 0, 0, char);
		return t.join('');
	};
	var StringMask = function(pattern, opt) {
		this.options = opt || {};
		this.options = {
			reverse: this.options.reverse || false,
			usedefaults: this.options.usedefaults || this.options.reverse
		};
		this.pattern = pattern;

		StringMask.prototype.process = function proccess(value) {
			if (!value) return '';
			value = value + '';
			var pattern2 = this.pattern;
			var valid = true;
			var formatted = '';
			var valuePos = this.options.reverse ? value.length - 1 : 0;
			var optionalNumbersToUse = calcOptionalNumbersToUse(pattern2, value);
			var escapeNext = false;
			var recursive = [];
			var inRecursiveMode = false;

			var steps = {
				start: this.options.reverse ? pattern2.length - 1 : 0,
				end: this.options.reverse ? -1 : pattern2.length,
				inc: this.options.reverse ? -1 : 1
			};

			var continueCondition = function(options) {
				if (!inRecursiveMode && hasMoreTokens(pattern2, i, steps.inc)) {
					return true;
				} else if (!inRecursiveMode) {
					inRecursiveMode = recursive.length > 0;
				}

				if (inRecursiveMode) {
					var pc = recursive.shift();
					recursive.push(pc);
					if (options.reverse && valuePos >= 0) {
						i++;
						pattern2 = insertChar(pattern2, pc, i);
						return true;
					} else if (!options.reverse && valuePos < value.length) {
						pattern2 = insertChar(pattern2, pc, i);
						return true;
					}
				}
				return i < pattern2.length && i >= 0;
			};

			for (var i = steps.start; continueCondition(this.options); i = i + steps.inc) {
				var pc = pattern2.charAt(i);
				var vc = value.charAt(valuePos);
				var token = tokens[pc];
				if (!inRecursiveMode || vc) {
					if (this.options.reverse && isEscaped(pattern2, i)) {
						formatted = concatChar(formatted, pc, this.options);
						i = i + steps.inc;
						continue;
					} else if (!this.options.reverse && escapeNext) {
						formatted = concatChar(formatted, pc, this.options);
						escapeNext = false;
						continue;
					} else if (!this.options.reverse && token && token.escape) {
						escapeNext = true;
						continue;
					}
				}

				if (!inRecursiveMode && token && token.recursive) {
					recursive.push(pc);
				} else if (inRecursiveMode && !vc) {
					if (!token || !token.recursive) formatted = concatChar(formatted, pc, this.options);
					continue;
				} else if (recursive.length > 0 && token && !token.recursive) {
					// Recursive tokens most be the last tokens of the pattern
					valid = false;
					continue;
				} else if (!inRecursiveMode && recursive.length > 0 && !vc) {
					continue;
				}

				if (!token) {
					formatted = concatChar(formatted, pc, this.options);
					if (!inRecursiveMode && recursive.length) {
						recursive.push(pc);
					}
				} else if (token.optional) {
					if (token.pattern.test(vc) && optionalNumbersToUse) {
						formatted = concatChar(formatted, vc, this.options);
						valuePos = valuePos + steps.inc;
						optionalNumbersToUse--;
					} else if (recursive.length > 0 && vc) {
						valid = false;
						break;
					}
				} else if (token.pattern.test(vc)) {
					formatted = concatChar(formatted, vc, this.options);
					valuePos = valuePos + steps.inc;
				} else if (!vc && token.default && this.options.usedefaults) {
					formatted = concatChar(formatted, token.default, this.options);
				} else {
					valid = false;
					break;
				}
			}

			return {result: formatted, valid: valid};
		};

		StringMask.prototype.apply = function(value) {
			return this.process(value).result;
		};

		StringMask.prototype.validate = function(value) {
			return this.process(value).valid;
		};
	};

	StringMask.process = function(value, pattern, options) {
		return new StringMask(pattern, options).process(value);
	};

	StringMask.apply = function(value, pattern, options) {
		return new StringMask(pattern, options).apply(value);
	};

	StringMask.validate = function(value, pattern, options) {
		return new StringMask(pattern, options).validate(value);
	};

	return StringMask;
}());

/** Used to determine if values are of the language type Object */
var objectTypes = {
	'boolean': false,
	'function': true,
	'object': true,
	'number': false,
	'string': false,
	'undefined': false
};

if (objectTypes[typeof module]) {
	module.exports = StringMask;
}

/**
 * br-validations
 * A library of validations applicable to several Brazilian data like I.E., CNPJ, CPF and others
 * @version v0.2.1
 * @link http://github.com/the-darc/br-validations
 * @license MIT
 */
(function () {
  var root = this;
var CNPJ = {};

CNPJ.validate = function(c) {
	var b = [6,5,4,3,2,9,8,7,6,5,4,3,2];
	c = c.replace(/[^\d]/g,'').split('');
	if(c.length !== 14) {
		return false;
	}

	for (var i = 0, n = 0; i < 12; i++) {
		n += c[i] * b[i+1];
	}
	n = 11 - n%11;
	n = n >= 10 ? 0 : n;
	if (parseInt(c[12]) !== n)  {
		return false;
	}

	for (i = 0, n = 0; i <= 12; i++) {
		n += c[i] * b[i];
	}
	n = 11 - n%11;
	n = n >= 10 ? 0 : n;
	if (parseInt(c[13]) !== n)  {
		return false;
	}
	return true;
};


var CPF = {};

CPF.validate = function(cpf) {
	cpf = cpf.replace(/[^\d]+/g,'');
	if (cpf === '' || cpf === '00000000000' || cpf.length !== 11) {
		return false;
	}
	function validateDigit(digit) {
		var add = 0;
		var init = digit - 9;
		for (var i = 0; i < 9; i ++) {
			add += parseInt(cpf.charAt(i + init)) * (i+1);
		}
		return (add%11)%10 === parseInt(cpf.charAt(digit));
	}
	return validateDigit(9) && validateDigit(10);
};

var IE = function(uf) {
	if (!(this instanceof IE)) {
		return new IE(uf);
	}

	this.rules = IErules[uf] || [];
	this.rule;
	IE.prototype._defineRule = function(value) {
		this.rule = undefined;
		for (var r = 0; r < this.rules.length && this.rule === undefined; r++) {
			var str = value.replace(/[^\d]/g,'');
			var ruleCandidate = this.rules[r];
			if (str.length === ruleCandidate.chars && (!ruleCandidate.match || ruleCandidate.match.test(value))) {
				this.rule = ruleCandidate;
			}
		}
		return !!this.rule;
	};

	IE.prototype.validate = function(value) {
		if (!value || !this._defineRule(value)) {
			return false;
		}
		return this.rule.validate(value);
	};
};

var IErules = {};

var algorithmSteps = {
	handleStr: {
		onlyNumbers: function(str) {
			return str.replace(/[^\d]/g,'').split('');
		},
		mgSpec: function(str) {
			var s = str.replace(/[^\d]/g,'');
			s = s.substr(0,3)+'0'+s.substr(3, s.length);
			return s.split('');
		}
	},
	sum: {
		normalSum: function(handledStr, pesos) {
			var nums = handledStr;
			var sum = 0;
			for (var i = 0; i < pesos.length; i++) {
				sum += parseInt(nums[i]) * pesos[i];
			}
			return sum;
		},
		individualSum: function(handledStr, pesos) {
			var nums = handledStr;
			var sum = 0;
			for (var i = 0; i < pesos.length; i++) {
				var mult = parseInt(nums[i]) * pesos[i];
				sum += mult%10 + parseInt(mult/10);
			}
			return sum;
		},
		apSpec: function(handledStr, pesos) {
			var sum = this.normalSum(handledStr, pesos);
			var ref = handledStr.join('');
			if (ref >= '030000010' && ref <= '030170009') {
				return sum + 5;
			}
			if (ref >= '030170010' && ref <= '030190229') {
				return sum + 9;
			}
			return sum;
		}
	},
	rest: {
		mod11: function(sum) {
			return sum%11;
		},
		mod10: function(sum) {
			return sum%10;
		},
		mod9: function(sum) {
			return sum%9;
		}
	},
	expectedDV: {
		minusRestOf11: function(rest) {
			return rest < 2 ? 0 : 11 - rest;
		},
		minusRestOf11v2: function(rest) {
			return rest < 2 ? 11 - rest - 10 : 11 - rest;
		},
		minusRestOf10: function(rest) {
			return rest < 1 ? 0 : 10 - rest;
		},
		mod10: function(rest) {
			return rest%10;
		},
		goSpec: function(rest, handledStr) {
			var ref = handledStr.join('');
			if (rest === 1) {
				return ref >= '101031050' && ref <= '101199979' ? 1 : 0;
			}
			return rest === 0 ? 0 : 11 - rest;
		},
		apSpec: function(rest, handledStr) {
			var ref = handledStr.join('');
			if (rest === 0) {
				return ref >= '030170010' && ref <= '030190229' ? 1 : 0;
			}
			return rest === 1 ? 0 : 11 - rest;
		},
		voidFn: function(rest) {
			return rest;
		}
	}
};


/**
 * options {
 *     pesos: Array of values used to operate in sum step
 *     dvPos: Position of the DV to validate considering the handledStr
 *     algorithmSteps: The four DV's validation algorithm steps names
 * }
 */
function validateDV(value, options) {
	var steps = options.algorithmSteps;

	// Step 01: Handle String
	var handledStr = algorithmSteps.handleStr[steps[0]](value);

	// Step 02: Sum chars
	var sum = algorithmSteps.sum[steps[1]](handledStr, options.pesos);

	// Step 03: Rest calculation
	var rest = algorithmSteps.rest[steps[2]](sum);

	// Fixed Step: Get current DV
	var currentDV = parseInt(handledStr[options.dvpos]);

	// Step 04: Expected DV calculation
	var expectedDV = algorithmSteps.expectedDV[steps[3]](rest, handledStr);

	// Fixed step: DV verification
	return currentDV === expectedDV;
}

function validateIE(value, rule) {
	if (rule.match && !rule.match.test(value)) {
		return false;
	}
	for (var i = 0; i < rule.dvs.length; i++) {

		if (!validateDV(value, rule.dvs[i])) {
			return false;
		}
	}
	return true;
}

IErules.PE = [{
	//mask: new StringMask('0000000-00'),
	chars: 9,
	dvs: [{
		dvpos: 7,
		pesos: [8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	},{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
},{
	// mask: new StringMask('00.0.000.0000000-0'),
	chars: 14,
	pesos: [[1,2,3,4,5,9,8,7,6,5,4,3,2]],
	dvs: [{
		dvpos: 13,
		pesos: [5,4,3,2,1,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11v2']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.RS = [{
	// mask: new StringMask('000/0000000'),
	chars: 10,
	dvs: [{
		dvpos: 9,
		pesos: [2,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.AC = [{
	// mask: new StringMask('00.000.000/000-00'),
	chars: 13,
	match: /^01/,
	dvs: [{
		dvpos: 11,
		pesos: [4,3,2,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	},{
		dvpos: 12,
		pesos: [5,4,3,2,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.MG = [{
	// mask: new StringMask('000.000.000/0000'),
	chars: 13,
	dvs: [{
		dvpos: 12,
		pesos: [1,2,1,2,1,2,1,2,1,2,1,2],
		algorithmSteps: ['mgSpec', 'individualSum', 'mod10', 'minusRestOf10']
	},{
		dvpos: 12,
		pesos: [3,2,11,10,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.SP = [{
	// mask: new StringMask('000.000.000.000'),
	chars: 12,
	match: /^[0-9]/,
	dvs: [{
		dvpos: 8,
		pesos: [1,3,4,5,6,7,8,10],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'mod10']
	},{
		dvpos: 11,
		pesos: [3,2,10,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'mod10']
	}],
	validate: function(value) { return validateIE(value, this); }
},{
	// mask: new StringMask('P-00000000.0/000')
	chars: 12,
	match: /^P/i,
	dvs: [{
		dvpos: 8,
		pesos: [1,3,4,5,6,7,8,10],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'mod10']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.DF = [{
	// mask: new StringMask('00000000000-00'),
	chars: 13,
	dvs: [{
		dvpos: 11,
		pesos: [4,3,2,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	},{
		dvpos: 12,
		pesos: [5,4,3,2,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.ES = [{
	// mask: new StringMask('000.000.00-0')
	chars: 9,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.BA = [{
	// mask: new StringMask('000000-00')
	chars: 8,
	match: /^[0123458]/,
	dvs: [{
		dvpos: 7,
		pesos: [7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod10', 'minusRestOf10']
	},{
		dvpos: 6,
		pesos: [8,7,6,5,4,3,0,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod10', 'minusRestOf10']
	}],
	validate: function(value) { return validateIE(value, this); }
},{
	chars: 8,
	match: /^[679]/,
	dvs: [{
		dvpos: 7,
		pesos: [7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	},{
		dvpos: 6,
		pesos: [8,7,6,5,4,3,0,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
},{
	// mask: new StringMask('0000000-00')
	chars: 9,
	match: /^[0-9][0123458]/,
	dvs: [{
		dvpos: 8,
		pesos: [8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod10', 'minusRestOf10']
	},{
		dvpos: 7,
		pesos: [9,8,7,6,5,4,3,0,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod10', 'minusRestOf10']
	}],
	validate: function(value) { return validateIE(value, this); }
},{
	chars: 9,
	match: /^[0-9][679]/,
	dvs: [{
		dvpos: 8,
		pesos: [8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	},{
		dvpos: 7,
		pesos: [9,8,7,6,5,4,3,0,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.AM = [{
	//mask: new StringMask('00.000.000-0')
	chars: 9,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.RN = [{
	// {mask: new StringMask('00.000.000-0')
	chars: 9,
	match: /^20/,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
},{
	// {mask: new StringMask('00.0.000.000-0'), chars: 10}
	chars: 10,
	match: /^20/,
	dvs: [{
		dvpos: 8,
		pesos: [10,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.RO = [{
	// mask: new StringMask('0000000000000-0')
	chars: 14,
	dvs: [{
		dvpos: 13,
		pesos: [6,5,4,3,2,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.PR = [{
	// mask: new StringMask('00000000-00')
	chars: 10,
	dvs: [{
		dvpos: 8,
		pesos: [3,2,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	},{
		dvpos: 9,
		pesos: [4,3,2,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.SC = [{
	// {mask: new StringMask('000.000.000'), uf: 'SANTA CATARINA'}
	chars: 9,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.RJ = [{
	// {mask: new StringMask('00.000.00-0'), uf: 'RIO DE JANEIRO'}
	chars: 8,
	dvs: [{
		dvpos: 7,
		pesos: [2,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.PA = [{
	// {mask: new StringMask('00-000000-0')
	chars: 9,
	match: /^15/,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.SE = [{
	// {mask: new StringMask('00000000-0')
	chars: 9,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.PB = [{
	// {mask: new StringMask('00000000-0')
	chars: 9,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.CE = [{
	// {mask: new StringMask('00000000-0')
	chars: 9,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.PI = [{
	// {mask: new StringMask('000000000')
	chars: 9,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.MA = [{
	// {mask: new StringMask('000000000')
	chars: 9,
	match: /^12/,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.MT = [{
	// {mask: new StringMask('0000000000-0')
	chars: 11,
	dvs: [{
		dvpos: 10,
		pesos: [3,2,9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.MS = [{
	// {mask: new StringMask('000000000')
	chars: 9,
	match: /^28/,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.TO = [{
	// {mask: new StringMask('00000000000'),
	chars: 11,
	match: /^[0-9]{2}((0[123])|(99))/,
	dvs: [{
		dvpos: 10,
		pesos: [9,8,0,0,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.AL = [{
	// {mask: new StringMask('000000000')
	chars: 9,
	match: /^24[03578]/,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'minusRestOf11']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.RR = [{
	// {mask: new StringMask('00000000-0')
	chars: 9,
	match: /^24/,
	dvs: [{
		dvpos: 8,
		pesos: [1,2,3,4,5,6,7,8],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod9', 'voidFn']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.GO = [{
	// {mask: new StringMask('00.000.000-0')
	chars: 9,
	match: /^1[015]/,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'normalSum', 'mod11', 'goSpec']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

IErules.AP = [{
	// {mask: new StringMask('000000000')
	chars: 9,
	match: /^03/,
	dvs: [{
		dvpos: 8,
		pesos: [9,8,7,6,5,4,3,2],
		algorithmSteps: ['onlyNumbers', 'apSpec', 'mod11', 'apSpec']
	}],
	validate: function(value) { return validateIE(value, this); }
}];

var BrV = {
   ie: IE,
   cpf: CPF,
   cnpj: CNPJ
};
var objectTypes = {
	'function': true,
	'object': true
};
if (objectTypes[typeof module]) {
	module.exports = BrV;
} else {
	root.BrV = BrV;
}
}.call(this));
(function() {
	'use strict';

	function maxValidator(ctrl, value, limit) {
		var max = parseFloat(limit);
		var validity = ctrl.$isEmpty(value) || isNaN(max)|| value <= max;
		ctrl.$setValidity('max', validity);
		return value;
	}

	function minValidator(ctrl, value, limit) {
		var min = parseFloat(limit);
		var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
		ctrl.$setValidity('min', validity);
		return value;
	}

	var plBankAccountNoPattern = new StringMask('00 0000 0000 0000 0000 0000 0000');
	var plIdNoPattern = new StringMask('SSS 000000');
	var plPassportNoPattern = new StringMask('SS 0000000');
	var plMedicalNoPattern = new StringMask('0000000');
	var plPeselPattern = new StringMask('00000000000');
	var plNipPattern = new StringMask('000-00-00-000');
	var plRegonPattern = new StringMask('0000000000000');
	var plPostalCodePattern = new StringMask('00-000');
	var cnpjPattern = new StringMask('00.000.000\/0000-00');
	var cpfPattern = new StringMask('000.000.000-00');

	function numberViewMask (decimals, decimalDelimiter, thousandsDelimiter) {
		var mask = '#' + thousandsDelimiter + '##0';

		if(decimals > 0) {
			mask += decimalDelimiter;
			for (var i = 0; i < decimals; i++) {
				mask += '0';
			}
		}

		return new StringMask(mask, {
			reverse:true
		});
	}

	function numberModelMask (decimals) {
		var mask = '###0';

		if(decimals > 0) {
			mask += '.';
			for (var i = 0; i < decimals; i++) {
				mask += '0';
			}
		}

		return new StringMask(mask, {
			reverse:true
		});
	}

	function clearDelimitersAndLeadingZeros (value) {
		var cleanValue = value.replace(/^0*/, '');
		cleanValue = cleanValue.replace(/[^0-9]/g, '');
		return cleanValue;
	}

	function preparePercentageToFormatter (value, decimals) {
		return clearDelimitersAndLeadingZeros((parseFloat(value)*100).toFixed(decimals));
	}

	function prepareNumberToFormatter (value, decimals) {
		return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
	}

	function validateBrPhoneNumber (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || value.length === 10 || value.length === 11;
		ctrl.$setValidity('br-phone-number', valid);
		return value;
	}

	function validateCPF (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || BrV.cpf.validate(value);
		ctrl.$setValidity('cpf', valid);
		return value;
	}

	function validateCNPJ (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || BrV.cnpj.validate(value);
		ctrl.$setValidity('cnpj', valid);
		return value;
	}

	function validateCPForCNPJ (ctrl, value) {
		if(!value || value.length <= 11) {
			validateCNPJ(ctrl, '');
			return validateCPF(ctrl, value);
		}else {
			validateCPF(ctrl, '');
			return validateCNPJ(ctrl, value);
		}
	}

	function uiBrCpfMask() {
		function applyCpfMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue = cpfPattern.apply(value);
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCpfMask(validateCPF(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]/g,'');
					var formatedValue = applyCpfMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCPF(ctrl, value);
				});
			}
		};
	}

	function uiBrCnpjMask() {
		function applyCnpjMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue = cnpjPattern.apply(value);
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCnpjMask(validateCNPJ(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = applyCnpjMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCNPJ(ctrl, value);
				});
			}
		};
	}
	function convertToWeight(letter) {
		var weights = [
			{value: 'A', weight: 10},
			{value: 'B', weight: 11},
			{value: 'C', weight: 12},
			{value: 'D', weight: 13},
			{value: 'E', weight: 14},
			{value: 'F', weight: 15},
			{value: 'G', weight: 16},
			{value: 'H', weight: 17},
			{value: 'I', weight: 18},
			{value: 'J', weight: 19},
			{value: 'K', weight: 20},
			{value: 'L', weight: 21},
			{value: 'M', weight: 22},
			{value: 'N', weight: 23},
			{value: 'O', weight: 24},
			{value: 'P', weight: 25},
			{value: 'Q', weight: 26},
			{value: 'R', weight: 27},
			{value: 'S', weight: 28},
			{value: 'T', weight: 29},
			{value: 'U', weight: 30},
			{value: 'V', weight: 31},
			{value: 'W', weight: 32},
			{value: 'X', weight: 33},
			{value: 'Y', weight: 34},
			{value: 'Z', weight: 35}
			];

		for (var i in weights){
			if(letter.toUpperCase() === weights[i].value)
				return weights[i].weight;
		}
	}

	// function checkBank(bankId){
	// 	var message = 'Nie wykryto banku';
	// 	var banks = [
	// 		{code: '1010', name: 'Narodowy Bank Polski'},
	// 		{code: '1020', name: 'PKO BP'},
	// 		{code: '1030', name: 'Citybank Handlowy'},
	// 		{code: '1050', name: 'ING'},
	// 		{code: '1060', name: 'BPH'},
	// 		{code: '1090', name: 'BZ WBK'},
	// 		{code: '1130', name: 'BGK'},
	// 		{code: '1140', name: 'mBank'},
	// 		{code: '1160', name: 'Bank Millennium'},
	// 		{code: '1240', name: 'Pekao'},
	// 		{code: '1280', name: 'HSBC'},
	// 		{code: '1300', name: 'Meritum Bank'},
	// 		{code: '1320', name: 'Bank Pocztowy'},
	// 		{code: '1440', name: 'Nordea Bank'},
	// 		{code: '1470', name: 'Euro Bank'},
	// 		{code: '1540', name: 'BOŚ'},
	// 		{code: '1580', name: 'Mercedes-Benz Bank Polska'},
	// 		{code: '1600', name: 'BNP Paribas Fortis'},
	// 		{code: '1610', name: 'SGB - Bank'},
	// 		{code: '1670', name: 'RBS Bank (Polska)'},
	// 		{code: '1680', name: 'Plus Bank'},
	// 		{code: '1750', name: 'Raiffeisen Bank'},
	// 		{code: '1840', name: 'Societe Generale'},
	// 		{code: '1870', name: 'FM Bank PBP'},
	// 		{code: '1910', name: 'Deutsche Bank Polska'},
	// 		{code: '1930', name: 'Bank Polskiej Spółdzielczości'},
	// 		{code: '1940', name: 'Credit Agricole Bank Polska'},
	// 		{code: '1950', name: 'Idea Bank'},
	// 		{code: '2000', name: 'Rabobank Polska'},
	// 		{code: '2030', name: 'BGŻ'},
	// 		{code: '2070', name: 'FCE Bank Polska'},
	// 		{code: '2120', name: 'Santander Consumer Bank'},
	// 		{code: '2130', name: 'Volkswagen Bank'},
	// 		{code: '2140', name: 'Fiat Bank Polska'},
	// 		{code: '2160', name: 'Toyota Bank'},
	// 		{code: '2190', name: 'DnB Nord'},
	// 		{code: '2480', name: 'Getin Noble Bank'},
	// 		{code: '2490', name: 'Alior Bank'}
	// 		];

	// 	for (var i in banks)
	// 		if (banks[i].code.toString() === bankId.toString())
	// 			message = banks[i].name;

	// 	return message;
	// }

	function uiPlBankAccountNoMask() {
		function applyPlBankAccountNoMask (value) {
			if(!value) {
				return value;
			}
			return plBankAccountNoPattern.apply(value).toUpperCase().replace(/[^\d]$/, '') ;
		}
		return {
			restrict: 'A',
			require: '^ngModel',
			link: function (scope, element, attrs, ctrl) {


				var weights = [
					1, 10, 3, 30, 9, 90, 27, 76, 81, 34, 49,
					5, 50, 15, 53, 45, 62, 38, 89, 17, 73, 51,
					25, 56, 75, 71, 31, 19, 93, 57
				];

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}
					var actualValue =  value.replace(/[^\d]/g, '');
					if (actualValue.length > 26)
						actualValue = actualValue.replace(/[\d]$/, '');
					var formatedValue = applyPlBankAccountNoMask(actualValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					return actualValue;
				});

				ctrl.$formatters.push(applyPlBankAccountNoMask);

				ctrl.$validators.uiPlBankAccountNo = function(value) {
					var valid = false;
					if (value && value.length === 26) {
						var tempValue = value;
						// var bankName = checkBank(tempValue.substr(2,4));
						tempValue = tempValue + '2521';
        		tempValue = tempValue.substr(2) + tempValue.substr(0, 2);
        		var controlSum = 0;
        		for (var i = 0; i < 30; i++) {
            	controlSum += tempValue[29 - i] * weights[i];
        		}
        		if (controlSum % 97 === 1)
	  	      	valid = true;
					}
					return valid;
				};
			}
		};
	}


	function uiPlPassportNoMask() {
		function applyPlPassportNoMask (value) {
			if(!value) {
				return value;
			}
			return plPassportNoPattern.apply(value).toUpperCase().replace(/[^\da-zA-Z]$/, '');
		}
		return {
			restrict: 'A',
			require: '^ngModel',
			link: function (scope, element, attrs, ctrl) {

        var writeToModelPrematurely = false;

        if (attrs['ui-pl-passport-no-mask']) {
          if (attrs['ui-pl-passport-no-mask'].val() === 't') {
            writeToModelPrematurely = true;
          }
        }

        ctrl.$formatters.push(applyPlPassportNoMask);

				ctrl.$validators.uiPlPassportNo = function(value) {
 					if (writeToModelPrematurely)
            ctrl.$modelValue = value;

					var valid = false;
					if (value) {
						if (value.length === 9) {
							var digs = (''+value).split('');
	        		var controlSum = (
	        			convertToWeight(digs[0].toString()) * 7 +
	        			convertToWeight(digs[1].toString()) * 3 +
	        			digs[2] * 9 +
	        			digs[3] * 1 +
	        			digs[4] *7 +
	        			digs[5] *3 +
	        			digs[6] *1 +
	        			digs[7] *7 +
	        			digs[8] * 3
	        		) % 10;

		        	if (controlSum === 0)
		  	      	valid = true;
		  	    }
					}
					// ctrl.$setValidity('pl-passport-no', valid);
					// 	return value;
					return valid;
				};

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualValue =  value.replace(/[^\da-zA-Z]/, '');
					if (actualValue.length > 9)
						actualValue = actualValue.replace(/[\da-zA-Z]$/, '');
					var formatedValue = applyPlPassportNoMask(actualValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					return actualValue;
				});

			}
		};
	}
	function uiPlIdNoMask() {
		function applyPlIdNoMask (value) {
			if(!value) {
				return value;
			}
			return plIdNoPattern.apply(value).toUpperCase().replace(/[^\da-zA-Z]$/, '');
		}
		return {
			restrict: 'A',
			require: '^ngModel',
			link: function (scope, element, attrs, ctrl) {

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualValue =  value.replace(/[^\da-zA-Z]/, '');
					if (actualValue.length > 9)
						actualValue = actualValue.replace(/[\da-zA-Z]$/, '');

					var formatedValue = applyPlIdNoMask(actualValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					return actualValue;
				});

				ctrl.$formatters.push(applyPlIdNoMask);

				ctrl.$validators.uiPlIdNo = function(value){
					var valid = false;
					if (value.length === 9) {
						var digs = (''+value).split('');
        		var controlSum = (
        			convertToWeight(digs[0].toString()) * 7 +
        			convertToWeight(digs[1].toString()) * 3 +
        			convertToWeight(digs[2].toString()) * 1 +
        			digs[4] * 7 +
        			digs[5] * 3 +
        			digs[6] * 1 +
        			digs[7] * 7 +
        			digs[8] * 3
        		) % 10;

	        	if (parseInt(digs[3]) === controlSum)
	  	      	valid = true;
					}
					return valid;
				};
			}
		};
	}

	function uiPlPostalCodeMask() {
		function applyPlPostalCodeMask (value) {
			if(!value) {
				return value;
			}
			return plPostalCodePattern.apply(value).replace(/[^\d]$/, '');
		}

		return {
			restrict: 'A',
			require: '^ngModel',
			link: function (scope, element, attrs, ctrl) {

				var writeToModelPrematurely = false;

				if (attrs.uiPlPostalCodeMask === 't') {
					writeToModelPrematurely = true;
				}

				ctrl.$formatters.push(applyPlPostalCodeMask);

				ctrl.$validators.uiPlPostalCode = function(modelValue) {
					if (writeToModelPrematurely)
						ctrl.$modelValue = modelValue;
					return !modelValue || modelValue.length === 5;
				};

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualValue = value.replace(/[^\d]/g, '');
					if (actualValue.length > 5)
						actualValue = actualValue.replace(/[\d]$/, '');
					var formatedValue = applyPlPostalCodeMask(actualValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					return actualValue;
				});

			}
		};
	}
	function uiPlPeselMask() {
		function applyPlPeselMask (value) {
			if(!value) {
				return value;
			}

			return plPeselPattern.apply(value);
		}

		return {
			restrict: 'A',
			require: '^ngModel',
			link: function (scope, element, attrs, ctrl) {

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualValue = value.replace(/[^\d]/g, '');
					if (actualValue.length > 11)
						actualValue = actualValue.replace(/[\d]$/, '');
					var formatedValue = applyPlPeselMask(actualValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					return actualValue;
				});

				ctrl.$formatters.push(applyPlPeselMask);
				ctrl.$validators.uiPlPostalCode = function(value) {
					var valid = false;

					if (value && value.length === 11) {
						var dig = (''+value).split('');
        		var controlSum = (
        			1 * parseInt(dig[0]) +
        			3 * parseInt(dig[1]) +
        			7 * parseInt(dig[2]) +
        			9 * parseInt(dig[3]) +
        			1 * parseInt(dig[4]) +
        			3 * parseInt(dig[5]) +
        			7 * parseInt(dig[6]) +
        			9 * parseInt(dig[7]) +
        			1 * parseInt(dig[8]) +
        			3 * parseInt(dig[9])
        		) % 10;

	        if (controlSum === 0) controlSum = 10;
		        controlSum = 10 - controlSum;

	        if (parseInt(dig[10]) === controlSum)
	  	      valid = true;
					}
					return valid;
				};
			}
		};
	}
	function uiPlNipMask() {
		function applyPlNipMask (value) {
			if(!value) {
				return value;
			}

			var formatedValue = plNipPattern.apply(value);
			return formatedValue.replace(/[^\d]$/, '');
		}

		return {
			restrict: 'A',
			require: '^ngModel',
			link: function (scope, element, attrs, ctrl) {

				ctrl.$formatters.push(applyPlNipMask);

				ctrl.$validators.uiPlNip = function (modelValue) {
					var valid = false;
					if (modelValue && modelValue.length === 10) {
						var dig = (''+modelValue).split('');
						var controlSum = (
							6 * parseInt(dig[0]) +
							5 * parseInt(dig[1]) +
							7 * parseInt(dig[2]) +
							2 * parseInt(dig[3]) +
							3 * parseInt(dig[4]) +
							4 * parseInt(dig[5]) +
							5 * parseInt(dig[6]) +
							6 * parseInt(dig[7]) +
							7 * parseInt(dig[8])
						) % 11;

						if (parseInt(dig[9]) === controlSum)
  	      		valid = true;
					}
					return valid;
				};

				function parse(value) {
					if (!value)
						return value;
					else {
						var parsedValue = value.replace(/[^\d]/g, '').substring(0,10);
						ctrl.$setViewValue(applyPlNipMask(parsedValue));
						ctrl.$render();
						return parsedValue;
					}
				}

				ctrl.$parsers.push(parse);
			}
		};
	}
	function uiPlRegonMask() {
		function applyPlRegonMask (value) {
			if(!value) {
				return value;
			}
			return plRegonPattern.apply(value);
		}

		return {
			restrict: 'A',
			require: '^ngModel',
			link: function (scope, element, attrs, ctrl) {

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualValue = value.replace(/[^\d]/g, '');
					if (actualValue.length > 9)
						actualValue = actualValue.replace(/[\d]$/, '');
					var formatedValue = applyPlRegonMask(actualValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					return actualValue;
				});

				ctrl.$formatters.push(applyPlRegonMask);

				ctrl.$validators.uiPlRegon = function(value) {
					var valid = false;
					var dig = null;
					var controlSum = null;
					if (value && value.length === 9) {
						dig = (''+value).split('');
						controlSum = (
							8 * parseInt(dig[0]) +
							9 * parseInt(dig[1]) +
							2 * parseInt(dig[2]) +
							3 * parseInt(dig[3]) +
							4 * parseInt(dig[4]) +
							5 * parseInt(dig[5]) +
							6 * parseInt(dig[6]) +
							7 * parseInt(dig[7])
						) % 11;

						if (controlSum === 10)
							controlSum = 0;

						if (parseInt(dig[8]) === controlSum)
							valid = true;
					}
					// this part doesn't work
					else if (value && value.length === 14) {
						dig = (''+value).split('');
						controlSum = (
							2 * parseInt(dig[0]) +
							4 * parseInt(dig[1]) +
							8 * parseInt(dig[2]) +
							5 * parseInt(dig[3]) +
							0 * parseInt(dig[4]) +
							9 * parseInt(dig[5]) +
							7 * parseInt(dig[6]) +
							3 * parseInt(dig[7]) +
							6 * parseInt(dig[8]) +
							1 * parseInt(dig[9]) +
							2 * parseInt(dig[10]) +
							4 * parseInt(dig[11]) +
							8 * parseInt(dig[12])
						) % 11;

						if (controlSum === 10)
							controlSum = 0;

						if (parseInt(dig[13]) === controlSum)
							valid = true;
					}
					return valid;
				};
			}
		};
	}
	function uiPlMedicalNoMask() {
		function applyPlMedicalNoMask (value) {
			if(!value) {
				return value;
			}
			return plMedicalNoPattern.apply(value);
		}

		return {
			restrict: 'A',
			require: '^ngModel',
			link: function (scope, element, attrs, ctrl) {

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return '';
					}

					var actualValue = value.replace(/[^\d]/g, '');
					if (actualValue.length > 7)
						actualValue = actualValue.replace(/[\d]$/, '');
					var formatedValue = applyPlMedicalNoMask(actualValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					return actualValue;
				});
				ctrl.$formatters.push(applyPlMedicalNoMask);

				ctrl.$validators.uiPlMedicalNo = function(value) {
					var valid = false;
					if (value){
						var dig = (''+value).split('');
						if ((value.length === 7) && (parseInt(dig[0]) !== 0)) {
	        		var controlSum = (
	        			1 * parseInt(dig[1]) +
	        			2 * parseInt(dig[2]) +
	        			3 * parseInt(dig[3]) +
	        			4 * parseInt(dig[4]) +
	        			5 * parseInt(dig[5]) +
	        			6 * parseInt(dig[6])
	        		) % 11;

	        	if (parseInt(dig[0]) === controlSum)
	  	      	valid = true;
	  	    	}
					}
					return valid;
				};
			}
		};
	}
	function uiBrCpfCnpjMask() {
		function applyCpfCnpjMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue;
			if (value.length > 11) {
				formatedValue = cnpjPattern.apply(value);
			} else {
				formatedValue = cpfPattern.apply(value);
			}
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCpfCnpjMask(validateCPForCNPJ(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = applyCpfCnpjMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCPForCNPJ(ctrl, value);
				});
			}
		};
	}

	angular.module('ui.utils.masks', [])
	.directive('uiPercentageMask', ['$locale', '$parse', function ($locale, $parse) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					decimals = parseInt(attrs.uiPercentageMask);

				if (!ctrl) {
					return;
				}

				if (angular.isDefined(attrs.uiHideGroupSep)){
					thousandsDelimiter = '';
				}

				if(isNaN(decimals)) {
					decimals = 2;
				}
				var numberDecimals = decimals + 2;
				var viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = numberModelMask(numberDecimals);

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = preparePercentageToFormatter(value, decimals);
					return viewMask.apply(valueToFormat) + ' %';
				});

				function parse(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = clearDelimitersAndLeadingZeros(value) || '0';
					if(value.length > 1 && value.indexOf('%') === -1) {
						valueToFormat = valueToFormat.slice(0,valueToFormat.length-1);
					}
					var formatedValue = viewMask.apply(valueToFormat) + ' %';
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				ctrl.$parsers.push(parse);

				if (attrs.uiPercentageMask) {
					scope.$watch(attrs.uiPercentageMask, function(decimals) {
						if(isNaN(decimals)) {
							decimals = 2;
						}
						numberDecimals = decimals + 2;
						viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = numberModelMask(numberDecimals);

						parse(ctrl.$viewValue || '');
					});
				}

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						var min = $parse(attrs.min)(scope);
						return minValidator(ctrl, value, min);
					});

					scope.$watch('min', function(value) {
						minValidator(ctrl, ctrl.$modelValue, value);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						var max = $parse(attrs.max)(scope);
						return maxValidator(ctrl, value, max);
					});

					scope.$watch('max', function(value) {
						maxValidator(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}])
	.directive('uiNumberMask', ['$locale', '$parse', function ($locale, $parse) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					decimals = $parse(attrs.uiNumberMask)(scope);

				if (!ctrl) {
					return;
				}

				if (angular.isDefined(attrs.uiHideGroupSep)){
					thousandsDelimiter = '';
				}

				if(isNaN(decimals)) {
					decimals = 2;
				}
				var viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = numberModelMask(decimals);

				function parse(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = clearDelimitersAndLeadingZeros(value) || '0';
					var formatedValue = viewMask.apply(valueToFormat);
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if(angular.isDefined(attrs.uiNegativeNumber)){
						var isNegative = (value[0] === '-'),
							needsToInvertSign = (value.slice(-1) === '-');

						//only apply the minus sign if it is negative or(exclusive) needs to be negative
						if(needsToInvertSign ^ isNegative) {
							actualNumber *= -1;
							formatedValue = '-' + formatedValue;
						}
					}

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				ctrl.$formatters.push(function(value) {
					var prefix = '';
					if(angular.isDefined(attrs.uiNegativeNumber) && value < 0){
						prefix = '-';
					}

					if(!value) {
						return value;
					}

					var valueToFormat = prepareNumberToFormatter(value, decimals);
					return prefix + viewMask.apply(valueToFormat);
				});

				ctrl.$parsers.push(parse);

				if (attrs.uiNumberMask) {
					scope.$watch(attrs.uiNumberMask, function(decimals) {
						if(isNaN(decimals)) {
							decimals = 2;
						}
						viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = numberModelMask(decimals);

						parse(ctrl.$viewValue || '');
					});
				}

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						var min = $parse(attrs.min)(scope);
						return minValidator(ctrl, value, min);
					});

					scope.$watch(attrs.min, function(value) {
						minValidator(ctrl, ctrl.$modelValue, value);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						var max = $parse(attrs.max)(scope);
						return maxValidator(ctrl, value, max);
					});

					scope.$watch(attrs.max, function(value) {
						maxValidator(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}])
//Introduced Polish validations for Postal Code, NIP, PESEL, REGON (9# & 14#)

	.directive('uiPlBankAccountNoMask', [uiPlBankAccountNoMask])
	.directive('uiPlIdNoMask', [uiPlIdNoMask])
	.directive('uiPlPassportNoMask', [uiPlPassportNoMask])
	.directive('uiPlPostalCodeMask', [uiPlPostalCodeMask])
	.directive('uiPlPeselMask', [uiPlPeselMask])
	.directive('uiPlNipMask', [uiPlNipMask])
	.directive('uiPlRegonMask', [uiPlRegonMask])
	.directive('uiPlMedicalNoMask', [uiPlMedicalNoMask])
	.directive('uiBrCpfMask', [uiBrCpfMask])
	.directive('uiBrCnpjMask', [uiBrCnpjMask])
	.directive('uiBrCpfcnpjMask', [uiBrCpfCnpjMask])
	// deprecated: will be removed in the next major version
	.directive('uiCpfMask', [uiBrCpfMask])
	// deprecated: will be removed in the next major version
	.directive('uiCnpjMask', [uiBrCnpjMask])
	// deprecated: will be removed in the next major version
	.directive('uiCpfcnpjMask', [uiBrCpfCnpjMask])
	.directive('uiMoneyMask', ['$locale', '$parse', function ($locale, $parse) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					currencySym = $locale.NUMBER_FORMATS.CURRENCY_SYM,
					decimals = parseInt(attrs.uiMoneyMask);

				if (!ctrl) {
					return;
				}

				if (angular.isDefined(attrs.uiHideGroupSep)){
					thousandsDelimiter = '';
				}

				if(isNaN(decimals)) {
					decimals = 2;
				}
				var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
				var maskPattern = currencySym+' #'+thousandsDelimiter+'##0'+decimalsPattern;
				var moneyMask = new StringMask(maskPattern, {reverse: true});

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return moneyMask.apply(value.toFixed(decimals).replace(/[^\d]+/g,''));
				});

				function parse(value) {
					if (!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					actualNumber = actualNumber.replace(/^[0]+([1-9])/,'$1');
					var formatedValue = moneyMask.apply(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue ? parseInt(formatedValue.replace(/[^\d]+/g,''))/Math.pow(10,decimals) : null;
				}

				ctrl.$parsers.push(parse);

				if (attrs.uiMoneyMask) {
					scope.$watch(attrs.uiMoneyMask, function(decimals) {
						if(isNaN(decimals)) {
							decimals = 2;
						}
						decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
						maskPattern = currencySym+' #'+thousandsDelimiter+'##0'+decimalsPattern;
						moneyMask = new StringMask(maskPattern, {reverse: true});

						parse(ctrl.$viewValue || '');
					});
				}

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						var min = $parse(attrs.min)(scope);
						return minValidator(ctrl, value, min);
					});

					scope.$watch(attrs.min, function(value) {
						minValidator(ctrl, ctrl.$modelValue, value);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						var max = $parse(attrs.max)(scope);
						return maxValidator(ctrl, value, max);
					});

					scope.$watch(attrs.max, function(value) {
						maxValidator(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}])
	.directive('uiBrPhoneNumber',function() {
		/**
		 * FIXME: all numbers will have 9 digits after 2016.
		 * see http://portal.embratel.com.br/embratel/9-digito/
		 */
		var phoneMask8D = new StringMask('(00) 0000-0000'),
			phoneMask9D = new StringMask('(00) 00000-0000');

		function clearValue (value) {
			if(!value) {
				return value;
			}

			return value.replace(/[^0-9]/g, '');
		}

		function applyPhoneMask (value) {
			if(!value) {
				return value;
			}

			var formatedValue;
			if(value.length < 11){
				formatedValue = phoneMask8D.apply(value);
			}else{
				formatedValue = phoneMask9D.apply(value);
			}

			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyPhoneMask(validateBrPhoneNumber(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if (!value) {
						return value;
					}

					var cleanValue = clearValue(value);
					var formatedValue = applyPhoneMask(cleanValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return clearValue(formatedValue);
				});

				ctrl.$parsers.push(function(value) {
					return validateBrPhoneNumber(ctrl, value);
				});
			}
		};
	})
	.directive('uiBrCepMask',function() {
		var cepMask = new StringMask('00000-000');

		function clearValue (value) {
			if(!value) {
				return value;
			}

			return value.replace(/[^0-9]/g, '');
		}

		function applyCepMask (value, ctrl) {
			if(!value) {
				ctrl.$setValidity('cep', true);
				return value;
			}
			var processed = cepMask.process(value);
			ctrl.$setValidity('cep', processed.valid);
			var formatedValue = processed.result;
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCepMask(value, ctrl);
				});

				ctrl.$parsers.push(function(value) {
					if (!value) {
						return applyCepMask(value, ctrl);
					}

					var cleanValue = clearValue(value);
					var formatedValue = applyCepMask(cleanValue, ctrl);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return clearValue(formatedValue);
				});
			}
		};
	})

	.directive('uiBrIeMask', ['$parse', function($parse) {

		var ieMasks = {
			'AC': [{mask: new StringMask('00.000.000/000-00')}],
			'AL': [{mask: new StringMask('000000000')}],
			'AM': [{mask: new StringMask('00.000.000-0')}],
			'AP': [{mask: new StringMask('000000000')}],
			'BA': [{chars: 8, mask: new StringMask('000000-00')},
				   {mask: new StringMask('0000000-00')}],
			'CE': [{mask: new StringMask('00000000-0')}],
			'DF': [{mask: new StringMask('00000000000-00')}],
			'ES': [{mask: new StringMask('00000000-0')}],
			'GO': [{mask: new StringMask('00.000.000-0')}],
			'MA': [{mask: new StringMask('000000000')}],
			'MG': [{mask: new StringMask('000.000.000/0000')}],
			'MS': [{mask: new StringMask('000000000')}],
			'MT': [{mask: new StringMask('0000000000-0')}],
			'PA': [{mask: new StringMask('00-000000-0')}],
			'PB': [{mask: new StringMask('00000000-0')}],
			'PE': [{chars: 9, mask: new StringMask('0000000-00')},
				   {mask: new StringMask('00.0.000.0000000-0')}],
			'PI': [{mask: new StringMask('000000000')}],
			'PR': [{mask: new StringMask('000.00000-00')}],
			'RJ': [{mask: new StringMask('00.000.00-0')}],
			'RN': [{chars: 9, mask: new StringMask('00.000.000-0')},
				   {mask: new StringMask('00.0.000.000-0')}],
			'RO': [{mask: new StringMask('0000000000000-0')}],
			'RR': [{mask: new StringMask('00000000-0')}],
			'RS': [{mask: new StringMask('000/0000000')}],
			'SC': [{mask: new StringMask('000.000.000')}],
			'SE': [{mask: new StringMask('00000000-0')}],
			'SP': [{mask: new StringMask('000.000.000.000')},
				   {mask: new StringMask('-00000000.0/000')}],
			'TO': [{mask: new StringMask('00000000000')}]
		};

		function clearValue (value) {
			if(!value) {
				return value;
			}
			return value.replace(/[^0-9]/g, '');
		}

		function getMask(uf, value) {
			if(!uf || !ieMasks[uf]) {
				return undefined;
			}
			var _uf = uf.toUpperCase();
			if (_uf === 'SP' && /^P/i.test(value)) {
				return ieMasks.SP[1].mask;
			}
			var masks = ieMasks[uf];
			var i = 0;
			while(masks[i].chars && masks[i].chars < clearValue(value).length && i < masks.length - 1) {
				i++;
			}
			return masks[i].mask;
		}

		function applyIEMask (value, uf, ctrl) {
			var mask = getMask(uf, value);
			if(!value || !mask) {
				ctrl.$setValidity('ie', true);
				return value;
			}
			var processed = mask.process(clearValue(value));
			ctrl.$setValidity('ie', BrV.ie(uf).validate(value));
			var formatedValue = processed.result;
			if (uf && uf.toUpperCase() === 'SP' && /^p/i.test(value)) {
				return 'P'+(formatedValue ? formatedValue.trim().replace(/[^0-9]$/, '') : '');
			}
			if(!formatedValue) {
				return formatedValue;
			}
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ctrl) {
				var state = $parse(attrs.uiBrIeMask)(scope);

				if (!ctrl) {
					return;
				}

				scope.$watch(attrs.uiBrIeMask, function(newState) {
					state = newState;
					applyIEMask(ctrl.$viewValue, state, ctrl);
				});

				ctrl.$formatters.push(function(value) {
					return applyIEMask(value, state, ctrl);
				});

				ctrl.$parsers.push(function(value) {
					if (!value) {
						return applyIEMask(value, state, ctrl);
					}

					var formatedValue = applyIEMask(value, state, ctrl);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					if (state && state.toUpperCase() === 'SP' && /^p/i.test(value)) {
						return 'P'+clearValue(formatedValue);
					}
					return clearValue(formatedValue);
				});
			}
		};
	}]);
})();

})(angular);