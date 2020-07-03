
import {chess960} from './gametypes.js';
import { Chess } from 'chess.js';
import { Games } from '../Games';
import crypto from 'crypto';
import { Meteor } from 'meteor/meteor';


class ChessPartie{

    constructor(nom,type){
        this.uuid = crypto.randomBytes(60).toString("hex");
        this.nom = nom;
        this.type=type;
        this.playing = false;
        this.tournament = false;
        this.tournamentId = -1;
        this.wait_time = 5;
        this.whitelist_b = null;
        this.whitelist_w = null;
        this.turn_time = 0;
        this.player_w = null;
        this.player_b = null;
        this.active = true;
        this.status = {type:"LOADING"};
        this.timer_w = 0;
        this.draww = 0;
        this.drawb = 0;
        this.timer_b = 0;
        this.move = [];
        this.Highlighted = 0;
        this.chess = new Chess();

        if (type=="960"){
            chess960(this.chess);
        }
        
        //ajoute dans le mongo db

        var b = Games.insert({
            'game-id': this.uuid,
            'type': this.type,
            'whitelist-b': this.whitelist_b,
            'whitelist-w': this.whitelist_w,
            'status': this.status,
            'player-w': this.player_w,
            'player-b': this.player_b,
            'timer-w': this.timer_w,
            'timer-b': this.timer_b,
            'fen': this.chess.fen(),
            'turn': this.chess.turn(),
            'move': this.move,
            'draww': 0,
            'drawb': 0,
            'name': this.nom,
            'object-id': 'null',
            'tournament': this.tournament,
            'tournamentId': this.tournamentId,
            'Highlighted' : 0,
        });

        this.object_id = b; 
    }

    end(status,reason,other){
        this.active = false;
        this.playing = false;
        this.status = {type:"END",value:status,reason: reason};
        for (var k in other){
            this.status[k] = other[k];
        }
        return this.status;
    }
    white(){
        if (this.player_w!=null){
            var user = Meteor.users.findOne( {'_id' :  this.player_w});
            return user.username;
        }else{
            return null;
        }
    }
    black(){
        if (this.player_b!=null){
            var user = Meteor.users.findOne( {'_id' :  this.player_b});
            return user.username;
        }else{
            return null;
        }
    }
    onSecond(){
        if (this.player_b!=null&&this.player_w!=null){
            if ( this.playing==false){
                if (this.wait_time>=1){
                    this.wait_time = this.wait_time-1;
                }else{
                    this.playing=true;
                    this.turn_time = new Date().getTime();
                    this.whitelist_b = this.player_b;
                    this.whitelist_w = this.player_w;
                }
            }
       
        }
        this.update();
    }
    isPlaying(){
        return this.status.type == "PLAYING" || this.status.type == "STARTING";
    }
    isEnd(){
        return this.status.type == "END";
    }
    isActive(){
        return this.active;
    }
    json(){
        var fen = this.chess.fen();
        var count = Games.find({ 'game-id': this.uuid}).count();
        //console.log("DB("+this.uuid+") > "+count);


        // Vérification si il y a besoins de faire un mise à jour automatic de la partie
        if ( this.active && this.isEnd()==false ){
            var new_status = {type:"LOADING"};

            if (this.chess.game_over()){
                if (this.chess.in_checkmate()) {
                    new_status = this.end("checkmate",this.chess.turn());
                }else if (this.chess.in_draw()) {
                    new_status = this.end("draw","auto");
                }else {
                    new_status = this.end("game_over","other");
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
        }

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
            'move': this.move,
            'name': this.nom,
            'object-id': this.object_id,
            'tournament': this.tournament,
            'tournamentId':this.tournamentId,
            'draww': this.draww,
            'drawb': this.drawb,
            'Highlighted': this.Highlighted
        }

        return json;
        //console.log(this.chess.ascii());
    }


    // TODO: A faire
    reset(){
        this.playing = false;
        this.tournament = false;
        this.tournamentId = -1;
        this.wait_time = 5;
        this.whitelist_b = null;
        this.whitelist_w = null;
        this.turn_time = 0;
        this.player_w = null;
        this.player_b = null;
        this.active = true;
        this.status = {type:"LOADING"};
        this.timer_w = 0;
        this.draww = 0;
        this.drawb = 0;
        this.timer_b = 0;
        this.move = [];
        this.Highlighted = 0;
        this.chess = new Chess();
        if (type=="960"){
            chess960(this.chess);
        }
    }

    update(){
        var json_b= this.json();
        Games.update({
            'game-id': this.uuid
        },json_b);
    }
}

module.exports = ChessPartie;