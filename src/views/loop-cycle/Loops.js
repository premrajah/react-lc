import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import clsx from "clsx";
import RingBlue from "../../img/icons/ring-blue.png";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchGray from "@material-ui/icons/Search";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";

class Loops extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            loops: [],
        };

        this.getLoops = this.getLoops.bind(this);
    }

    getLoops() {
        axios
            .get(baseUrl + "loop", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data.content;

                    this.setState({
                        loops: response,
                    });
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    componentDidMount() {
        this.getLoops();
    }

    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper accountpage">
                    <HeaderDark />

                    <div className="container   pb-4 pt-4">
                        <div className="row ">
                            <div className="col-auto pb-4 pt-4">
                                <img className={"search-icon-middle"} src={RingBlue} alt="" />
                            </div>
                        </div>
                        <div className="row  pb-2 pt-4 ">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Cycles</h3>
                            </div>
                        </div>

                        <div className="row  pb-4 pt-2 ">
                            <div className="col-auto">
                                <p className={"text-gray-light "}>
                                    Cycles are transactions in progress. Keep track of cycles in
                                    progress as well as{" "}
                                </p>
                            </div>
                        </div>

                        <div className="row   search-container listing-row-border pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchField />
                            </div>
                        </div>

                        <div className="row  justify-content-center filter-row listing-row-border  pt-3 pb-3">
                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    Cycles
                                </p>
                            </div>
                            <div className="text-mute col-auto pl-0">
                                <span style={{ fontSize: "18px" }}>Status</span>
                            </div>
                        </div>

                        {this.state.loops.map((item) => (
                            <div className="row no-gutters justify-content-start mt-4 mb-4 listing-row-border pb-4">
                                <div className={"col-8 content-box-listing"}>
                                    <Link to={"loop-detail/" + item.id}>
                                        <>
                                            <h5 style={{ fontSize: "18px" }} className=" mb-1">
                                                {item.resource.name}
                                            </h5>
                                            <p style={{ fontSize: "18px" }} className=" mb-1">
                                                {item.from.org_id} → {item.to.org_id}
                                            </p>
                                            <p
                                                style={{ fontSize: "16px" }}
                                                className="text-mute mb-1">
                                                {item.resource.category}
                                            </p>
                                            <p
                                                style={{ fontSize: "16px" }}
                                                className="text-mute mb-1">
                                                {item.resource.state} / {item.search.volume}{" "}
                                                {item.search.units}
                                            </p>
                                        </>
                                    </Link>
                                </div>
                                <div style={{ textAlign: "right" }} className={"col-4"}>
                                    <p className={"green-text text-mute text-bold small"}>
                                        {item.state}
                                    </p>
                                </div>
                            </div>
                        ))}
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

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Loops);
