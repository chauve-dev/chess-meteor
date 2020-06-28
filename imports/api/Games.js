import { Mongo } from 'meteor/mongo';
//import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//import { Factory } from 'meteor/factory';

export const Games = new Mongo.Collection('Games');


// Empecher le client de d'insert, update ou de remove
Games.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

/*

Games.schema = new SimpleSchema({
  'game-id': { type: String },
  'player-w': { type: String },
  'player-b': { type: String },
  'timer-w': { type: Number },
  'timer-b': { type: Number},
  'fen' : {type: String},
  'turn': {type: String},
  'move': {type: Array}
});
*/

//Games.attachSchema(Games.schema);

Games.publicFields = {
    'game-id': 1,
    'player-w': 1,
    'player-b': 1,
    'timer-w': 1,
    'timer-b': 1,
    'fen' : 1,
    'turn': 1,
    'move': 1,
    'name': 1
};
