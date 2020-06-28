import { Meteor } from 'meteor/meteor';
import manager from '/imports/api/server/chessmanager.js';
import { Games } from '/imports/api/Games.js';







Meteor.startup(() => {
    for (let i = 0; i < 100; i++) {
        manager.addNewGame("game_"+i,"normal");
        
    }
});
