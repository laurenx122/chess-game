import { PieceType, TeamType } from "../Constants.jsx";

export default class Referee {
    tileIsOccupied(x, y, boardState) {
        console.log("Checking if occupied");

        const piece = boardState.find(p => p.position.x === x && p.position.y === y);

        if (piece) {
            return true;
        } else {
            return false;
        }
    }

    tileIsOccupiedByOpponent(x, y, boardState, team) {
        const piece = boardState.find(p => p.position.x === x && p.position.y === y && p.team !== team);
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
        // console.log(`Previous Location: (${px},${py})`);
        // console.log(`Current Location: (${x},${y})`);
        // console.log(`Piece Type: ${type}`);
        // console.log(`Team: ${team}`);

        if (type === PieceType.PAWN) {
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            // movement logic
            if (initialPosition.x === desiredPosition.x && initialPosition.y == specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection) {
                if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) && !this.tileIsOccupied(desiredPosition.x, desiredPosition.y - pawnDirection, boardState)) {
                    console.log("valid move");
                    return true;
                }
            } else if (initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
                if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
                    console.log("valid move");
                    return true;
                }
            }

            // attack logic
            else if (desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
                // attack in upper or bottom left corner
                console.log("upper/bottom left attack");
                if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team)) {
                    console.log("we can strike the enemy");
                    return true;
                }
            } else if (desiredPosition.x -initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
                // attack in upper or bottom right corner
                console.log("upper/bottom right attack");
                if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team)) {
                    console.log("we can strike the enemy");
                    return true;

                }
            }
        }
        return false;
    }
}