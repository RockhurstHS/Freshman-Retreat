import React from 'react';
import './Answer.css';

class Answer extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        console.log('answer clicked, locked = ' + this.props.lock);
        if(!this.props.lock) {
            const status = e.target.id === this.props.answer;
            this.props.callback(status);    
        }
    }

    render() {
        const {answer, a, b, c, d, lock, lockTimer} = this.props;
        let answerMarkup;
        if(lock) {
            answerMarkup=
            <div id="multiple-choice-container">
                <div className="mc-row">
                    <div className={"noselect answer " + (answer === 'A' ? 'correct' : 'wrong')} id="A" onClick={(e) => this.handleClick(e)}>(A) {a}</div>
                    <div className={"noselect answer " + (answer === 'B' ? 'correct' : 'wrong')} id="B" onClick={(e) => this.handleClick(e)}>(B) {b}</div>
                </div>
                <div className="mc-row">
                    <div className={"noselect answer " + (answer === 'C' ? 'correct' : 'wrong')} id="C" onClick={(e) => this.handleClick(e)}>(C) {c}</div>
                    <div className={"noselect answer " + (answer === 'D' ? 'correct' : 'wrong')} id="D" onClick={(e) => this.handleClick(e)}>(D) {d}</div>
                </div>
            </div>
        } else {
            answerMarkup =
            <div id="multiple-choice-container">
                <div className="mc-row">
                    <div className="noselect answer" id="A" onClick={(e) => this.handleClick(e)}>(A) {a}</div>
                    <div className="noselect answer" id="B" onClick={(e) => this.handleClick(e)}>(B) {b}</div>
                </div>
                <div className="mc-row">
                    <div className="noselect answer" id="C" onClick={(e) => this.handleClick(e)}>(C) {c}</div>
                    <div className="noselect answer" id="D" onClick={(e) => this.handleClick(e)}>(D) {d}</div>
                </div>
            </div>
        }
        return (
            answerMarkup
        )
    }
}

export default Answer;