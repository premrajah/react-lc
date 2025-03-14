import React, { Component } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import { Modal, ModalBody } from "react-bootstrap";
import BlueBorderButton from "./FormsUI/Buttons/BlueBorderButton";
import GreenButton from "./FormsUI/Buttons/GreenButton";
import GreenBorderButton from "./FormsUI/Buttons/GreenBorderButton";
import GlobalDialog from "./RightBar/GlobalDialog";

class MoreMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            items: [],
            previewImage: null,
            open: false,
            anchorEl: null,
            showDeletePopUp: false,
            showConfirmPopUp: false,
            removePopUp: false,
            actionConfirm: null,
        };

        this.triggerCallback = this.triggerCallback.bind(this);
        this.setOpen = this.setOpen.bind(this);
        this.deleteAction = this.deleteAction.bind(this);

        this.showDeletePopUp = this.showDeletePopUp.bind(this);
        this.showConfirmPopUp = this.showConfirmPopUp.bind(this);
        this.removePopUp = this.removePopUp.bind(this);
        this.removeAction = this.removeAction.bind(this);
    }

    removePopUp(event) {
        this.setState({
            removePopUp: !this.state.removePopUp,
        });
    }

    showConfirmPopUp(event) {
        this.setState({
            showConfirmPopUp: !this.state.showConfirmPopUp,
        });
    }

    showDeletePopUp(event) {
        // event.stopPropagation();
        // event.preventDefault();

        this.setState({
            showDeletePopUp: !this.state.showDeletePopUp,
        });
    }

    removeAction(event) {
        // event.stopPropagation();
        // event.preventDefault();

        this.setState({
            removePopUp: !this.state.removePopUp,
        });
        this.props.triggerCallback("remove");
    }

    deleteAction(event) {
        // event.stopPropagation();
        // event.preventDefault();

        this.setState({
            showDeletePopUp: !this.state.showDeletePopUp,
        });
        this.props.triggerCallback("delete");
    }

    takeAction = (event) => {
        // event.stopPropagation();
        // event.preventDefault();

        this.setState({
            showConfirmPopUp: !this.state.showConfirmPopUp,
        });
        this.props.triggerCallback(this.state.actionConfirm);
    };

    setOpen(event) {
        event.stopPropagation();
        event.preventDefault();

        this.setState({
            open: !this.state.open,
        });
    }

    triggerCallback(action) {
        if (action === "delete") {
            // this.props.triggerCallback(action)
            this.showDeletePopUp();
        } else if (action === "remove") {
            // this.props.triggerCallback(action)
            this.removePopUp();
        } else if (action === "duplicate" || action === "archive") {
            this.setState({
                actionConfirm: action,
            });

            this.showConfirmPopUp();
        } else {
            this.props.triggerCallback(action);
        }
    }

    handleClick = (event) => {
        event.stopPropagation();
        event.preventDefault();

        this.setState({
            anchorEl: event.currentTarget,
        });

        this.setOpen(event);
    };

    handleClose = (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation();

        if (event.currentTarget.dataset.action) {
            let action = event.currentTarget.dataset.action;

            this.triggerCallback(action);
        }

        this.setState({
            anchorEl: null,
        });

        this.setOpen(event);
    };

    render() {
        return (
            <>
                <div className={"more-menu-container"}>
                    <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={this.handleClick}>
                        <MoreIcon style={{ color: "#7a8896" }} />
                        <Menu
                            className={"more-menu-box"}
                            id={this.props.id}
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={this.state.open}
                            onClose={this.setOpen}>
                            {this.props.edit && (
                                <MenuItem data-action={"edit"} onClick={this.handleClose}>
                                    Edit
                                </MenuItem>
                            )}

                            {this.props.archive && (
                                <MenuItem data-action={"archive"} onClick={this.handleClose}>
                                    Archive
                                </MenuItem>
                            )}
                            {this.props.unArchive && (
                                <MenuItem data-action={"unArchive"} onClick={this.handleClose}>
                                    Unarchive
                                </MenuItem>
                            )}

                            {this.props.download && (
                                <MenuItem data-action={"download"} onClick={this.handleClose}>
                                    Download
                                </MenuItem>
                            )}

                            {this.props.delete && (
                                <MenuItem data-action={"delete"} onClick={this.handleClose}>
                                    Delete
                                </MenuItem>
                            )}
                            {this.props.update && (
                                <MenuItem data-action={"update"} onClick={this.handleClose}>
                                    {this.props.label}
                                </MenuItem>
                            )}

                            {this.props.duplicate && (
                                <MenuItem data-action={"duplicate"} onClick={this.handleClose}>
                                    Duplicate
                                </MenuItem>
                            )}
                            {this.props.remove && (
                                <MenuItem data-action={"remove"} onClick={this.handleClose}>
                                    Remove
                                </MenuItem>
                            )}
                            {this.props.release && (
                                <MenuItem data-action={"release"} onClick={this.handleClose}>
                                    Release
                                </MenuItem>
                            )}
                            {this.props.register && (
                                <MenuItem data-action={"register"} onClick={this.handleClose}>
                                    Register
                                </MenuItem>
                            )}
                            {this.props.untrack && (
                                <MenuItem data-action={"untrack"} onClick={this.handleClose}>
                                    Untrack
                                </MenuItem>
                            )}
                            {this.props.report && (
                                <MenuItem data-action={"report"} onClick={this.handleClose}>
                                    Report
                                </MenuItem>
                            )}

                            {this.props.serviceAgent && (
                                <MenuItem data-action={"serviceAgent"} onClick={this.handleClose}>
                                    Change Service Agent
                                </MenuItem>
                            )}

                            {this.props.stage && (
                                <MenuItem data-action={"stage"} onClick={this.handleClose}>
                                    Set Stage
                                </MenuItem>
                            )}
                            {this.props.addEvent && (
                                <MenuItem data-action={"addevent"} onClick={this.handleClose}>
                                    Add Event
                                </MenuItem>
                            )}

                            {this.props.approveRelease && (
                                <MenuItem data-action={"approveRelease"} onClick={this.handleClose}>
                                    Approve Release
                                </MenuItem>
                            )}

                            {this.props.selectCompany && (
                                <MenuItem data-action={"selectCompany"} onClick={this.handleClose}>
                                    Select Company
                                </MenuItem>
                            )}

                            {this.props.rent && (
                                <MenuItem data-action={"rent"} onClick={this.handleClose}>
                                    Rental Request
                                </MenuItem>
                            )}
                        </Menu>
                    </Button>

                    <GlobalDialog
                        size="sm"
                        heading="Delete"
                        show={this.state.showDeletePopUp}
                        hide={this.showDeletePopUp}>
                        <div className={"col-12"}>
                            <div className={"row justify-content-center"}>
                                <div className={"col-12"}>
                                    <p>Are you sure you want to delete this item?</p>
                                </div>
                            </div>
                            <div className={"row justify-content-center"}>
                                <div className={"col-12 text-center mt-2"}>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <GreenButton
                                                onClick={this.deleteAction}
                                                title={"Submit"}
                                                type={"submit"}></GreenButton>
                                        </div>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <BlueBorderButton
                                                onClick={this.showDeletePopUp}
                                                title={"Cancel"}></BlueBorderButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlobalDialog>
                    <GlobalDialog
                        size="sm"
                        heading={this.state.actionConfirm}
                        show={this.state.showConfirmPopUp}
                        hide={this.showConfirmPopUp}>
                        <div className={"col-12"}>
                            <div className={"row justify-content-center"}>
                                <div className={"col-12"}>
                                    <p>
                                        {`Are you sure you want to ${this.state.actionConfirm} this item?`}
                                    </p>
                                </div>
                            </div>

                            <div className={"row mt-4 justify-content-center"}>
                                <div className={"col-12 text-center "}>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <GreenButton
                                                onClick={this.takeAction}
                                                title={"Submit"}
                                                type={"submit"}></GreenButton>
                                        </div>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <BlueBorderButton
                                                onClick={this.showConfirmPopUp}
                                                title={"Cancel"}></BlueBorderButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlobalDialog>

                    <div onClick={(e) => e.stopPropagation()}>
                        <Modal
                            className={"loop-popup"}
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            show={this.state.removePopUp}
                            onHide={this.removePopUp}
                            animation={false}>
                            <ModalBody>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-10 text-center"}>
                                        <p className={"text-bold text-caps"}>Remove</p>
                                        <p>Are you sure you want to remove it ?</p>
                                    </div>
                                </div>

                                <div className={"row justify-content-center"}>
                                    <div className={"col-12 text-center mt-2"}>
                                        <div className={"row justify-content-center"}>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <GreenButton
                                                    fullWidth
                                                    onClick={this.removeAction}
                                                    title={"Submit"}
                                                    type={"submit"}>
                                                    Submit
                                                </GreenButton>
                                            </div>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <GreenBorderButton
                                                    fullWidth
                                                    title={"Cancel"}
                                                    onClick={this.removePopUp}>
                                                    Cancel
                                                </GreenBorderButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                </div>
            </>
        );
    }
}

export default MoreMenu;
