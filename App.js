import "./styles.css";
import { useState } from 'react';

const BOARD_SIZE = 19;
const BOARD_EMPTY = 0;
const BOARD_BLACK = 1;
const BOARD_WHITE = 2;

const createBoard = () => {
  let board = []
  for(let i=0; i<BOARD_SIZE; i++) {
    let row = []
    for(let j=0; j<BOARD_SIZE; j++) {
      row.push(BOARD_EMPTY);
    }
    board.push(row);
  }
  return board
}


const CellDisplay = (props) => {
  return (
    <div className="Cell" onClick={props.onClick}>
      {props.value || '·'}
    </div>
  )
}

const checkCapture = (rowIndex, cellIndex, currPlayer, board) => {

} 

const DisplayBoard = () => {
  const [board, setBoard] = useState(createBoard());
  const [currPlayer, setCurrPlayer] = useState(BOARD_BLACK)
  const placePiece = (rowIndex, cellIndex) => {
    if (board[rowIndex][cellIndex] === BOARD_EMPTY) {
      let newBoard = [...board]
      newBoard[rowIndex][cellIndex] = currPlayer
      checkCapture(rowIndex,cellIndex, currPlayer, board)
      setBoard(newBoard)
      let newCurrPlayer = currPlayer === 1 ? 2 : 1
      setCurrPlayer(newCurrPlayer)
    }
  }

  return (
    <div>
    <p> Current Player: {currPlayer === 1 ? 'Black' : 'White'} </p>
    {board.map((row, index) => {
      return (
        <div className="Row" key={`row${index}`}>
          {row.map((cell, cellIndex) => (
            <CellDisplay key={`row${index}cell${cellIndex}`}
            onClick={() => placePiece(index, cellIndex)} value={cell}/>
          ))}
        </div>
      )
    })}
    </div>
  )
}

export default function App() {
  return (
    <div className="App">
      <h1>GO GAME</h1>
      <DisplayBoard/>
    </div>
  );
}
