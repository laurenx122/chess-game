export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"]
export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"]

export const GRID_SIZE = 100;

export function samePosition(p1, p2){
    return p1.x === p2.x && p1.y === p2.y;
}

export const Position = {
    x: 0,
    y: 0
}

export const TeamType = {
    OPPONENT: 'OPPONENT',
    OUR: 'OUR'
};

export const PieceType = {
    PAWN: 'PAWN',
    BISHOP: 'BISHOP',
    KNIGHT: 'KNIGHT',
    ROOK: 'ROOK',
    QUEEN: 'QUEEN',
    KING: 'KING'
};

export const Piece = {
    image: '',
    position: Position,
    type: null,
    team: null,
    enPassant: false
};


export const initialBoardState = [];
for (let p = 0; p < 2; p++) {
    const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR;
    const type = (teamType === TeamType.OPPONENT) ? "b" : "w";
    const y = (teamType === TeamType.OPPONENT) ? 7 : 0;

    initialBoardState.push({
        image: `chess-pieces/rook_${type}.png`,
        position: {
            x: 0, y
        },
        type: PieceType.ROOK,
        team: TeamType
    })
    initialBoardState.push({
        image: `chess-pieces/knight_${type}.png`,
        position: {
            x: 1, y
        },
        type: PieceType.KNIGHT,
        team: TeamType
    })
    initialBoardState.push({
        image: `chess-pieces/bishop_${type}.png`,
        position: {
            x: 2, y,
        },
        type: PieceType.BISHOP,
        team: TeamType
    })
    initialBoardState.push({
        image: `chess-pieces/queen_${type}.png`,
        position: {
            x: 3, y,
        },
        type: PieceType.QUEEN,
        team: TeamType
    })
    initialBoardState.push({
        image: `chess-pieces/king_${type}.png`,
        position: {
            x: 4, y,
        },
        type: PieceType.KING,
        team: TeamType
    })
    initialBoardState.push({
        image: `chess-pieces/bishop_${type}.png`,
        position: {
            x: 5, y,
        },
        type: PieceType.BISHOP,
        team: TeamType
    })
    initialBoardState.push({
        image: `chess-pieces/knight_${type}.png`,
        position: {
            x: 6, y,
        },
        type: PieceType.KNIGHT,
        team: TeamType
    })
    initialBoardState.push({
        image: `chess-pieces/rook_${type}.png`,
        position: {
            x: 7, y,
        },
        type: PieceType.ROOK,
        team: TeamType
    })
}

for (let i = 0; i < 8; i++) {
    initialBoardState.push({
        image: "chess-pieces/pawn_b.png",
        position: {
            x: i, y: 6,
        },
        type: PieceType.PAWN,
        team: TeamType.OPPONENT
    })
}


for (let i = 0; i < 8; i++) {
    initialBoardState.push({
        image: "chess-pieces/pawn_w.png",
        position: {
            x: i, y: 1,
        },
        type: PieceType.PAWN,
        team: TeamType.OUR
    })
}
