import React from 'react';

export default class TheChessboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            board: null 
        };
        this.onDrop = this.onDrop.bind(this);
    }

    onDragStart (source, piece, position, orientation) {
        console.log('Drag started:')
        console.log('Source: ' + source)
        console.log('Piece: ' + piece)
        console.log('Position: ' + Chessboard.objToFen(position))
        console.log('Orientation: ' + orientation)
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    }

    onDrop (source, target, piece, newPos, oldPos, orientation) {
        console.log('Source: ' + source)
        console.log('Target: ' + target)
        console.log('Piece: ' + piece)
        console.log('New position: ' + Chessboard.objToFen(newPos))
        console.log('Old position: ' + Chessboard.objToFen(oldPos))
        console.log('Orientation: ' + orientation)
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        var self = this;
        Meteor.call('move', {
            source: source,
            target: target,
            piece: piece,
            position:  Chessboard.objToFen(newPos),
          }, (err, res) => {
            if (err) {
                alert(err);
            } else {
                console.log("Result's Move:",res);
                if (res!=null){
                    self.state.board.position(res);
                }
            }
        });
        return 'snapback'
    }

    componentDidMount() {


        var self = this;
        Meteor.call('getBoard', {}, (err, res) => {
            if (err) {
                alert(err);
            } else {
                var config = {
                    draggable: true,
                    position: res,
                    onDragStart: self.onDragStart,
                    onDrop: self.onDrop
                };
                self.state.board = ChessBoard('myBoard', config);
            }
        });

        setInterval(() => {
            Meteor.call('getBoard', {}, (err, res) => {
                if (err) {
                    alert(err);
                } else {
                    if (self.state.board.fen().indexOf(res)==-1){
                        self.state.board.position(res)
                    }
                }
            });
        }, 250);
    }


    render() {
        return(
            <div>
                <div id="myBoard" style={{width: "400px"}}></div>
            </div>
        )
    }
}