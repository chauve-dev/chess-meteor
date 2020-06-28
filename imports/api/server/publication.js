
import { Games } from '../Games';

Meteor.publish('games.all', function() {
    return Games.find({}, {
      fields: Games.publicFields
    });
});


Meteor.publish('games.withID', function(game_id) {
    return Games.find({'game-id':game_id},{
        fields: Games.publicFields
      });
});
