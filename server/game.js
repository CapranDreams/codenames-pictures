class game {
  constructor(p1, p2) {
    this._players = [p1, p2];
    this._turns = [null, null];

    this._sendToPlayers('Welcome to Codenames!');

    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
    });
  }

  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }

  

  _sendWinMessage(winner, loser) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

  

}

module.exports = game;
