

import ChessPartie from './ChessParties';
import './publication.js';
import './old_methods.js';
import { Games } from '../Games';

Games.remove({});




// Platy

class ChessManager{

    constructor(){
        this.games = [];
        
        var self = this;
        this._loop = Meteor.setInterval(function(){
            for (var k in self.games){
                var game = self.games[k];
                if (game.isActive()){
                    game.onSecond();
                }
            }
        },1000);
    }
    addGamefromSave(json){
        var game = new ChessPartie(nom,type);
        this.uuid = json['game-id'];
        this.player_w = null;
        this.player_b = null;
        this.timer_w = json['timer-w'];
        this.timer_b = json['timer-b'];
        this.fen = json['fen'];
        this.turn = json['turn'];
        this.move = json['move'];
        this.status = "";
        this.whitelist_b = json['whitelist-b'];
        this.whitelist_w = json['whitelist-w'];
        this.nom = json['name'];
    }
    addNewGame(nom,type){
        var game = new ChessPartie(nom,type);
        this.games.push(game);
        return game;
    }
    hasGamesWithID(uuid){
        return this.getGamesWithID(uuid)!=null;
    }
    getGameWithMongoID(mongo_id){
        var found = this.games.find(element => element.object_id.indexOf(mongo_id)!=-1);
        return found;
    }
    getGamesWithID(uuid){
        var found = this.games.find(element => element.uuid.indexOf(uuid)!=-1);
        return found;
    }
}

var manager = new ChessManager();

export default manager;