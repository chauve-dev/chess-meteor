
import { Meteor } from 'meteor/meteor';
// import { Notifications } from  '../../notifications/index.js';
// import { mysqlPool ,getUserInfo} from '../../mysql/server/utils.js';
import manager from './chessmanager';


function mysqlPool(){} // for dev

var Notifications = {insert:function(){}};

Meteor.methods({

    endGame: function (gameId) {
            check(gameId, String);
    
            //console.log("=> endGame");
            var now = new Date().getTime();

        
            var game = manager.getGameWithMongoID(gameId);
                
            /*
            game.reason = 'time';
            game.gameend = now;
            game.status = 'ended';
            */
            game.end('ended','time',{gameend: now});
            
            game.update();
    
        },
    reportgameending: function (gameId, reason) {
            check(gameId, String);
            check(reason, String);
    
            var user = Meteor.user();
            var reporter = (user) ? user.username : null;
    
            console.log("reporting game end " + gameId, reporter, reason);
    
            var game = manager.getGameWithMongoID(mongoId);

            var move = game.move;
    
            if (game && game.isActive()) {
                var now = new Date().getTime();
                var lastplayer = ((move.length % 2) == 0) ? 'black' : 'white';
    
                //console.log("lastplayer", lastplayer);
    
                if (reason == 'draw')
                {
                    //game.status = 'draw';
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end('draw',reason,{gameend: now});
                }
    
                if (reason == 'stalemate')
                {
                    //game.status = 'draw';
                    //game.reason = 'draw';
                    //game.gameend = now;
                    game.end('draw',"draw",{gameend: now});
                }
    
                if (reason == 'threefoldrepetition')
                {
                    //game.status = 'draw';
                    //game.reason = 'draw';
                    //game.gameend = now;
                    game.end('draw',"draw",{gameend: now});
                }
    
                if (reason == 'insufficientmaterial')
                {
                    //game.status = 'draw';
                    //game.reason = 'draw';
                    //game.gameend = now;
                    game.end('draw',"draw",{gameend: now});
                }
    
                if (reason == 'leftgamew')
                {
                    //game.status = 'black';
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end('black',reason,{gameend:now});
                }
    
                if (reason == 'leftgameb')
                {
                    //game.status = 'white';
                    //game.reason = reason;
                    //game.gameend = now;

                    game.end('white',reason,{gameend:now});
                }
    
                if (reason == 'resignation')
                {
                    // Check the resignation was done by the player whose turn was to play
                    var turn = (lastplayer == 'white') ? 'black' : 'white';
                    if (game[turn] == reporter)
                    {
                        
                        //game.status = lastplayer;
                        //game.reason = reason;
                        //game.gameend = now;
                        game.end(lastplayer,reason,{gamenow:now});
                    }
                }
    
                if (reason == 'resignationw')
                {
                    //game.status = 'black';
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end('black',reason,{gamenow:now});
                }
    
                if (reason == 'resignationb')
                {
                    //game.status = 'white';
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end('white',reason,{gamenow:now});
                }
    
                if (reason == 'checkmate')
                {
                    // TODO : check there is really a checkmate
                    //game.status = lastplayer;
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end(lastplayer,reason,{gamenow:now});
                }
    
                if (reason == 'checkmatew')
                {
                    // TODO : check there is really a checkmate
                    //game.status = 'black';
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end('black',reason,{gamenow:now});
                }
    
                if (reason == 'checkmateb')
                {
                    // TODO : check there is really a checkmate
                    //game.status = 'white';
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end('white',reason,{gamenow:now});
                }
    
    
                if (reason == 'timew')
                {
                    //game.status = 'black';
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end('black',reason,{gamenow:now});
                }
    
                if (reason == 'timeb')
                {
                    //game.status = 'white';
                    //game.reason = reason;
                    //game.gameend = now;
                    game.end('white',reason,{gamenow:now});
                }
    
    
                if (reason == 'time')
                {
                    // Check time flags
    
                    var m = game.clock * 60 * 1000;
                    var t = [m, m];
    
                    var l = game.move.length;
                    if (l)
                    {
                        for (var i = 1; i < l; i++)
                        {
                            var delta = game.move[i].time - game.move[i - 1].time;
                            t[i % 2] -= delta;
                        }
    
                        t[l % 2] -= now - game.move[l - 1].time;
    
                        var status = "white";
                        if (t[0] < t[1]) status = "black";
                        else status = "white";
    
                        //game.reason = reason;
                        //game.gameend = now;
                        game.end(status,reason,{gameend:now});
                        game.update();
                    } else {
                        //game.reason = reason;
                        //game.gameend = now;
                        //game.status = 'ended';
                        game.end('ended',reason,{gameend:now});
                        game.update();
                        return;
                    }
    
                }
            }
            if (game.isActive()==false){
                    game.update();
    
                    if (Meteor.settings.useMysql) 
                        mysqlPool.getConnection(function(err, connection) {
                            if(err) {
                                console.log(err);
                                return;
                            }
        
                            var query1 = "UPDATE annuaire SET nb_parties = nb_parties + 1 WHERE login="
                                        + "'" + game.white() + "'";
        
                            var query2 = "UPDATE annuaire SET nb_parties = nb_parties + 1 WHERE login="
                                        + "'" + game.black() + "'";
        
        
                            //Meteor.users.update(  { _id : this.userId } , { $inc : {
                            //	'profile.gamesplayed' :  1 }});
        
        
                            console.log(query1, "\n", query2);
        
                            connection.query (query1, function(err, rows, fields) {
                                if (err) console.log (err);
                            });
        
                            connection.query (query2, function(err, rows, fields) {
                                if (err) console.log (err);
                            });
        
                            connection.release();
                    });
    
    
                    if ((game.status.reason != '') && (game.isPlaying()==false)) {
    
                        try {
                            var wp = Meteor.users.findOne({username : game.player_w});
                            var bp = Meteor.users.findOne({username : game.player_b});
                            var Kscore = 40;
                            var Wscore = 1;
                            var delta = wp.profile.level - bp.profile.level;
                            var proba = 1 / (1 + Math.pow (10, (-delta/400)));
                            var deltaw = 0;
                            var deltab = 0;
    
                            // Update meteor scores
                            if (game.status.value == 'white') {
                                Wscore = 1;
                            }
                            if (game.status.value == 'black') {
                                Wscore = 0;
                            }
                            if (game.status.value == 'draw') {
                                Wscore = 0.5;
                            }
    
                            // Update white player
                            deltaw = Math.ceil (Kscore * (Wscore - proba));
    
                            var wplevel = wp.profile.level + deltaw;
                            Meteor.users.update(wp._id, { $set : { 'profile.level' : wplevel }});
                            Meteor.users.update( wp._id  , { $inc : {'profile.gamesplayed' :  1 }});
    
                            // Update black player
                            deltab = Math.ceil (Kscore * ((1-Wscore) - (1-proba)));
    
                            var bplevel = bp.profile.level + deltab;
                            Meteor.users.update(bp._id, { $set : { 'profile.level' : bplevel }});
                            Meteor.users.update( bp._id  , { $inc : {'profile.gamesplayed' :  1 }});
    
                            // Update level traceability in Mongo DB
                            if (game.tournament == false)
                            {
                                var gasc = Games.findOne(gameId);
                                gasc.whitelevel = wplevel;
                                gasc.blacklevel = bplevel;
                                Games.update(gameId, gasc);
                            }
    
                            // Update mysql
                            if (Meteor.settings.useMysql)
                                mysqlPool.getConnection(function(err, connection) {
                                    if(err) {
                                        console.log(err);
                                        return;
                                    }
                                    var query3 = "UPDATE annuaire SET niveau_echecs = " + wplevel
                                                + " WHERE login=" + "'" + game.white() + "'";
        
                                    var query4 = "UPDATE annuaire SET niveau_echecs = " + bplevel
                                                + " WHERE login=" + "'" + game.black() + "'";
        
                                    console.log(query3, "\n", query4);
    
                                connection.query (query3, function (err, rows, fields) {
                                    if (err) console.log (err);
                                });
    
                                connection.query (query4, function (err, rows, fields) {
                                    if (err) console.log (err);
                                });
    
                                connection.release();
                            });
                        }
                        catch (e) {
                            console.log('error ', e);
                        }
                    } else {
    
                    }
    
                    //tournament
                    if (game && game.tournament == true) {
    
                        if (Meteor.settings.useMysql)
                        mysqlPool.getConnection(function(err, connection) {
                            if(err) {
                                console.log(err);
                                return;
                            }
    
                            console.log('update database for tournament');
                            var queryGame;
                            if (game.status.value != 'draw') {
                                var queryTournament1;
                                var queryTournament2;
                                if (game.status.value == 'white')  {
                                    queryTournament1 = "UPDATE confrontations set score_a = score_a + 2 where  id="+ game.tournamentId +" and school_a='" +game.school_white+"'";
                                    queryTournament2 = "UPDATE confrontations set score_b = score_b + 2 where  id="+ game.tournamentId +" and school_b='" +game.school_white+"'";
                                    queryGame= "UPDATE games set score=2 where id_game=" + game['game-id'];
    
                                } else {
                                    queryTournament1 = "UPDATE confrontations set score_a = score_a + 2 where  id="+ game.tournamentId +" and school_a='" +game.school_black+"'";
                                    queryTournament2 = "UPDATE confrontations set score_b = score_b + 2 where  id="+ game.tournamentId +" and school_b='" +game.school_black+"'";
                                    queryGame= "UPDATE games set score=3 where id_game=" + game['game-id'];
                                }
    
    
                                console.log('query=', queryTournament1, "\n query=", queryTournament2);
    
                                connection.query (queryTournament1, function (err, rows, fields) {
                                    if (err) console.log (err);
                                });
                                connection.query (queryTournament2, function (err, rows, fields) {
                                    if (err) console.log (err);
                                });
                            }
                            else {
                                var queryDraw = "UPDATE confrontations set score_a = score_a + 1 , score_b = score_b + 1 where id="+ game.tournamentId ;
                                queryGame= "UPDATE games set score=1 where id_game=" + game.matchId;
                                console.log('query=',queryDraw);
                                connection.query (queryDraw, function (err, rows, fields) {
                                    if (err) console.log (err);
                                });
                            }
    
    
                            console.log(queryGame);
                            connection.query (queryGame, function (err, rows, fields) {
                                if (err) console.log (err);
                            });
    
                            connection.release();
                        });
                    }
            }

        },
    offerdraw: function (gameId) {
        check(gameId, String);
    
            var user = Meteor.user();
            var reporter = (user) ? user.username : null;
            var game = manager.getGameWithMongoID(mongoId);
    
            var drawwhite = game.draww;
            var drawblack = game.drawb;
    
            if (game && (reporter == game.white())) {
                game.draww = drawwhite +1;
            }
            if (game && (reporter == game.black())) {
                game.drawb = drawblack +1;
            }
    
            game.update();
    
            console.log('draw offer', gameId, reporter);
    
            var drawpossible = true;
            if ((reporter == game.white()) && (drawwhite > 1)) {
                drawpossible = false;
            }
            if ((reporter == game.black()) && (drawblack > 1)) {
                drawpossible = false;
            }
    
            if ((game && game.isActive()) && (drawpossible))
            {
                var lastplayer = ((game.move.length % 2) == 0) ? 'black' : 'white';
                var turn = (lastplayer == 'white') ? 'black' : 'white';
    
                console.log(reporter, game[turn]);
    
                if (reporter == game[turn])
                {
                    var args = {};
                    args.gameId= gameId;
                    args.player = game[lastplayer];
                    var playerId = Meteor.users.findOne( {'username' :  game[lastplayer]})._id;
                    args.userId=playerId;
                    args.name ='drawoffer';
                    args.read = false;
                    Notifications.insert(args);
    
                var message = {}; 
                message.userId = this.userId; 
                message.name='technicalmessage';
                message.txt='proposition de nulle envoyee';
                message.read = false;
                Notifications.insert(message);
                }
            }
        },
    
        exportPGN : function(gameId) {
            check(gameId, String);
    
            var game = manager.getGameWithMongoID(gameId);
            var user = Meteor.user();
            var pgn={};
            if (game && user) {
                for (i=0; i < game.move.length ; i++) {
                    if (i%2==0) {
                        numMove = 1 + i/2;
                        pgn.txt =pgn.txt + ' ' + numMove.toString() + '.';
                    }
                    pgn.txt =  pgn.txt + ' ' + game.move[i].move;
                }
                console.log( 'PGN=', pgn);
            pgn.userId=this.userId;
            pgn.name='technicalmessage';    
            pgn.read = false;
            Notifications.insert(pgn);
            }
    
        },
    
    displayPGN : function(gameId) {
        check(gameId, String);
    
            let game = manager.getGameWithMongoID(gameId);
            let user = Meteor.user();
            var pgn='';
            if (game && user) {
                for (i=0; i < game.move.length ; i++) {
                    if (i%2==0) {
                        numMove = 1 + i/2;
                        pgn =pgn+ ' ' + numMove.toString() + '.';
                    }
                    pgn =  pgn + ' ' +  game.move[i].move;
                }
                return (pgn);
            }
    
        },
    
        moveBack : function(gameId) {
            console.log ('moveBack', gameId);
            check(gameId, String);
            let game = manager.getGameWithMongoID(gameId);
            game.move.pop();
            game.update();
        },
    
        resetGame : function(gameId, fen) {
            console.log ('resetGame', gameId);
    
            check(gameId, String);
            check(fen, String);
    
            let game = manager.getGameWithMongoID(gameId);
            game.reset();
            //console.log ("test42", game.Predefined, game.pgn.length);
        },
    
        updateHighlighted : function(gameId, s) {
            check(gameId, String);
            check(s, String);
    
            let game = manager.getGameWithMongoID(gameId);
            game.Highlighted = s;
            game.update();
        }
    
});