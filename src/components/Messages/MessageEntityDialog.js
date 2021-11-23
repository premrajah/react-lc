import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Paper} from "@mui/material";


const MessageEntityDialog = (props) => {

    const { onClose, open, entity } = props;

    const handleClose = () => {
        onClose(false);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{entity && `Name: ${entity.name}`}</DialogTitle>
            <DialogContent>
                {console.log(entity)}
                    {entity.description && <p>Description: {entity.description}</p>}

            </DialogContent>
            <DialogActions>
                <button className="btn btn-pink" onClick={handleClose} color>
                    Close
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default MessageEntityDialog;