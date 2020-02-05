/*
  Universidad del Valle de Guatemala
  Othello Game 
  @author: Gus Mendez - 18500
*/
const NONE = "none";
const BLACK = "black";
const WHITE = "white";
const DIRECTIONS = [
	[-1, 1],
  [-1, 0],
  [-1, -1],
  [1, -1],
  [0, 1],
	[0, -1],
	[1, 1],
  [1, 0]  
];

const getPlayerValueByName = name => {
	switch (name) {
		case BLACK:
			return 1;
		case WHITE:
			return -1;	
		default:
			return 0;
	}
}

const renderCell = ({ state, rowIndex, columnIndex}) => {
	
	const { currentPlayer, board } = state;
	  
  const piece = document.createElement("div");
  //piece.id = `piece-${rowIndex}-${columnIndex}`;
  piece.classList.toggle(NONE, true);
	
	piece.addEventListener("click", () => {
    putPiece(state, rowIndex, columnIndex);
    piece.classList.toggle("possible", false);
	});
	
  piece.addEventListener("mouseover", () => {
    if (!checkMove(state, currentPlayer, rowIndex, columnIndex)) {
      return;
    }
    piece.classList.toggle("possible", true);
    piece.classList.toggle(currentPlayer, true);
	});
	
  piece.addEventListener("mouseout", () => {
    piece.classList.toggle("possible", false);
    if (board[rowIndex][columnIndex] !== getPlayerValueByName(currentPlayer))
      piece.classList.toggle(currentPlayer, false);
	});
	
  return piece;
};

const render = (mount, state) => {
  const { currentPlayer, board, mounted } = turn;

  if (!mounted) {
    board.map((row, rowIndex) => {
      row.map((column, columnIndex) => {
				const piece = renderCell(rowIndex, columnIndex, state);
				mount.appendChild(piece)
      });
    });
  }
};

const APP_STATE = {
  currentPlayer: BLACK, 
	mounted: false,
	moves: 0,
  board: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]
};

const root = document.getElementById("root");

render(root, APP_STATE);
