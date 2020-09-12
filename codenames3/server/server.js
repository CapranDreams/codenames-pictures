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
var alreadyGuessed = [0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0];
var tilemap = []
var codemap = []
var red_flags = 9;
var blue_flags = 9;
var green_flags = 9;
var num_images = 281;
var random_start_var = 0;
function newgame() {
	//generate tile map
	tilemap = []
	for(t=0;t<30;t++) {
		var new_val = Math.floor(Math.random()*num_images)+1;
		while(tilemap.includes(new_val)) {
			new_val = Math.floor(Math.random()*num_images)+1;
		}
		tilemap.push(new_val);
	}
	
	//generate spymaster grid
	codemap = [3,3,3,3,3,3, 3,3,3,3,3,3, 3,3,3,3,3,3, 3,3,3,3,3,3, 3,3,3,3,3,3]
	red_flags = 10;
	blue_flags = 10;
	green_flags = 10;
	random_start_var = Math.floor(Math.random()*100)
	if(random_start_var>=66) {
		red_flags--;
	}
	else if(random_start_var>=33) {
		blue_flags--;
	}
	else {
		green_flags--;
	}	
	for(i=0;i<red_flags;i++) {
		var new_val = Math.floor(Math.random()*30);
		while(codemap[new_val]!=3) {
			new_val = Math.floor(Math.random()*30);
		}
		codemap[new_val] = 1;
		console.log('red:', new_val);
	}
	for(i=0;i<blue_flags;i++) {
		var new_val = Math.floor(Math.random()*30);
		while(codemap[new_val]!=3) {
			new_val = Math.floor(Math.random()*30);
		}
		codemap[new_val] = 2;
		console.log('blue:', new_val);
	}
	for(i=0;i<green_flags;i++) {
		var new_val = Math.floor(Math.random()*30);
		while(codemap[new_val]!=3) {
			new_val = Math.floor(Math.random()*30);
		}
		codemap[new_val] = 4;
		console.log('green:', new_val);
	}
	//var new_val = Math.floor(Math.random()*30)+1;
	//while(codemap[new_val]!=3) {
	//	new_val = Math.floor(Math.random()*30)+1;
	//}
	//codemap[new_val] = 3;
	//console.log('blk:', new_val);	
		
	alreadyGuessed = [0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0];
}

io.on('connection', function(sock){
	io.emit('message', "player joined: "+sock.id);
	console.log('Player joined: '+sock.id);
	sock.emit('giveid', sock.id);
	
	
	// Update screen to existing game
	io.emit('tilemap', red_flags, blue_flags, green_flags, tilemap[0],tilemap[1],tilemap[2],tilemap[3],tilemap[4],tilemap[5],tilemap[6],tilemap[7],tilemap[8],tilemap[9],tilemap[10],tilemap[11],tilemap[12],tilemap[13],tilemap[14],tilemap[15],tilemap[16],tilemap[17],tilemap[18],tilemap[19],tilemap[20],tilemap[21],tilemap[22],tilemap[23],tilemap[24],tilemap[25],tilemap[26],tilemap[27],tilemap[28],tilemap[29], codemap[0],codemap[1],codemap[2],codemap[3],codemap[4],codemap[5],codemap[6],codemap[7],codemap[8],codemap[9],codemap[10],codemap[11],codemap[12],codemap[13],codemap[14],codemap[15],codemap[16],codemap[17],codemap[18],codemap[19],codemap[20],codemap[21],codemap[22],codemap[23],codemap[24],codemap[25],codemap[26],codemap[27],codemap[28],codemap[29]);
	
	for(i=0;i<30;i++) {
		if(alreadyGuessed[i]) {
			io.emit('tile', i, red_flags, blue_flags);
		}
	}
	
	
	sock.on('newgame', (data) => {
		console.log(data);
		newgame();
		io.emit('tilemap', red_flags, blue_flags, green_flags, tilemap[0],tilemap[1],tilemap[2],tilemap[3],tilemap[4],tilemap[5],tilemap[6],tilemap[7],tilemap[8],tilemap[9],tilemap[10],tilemap[11],tilemap[12],tilemap[13],tilemap[14],tilemap[15],tilemap[16],tilemap[17],tilemap[18],tilemap[19],tilemap[20],tilemap[21],tilemap[22],tilemap[23],tilemap[24],tilemap[25],tilemap[26],tilemap[27],tilemap[28],tilemap[29], codemap[0],codemap[1],codemap[2],codemap[3],codemap[4],codemap[5],codemap[6],codemap[7],codemap[8],codemap[9],codemap[10],codemap[11],codemap[12],codemap[13],codemap[14],codemap[15],codemap[16],codemap[17],codemap[18],codemap[19],codemap[20],codemap[21],codemap[22],codemap[23],codemap[24],codemap[25],codemap[26],codemap[27],codemap[28],codemap[29]);
	});
	
	sock.on('changeteam', (data , player) => {
		team="Red";
		if(data==1) {
			team = "Blue";
		}
		else if(data==2) {
			team = "Green";
		}
		console.log('['+player+'] set team:', team);
	});
	
	sock.on('changerole', (data , player) => {
		role="Guesser";
		if(data==1) {
			role = "Spymaster";
		}
		console.log('['+player+'] set role:', role);
		
		for(i=0;i<30;i++) {
		if(alreadyGuessed[i]) {
			io.emit('tile', i, red_flags, blue_flags);
		}
	}
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
			else if(codemap[data]==4) {
				green_flags--;
			}
			alreadyGuessed[data]=1;
			
			io.emit('tile', data, red_flags, blue_flags, green_flags);
		}
	});
	
	sock.on('chat', (data , player, team) => {
		console.log('['+player+'] chat:', data);
		var teamname = "RED";
		if(team==1) {
			teamname = "BLUE";
		}
		else if(team==2) {
			teamname = "GREEN";
		}
		io.emit('chat', '['+teamname+']: '+data);
	});
	
});




server.on('error', (err) => {
	console.error('Server error:', err);
});

server.listen(8083, () => {
	console.log('Codenames started on 8083');
});
