import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types'
import './Chessboard.css'
import Tile from '../Tile/Tile'



const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"]

Tile.propTypes = {
    image: PropTypes.string,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
};

// const pieces = [];

const initialBoardState = [];
for (let p = 0; p < 2; p++) {

    const type = (p === 0) ? "b" : "w";
    const y = (p === 0) ? 7 : 0;
    console.log(p);

    const ypos = 0;

    initialBoardState.push({ image: `chess-pieces/rook_${type}.png`, x: 0, y })
    initialBoardState.push({ image: `chess-pieces/knight_${type}.png`, x: 1, y })
    initialBoardState.push({ image: `chess-pieces/bishop_${type}.png`, x: 2, y })
    initialBoardState.push({ image: `chess-pieces/queen_${type}.png`, x: 3, y })
    initialBoardState.push({ image: `chess-pieces/king_${type}.png`, x: 4, y })
    initialBoardState.push({ image: `chess-pieces/bishop_${type}.png`, x: 5, y })
    initialBoardState.push({ image: `chess-pieces/knight_${type}.png`, x: 6, y })
    initialBoardState.push({ image: `chess-pieces/rook_${type}.png`, x: 7, y })
}

for (let i = 0; i < 8; i++) {
    initialBoardState.push({ image: "chess-pieces/pawn_b.png", x: i, y: 6 })
}


for (let i = 0; i < 8; i++) {
    initialBoardState.push({ image: "chess-pieces/pawn_w.png", x: i, y: 1 })
}


const Chessboard = () => {
    const [activePiece, setActivePiece] = useState(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState(initialBoardState);
    const chessboardRef = useRef(null);


    function grabPiece(e) {
        const element = e.target;
        const chessboard = chessboardRef.current;
        if (element instanceof HTMLElement && element.classList.contains("chess-piece") && chessboard) {
            
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));

            const x = e.clientX - 50;
            const y = e.clientY - 50;

            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {

            const minX = chessboard.offsetLeft;
            const minY = chessboard.offsetTop;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 100;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 100;


            const x = e.clientX - 50;
            const y = e.clientY - 50;

            activePiece.style.position = "absolute";

            //x movement
            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            //y movement
            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    function dropPiece(e) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

            setPieces(value => {
                const pieces = value.map(p => {
                    if(p.x === gridX && p.y === gridY) {
                        p.x = x;
                        p.y = y;
                    }
                    return p;
                })
                return pieces;
            });

            setActivePiece(null);
        }
    }

    let board = [];
    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            let image = undefined;

            pieces.forEach(p => {
                if (p.x === i && p.y === j) {
                    image = p.image;
                }
            });

            // simplified version
            board.push(<Tile key={`${j},${i}`} image={image} number={number} />)
            // if (number % 2 === 0){
            //     board.push(<Tile/>);
            // } else{
            //     board.push(<Tile/>);
            // }

        }
    }



    return (
        <div
            onMouseMove={e => movePiece(e)}
            onMouseDown={e => grabPiece(e)}
            onMouseUp={e => dropPiece(e)}
            id="chessboard"
            ref={chessboardRef}
        >
            {board}

        </div>
    )
}

export default Chessboard