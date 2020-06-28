import { Meteor } from 'meteor/meteor';
import manager from '/imports/api/server/chessmanager.js';
import { Games } from '/imports/api/Games.js';







Meteor.startup(() => {
    var game = manager.addNewGame("test","normal");
    console.log("http://localhost:80/games/"+game.uuid);
});
