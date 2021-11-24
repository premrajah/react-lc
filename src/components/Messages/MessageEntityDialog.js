import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Paper} from "@mui/material";
import Box from '@mui/material/Box';
import {capitalize} from "../../Util/GlobalFunctions";


const MessageEntityDialog = (props) => {

    const { onClose, open, entity } = props;

    const handleClose = () => {
        onClose(false);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog
            maxWidth={"xs"}
            fullWidth={true}

                 onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>

            <Box

                noValidate
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    m: 'auto',
                    width: 'fit-content',
                }}
            >

            <div className={"p-3 row"}>
                <div className={"col-12 text-left"}>
                    <p style={{ fontSize: "18px" }} className={" text-bold text-blue mb-1"}>Name: <span className={"text-gray-light"}>{entity && `${entity.name}`}</span></p>

                </div>

                <div className={"col-12"}>
                    <p
                        style={{ fontSize: "18px" }}
                        className=" text-bold text-blue mb-1">
                        Category: <span
                        style={{ fontSize: "16px" }}

                        className=" text-capitlize mb-1 cat-box text-left ">
                                                            <span className="">
                                                                {entity.category}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                            <span className=" text-capitlize">
                                                                {capitalize(entity.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                            <span className="  text-capitlize">
                                                                {capitalize(entity.state)}
                                                            </span>



                        </span>
                    </p>
                </div>
                <div className={"col-12 mt-3 mb-3 d-flex justify-content-end"}>
               <DialogActions
               > <button className=" btn-gray-border  " onClick={handleClose} color>
                            Close
                        </button>
               </DialogActions>
                </div>

            </div>
            </Box>
            {/*<DialogTitle id="simple-dialog-title">{entity && `Name: ${entity.name}`}</DialogTitle>*/}
            {/*<DialogContent>*/}
            {/*    {console.log(entity)}*/}
            {/*        {entity.description && <p>Description: {entity.description}</p>}*/}

            {/*</DialogContent>*/}
            {/*<DialogActions>*/}
            {/*    <button className="btn btn-pink" onClick={handleClose} color>*/}
            {/*        Close*/}
            {/*    </button>*/}
            {/*</DialogActions>*/}
        </Dialog>
    )
}

export default MessageEntityDialog;
