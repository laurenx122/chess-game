import React from 'react';
import './Tile.css'
import PropTypes from 'prop-types';


Tile.propTypes = {
    number: PropTypes.number.isRequired,
    image: PropTypes.string
};



function Tile({ number, image }) {
    if (number % 2 === 0) {
        return (
            <div className="tile black-tile">
                {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
            </div>
        );
    } else {
        return (
            <div className="tile white-tile">
                {image  && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
            </div>
        );
    }

    
}


export default Tile;