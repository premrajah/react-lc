import React from 'react'
import {Spinner} from "react-bootstrap";

const GrayBorderBtn = ({onClick,title,fullWidth,disabled,loading,classes, ...otherProps}) => {

    return <button className={`${disabled?" btn-gray":" btn btn-sm btn-gray-border"}    ${fullWidth?" btn-block":""}  ${classes}`}
                   onClick={onClick} {...otherProps}>

        {loading && (
            <Spinner
                className="mr-2"
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

export default GrayBorderBtn;
