import {chess960} from './gametypes.js';
import { Chess } from 'chess.js';
import crypto from 'crypto'; 
import { Games } from '../Games';
import './publication.js';

Games.remove({});


class ChessPartie{

    constructor(nom,type){
        this.uuid = crypto.randomBytes(60).toString("hex");
        this.nom = nom;
        this.type=type;
        this.playing = false;
        this.wait_time = 30;
        this.whitelist_b = null;
        this.whitelist_w = null;
        this.player_w = null;
        this.player_b = null;
        this.need_loop = true;
        this.status = {type:"LOADING"};
        this.timer_w = 0;
        this.timer_b = 0;
        this.move = [];
        this.chess = new Chess();
        if (type=="960"){
            chess960(this.chess);
        }
        
        //ajoute dans le mongo db

        Games.insert({
            'game-id': this.uuid,
            'type': this.type,
            'whitelist-b': this.whitelist_b,
            'whitelist-w': this.whitelist_w,
            'status': this.status,
            'player-w': this.timer_w,
            'player-b': this.timer_b,
            'timer-w': this.timer_w,
            'timer-b': this.timer_b,
            'fen': this.chess.fen(),
            'turn': this.chess.turn(),
            'move': [],
            'name': this.nom
        });

    }

    onSecond(){
        if (this.player_b!=null&&this.player_w!=null){
            if ( this.playing==false){
                if (this.wait_time>=1){
                    this.wait_time = this.wait_time-1;
                }else{
                    this.playing=true;
                    this.whitelist_b = this.player_b;
                    this.whitelist_w = this.player_w;
                }
            }
       
        }
        this.updateMongoDB(this.chess.fen());
    }
    updateMongoDB(fen){
        var count = Games.find({ 'game-id': this.uuid}).count();
        //console.log("DB("+this.uuid+") > "+count);

        var new_status = {type:"LOADING"};

        if (this.chess.game_over()){
            if (this.chess.in_checkmate()) {
                new_status =  {type:"END",win:this.chess.turn()};
            }else if (this.chess.in_draw()) {
                new_status = {type:"END",win:"DRAW"};
            }else {
                new_status =  {type:"END",win:"OTHER"};
            }
           
        }else{
            if (this.playing==false){
                var count = 0;
                if (this.player_b!=null&&this.player_w!=null){
                    new_status = {type:"STARTING",temps:this.wait_time};
                }else{
                    if (this.player_b!=null){
                        count=count+1;
                    }
                    if (this.player_w!=null){
                        count=count+1;
                    }
                    new_status = {type:"STARTING",actif:count,max:2};
                }
            }else{
                
                new_status = {type:"PLAYING",turn:this.chess.turn(),in_check:this.chess.in_check()};
            }
        }

        this.status = new_status;

        var json = {
            'game-id': this.uuid,
            'type': this.type,
            'whitelist-b': this.whitelist_b,
            'whitelist-w': this.whitelist_w,
            'status': this.status,
            'player-w': this.player_w,
            'player-b': this.player_b,
            'timer-w': this.timer_w,
            'timer-b': this.timer_b,
            'fen': fen,
            'turn': this.chess.turn(),
            'move': [],
            'name': this.nom
        }
        //console.log(this.chess.ascii());
        var self = this;
        Games.update({
            'game-id': this.uuid
        },json);

    }

    json(){
        return {
            'game-id': this.uuid,
            'player-w': this.player_w,
            'player-b': this.player_b,
            'timer-w': this.timer_w,
            'timer-b': this.timer_b,
            'fen': this.chess.fen(),
            'turn': this.chess.turn(),
            'move': []
        }
    }
}

// Platy

class ChessManager{

    constructor(){
        this.games = [];
        
        var self = this;
        this._loop = Meteor.setInterval(function(){
            for (var k in self.games){
                var game = self.games[k];
                if (game.need_loop){
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
        for (var k in this.games){
            console.log("- "+this.games[k].uuid);
            if ( this.games[k].uuid.indexOf(uuid)!=-1){
                return true;
            }
        }
        console.log(uuid);
        return false;
    }
    getGamesWithID(uuid){
        for (var k in this.games){
            if ( this.games[k].uuid.indexOf(uuid)!=-1){
                return this.games[k];
            }
        }
        return null;
    }
}

var manager = new ChessManager();


Meteor.methods({
    'move'({ game_id,source, target , piece , position }) {
        if (this.userId==null){
            return null;
        }
        if(manager.hasGamesWithID(game_id)==false){
            return null;
        }
        var game = manager.getGamesWithID(game_id);
        //Recupération de la couleur du joueur
        var color = null;
        if (game.playing==false){
            return null;
        }
        if (game.player_b!=null){
            if (game.player_b.indexOf(this.userId)!=-1){
                color="b";
            }
        }
        if (game.player_w!=null){
            if (game.player_w.indexOf(this.userId)!=-1){
                color="w";
            }
        }
        //Test si le joueur peux bouger cette piece (vérification du tour + si la pièce est à lui) 
        if(game.chess.turn() == color && piece.startsWith(color)){
            var move = game.chess.move({from:source,to:target,promotion:"q"});
            if(move != null){
                game.updateMongoDB(game.chess.fen());
                return move;
            }
        }
        return null;
    },
    'join'({game_id}){
        if (this.userId==null){
            return {error:"not_connected"};
        }
        console.log(this.userId,"join",game_id);
        if(manager.hasGamesWithID(game_id)==false){
            return {error:"notfound_game"};
        }
        var game = manager.getGamesWithID(game_id);
        if (game==null){
            return {error:"notfound_game"};
        }
        var color = null;

        var result = game.json();

        

        // Ajouter la color par ramport à sa position
        if (game.player_b!=null){
            if (game.player_b.indexOf(this.userId)!=-1){
                color="b";
            }
        }
        if (game.player_w!=null){
            if (game.player_w.indexOf(this.userId)!=-1){
                color="w";
            }
        }

        if (color==null){
            if (game.player_w==null){
                if (game.whitelist_w!=null){
                    if (game.whitelist_w.indexOf(this.userId)!=-1){
                        game.player_w =this.userId;
                        color="w";
                    }
                }else{
                    game.player_w =this.userId;
                    color="w";
                }
            }else if (game.player_b==null){
                if (game.whitelist_b!=null){
                    if (game.whitelist_b.indexOf(this.userId)!=-1){
                        game.player_b =this.userId;
                        color="b";
                    }
                }else{
                    game.player_b =this.userId;
                    color="b";
                }
            }
        }

        // Ajouter status du joueur (quelle color ou spectateur)
        result.currentPlayer = {
            'color':color
        };
        return result;
    },
    'create'({nom,type}){
        if(type == undefined || type==""){
            type = "classique"
        }
        if(nom.length == 0){
            return false;
        }
        var game = manager.addNewGame(nom,type);
        return game.uuid;
    }
});




module.exports = manager;