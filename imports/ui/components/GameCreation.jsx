import React from 'react';
import {
    withTracker
} from 'meteor/react-meteor-data';


class GameCreation extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate(){
    }

    render() {
        return (
            <div>
                <ul>
                    <a>Création de game</a>
                </ul>
            </div>
        )
    }
}

export default GameCreation;