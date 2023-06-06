import React from 'react'
import IconButton from "@mui/material/IconButton";
import {Close} from "@mui/icons-material";
import {Spinner} from "react-bootstrap";

const CloseButtonPopUp = ({onClick,loading,disabled, ...otherProps}) => {


    return <>  <IconButton disabled={disabled} style={{border: "1px solid #eee"}} onClick={onClick}>

        {loading ? (
            <Spinner
                className={`mr-2 `}
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
        ): <Close />}

    </IconButton>
    </>

}

export default CloseButtonPopUp;
