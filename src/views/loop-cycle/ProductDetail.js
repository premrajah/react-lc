import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { baseUrl, frontEndUrl } from "../../Util/Constants";
import axios from "axios/index";
import CubeBlue from "../../img/icons/product-icon-big.png";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import BusinessIcon from "@material-ui/icons/Business";

class ProductDetail extends Component {
    slug;

    item;

    productQrCode;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            codeImg: null,
            searches: [],
        };

        this.slug = props.match.params.slug;

        this.getResources = this.getResources.bind(this);
        this.getQrCode = this.getQrCode.bind(this);
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };

    getQrCode(id) {
        this.productQrCode =
            "http://api.makealoop.io/api/2/product/" + id + "/code?u=" + frontEndUrl + "p";
    }

    getResources() {
        axios
            .get(baseUrl + "product/" + this.slug, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    let responseAll = response.data;

                    this.setState({
                        item: responseAll.data,
                    });

                    this.getQrCode(response.data.id);
                },
                (error) => {
                    let status = error.response.status;
                }
            );
    }

    componentDidMount() {
        this.getResources();
    }

    render() {
        return (
            <div>
                <Sidebar />
                <div className="accountpage">
                    <HeaderDark />

                    {this.state.item && (
                        <>
                            <div className="container mt-5 pt-5 ">
                                <div className="row justify-content-start pb-3 pt-4 ">
                                    <div className="col-12">
                                        <h3 className={"blue-text text-heading"}>View Products</h3>
                                    </div>
                                </div>

                                <div className="row justify-content-start pb-3 pt-4 border-box">
                                    <div className="col-12">
                                        <h3 className={"blue-text text-bold"}>
                                            {this.state.item.product.title}
                                        </h3>
                                    </div>

                                    <div className="col-12  pb-3 listing-row-border">
                                        <p>
                                            Made By
                                            <span className={"green-text"}>Info Missing</span>
                                        </p>
                                    </div>

                                    <div className="col-12 mt-3 pb-3 listing-row-border">
                                        <p>{this.state.item.product.description}</p>
                                    </div>
                                    <div className="col-12 mt-3 pb-3 ">
                                        <p
                                            style={{ width: "auto", padding: "2px 10px" }}
                                            className={" btn-select-free green-bg"}>
                                            {this.state.item.product.purpose}
                                        </p>
                                    </div>

                                    <div className="col-12 mt-3 pb-3 ">
                                        <div className="row ">
                                            <div className="col-1 ">
                                                <img
                                                    style={{ width: "40px" }}
                                                    className={"search-icon-middle"}
                                                    src={CubeBlue}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="col-11 ">
                                                <div className={"col-12 blue-text text-bold"}>
                                                    Created
                                                </div>
                                                <div className={"col-12 "}>
                                                    Sept 9, 2020 at 9:34 AM
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row justify-content-start pb-3 pt-3 ">
                                    <div className="col-12">
                                        <h5 className={"text-bold blue-text"}>Cyclecode</h5>
                                    </div>

                                    <div className="col-12">
                                        <p
                                            style={{ fontSize: "16px" }}
                                            className={"text-gray-light "}>
                                            Scan the QR code below to view this product
                                        </p>
                                    </div>
                                </div>

                                <div className="row justify-content-start pb-3 pt-4 border-box">
                                    <div className="col-12">
                                        <img
                                            src={this.productQrCode}
                                            alt={this.props.item.product.name}
                                            title={this.props.item.product.name}
                                        />

                                        <Link to={"/p/" + this.state.item.product._key}>
                                            Go To Preview Page
                                        </Link>
                                    </div>
                                </div>

                                <div className="row justify-content-start pb-3 pt-3 ">
                                    <div className="col-12">
                                        <h5 className={"text-bold blue-text"}>Searches</h5>
                                    </div>

                                    <div className="col-12">
                                        <p
                                            style={{ fontSize: "16px" }}
                                            className={"text-gray-light "}>
                                            All searches assigned to this product.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: "6px 16px",
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

function CustomizedTimeline() {
    const classes = useStyles();

    return (
        <Timeline align="alternate">
            <TimelineItem>
                {/*<TimelineOppositeContent>*/}
                {/*<Typography variant="body2" color="textSecondary">*/}
                {/*9:30 am*/}
                {/*</Typography>*/}
                {/*</TimelineOppositeContent>*/}
                <TimelineSeparator>
                    <TimelineDot>
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company A
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Plastics</p>
                            <p>4 Kgs</p>
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                {/*<TimelineOppositeContent>*/}
                {/*<Typography variant="body2" color="textSecondary">*/}
                {/*10:00 am*/}
                {/*</Typography>*/}
                {/*</TimelineOppositeContent>*/}
                <TimelineSeparator>
                    <TimelineDot color="primary">
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company B
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Paper and Card </p>
                            <p>5 Kgs</p>
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary" variant="outlined">
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector className={classes.secondaryTail} />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company C
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Other </p>
                            <p>9 Kgs</p>
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
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
export default connect(mapStateToProps, mapDispachToProps)(ProductDetail);
