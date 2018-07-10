// server.js
// load the things we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const es = require('./expert_system.js');

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

let current_line = 0;
let facts = [];
let graph = [];
let fileArray = [];
let step = 0;
let delay = 0;
let finish = 0;
let filename = '';

function reset() {
	current_line = 0;
	facts = [];
	facts.length = 0;
	graph = [];
	graph.length = 0;
	fileArray = [];
	fileArray.length = 0;
	step = 0;
	delay = 0;
	finish = 0;
	filename = '';
	es.reset();
}

app.get('/', function(req, res) {

    if (req.param('file')) {
    	reset();
    	graph = es.getGraph();
    	step = 1;
    	facts = [];
    	current_line = 0;
    	filename = '/Users/eggplant/42student/expert/test_cases/' + req.param('file');
    	fileArray = es.expertSystem(filename);
    	facts = es.getFacts();
    	if (req.param('delay'))
    		delay = req.param('delay');
    	else
    		delay = 1;
    }
    else if (req.param('step') == 1) {
    	es.setValues(current_line);
    	es.checkFacts(fileArray[current_line]);
    	console.log(current_line);
    	if (current_line < fileArray.length)
    		current_line += 1;
    	else {
    		step = 2;
    		current_line = 0;
    		graph = es.getGraph();
    	}
    	facts = es.getFacts();
    }
    else if (req.param('step') == 2) {
    	console.log(current_line);
    	es.doEval(current_line);
    	if (current_line < graph.length)
    		current_line += 1;
    	else if (!es.opinionOrFacts())
    		step = 3;
    	else {
    		current_line = 0;
    		es.setOpinion();
    	}
    	facts = es.getFacts();
    }
    else if (req.param('step') == 3) {
    	facts = es.getFacts();
    	finish = 1;

    }

    res.render('index.ejs', {
        farray: fileArray,
        file: filename,
        step: step,
        delay: delay,
        current: current_line,
        facts: facts,
        graph: graph,
        finish: finish
    });

});

app.use(express.static(__dirname + '/views'));

app.listen(6969);
console.log('YOU DID THIS TO ME APUEL');