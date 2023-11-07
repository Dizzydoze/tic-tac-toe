import {useState} from 'react'
import './style.css';

/**
 * Square component, the basic structure in our program
 * @param value content showed on button
 * @param onSquareClick the function being called when button is clicked
 * @returns {JSX.Element}
 */
function Square({value, onSquareClick}){
  return (
      <button className='square' onClick={onSquareClick}>
        {value}
      </button>
  )
}

/**
 * Board component, a parent who wrapped the Square component and help to change Square status with useState
 * @param xIsNext  taking turns, ('X')true with even move, ('O')false with odd move.
 * @param squares
 * @param onPlay
 * @returns {JSX.Element}
 * @constructor
 */
function Board({xIsNext, squares, onPlay}){
    function handleClick(i){
        if (calculateWinner(squares)||squares[i]){
            return;
        }
        const nextSquares = squares.slice();
        if(xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O')
    }
    // 3 rows, each row contains 3 Square components
    // currentSquares is sent in, Square components update their value with it
    // function handleClick is sent in as an argument, it will only be called if onClick event happens
    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)}></Square>
                <Square value={squares[1]} onSquareClick={() => handleClick(1)}></Square>
                <Square value={squares[2]} onSquareClick={() => handleClick(2)}></Square>
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)}></Square>
                <Square value={squares[4]} onSquareClick={() => handleClick(4)}></Square>
                <Square value={squares[5]} onSquareClick={() => handleClick(5)}></Square>
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)}></Square>
                <Square value={squares[7]} onSquareClick={() => handleClick(7)}></Square>
                <Square value={squares[8]} onSquareClick={() => handleClick(8)}></Square>
            </div>
        </>
    );
}

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Game(){
    // initial state of history, an array with only one element which is an array filled with 9 null
    const [history, setHistory] = useState([Array(9).fill(null)])
    // currentMove is current index of the history, it is 0 when the game start
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    // get currentSquares by currentMove of history
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        // next history will be current slice from 0 to current move(+1 for exclusive) plus current version of squares
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        // update history state, React will re-render
        setHistory(nextHistory);
        // update curentMove, current move will always be the latest version in the history, the last element in the array
        setCurrentMove(nextHistory.length - 1)
    }

    /**
     * jump to previous version of the game, simply just set the index currentMove
     * @param nextMove
     */
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        // when onClick event happens, jumpTo will be called with move as an argument
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });
    // Board component starts with uppercase
    // send in currentSquares for Board component to update the state
    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}></Board>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

/**
 * Calculate whether there's a winner with checking all winner situations
 * @param squares
 * @returns {*|null}
 */
function calculateWinner(squares) {
    // enum all winner situations
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
