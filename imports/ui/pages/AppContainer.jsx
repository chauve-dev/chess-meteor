import React from 'react';
import {
    withTracker
} from 'meteor/react-meteor-data';
import AccountsUIWrapper from '../AccountsUIWrapper';
import GameListsTK from '../components/GameList';
import GameCreation from '../components/GameCreation';


class CoreRoot extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {

        var main = <h1> Bonjour visiteur </h1>

        if (this.props.user != null) {
            main = <h1> Bonjour {this.props.user.username} </h1>
        }

        return (<div>
            <AccountsUIWrapper/>
            <section id = "menu" > 
            {
                main
            } 
            </section>
            <GameCreation />
            <GameListsTK />
            </div>
        )
    }
}
const AppContainer = withTracker(props => {
    return {
        user: Meteor.user(),
    };
})(CoreRoot);

export default AppContainer;