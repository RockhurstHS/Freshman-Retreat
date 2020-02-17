import React from 'react';
import './TrashCan.css';

class TrashCan extends React.Component {
    constructor(props) {
        super(props);
        this.clear = this.clear.bind(this);
    }

    clear() {
        console.log('clear local index');
        localStorage.clear('index');
    }

    render() {
        return (
            <div id="trash-can" onClick={this.clear}>Clear Storage</div>
        )
    }
}

export default TrashCan;