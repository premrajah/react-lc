import React, { Component } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import HandBlue from "../../img/icons/hand.png";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchGray from "@material-ui/icons/Search";

class Home extends Component {
    interval;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
    }



    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper accountpage">
                    <HeaderDark />

                    <div className="container   pb-4 pt-4">
                        <div className="row justify-content-center">
                            <div className="col-auto pb-4 pt-5">
                                <img className={"search-icon-middle"} src={HandBlue} alt="" />
                            </div>
                        </div>
                        <div className="row justify-content-center pb-2 pt-4 ">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>
                                    Have resources to sell?
                                </h3>
                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">
                            <div className="col-auto">
                                <p className={"text-gray-light small text-center"}>
                                    Create a listing and we’ll notify you when you get a match!
                                </p>
                            </div>
                        </div>

                        <div
                            className="row  justify-content-center search-container "
                            style={{ margin: "auto" }}>
                            <div className="col-auto">
                                <button
                                    type="button"
                                    className="shadow-sm mr-2 btn btn-link blue-btn mt-5 mb-2 btn-blue">
                                    <Link to={"/list-form"}>New Listing</Link>
                                </button>
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

export default Home;
