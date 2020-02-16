import React from 'react';
import './Counter.css';

function Counter(props) {
    const value = props.value;
    const max = props.max;
    const score = props.score;
    const date = new Date();
    return (
        <div id="counter">
            <h1>Freshman Retreat {date.getFullYear()}</h1>
            <h2>Question {value + 1}</h2>
            <div id="correct">Correct: {value}</div>
            <div id="possible">Possible: {max}</div>
            <div id="score">Score: {score}</div>
            <progress value={value} max={max}></progress>
        </div>
    )
}

export default Counter;