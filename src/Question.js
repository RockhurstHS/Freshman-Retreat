import React from 'react';
import YouTube from 'react-youtube';
import './Question.css';

class Question extends React.Component {
    constructor(props) {
        console.log('construct question');
        super(props);
        this.state = {
            overlay: 'noclick', // 'noclick', 'question'
        }
        this.onReady = this.onReady.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }

    onReady(event) {
        console.log('video ready');
        event.target.playVideo();
    }

    onStateChange(event) {
        console.log('video state change: ' + event.data);
        this.props.callback(event.data)

        // event.data
        // 1 - playing
        // 2 - paused
        // 3 - scanning ahead
        // 0 - end of video reached

        let overlay = event.data === 0 ? 'question' : 'noclick';
        this.setState({ overlay })
    }

    render() {
        console.log('render question');
        console.log('state overlay = ' + this.state.overlay);

        let { question, vidurl } = this.props;
        let videoMarkup, questionMarkup, opts;

        opts = {
            playerVars: {           // https://developers.google.com/youtube/player_parameters
                autoplay: 1,        // auto play, yes
                controls: 0,        // disable ui controls
                disablekb: 1,       // disable keyboard controls
                fs: 0,              // no full screen
                modestbranding: 1,  // small logo
                rel: 0,             // no related videos
                playsinline: 1,     // no ios auto fullscreen
                showinfo: 0,        // hide video info (deprecated)
                iv_load_policy: 3   // remove annotations
            }
        }

        videoMarkup = 
        <YouTube 
            videoId={vidurl.substring(17)}
            opts={opts}
            onReady={this.onReady}
            onStateChange={this.onStateChange}
        />

        if(this.state.overlay === 'noclick') {
            questionMarkup = <div className="embed-overlay"></div>

        } else if(this.state.overlay === 'question') {
            questionMarkup =
            <div className="embed-overlay">
                <div className="question">
                    {question}
                </div>
            </div>
        }
        
        return (
            <div id="question-panel">
                {videoMarkup}
                {questionMarkup}
            </div>
        )
    }
}

export default Question;


