import React from 'react';

export default class TheChessboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            board: null 
        };
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
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        return 'snapback'
    }

    componentDidMount() {
        var config = {
            draggable: true,
            position: 'start',
            onDragStart: this.onDragStart,
            onDrop: this.onDrop
            }

        this.state.board = ChessBoard('myBoard', config)
    }


    render() {
        return(
            <div>
                <div id="myBoard" style={{width: "400px"}}></div>
            </div>
        )
    }
}