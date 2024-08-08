import { PieceType, samePosition, TeamType } from "../Constants.jsx";

export default class Referee {
    tileIsEmptyOrOccupiedByOpponent(position, boardState, team) {

        return (!this.tileIsOccupied(position, boardState) || this.tileIsOccupiedByOpponent(position, boardState, team));
        // if (!this.tileIsOccupied(position, boardState)) {
        //     return true;
        // }
        // return this.tileIsOccupiedByOpponent(position, boardState, team);
    }

    tileIsOccupied(position, boardState) {
        const piece = boardState.find(p => samePosition(p.position, position));
        // return !!piece;
        if (piece) {
            return true;
        } else {
            return false;
        }
    }

    tileIsOccupiedByOpponent(position, boardState, team) {
        const piece = boardState.find(
            p => samePosition(p.position, position) &&
                p.team !== team
        );
        // return !!piece;
        if (piece) {
            return true;
        } else {
            return false;
        }
    }

    isEnPassantMove(initialPosition, desiredPosition, type, team, boardState) {
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;


        if (type === PieceType.PAWN) {
            if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
                const piece = boardState.find(
                    p =>
                        p.position.x === desiredPosition.x &&
                        p.position.y === desiredPosition.y - pawnDirection &&
                        p.enPassant
                );
                console.log("Pawns with enPassant true:", boardState.filter(p => p.type === PieceType.PAWN && p.enPassant));
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }


    isValidMove(initialPosition, desiredPosition, type, team, boardState) {
        // console.log("Referee checking moves");
        // console.log(`Previous Location: (${initialPosition.x},${initialPosition.y})`);
        // console.log(`Current Location: (${desirePosition.x},${desiredPosition.y})`);
        // console.log(`Piece Type: ${type}`);
        // console.log(`Team: ${team}`);

        if (type === PieceType.PAWN) {

            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            // movement logic

            if (
                initialPosition.x === desiredPosition.x &&
                initialPosition.y == specialRow &&
                desiredPosition.y - initialPosition.y === 2 * pawnDirection
            ) {
                if (
                    !this.tileIsOccupied(desiredPosition, boardState) &&
                    !this.tileIsOccupied(
                        { x: desiredPosition.x, y: desiredPosition.y - pawnDirection },
                        boardState)
                ) {
                    return true;
                }
            } else if (
                initialPosition.x === desiredPosition.x &&
                desiredPosition.y - initialPosition.y === pawnDirection) {
                if (
                    !this.tileIsOccupied(desiredPosition, boardState)
                ) {
                    return true;
                }
            }

            // attack logic

            else if (
                desiredPosition.x - initialPosition.x === -1 &&
                desiredPosition.y - initialPosition.y === pawnDirection
            ) {
                if (
                    this.tileIsOccupiedByOpponent(
                        desiredPosition,
                        boardState,
                        team)
                ) {
                    return true;
                }
            } else if (
                desiredPosition.x - initialPosition.x === 1 &&
                desiredPosition.y - initialPosition.y === pawnDirection
            ) {
                if (
                    this.tileIsOccupiedByOpponent(
                        desiredPosition,
                        boardState,
                        team)
                ) {
                    return true;

                }
            }
        } else if (type === PieceType.KNIGHT) {

            // movement logic
            for (let i = -1; i < 2; i += 2) {
                for (let j = -1; j < 2; j += 2) {

                    // top/bottom movement
                    if (desiredPosition.y - initialPosition.y === 2 * i) {
                        if (desiredPosition.x - initialPosition.x === j) {
                            if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                                return true;
                            }
                        }
                    }

                    // right/left movement
                    if (desiredPosition.x - initialPosition.x === 2 * i) {
                        if (desiredPosition.y - initialPosition.y === j) {
                            if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                                return true;
                            }
                        }
                    }
                }
            }



        } else if (type === PieceType.BISHOP) {

            //movement and attack logic

            for (let i = 1; i < 8; i++) {
                //up right movement
                if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
                    const passedPosition = {
                        x: initialPosition.x + i,
                        y: initialPosition.y + i
                    };

                    if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
                        if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                            return true;
                        } else {
                            break;
                        }
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)) {
                            break;
                        }
                    }
                }


                // Bottom-right movement
                if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
                    const passedPosition = {
                        x: initialPosition.x + i,
                        y: initialPosition.y - i
                    };

                    if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
                        if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                            return true;
                        } else {
                            break;
                        }
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)) {
                            break;
                        }
                    }
                }

                // Bottom-left movement
                if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
                    const passedPosition = {
                        x: initialPosition.x - i,
                        y: initialPosition.y - i
                    };

                    if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
                        if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                            return true;
                        } else {
                            break;
                        }
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)) {
                            break;
                        }
                    }
                }

                // Top-left movement
                if (desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
                    const passedPosition = {
                        x: initialPosition.x - i,
                        y: initialPosition.y + i
                    };

                    if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
                        if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                            return true;
                        } else {
                            break;
                        }
                    } else {
                        if (this.tileIsOccupied(passedPosition, boardState)) {
                            break;
                        }
                    }
                }
            }
        }

        return false;
        
    }
}