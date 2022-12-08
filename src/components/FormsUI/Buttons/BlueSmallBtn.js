import React from 'react'
import {Spinner} from "react-bootstrap";

const BlueSmallBtn = ({onClick,title,fullWidth,disabled,loading,classAdd, ...otherProps}) => {
    const { children } = otherProps
    return <button disabled={disabled}   className={`${classAdd}  ${disabled?" btn-gray btn-sm":" btn-sm btn-gray-border "}  ${fullWidth?" btn-block":""}`}
                   onClick={onClick} {...otherProps}>

        {loading && (
            <Spinner
                className={`mr-2 `}
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
        )}
        {children} {title}
    </button>


}

export default BlueSmallBtn;
