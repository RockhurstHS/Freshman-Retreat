import React from 'react';
import Sketch from 'react-p5';

class Spinner extends React.Component {
    x = 0;
    y = 0;
    w = 50;
    h = 50;
    m = 0;
    offset = 20;
    paused = false;
    mark = 0;
    wait = 1000;
    degree = 45;
    count = 0;

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.advance = this.advance.bind(this);
        this.degree = 360 / props.duration;
        this.count = props.duration;
    }

    handleClick(e) {
        this.paused = !this.paused;
    }

    advance() {
        this.props.callback();
    }

    setup = (p5, canvasParent) => {
        const canvasW = document.getElementsByClassName('embed-container')[0].offsetWidth;
        const canvasH = document.getElementsByClassName('embed-container')[0].offsetHeight;
        p5.createCanvas(canvasW, canvasH).parent(canvasParent);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(p5.width / 25);
        this.x = p5.width/2;
        this.y = p5.height/2;
        this.w = p5.width / 4;
        this.h = p5.width / 4;
    }

    draw = p5 => {
        p5.clear();
        p5.fill(0, 0, 255);
        p5.ellipse(this.x, this.y, this.w, this.h);
        p5.fill(255, 0, 0);
        p5.arc(this.x, this.y, this.w, this.h, p5.radians(0), p5.radians(this.m));
        p5.fill(255);
        p5.ellipse(this.x, this.y, this.w-this.offset, this.h-this.offset);
        p5.fill(0);
        p5.text(this.count, this.x, this.y);

        if(p5.millis() - this.mark > this.wait) {
            this.mark = p5.millis();
            this.m += this.degree;
            this.count--;
        }

        if(this.m >= 360) {
            this.advance();
        }
    }

    mouseClicked = p5 => {
        const click = p5.dist(this.x, this.y, p5.mouseX, p5.mouseY);
        if(click < p5.dist(this.x, this.y, this.w-this.offset, this.h-this.offset)) {
            this.advance();
        }
    }

    render() {
        return <Sketch setup={this.setup} draw={this.draw} mouseClicked={this.mouseClicked} />;
    }
}

export default Spinner;