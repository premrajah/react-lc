import React from 'react'
import {Spinner} from "react-bootstrap";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

const BlueSmallBtn = ({onClick,title,fullWidth,disabled,loading,classAdd,progressLoading,progressValue, ...otherProps}) => {
    const { children } = otherProps
    return <button disabled={disabled}   className={`${classAdd}  ${disabled?" btn-gray-disabled btn-sm":" btn-sm btn-gray-border "}  ${fullWidth?" btn-block":""}`}
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
        {progressLoading &&  <CircularProgressWithLabel  value={progressValue?progressValue:0} />}
        {title}
        {children}
    </button>


}

export default BlueSmallBtn;
