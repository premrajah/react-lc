import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import { Link } from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import encodeUrl from "encodeurl";
import { Modal, ModalBody } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import MatchItemSeller from "../../components/MatchItemSeller";
import NotFound from "../NotFound/index";
import ProductExpandItem from "../../components/ProductExpandItem";
import Org from "../../components/Org/Org";
import MoreMenu from "../../components/MoreMenu";
import ListEditForm from "../../components/ListEditForm";

class ItemDetail extends Component {
    slug;
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
            notFound: false,
            site: null,
            previewImage: null,
            showEdit: false,
        };

        this.slug = props.match.params.slug;
        this.search = props.match.params.search;

        this.getResources = this.getResources.bind(this);
        this.getSite = this.getSite.bind(this);
        this.acceptMatch = this.acceptMatch.bind(this);
        this.showPopUp = this.showPopUp.bind(this);

        this.getMatches = this.getMatches.bind(this);
        this.checkMatch = this.checkMatch.bind(this);

        this.getPreviewImage = this.getPreviewImage.bind(this);

        this.callBackResult = this.callBackResult.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    deleteItem() {
        axios
            .delete(baseUrl + "listing/" + this.props.item.listing._key, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    // var responseAll = response.data.data;

                    this.props.history.push("/my-listings");
                    // this.props.loadProducts()
                },
                (error) => {}
            );
    }

    callBackResult(action) {
        if (action === "edit") {
            this.showEdit();
        } else if (action === "delete") {
            this.deleteItem();
        }
    }

    showEdit() {
        this.setState({
            showEdit: !this.state.showEdit,
        });

        this.getResources();
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

    acceptMatch() {
        axios
            .post(
                baseUrl + "match",
                {
                    listing_id: this.slug,
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
                    showPopUp: true,
                });

                // this.getResources()
            })
            .catch((error) => {
                //

                this.setState({
                    showPopUp: true,
                    loopError: error.response.data.data.message,
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
            .get(baseUrl + "listing/" + encodeUrl(this.slug), {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data;

                    this.setState({
                        item: responseData.data,
                    });

                    this.getSite(responseData.data);

                    this.getPreviewImage(responseData.data.product_id);
                },
                (error) => {
                    this.setState({
                        notFound: true,
                    });
                }
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
                    var response = response.data;

                    this.setState({
                        site: response.data,
                    });
                },
                (error) => {
                    this.setState({
                        notFound: true,
                    });
                }
            );
    }

    getMatches() {
        axios
            .get(baseUrl + "match/listing/" + encodeUrl(this.slug), {
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
            .get(
                baseUrl +
                    "match/search-and-listing/" +
                    "search-1609094173795-pzXfwMEzBp/" +
                    encodeUrl(this.slug),
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
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
        window.scrollTo(0, 0);

        this.checkMatch();
        this.getResources();

        this.getMatches();

        this.interval = setInterval(() => {
            this.getMatches();
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

                    {this.state.notFound ? (
                        <NotFound />
                    ) : (
                        <>
                            {this.state.item && (
                                <>
                                    <div className="container " style={{ padding: "0" }}>
                                        <div className="row no-gutters  justify-content-center  mb-4 pb-4">
                                            {/*<div className="floating-back-icon" style={{ margin: "auto" }}>*/}

                                            {/*<NavigateBefore onClick={this.handleBack} style={{ fontSize: 32, color: "white" }} />*/}
                                            {/*</div>*/}

                                            <div className="col-md-4 col-sm-12 col-xs-12 ">
                                                {/*stick-left-box*/}
                                                {/*{this.state.item.images.length > 0 ?*/}
                                                {/*<ImagesSlider images={this.state.item.images} /> :*/}
                                                {/*<img className={"img-fluid"} src={PlaceholderImg} alt="" />}*/}

                                                <div className="row   stick-left-box ">
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

                                            <div className={"col-md-8 col-sm-12 col-xs-12 pl-4"}>
                                                <div className="row justify-content-start pb-3 pt-3 ">
                                                    <div className="col-12 mt-2">
                                                        <div className="row">
                                                            <div className="col-8">
                                                                <h5
                                                                    className={
                                                                        "blue-text text-heading"
                                                                    }>
                                                                    {this.state.item.listing.name}
                                                                </h5>
                                                            </div>

                                                            <div className="col-4 text-right">
                                                                <MoreMenu
                                                                    triggerCallback={(action) =>
                                                                        this.callBackResult(action)
                                                                    }
                                                                    delete={true}
                                                                    edit={true}
                                                                    remove={false}
                                                                    duplicate={false}
                                                                />

                                                                {/*<EditIcon className={"mr-2"} onClick={this.showEdit}  />*/}

                                                                {/*<DeleteIcon className={""}   />*/}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 ">
                                                        <div className="row">
                                                            <div className="col-7">
                                                                <p>
                                                                    <Org
                                                                        orgId={
                                                                            this.state.item.org_id
                                                                        }
                                                                    />
                                                                </p>
                                                            </div>

                                                            <div className="col-5 green-text text-heading text-right">
                                                                {this.state.item.listing.price ? (
                                                                    <>
                                                                        GBP
                                                                        {
                                                                            this.state.item.listing
                                                                                .price.value
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    "Free"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={"col-12 pt-3"}>
                                                        <div className={"listing-row-border"}></div>

                                                        <div className="row justify-content-start pb-3 pt-3 ">
                                                            <div className="col-auto">
                                                                <p
                                                                    style={{ fontSize: "16px" }}
                                                                    className={"text-gray-light  "}>
                                                                    {
                                                                        this.state.item.listing
                                                                            .description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={"listing-row-border"}></div>
                                                    </div>
                                                </div>

                                                <div className="row  justify-content-start search-container  pb-4">
                                                    <div className={"col-auto"}>
                                                        <p
                                                            style={{ fontSize: "18px" }}
                                                            className="text-mute text-bold text-blue mb-1">
                                                            Category
                                                        </p>
                                                        <p
                                                            style={{ fontSize: "18px" }}
                                                            className="  mb-1">
                                                            {this.state.item.listing.category},
                                                            {this.state.item.listing.type},
                                                            {this.state.item.listing.state}
                                                        </p>
                                                        {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.listing.type}></p>*/}
                                                        {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.listing.state}</p>*/}
                                                    </div>
                                                </div>

                                                {/*<div className="row  justify-content-start search-container  pb-4">*/}

                                                {/*<div className={"col-auto"}>*/}

                                                {/*<p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Manufacturer</p>*/}
                                                {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.org_id.substr(4)} </p>*/}
                                                {/*</div>*/}
                                                {/*</div>*/}

                                                <div className="row  justify-content-start search-container  pb-4">
                                                    <div className={"col-auto"}>
                                                        <p
                                                            style={{ fontSize: "18px" }}
                                                            className="text-mute text-bold text-blue mb-1">
                                                            Available From
                                                        </p>
                                                        <p
                                                            style={{ fontSize: "18px" }}
                                                            className="  mb-1">
                                                            {moment(
                                                                this.state.item &&
                                                                    this.state.item.listing
                                                                        .available_from_epoch_ms
                                                            ).format("DD MMM YYYY")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="row  justify-content-start search-container  mt-2 mb-2 ">
                                                    <div className={"col-auto"}>
                                                        <p
                                                            style={{ fontSize: "18px" }}
                                                            className="text-mute text-bold text-blue mb-1">
                                                            Available Until
                                                        </p>
                                                        <p
                                                            style={{ fontSize: "18px" }}
                                                            className="  mb-1">

                                                            {this.state.item &&
                                                                moment(
                                                                    this.state.item.listing
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
                                                        <p
                                                            style={{ fontSize: "18px" }}
                                                            className="  mb-1">
                                                            {this.state.site &&
                                                                this.state.site.name}
                                                        </p>
                                                        <p
                                                            style={{ fontSize: "18px" }}
                                                            className="  mb-1">
                                                            {this.state.site &&
                                                                this.state.site.address}
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
                                                        productId={this.state.item.product_id.replace(
                                                            "Product/",
                                                            ""
                                                        )}
                                                    />
                                                )}

                                                {this.state.matches &&
                                                    this.state.matches.length > 0 && (
                                                        <>
                                                            <div className="row no-gutters  ">
                                                                <div className="col-12  ">
                                                                    <h5 className="mb-1 text-blue text-bold">
                                                                        Matches Received
                                                                    </h5>
                                                                </div>
                                                            </div>

                                                            {this.state.matches.map(
                                                                (item, index) => (
                                                                    <>
                                                                        <MatchItemSeller
                                                                            index={index}
                                                                            item={item}
                                                                        />
                                                                    </>
                                                                )
                                                            )}
                                                        </>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <Modal
                                        size="lg"
                                        show={this.state.showEdit}
                                        onHide={this.showEdit}
                                        className={"custom-modal-popup popup-form"}>
                                        <div className="">
                                            <button
                                                onClick={this.showEdit}
                                                className="btn-close close"
                                                data-dismiss="modal"
                                                aria-label="Close">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>

                                        <ListEditForm
                                            triggerCallback={this.showEdit}
                                            listingId={this.state.item.listing._key}
                                        />
                                    </Modal>

                                    {this.state.item.org_id != this.props.userDetail.orgId && (
                                        <React.Fragment>
                                            <CssBaseline />

                                            <AppBar
                                                position="fixed"
                                                color="#ffffff"
                                                className={
                                                    classesBottom.appBar + "  custom-bottom-appbar"
                                                }>
                                                <Toolbar>
                                                    <div
                                                        className="row  justify-content-center search-container "
                                                        style={{ margin: "auto" }}>
                                                        <div className="col-auto">
                                                            <button
                                                                onClick={this.acceptMatch}
                                                                type="button"
                                                                className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                                                Request A Match
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Toolbar>
                                            </AppBar>
                                        </React.Fragment>
                                    )}

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
                                                            <p className={"text-bold"}>
                                                                Start a match
                                                            </p>
                                                            <p>

                                                                We’ll let the seller know that your
                                                                interested in this product. Do you
                                                                want to send a message?
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={"row justify-content-center"}>
                                                        <div
                                                            className={"col-12"}
                                                            style={{ textAlign: "center" }}>
                                                            <div className={"col-12"}>
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    label="Message"
                                                                    variant="outlined"
                                                                    fullWidth={true}
                                                                    name={"text"}
                                                                    type={"text"}
                                                                />
                                                            </div>

                                                            {/*<p style={{minWidth:"120px"}} className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"}>*/}
                                                            {/*/!*<Link onClick={this.showPopUp} to={"/message-seller/" + this.slug}>Chat</Link></p>*!/*/}

                                                            {/*<Link onClick={this.showPopUp} to={"/message-seller/" + this.slug}>Check </Link></p>*/}
                                                        </div>
                                                        <div
                                                            className={"col-12"}
                                                            style={{ textAlign: "center" }}>
                                                            <p
                                                                onClick={this.showPopUp}
                                                                className={
                                                                    "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                                }>
                                                                Ok
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </ModalBody>
                                    </Modal>
                                </>
                            )}
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
export default connect(mapStateToProps, mapDispachToProps)(ItemDetail);
