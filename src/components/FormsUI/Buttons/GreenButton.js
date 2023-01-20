import React from 'react'
import {Spinner} from "react-bootstrap";

const GreenButton = ({onClick,title,fullWidth,disabled,loading,id, ...otherProps}) => {

    return <button id={id} disabled={disabled} className={`${disabled?" btn-gray":" btn-green  "}  ${fullWidth?" btn-block":""}`}
        onClick={onClick} {...otherProps}>

        {loading && (
            <Spinner
                className="me-2"
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
        )}
        {title}
    </button>


}

export default GreenButton;
