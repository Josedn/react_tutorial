import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let className = "square";
  if (props.darkened) {
    className += " dark";
  }
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        darkened={this.props.winnerSquares.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(i * 3 + j))
      }
      rows.push(<div key={i} className="board-row">{squares}</div>);
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        action: "game start"
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        action: squares[i] + " on " + i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleOrder() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let actualMoves = this.state.isAscending ? history : history.slice().reverse();

    const moves = actualMoves.map((step, move) => {
      const desc = 'Go to ' + step.action;

      let button =
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>
          {desc}
        </button>
      </li>;

      if (this.state.stepNumber === move) {
        button = <strong key={button.key}>{button}</strong>
      }
      return button;
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winner ? winner.squares : []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br/>
          <div><a role="button" tabIndex={0} className="link" onClick={() => this.toggleOrder()}>{this.state.isAscending ? "Ascending" : "Descending"}</a></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let winner = null;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if (winner == null) {
        winner = { winner: squares[a], squares: lines[i] }
      } else {
        winner.squares.concat(lines[i]);
      }
    }
  }
  return winner;
}
