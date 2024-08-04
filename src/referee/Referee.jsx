import { PieceType, TeamType, Piece } from "./PieceType.jsx";

export default class Referee {
    tileIsOccupied(x, y, boardState) {
        console.log("Checking if occupied");

        const piece = boardState.find(p => p.x === x && p.y === y);

        if (piece) {
            return true;
        } else {
            return false;
        }
    }

    TileIsOccupiedByOpponent(x, y, boardState, team) {
        const piece = boardState.find(p => p.x === x && p.y === y && p.team !== team);
        if (piece) {
            return true;
        } else {
            return false;
        }
    }

    isEnPassantMove(px, py, x, y, type, team, boardState){
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;
        

        if(type === PieceType.PAWN){
            if ((x - px === -1 || x - px === 1) && y - py === pawnDirection) {
                const piece = boardState.find(
                    p => p.x === x && p.y === y - pawnDirection && p.enPassant
                );
                console.log("Pawns with enPassant true:", boardState.filter(p => p.type === PieceType.PAWN && p.enPassant));
                if(piece){
                    return true;
                }
            } 
        }

        return false;
    }


    isValidMove(px, py, x, y, type, team, boardState) {
        // console.log("Referee checking moves");
        // console.log(`Previous Location: (${px},${py})`);
        // console.log(`Current Location: (${x},${y})`);
        // console.log(`Piece Type: ${type}`);
        // console.log(`Team: ${team}`);

        if (type === PieceType.PAWN) {
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            // movement logic
            if (px === x && py == specialRow && y - py === 2 * pawnDirection) {
                if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y - pawnDirection, boardState)) {
                    console.log("valid move");
                    return true;
                }
            } else if (px === x && y - py === pawnDirection) {
                if (!this.tileIsOccupied(x, y, boardState)) {
                    console.log("valid move");
                    return true;
                }
            }

            // attack logic
            else if (x - px === -1 && y - py === pawnDirection) {
                // attack in upper or bottom left corner
                console.log("upper/bottom left attack");
                if (this.TileIsOccupiedByOpponent(x, y, boardState, team)) {
                    console.log("we can strike the enemy");
                    return true;
                }
            } else if (x - px === 1 && y - py === pawnDirection) {
                // attack in upper or bottom right corner
                console.log("upper/bottom right attack");
                if (this.TileIsOccupiedByOpponent(x, y, boardState, team)) {
                    console.log("we can strike the enemy");
                    return true;

                }
            }
        }
        return false;
    }
}