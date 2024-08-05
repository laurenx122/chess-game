import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types'
import './Chessboard.css'
import Tile from '../Tile/Tile'
import Referee from '../../referee/Referee.jsx';
import { horizontalAxis, verticalAxis, PieceType, TeamType, initialBoardState, Position } from '../../Constants.jsx';


Tile.propTypes = {
    image: PropTypes.string,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    type: PieceType,
    team: TeamType  
};


const Chessboard = () => {
    const [activePiece, setActivePiece] = useState(null);
    const [grapPosition, setGrabPosition] = useState(null);
     const [gridX, setGridX] = useState(0);
     const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState(initialBoardState);
    const chessboardRef = useRef(null);
    const referee = new Referee();


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

            const currentPiece = pieces.find(p => p.position.x === gridX && p.position.y === gridY);
            const attackedPiece = pieces.find(p => p.position.x === x && p.position.y === y);

            if (currentPiece) {
                const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece?.type, currentPiece?.team, pieces);

                const isEnPassantMove = referee.isEnPassantMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)
                const pawnDirection = (currentPiece.team === TeamType.OUR) ? 1 : -1;

                if (isEnPassantMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (piece.position.x === gridX && piece.position.y === gridY) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(piece.position.x === x && piece.position.y === y - pawnDirection)) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }

                        return results;
                    }, []);

                    setPieces(updatedPieces);
                }
                else if (validMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (piece.position.x === gridX && piece.position.y === gridY) {
                            if (Math.abs(gridY - y) === 2 && piece.type === PieceType.PAWN) {
                                // SPECIAL MOVE
                                console.log("En passant true");
                                piece.enPassant = true;
                            } else {
                                piece.enPassant = false;
                            }
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(piece.position.x === x && piece.position.y === y)) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        // Pieces at the destination are implicitly removed (captured)
                        return results;
                    }, []);

                    setPieces(updatedPieces);
                    /*
                    setPieces((value) => {
                        const pieces = value.reduce((results, piece) => {
                            if (piece.x === gridX && piece.y === gridY) {
                                if (Math.abs(gridX - y) === 2 && piece.type === PieceType.PAWN) {
                                    //special move
                                    console.log("En passant true");
                                    piece.enPassant = true;
                                } else {
                                    piece.enPassant = true;
                                }
                                results.push({ ...piece, x: x, y: y });
                            } else if (!(piece.x === x && piece.y === y)) {
                                // keep pieces that are not at the destination
                                if (piece.type === PieceType.PAWN) {
                                    piece.enPassant = false;
                                }
                                results.push(piece);
                            }
                            // pieces at the destination are implicitly removed (captured)
                            return results;
                        }, []);

                        return pieces;
                    })*/
                } else {
                    //resets the piece position
                    // removes the piece being attacked
                    if (activePiece) {
                        activePiece.style.position = 'relative';
                        activePiece.style.removeProperty('top');
                        activePiece.style.removeProperty('left');
                    }
                }

            }
            setActivePiece(null);
        }
    }

    let board = [];
    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            let image = undefined;

            pieces.forEach(p => {
                if (p.position.x === i && p.position.y === j) {
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