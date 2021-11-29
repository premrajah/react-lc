import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { capitalize } from "../../Util/GlobalFunctions";
import {Link} from "react-router-dom";

const MessageEntityDialog = (props) => {
    const { onClose, open, entity } = props;

    const handleClose = () => {
        onClose(false);
    };

    return (
        <Dialog
            maxWidth={"xs"}
            fullWidth={true}
            onClose={() => handleClose()}
            aria-labelledby="simple-dialog-title"
            open={open}>
            <DialogContent>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        m: "auto",
                        width: "fit-content",
                    }}>
                    <div className={"p-3 row"}>
                        <div className={"col-12 mb-2"}>
                            <Link to={`/p/${entity._key}`}>
                                <p style={{ fontSize: "18px" }} className={" text-bold text-blue mb-1"}>
                                    <span className="mr-1">Name:</span>
                                    <span className={"text-gray-light"}>
                                        {entity.name && entity.name}
                                    </span>
                                </p>
                            </Link>
                        </div>

                        <div className={"col-12 mb-2"}>
                            <p style={{ fontSize: "18px" }} className=" text-bold text-blue mb-1">
                                <span className="mr-1">Category:</span>
                                <span
                                    style={{ fontSize: "16px" }}
                                    className=" text-capitlize mb-1 cat-box text-left ">
                                    <span className="">{entity.category && entity.category}</span>
                                    <span className={"m-1 arrow-cat"}>&#10095;</span>
                                    <span className=" text-capitlize">
                                        {capitalize(entity.type && entity.type)}
                                    </span>
                                    <span className={"m-1 arrow-cat"}>&#10095;</span>
                                    <span className="  text-capitlize">
                                        {capitalize(entity.state && entity.state)}
                                    </span>
                                </span>
                            </p>
                        </div>

                        <div className="col-12 mb-2">
                            <p style={{ fontSize: "18px" }} className={" text-bold text-blue mb-1"}>
                                <span className="mr-1">Purpose:</span>
                                <span className={"text-gray-light"}>
                                    {entity.purpose && entity.purpose}
                                </span>
                            </p>
                        </div>

                        <div className="col-12 mb-2">
                            <p style={{ fontSize: "18px" }} className={" text-bold text-blue mb-1"}>
                                <span className="mr-1">Brand:</span>
                                <span className={"text-gray-light"}>
                                    {entity.sku && entity.sku.brand}
                                </span>
                            </p>
                        </div>

                        <div className="col-12 d-flex justify-content-end">
                            <Link to={`/p/${entity._key}`}>
                                <p style={{ fontSize: "18px" }} className={" text-bold text-blue mb-1"}>
                                    <span className={"text-bold green-text mb-1"}>
                                        Go to product
                                    </span>
                                </p>
                            </Link>
                        </div>

                    </div>
                </Box>
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
