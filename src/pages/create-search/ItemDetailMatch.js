import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import HeaderDark from "../../views/header/HeaderDark";
import Sidebar from "../../views/menu/Sidebar";
import { makeStyles } from "@mui/styles";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import encodeUrl from "encodeurl";
import { Modal, ModalBody } from "react-bootstrap";
import { withStyles } from "@mui/styles/index";
import TextField from "@mui/material/TextField";
import ProductExpandItem from "../../components/Products/ProductExpandItem";
import Layout from "../../components/Layout/Layout";

class ItemDetailMatch extends Component {
    listing;
    search;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp: false,
            matches: [],
            matchExist: false,
            match: null,
            site: null,
            previewImage: null,
        };

        this.getPreviewImage = this.getPreviewImage.bind(this);

        // this.listing = props.match.params.listing;
        // this.search = props.match.params.search;

        this.getResources = this.getResources.bind(this);
        this.requestMatch = this.requestMatch.bind(this);
        this.showPopUp = this.showPopUp.bind(this);

        this.getMatches = this.getMatches.bind(this);
        this.checkMatch = this.checkMatch.bind(this);
        this.getSite = this.getSite.bind(this);
    }

    getPreviewImage(productSelectedKey) {
        axios
            .get(baseUrl + "product/" + productSelectedKey.replace("Product/", "") + "/artifact", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    if (responseAll.length > 0) {
                        this.setState({
                            previewImage: responseAll[0].blob_url,
                        });
                    }
                },
                (error) => {}
            );
    }

    getSite(item) {
        axios
            .get(baseUrl + "site/" + item.site_id.replace("Site/", ""), {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data;

                    this.setState({
                        site: responseData.data,
                    });
                },
                (error) => {
                    // this.setState({
                    //
                    //     notFound: true
                    // })
                }
            );
    }

    requestMatch() {
        axios
            .post(
                baseUrl + "match",
                {
                    listing_id: this.listing,
                    search_id: this.search,
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: false,
                    matchExist: true,
                });

                this.checkMatch();

                // this.getResources()
            })
            .catch((error) => {
                //

                this.setState({
                    showPopUp: true,
                    // loopError: error.response.data.data.message
                });
            });
    }

    showPopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp,
        });
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };

    getResources() {
        axios
            .get(baseUrl + "listing/" + encodeUrl(this.listing) + "/expand", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data;

                    this.setState({
                        item: responseData.data,
                        site: responseData.data.site,
                    });

                    this.getPreviewImage(responseData.data.product._id);
                },
                (error) => {}
            );
    }

    getMatches() {
        axios
            .get(baseUrl + "match/listing/" + encodeUrl(this.listing), {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data;

                    this.setState({
                        matches: response.data,
                    });
                },
                (error) => {}
            );
    }

    checkMatch() {
        axios
            .get(baseUrl + "match/search-and-listing/" + this.search + "/" + this.listing, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data.data;

                    if (responseData) {
                        this.setState({
                            matchExist: true,
                            match: responseData,
                        });
                    }
                },
                (error) => {}
            );
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props) {

            this.listing = this.props.listingId;
            this.search = this.props.searchId;
            this.checkMatch();
            this.getResources();

        }
    }

    componentDidMount() {


        this.listing = this.props.listingId;
        this.search = this.props.searchId;
        this.checkMatch();
        this.getResources();
    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>


                    {this.state.item && (
                        <>
                            <div className="container " style={{ padding: "0" }}>
                                <div className="row  pt-4 pb-4  justify-content-center">
                                    {/*<div className="text-left    col-sm-12 col-xs-12 breadcrumb-row">*/}
                                    {/*    <Link to={"/sites"}>My Sites</Link><span className={"divider-breadcrumb ps-2 pe-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.state.item&&this.state.item.site.name}</span>*/}

                                    {/*</div>*/}
                                </div>
                                <div className="row no-gutters  justify-content-center">
                                    <div className="col-md-4 col-sm-12 col-xs-12 ">
                                        {/*{this.state.item.images.length > 0 ?*/}
                                        {/*<ImagesSlider images={this.state.item.images} /> :*/}
                                        {/*<img className={"img-fluid"} src={PlaceholderImg} alt="" />}*/}

                                        <div className="row stick-left-box  ">
                                            <div className="col-12 text-center ">
                                                <img
                                                    className={"img-fluid"}
                                                    src={
                                                        this.state.previewImage
                                                            ? this.state.previewImage
                                                            : PlaceholderImg
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"col-md-8 col-sm-12 col-xs-12 ps-4 pb-5"}>
                                        <div className="row justify-content-start pb-3 pt-4 listing-row-border">
                                            <div className="col-12 mt-2">
                                                <h4 className={"blue-text text-heading"}>
                                                    {this.state.item.listing.name}
                                                </h4>
                                            </div>

                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-7">
                                                        <p>
                                                            <span className={"green-text"}>
                                                                {this.state.item.org.name}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <div className="col-3 green-text text-heading text-right">
                                                        {this.state.item.listing.price ? (
                                                            <>
                                                                GBP {
                                                                    this.state.item.listing.price
                                                                        .value
                                                                }
                                                            </>
                                                        ) : (
                                                            "Free"
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row justify-content-start pb-3 pt-2 listing-row-border">
                                            <div className="col-auto">
                                                <p
                                                    style={{ fontSize: "16px" }}
                                                    className={"text-gray-light "}>
                                                    {this.state.item.listing.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row  justify-content-start search-container  pb-2">
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Category
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                                    {this.state.item.listing.category},
                                                    {this.state.item.listing.type},
                                                    {this.state.item.listing.state}
                                                </p>
                                                {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.listing.type}></p>*/}
                                                {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.listing.state}</p>*/}
                                            </div>
                                        </div>

                                        {/*<div className="row  justify-content-start search-container  pb-2">*/}

                                        {/*<div className={"col-auto"}>*/}

                                        {/*<p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Manufacturer</p>*/}
                                        {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.org.name} </p>*/}
                                        {/*</div>*/}
                                        {/*</div>*/}

                                        <div className="row  justify-content-start search-container  pb-2">
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Available From
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                                    {moment(
                                                        this.state.item &&
                                                            this.state.item.listing
                                                                .available_from_epoch_ms
                                                    ).format("DD MMM YYYY")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row  justify-content-start search-container pb-2 ">
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Available Until
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">

                                                    {this.state.item &&
                                                        moment(
                                                            this.state.item.listing
                                                                .expire_after_epoch_ms
                                                        ).format("DD MMM YYYY")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row  justify-content-start search-container pt-2  pb-2">
                                            {/*<div className={"col-1"}>*/}
                                            {/*<MarkerIcon  style={{ fontSize: 30, color: "#a8a8a8" }} />*/}

                                            {/*</div>*/}
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Delivery From
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                                    {this.state.site && this.state.site.name}
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                                    {this.state.site && this.state.site.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row  justify-content-start search-container pt-2  pb-2">
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Product Linked
                                                </p>
                                            </div>
                                        </div>

                                        {this.state.item && (
                                            <ProductExpandItem
                                                hideMore={true}
                                                hideAddAll={true}
                                                productId={this.state.item.product._id.replace(
                                                    "Product/",
                                                    ""
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <React.Fragment>

                                <div

                                    className={ "custom-bottom-fixed-appbar  custom-bottom-appbar"}>

                                    <Toolbar>
                                        <div
                                            className="row  justify-content-center search-container "
                                            style={{ margin: "auto" }}>
                                            {!this.state.matchExist ? (
                                                <div className="col-auto">
                                                    <button
                                                        onClick={this.showPopUp}
                                                        type="button"
                                                        className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                                        Request A Match
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {this.state.match && (
                                                        <Link
                                                            to={
                                                                "/matched/" +
                                                                this.state.match.match._key
                                                            }
                                                            className={
                                                                "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                            }>
                                                            View Match
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </Toolbar>
                                </div>
                            </React.Fragment>
                            }
                            <Modal
                                className={"loop-popup"}
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                                show={this.state.showPopUp}
                                onHide={this.showPopUp}
                                animation={false}>
                                <ModalBody>
                                    {/*<div className={"row justify-content-center"}>*/}
                                    {/*<div className={"col-4 text-center"}>*/}
                                    {/*<img className={"ring-pop-pup"} src={GrayLoop} alt=""/>*/}
                                    {/*</div>*/}
                                    {/*</div>*/}

                                    {this.state.loopError ? (
                                        <>
                                            <div className={"row justify-content-center"}>
                                                <div className={"col-12 text-center"}>
                                                    <p className={"text-bold "}>Failed</p>
                                                    <p> {this.state.loopError}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={"row justify-content-center"}>
                                                <div className={"col-10 text-center"}>
                                                    <p className={"text-bold"}>Start a match</p>
                                                    <p>

                                                        We’ll let the seller know that your
                                                        interested in this product. Do you want to
                                                        send a message?
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={"row justify-content-center"}>
                                                <div
                                                    className={"col-12"}
                                                    style={{ textAlign: "center" }}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Message"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        name={"text"}
                                                        type={"text"}
                                                    />
                                                </div>
                                                <div
                                                    className={"col-12"}
                                                    style={{ textAlign: "center" }}>
                                                    <div className={"row justify-content-center"}>
                                                        <div
                                                            className={"col-6"}
                                                            style={{ textAlign: "center" }}>
                                                            <p
                                                                onClick={this.requestMatch}
                                                                className={
                                                                    "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                                }>
                                                                Request Match
                                                            </p>
                                                        </div>

                                                        <div
                                                            className={"col-6"}
                                                            style={{ textAlign: "center" }}>
                                                            <p
                                                                onClick={this.showPopUp}
                                                                className={
                                                                    "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                                }>
                                                                Cancel
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </ModalBody>
                            </Modal>
                        </>
                    )}

            </>
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
export default connect(mapStateToProps, mapDispachToProps)(ItemDetailMatch);
