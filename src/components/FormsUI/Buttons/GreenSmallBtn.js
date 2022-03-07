import React from 'react'
import {Spinner} from "react-bootstrap";

const GreenSmallBtn = ({onClick,title,fullWidth,disabled,loading, ...otherProps}) => {

    return <button className={`${disabled?" btn-gray":" btn btn-sm btn-green-small"}  ${fullWidth?" btn-block":""}`}
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

export default GreenSmallBtn;
