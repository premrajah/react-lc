import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import ListIcon from "../../img/icons/list.png";
import AmountIcon from "../../img/icons/amount.png";
import StateIcon from "../../img/icons/state.png";
import PaperImg from "../../img/paper-big.png";
import Sidebar from "../menu/Sidebar";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import { makeStyles } from "@material-ui/core/styles";
import MarkerIcon from "../../img/icons/marker.png";
import CalenderIcon from "../../img/icons/calender.png";

class DeliveryResource extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };

        this.getResources = this.getResources.bind(this);
    }

    getResources() {
        axios
            .get(baseUrl + "resource", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data;
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    interval;



    render() {
        return (
            <div>
                <Sidebar />

                <div className="wrapper accountpage">
                    <div className="container-fluid " style={{ padding: "0" }}>
                        <div className="row no-gutters  justify-content-center">
                            <div className="floating-back-icon" style={{ margin: "auto" }}>
                                <NavigateBefore style={{ fontSize: 32, color: "white" }} />
                            </div>

                            <div className="col-auto ">
                                <img className={"img-fluid"} src={PaperImg} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="container ">
                        <div className="row justify-content-start pb-3 pt-4 listing-row-border">
                            <div className="col-12">
                                <p className={"green-text text-heading"}>@Tesco</p>
                            </div>
                            <div className="col-12 mt-2">
                                <h5 className={"blue-text text-heading"}>Food boxes needed</h5>
                            </div>
                        </div>

                        <div className="row justify-content-start pb-3 pt-3 listing-row-border">
                            <div className="col-auto">
                                <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                    Looking for disposable food boxes. Any sizes are suitable.
                                    Please message me if you have any available.
                                </p>
                            </div>
                        </div>

                        <div className="row justify-content-start pb-4 pt-3 ">
                            <div className="col-auto">
                                <h6 className={""}>Item Details</h6>
                            </div>
                        </div>
                    </div>
                    <div className={"container"}>
                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={ListIcon} alt="" />
                            </div>
                            <div className={"col-auto"}>
                                <p
                                    style={{ fontSize: "18px" }}
                                    className="text-mute text-gray-light mb-1">
                                    Surrey, UK
                                </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                    Paper and Card >
                                </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                    Disposable Food Boxes
                                </p>
                            </div>
                        </div>
                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={AmountIcon} alt="" />
                            </div>
                            <div className={"col-auto"}>
                                <p
                                    style={{ fontSize: "18px" }}
                                    className="text-mute text-gray-light mb-1">
                                    Amount
                                </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                    10 Kgs
                                </p>
                            </div>
                        </div>

                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={StateIcon} alt="" />
                            </div>
                            <div className={"col-auto"}>
                                <p
                                    style={{ fontSize: "18px" }}
                                    className="text-mute text-gray-light mb-1">
                                    State
                                </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                    Bailed
                                </p>
                            </div>
                        </div>

                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={CalenderIcon} alt="" />
                            </div>
                            <div className={"col-auto"}>
                                <p
                                    style={{ fontSize: "18px" }}
                                    className="text-mute text-gray-light mb-1">
                                    Required by
                                </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                    June 1, 2020
                                </p>
                            </div>
                        </div>
                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={MarkerIcon} alt="" />
                            </div>
                            <div className={"col-auto"}>
                                <p
                                    style={{ fontSize: "18px" }}
                                    className="text-mute text-gray-light mb-1">
                                    Location
                                </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                    Mapledown, Which Hill Lane,
                                </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                    Woking, Surrey, GU22 0AH
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="container container-divider">
                        <div className="row"></div>
                    </div>
                    <div className="container mt-4 ">
                        <div className="row no-gutters">
                            <div className="col-12 mb-4">
                                <h5 className="mb-1">About the seller </h5>
                            </div>
                            <div className="col-auto ">
                                <figure className="avatar avatar-60 border-0">
                                    <img src="img/user1.png" alt="" />
                                </figure>
                            </div>
                            <div className="col pl-2 align-self-center">
                                <div className="row no-gutters">
                                    <div className="col-12">
                                        <p style={{ fontSize: "18px" }} className=" ">
                                            Seller Company
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="">
                                            48 items listed | 4 cycles
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <BottomAppBar />
                </div>
            </div>
        );
    }
}

const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: "auto",
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: "absolute",
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: "0 auto",
    },
}));

function BottomAppBar() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div
                        className="row  justify-content-center search-container "
                        style={{ margin: "auto" }}>
                        <div className="col-auto">
                            <button
                                type="button"
                                className=" mr-2 btn btn-link green-btn-min mt-2 mb-2 ">
                                Deliver
                            </button>
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 ">
                                Buy
                            </button>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default DeliveryResource;
