var my_id = 0;
var socket = io();
var my_team = 0;
var my_role = 0;
var red_remaining = 1;
var blue_remaining = 1;

const writeEvent = (text) => {
	// <ul> element
	const parent = document.querySelector('#events');

	// <li> element
	const el = document.createElement('li');
	el.innerHTML = text;

	parent.prepend(el);
};

const assignName = (text) => {
	document.getElementById('playername').innerHTML = text;
	my_id = text;
};

const secretData = (text) => {
	
};

const sendChat = () => {
	var input = document.getElementById('chat').value;
	//chat(input);
	socket.emit('chat', input, my_id, my_team);
	document.getElementById('chat').value = '';
};
const chatRX = (text) => {
	chat(text);
};

function chat(text) {
	const parent = document.querySelector('#events');
	const el = document.createElement('li');
	el.innerHTML = text;
	parent.prepend(el);
}

function setRemaining(r,b) {
	red_remaining = r;
	blue_remaining = b;
	document.getElementById('red_remain').innerHTML = red_remaining;
	document.getElementById('blue_remain').innerHTML = blue_remaining;
	
}

function changeteam(n) {
	my_team = n;
	socket.emit('changeteam', my_team, my_id);
	if(my_team==1) {
		//document.getElementById('playerteam').style.border = "3px solid #00b5c9";	// blue
		document.getElementById('playerteam').innerHTML = "Blue Team";
		document.getElementById('team_color_square').className = "player_id_team_blue";
		document.getElementById('redteam').className = "teamchange";
		document.getElementById('blueteam').className = "teamchange-blue";
	}
	else {
		//document.getElementById('playerteam').style.border = "3px solid #cf4500";	// red
		document.getElementById('playerteam').innerHTML = "Red Team";
		document.getElementById('team_color_square').className = "player_id_team_red";
		document.getElementById('redteam').className = "teamchange-red";
		document.getElementById('blueteam').className = "teamchange";
	}
}

function changerole(n) {
	my_role = n;
	socket.emit('changerole', my_role, my_id);
	if(my_role==1) {
		document.getElementById('playerrole').innerHTML = "Spymaster";
		for(i=1;i<=20;i++) {
			document.getElementById('tile'.concat(i)).style.opacity = '0.6';
		}
		document.getElementById('guesser_select').className = "role";
		document.getElementById('spymaster_select').className = "role_spymaster";
	}
	else {
		document.getElementById('playerrole').innerHTML = "Guesser";
		for(i=1;i<=20;i++) {
			document.getElementById('tile'.concat(i)).style.opacity = '1';
		}
		document.getElementById('guesser_select').className = "role_guesser";
		document.getElementById('spymaster_select').className = "role";
	}
}

function newgame() {
	socket.emit('newgame', "newgame");
}

const tile_new_map = (red_flags, blue_flags, t0,t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14,t15,t16,t17,t18,t19, c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17,c18,c19) => {
	setRemaining(red_flags, blue_flags);
	for(i=1;i<=20;i++) {
		document.getElementById('tile'.concat(i)).style.opacity = '1';
	}
	chat("new game");
	
	document.getElementById('tile1').src = "img/"+t0+".jpg";
	document.getElementById('tile2').src = "img/"+t1+".jpg";
	document.getElementById('tile3').src = "img/"+t2+".jpg";
	document.getElementById('tile4').src = "img/"+t3+".jpg";
	document.getElementById('tile5').src = "img/"+t4+".jpg";
	document.getElementById('tile6').src = "img/"+t5+".jpg";
	document.getElementById('tile7').src = "img/"+t6+".jpg";
	document.getElementById('tile8').src = "img/"+t7+".jpg";
	document.getElementById('tile9').src = "img/"+t8+".jpg";
	document.getElementById('tile10').src = "img/"+t9+".jpg";
	document.getElementById('tile11').src = "img/"+t10+".jpg";
	document.getElementById('tile12').src = "img/"+t11+".jpg";
	document.getElementById('tile13').src = "img/"+t12+".jpg";
	document.getElementById('tile14').src = "img/"+t13+".jpg";
	document.getElementById('tile15').src = "img/"+t14+".jpg";
	document.getElementById('tile16').src = "img/"+t15+".jpg";
	document.getElementById('tile17').src = "img/"+t16+".jpg";
	document.getElementById('tile18').src = "img/"+t17+".jpg";
	document.getElementById('tile19').src = "img/"+t18+".jpg";
	document.getElementById('tile20').src = "img/"+t19+".jpg";
	
	document.getElementById('code1').className = "tileBG"+c0;
	document.getElementById('code2').className = "tileBG"+c1;
	document.getElementById('code3').className = "tileBG"+c2;
	document.getElementById('code4').className = "tileBG"+c3;
	document.getElementById('code5').className = "tileBG"+c4;
	document.getElementById('code6').className = "tileBG"+c5;
	document.getElementById('code7').className = "tileBG"+c6;
	document.getElementById('code8').className = "tileBG"+c7;
	document.getElementById('code9').className = "tileBG"+c8;
	document.getElementById('code10').className = "tileBG"+c9;
	document.getElementById('code11').className = "tileBG"+c10;
	document.getElementById('code12').className = "tileBG"+c11;
	document.getElementById('code13').className = "tileBG"+c12;
	document.getElementById('code14').className = "tileBG"+c13;
	document.getElementById('code15').className = "tileBG"+c14;
	document.getElementById('code16').className = "tileBG"+c15;
	document.getElementById('code17').className = "tileBG"+c16;
	document.getElementById('code18').className = "tileBG"+c17;
	document.getElementById('code19').className = "tileBG"+c18;
	document.getElementById('code20').className = "tileBG"+c19;
};

function pickTile(t) {
	socket.emit('guess', t-1, my_id);
}

const server_pick_tile = (t,r,b) => {
	if(my_role==1) {
		document.getElementById('tile'.concat(t+1)).style.opacity = '0.05';
	}
	else {
		document.getElementById('tile'.concat(t+1)).style.opacity = '0.35';
	}
	setRemaining(r,b);
	if(r==0) {
		//window.alert("RED WINS!!!");
	}
	else if(b==0) {
		//window.alert("BLUE WINS!!!");
	}
};


socket.on('message', writeEvent);
socket.on('giveid', assignName);
socket.on('secret', secretData);
socket.on('chat', chatRX);
socket.on('tilemap', tile_new_map);
socket.on('tile', server_pick_tile);



document
	.querySelector('#chat-form')
	.addEventListener('submit', onFormSubmitted);

