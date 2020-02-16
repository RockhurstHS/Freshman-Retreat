import React from 'react';
import './ScoreTimer.css';

class ScoreTimer extends React.Component {
    render() {
        if(this.props.lock) {
            return <div id="progress-holder" className="bgred"><progress className="progress-red" value={this.props.score} max={this.props.max}></progress></div>
        } else {
            return <div id="progress-holder"><progress value={this.props.score} max={this.props.max}></progress></div>
        }
    }
}

export default ScoreTimer;