import React, {Component} from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import GlobalDialog from "../RightBar/GlobalDialog";
import GreenButton from "./Buttons/GreenButton";
import BlueBorderButton from "./Buttons/BlueBorderButton";


class CustomMoreMenu extends Component {
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
            showDuplicatePopUp: false,
            removePopUp: false,
            currentAction:null,
            showDialog:false
        };

        this.triggerCallback = this.triggerCallback.bind(this);
        this.setOpen = this.setOpen.bind(this);

    }

    toggleDialog() {
        this.setState({
            showDialog: !this.state.showDialog,
        });
    }


    setOpen(event) {
        event.stopPropagation();
        event.preventDefault();

        this.setState({
            open: !this.state.open,
        });
    }

    triggerCallback(action) {

        if (this.state.showDialog){
            this.toggleDialog()
        }
            this.props.triggerCallback(action);

    }

    handleClick = (event) => {
        event.stopPropagation();
        event.preventDefault();

        this.setState({
            anchorEl: event.currentTarget,
        });

        this.setOpen(event);
    };

    handleClose = (event,action) => {

        // event.stopPropagation()
        // event.preventDefault()

        if (!action.confirm) {
            this.triggerCallback(action);
            this.setState({

            })
        }else{
           this.setState({
               currentAction:action,

           })
            this.toggleDialog()
        }
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
                            {this.props.actions.map((action,index)=>
                                <MenuItem key={index} data-action={action.value} onClick={(event)=>this.handleClose(event,action)}>
                                    {action.label}
                                </MenuItem>
                            )}

                        </Menu>
                    </Button>





                </div>

                <GlobalDialog
                    size="sm"

                    heading={this.state.currentAction?this.state.currentAction.label:""}
                    show={this.state.showDialog}
                    hide={this.toggleDialog}
                >
                    <div className={"col-12"}>
                        <div className={"row justify-content-center"}>
                            <div className={"col-12"}>

                                {this.state.currentAction &&  <p className="text-sentence">
                                    Are you sure you want to {this.state.currentAction.label} this item?
                                </p>}
                            </div>
                        </div>

                        <div className={"row mt-4 justify-content-center"}>
                            <div className={"col-12 text-center "}>
                                <div className={"row justify-content-center"}>
                                    <div
                                        className={"col-6"}
                                        style={{ textAlign: "center" }}>
                                        <GreenButton
                                            onClick={()=>this.triggerCallback(this.state.currentAction)}
                                            title={"Yes"}
                                            type={"submit"}>

                                        </GreenButton>
                                    </div>
                                    <div
                                        className={"col-6"}
                                        style={{ textAlign: "center" }}>
                                        <BlueBorderButton
                                            onClick={this.toggleDialog}
                                            title={"Cancel"}
                                        >

                                        </BlueBorderButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlobalDialog>
            </>
        );
    }
}

export default CustomMoreMenu;
