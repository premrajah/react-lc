import React, { Component } from "react";
import Paper from "../../img/paper.png";
import clsx from "clsx";
import HandBlue from "../../img/icons/hand.png";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchGray from "@material-ui/icons/Search";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";

class MyListingsOld extends Component {
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
                    <HeaderDark />

                    <div className="container   pb-4 pt-4">
                        <div className="row justify-content-center">
                            <div className="col-auto pb-4 pt-4">
                                <img className={"search-icon-middle"} src={HandBlue} />
                            </div>
                        </div>
                        <div className="row justify-content-center pb-2 pt-4 ">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>My Listings</h3>
                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">
                            <div className="col-auto">
                                <p className={"text-gray-light small"}>
                                    Accept or decline a match to start a loop.
                                </p>
                            </div>
                        </div>

                        <div className="row  justify-content-center search-container listing-row-border pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchField />
                            </div>
                        </div>

                        <div className="row  justify-content-center filter-row listing-row-border  mb-3 pt-3 pb-4">
                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    2 Searches{" "}
                                </p>
                            </div>
                            <div className="text-mute col-auto pl-0">
                                <span style={{ fontSize: "18px" }}>Status</span>
                            </div>
                        </div>

                        <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">
                            <div className={"col-4"}>
                                <img className={"img-fluid"} src={Paper} />
                            </div>
                            <div className={"col-6 pl-3 content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">
                                    Paper and Card
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    Loose / 14 kg
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    @Tescos
                                </p>
                            </div>
                            <div style={{ textAlign: "right" }} className={"col-2"}>
                                <p className={"text-gray-light small"}>Active</p>
                            </div>
                        </div>

                        <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">
                            <div className={"col-4"}>
                                <img className={"img-fluid"} src={Paper} />
                            </div>
                            <div className={"col-6 pl-3 content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">
                                    Metal
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    Loose / 14 kg
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    @Tescos
                                </p>
                            </div>
                            <div style={{ textAlign: "right" }} className={"col-2"}>
                                <p className={"orange-text small"}>Matched</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function SearchField() {
    const classes = useStylesTabs();

    return (
        <TextField
            variant="outlined"
            className={clsx(classes.margin, classes.textField) + " full-width-field"}
            id="input-with-icon-textfield"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchGray style={{ fontSize: 24, color: "#B2B2B2" }} />
                    </InputAdornment>
                ),
            }}
        />
    );
}

export default MyListingsOld;
