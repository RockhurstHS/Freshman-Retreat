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
import TrashCan from './TrashCan';

import './Game.css';

import Ignite from './ignite.jpg';

class Game extends React.Component {
    constructor(props) {
        console.log('construct game');
        
        super(props);

        this.state = {
            stage: 'intro',     // [intro, quiz, end] /* todo: implement react router */
            error: null,        // netcode
            isLoaded: false,    // netcode
            entries: [],        // stores json
            index: -1,   // current question (last=14)
            vplay: true,        // video is playing
            qlock: false,       // disable multiple choice answer clicks
            qlockTimer: 0,      // duration of answer click disable
        };

        this.receiveAnswer = this.receiveAnswer.bind(this);
        this.receiveVideoState = this.receiveVideoState.bind(this);
        this.advanceQuestion = this.advanceQuestion.bind(this);
    }

    componentDidMount() {
        console.log('game component did mount');
        
        // 2019-20 const data = 'https://spreadsheets.google.com/feeds/list/1gFBVScKExlatL52RSngKDOLfDGNEo4GebnuHMlVhmNE/od6/public/values?alt=json';
        const data = 'https://spreadsheets.google.com/feeds/list/1E0PWGXusSh5FF-mqHTcoR9wHuveyTYTLEKrnFIxCfFA/od6/public/values?alt=json';

        // todo: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
        let i = parseInt(localStorage.getItem('index')) - 1;
        if(i === NaN) console.log('nan');
        if(i === null) console.log('null');
        if(i !== NaN && i !== null ) {
            //console.log('localStorage.getItem("index") === ' + i);
            //this.setState({ index: i });
        }


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

        let stage = this.state.stage;
        let index = this.state.index + 1;
        const entries = this.state.entries;
        const type = entries[index].gsx$type.$t;
        
        if (type === 'E') 
            stage = 'end'
        else if (type === 'V' && stage === 'intro') 
            stage = 'quiz';

        this.setState({
            stage,
            index,
            qlock: false,
            vplay: true
        })

        //localStorage.setItem('index', index);
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

            return (
                <div id="game">
                    <div className='embed-container'>
                        <div className="embed-overlay"></div>
                        <Question 
                            question={entries[index].gsx$question.$t}
                            vidurl={entries[index].gsx$youtube.$t}
                            type={entries[index].gsx$type.$t}
                            callback={this.receiveVideoState}
                            index={index}
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
                    <TrashCan />
                </div>
            )

        } else if(stage === 'end') {
            const {entries, index} = this.state;
            const question = entries[index].gsx$question.$t;
            localStorage.clear('index');
            return (
                <div id="end">
                    <div id="end-message">
                        <h1>{question}</h1>
                    </div>
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
