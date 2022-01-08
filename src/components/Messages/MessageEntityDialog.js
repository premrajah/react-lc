import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { capitalize } from "../../Util/GlobalFunctions";
import {Link} from "react-router-dom";
import SubproductItem from "../Products/Item/SubproductItem";

const MessageEntityDialog = (props) => {
    const { onClose, open, entity } = props;

    const handleClose = () => {
        onClose(false);
    };

    return (
        <Dialog
            maxWidth={"lg"}
            // fullWidth={true}
            onClose={() => handleClose()}
            aria-labelledby="simple-dialog-title"
            open={open}>
            <DialogContent>



                        <SubproductItem
                        item={entity}
                        smallImage
                        hideMoreMenu
                        />


            </DialogContent>

            <DialogActions>
                <div className={"col-12 mt-3 mb-3 d-flex justify-content-end"}>
                    <button className=" btn-gray-border  " onClick={() => handleClose()} color>
                        Close
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default MessageEntityDialog;
