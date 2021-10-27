import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import clsx from "clsx";
import RingBlue from "../../img/icons/ring-blue.png";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchGray from "@material-ui/icons/Search";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import CycleItem from "../../components/CycleItem";
import PageHeader from "../../components/PageHeader";
import {Link} from "react-router-dom";

class MyCycles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            loops: [],
        };

        this.getCycles = this.getCycles.bind(this);
    }

    getCycles() {
        this.props.showLoading(true);

        axios
            .get(baseUrl + "cycle/expand", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data.data;

                    this.setState({
                        loops: response,
                    });

                    this.props.showLoading(false);
                },
                (error) => {
                    // var status = error.response.status

                    this.props.showLoading(false);
                }
            );
    }


    componentDidMount() {
        this.getCycles();
    }

    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={RingBlue}
                            pageTitle="Cycles"
                            subTitle="Cycles are your transactions in progress. View your created cycles here"
                        />

                        <div className="row mb-3">
                            <div className="col-12 d-flex justify-content-end">
                                <Link to="/cycles-record" className="btn btn-sm blue-btn">
                                    Cycles Record
                                </Link>
                            </div>
                        </div>

                        <div className="row   search-container  pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchField />
                            </div>
                        </div>

                        <div className={"listing-row-border "}></div>

                        <div className="row   filter-row   pt-3 pb-3">
                            <div className="col-6">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    Cycles
                                </p>
                            </div>
                            <div className="text-mute col-2 pl-0 text-right">
                                <span style={{ fontSize: "18px" }}>Price</span>
                            </div>

                            <div className="text-mute col-2 pl-0 text-right">
                                <span style={{ fontSize: "18px" }}>Status</span>
                            </div>
                            <div className="text-mute col-2 pl-0 text-right">
                                <span style={{ fontSize: "18px" }}>Created</span>
                            </div>
                        </div>
                        <div className={"listing-row-border mb-3"}></div>

                        {this.state.loops.length > 0 ? this.state.loops.filter(c => c.cycle.stage !== "closed").map((item, index) => (
                            <CycleItem item={item} key={index} />
                        )) : <div>...</div>}

                        {this.state.loops.length === 0 ? <div>Hurry up! You haven’t made any cycles yet</div> : <div></div>}
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
        showLoading: (data) => dispatch(actionCreator.showLoading(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(MyCycles);
