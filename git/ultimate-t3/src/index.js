import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Game extends React.Component {
  state = {
    subBoards: new Array(9).fill(null).map(() => ({
      squares: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      winner: null,
    })),
    activeBoardIndex: -1,
    xIsNext: true,
    winner: "",
  };

  render() {
    let status;
    if (this.state.winner) {
      status = "The winner is " + this.state.winner + "!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <>
        {status}
        <Board
          subBoards={this.state.subBoards}
          activeBoardIndex={this.state.activeBoardIndex}
          onClick={(s, r, c) => this.onClick(s, r, c)}
        />
      </>
    );
  }

  onClick(s, r, c) {
    const { subBoards, xIsNext } = this.state;
    const squares = subBoards[s].squares;

    // Validation: make sure move is legal before proceeding
    if (squares[r][c]) return; //if square is filled
    if (
      !(this.state.activeBoardIndex === -1 || this.state.activeBoardIndex === s)
    )
      return; //if not an active board OR if the subbboard is not the curernt active board
    if (this.state.winner) return; //if someone has already won
    if (checkFullBoard(subBoards[3* r + c].squares)) return;

    squares[r][c] = xIsNext ? "X" : "O"; //set square to x or o depending on who is next

    if (calculateWinner(squares) && !subBoards[s].winner) {
      //check for a winner
      subBoards[s].winner = xIsNext ? "X" : "O";
    }

    if (calculateOverallWinner(this.state.subBoards)) {
      //check for an overall winner
      this.setState({
        winner: calculateOverallWinner(this.state.subBoards),
      });
    }

    this.setState({
      subBoards,
      xIsNext: !xIsNext,
      activeBoardIndex: (this.state.winner=== "") ? 3 * r+c : -1,
    });
  }
}

class Board extends React.Component {
  render() {
    return (
      <div>
        {this.props.subBoards.map((subBoard, s) => (
          <>
            <SubBoard
              squares={subBoard.squares}
              active={
                this.props.activeBoardIndex === s ||
                this.props.activeBoardIndex === -1
              }
              winner={subBoard.winner}
              onClick={(r, c) => this.props.onClick(s, r, c)}
            />
            {s % 3 === 2 && <br />}
          </>
        ))}
      </div>
    );
  }
}

class SubBoard extends React.Component {
  render() {
    return (
      <div className="sub-board-container">
        <div className={`sub-board ${this.props.active ? "active" : ""}`}>
          {this.props.squares.map((row, r) => (
            <div className="sub-board-row">
              {row.map((square, c) => (
                <Square
                  value={square}
                  onClick={() => this.props.onClick(r, c)}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="winner-overlay">{this.props.winner}</div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    //
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    //
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [[ar, ac], [br, bc], [cr, cc]] = lines[i];
    if (
      squares[ar][ac] &&
      squares[ar][ac] === squares[br][bc] &&
      squares[ar][ac] === squares[cr][cc]
    ) {
      return squares[ar][ac];
    }
  }
  return null;
}

function calculateOverallWinner(subBoards) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      subBoards[a].winner &&
      subBoards[a].winner === subBoards[b].winner &&
      subBoards[a].winner === subBoards[c].winner
    ) {
      return subBoards[a].winner;
    }
  }
  return null;
}

function checkFullBoard(subBoard) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!subBoard[i][j]) {
        return false;
      }
    }
  }
  return true;
}

ReactDOM.render(<Game />, document.getElementById("root"));
