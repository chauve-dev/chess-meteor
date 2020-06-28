import React from 'react';
import {
    withTracker
} from 'meteor/react-meteor-data';
import { Games } from '../../api/Games';


class TheChessboardUpdate extends React.Component{
    constructor(props){
        super(props);
        if (props.found==false){
            document.location.href="http://localhost:80/";
            return;
        }
    }
    render(){
        console.log(this.props.game);
        if (this.props.game.length<1){
            return (<div>{">"+this.props.gameExists}</div>);
        }else{
            return (<div>{"FEN: "+this.props.game[0].fen}</div>);
        }
    }

    componentDidUpdate(){
        console.log("Update 2 > "+this.props);
        if (this.props.game.length>=1){
            this.props.onUpdate(this.props.game[0]);
        }
        return true;
    }
}

const UpdateTracker = withTracker(props => {
    var game_id = props.id;
    const gamesHandle = Meteor.subscribe('games.withID', game_id);
    const loading = !gamesHandle.ready();
    console.log("UpdateTracker| "+game_id);
    var game = Games.find({'game-id':game_id}).fetch();
    console.log("UpdateTracker| = "+game);
    const gameExists = !loading && !!game;
    return {
        game: game,
        gameExists
    };

})(TheChessboardUpdate);

export default class TheChessboard extends React.Component {

    /**
     * {
     * userId: -
     * gameId: -
     * color: -
     * game: {}
     * }
     *
     */

    constructor(props) {
        super(props);

        this.state = { 
            board: null,
            game_id: props.id
        };
        this.onDrop = this.onDrop.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }  
    
    onUpdate(game){
        console.log("Update > ",game);
        if (this.state.board!=null){
            console.log("FEN1:",game.fen);
            this.state.board.position(game.fen);
        }
        
    }

    onDragStart (source, piece, position, orientation) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        console.log('Drag started:')
        console.log('Source: ' + source)
        console.log('Piece: ' + piece)
        console.log('Position: ' + Chessboard.objToFen(position))
        console.log('Orientation: ' + orientation)
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    }

    onDrop (source, target, piece, newPos, oldPos, orientation) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        console.log('Source: ' + source)
        console.log('Target: ' + target)
        console.log('Piece: ' + piece)
        console.log('New position: ' + Chessboard.objToFen(newPos))
        console.log('Old position: ' + Chessboard.objToFen(oldPos))
        console.log('Orientation: ' + orientation)
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        var self = this;
        Meteor.call('move', {
            game_id: this.state.game_id,
            source: source,
            target: target,
            piece: piece,
            position:  Chessboard.objToFen(newPos),
          }, (err, res) => {
            if (err) {
                alert(err);
            } else {
                console.log("Result's Move:",res);
            }
        });
        return 'snapback'
    }

    componentDidMount() {
        console.log("Load compoments");
        var self = this;
        Meteor.call('join', {game_id:this.state.game_id}, (err, res) => {
            if (err) {

            } else {

                var color = "white";
                if (res.currentPlayer.color=="b"){
                    color="black";
                }
                console.log(res);
                var config = {
                    draggable: true,
                    pieceTheme: '/img/chesspieces/wikipedia/{piece}.png',
                    orientation: color,
                    position: res.fen,
                    onDragStart: self.onDragStart,
                    onDrop: self.onDrop
                };
                self.state.board = ChessBoard('myBoard', config);
            }
        });

    }


    render() {
        return(
            
            <div>
                <UpdateTracker id={this.state.game_id}onUpdate={this.onUpdate}/>
                <div id="myBoard" style={{width: "400px"}}></div>
            </div>
        )
    }
}

