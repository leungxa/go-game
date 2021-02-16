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
    board.push(row)
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

  board[rowIndex][cellIndex] = currPlayer
  let seen = new Set()

  const hasExit = (rowIndex, cellIndex) => {
    const key = `${rowIndex},${cellIndex}`
    // already checked this location - skip
    if (seen.has(key)) return
    const currentVal = board[rowIndex][cellIndex]
    console.log(currentVal, rowIndex, cellIndex)
    // return false if there is no path forward
    if(currentVal === currPlayer || currentVal == null) {
      return false
    }
    if(currentVal === BOARD_EMPTY) {
      return true
    }
    seen.add(key)
    let foundLeft, foundRight, foundUp, foundDown
	  if(rowIndex > 0) {foundLeft = hasExit(rowIndex-1,cellIndex)}
    if(rowIndex < BOARD_SIZE-1) {foundRight = hasExit(rowIndex+1, cellIndex)}
    if(cellIndex > 0) {foundDown = hasExit(rowIndex,cellIndex-1)}
    if(cellIndex < BOARD_SIZE-1) {foundUp = hasExit(rowIndex,cellIndex+1)}
    return foundLeft || foundRight || foundDown || foundUp
  }

  // check left for enemy piece
  // check top for enemy piece
  // check right for enemy piece
  // check bottom for enemy piece

  const isEnemyPlayer = (value) => value !== BOARD_EMPTY && value !== currPlayer


  let positionsToCheck = []

  if (rowIndex-1 > 0) {
    positionsToCheck.push([rowIndex-1, cellIndex])
  }
  if (rowIndex+1 < BOARD_SIZE) {
    positionsToCheck.push([rowIndex+1, cellIndex])
  }
  if (cellIndex-1 > 0) {
    positionsToCheck.push([rowIndex, cellIndex-1])
  }
  if (cellIndex+1 < BOARD_SIZE) {
    positionsToCheck.push([rowIndex, cellIndex+1])
  }
  console.log('posToCheck', positionsToCheck)
  positionsToCheck.forEach(([posRow, posCell]) => {
    let token = board[posRow][posCell]
    console.log('checking', posRow, posCell, isEnemyPlayer(token))
    if (isEnemyPlayer(token)) { 
      seen = new Set()
      console.log('checking exit')
      let captured = !hasExit(posRow, posCell)
      console.log('seen', seen)
      console.log('captured?', captured, posRow, posCell)
      if (captured) {
        seen.forEach((seenValue) => {
          let [ri, ci] = seenValue.split(',')
          if (isEnemyPlayer(board[ri][ci])) {
            board[ri][ci] = currPlayer
          }
        })
      }
    }
  })
  



  return board
} 

const DisplayBoard = () => {
  const [board, setBoard] = useState(createBoard());
  const [currPlayer, setCurrPlayer] = useState(BOARD_BLACK)
  const placePiece = (rowIndex, cellIndex) => {
    if (board[rowIndex][cellIndex] === BOARD_EMPTY) {
      // let newBoard = [...board]
      // board[rowIndex][cellIndex] = currPlayer
      let newBoard = checkCapture(rowIndex,cellIndex, currPlayer, board)
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
