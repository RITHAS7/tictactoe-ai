import { useState, useEffect, useRef } from 'react'
import './App.css'
import Dropdown from './components/dropdown';

const winLines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ]

function Square({value, setSquareClick, textColor}) {
  return (
    <button className='square' style={{backgroundColor:textColor,}} onClick={setSquareClick}>{value}</button>
  );
}

export default function App() {
  const [xIsNext, setXIsNext] = useState(true)
  const [winColor, setWinColor] = useState(Array(9).fill(null))
  const [heading, setHeading] = useState(`Your Turn`)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [difficulty, setDifficulty] = useState('easy')
  const headRef = useRef()

  function resetGame(difficulty) {
    setHistory([Array(9).fill(null)])
    setWinColor(Array(9).fill(null))
    difficulty === 'two' ? setHeading("X's Turn") : setHeading("Your Turn")
    setXIsNext(true)
    headRef.current.classList.contains('win') && headRef.current.classList.remove('win')
    headRef.current.classList.contains('lost') && headRef.current.classList.remove('lost') 
    headRef.current.classList.contains('draw') && headRef.current.classList.remove('draw') 
  }

  function getEasyAIMove() {
    let currentBoard = history[history.length - 1]
      while (true) {
        let num = Math.floor(Math.random() * 9)
        if (!currentBoard[num]) {
          return num;
        }
    }
  }

  function aboutToWin(char) {
    let currentBoard = history[history.length - 1]
    let toWinLines = []
    for (let line of winLines) {
      let count = 0
      for (let x of line) {
        if (currentBoard[x] === char) {
          count++
        } else if (currentBoard[x] !== null) {
          count--
        }
      }
      if (count === 2) {
        toWinLines.push(line)
      }
    }
    if (toWinLines.length!== 0) {
      return toWinLines
    } else {
      return null
    }
  }

  function checkCorners() {
    const corners = [0,2,6,8]
    let currentBoard = history[history.length - 1]
    for (let corner of corners) {
      if (currentBoard[corner] === null) {
        return corner
      }
    }
    return null
  }

function getMidAIMove() {
  let currentBoard = history[history.length - 1]
  let O_toWin = aboutToWin("O")
  let X_toWin = aboutToWin("X")
  let corner = checkCorners()

  if (O_toWin !== null) {
    for (let posn of O_toWin[0]) {
      if (currentBoard[posn] === null) {
        return posn
      }
    }
  } else if (X_toWin !== null) {
    for (let posn of X_toWin[0]) {
      if (currentBoard[posn] === null) {
        return posn
      }
    }
  } else if (currentBoard[4] === null){
    return 4
  } else if (corner !== null) {
    return corner
  } else {
    return getEasyAIMove()
  }
}

  function minimax(board,isMaximizing) {
    let result = calculateWinner(board)

    if (result.winner === "O") {
      return 1;
    } else if (result.winner === "X") {
      return -1;
    } else if (result.winner === "Draw") {
      return 0;
    }

    if (isMaximizing) {
      let best_score = -1/0
      for (let i=0;i<9;i++) {
        if (board[i] === null) {
          board[i] = "O"
          let score = minimax(board, false)
          board[i] = null
          best_score = Math.max(score,best_score)
        }
      }
      return best_score
    } else {
      let best_score = 1/0
      for (let i=0;i<9;i++) {
        if (board[i] === null) {
          board[i] = "X"
          let score = minimax(board, true)
          board[i] = null
          best_score = Math.min(score,best_score)
        }
      }
      return best_score
    }
  }

  function getHardAIMove(board) {
    let best_score = -1/0
    let move = null
    for (let i=0;i<9;i++) {
      if (board[i] === null) {
        board[i] = "O"
        let score = minimax(board, false)
        board[i] = null
        if (score > best_score) {
          best_score = score
          move = i
        }
      }
    }
    return move
  }

  useEffect(()=> {
    let currentBoard = history[history.length - 1]
    let boardIsFull = currentBoard.every(Boolean)

    if (!xIsNext && !calculateWinner(currentBoard).winner && !boardIsFull && difficulty !== 'two') {
      setTimeout(()=>{
        if (difficulty === 'easy') {
          const move = getEasyAIMove()
          handleClick(move)
        } else if (difficulty === 'medium') {
          const move = getMidAIMove()
          handleClick(move)
        } else if (difficulty === 'hard') {
          const move = getHardAIMove([...currentBoard])
          handleClick(move)
        }
      },1000)
    }
  },[history])

  function undoMove() {
    if (history.length === 0 || history.length === 1) {
      return;
    }
    if (!xIsNext || difficulty === 'two') {
      const newHistory = history.slice(0,-1)
      setHistory(newHistory)
      setXIsNext(!xIsNext)
      setWinColor(Array(9).fill(null))
      difficulty === 'two' ? setHeading(`${xIsNext ? "X's Turn":"O's Turn"}`) : setHeading('Your Turn')
    } else {
      const newHistory = history.slice(0,-2)
      setHistory(newHistory)
      setWinColor(Array(9).fill(null))
      setHeading(`Your Turn`)
    }
    headRef.current.classList.contains('win') && headRef.current.classList.remove('win')
    headRef.current.classList.contains('lost') && headRef.current.classList.remove('lost') 
    headRef.current.classList.contains('draw') && headRef.current.classList.remove('draw') 
  }

  function handleClick(i) {
    if (history[history.length - 1][i] || calculateWinner(history[history.length - 1]).winner !== null) {
      return;
    }
    const nextSquares = history[history.length - 1].slice()
    xIsNext ? nextSquares[i] = "X" : nextSquares[i] = "O"

    setXIsNext(!xIsNext)
    setHistory([...history,nextSquares])
    let result = calculateWinner(nextSquares)
    if (result.winner === null) {
      if (difficulty === 'two') {
        setHeading(!xIsNext ? "X's Turn":"O's Turn")
      } else {
        setHeading(!xIsNext ? 'Your Turn':'AI thinking..')
      }
    } else if (result.winner !== "Draw") {
      const newWinColor = Array(9).fill(null)
      if (difficulty === 'two') {
        result.lines.forEach(i => newWinColor[i] = 'green')
        setWinColor(newWinColor)
        result.winner === "X" ? headRef.current.classList.add('win') : headRef.current.classList.add('win')
        result.winner === "X" ? setHeading('X won!') : setHeading('O won!')
      } else {
        if (result.winner === "X") {
          result.lines.forEach(i => newWinColor[i] = 'green')
          setWinColor(newWinColor)
        } else {
          result.lines.forEach(i => newWinColor[i] = 'red')
          setWinColor(newWinColor)
        }
        result.winner === "X" ? headRef.current.classList.add('win') : headRef.current.classList.add('lost')
        result.winner === "X" ? setHeading('You won!') : setHeading('You lost!')
      }
    } else if (result.winner === "Draw") {
      setHeading("It's a Draw")
      headRef.current.classList.add('draw')
    }
  }

  return (
    <>
      <h1 className='pb-4' ref={headRef}>{heading}</h1>
      <Dropdown resetGame={resetGame} difficulty={difficulty} setDifficulty={setDifficulty}></Dropdown>
      <div className='board-row grid grid-cols-3'>
        <Square value={history[history.length - 1][0]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(0)} textColor={winColor[0] !== null ? winColor[0] : '#1a1a1a'}></Square>
        <Square value={history[history.length - 1][1]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(1)} textColor={winColor[1] !== null ? winColor[1] : '#1a1a1a'}></Square>
        <Square value={history[history.length - 1][2]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(2)} textColor={winColor[2] !== null ? winColor[2] : '#1a1a1a'}></Square>
      </div>
      <div className='board-row grid grid-cols-3'>
        <Square value={history[history.length - 1][3]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(3)} textColor={winColor[3] !== null ? winColor[3] : '#1a1a1a'}></Square>
        <Square value={history[history.length - 1][4]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(4)} textColor={winColor[4] !== null ? winColor[4] : '#1a1a1a'}></Square>
        <Square value={history[history.length - 1][5]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(5)} textColor={winColor[5] !== null ? winColor[5] : '#1a1a1a'}></Square>
      </div>
      <div className='board-row grid grid-cols-3'>
        <Square value={history[history.length - 1][6]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(6)} textColor={winColor[6] !== null ? winColor[6] : '#1a1a1a'}></Square>
        <Square value={history[history.length - 1][7]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(7)} textColor={winColor[7] !== null ? winColor[7] : '#1a1a1a'}></Square>
        <Square value={history[history.length - 1][8]} setSquareClick={()=>(xIsNext || difficulty === 'two') && handleClick(8)} textColor={winColor[8] !== null ? winColor[8] : '#1a1a1a'}></Square>
      </div>
      <button onClick={resetGame} className='reset mt-4 mr-2 border-2 h-15 w-30 rounded-3xl'>Reset</button>
      <button onClick={undoMove} className='undo mt-4 ml-2 border-2 h-15 w-30 rounded-3xl'>Undo</button>
    </>
  );

  function calculateWinner(squares) {
    for (let i = 0;i<winLines.length;i++) {
      const [a, b, c] = winLines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {winner:squares[a],lines:[a,b,c]};
      }
    }
    if (squares.every(Boolean)) {
      return {winner:"Draw"}
    } else {
      return {winner:null};
    }
  }
}
