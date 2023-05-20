import React from "react";

const Carta = ({ cor, numero }) => {
    return (
      <div className="card" style={cor ? { backgroundColor: cor } : null}>
        <span className="card-text">{numero}</span>
      </div>
    );
  };
export default Carta;
