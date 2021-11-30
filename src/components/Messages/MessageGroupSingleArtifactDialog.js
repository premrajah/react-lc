import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { capitalize } from "../../Util/GlobalFunctions";
import {Link} from "react-router-dom";
import ImagesSlider from "../ImagesSlider/ImagesSlider";
import PlaceholderImg from "../../img/place-holder-lc.png";

const MessageGroupSingleArtifactDialog = (props) => {
    const { onClose, open, artifacts } = props;

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
                        <div className="col-12">

                            {artifacts.length > 0 ? (
                                <ImagesSlider images={artifacts} />
                            ) : (
                                <img
                                    className={"img-fluid"}
                                    src={PlaceholderImg}
                                    alt=""
                                />
                            )}
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

export default MessageGroupSingleArtifactDialog;
