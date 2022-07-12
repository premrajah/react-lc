import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {withStyles} from "@mui/styles/index";
import MoreMenu from "../MoreMenu";
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
import SiteReleaseDialog from "./SiteReleaseDialog";
import {ownerCheck} from "../../Util/GlobalFunctions";
import GlobalDialog from "../RightBar/GlobalDialog";
import SiteFormNew from "./SiteFormNew";
import Layout from "../Layout/Layout";
import ArtifactSiteTab from "./ArtifactSiteTab";


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
            siteQrCode:null,
            releases:[]


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

    toggleSite=(refresh) =>{
        if (refresh){

            // this.loadSitesWithoutParentPageWise({reset:true})
        }

        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
    }


    callBackResult(action) {
        if (action === "edit") {

            // this.props.setSiteForm({show:true,
            //     item:this.props.item.site,type:"edit",
            //     heading:"Edit Site",parent:this.props.item.parent_site});

            this.toggleSite(false)

        } else if (action === "delete") {
            this.deleteItem();
        }
        else if (action === "duplicate") {
            this.submitDuplicateProduct();
        } else if (action === "release") {
            this.showReleaseSitePopUp();
        } else if (action === "serviceAgent") {
            this.showServiceAgent();
        }
    }


    triggerCallback() {
        this.showProductEdit();
        // this.props.triggerCallback();
    }

    deleteItem() {
        axios.delete(baseUrl + "site/" + this.state.item.site._key).then(
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

    showReleaseSitePopUp=()=> {

        this.setState({
            errorRelease: false,
            showReleaseSuccess:false
        });

        this.getSites();
        this.setState({
            showReleaseProduct: !this.state.showReleaseProduct,
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

        // this.fetchReleases()

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
                                    <GoogleMap width={"100%"} height={"300px"}
                                               siteId={this.props.item.site._key}
                                               locations={[{
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

                            <div className={"col-md-8 col-sm-12 col-xs-12  "}>

                                <div className="row  justify-content-start   ">
                                    <div className="col-12 ">
                                        <div className="row">
                                            <div className="col-8">
                                                <h4 className="text-capitalize product-title">
                                                    {this.props.item.site.name}
                                                </h4>
                                            </div>

                                            {this.props.isLoggedIn  &&<div className="col-4 text-right">
                                                <MoreMenu
                                                    triggerCallback={(action) =>
                                                        this.callBackResult(action)
                                                    }
                                                    release={true}
                                                    edit={true}

                                                />
                                            </div>}
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
                                                        allowScrollButtonsMobile
                                                        TabIndicatorProps={{
                                                            style: {
                                                                backgroundColor: "#27245C",
                                                                padding: '2px',
                                                            }
                                                        }}
                                                        onChange={this.setActiveKey} >

                                                        <Tab label="Info" value="1"/>

                                                        <Tab label="Subsite" value="2" />

                                                        {this.props.isLoggedIn  &&
                                                        <Tab label="Products" value="3" />
                                                        }
                                                        {/*<Tab label="Attachments" value="4" />*/}
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
                                                <TabPanel value="4">
                                                    <ArtifactSiteTab item={this.props.item}/>
                                                </TabPanel>

                                            </TabContext>
                                        </Box>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.state.item && <SiteReleaseDialog hide={this.showReleaseSitePopUp} item={this.props.item} showReleaseProduct={this.state.showReleaseProduct} />}


                        <GlobalDialog

                            size={"md"}
                            hide={this.toggleSite}
                            show={this.state.showCreateSite}
                            heading={"Edit site"}>
                            <>
                                <div className="col-12 ">

                                    <SiteFormNew
                                        hide={this.toggleSite} edit item={this.props.item}
                                                  refresh={()=>this.toggleSite(true)}
                                    />
                                </div>
                            </>
                        </GlobalDialog>



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
