import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {baseUrl, ENTITY_TYPES} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {Alert, Modal, ModalBody} from "react-bootstrap";
import {withStyles} from "@mui/styles/index";
import {Link} from "react-router-dom";
import SearchItem from "../Searches/search-item";
import ResourceItem from "../../pages/create-search/ResourceItem";
import TextField from "@mui/material/TextField";
import MoreMenu from "../MoreMenu";
import AutocompleteCustom from "../AutocompleteSearch/AutocompleteCustom";
import ImageHeader from "../UIComponents/ImageHeader";
import QrCode from "./QrCode";
import InfoTabContent from "./InfoTabContent";
import SubProductsTab from "./SubProductsTab";
import ProductForm from "../ProductPopUp/ProductForm";
import {GoogleMap} from "../Map/MapsContainer";
import AggregatesTab from "./AggregatesTab";
import OrgComponent from "../Org/OrgComponent";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CloseButtonPopUp from "../FormsUI/Buttons/CloseButtonPopUp";
import GlobalDialog from "../RightBar/GlobalDialog";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import BlueBorderLink from "../FormsUI/Buttons/BlueBorderLink";
import ReportIcon from "@mui/icons-material/SwapVerticalCircle";
import {fetchErrorMessage, getParameterByName, getTimeFormat} from "../../Util/GlobalFunctions";
import EventForm from "../Event/EventForm";
import BigCalenderEvents from "../Event/BigCalenderEvents";
import ArtifactManager from "../FormsUI/ArtifactManager";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";


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
            initialValues:{},
            activeKey:"1",
            activeReleaseTabKey:"1",
            zoomQrCode:false,
            releases:[],
            events:[],
            isOwner:false,
            isArchiver:false,
            isServiceAgent:false

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
        // this.showReleaseProduct = this.showReleaseProduct.bind(this);
        this.showServiceAgent = this.showServiceAgent.bind(this);
        this.showOrgForm = this.showOrgForm.bind(this);
        this.handleSubmitOrg = this.handleSubmitOrg.bind(this);
        this.getOrgs = this.getOrgs.bind(this);
        this.loadInfo = this.loadInfo.bind(this);
        this.loadProduct = this.loadProduct.bind(this);

        this.phonenumber = this.phonenumber.bind(this);
    }

    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }

    setActiveReleaseTabKey=(event,key)=>{


        this.setState({
            activeReleaseTabKey:key,
            errorRelease: null,
            showReleaseSuccess:false

        })


    }



    actionSubmit = () => {

        if (this.state.releases&&this.state.releases.length>0) {
            var data = {
                id: this.state.releases[0].Release._key,
                new_stage: "cancelled",
                // "site_id": this.state.site
            };

            axios
                .post(baseUrl + "release/stage", data)
                .then((res) => {


                    this.fetchReleases()

                    this.props.showSnackbar({show:true,severity:"success",message:"Release request cancelled successfully. Thanks"})


                })
                .catch((error) => {
                    // this.setState({
                    //
                    //     showPopUp: true,
                    //     loopError: error.response.data.content.message
                    // })
                });

        }
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

    showReleaseProductPopUp=()=> {

        this.setState({
            errorRelease: false,
            showReleaseSuccess:false
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


    showEvent() {

        this.setState({
            showEventPopUp: !this.state.showEventPopUp,
        });
    }


    componentWillUnmount() {
        clearInterval(this.interval);
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

        this.setActiveKey(null,"1")


        this.fetchReleases()

        this.getEvents(this.state.item.product._key)

        this.ocVCProduct()

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props) {

            if (!this.props.item) {
                this.loadProduct(this.props.productId);
            } else {
                this.setState({
                    item: this.props.item,
                });

                this.loadInfo();
            }
            // this.setActiveKey(null,"1")
        }
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

    ocVCProduct = () => {

        axios.get(baseUrl + "product/"+this.props.item.product._key+"/oc-vc" ).then(
            (response) => {


                this.setState({
                    isOwner:response.data.data.ownership_context.is_owner,
                    isArchiver:response.data.data.ownership_context.is_archiver,
                    isServiceAgent:response.data.data.ownership_context.is_service_agent,
                })


            }
        ).catch(error => {});

    };

    callBackResult(action) {


        if (action === "edit") {
            this.showProductEdit();
        }
        else if (action === "archive") {
            this.deleteItem();
        }
        else if (action === "unArchive") {
            this.unarchiveItem();
        }

        else if (action === "duplicate") {
            this.submitDuplicateProduct();
        } else if (action === "release") {
            this.showReleaseProductPopUp();
        }
        else if (action === "serviceAgent") {
            this.showServiceAgent();
        }
        else if (action === "addevent") {
            this.showEvent();
        }
    }


    triggerCallback() {
        this.showProductEdit();

    }

    deleteItem() {

        axios
            .post(baseUrl + "product/archive", {
                product_id: this.state.item.product._key,
            })
            .then((res) => {
                this.props.showSnackbar({show:true,severity:"success",message:"Product has moved to archive successfully. Thanks"})

                this.ocVCProduct()
            })
            .catch((error) => {
                // this.setState({
                //
                //     errorRegister:error.response.data.errors[0].message
                // })

                this.props.showSnackbar({show:true,severity:"error",message:fetchErrorMessage(error)})
            });
    }
    unarchiveItem() {

        axios
            .post(baseUrl + "product/unarchive", {
                product_id: this.state.item.product._key,
            })
            .then((res) => {
                this.props.showSnackbar({show:true,severity:"success",message:"Product unarchived successfully. Thanks"})

                this.ocVCProduct()
            })
            .catch((error) => {

                this.props.showSnackbar({show:true,severity:"error",message:fetchErrorMessage(error)})
            });
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

                this.props.showSnackbar({show:true,severity:"error",message:fetchErrorMessage(error)})

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

                this.fetchReleases()


            })
            .catch((error) => {
                this.setState({
                    errorRelease: error.response.data.errors[0].message,
                });
            });
    };

    submitReleaseRentalProduct = (event) => {
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
                baseUrl + "rental-release",

                {
                    org_id: site,
                    product_id: this.props.item.product._key,
                    rental_stage:"start_rental"
                }
            )
            .then((res) => {

                this.setState({
                    currentReleaseId: res.data.data._key,
                    showReleaseSuccess: true,
                });

                this.fetchReleases()


            })
            .catch((error) => {
                this.setState({
                    errorRelease: error.response.data.errors[0].message,
                });
            });
    };


    submitReleaseInteranally = (event) => {
        this.setState({
            errorRegister: null,
        });

        event.preventDefault();

        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        const site = data.get("site");


        axios
            .post(
                baseUrl + "product/site",

                {
                    product_id: this.props.item.product._key,
                    site_id: site,
                },
            )
            .then((res) => {


                this.showReleaseProductPopUp()
                this.props.loadCurrentProduct(this.props.item.product._key)
                this.props.showSnackbar({show:true,severity:"success",message:"Request to release "+this.props.item.product.name+" internally to new site is completed successfully. Thanks"})


            })
            .catch((error) => {

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

    // toggleSite=(refresh)=> {
    //     this.setState({
    //         showCreateSite: !this.state.showCreateSite,
    //     });
    //
    //
    //     if (refresh){
    //         this.props.loadSites();
    //
    //     }
    // }
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



    fetchReleases=()=> {
        axios
            .get(baseUrl + "release/product/"+this.state.item.product._key)
            .then(
                (response) => {

                    this.setState({
                        releases: response.data.data,

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }


     getEvents = (productId) => {


        let url = `${baseUrl}product/${productId}/event`




        axios.get(url).then(
            (response) => {
                var responseAll = response.data.data;

                this.setState({
                    events:responseAll
                })
            },
            (error) => {

            }
        );
    };


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



    callZoom=()=>{


        this.setState({
            zoomQrCode:!this.state.zoomQrCode


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
                            {this.props.item&&this.props.item.qr_artifact && (
                                <img
                                    className="img-fluid qr-code-zoom"
                                    src={this.props.item.qr_artifact.blob_url}

                                />
                            )}
                        </div>}
                        <div className="row  pt-4 pb-4  justify-content-start">
                            <div className="text-left ps-0   col-sm-12 col-xs-12 breadcrumb-row">
                                <Link to={`/my-products${this.props.paramsString?this.props.paramsString:""}`}>{getParameterByName("type",this.props.paramsString?this.props.paramsString:"Products")} List</Link><span className={"divider-breadcrumb ps-2 pe-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.state.item.product.name}</span>

                            </div>
                        </div>
                        <div className="row   justify-content-center">
                            <div className="col-md-4 col-sm-12 col-xs-12 ">

                                <div className="row stick-left-box">
                                    {/*<div className="col-12 ">*/}
                                    {/*    <div className="   ">*/}
                                            <ImageHeader images={this.state.item.artifacts} />
                                            {this.state.isLoggedIn &&
                                            !this.state.hideRegister &&
                                            this.state.userDetail.orgId !== this.state.item.org._id && (
                                                <>
                                                    <div className={"col-12 pb-5 mb-5"}>
                                                        <div className="row justify-content-start pb-3  ">
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

                                            <QrCode callZoom={this.callZoom} hideRegister={this.props.hideRegister}  item={this.state.item}/>
                                    {/*    </div>*/}


                                    {/*</div>*/}
                                </div>

                            </div>

                            <div className={"col-md-8 col-sm-12 col-xs-12  "}>

                                <div className="row justify-content-start pb-3  ">
                                    <div className="col-12 ">
                                        <div className="row">
                                            <div className="col-12 position-relative">
                                                {this.state.isArchiver && <small className="text-danger d-flex justify-content-start align-items-center "><PriorityHighIcon style={{fontSize:"16px"}} />Archived product.</small>}
                                                <h4 className="text-capitalize product-title width-90">
                                                    {this.state.item.product.name}
                                                </h4>
                                                <div className="top-right text-right">
                                                    <div className="d-flex flex-row align-items-center justify-content-center ">

                                                    { (this.state.item.org._id ===
                                                        this.props.userDetail.orgId) &&
                                                    <MoreMenu
                                                        triggerCallback={(action) =>
                                                            this.callBackResult(action)
                                                        }

                                                        archive={
                                                            this.state.isOwner
                                                        }
                                                        unArchive={
                                                            this.state.isArchiver
                                                        }
                                                        serviceAgent={
                                                            this.state.isServiceAgent}

                                                        duplicate={
                                                            this.state.isOwner
                                                        }
                                                        edit={
                                                            this.state.isOwner
                                                        }

                                                        // addEvent={(action)=>
                                                        //     this.callBackResult(action)
                                                        // }

                                                        addEvent={this.state.isOwner}

                                                    />

                                                    }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-7">
                                                <OrgComponent org={this.state.item.org} />
                                            </div>
                                            <div className="col-5 text-right justify-content-end d-flex">
                                                {this.state.isOwner
                                                    ?  <span onClick={this.showReleaseProductPopUp} className="click-item d-flex flex-row align-items-center">
                                               Release   <ReportIcon className="click-Item ms-2 mr-1 text-blue" />
                                                </span>:""}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row justify-content-start pb-3 ">
                                    <div className="col-auto">
                                        <p
                                            style={{ fontSize: "16px" }}
                                            className={"text-gray-light  "}>
                                            {this.state.item.product.description}
                                        </p>
                                    </div>
                                </div>

                                <div className={"listing-row-border "}></div>


                                {this.props.item &&
                                <div className="row justify-content-start pb-3  tabs-detail">
                                    <div className="col-12 ">

                                        <Box sx={{ width: '100%', typography: 'body1' }}>
                                            <TabContext value={this.state.activeKey}>
                                                <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                                    <TabList
                                                        allowScrollButtonsMobile
                                                        variant="scrollable"
                                                        scrollButtons="auto"
                                                        textColor={"#27245C"}
                                                        TabIndicatorProps={{
                                                            style: {
                                                                backgroundColor: "#27245C",
                                                                padding: '2px',
                                                                borderRadius:"2px"
                                                            }
                                                        }}
                                                        onChange={this.setActiveKey}

                                                        aria-label="lab API tabs example">

                                                        <Tab label="Product Info" value="1" />
                                                        {(this.props.item.product.purpose === "aggregate") &&
                                                        <Tab label="Aggregation" value="2"/>
                                                        }
                                                        <Tab label="Sub Products" value="3" />

                                                        <Tab label="Site" value="4" />
                                                        {this.state.searches.length > 0 && (
                                                            <Tab label="Searches" value="5" />
                                                        )}

                                                        {this.state.listingLinked &&
                                                        <Tab label="Listing" value="6" />
                                                        }

                                                        <Tab label="Attachments" value="7" />
                                                        {this.state.events.length>0 &&  <Tab label="Calendar" value="8" />}

                                                    </TabList>
                                                </Box>

                                                <TabPanel value="1">

                                                    <InfoTabContent item={this.props.item}/>

                                                </TabPanel>

                                                {(this.props.item.product.purpose === "aggregate") &&
                                                <TabPanel value="2">

                                                    <AggregatesTab item={this.props.item}/>
                                                </TabPanel>}
                                                <TabPanel value="3">
                                                    <SubProductsTab
                                                        isOwner={this.state.isOwner}
                                                        item={this.props.item}/>
                                                </TabPanel>
                                                <TabPanel value="4">
                                                    <>

                                                        <p className={"mt-4 mb-4"}>Linked Site:<span className={"text-bold"}> <Link to={"/ps/"+this.props.item.site._key}>{this.props.item.site.name}</Link></span></p>
                                                        {this.props.item.site.geo_codes && this.props.item.site.geo_codes[0] &&

                                                        <div className={"bg-white rad-8 p-2"}>
                                                            <GoogleMap
                                                                searchLocation
                                                                siteId={this.props.item.site._key} width={"100%"}
                                                                       height={"300px"} location={{
                                                                name: this.props.item.site.name,
                                                                location: this.props.item.site.geo_codes[0].address_info.geometry.location,
                                                                isCenter: true
                                                            }}/>
                                                        </div>

                                                        }

                                                    </>

                                                </TabPanel>


                                                {this.state.searches.length > 0 && (
                                                    <>
                                                        <div className={"mt-4"}></div>
                                                        <TabPanel value="5">
                                                            {this.state.searches.map((item) => (
                                                                <SearchItem smallImage={true} item={item}/>
                                                            ))}
                                                        </TabPanel>
                                                    </>
                                                )}

                                                {this.state.listingLinked && (

                                                    <>
                                                        <div className={"mt-4"}></div>
                                                        <TabPanel value="6">
                                                            {this.state.listingLinked && (
                                                                <ResourceItem
                                                                    hideCategory
                                                                    smallImage={true}
                                                                    history={this.props.history}
                                                                    item={this.state.listingLinked}
                                                                    artifacts={this.state.item.artifacts}
                                                                    hideMoreMenu={true}
                                                                />
                                                            )}
                                                        </TabPanel>
                                                    </>
                                                )}
                                                <TabPanel value="7">
                                                    {/*<ArtifactProductsTab*/}
                                                    {/*    entityType={ENTITY_TYPES.Product}*/}
                                                    {/*    item={this.props.item}*/}
                                                    {/*    type={"edit"}*/}
                                                    {/*/>*/}
                                                    <div className=" bg-white rad-8 mt-4 p-3">
                                                    <ArtifactManager
                                                        entityType={ENTITY_TYPES.Product}
                                                        item={this.props.item}
                                                        entityId={this.props.item.product._key}
                                                        artifacts={this.props.item.artifacts}
                                                        type={"edit"}
                                                        isArchiver={this.state.isArchiver}
                                                    />
                                                    </div>
                                                </TabPanel>

                                                  <TabPanel value="8">
                                                    <BigCalenderEvents
                                                       events={this.state.events}
                                                        productId={this.state.item.product._key}
                                                       smallView  />
                                                </TabPanel>


                                            </TabContext>
                                        </Box>

                                    </div>
                                </div>
                                }


                            </div>
                        </div>




                        <GlobalDialog
                            size="sm"
                            heading={"Add event"}

                            show={this.state.showEventPopUp}
                            hide={()=> {
                                this.showEvent();
                            }}
                        >
<>
                    {this.state.showEventPopUp&&
                    <div className="form-col-left col-12">
                                <EventForm
                                    hideProduct
                                    hide={()=> {
                                        this.showEvent();
                                    }}

                                    productId={this.state.item.product._key}
                                    triggerCallback={() => this.getEvents(this.state.item.product._key)}   />
                            </div>}
</>
                        </GlobalDialog>


                        <GlobalDialog
                            size="md"
                            heading={"Add Product"}
                            hideHeading
                            show={this.state.showProductEdit}
                            hide={()=> {
                                this.showProductEdit();
                            }} >

                                    <div className="form-col-left col-12">
                                        {this.state.showProductEdit &&  <ProductForm
                                            hideUpload
                                            edit
                                            triggerCallback={(action) => this.callBackSubmit(action)} heading={"Edit Product"}
                                            item={this.props.item} />
                                        }
                                    </div>

                        </GlobalDialog>


                        {/*<GlobalDialog*/}

                        {/*    size={"sm"}*/}
                        {/*    hide={this.toggleSite}*/}
                        {/*    show={this.state.showCreateSite}*/}
                        {/*    heading={"Add new site"}*/}

                        {/*>*/}
                        {/*    <>*/}
                        {/*        <div className="col-12 ">*/}

                        {/*            <SiteFormNew refresh={()=>this.toggleSite(true)} />*/}
                        {/*        </div>*/}
                        {/*    </>*/}
                        {/*</GlobalDialog>*/}

                        <GlobalDialog
                            allowOverflow
                            heading={"Release Product: "+ this.state.item.product.name}
                            show={this.state.showReleaseProduct}
                            hide={this.showReleaseProductPopUp}
                        >
                            <>
                                {this.state.showReleaseProduct&&<>
                                <div className={"col-6 d-none text-center"}>
                                    <BlueButton
                                        title={"Release Internally"}
                                        type={"submit"}

                                        fullWidth

                                    >
                                    </BlueButton>
                                </div>
                                <div className={"col-6  d-none text-center"}>
                                    <BlueBorderButton
                                        fullWidth
                                        title={"Release Externally"}
                                        type={"submit"}

                                    >
                                    </BlueBorderButton>
                                </div>
                                <div className={"col-12 "}>
                                    <Box sx={{ width: '100%', typography: 'body1' }}>
                                        <TabContext value={this.state.activeReleaseTabKey}>
                                            <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                                <TabList
                                                    centered
                                                    allowScrollButtonsMobile
                                                    variant="centered"

                                                    scrollButtons="auto"
                                                    textColor={"#27245C"}
                                                    TabIndicatorProps={{
                                                        style: {
                                                            backgroundColor: "#27245C",
                                                            padding: '2px',
                                                        }
                                                    }}
                                                    onChange={this.setActiveReleaseTabKey}

                                                    aria-label="lab API tabs example">

                                                    <Tab label="Release Internally" value="1" />

                                                    <Tab label="Release Externally" value="2"/>
                                                    {/*<Tab label="Rental" value="3"/>*/}



                                                </TabList>
                                            </Box>

                                            <TabPanel value="1">

                                                {/*<div className={"col-12 "}>*/}
                                                <form onSubmit={this.submitReleaseInteranally}>
                                                    <div className={"row no-gutters justify-content-center "}>
                                                        <div className={"col-12  mt-3"}>
                                                            <div className={"row no-gutters justify-content-center"}>
                                                                <div className={"col-12  mb-4"}>

                                                                    <SelectArrayWrapper
                                                                        details="Select the site where your product is currently located."
                                                                        option={"name"}
                                                                        valueKey={"_key"}
                                                                        // error={this.state.errors["deliver"]}
                                                                        // onChange={(value)=> {
                                                                        //
                                                                        //     this.handleChangeProduct(value,"deliver")
                                                                        //
                                                                        // }}
                                                                        select={"Select "}
                                                                        options={this.state.sites} name={"site"}
                                                                        title="Select release site"/>

                                                                </div>



                                                                {this.state.errorRelease && (
                                                                    <div
                                                                        className={
                                                                            "row justify-content-center"
                                                                        }>
                                                                        <div
                                                                            className={"col-12 mt-4 mb-4 "}
                                                                            style={{ textAlign: "center" }}>
                                                                            <Alert
                                                                                key={"alert"}
                                                                                variant={"danger"}>
                                                                                {this.state.errorRelease}
                                                                            </Alert>
                                                                        </div>
                                                                    </div>
                                                                )}


                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={
                                                            "row justify-content-center"
                                                        }>
                                                        <div
                                                            className={"col-6"}
                                                            style={{
                                                                textAlign: "center",
                                                            }}>
                                                            <BlueButton
                                                                fullWidth
                                                                title={"Submit"}
                                                                type={"submit"}>

                                                            </BlueButton>
                                                        </div>
                                                        <div
                                                            className={"col-6 d-none"}
                                                            style={{
                                                                textAlign: "center",
                                                            }}>
                                                            <BlueBorderButton
                                                                type="button"
                                                                fullWidth
                                                                title={"Cancel"}


                                                                onClick={
                                                                    this
                                                                        .showReleaseProductPopUp
                                                                }
                                                            >

                                                            </BlueBorderButton>
                                                        </div>
                                                    </div>
                                                </form>
                                                {/*</div>*/}

                                            </TabPanel>
                                            <TabPanel value="2">

                                                {/*{!this.state.showReleaseSuccess ? (*/}
                                                    <> <div className={"row "}>
                                                        {!(this.state.releases&&
                                                            this.state.releases.length&&
                                                            this.state.releases.filter(item=>item.Release.stage==="requested").length>0)&&
                                                        <div className={"col-12 mt-3 "}>

                                                            <div style={{position:"relative"}} className="text_fild ">
                                                                <div
                                                                    className="custom-label text-bold ellipsis-end text-blue mb-0">Search release company
                                                                </div>
                                                                <AutocompleteCustom

                                                                    filterOrgs={[{_id:this.props.userDetail.orgId}]}
                                                                    orgs={true}
                                                                    companies={true}
                                                                    suggestions={this.state.orgNames}
                                                                    selectedCompany={(action) =>
                                                                        this.companyDetails(action)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>}

                                                        {this.state.releases&&this.state.releases.length>0
                                                        && this.state.releases.filter(item=>item.Release.stage==="requested").map((release)=>

                                                            <div className={"col-12 mt-3 "}>

                                                                <div className="row mt-2 mb-4 no-gutters bg-light border-box rad-8 align-items-center">
                                                                    <div className={"col-11 text-blue "}>
                                                                       Product Release request to  <b>{release.responder.name}</b> <br/>
                                                                        Status: <span className="text-pink text-capitlize">{release.Release.stage}</span>
                                                                        <br/><small className="text-gray-light mr-2">{getTimeFormat(release.Release._ts_epoch_ms)}</small>
                                                                    </div>

                                                                    <div className={"col-1 text-right "}>
                                                                         <CloseButtonPopUp
                                                                            // onClick={()=>this.removeCompany(2,item._key)}

                                                                            onClick={this.actionSubmit}
                                                                        />
                                                                    </div>
                                                                </div>



                                                            </div>
                                                        )}
                                                        <div className={"col-12 "}>
                                                            <form onSubmit={this.submitReleaseProduct}>
                                                                <div className={"row justify-content-center "}>
                                                                    <div className={"col-12 text-center mt-2"}>
                                                                        <div className={"row no-gutters justify-content-center"}>
                                                                            <div className={"col-12 text-center "}>
                                                                                <input
                                                                                    className={"d-none"}
                                                                                    value={this.state.org_id}
                                                                                    name={"org"}
                                                                                />

                                                                                <p className="d-none">
                                                                                    If the company you are looking for
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
                                                                                        className={"col-12 mt-4 mb-4"}
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
                                                                                        "col-12 justify-content-center mt-3 "
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
                                                                                            {!(this.state.releases&&
                                                                                                this.state.releases.length&&
                                                                                                this.state.releases.filter(item=>item.Release.stage==="requested").length>0)&&
                                                                                            <BlueButton
                                                                                                fullWidth
                                                                                                title={"Submit"}
                                                                                                type={"submit"}>

                                                                                            </BlueButton>}
                                                                                        </div>
                                                                                        <div
                                                                                            className={"col-6 d-none"}
                                                                                            style={{
                                                                                                textAlign: "center",
                                                                                            }}>
                                                                                            <BlueBorderButton
                                                                                                type="button"
                                                                                                fullWidth
                                                                                                title={"Cancel"}
                                                                                                onClick={
                                                                                                    this
                                                                                                        .showReleaseProductPopUp
                                                                                                }
                                                                                            >
                                                                                            </BlueBorderButton>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>


                                                        {this.state.showOrgForm && (
                                                            <>
                                                                <div className={"col-12 "}>
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
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    </>
                                                {/*) : (*/}
                                                    <div className="d-none">
                                                        {!this.state.cancelReleaseSuccess && (
                                                            <div className={"row justify-content-center"}>
                                                                <div className={"col-12 mt-4 mb-3 text-center"}>
                                                                    <Alert key={"alert"} variant={"success"}>
                                                                        Your release request has been submitted
                                                                        successfully. Thanks
                                                                    </Alert>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {this.state.cancelReleaseSuccess && (
                                                            <div className={"row justify-content-center"}>
                                                                <div className={"col-12 text-center"}>
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
                                                                <BlueButton
                                                                    title={"OK"}
                                                                    fullWidth
                                                                    type="button"
                                                                    onClick={this.showReleaseProductPopUp}
                                                                >
                                                                </BlueButton>
                                                            </div>
                                                            <div
                                                                className={"col-6"}
                                                                style={{ textAlign: "center" }}>
                                                                <BlueBorderLink
                                                                    title={" Cancel Release"}
                                                                    fullWidth
                                                                    onClick={this.actionSubmit}
                                                                >

                                                                </BlueBorderLink>
                                                            </div>
                                                        </div>
                                                    </div>
                                                {/*)}*/}



                                            </TabPanel>

                                            <TabPanel value="3">

                                                {/*{!this.state.showReleaseSuccess ? (*/}
                                                <> <div className={"row "}>
                                                    {!(this.state.releases&&
                                                        this.state.releases.length&&
                                                        this.state.releases.filter(item=>item.Release.stage!=="cancelled").length>0)&&
                                                    <div className={"col-12 mt-3 "}>

                                                        <div style={{position:"relative"}} className="text_fild ">
                                                            <div
                                                                className="custom-label text-bold ellipsis-end text-blue mb-0">Search company for rental
                                                            </div>
                                                            <AutocompleteCustom
                                                                filterOrgs={[{_id:this.props.userDetail.orgId}]}
                                                                orgs={true}
                                                                companies={true}
                                                                suggestions={this.state.orgNames}
                                                                selectedCompany={(action) =>
                                                                    this.companyDetails(action)
                                                                }
                                                            />
                                                        </div>
                                                    </div>}

                                                    {this.state.releases&&this.state.releases.length>0
                                                    && this.state.releases.filter(item=>item.Release.stage!=="cancelled").map((release)=>

                                                        <div className={"col-12 mt-3 "}>

                                                            <div className="row mt-2 mb-4 no-gutters bg-light border-box rad-8 align-items-center">
                                                                <div className={"col-11 text-blue "}>
                                                                    Product Release request to  <b>{release.responder.name}</b> <br/>
                                                                    Status: <span className="text-pink text-capitlize">{release.Release.stage}</span>
                                                                    <br/><small className="text-gray-light mr-2">{getTimeFormat(release.Release._ts_epoch_ms)}</small>
                                                                </div>

                                                                <div className={"col-1 text-right "}>
                                                                    <CloseButtonPopUp
                                                                        // onClick={()=>this.removeCompany(2,item._key)}

                                                                        onClick={this.actionSubmit}
                                                                    />
                                                                </div>
                                                            </div>



                                                        </div>
                                                    )}
                                                    <div className={"col-12 "}>
                                                        <form onSubmit={this.submitReleaseRentalProduct}>
                                                            <div className={"row justify-content-center "}>
                                                                <div className={"col-12 text-center mt-2"}>
                                                                    <div className={"row no-gutters justify-content-center"}>
                                                                        <div className={"col-12 text-center "}>
                                                                            <input
                                                                                className={"d-none"}
                                                                                value={this.state.org_id}
                                                                                name={"org"}
                                                                            />

                                                                            <p className="d-none">
                                                                                If the company you are looking for
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
                                                                                    className={"col-12 mt-4 mb-4"}
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
                                                                                    "col-12 justify-content-center mt-3 "
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
                                                                                        {!(this.state.releases&&
                                                                                            this.state.releases.length&&
                                                                                            this.state.releases.filter(item=>item.Release.stage!=="cancelled").length>0)&&         <BlueButton
                                                                                            fullWidth
                                                                                            title={"Submit"}
                                                                                            type={"submit"}>

                                                                                        </BlueButton>}
                                                                                    </div>
                                                                                    <div
                                                                                        className={"col-6 d-none"}
                                                                                        style={{
                                                                                            textAlign: "center",
                                                                                        }}>
                                                                                        <BlueBorderButton
                                                                                            type="button"
                                                                                            fullWidth
                                                                                            title={"Cancel"}
                                                                                            onClick={
                                                                                                this
                                                                                                    .showReleaseProductPopUp
                                                                                            }
                                                                                        >
                                                                                        </BlueBorderButton>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>


                                                    {this.state.showOrgForm && (
                                                        <>
                                                            <div className={"col-12 "}>
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
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                </>
                                                {/*) : (*/}
                                                <div className="d-none">
                                                    {!this.state.cancelReleaseSuccess && (
                                                        <div className={"row justify-content-center"}>
                                                            <div className={"col-12 mt-4 mb-3 text-center"}>
                                                                <Alert key={"alert"} variant={"success"}>
                                                                    Your release request has been submitted
                                                                    successfully. Thanks
                                                                </Alert>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {this.state.cancelReleaseSuccess && (
                                                        <div className={"row justify-content-center"}>
                                                            <div className={"col-12 text-center"}>
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
                                                            <BlueButton
                                                                title={"OK"}
                                                                fullWidth
                                                                type="button"
                                                                onClick={this.showReleaseProductPopUp}
                                                            >
                                                            </BlueButton>
                                                        </div>
                                                        <div
                                                            className={"col-6"}
                                                            style={{ textAlign: "center" }}>
                                                            <BlueBorderLink
                                                                title={" Cancel Release"}
                                                                fullWidth
                                                                onClick={this.actionSubmit}
                                                            >

                                                            </BlueBorderLink>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/*)}*/}



                                            </TabPanel>



                                        </TabContext>
                                    </Box>
                                </div>
</>}

                            </>

                        </GlobalDialog>

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
                                            filterOrgs={[{_id:this.props.userDetail.orgId}]}
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
                                                                If the company you are looking for
                                                                doesn't exist?
                                                                <span
                                                                    className={"forgot-password-link "}
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
        siteList: state.siteList,
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
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductDetailContent);
