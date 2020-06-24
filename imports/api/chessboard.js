import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const HistoryCollection = new Mongo.Collection('history');



import { Chess } from 'chess.js';
const chess = new Chess();

console.log(chess.pgn());

Meteor.methods({
    'move'({ source, target , piece , position }) {
        console.log(source,position,piece);
        var move = chess.move({from:source,to:target,promotion:"q"});
        if(move != null){
            return chess.fen()
        }
        return null;
    },
    'getBoard'({}){
        return chess.fen();
    }
});