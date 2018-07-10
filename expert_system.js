const fs = require('fs');
const readline = require('readline');
const expr = require('./expression.js');
const _ = require('underscore');

let aFacts = {};
let facts = {};
let opinions = {};
let graph = [];

function fact(symbol) {
	if (facts[symbol])
		return (true);
	return (false);
}

function update_fact(symbol, value) {
	if (value) {
		facts[symbol] = true;
		aFacts[symbol] = true;
	}
	else {
		delete facts[symbol];
		aFacts[symbol] = false;
	}
}

function evaluateQuery(query) {
	for (let i = 0; i < query.length; i++) {
		if (facts[query[i]]) {
			console.log(`${query[i]} is true`);
		}
		else {
			console.log(`${query[i]} is false`);
		}
	}
}

function evaluateFacts(query) {
	if (!cached) {
		do {
			opinions = Object.assign({}, facts);
			graph.forEach((line) => eval(line));
		}
		while (!_.isEqual(opinions, facts));
	}
	evaluateQuery(query);
	cached = true;
}

let lineno = 0;
let cached = false;

function evalLine(line, type) {
	line = line.split('#')[0];

	if (line.includes('=>')) {
		try {
			graph.push(expr.expression(line));
		}
		catch (e) {
			console.error(`${lineno}:${e}`);
		}
	}
	else {
		line = line.replace(/\s/g, '');
		if (line.startsWith('='))
			setFacts(line);
		else if (line.startsWith('?')) {
			if (type == 'reg')
				evaluateFacts(line.substring(1));
			else if (type == 'vis')
				opinions = Object.assign({}, facts);
		}
		else if (line.length > 0) {
			console.error(`${lineno}:0 Invalid syntax.`);
		}
	}
	lineno++;
}

function setFacts(op) {
	for (let i = 1; i < op.length; i++)
		update_fact(op[i], true);
	cached = false;
}

let visArray = [];

module.exports = {
	expertSystem: (file) => {
		let input = fs.readFileSync(file).toString();
		visArray = input.split('\n');
		return visArray;
	},

	checkFacts: (line) => {
		try {
			for (let i = 0; i < line.length; i++) {
				if (line[i].match(/[a-z]/i)) {
					if (!fact(line[i])){
						update_fact(line[i], false);
					}
				}
			}
		}
		catch(e) {
		}
	},

	reset: () => {
		facts = {};
		aFacts = {};
		opinions ={};
		graph = [];
	},

	setOpinion: () => {
		opinions = Object.assign({}, facts);
	},

	opinionOrFacts: () => {
		if (!_.isEqual(opinions, facts))
			return 1;
		else
			return 0;
	},

	getFacts: () => {
		return aFacts;
	},

	getGraph: () => {
		return graph;
	},

	doEval: (count) => {
		eval(graph[count]);
	},

	setValues: (count) => {
		try {
			evalLine(visArray[count], 'vis');
		}
		catch (e) {
		}
	}
}

if (require.main === module) {
	if (process.argv.length < 3) {
		readline.createInterface({
			input: process.stdin,
			crlfDelay: Infinity
		}).on('line', (line) => evalLine(line, 'reg'));
	}
	else {
		for (let i = 2; i < process.argv.length; i++) {
			if (lineno)
				console.log('');
			console.log(process.argv[i]);
			lineno = 0;
			let input = fs.readFileSync(process.argv[i]).toString();
			input.split('\n').forEach((line) => {
				try {
					evalLine(line, 'reg');
				}
				catch (e) {
					console.error(e);
				}
			});
			facts = {};
			opinions = {};
			graph = [];
		}
	}
}

