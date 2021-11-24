import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@mui/styles";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import encodeUrl from "encodeurl";
import { withStyles } from "@mui/styles/index";
import MatchItemBuyer from "../../components/MatchItemBuyer";
import ProductExpandItem from "../../components/ProductExpandItem";

class ItemDetailMatch extends Component {
    match;

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
            previewImage: null,
        };

        this.getPreviewImage = this.getPreviewImage.bind(this);

        this.match = props.match.params.match;

        this.getResources = this.getResources.bind(this);
        this.requestMatch = this.requestMatch.bind(this);
        this.showPopUp = this.showPopUp.bind(this);
        this.getMatches = this.getMatches.bind(this);
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
            .get(baseUrl + "match/" + encodeUrl(this.match), {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data.data;

                    this.setState({
                        item: responseData,
                        site: responseData.listing.site,
                    });

                    if (responseData) this.getPreviewImage(responseData.listing.product._id);
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

    componentDidMount() {
        this.getResources();

        this.interval = setInterval(() => {
            this.getResources();
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <div>
                <Sidebar />
                <div className="accountpage">
                    <HeaderDark />

                    {this.state.item && (
                        <>
                            <div className="container " style={{ padding: "0" }}>
                                <div className="row no-gutters  justify-content-center">
                                    <div className="col-md-4 col-sm-12 col-xs-12 ">
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
                                            <div className="col-12 text-center ">
                                                <MatchItemBuyer
                                                    showImage={false}
                                                    showInfo={false}
                                                    item={this.state.item}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"col-md-8 col-sm-12 col-xs-12 pl-4"}>
                                        <div className="row justify-content-start pb-3 pt-4 listing-row-border">
                                            <div className="col-12 mt-2">
                                                <h4 className={"blue-text text-heading"}>
                                                    {this.state.item.listing.listing.name}
                                                </h4>
                                            </div>

                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-7">
                                                        <p>
                                                            <span className={"green-text"}>
                                                                {this.state.item.listing.org.name}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <div className="col-3 green-text text-heading text-right">
                                                        {this.state.item.listing.listing.price ? (
                                                            <>
                                                                GBP {
                                                                    this.state.item.listing.listing
                                                                        .price.value
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
                                                    {this.state.item.listing.listing.description}
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
                                                    {this.state.item.listing.listing.category},
                                                    {this.state.item.listing.listing.type},
                                                    {this.state.item.listing.listing.state}
                                                </p>
                                            </div>
                                        </div>



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
                                                            this.state.item.listing.listing
                                                                .available_from_epoch_ms
                                                    ).format("DD MMM YYYY")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row  justify-content-start search-container   pb-2 ">
                                            <div className={"col-auto"}>
                                                <p
                                                    style={{ fontSize: "18px" }}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Available Until
                                                </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">

                                                    {this.state.item &&
                                                        moment(
                                                            this.state.item.listing.listing
                                                                .expire_after_epoch_ms
                                                        ).format("DD MMM YYYY")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row  justify-content-start search-container pt-2  pb-2">
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
                                                productId={this.state.item.listing.product._id.replace(
                                                    "Product/",
                                                    ""
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            }
                        </>
                    )}
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

function BottomAppBar(props) {
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
                            <Link
                                to={"/message-seller/" + props.slug}
                                type="button"
                                className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                Message Seller
                            </Link>
                        </div>
                        <div className="col-auto">
                            <Link
                                to={"/make-offer/" + props.slug}
                                type="button"
                                className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                Make Offer
                            </Link>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
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
export default connect(mapStateToProps, mapDispachToProps)(ItemDetailMatch);
