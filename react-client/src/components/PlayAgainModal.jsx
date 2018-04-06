import React from 'react';
import { connect } from 'react-redux';
import { Modal, Dropdown, Button } from 'semantic-ui-react';

class PlayAgainModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      option: null,
      openPlayAgain: false,
      openOpponentAgain: false
    }
  }

  componentDidMount() {
    // only do this if not a spectator
    (async () => {
      let socket = await this.props.socket;
      let count = 0;
      if (socket) {
        socket.on('openPlayAgainModal', () => {
          console.log('in openPlayAgainModal')
          if (count === 0) {
            this.setState({
              openPlayAgain: true
            })
          }
          count += 1;
        });
        socket.on('sameOpponent', () => {
          console.log('in same opponent')
          this.setState({
            openPlayAgain: false,
            openOpponentAgain: true
          });
        });
        socket.on('opponentLeft', () => {
          console.log('inopponentLeft');
          this.setState({
            openOpponentLeft: true
          })
        }) 
        socket.on('replay', () => {
          this.setState({
            openPlayAgain: false,
            openOpponentAgain: true
          })
        })    
      }
    })();
  }

  setValue(e, data) {
    this.setState({
      option: data.value
    })
  }
  
  handleClose(name) {
    
    this.setState({
      openPlayAgain: false
    }, () => {
      console.log('this.state.openPlayAgain', this.state.openPlayAgain);
    })
  }

  redirect(){
    this.setState({
      openPlayAgain: false
    }, () => {
      this.props.socket.emit('saveExit', {room: this.props.room});
    })
  }

  playRematch() {
    console.log('in playRematch')
    this.setState({
      openOpponentAgain: false
    }, () => {
      console.log('this.state.openOpponentAgain')
      this.props.socket.emit('rematch', {room: this.props.room})
    })
  }

  handleSubmit() {
    this.setState({
      openPlayAgain: false
    }, () => {
      console.log('this.state.openPlayAgain', this.state.openPlayAgain)
      // this.props.socket.emit('postGameOption', {
      //   option: this.state.option,
      //   room: this.props.room
      // });
    })
  }

  // App component handles all redirections based on path options below
  // switch first route to Profile to see profile
  render() {
    const dropDown = [
      {
       text: 'Play with the same opponent',
       value: 'sameOpponent' 
      },
      {
        text: 'Choose a different opponent',
        value: 'differentOpponent'
      },
      {
        text: 'No thanks',
        value: 'no'
      }
    ]
    return (
      <div>
        <Modal open={this.state.openPlayAgain} size={'mini'} >
          <Modal.Header>Would you like to play again?</Modal.Header>
          <Modal.Content>
            {/* <Dropdown 
              placeholder='Select option'
              options={dropDown}
              onChange={this.setValue.bind(this)}
              selection
              value={this.state.option}
            /> */}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => { this.handleClose()}} >Submit</Button>
          </Modal.Actions>
        </Modal>
        <Modal open={this.state.openOpponentAgain} size={'mini'}>
          <Modal.Header >
            Your opponent would like a rematch
          </Modal.Header>
          <Modal.Actions>
              <Button 
                onClick={() => {this.handleClose('openOpponentAgain'); this.redirect();}}
                >No Thanks
              </Button>
            <Button 
              onClick={() => {this.playRematch();}}
              >PlayAgain
              </Button> 
          </Modal.Actions>
        </Modal>  
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    socket: state.state.socket,
    room: state.state.room
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators({  }, dispatch);
}

export default connect(mapStateToProps, null)(PlayAgainModal);