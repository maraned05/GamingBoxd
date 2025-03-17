import React from "react";
import './CloseButton.css'

function CloseButton ({ setIsOpen }) {
    return (
        <button className="closeBtn" onClick={() => setIsOpen(false)}>close</button>
    );
};

export default CloseButton;