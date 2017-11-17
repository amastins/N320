//import necessities
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//create grid component & its squares
function Grid(props) {
    return (
        <button className="boardSQ" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

//creates the game board and grid
class Board extends React.Component {
    renderGrid(i) {
        return (
            <Grid
                value={this.props.boardSQ[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    //sets the numbers that will come into play in determining a winner/loser
    render() {
        return (
            <div>
                <div className="row">
                    {this.renderGrid(0)}
                    {this.renderGrid(1)}
                    {this.renderGrid(2)}
                </div>
                <div className="row">
                    {this.renderGrid(3)}
                    {this.renderGrid(4)}
                    {this.renderGrid(5)}
                </div>
                <div className="row">
                    {this.renderGrid(6)}
                    {this.renderGrid(7)}
                    {this.renderGrid(8)}
                </div>
            </div>
        );
    }
}

//sets up the Game component;
class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [
                {
                    boardSQ: Array(9).fill(null)
                }
            ],
            stepNum: 0,
            IsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNum + 1);
        const current = history[history.length - 1];
        const boardSQ = current.boardSQ.slice();
        if (findWinner(boardSQ) || boardSQ[i]) {
            return;
        }
        boardSQ[i] = this.state.IsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    boardSQ: boardSQ
                }
            ]),
            stepNum: history.length,
            IsNext: !this.state.IsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNum: step,
            IsNext: (step % 2) === 0
        });
    }

//see what move is up & making sure the previous moves are kept
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNum];
        const winner = findWinner(current.boardSQ);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Back to move #' + move :
                'Restart';
            return (
                <li key={move}>
                    <button className="button" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

//check for winner or let next player know they're up
        let status;
        if (winner) {
            status = "And the winner is... " + winner + "!";
        } else {
            status = "You're up: " + (this.state.IsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="board">
                    <Board
                        boardSQ={current.boardSQ}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="info">
                    <div className="generalText">{status}</div>
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

//find the winner as well as what combinations result in a win
ReactDOM.render(<Game />, document.getElementById("root"));

function findWinner(boardSQ) {
    const waysToWin = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < waysToWin.length; i++) {
        const [a, b, c] = waysToWin[i];
        if (boardSQ[a] && boardSQ[a] === boardSQ[b] && boardSQ[a] === boardSQ[c]) {
            return boardSQ[a];
        }
    }
    return null;
}
