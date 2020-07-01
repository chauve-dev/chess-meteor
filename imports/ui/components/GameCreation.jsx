import React from 'react';

class GameCreation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nom: "",
            type: ""
        }
        
        this.handleName = this.handleName.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleName(event) {    
        this.setState({nom: event.target.value});
    }

    handleType(event) {    
        this.setState({type: event.target.value});
    }


    handleSubmit(event) {
        event.preventDefault();
        var self = this;
        Meteor.call('create', {nom: this.state.nom, type: this.state.type}, 
        (err, res) => {
            if(err) return;
            if(!res) return;
            console.log('/games/'+res)
            window.location.href='/games/'+res
        });
      }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Nom :
                    <input type="text" value={this.state.nom} onChange={this.handleName} />
                    </label>
                    <label>Type :
                    <input type="text" value={this.state.type} onChange={this.handleType} />
                    </label>
                    <input type="submit" value="Création de la partie" />
                </form>
            </div>
        )
    }
}

export default GameCreation;