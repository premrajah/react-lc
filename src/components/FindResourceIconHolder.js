import React from 'react'
import {Figure} from "react-bootstrap";

const FindResourceIconHolder = ({iconClass, icon, text}) => {
    return (
        <div align="center" className={iconClass}>
            <Figure className="pt-3">
                <Figure.Image src={icon} />
                <Figure.Caption>{text}</Figure.Caption>
            </Figure>
        </div>
    )
}

export default FindResourceIconHolder