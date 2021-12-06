import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {Alert, Modal, ModalBody} from "react-bootstrap";
import {withStyles} from "@mui/styles/index";
import TextField from "@mui/material/TextField";
import MoreMenu from "../MoreMenu";
import AutocompleteCustom from "../AutocompleteCustom";
import Close from "@mui/icons-material/Close";
import QrCode from "./QrCode";
import InfoTabContent from "./InfoTabContent";
import {GoogleMap} from "../Map/MapsContainer";
import SubSitesTab from "./SubSitesTab";
import SubProductsTab from "./SubProductsTab";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


class SiteDetailContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: this.props.item.site,
            showPopUp: false,
            subProducts: [],
            listingLinked: null,
            searches: [],
            productQrCode: null,
            showRegister: false,
            sites: [],
            fieldsSite: {},
            errorsSite: {},
            showSubmitSite: false,
            errorRegister: false,
            errorRelease: false,
            siteSelected: null,
            showProductEdit: false,
            productDuplicate: false,
            showReleaseProduct: false,
            showServiceAgent: false,
            showReleaseSuccess: false,
            showServiceAgentSuccess: false,
            showOrgForm: false,
            orgs: [],
            email: null,
            errorServiceAgent: false,
            emailError: false,
            org_id: null,
            currentReleaseId: null,
            cancelReleaseSuccess: false,
            initialValues:{},
            activeKey:1,
            zoomQrCode:false,
            siteQrCode:null


        };


        this.showProductSelection = this.showProductSelection.bind(this);

    }

    actionSubmit = () => {
        var data = {
            id: this.state.currentReleaseId,
            new_stage: "cancelled",
            // "site_id": this.state.site
        };

        axios
            .post(
                baseUrl + "release/stage",
                data,

                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                // this.getDetails()
                //
                //
                // this.showPopUpInitiateAction()

                // this.showReleaseProduct()

                this.setState({
                    cancelReleaseSuccess: true,
                });
            })
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
            });
    };

    companyDetails = (detail) => {
        if (detail.org) {
            this.setState({
                org_id: detail.org,
            });
        } else {
            axios.get(baseUrl + "org/company/" + detail.company).then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        org_id: responseAll._key,
                    });
                }
            ).catch(error => {});
        }
    };



    showProductSelection(event) {
        this.props.setProduct(this.props.item.site);
        // this.props.setParentProduct(this.state.parentProduct)

        this.props.showProductPopUp({ type: "sub_product_view", show: true });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (!this.props.item.site) {
            this.loadProduct(this.props.productId);
        } else {
            this.setState({
                item: newProps.item,
            });


            this.getSubProducts();

        }
    }

    callBackSubmit(action) {
        if (action === "edit") {
            this.triggerCallback();
        } else if (action === "duplicate") {
            this.props.history.push("/my-products");
        }
    }

    callBackResult(action) {
        if (action === "edit") {

            this.props.setSiteForm({show:true,
                item:this.props.item.site,type:"edit", heading:"Edit Site"});

        } else if (action === "delete") {
            this.deleteItem();
        } else if (action === "duplicate") {
            this.submitDuplicateProduct();
        } else if (action === "release") {
            this.showReleaseProduct();
        } else if (action === "serviceAgent") {
            this.showServiceAgent();
        }
    }


    triggerCallback() {
        this.showProductEdit();
        // this.props.triggerCallback();
    }

    deleteItem() {
        axios.delete(baseUrl + "listing/" + this.state.item.listing._key).then(
            (response) => {
                // var responseAll = response.data.data;
                // this.props.history.push("/my-products")
                // this.props.loadProducts()
            },
            (error) => {}
        );
    }

    showProductEdit() {
        this.setState({
            showProductEdit: !this.state.showProductEdit,
            productDuplicate: false,
        });
    }

    showProductDuplicate() {
        this.setState({
            showProductEdit: !this.state.showProductEdit,
            productDuplicate: true,
        });
    }

    showSubmitSite() {
        this.setState({
            errorRegister: null,
        });

        this.setState({
            showSubmitSite: !this.state.showSubmitSite,
        });
    }




    submitReleaseProduct = (event) => {
        this.setState({
            errorRegister: null,
        });

        event.preventDefault();

        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        const site = data.get("org");

        axios
            .post(
                baseUrl + "release",

                {
                    org_id: site,
                    // product_id: this.props.item.site.product._key,
                }
            )
            .then((res) => {
                this.setState({
                    currentReleaseId: res.data.data._key,
                    showReleaseSuccess: true,
                });
            })
            .catch((error) => {
                this.setState({
                    errorRelease: error.response.data.errors[0].message,
                });
            });
    };

    submitServiceAgentProduct = (event) => {
        this.setState({
            errorServiceAgent: null,
        });

        event.preventDefault();

        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        const site = data.get("org");

        axios
            .post(
                baseUrl + "service-agent",

                {
                    org_id: site,
                    // product_id: this.props.item.site.product._key,
                }
            )
            .then((res) => {
                this.setState({
                    showServiceAgentSuccess: true,
                });
            })
            .catch((error) => {
                this.setState({
                    errorServiceAgent: error.response.data.errors[0].message,
                });
            });
    };

    getSites() {
        axios.get(baseUrl + "site").then(
            (response) => {
                var responseAll = response.data.data;

                this.setState({
                    sites: responseAll,
                });
            },
            (error) => {}
        );
    }


    showRegister() {
        this.setState({
            showRegister: !this.state.showRegister,
        });
    }





    getListing() {
        // var siteKey = (this.props.item.site.site_id).replace("Site/","")

        axios.get(baseUrl + "listing/" + this.state.item.listing.replace("Listing/", "")).then(
            (response) => {
                var responseData = response.data.data;

                this.setState({
                    listingLinked: responseData,
                });
            },
            (error) => {
                // var status = error.response.status
            }
        );
    }

    getSearches() {
        var searches = this.state.item.searches;

        for (var i = 0; i < searches.length; i++) {
            axios.get(baseUrl + "search/" + searches[i].replace("Search/", "")).then(
                (response) => {
                    var responseData = response.data.data;

                    var searches = this.state.searches;

                    searches.push(responseData);

                    this.setState({
                        searches: searches,
                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
        }
    }

    getSubProducts() {
        if (
            this.state.item.sub_products &&
            this.state.item.sub_products.length > 0 &&
            this.props.isLoggedIn
        ) {
            var subProductIds = this.state.item.sub_products;

            for (var i = 0; i < subProductIds.length; i++) {
                axios.get(baseUrl + "product/" + subProductIds[i]._key).then(
                    (response) => {
                        var responseAll = response.data;

                        var subProducts = this.state.subProducts;

                        subProducts.push(responseAll.data);

                        this.setState({
                            subProducts: subProducts,
                        });
                    },
                    (error) => {}
                );
            }
        } else {
            this.setState({
                subProducts: [],
            });
        }
    }

    getMatches() {
        axios.get(baseUrl + "match/listing/" + encodeUrl(this.slug)).then(
            (response) => {
                var response = response.data;

                this.setState({
                    matches: response.data,
                });
            },
            (error) => {}
        );
    }



    setActiveKey=(event,key)=>{

        console.log(event, key)
        this.setState({
            activeKey:key
        })


    }

    componentDidMount() {

          this.setActiveKey(null,"1")

            this.setState({
                item: this.props.item.site,
            });


        this.getQrCode()

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //
        // if (prevProps!==this.props) {
        //     this.setActiveKey("1")
        // }
    }



    callZoom=()=>{

        this.setState({
            zoomQrCode:!this.state.zoomQrCode


        })
    }


    getQrCode=()=> {


        if(!this.props.item.site._key) return;

        axios.get(`${baseUrl}site/${this.props.item.site._key}/code-artifact`)

            .then(response => {
                this.setState({siteQrCode: response.data.data})
            })
            .catch(error => {

            })


    }


    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                {this.state.item ? (
                    <>

                        {this.state.zoomQrCode&&
                        <div onClick={this.callZoom} className="qr-code-zoom row zoom-out-cursor">
                            <img className="img-fluid qr-code-zoom"

                                 src={this.state.siteQrCode.blob_url}
                                />
                        </div>}


                        <div className="row  pt-4 pb-4  justify-content-center">
                            <div className="text-left    col-sm-12 col-xs-12 breadcrumb-row">
                                <Link to={"/sites"}>My Sites</Link><span className={"divider-breadcrumb pl-2 pr-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.props.item&&this.props.item.site.name}</span>

                            </div>
                        </div>
                        <div className="row   justify-content-center">
                            <div className="col-md-4 col-sm-12 col-xs-12 ">
                                <div className=" stick-left-box  ">

                                    {this.props.item.site.geo_codes && this.props.item.site.geo_codes[0] &&

                                    <div className={"p-2 gray-border rad-8 bg-white"}>
                                    <GoogleMap width={"100%"} height={"300px"} locations={[{
                                        name: this.props.item.site.name,
                                        location: this.props.item.site.geo_codes[0].address_info.geometry.location,
                                        isCenter: true
                                    }]}/>
                                    </div>
                                    }

                                    {this.state.siteQrCode && <QrCode item={this.props.item.site} callZoom={this.callZoom}
                                            hideRegister={this.props.hideRegister}
                                            siteQrCode={this.state.siteQrCode}  />}

                                </div>

                            </div>

                            <div className={"col-md-8 col-sm-12 col-xs-12 p-0 "}>

                                <div className="row  justify-content-start   ">
                                    <div className="col-12 ">
                                        <div className="row">
                                            <div className="col-8">
                                                <h4 className="text-capitalize product-title">
                                                    {this.props.item.site.name}
                                                </h4>
                                            </div>

                                            <div className="col-4 text-right">
                                                {/*{ (this.state.item.org._id ===*/}
                                                {/*this.props.userDetail.orgId) &&*/}

                                                <MoreMenu
                                                    triggerCallback={(action) =>
                                                        this.callBackResult(action)
                                                    }
                                                    // serviceAgent={
                                                    //     this.state.item.service_agent._id ===
                                                    //     this.props.userDetail.orgId
                                                    //         ? true
                                                    //         : false
                                                    // }
                                                    // release={
                                                    //     this.state.item.org._id ===
                                                    //     this.props.userDetail.orgId
                                                    //         ? true
                                                    //         : false
                                                    // }
                                                    // duplicate={
                                                    //     this.state.item.org._id ===
                                                    //     this.props.userDetail.orgId
                                                    //         ? true
                                                    //         : false
                                                    // }
                                                    edit={
                                                        true

                                                    }
                                                />
                                                {/*}*/}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="row justify-content-start pb-3 ">
                                    <div className="col-auto">
                                        <p

                                            className={"text-gray-light  "}>
                                            {this.props.item.site.description}
                                        </p>
                                    </div>
                                </div>

                                <div className={"listing-row-border "}></div>


                                <div className="row justify-content-start pb-3  tabs-detail">
                                    <div className="col-12 mt-2">
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
                                                        onChange={this.setActiveKey} >

                                                        <Tab label="Info" value="1"/>

                                                        <Tab label="Sub Site" value="2" />

                                                        {this.props.isLoggedIn  &&
                                                        <Tab label="Sub Products" value="3" />
                                                        }

                                                    </TabList>
                                                </Box>


                                                <TabPanel value="1">

                                                <InfoTabContent item={this.props.item.site} />

                                                </TabPanel>
                                                <TabPanel value="2">

                                                <SubSitesTab  item={this.props.item} />

                                                </TabPanel>

                                                {this.props.isLoggedIn  &&
                                                <TabPanel value="3">
                                                <SubProductsTab item={this.props.item.site} />
                                                </TabPanel>}


                                            </TabContext>
                                        </Box>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <Modal
                            size="lg"
                            show={this.state.showProductEdit}
                            onHide={this.showProductEdit}
                            className={"custom-modal-popup popup-form"}>
                            <div className="">
                                <button
                                    onClick={this.showProductEdit}
                                    className="btn-close close"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>


                            <div className="row py-3 justify-content-center mobile-menu-row pt-3 p-2">
                                <div className="col mobile-menu">
                                    <div className="form-col-left col-12">
                            {/*<ProductForm triggerCallback={(action) => this.callBackSubmit(action)} heading={"Edit Product"} item={this.state.item} />*/}
                                    </div>
                                </div>
                            </div>

                        </Modal>

                        <Modal
                            className={"loop-popup"}
                            aria-labelledby="contained-modal-title-vcenter"
                            show={this.state.showReleaseProduct}
                            centered
                            onHide={this.showReleaseProduct}
                            animation={false}>
                            <ModalBody>
                                <div className=" text-right web-only">
                                    <Close
                                        onClick={this.showReleaseProduct}
                                        className="blue-text click-item"
                                        style={{ fontSize: 32 }}
                                    />
                                </div>

                                <div className={"row justify-content-center"}>
                                    <div className={"col-10 text-center"}>
                                        <p
                                            style={{ textTransform: "Capitalize" }}
                                            className={"text-bold text-blue"}>
                                            {/*Release Product: {this.state.item.product.name}*/}
                                        </p>
                                    </div>
                                </div>

                                {!this.state.showReleaseSuccess ? (
                                    <>
                                    <div style={{position:"relative"}} className="text_fild mb-3">
                                        <AutocompleteCustom
                                            orgs={true}
                                            companies={true}
                                            suggestions={this.state.orgNames}
                                            selectedCompany={(action) =>
                                                this.companyDetails(action)
                                            }
                                        />
                                    </div>

                                        <form onSubmit={this.submitReleaseProduct}>
                                            <div className={"row justify-content-center p-2"}>
                                                <div className={"col-12 text-center mt-2"}>
                                                    <div className={"row justify-content-center"}>
                                                        <div className={"col-12 text-center mb-4"}>
                                                            <input
                                                                className={"d-none"}
                                                                value={this.state.org_id}
                                                                name={"org"}
                                                            />

                                                            <p>
                                                                Is the company you are looking for
                                                                doesn't exist?
                                                                <span
                                                                    className={"green-link-url "}
                                                                    onClick={this.showOrgForm}>
                                                                    {this.state.showOrgForm
                                                                        ? "Hide "
                                                                        : "Add Company"}
                                                                </span>
                                                            </p>
                                                        </div>

                                                        {this.state.errorRelease && (
                                                            <div
                                                                className={
                                                                    "row justify-content-center"
                                                                }>
                                                                <div
                                                                    className={"col-12"}
                                                                    style={{ textAlign: "center" }}>
                                                                    <Alert
                                                                        key={"alert"}
                                                                        variant={"danger"}>
                                                                        {this.state.errorRelease}
                                                                    </Alert>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {!this.state.showOrgForm && (
                                                            <div
                                                                className={
                                                                    "col-12 justify-content-center "
                                                                }>
                                                                <div
                                                                    className={
                                                                        "row justify-content-center"
                                                                    }>
                                                                    <div
                                                                        className={"col-6"}
                                                                        style={{
                                                                            textAlign: "center",
                                                                        }}>
                                                                        <button
                                                                            style={{
                                                                                minWidth: "120px",
                                                                            }}
                                                                            className={
                                                                                "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                                            }
                                                                            type={"submit"}>
                                                                            Yes
                                                                        </button>
                                                                    </div>
                                                                    <div
                                                                        className={"col-6"}
                                                                        style={{
                                                                            textAlign: "center",
                                                                        }}>
                                                                        <p
                                                                            onClick={
                                                                                this
                                                                                    .showReleaseProduct
                                                                            }
                                                                            className={
                                                                                "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                                            }>
                                                                            Cancel
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                        {this.state.showOrgForm && (
                                            <>
                                                <div className={"row m-2 container-gray"}>
                                                    <div className={"col-12 text-left mt-2 "}>
                                                        <p className={"text-bold text-blue"}>
                                                            Add Company's Email
                                                        </p>
                                                    </div>
                                                    <div className={"col-12 text-center "}>
                                                        <>
                                                            <div
                                                                className={
                                                                    "row justify-content-center"
                                                                }>
                                                                <div
                                                                    className={
                                                                        "col-12 text-center mb-2"
                                                                    }>
                                                                    <TextField
                                                                        id="outlined-basic"
                                                                        onChange={this.handleChangeEmail.bind(
                                                                            this,
                                                                            "email"
                                                                        )}
                                                                        variant="outlined"
                                                                        fullWidth={true}
                                                                        name={"email"}
                                                                        type={"email"}
                                                                        value={this.state.email}
                                                                    />
                                                                </div>

                                                                {this.state.emailError && (
                                                                    <Alert
                                                                        key={"alert"}
                                                                        variant={"danger"}>
                                                                        Invalid Email Address!
                                                                    </Alert>
                                                                )}

                                                                <div
                                                                    className={
                                                                        "col-12 text-center mb-2"
                                                                    }>
                                                                    <button
                                                                        onClick={
                                                                            this.handleSubmitOrg
                                                                        }
                                                                        className={
                                                                            "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                                        }>
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {!this.state.cancelReleaseSuccess && (
                                            <div className={"row justify-content-center"}>
                                                <div className={"col-10 text-center"}>
                                                    <Alert key={"alert"} variant={"success"}>
                                                        Your release request has been submitted
                                                        successfully. Thanks
                                                    </Alert>
                                                </div>
                                            </div>
                                        )}

                                        {this.state.cancelReleaseSuccess && (
                                            <div className={"row justify-content-center"}>
                                                <div className={"col-10 text-center"}>
                                                    <Alert key={"alert"} variant={"success"}>
                                                        Your release request has been cancelled
                                                        successfully. Thanks
                                                    </Alert>
                                                </div>
                                            </div>
                                        )}

                                        <div className={"row justify-content-center"}>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <button
                                                    style={{ minWidth: "120px" }}
                                                    className={
                                                        "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                    }>
                                                    <Link to={"/approve"}>Check Approval</Link>
                                                </button>
                                            </div>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <p
                                                    onClick={this.actionSubmit}
                                                    className={
                                                        "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                    }>
                                                    Cancel Release
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </ModalBody>
                        </Modal>
                        <Modal
                            className={"loop-popup"}
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            show={this.state.showServiceAgent}
                            onHide={this.showServiceAgent}
                            animation={false}>
                            <ModalBody>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-10 text-center"}>
                                        <p
                                            style={{ textTransform: "Capitalize" }}
                                            className={"text-bold text-blue "}>
                                            {/*Change Service Agent For: {this.state.item.product.name}*/}
                                        </p>
                                    </div>
                                </div>

                                {!this.state.showServiceAgentSuccess ? (
                                    <>
                                        <AutocompleteCustom
                                            orgs={true}
                                            companies={true}
                                            suggestions={this.state.orgNames}
                                            selectedCompany={(action) =>
                                                this.companyDetails(action)
                                            }
                                        />
                                        <form onSubmit={this.submitServiceAgentProduct}>
                                            <div className={"row justify-content-center p-2 mt-4"}>
                                                <div className={"col-12 text-center mt-2"}>
                                                    <div className={"row justify-content-center"}>
                                                        <div className={"col-12 text-center mb-4"}>
                                                            <input
                                                                className={"d-none"}
                                                                value={this.state.org_id}
                                                                name={"org"}
                                                            />

                                                            <p>
                                                                Is the company you are looking for
                                                                doesn't exist?
                                                                <span
                                                                    className={"green-link-url "}
                                                                    onClick={this.showOrgForm}>
                                                                    {this.state.showOrgForm
                                                                        ? "Hide "
                                                                        : "Add Company"}
                                                                </span>
                                                            </p>

                                                            {this.state.showOrgForm && (
                                                                <>
                                                                    <div
                                                                        className={
                                                                            "row m-2 container-gray"
                                                                        }>
                                                                        <div
                                                                            className={
                                                                                "col-12 text-left mt-2 "
                                                                            }>
                                                                            <p
                                                                                className={
                                                                                    "text-bold text-blue"
                                                                                }>
                                                                                Add Company's Email
                                                                            </p>
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                "col-12 text-center "
                                                                            }>
                                                                            <>
                                                                                <div
                                                                                    className={
                                                                                        "row justify-content-center"
                                                                                    }>
                                                                                    <div
                                                                                        className={
                                                                                            "col-12 text-center mb-2"
                                                                                        }>
                                                                                        <TextField
                                                                                            id="outlined-basic"
                                                                                            onChange={this.handleChangeEmail.bind(
                                                                                                this,
                                                                                                "email"
                                                                                            )}
                                                                                            variant="outlined"
                                                                                            fullWidth={
                                                                                                true
                                                                                            }
                                                                                            name={
                                                                                                "email"
                                                                                            }
                                                                                            type={
                                                                                                "text"
                                                                                            }
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .email
                                                                                            }
                                                                                        />
                                                                                    </div>

                                                                                    <div
                                                                                        className={
                                                                                            "col-12 text-center mb-2"
                                                                                        }>
                                                                                        <button
                                                                                            onClick={
                                                                                                this
                                                                                                    .handleSubmitOrg
                                                                                            }
                                                                                            className={
                                                                                                "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                                                            }>
                                                                                            Submit
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {this.state.errorRelease && (
                                                            <div
                                                                className={
                                                                    "row justify-content-center"
                                                                }>
                                                                <div
                                                                    className={"col-12"}
                                                                    style={{ textAlign: "center" }}>
                                                                    <Alert
                                                                        key={"alert"}
                                                                        variant={"danger"}>
                                                                        {this.state.errorRelease}
                                                                    </Alert>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div
                                                            className={
                                                                "col-12 justify-content-center "
                                                            }>
                                                            <div
                                                                className={
                                                                    "row justify-content-center"
                                                                }>
                                                                <div
                                                                    className={"col-6"}
                                                                    style={{ textAlign: "center" }}>
                                                                    <button
                                                                        style={{
                                                                            minWidth: "120px",
                                                                        }}
                                                                        className={
                                                                            "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                                        }
                                                                        type={"submit"}>
                                                                        Yes
                                                                    </button>
                                                                </div>
                                                                <div
                                                                    className={"col-6"}
                                                                    style={{ textAlign: "center" }}>
                                                                    <p
                                                                        onClick={
                                                                            this.showServiceAgent
                                                                        }
                                                                        className={
                                                                            "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                                        }>
                                                                        Cancel
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-10 text-center"}>
                                            <Alert key={"alert"} variant={"success"}>
                                                Your change service agent request has been submitted
                                                successfully. Thanks
                                            </Alert>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                        </Modal>


                    </>
                ) : (
                    <div className={"loading-screen"}> Loading .... </div>
                )}
            </>
        );
    }
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
        showSubProductView: state.showSubProductView,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SiteDetailContent);
