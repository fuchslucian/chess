import React, { useState } from 'react';
import './App.css';

class Pawn{
  constructor(row_position, col_position,figure,legal_moves,directions){
    this.row_position = row_position
    this.col_position = col_position
    this.legal_moves = legal_moves
    this.pinned = false
    this.directions = directions
    this.pinn_direction = null
    this.figure = figure
    this.has_moved = false
    this.moves_giving_check = []
  }
}

class Rook{
  constructor(row_position, col_position,figure,legal_moves){
    this.row_position = row_position
    this.col_position = col_position
    this.legal_moves = legal_moves
    this.pinned = false
    this.directions = [[1,0],[-1,0],[0,1],[0,-1]]
    this.pinn_direction = null
    this.figure = figure
    this.has_moved = false
    this.is_protected = false
    this.moves_giving_check = []
  }
}
class Bishop{
  constructor(row_position, col_position,figure,legal_moves){
    this.row_position = row_position
    this.col_position = col_position
    this.legal_moves = legal_moves
    this.pinned = false
    this.directions = [[-1,-1],[1,1],[1,-1],[-1,1]]
    this.pinn_direction = null
    this.figure = figure
    this.has_moved = false
    this.is_protected = false
    this.moves_giving_check = []
  }
}
class Knight{
  constructor(row_position, col_position,figure,legal_moves){
    this.row_position = row_position
    this.col_position = col_position
    this.legal_moves = legal_moves
    this.pinned = false
    this.directions = [[-2,1],[-2,-1],[2,1],[2,-1],[1,-2],[-1,-2],[1,2],[-1,2]]
    this.pinn_direction = null
    this.figure = figure
    this.has_moved = false
    this.is_protected = false
    this.moves_giving_check = []
  }
}
class Queen{
  constructor(row_position, col_position,figure,legal_moves){
    this.row_position = row_position
    this.col_position = col_position
    this.legal_moves = legal_moves
    this.pinned = false
    this.directions = [[-1,-1],[1,1],[1,-1],[-1,1],[1,0],[-1,0],[0,1],[0,-1]]
    this.pinn_direction = null
    this.figure = figure
    this.has_moved = false
    this.is_protected = false
    this.moves_giving_check = []
  }
}
class King{
  constructor(row_position, col_position,figure,legal_moves){
    this.moves_giving_check = []
    this.row_position = row_position
    this.col_position = col_position
    this.legal_moves = legal_moves
    this.pinned = false
    this.directions = [[-1,-1],[1,1],[1,-1],[-1,1],[1,0],[-1,0],[0,1],[0,-1]]
    this.pinn_direction = null
    this.figure = figure
    this.can_castle = false
    this.has_moved = false
    this.is_protected = true
    this.is_check = false
    this.checked_by = []
  }
}

/*K = King
Q = Queen
R = Rook
B = Bishop
N = Knight
P = Pawn
*/
const START_BOARD = [ [new Rook(0,0,"BR",[]),new Knight(0,1,"BN",["2/0","2/2"]),new Bishop(0,2,"BB",[]),new Queen(0,3,"BQ",[]), new King(0,4,"BK",[]),new Bishop(0,5,"BB",[]),new Knight(0,6,"BN",["2/5","2/7"]),new Rook(0,7,"BR",[])],
                      [new Pawn(1,0,"BP",["2/0","3/0"],[[1,0],[1,1],[1,-1]]),new Pawn(1,1,"BP",["2/1","3/1"],[[1,0],[1,1],[1,-1]]),new Pawn(1,2,"BP",["2/2","3/2"],[[1,0],[1,1],[1,-1]]),new Pawn(1,3,"BP",["2/3","3/3"],[[1,0],[1,1],[1,-1]]),new Pawn(1,4,"BP",["2/4","3/4"],[[1,0],[1,1],[1,-1]]),new Pawn(1,5,"BP",["2/5","3/5"],[[1,0],[1,1],[1,-1]]),new Pawn(1,6,"BP",["2/6","3/6"],[[1,0],[1,1],[1,-1]]),new Pawn(1,7,"BP",["2/7","3/7"],[[1,0],[1,1],[1,-1]])],
                      ["","","","","","","",""],
                      ["","","","","","","",""],
                      ["","","","","","","",""],
                      ["","","","","","","",""],
                      [new Pawn(6,0,"WP",["5/0","4/0"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,1,"WP",["5/1","4/1"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,2,"WP",["5/2","4/2"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,3,"WP",["5/3","4/3"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,4,"WP",["5/4","4/4"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,5,"WP",["5/5","4/5"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,6,"WP",["5/6","4/6"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,7,"WP",["5/7","4/7"],[[-1,0],[-1,1],[-1,-1]])],
                      [new Rook(7,0,"WR",[]),new Knight(7,1,"WN",["5/0","5/2"]),new Bishop(7,2,"WB",[]),new Queen(7,3,"WQ",[]), new King(7,4,"WK",[]),new Bishop(7,5,"WB",[]),new Knight(7,6,"WN",["5/5","5/7"]),new Rook(7,7,"WR",[])]
                    ]
const Chess = () => {
  const [board, setBoard] = useState(START_BOARD)
  const [selected, setSelected] = useState(false)
  const [currPlayer, setCurrPlayer] = useState("W")
  const [checkmate, setCheckmate] = useState(false)

  const handleNewGame = () => {
    setBoard([ [new Rook(0,0,"BR",[]),new Knight(0,1,"BN",["2/0","2/2"]),new Bishop(0,2,"BB",[]),new Queen(0,3,"BQ",[]), new King(0,4,"BK",[]),new Bishop(0,5,"BB",[]),new Knight(0,6,"BN",["2/5","2/7"]),new Rook(0,7,"BR",[])],
              [new Pawn(1,0,"BP",["2/0","3/0"],[[1,0],[1,1],[1,-1]]),new Pawn(1,1,"BP",["2/1","3/1"],[[1,0],[1,1],[1,-1]]),new Pawn(1,2,"BP",["2/2","3/2"],[[1,0],[1,1],[1,-1]]),new Pawn(1,3,"BP",["2/3","3/3"],[[1,0],[1,1],[1,-1]]),new Pawn(1,4,"BP",["2/4","3/4"],[[1,0],[1,1],[1,-1]]),new Pawn(1,5,"BP",["2/5","3/5"],[[1,0],[1,1],[1,-1]]),new Pawn(1,6,"BP",["2/6","3/6"],[[1,0],[1,1],[1,-1]]),new Pawn(1,7,"BP",["2/7","3/7"],[[1,0],[1,1],[1,-1]])],
              ["","","","","","","",""],
              ["","","","","","","",""],
              ["","","","","","","",""],
              ["","","","","","","",""],
              [new Pawn(6,0,"WP",["5/0","4/0"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,1,"WP",["5/1","4/1"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,2,"WP",["5/2","4/2"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,3,"WP",["5/3","4/3"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,4,"WP",["5/4","4/4"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,5,"WP",["5/5","4/5"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,6,"WP",["5/6","4/6"],[[-1,0],[-1,1],[-1,-1]]),new Pawn(6,7,"WP",["5/7","4/7"],[[-1,0],[-1,1],[-1,-1]])],
              [new Rook(7,0,"WR",[]),new Knight(7,1,"WN",["5/0","5/2"]),new Bishop(7,2,"WB",[]),new Queen(7,3,"WQ",[]), new King(7,4,"WK",[]),new Bishop(7,5,"WB",[]),new Knight(7,6,"WN",["5/5","5/7"]),new Rook(7,7,"WR",[])]
            ])
    setSelected(false)
    setCurrPlayer("W")
    setCheckmate(false) 
  }
  const handleMove = (from, to) => {
    if (currPlayer === "W"){
      setCurrPlayer("B")
    }else{
      setCurrPlayer("W")
    }
    const piece = board[from[0]][from[1]]
    piece.row_position = to[0]
    piece.col_position = to[1]
    if (piece.figure === "BK" || piece.figure === "WK"){
    }
    board[from[0]][from[1]] = ""
    board[to[0]][to[1]] = piece
    if (piece.figure[1] === "P"){
      handlePawnPromote(piece.row_position,piece.col_position)
    }
    if (piece.figure[1] === "K"){
      if (!piece.has_moved && piece.col_position === 2){
        const rook = board[piece.row_position][0]
        rook.col_position = 3
        rook.has_moved = true
        board[piece.row_position][0] = ""
        board[piece.row_position][3] = rook
        
      }
      if (!piece.has_moved && piece.col_position === 6){
        const rook = board[piece.row_position][7]
        rook.col_position = 5
        rook.has_moved = true
        board[piece.row_position][7] = ""
        board[piece.row_position][5] = rook
      }
    }
    piece.has_moved = true
    setBoard(board)
    updateLegalMoves()

  }
  const handlePawnPromote = (row_pos, col_pos) => {
    if (row_pos === 0){
      board[row_pos][col_pos] = new Queen(row_pos,col_pos,"WQ",[])
    }
    if (row_pos === 7){
      board[row_pos][col_pos] = new Queen(row_pos,col_pos,"BQ",[])
    }
    setBoard(board)
  }


  const handleCheck = (king) => {
    if (!king.is_check){
      return
    }

    for (let x = 0; x < king.checked_by.length; x++) {
      let possible_moves = []

      let piece = king.checked_by[x][0]
      let row_dir = king.checked_by[x][1][0]
      let col_dir = king.checked_by[x][1][1]
      if (piece.figure[1] === "P" || piece.figure[1] === "N"){
        possible_moves.push(`${piece.row_position}/${piece.col_position}`)
      }else{
        possible_moves.push(`${piece.row_position}/${piece.col_position}`)
        let row_pos = piece.row_position
        let col_pos = piece.col_position
        while (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
          row_pos += row_dir
          col_pos += col_dir
          if (board[row_pos][col_pos] === ""){
            possible_moves.push(`${row_pos}/${col_pos}`)
          }else{
            break
          }
        }
      }
      for (let i = 0; i < board.length; i++) {
        for (let y = 0; y < board[i].length; y++){
          if (board[i][y] !== ""){
            let piece = board[i][y]
            if (piece.figure[0] === king.figure[0]){
              if (piece.figure[1] !== "K"){
                piece.legal_moves = piece.legal_moves.filter(move => possible_moves.includes(move))
              }
            }
          }
        }
      }

    }
    
    let is_checkmate = true

    for (let i = 0; i < board.length; i++) {
      for (let y = 0; y < board[i].length; y++){
        if (board[i][y] !== ""){
          let piece = board[i][y]
          if (piece.figure[0] === king.figure[0]){
              if (piece.legal_moves.length > 0){
                is_checkmate = false
              }
          }
        }
      }
    }

    if (is_checkmate){
      if (currPlayer === "W"){
        setCheckmate("checkmate white has won")
      }
      if (currPlayer === "B"){
        setCheckmate("checkmate black has won")
      }
    }
    setBoard(board)

  }

  const unpinn = () => {
    for (let i = 0; i < board.length; i++) {
      for (let y = 0; y < board[i].length; y++){
        if (board[i][y] === ""){
          continue
        }
        board[i][y].pinned = false
        board[i][y].pinn_direction = null
        board[i][y].is_protected = false
        board[i][y].moves_giving_check = []
        if (board[i][y].figure[1] === "K"){
          board[i][y].is_check = false
          board[i][y].checked_by = []

        }

      }
    }
    setBoard(board)
  }

  const updateKnightMoves = (piece) => {
    for (let x = 0; x < piece.directions.length; x++) {
      let row_dir = piece.directions[x][0]
      let col_dir = piece.directions[x][1]
      let row_pos = piece.row_position
      let col_pos = piece.col_position
      if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
        row_pos += row_dir
        col_pos += col_dir
        if (board[row_pos][col_pos] === ""){
          piece.legal_moves.push(`${row_pos}/${col_pos}`)
        }
        if (board[row_pos][col_pos] !== ""){
          if (board[row_pos][col_pos].figure[0] !== piece.figure[0]){
            piece.legal_moves.push(`${row_pos}/${col_pos}`)
            if (board[row_pos][col_pos].figure[1] === "K"){
              board[row_pos][col_pos].is_check = true
              board[row_pos][col_pos].checked_by.push([piece,[row_dir,col_dir]])
              break
            }
          }else{
            board[row_pos][col_pos].is_protected = true
          }
        }
      }
    }
    setBoard(board)
  }

  const checkKingMoveIsPossible = (king_color,row_pos,col_pos) => {
    for (let i = 0; i < board.length; i++){
      for (let y = 0; y < board[i].length; y++){
        if (board[i][y] !== ""){
          let piece = board[i][y]
          if (piece.figure[0] !== king_color){

            if (piece.figure[1] === "P"){
              if ((col_pos === piece.col_position-1 || col_pos === piece.col_position+1) && row_pos === piece.row_position+piece.directions[0][0]){
                return false
              }
            }else{
              if (piece.legal_moves.includes(`${row_pos}/${col_pos}`)){
                return false
              }
            }

          }
        }
      }
    }
    return true
  }
  const updateKingMoves = (piece) => {
    for (let x = 0; x < piece.directions.length; x++) {
      let row_dir = piece.directions[x][0]
      let col_dir = piece.directions[x][1]
      let row_pos = piece.row_position
      let col_pos = piece.col_position
      if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
        row_pos += row_dir
        col_pos += col_dir
        if (board[row_pos][col_pos] === ""){
          if (checkKingMoveIsPossible(piece.figure[0],row_pos,col_pos)){
            piece.legal_moves.push(`${row_pos}/${col_pos}`)
          }
        }
        if (board[row_pos][col_pos] !== ""){
          if (board[row_pos][col_pos].figure[0] !== piece.figure[0]){
            if (!board[row_pos][col_pos].is_protected){
              piece.legal_moves.push(`${row_pos}/${col_pos}`)
            }
          }else{
            board[row_pos][col_pos].is_protected = true
          }
        }
      }
    }
    if (!piece.has_moved && piece.checked_by.length === 0){
      if (!board[piece.row_position][0].has_moved){
        if ((checkKingMoveIsPossible(piece.figure[0],piece.row_position,1) && board[piece.row_position][1] === "") && (checkKingMoveIsPossible(piece.figure[0],piece.row_position,2) && board[piece.row_position][2] === "") && (checkKingMoveIsPossible(piece.figure[0],piece.row_position,3) && board[piece.row_position][3] === "")){
          piece.legal_moves.push(`${piece.row_position}/2`)
        }
      }
      if (!board[piece.row_position][7].has_moved){
        if ((checkKingMoveIsPossible(piece.figure[0],piece.row_position,5) && board[piece.row_position][5] === "") && (checkKingMoveIsPossible(piece.figure[0],piece.row_position,6) && board[piece.row_position][6] === "")){
          piece.legal_moves.push(`${piece.row_position}/6`)
        }
      }
    }
    setBoard(board)

  }

  const updatePawnMoves = (piece) => {
    for (let x = 0; x < piece.directions.length; x++){
      let row_dir = piece.directions[x][0]
      let col_dir = piece.directions[x][1]
      let row_pos = piece.row_position
      let col_pos = piece.col_position
      if (piece.has_moved){
        if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
          row_pos += row_dir
          col_pos += col_dir
          if (col_dir === 0){
            if (board[row_pos][col_pos] === ""){
              piece.legal_moves.push(`${row_pos}/${col_pos}`)
            }
          }else{
            if (board[row_pos][col_pos] !== ""){
              if (board[row_pos][col_pos].figure[0] !== piece.figure[0]){
                piece.legal_moves.push(`${row_pos}/${col_pos}`)
                if (board[row_pos][col_pos].figure[1] === "K"){
                  board[row_pos][col_pos].is_check = true
                  board[row_pos][col_pos].checked_by.push([piece,[row_dir,col_dir]])
                  // handleCheck
                  break
                }
              }else{
                board[row_pos][col_pos].is_protected = true
              }
            }
          }
        }
      }else{
        if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
          row_pos += row_dir
          col_pos += col_dir
          if (col_dir === 0){
            if (board[row_pos][col_pos] === ""){
              piece.legal_moves.push(`${row_pos}/${col_pos}`)
            }
          }else{
            if (board[row_pos][col_pos] !== ""){
              if (board[row_pos][col_pos].figure[0] !== piece.figure[0]){
                piece.legal_moves.push(`${row_pos}/${col_pos}`)
                if (board[row_pos][col_pos].figure[1] === "K"){
                  board[row_pos][col_pos].is_check = true
                  board[row_pos][col_pos].checked_by.push([piece,[row_dir,col_dir]])
                  // handleCheck
                  break
                }
              }else{
                board[row_pos][col_pos].is_protected = true
              }
            }
          }
        }
        if (board[row_pos][col_pos] !== ""){
          continue
        }
        if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
          row_pos += row_dir
          col_pos += col_dir
          if (col_dir === 0){
            if (board[row_pos][col_pos] === ""){
              piece.legal_moves.push(`${row_pos}/${col_pos}`)
            }
          }
        }
      }
    }
  }
  const get_moves_giving_check = (piece, row_dir, col_dir) => {
    let row_pos = piece.row_position
    let col_pos = piece.col_position
    while(row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
      row_pos += row_dir
      col_pos += col_dir
      if (board[row_pos][col_pos] === ""){
        piece.moves_giving_check.push(`${row_pos}/${col_pos}`)
      }else{
        if (board[row_pos][col_pos].figure[1] === "K"){
          piece.moves_giving_check.push(`${row_pos}/${col_pos}`)
        }else{
          break
        }
      }
    }

    setBoard(board)


  }
  const updateElseMoves = (piece) => {
    for (let x = 0; x < piece.directions.length; x++){
      let row_dir = piece.directions[x][0]
      let col_dir = piece.directions[x][1]
      let row_pos = piece.row_position
      let col_pos = piece.col_position
      while(row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
        row_pos += row_dir
        col_pos += col_dir
        if (board[row_pos][col_pos] === ""){
          piece.legal_moves.push(`${row_pos}/${col_pos}`)
        }else{
          if (board[row_pos][col_pos].figure[0] !== piece.figure[0]){
            piece.legal_moves.push(`${row_pos}/${col_pos}`)
            if (board[row_pos][col_pos].figure[1] === "K"){
              board[row_pos][col_pos].is_check = true
              get_moves_giving_check(piece, row_dir,col_dir)
              board[row_pos][col_pos].checked_by.push([piece,[row_dir,col_dir]])
              break
            }
          }else{
            board[row_pos][col_pos].is_protected = true
          }
          const pinn_row = row_pos
          const pinn_col = col_pos
          while(row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
              row_pos += row_dir
              col_pos += col_dir
              if (board[row_pos][col_pos] === ""){
                continue
              }
              if (board[row_pos][col_pos].figure[1] !== "K"){
                break
              }
              if (board[row_pos][col_pos].figure[1] === "K" && board[pinn_row][pinn_col].figure[0] !== piece.figure[0]){
                row_pos -= row_dir
                col_pos -= col_dir
                console.log(board[pinn_row][pinn_col].figure)
                board[pinn_row][pinn_col].pinned = true
                board[pinn_row][pinn_col].pinn_direction = [[-row_dir,-col_dir],[row_dir,col_dir]]
                
                break
              }
          }
          break
        }

      }
    }

  }
  const handlePinns = () => {
    for (let i = 0; i < board.length; i++) {
      for (let y = 0; y < board[i].length; y++){
        let piece = board[i][y]
        if (piece.pinned){
          piece.legal_moves = []
          if (piece.figure[1] === "Q" || piece.figure[1] === "R" || piece.figure[1] === "B"){
            for (let x = 0; x < piece.pinn_direction.length; x++){
              if (piece.directions.some((e) => piece.pinn_direction[x][0] === e[0] && piece.pinn_direction[x][1] === e[1])){
                let row_dir = piece.pinn_direction[x][0]
                let col_dir = piece.pinn_direction[x][1]
                let row_pos = piece.row_position
                let col_pos = piece.col_position
                while(row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
                  row_pos += row_dir
                  col_pos += col_dir
                  if (board[row_pos][col_pos] === ""){
                    piece.legal_moves.push(`${row_pos}/${col_pos}`)
                  }
                  if (board[row_pos][col_pos] !== ""){
                    if (board[row_pos][col_pos].figure[0] !== piece.figure[0]){
                      piece.legal_moves.push(`${row_pos}/${col_pos}`)
                    }
                    break
                  }
                }
  
              }
            }
            }
          if (piece.figure[1] === "P"){
            for (let x = 0; x < piece.pinn_direction.length; x++){
              if (piece.pinn_direction[x][1] !== 0){
                if (piece.directions.some((e) => piece.pinn_direction[x][0] === e[0] && piece.pinn_direction[x][1] === e[1])){
                  let row_dir = piece.pinn_direction[x][0]
                  let col_dir = piece.pinn_direction[x][1]
                  let row_pos = piece.row_position
                  let col_pos = piece.col_position
                  if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
                    row_pos += row_dir
                    col_pos += col_dir
                    if (board[row_pos][col_pos] !== ""){
                      if (board[row_pos][col_pos].figure[0] !== piece.figure[0]){
                        piece.legal_moves.push(`${row_pos}/${col_pos}`)
                      }
                    }
                  }
                }
              }else{
                if (piece.directions.some((e) => piece.pinn_direction[x][0] === e[0] && piece.pinn_direction[x][1] === e[1])){
                  let row_dir = piece.pinn_direction[x][0]
                  let col_dir = piece.pinn_direction[x][1]
                  let row_pos = piece.row_position
                  let col_pos = piece.col_position
                  if (piece.has_moved){
                    if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
                      row_pos += row_dir
                      col_pos += col_dir
                      if (board[row_pos][col_pos] === ""){
                        piece.legal_moves.push(`${row_pos}/${col_pos}`)
                      }
                      
                    }
                  }else{
                    if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
                      row_pos += row_dir
                      col_pos += col_dir
                      if (board[row_pos][col_pos] === ""){
                        piece.legal_moves.push(`${row_pos}/${col_pos}`)
                      }
                    }
                    if (row_pos+row_dir >= 0 && row_pos+row_dir < board.length && col_pos+col_dir >= 0 && col_pos+col_dir < board[0].length){
                      row_pos += row_dir
                      col_pos += col_dir
                      if (board[row_pos][col_pos] === ""){
                        piece.legal_moves.push(`${row_pos}/${col_pos}`)
                      } 
                    }
                  }
                }
              }
            }
          }

        }
      }
    }
    setBoard(board)
  }
  const updateLegalMoves = () => {
    unpinn()
    let kings = []
    for (let i = 0; i < board.length; i++) {
      for (let y = 0; y < board[i].length; y++){
        if (board[i][y] === ""){
          continue
        }
        let piece = board[i][y]
        piece.legal_moves = []
        if (piece.figure[1] === "N"){
            updateKnightMoves(piece)
        }else if(piece.figure[1] === "K"){
          kings.push(piece)
        }else if (piece.figure[1] === "P"){
            updatePawnMoves(piece)
        }else{
          updateElseMoves(piece)
        }
      }
      
    }
    for (let i = 0; i < kings.length; i++){
      updateKingMoves(kings[i])
      if (kings[i].figure[0] !== currPlayer){
        handleCheck(kings[i])
      }
    }
    handlePinns()
    setBoard(board)

  }
  const handleClick = (i,y) => {
    if (selected){
      if (i === selected.row_position && y === selected.col_position){
        setSelected(false)
        return
      }
      if (selected.legal_moves.includes(`${i}/${y}`)){
        setSelected(false)
        handleMove([selected.row_position,selected.col_position],[i,y])
        return
      }
    }
    if (board[i][y] === ""){
      setSelected(false)
      return
    }
    if (board[i][y].figure[0] === currPlayer){
      setSelected(board[i][y])
      return
    }
    setSelected(false)
    return
  }
  return ( 
    <>
    {checkmate && <h1>{checkmate}</h1>}
    <div className="board">
    {board.map((row, i) => row.map((figure, y) => <div key={`${i}/${y}`} onClick={()=>{handleClick(i,y)}}><Cell selected={selected} figure={figure} row={i} col={y}/></div>))}
    </div>
    <button onClick={()=>{handleNewGame()}}>new game</button>
    </>
   );
}
 
const Cell = ({figure, row, col, selected}) => {
  if (figure !== ""){
    if (figure.figure[1] === "K"){
      if (figure.is_check === true){
        return (
          <div className={`white-cell ${figure.figure} check`}>
          </div>
        )
      }
    }
  }
  if (row%2 === 0){
    if (col%2 === 0){
      if (selected && row === selected.row_position && col === selected.col_position){
        return (
          <div className={`white-cell ${figure.figure} selected`}>
          </div> 
      )
      }
      if (selected && selected.legal_moves.includes(`${row}/${col}`)){
        return (
          <div className={`white-cell ${figure.figure} possible-move`}>
          </div> 
      )
      }
      return (
        <div className={`white-cell ${figure.figure}`}>
        </div> 
    )
    }
    if (selected && row === selected.row_position && col === selected.col_position){
      return (
        <div className={`black-cell ${figure.figure} selected`}>
        </div> 
    )
    }
    if (selected && selected.legal_moves.includes(`${row}/${col}`)){
      return (
        <div className={`black-cell ${figure.figure} possible-move`}>
        </div> 
    )
    }
    return (
      <div className={`black-cell ${figure.figure}`}>
      </div> 
    )
  }
  if (col%2 !== 0){
    if (selected && row === selected.row_position && col === selected.col_position){
      return (
        <div className={`white-cell ${figure.figure} selected`}>
        </div> 
    )
    }
    if (selected && selected.legal_moves.includes(`${row}/${col}`)){
      return (
        <div className={`white-cell ${figure.figure} possible-move`}>
        </div> 
    )
    }
    return (
      <div className={`white-cell ${figure.figure}`}>
      </div> 
  )
  }
  if (selected && selected.legal_moves.includes(`${row}/${col}`)){
    return (
      <div className={`black-cell ${figure.figure} possible-move`}>
      </div> 
  )
  }
  if (selected && row === selected.row_position && col === selected.col_position){
    return (
      <div className={`black-cell ${figure.figure} selected`}>
      </div> 
  )
  }
  return (
    <div className={`black-cell ${figure.figure}`}>
    </div> 
  )
}
export default Chess;


