import React from 'react';
import {
    withTracker
} from 'meteor/react-meteor-data';
import TheChessboardContainer from '../TheChessboard';
import { Games } from '../../api/Games';


class GamePage extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {

        var name= "Visiteur";
        var main = (<h1>not found with {this.props.game_id}</h1>);
        if (this.props.user==null){
            return <h1>Not connected</h1>
        }
        name = "UserName: "+this.props.user.username;
        if (this.props.found){
            main = <TheChessboardContainer id={this.props.game_id}></TheChessboardContainer>
        }


        return (
            <section id = "menu" > 
            <h1>{name}</h1>
            {
                main
            } 
            </section>
        )
    }
}
var count = 0;
const GameContainer = withTracker(props => {

    if (Meteor.user()==null){
        return {user:null};
    }
    console.log(count+"|Game| join game with "+props.match.params.id)
    var game_id = props.match.params.id;
    const gamesHandle = Meteor.subscribe('games.withID', game_id);
    const loading = !gamesHandle.ready();
    var game = Games.find({'game-id':game_id}).fetch();
    return {
        game_id: game_id,
        found: (game.length>=1),
        user: Meteor.user(),
    };      

})(GamePage);

export default GameContainer;