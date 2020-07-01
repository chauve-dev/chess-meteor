import React from 'react';
import {
    withTracker
} from 'meteor/react-meteor-data';
import { Games } from '../../api/Games';


class GameList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            games: []
        }
    }

    componentDidUpdate(){
        console.log(this.props.games)
    }

    render() {
        let games = [];
        if(this.props.games != undefined){
            games = this.props.games
        }
        return (
            <div>
                <ul>
                    {
                        games.map((item, i) => <li key={i}><a href={'/games/'+item['game-id']}>{item['name']}</a></li>)
                    }
                </ul>
            </div>
        )
    }
}

const GameListsTK = withTracker(props => {

    if (Meteor.user()==null){
        return {user:null};
    }
    const gamesHandle = Meteor.subscribe('games.all', {});
    const loading = !gamesHandle.ready();

    let games = Games.find({}).fetch()
    return {
        games: games
    }
})(GameList);

export default GameListsTK;