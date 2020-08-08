const http = require('http');
const express = require('express');
const socketio = require('socket.io');

//const game = require('./game');
const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);
var custom_id = 1;
io.engine.generateId = (req) => {
	return "player_" + custom_id++; // custom id must be unique
}


var connectCounter = 0;
var alreadyGuessed = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0];
var tilemap = []
var codemap = []
var red_flags = 7;
var blue_flags = 7;
var num_images = 73;
function newgame() {
	//generate tile map
	tilemap = []
	for(t=0;t<20;t++) {
		var new_val = Math.floor(Math.random()*num_images)+1;
		while(tilemap.includes(new_val)) {
			new_val = Math.floor(Math.random()*num_images)+1;
		}
		tilemap.push(new_val);
	}
	
	//generate spymaster grid
	codemap = [4,4,4,4,4, 4,4,4,4,4, 4,4,4,4,4, 4,4,4,4,4]
	red_flags = 7;
	blue_flags = 7;
	if(Math.floor(Math.random()*100)>=50) {
		red_flags++;
	}
	else {
		blue_flags++;
	}	
	for(i=0;i<red_flags;i++) {
		var new_val = Math.floor(Math.random()*20)+1;
		while(codemap[new_val]!=4) {
			new_val = Math.floor(Math.random()*20)+1;
		}
		codemap[new_val] = 1;
		console.log('red:', new_val);
	}
	for(i=0;i<blue_flags;i++) {
		var new_val = Math.floor(Math.random()*20)+1;
		while(codemap[new_val]!=4) {
			new_val = Math.floor(Math.random()*20)+1;
		}
		codemap[new_val] = 2;
		console.log('blue:', new_val);
	}
	var new_val = Math.floor(Math.random()*20)+1;
	while(codemap[new_val]!=4) {
		new_val = Math.floor(Math.random()*20)+1;
	}
	codemap[new_val] = 3;
	console.log('blk:', new_val);	
		
	alreadyGuessed = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0];
}

io.on('connection', function(sock){
	io.emit('message', "player joined: "+sock.id);
	console.log('Player joined: '+sock.id);
	sock.emit('giveid', sock.id);
	
	
	sock.on('newgame', (data) => {
		console.log(data);
		newgame();
		io.emit('tilemap', red_flags, blue_flags, tilemap[0],tilemap[1],tilemap[2],tilemap[3],tilemap[4],tilemap[5],tilemap[6],tilemap[7],tilemap[8],tilemap[9],tilemap[10],tilemap[11],tilemap[12],tilemap[13],tilemap[14],tilemap[15],tilemap[16],tilemap[17],tilemap[18],tilemap[19], codemap[0],codemap[1],codemap[2],codemap[3],codemap[4],codemap[5],codemap[6],codemap[7],codemap[8],codemap[9],codemap[10],codemap[11],codemap[12],codemap[13],codemap[14],codemap[15],codemap[16],codemap[17],codemap[18],codemap[19]);
	});
	
	sock.on('changeteam', (data , player) => {
		team="Red";
		if(data==1) {
			team = "Blue";
		}
		console.log('['+player+'] set team:', team);
	});
	
	sock.on('changerole', (data , player) => {
		role="Guesser";
		if(data==1) {
			role = "Spymaster";
		}
		console.log('['+player+'] set role:', role);
	});
	
	sock.on('guess', (data , player) => {
		console.log('['+player+'] check tile:', data);
		if(alreadyGuessed[data]) {
			console.log('already guessed ', data);
		}
		else {
			if(codemap[data]==1) {
				red_flags--;
			}
			else if(codemap[data]==2) {
				blue_flags--;
			}
			alreadyGuessed[data]=1;
			
			io.emit('tile', data, red_flags, blue_flags);
		}
	});
	
	sock.on('chat', (data , player, team) => {
		console.log('['+player+'] chat:', data);
		var teamname = "RED";
		if(team==1) {
			teamname = "BLUE";
		}
		io.emit('chat', '['+teamname+']: '+data);
	});
	
});




server.on('error', (err) => {
	console.error('Server error:', err);
});

server.listen(8080, () => {
	console.log('Codenames started on 8080');
});