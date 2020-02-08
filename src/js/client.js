/*
  Universidad del Valle de Guatemala
  Othello Game 
  @author: Gus Mendez - 18500
*/

import flattenDeep from "lodash/flattenDeep";

const NONE = { id: 0, name: "none" };
const BLACK = { id: 1, name: "black" };
const WHITE = { id: -1, name: "white" };
const POSSIBLE_MOVES = [
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [1, -1],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, 0]
];

const render = (mount, state) => {
  mount.innerHTML = "";

  const { isPlayerOneTurn, board, movesDone } = state;

  const checkMove = (isPlayerOneTurn, rowIndex, columnIndex) => {
    let found = false;

    if (board[rowIndex][columnIndex] !== NONE.id) {
      return false;
    }

    POSSIBLE_MOVES.forEach(direction => {
      const canWalk = walkPath(
        isPlayerOneTurn,
        rowIndex,
        columnIndex,
        direction[0],
        direction[1]
      ).canWalk;

      if (canWalk) found = true;
    });

    if (found) {
      console.log("Has move at: " + rowIndex + ", " + columnIndex);
    }

    return found;
  };

  const walkPath = (
    isPlayerOneTurn,
    initialRowIndex,
    initialColunmIndex,
    rowDirection,
    columnDirection
  ) => {
    let rowIndex = initialRowIndex + rowDirection;
    let columnIndex = initialColunmIndex + columnDirection;
    if (
      rowIndex > 7 ||
      columnIndex > 7 ||
      rowIndex < 0 ||
      columnIndex < 0 ||
      board[rowIndex][columnIndex] === (isPlayerOneTurn ? BLACK.id : WHITE.id)
    ) {
      return { canWalk: false, x: rowIndex, y: columnIndex };
    }

    for (
      ;
      rowIndex >= 0 &&
      columnIndex >= 0 &&
      rowIndex < 8 &&
      columnIndex < 8 &&
      board[columnIndex][rowIndex] !== NONE;
      rowIndex += rowDirection, columnIndex += columnDirection
    ) {
      if (board[rowIndex][columnIndex] === (isPlayerOneTurn ? 1 : -1)) {
        return { canWalk: true, x: rowIndex, y: columnIndex };
      }
    }
    return { canWalk: false, x: rowIndex, y: columnIndex };
  };

  const hasValidMove = (isPlayerOneTurn) => {
    board.map((row, rowIndex) => {
      row.map((column, columnIndex) => {
        if (checkMove(isPlayerOneTurn, rowIndex, columnIndex)) {
          return true;
        }
      });
    });

    return false;
  };

  const getScore = () => {
    const flatBoard = flattenDeep(board);
    const black = flatBoard.filter(valor => valor === BLACK.id);
    const white = flatBoard.filter(valor => valor === WHITE.id);

    return { black: black.length, white: white.length };
  };

  const verifyEndedGame = () => {
    /* Verifies if game has ended */
    if ((!hasValidMove(isPlayerOneTurn) && !hasValidMove(!isPlayerOneTurn)) || movesDone === 60) {
      let currentScore = getScore();
      if (currentScore.black > currentScore.white) {
        alert("Black wins");
      } else if (currentScore.black === currentScore.white) {
        alert("Tie! Try again");
      } else {
        alert("White wins");
      }

      resetBoard();
      return;
    }
  };

  const verifyOpponentHasChanceToMove = () => {
    /* Verifies if opponent has chance to move */
    const currentOpponent = isPlayerOneTurn ? WHITE.id : BLACK.id;
    if (hasValidMove(!isPlayerOneTurn)) {
      updateBoard();
    } else {
      console.log(
        `Skipping ${
          currentOpponent === BLACK.id ? WHITE.name : BLACK.name
        }'s turn, cause doesnt have chance to move...`
      );
    }
    console.log(
      `${isPlayerOneTurn === BLACK.id ? WHITE.name : BLACK.name}'s turn`
    );
  };

  const putPiece = (rowIndex, columnIndex) => {
    if (board[rowIndex][columnIndex] !== NONE.id) {
      return; //Piece already placed.
    }

    let found = false;
    POSSIBLE_MOVES.forEach(direction => {
      if (flipPieces(rowIndex, columnIndex, direction[0], direction[1])) {
        found = true;
      }
    });

    if (!found) {
      return;
    }

    board[rowIndex][columnIndex] = isPlayerOneTurn ? 1 : -1;
    updateBoard();

    //Verifies ended game or opponent chance to move (after a move)

    //verifyEndedGame();
    //verifyOpponentHasChanceToMove();
  };

  const flipPieces = (
    initialRowIndex,
    initialColumnValue,
    rowDirection,
    columnDirection
  ) => {
    const results = walkPath(
      isPlayerOneTurn,
      initialRowIndex,
      initialColumnValue,
      rowDirection,
      columnDirection
    );
    if (!results.canWalk) {
      return false;
    }

    for (
      let rowIndex = results.x, columnIndex = results.y;
      rowIndex !== initialRowIndex || columnIndex !== initialColumnValue;
      rowIndex -= rowDirection, columnIndex -= columnDirection
    ) {
      board[rowIndex][columnIndex] = isPlayerOneTurn ? BLACK.id : WHITE.id;
      updateBoard(rowIndex, columnIndex);
    }
    return true;
  };

  const updateBoard = () => {
    let newTurn = !isPlayerOneTurn;
    let newMovesDone = movesDone + 1;
    state = { newMovesDone, board, newTurn };
    render(mount, state);
  };

  const renderPiece = (rowValue, columnValue, value) => {
    const squareContainer = document.createElement("div");
    squareContainer.style.backgroundColor = "#1b5e20";
    squareContainer.style.padding = "2px";
    squareContainer.style.margin = "2px";
    squareContainer.style.float = "left";
    squareContainer.style.width = "44px";
    squareContainer.style.height = "44px";
    squareContainer.style.borderRadius = "8px";
    squareContainer.style.justifyContent = "center";
    squareContainer.style.verticalAlign = "center";

    const cell = document.createElement("div");
    cell.style.width = "42px";
    cell.style.height = "42px";
    cell.style.border = "1px solid white";
    cell.rowValue = rowValue;
    cell.columnValue = columnValue;
    cell.value = value;
    cell.style.borderRadius = "25px";

    console.log(value);

    switch (value) {
      case BLACK.id:
        cell.style.backgroundColor = BLACK.name;
        break;
      case WHITE.id:
        cell.style.backgroundColor = WHITE.name;
        break;
      default:
        cell.style.backgroundColor = "transparent";
        cell.style.border = "0px";
    }

    cell.onclick = () => {
      putPiece(rowValue, columnValue);
    };

    cell.onmouseover = () => {
      if (!checkMove(isPlayerOneTurn, rowValue, columnValue)) {
        return;
      }
    };

    cell.onmouseout = () => {
      //if (board[rowValue][columnValue] !== (isPlayerOneTurn ? BLACK.id : WHITE.id))
      //piece.classList.toggle(currentPlayer, false);
    };

    squareContainer.appendChild(cell);
    return squareContainer;
  };

  const renderBoard = () => {
    //Header
    const header = document.createElement("div");
    header.style.backgroundColor = "#00796b";
    header.style.justifyContent = "center";
    header.style.alignItems = "center";
    header.style.overflow = "auto";
    header.style.fontFamily = "Montserrat";
    header.style.height = "120px";
    header.style.display = "flex";
    header.style.flexDirection = "column";

    //Header title
    const headerTitle = document.createElement("h1");
    const titleText = document.createTextNode("Othello Game");
    headerTitle.appendChild(titleText);
    headerTitle.style.color = "white";
    headerTitle.style.fontSize = "40px";
    header.appendChild(headerTitle);

    // Content
    const content = document.createElement("div");
    content.style.height = "auto";
    content.style.padding = "20px";
    content.style.display = "flex";
    content.style.flexDirection = "row";
    content.style.justifyContent = "center";
    content.style.textAlign = "center";

    const main = document.createElement("div");
    main.style.marginTop = "8px";
    main.style.flex = 3;
    main.style.flexDirection = "column";
    main.style.justifyContent = "center";
    main.style.alignItems = "center";
    main.style.display = "flex";

    const details = document.createElement("div");
    details.style.backgroundColor = "green";
    details.style.height = "auto";
    details.style.marginTop = "8px";
    details.style.flex = 1;
    details.style.display = "flex";

    const gameState = document.createElement("div");
    gameState.style.backgroundColor = "whitesmoke";
    gameState.style.flex = 1;

    ///Sub Header
    const subHeader = document.createElement("div");
    subHeader.style.backgroundColor = "#1976d2";
    subHeader.style.justifyContent = "center";
    subHeader.style.alignItems = "center";
    subHeader.style.overflow = "auto";
    subHeader.style.fontFamily = "Montserrat";
    subHeader.style.height = "60px";
    subHeader.style.display = "flex";
    subHeader.style.flexDirection = "column";

    //Sub Header title
    const subHeaderTitle = document.createElement("h3");
    const subTitleText = document.createTextNode("Game State");
    subHeaderTitle.appendChild(subTitleText);
    subHeaderTitle.style.color = "white";
    subHeaderTitle.style.fontSize = "20px";
    subHeader.appendChild(subHeaderTitle);

    const resetButton = document.createElement("button");
    resetButton.style.backgroundColor = "#607d8b";
    resetButton.style.color = "white";
    resetButton.style.height = "fit-content";
    resetButton.style.width = "fit-content";
    resetButton.style.padding = "16px";
    resetButton.style.margin = "16px";
    resetButton.style.fontSize = "20px";
    resetButton.style.marginTop = "20px";
    resetButton.style.fontFamily = "Montserrat";
    resetButton.style.fontSize = "12px";
    resetButton.innerText = "RESET GAME";
    resetButton.style.border = "none";
    resetButton.style.outline = "none";
    resetButton.style.cursor = "pointer";
    resetButton.onclick = () => {
      console.log("Clear board working...");
      resetBoard();
    };

    // Game State
    const currentScore = getScore(state);

    const scoreContainer = document.createElement("div");
    scoreContainer.style.display = "flex";
    scoreContainer.style.backgroundColor = "#607d8b";
    scoreContainer.style.color = "white";
    scoreContainer.style.justifyContent = "center";

    const scoreWhite = document.createElement("h3");
    scoreWhite.style.fontFamily = "Montserrat";
    const whiteTextScore = document.createTextNode(currentScore.white);
    scoreWhite.appendChild(whiteTextScore);
    scoreWhite.style.fontSize = "10px";

    const scoreBlack = document.createElement("h3");
    scoreBlack.style.fontFamily = "Montserrat";
    const blackTextScore = document.createTextNode(currentScore.black);
    scoreBlack.appendChild(blackTextScore);
    scoreBlack.style.fontSize = "10px";

    const whiteIcon = document.createElement("div");
    whiteIcon.style.backgroundColor = WHITE.name;
    whiteIcon.style.borderRadius = "25px";
    whiteIcon.style.height = "6px";
    whiteIcon.style.margin = "6px";
    whiteIcon.style.padding = "6px";
    whiteIcon.style.width = "6px";
    whiteIcon.style.border = `${
      !isPlayerOneTurn ? "2px solid yellow" : "2px solid white"
    }`;

    const blackIcon = document.createElement("div");
    blackIcon.style.backgroundColor = BLACK.name;
    blackIcon.style.borderRadius = "25px";
    blackIcon.style.height = "6px";
    blackIcon.style.margin = "6px";
    blackIcon.style.padding = "6px";
    blackIcon.style.width = "6px";
    blackIcon.style.border = `${
      isPlayerOneTurn ? "2px solid yellow" : "2px solid black"
    }`;

    scoreContainer.appendChild(blackIcon);
    scoreContainer.appendChild(scoreBlack);
    scoreContainer.appendChild(whiteIcon);
    scoreContainer.appendChild(scoreWhite);

    // Board
    const othelloBoard = document.createElement("div");
    othelloBoard.style.backgroundColor = "#2e7d32";
    othelloBoard.style.maxWidth = "420px";
    othelloBoard.style.minHeight = "420px";
    othelloBoard.style.padding = "8px";
    othelloBoard.style.flex = 1;

    board.map((row, rowIndex) => {
      row.map((column, columnIndex) => {
        const piece = renderPiece(rowIndex, columnIndex, column);
        othelloBoard.appendChild(piece);
      });
    });

    mount.appendChild(header);
    main.appendChild(othelloBoard);
    //main.appendChild(resetButton);
    gameState.appendChild(subHeader);
    gameState.appendChild(scoreContainer);
    gameState.appendChild(resetButton);
    details.appendChild(gameState);

    content.appendChild(main);
    content.appendChild(details);
    mount.appendChild(content);
  };

  const resetBoard = () => {
    const newData = [];

    board.forEach(row => {
      let column = [];
      row.forEach(val => column.push(NONE.id));
      newData.push(column);
    });

    console.log(newData);

    newData[4][4] = newData[3][3] = BLACK.id;
    newData[4][3] = newData[3][4] = WHITE.id;
    state.board = newData;
    state.isPlayerOneTurn = true;
    render(mount, state);
  };

  renderBoard();
};
const INIT_STATE = {
  isPlayerOneTurn: true,
  movesDone: 0,
  board: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]
};
const root = document.getElementById("root");
render(root, INIT_STATE);
