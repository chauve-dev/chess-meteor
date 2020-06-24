import React from 'react';

export default class TheChessboard extends React.Component {

    componentDidMount() {
        var config = {
            pieceTheme: 'chesspieces/wikipedia/{piece}.png',
            position: 'start'
          }
          var board = ChessBoard('myBoard', config)
    }

    render() {
        return(
            <div>
                <div id="myBoard" style={{width: "400px"}}></div>
            </div>
        )
    }
}