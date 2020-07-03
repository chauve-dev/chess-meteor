

import manager from './chessmanager';

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

                console.log("PGN: "+game.chess.pgn());
                var time = new Date().getTime()-game.turn_time;
                game.move.push({move:target,fen:game.chess.fen(),time:time});
                game.turn_time = new Date().getTime();
                game.update();

                console.log(game.move);
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

        console.log(game.chess.pgn());

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