import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types'
import './Chessboard.css'
import Tile from '../Tile/Tile'
import Referee from '../../referee/Referee.jsx';
import { 
    HORIZONTAL_AXIS, 
    VERTICAL_AXIS, 
    GRID_SIZE, 
    PieceType, 
    TeamType, 
    initialBoardState, 
    Position, 
    samePosition 
} from '../../Constants.jsx';


Tile.propTypes = {
    image: PropTypes.string,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    type: PieceType,
    team: TeamType
};


const Chessboard = () => {
    const [activePiece, setActivePiece] = useState(null);
    const [grabPosition, setGrabPosition] = useState(null);
    const [pieces, setPieces] = useState(initialBoardState);
    const chessboardRef = useRef(null);
    const referee = new Referee();


    function grabPiece(e) {
        const element = e.target;
        const chessboard = chessboardRef.current;
        if (element instanceof HTMLElement && element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            setGrabPosition({ x: grabX, y: grabY });

            const x = e.clientX - (GRID_SIZE / 2);
            const y = e.clientY - (GRID_SIZE / 2);

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
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));

            const currentPiece = pieces.find(
                p => samePosition(p.position, grabPosition)
            );

            if (currentPiece) {
                const validMove = referee.isValidMove(
                    grabPosition,
                    {x, y},
                    currentPiece?.type, 
                    currentPiece?.team, 
                    pieces
                );

                const isEnPassantMove = referee.isEnPassantMove(
                    grabPosition,
                    {x, y},
                    currentPiece.type, 
                    currentPiece.team, 
                    pieces
                );

                const pawnDirection = (currentPiece.team === TeamType.OUR) ? 1 : -1;

                if (isEnPassantMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(samePosition(piece.position, {x, y: y-pawnDirection}))) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }

                        return results;
                    }, []);

                    setPieces(updatedPieces);
                    setActivePiece(null);
                    setGrabPosition(null);
                }
                else if (validMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;
                            
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (!(samePosition(piece.position, {x, y}))) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;
                    }, []);

                    setPieces(updatedPieces);
                    setActivePiece(null);
                    setGrabPosition(null);
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
    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find(p => samePosition(p.position, {x: i, y:j}));
            let image = piece ? piece.image : undefined;

            board.push(<Tile key={`${j},${i}`} image={image} number={number} />)
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