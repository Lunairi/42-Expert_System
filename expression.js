const ops = {
	'+': '&&',
	'|': '||',
	'^': '^'
};

module.exports = {
	expression: (impl) => {
		let bidir = impl.includes('<=>');
		if (!bidir && !impl.includes('=>'))
			throw ('0 Missing implication.');

		let expr;
		if (bidir)
			expr = impl.split('<=>');
		else
			expr = impl.split('=>');

		if (expr.length != 2)
			return ('0 Invalid implication.');

		return ('if (' + conditional(expr[0]) + ') {\n' + body(expr[1]) + '}');
	}
}

function conditional(expr) {
	let op = false;
	let grps = 0;
	let rgrp = 0;
	let lgrp = 0;
	let result = '';
	for (let i = 0; i < expr.length; i++) {
		let char = expr[i];

		switch (char) {
			case '!':
				if (op)
					throw (`${i} Unexpected '!'.`);

				result += char;
				break;

			case '(':
				if (op)
					throw (`${i} Unexpected '('.`);

				grps++;
				result += '(';
				rgrp = result.length;
				break;

			case ')':
				if (!op || !grps)
					throw (`${i} Unexpected ')'.`);

				grps--;
				result += ')'.repeat(1 + lgrp);
				lgrp = 0;
				break;

			case '^':
				if (!op)
					throw (`${i} Unexpected operator '^'.`);

				op = false;
				lgrp++;
				result = [result.slice(0, rgrp), '(', result.slice(rgrp)].join('') + ') ^ (';
				break;

			default:
				if (/\s/.test(char))
					break;

				if (ops[char]) {
					if (!op)
						throw (`${i} Unexpected operator '${char}'.`);

					result += ` ${ops[char]} `;
				}
				else {
					if (op)
						throw (`${i} Unexpected symbol '${char}'.`);

					result += `fact('${char}')`;
				}

				op = !op;
				break;
		}
	}

	if (grps)
		throw (`${expr.length} Expected ')'.`);
	if (!op)
		throw (`${expr.length} Unexpected end of expression.`);

	return (result + ')'.repeat(lgrp));
}

function body(expr) {
	let op = false;
	let value = true;
	let result = '';
	for (let i = 0; i < expr.length; i++) {
		let char = expr[i];

		switch (char) {
			case '!':
				if (op)
					throw (`${i} Unexpected '${char}'.`);
				value = !value;
				break;

			case '(':
				throw (`${i} Unexpected '('.`);

			case ')':
				throw (`${i} Unexpected ')'.`);

			default:
				if (/\s/.test(char))
					break;

				if (ops[char]) {
					if (!op || char != '+')
						throw (`${i} Unexpected operator '${char}'.`);
				}
				else {
					if (op)
						throw (`${i} Unexpected symbol '${char}'.`);

					result += `\tupdate_fact('${char}', ${value});\n`;
					value = true;
				}

				op = !op;
				break;
		}
	}

	return (result);
}