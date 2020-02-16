// autoplay on ios not possible at this time
// https://stackoverflow.com/a/48442630

// sheet
// https://docs.google.com/spreadsheets/d/1gFBVScKExlatL52RSngKDOLfDGNEo4GebnuHMlVhmNE/edit#gid=0

// json
// https://spreadsheets.google.com/feeds/list/1gFBVScKExlatL52RSngKDOLfDGNEo4GebnuHMlVhmNE/od6/public/values?alt=json


import React from 'react';

import Question from './Question';
import Answer from './Answer';
import Spinner from './Spinner';

import './Game.css';

import Ignite from './ignite.jpg';

class Game extends React.Component {
    constructor(props) {
        console.log('construct game');
        super(props);
        this.state = {
            stage: 'intro', // [intro, quiz, end] /* todo: implement react router */
            error: null, // netcode
            isLoaded: false, // netcode
            entries: [], // stores json
            index: -1, // current question
            vplay: true,
            qlock: false, // a wrong answer locks the ability to answer for 30 secs
            qlockTimer: 0, // how long to pause if locked
        };

        //this.intervalHandle = setInterval(this.tick, 1000);
        this.receiveAnswer = this.receiveAnswer.bind(this);
        this.receiveVideoState = this.receiveVideoState.bind(this);
        this.advanceQuestion = this.advanceQuestion.bind(this);
    }

    componentDidMount() {
        console.log('game component did mount');
        const data = 'https://spreadsheets.google.com/feeds/list/1gFBVScKExlatL52RSngKDOLfDGNEo4GebnuHMlVhmNE/od6/public/values?alt=json';
        fetch(data)
        .then( res => res.json() )
        .then(
            (result) => {
                console.log(result);
                this.setState({
                    isLoaded: true,
                    entries: result.feed.entry
                })
            },
            (error) => {
                console.log(error);
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        )
    }

    receiveVideoState(dat) {
        console.log('receive video state');
        
        // event.data
        // 1 - playing
        // 2 - paused
        // 3 - scanning ahead
        // 0 - end of video reached
        switch(dat) {
            case 0:
                this.setState({ vplay: false })
                break;
            case 1:
                this.setState({ vplay: true })
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }
    }

    receiveAnswer(correct) {
        console.log('receive answer');
        // let { score, timer, question } = this.state;
        if(correct) {
            console.log('correct answer');
            this.setState({
                qlock: true,
                qlockTimer: 5
            })
        } else {
            console.log('wrong answer');
            this.setState({
                qlock: true,
                qlockTimer: 30
            })
        }
    }

    advanceQuestion() {
        console.log('advance question');
        let { stage, qlock } = this.state;
        qlock = false;
        stage = stage === 'intro' ? 'quiz' : stage;
        this.setState({
            stage,
            qlock,
            index: this.state.index + 1
        })
    }

    render() {
        console.log('render game');
        const { stage, error, isLoaded } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>
        } else if(!isLoaded) {
            return <div>Loading...</div>
        } else if(stage === 'quiz') {
            const { entries, index, vplay, qlock, qlockTimer } = this.state;
            let questionMarkup, answerMarkup;

            return (
                <div id="game">
                    <div className='embed-container'>
                        <div className="embed-overlay"></div>
                        <Question 
                            question={entries[index].gsx$question.$t}
                            vidurl={entries[index].gsx$youtube.$t}
                            type={entries[index].gsx$type.$t}
                            callback={this.receiveVideoState}
                        />
                        {qlock && <Spinner duration={qlockTimer} callback={this.advanceQuestion} />}
                    </div>
                    {!vplay && <Answer 
                        answer={entries[index].gsx$answer.$t}
                        a={entries[index].gsx$a.$t}
                        b={entries[index].gsx$b.$t}
                        c={entries[index].gsx$c.$t}
                        d={entries[index].gsx$d.$t}
                        callback={this.receiveAnswer}
                        lock={qlock}
                        lockTimer={qlockTimer}
                    />}
                </div>
            )
        } else if(stage === 'end') {
            return (
                <div id="end">
                    <div>All done :)</div>
                </div>
            )
        } else {
            return (
                <div id="intro">
                    <div className="vimg"></div>
                    <img src={Ignite} alt="Ignite Freshman Retreat" onClick={this.advanceQuestion} />
                </div>
            )
        }
    }
}

export default Game;
