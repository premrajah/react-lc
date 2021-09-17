import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {Alert, Modal, ModalBody, Tab, Tabs} from "react-bootstrap";
import {withStyles} from "@material-ui/core/styles/index";

import SearchItem from "../../views/loop-cycle/search-item";
import ResourceItem from "../../views/create-search/ResourceItem";
import TextField from "@material-ui/core/TextField";
import MoreMenu from "../MoreMenu";
import AutocompleteCustom from "../AutocompleteCustom";
import Close from "@material-ui/icons/Close";
import ImageHeader from "../UIComponents/ImageHeader";
import QrCode from "./QrCode";
import InfoTabContent from "./InfoTabContent";
import SubProductsTab from "./SubProductsTab";
import ArtifactProductsTab from "./ArtifactProductsTab";
import ProductForm from "../ProductPopUp/ProductForm";
import {GoogleMap} from "../Map/MapsContainer";
import OrgFull from "../Org/OrgFull";

class ProductDetailContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: this.props.item,
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
            initialValues:{}

        };

        this.getSubProducts = this.getSubProducts.bind(this);
        this.getMatches = this.getMatches.bind(this);
        this.getSearches = this.getSearches.bind(this);
        this.getListing = this.getListing.bind(this);
        this.showRegister = this.showRegister.bind(this);
        this.getSites = this.getSites.bind(this);
        this.showSubmitSite = this.showSubmitSite.bind(this);
        this.showProductEdit = this.showProductEdit.bind(this);
        this.showProductDuplicate = this.showProductDuplicate.bind(this);

        this.callBackResult = this.callBackResult.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
        this.showReleaseProduct = this.showReleaseProduct.bind(this);
        this.showServiceAgent = this.showServiceAgent.bind(this);
        this.showOrgForm = this.showOrgForm.bind(this);
        this.handleSubmitOrg = this.handleSubmitOrg.bind(this);
        this.getOrgs = this.getOrgs.bind(this);
        this.loadInfo = this.loadInfo.bind(this);
        this.loadProduct = this.loadProduct.bind(this);

        this.phonenumber = this.phonenumber.bind(this);
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

    phonenumber(inputtxt) {
        var phoneNoWithCode = /^[+#*\\(\\)\\[\\]]*([0-9][ ext+-pw#*\\(\\)\\[\\]]*){6,45}$/;

        var phoneWithZero = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;

        if (inputtxt.match(phoneNoWithCode)) {
            return true;
        } else if (inputtxt.match(phoneWithZero)) {
            return true;
        } else {
            return false;
        }
    }

    handleChangeEmail(field, e) {
        var email = e.target.value;

        var error = false;

        if (!email) {
            error = true;
        }

        if (typeof email !== "undefined") {
            let lastAtPos = email.lastIndexOf("@");
            let lastDotPos = email.lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    email.indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    email.length - lastDotPos > 2
                )
            ) {
                error = true;
            }
        }

        this.setState({
            email: e.target.value,
            emailError: error,
        });
    }

    getOrgs() {
        axios.get(baseUrl + "org/all").then(
            (response) => {
                var response = response.data;

                this.setState({
                    orgs: response.data,
                });
            },
            (error) => {}
        );
    }

    handleSubmitOrg() {
        var email = this.state.email;


        if (!this.state.emailError)
            axios
                .post(baseUrl + "org/email", {
                    email: email,
                })
                .then((res) => {
                    this.showOrgForm();
                    this.getOrgs();
                })
                .catch((error) => {});
    }

    showOrgForm() {
        this.setState({
            showOrgForm: !this.state.showOrgForm,
        });
    }

    showReleaseProduct() {
        this.setState({
            errorRelease: false,
        });

        this.getSites();
        this.setState({
            showReleaseProduct: !this.state.showReleaseProduct,
        });
    }

    showServiceAgent() {
        this.setState({
            errorServiceAgent: false,
        });

        this.getSites();
        this.setState({
            showServiceAgent: !this.state.showServiceAgent,
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    showProductSelection(event) {
        this.props.setProduct(this.props.item);
        // this.props.setParentProduct(this.state.parentProduct)

        this.props.showProductPopUp({ type: "sub_product_view", show: true });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (!this.props.item) {
            this.loadProduct(this.props.productId);
        } else {
            this.setState({
                item: newProps.item,
            });


            this.getSubProducts();

            this.loadInfo();
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
            this.showProductEdit();
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
    submitDuplicateProduct = (event) => {
        axios
            .post(baseUrl + "product/" + this.state.item.product._key + "/duplicate", {})
            .then((res) => {
                this.props.showSnackbar({show:true,severity:"success",message:"Duplicate product created successfully. Thanks"})

                this.props.history.push("/my-products");


            })
            .catch((error) => {
                // this.setState({
                //
                //     errorRegister:error.response.data.errors[0].message
                // })
            });
    };



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
                    product_id: this.props.item.product._key,
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
                    product_id: this.props.item.product._key,
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
        // var siteKey = (this.props.item.site_id).replace("Site/","")

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

    loadProduct(productKey) {
        if (productKey)
            axios.get(baseUrl + "product/" + productKey + "/expand").then(
                (response) => {
                    var responseAll = response.data;

                    this.setState({
                        item: responseAll.data,
                    });

                    this.loadInfo();
                },
                (error) => {}
            );
    }

    componentDidMount() {
        if (!this.props.item) {
            this.loadProduct(this.props.productId);
        } else {
            this.setState({
                item: this.props.item,
            });

            this.loadInfo();
        }
    }

    loadInfo() {
        if (this.state.item) {
            this.getOrgs();

            if (this.state.item.listing && this.props.isLoggedIn) {
                this.getListing();
            }

            if (this.state.item && this.state.item.searches.length > 0) {
                this.getSearches();
            }

            if (this.state.showRegister && this.state.isLoggedIn && this.state.userDetail)
                this.getSites();
        }
    }



    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                {this.state.item ? (
                    <>
                        <div className="row no-gutters  justify-content-center">
                            <div className="col-md-4 col-sm-12 col-xs-12 ">
                                <div className=" stick-left-box  ">


                                  <ImageHeader images={this.state.item.artifacts} />


                                  {this.state.isLoggedIn &&
                                        !this.state.hideRegister &&
                                        this.state.userDetail.orgId !== this.state.item.org._id && (
                                            <>
                                                <div className={"col-12 pb-5 mb-5"}>
                                                    <div className="row justify-content-start pb-3 pt-3 ">
                                                        <div className="col-12 ">
                                                            <button
                                                                onClick={this.showRegister}
                                                                className={
                                                                    "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2"
                                                                }>
                                                                Register this product
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    <QrCode hideRegister={this.props.hideRegister}  item={this.state.item}/>
                                </div>
                            </div>

                            <div className={"col-md-8 col-sm-12 col-xs-12 desktop-padding-left pt-3 "}>

                                <div className="row justify-content-start pb-3  ">
                                    <div className="col-12 ">
                                        <div className="row">
                                            <div className="col-8">
                                                <h4 className="blue-text text-heading text-caps">
                                                    {this.state.item.product.name}
                                                </h4>
                                            </div>

                                            <div className="col-4 text-right">
                                                { (this.state.item.org._id ===
                                                this.props.userDetail.orgId) && <MoreMenu
                                                    triggerCallback={(action) =>
                                                        this.callBackResult(action)
                                                    }
                                                    serviceAgent={
                                                        this.state.item.service_agent._id ===
                                                        this.props.userDetail.orgId
                                                            ? true
                                                            : false
                                                    }
                                                    release={
                                                        this.state.item.org._id ===
                                                        this.props.userDetail.orgId
                                                            ? true
                                                            : false
                                                    }
                                                    duplicate={
                                                        this.state.item.org._id ===
                                                        this.props.userDetail.orgId
                                                            ? true
                                                            : false
                                                    }
                                                    edit={
                                                        this.state.item.org._id ===
                                                        this.props.userDetail.orgId
                                                            ? true
                                                            : false
                                                    }
                                                />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-7">
                                                <OrgFull org={this.state.item.org} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"listing-row-border "}></div>

                                <div className="row justify-content-start pb-3 pt-3 ">
                                    <div className="col-auto">
                                        <p
                                            style={{ fontSize: "16px" }}
                                            className={"text-gray-light  "}>
                                            {this.state.item.product.description}
                                        </p>
                                    </div>
                                </div>
                                <div className={"listing-row-border "}></div>

                                <div className="row justify-content-start pb-3 pt-3 tabs-detail">
                                    <div className="col-12 mt-2">
                                        <Tabs
                                            defaultActiveKey="productinfo"
                                            id="uncontrolled-tab-example">
                                            <Tab eventKey="productinfo" title="Product Info">
                                               <InfoTabContent item={this.props.item} />

                                            </Tab>

                                            <Tab eventKey="subproducts" title="Subproducts">
                                              <SubProductsTab item={this.props.item} />
                                            </Tab>

                                            {this.props.item.site.geo_codes&&this.props.item.site.geo_codes[0]&&    <Tab eventKey="maps" title="Site">

                                                <GoogleMap siteId={this.props.item.site._key} width={"100%"}  height={"300px"} locations={[{name:this.props.item.site.name, location:this.props.item.site.geo_codes[0].address_info.geometry.location,isCenter:true}]} />

                                            </Tab>}
                                            {/*{this.state.searches.length > 0 && (*/}

                                            {this.props.item && (this.props.item.product.purpose=="aggregate") &&
                                            <Tab eventKey="search" title="Conversion">

                                                </Tab>
                                            }
                                            {/*)}*/}

                                            {this.state.searches.length > 0 && (
                                                <Tab eventKey="search" title="Searches">
                                                    {this.state.searches.map((item) => (
                                                        <SearchItem item={item} />
                                                    ))}
                                                </Tab>
                                            )}

                                            {this.state.listingLinked && (
                                                <Tab eventKey="listing" title="Listing">
                                                    {this.state.listingLinked && (
                                                        <ResourceItem
                                                            history={this.props.history}
                                                            item={this.state.listingLinked}
                                                        />
                                                    )}
                                                </Tab>
                                            )}
                                            <Tab eventKey="artifacts" title="Artifacts">
                                                <ArtifactProductsTab item={this.props.item} />
                                            </Tab>
                                        </Tabs>
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

                            {/*<ProductEditForm*/}
                            {/*    triggerCallback={(action) => this.callBackSubmit(action)}*/}
                            {/*    isDuplicate={this.state.productDuplicate}*/}
                            {/*    productId={this.state.item.product._key}*/}
                            {/*/>*/}
                            <div className="row py-3 justify-content-center mobile-menu-row pt-3 p-2">
                                <div className="col mobile-menu">
                                    <div className="form-col-left col-12">
                            <ProductForm triggerCallback={(action) => this.callBackSubmit(action)} heading={"Edit Product"} item={this.state.item} />
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
                                            Release Product: {this.state.item.product.name}
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
                                            Change Service Agent For: {this.state.item.product.name}
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

    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductDetailContent);
