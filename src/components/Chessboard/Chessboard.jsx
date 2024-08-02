import React, { useRef } from 'react';
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

const pieces = [];

for (let p = 0; p < 2; p++) {

    const type = (p === 0) ? "b" : "w";
    const y = (p === 0) ? 7 : 0;
    console.log(p);

    const ypos = 0;

    pieces.push({ image: `chess-pieces/rook_${type}.png`, x: 0, y })
    pieces.push({ image: `chess-pieces/knight_${type}.png`, x: 1, y })
    pieces.push({ image: `chess-pieces/bishop_${type}.png`, x: 2, y })
    pieces.push({ image: `chess-pieces/queen_${type}.png`, x: 3, y })
    pieces.push({ image: `chess-pieces/king_${type}.png`, x: 4, y })
    pieces.push({ image: `chess-pieces/bishop_${type}.png`, x: 5, y })
    pieces.push({ image: `chess-pieces/knight_${type}.png`, x: 6, y })
    pieces.push({ image: `chess-pieces/rook_${type}.png`, x: 7, y })
}

for (let i = 0; i < 8; i++) {
    pieces.push({ image: "chess-pieces/pawn_b.png", x: i, y: 6 })
}


for (let i = 0; i < 8; i++) {
    pieces.push({ image: "chess-pieces/pawn_w.png", x: i, y: 1 })
}




const Chessboard = () => {
    const chessboardRef = useRef(null);


    const activePiece = useRef(null);


    function grabPiece(e) {
        const element = e.target;
        if (element instanceof HTMLElement && element.classList.contains("chess-piece")) {
            const x = e.clientX - 50;
            const y = e.clientY - 50;

            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            activePiece.current = element;
        }
    }

    function movePiece(e) {
        const chessboard = chessboardRef.current;
        if (activePiece.current && chessboard) {
            
            const minX = chessboard.offsetLeft;
            const minY = chessboard.offsetTop;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 100;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 100;


            const x = e.clientX - 50;
            const y = e.clientY - 50;

            activePiece.current.style.position = "absolute";

            //x movement
            if (x < minX) {
                activePiece.current.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.current.style.left = `${maxX}px`;
            } else {
                activePiece.current.style.left = `${x}px`;
            }

            //y movement
            if (y < minY) {
                activePiece.current.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.current.style.top = `${maxY}px`;
            } else {
                activePiece.current.style.top = `${y}px`;
            }
        }
    }

    function dropPiece(e) {
        if (activePiece.current) {
            activePiece.current = null;
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