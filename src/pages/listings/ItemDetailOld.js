import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import {Link} from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import {makeStyles} from "@mui/styles";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {Modal, ModalBody} from "react-bootstrap";
import {withStyles} from "@mui/styles/index";
import TextField from "@mui/material/TextField";
import MatchItemSeller from "../../components/MatchItemSeller";
import NotFound from "../../views/NotFound";
import ProductExpandItem from "../../components/Products/ProductExpandItem";
import MoreMenu from "../../components/MoreMenu";
import ListEditForm from "../../components/ListEditForm";
import Layout from "../../components/Layout/Layout";
import OrgComponent from "../../components/Org/OrgComponent";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import InfoTabContent from "../../components/Listings/InfoTabContent";
import {GoogleMap} from "../../components/Map/MapsContainer";
import {fetchErrorMessage} from "../../Util/GlobalFunctions";

class ItemDetail extends Component {
    slug;
    search;
   marteplace
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
        // this.marketplace = props.match.path.includes("marketplace")?"marketplace":"my-listings";
        this.marketplace=props.match.path.includes("marketplace")?"marketplace":"my-listings"
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


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }

    showEdit() {
        this.setState({
            showEdit: !this.state.showEdit,
        });

        this.getResources();
    }

    getPreviewImage(productSelectedKey) {
        axios
            .get(baseUrl + "product/" + productSelectedKey + "/artifact", {
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
                    loopError: fetchErrorMessage(error),
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
            .get(baseUrl + "listing/" + encodeUrl(this.slug)+"/expand", {
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

                    // this.getSite(responseData.data);

                    this.getPreviewImage(responseData.data.product._key);
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

        this.setState({
            activeKey:"0"
        })

        // this.checkMatch();
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
            <Layout>

                    {this.state.notFound ? (
                        <NotFound />
                    ) : (
                        <>
                            {this.state.item && (
                                <>
                                    <div className="container " >

                                        <div className="row  pt-4 pb-4  justify-content-start">
                                            <div className="text-left    col-sm-12 col-xs-12 breadcrumb-row">
                                                <Link to={"/"+this.marketplace}>{this.marketplace=="marketplace"?"All Listings":"My Listings"}</Link><span className={"divider-breadcrumb pl-2 pr-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.state.item.listing.name}</span>
                                            </div>
                                        </div>
                                        <div className="row   justify-content-center  mb-4 pb-4">

                                            <div className="col-md-4 col-sm-12 col-xs-12 ">


                                                <div className="row   stick-left-box ">
                                                    <div className="col-12 text-center ">
                                                        <img
                                                            className={"img-fluid  rad-8 bg-white p-2"}
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

                                            <div className={"col-md-8 col-sm-12 col-xs-12 "}>
                                                <div className="row justify-content-start  ">
                                                    <div className="col-12 ">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <h4
                                                                    className={
                                                                        "text-capitalize product-title width-90"
                                                                    }>
                                                                    {this.state.item.listing.name}
                                                                </h4>
                                                                { this.props.isLoggedIn&&(this.state.item.org._id ===
                                                                    this.props.userDetail.orgId) &&    <div className="top-right text-right">
                                                                    <MoreMenu
                                                                        triggerCallback={(action) =>
                                                                            this.callBackResult(action)
                                                                        }
                                                                        delete={true}
                                                                        edit={true}
                                                                        remove={false}
                                                                        duplicate={false}
                                                                    />

                                                                </div>}
                                                            </div>


                                                        </div>
                                                    </div>

                                                    <div className="col-12 ">
                                                        <div className="row">
                                                            <div className="col-7">
                                                                <div>
                                                                    <OrgComponent
                                                                        org={
                                                                            this.state.item.org
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-5 blue-text text-blue text-bold  text-right">
                                                                {this.state.item.listing.price ? (
                                                                    <>
                                                                        GBP {
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

                                                    <div className={"col-12 "}>

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
                                                    </div>
                                                </div>

                                                <div className={"listing-row-border "}></div>
                                                {this.state.item &&
                                                <div className="row justify-content-start pb-3  tabs-detail">
                                                    <div className="col-12 ">
                                                        <Box sx={{ width: '100%', typography: 'body1' }}>
                                                            <TabContext value={this.state.activeKey}>
                                                                <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                                                    <TabList
                                                                        variant="scrollable"
                                                                        scrollButtons="auto"
                                                                        textColor={"#27245C"}
                                                                        TabIndicatorProps={{
                                                                            style: {
                                                                                backgroundColor: "#27245C",
                                                                                padding: '2px',
                                                                            }
                                                                        }}
                                                                        onChange={this.setActiveKey}

                                                                        aria-label="lab API tabs example">


                                                                        <Tab label="Info" value="0"/>

                                                                        <Tab label="Linked Product" value="1" />

                                                                        <Tab label="Site" value="2" />
                                                                    </TabList>
                                                                </Box>

                                                                <TabPanel value="0">

                                                                    <InfoTabContent item={this.state.item.listing}/>
                                                                </TabPanel>

                                                                {this.state.item.product &&  <TabPanel value="1">

                                                                    <>

                                                                        <div className={"mt-4"}></div>


                                                                        {this.state.item && (
                                                                            <ProductExpandItem
                                                                                hideMoreMenu={true}
                                                                                hideAddAll={true}
                                                                                productId={this.state.item.product._key}
                                                                            />
                                                                        )}
                                                                    </>

                                                                </TabPanel>}


                                                                {this.state.item.site &&
                                                                <TabPanel value="2">
                                                                    <>

                                                                        <p className={"mt-4 mb-4"}>Linked Site:<span className={"text-bold"}> <Link to={"/ps/"+this.state.item.site._key}>{this.state.item.site.name}</Link></span></p>
                                                                        {this.state.item.site.geo_codes && this.state.item.site.geo_codes[0] &&

                                                                        <div className={"bg-white rad-8 p-2"}>
                                                                            <GoogleMap siteId={this.state.item.site._key} width={"100%"}
                                                                                       height={"300px"} locations={[{
                                                                                name: this.state.item.site.name,
                                                                                location: this.state.item.site.geo_codes[0].address_info.geometry.location,
                                                                                isCenter: true
                                                                            }]}/>
                                                                        </div>

                                                                        }

                                                                    </>

                                                                </TabPanel>}


                                                            </TabContext>
                                                        </Box>

                                                    </div>
                                                </div>}




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

                                    {this.state.item.org._id !== this.props.userDetail.orgId && (
                                        <React.Fragment>
                                            <CssBaseline />

                                            <div
                                                position="fixed"
                                                color="#ffffff"
                                                className={
                                                    "custom-bottom-fixed-appbar  custom-bottom-appbar"
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
                                            </div>
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

            </Layout>
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
