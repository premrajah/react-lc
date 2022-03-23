import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {withStyles} from "@mui/styles/index";
import CampaignDetail from "./CampaignDetail";

class CampaignDetailContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {
            item:null,
           editMode:false


        };

    }


    toggleEditMode=(item)=> {

        this.props.toggleEditMode(this.state.item)

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
        this.props.setProduct(this.props.item.site);
        // this.props.setParentProduct(this.state.parentProduct)

        this.props.showProductPopUp({ type: "sub_product_view", show: true });
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
                item:this.props.item,type:"edit", heading:"Edit Site"});

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

    setActiveKey=(key)=>{


        this.setState({
            activeKey:key
        })


    }

    componentDidMount() {



        axios
            // .get(baseUrl + "campaign/" + encodeUrl(this.slug))
            .get(baseUrl + "campaign/" + encodeUrl(this.props.item.campaign._key))
            .then(
                (response) => {
                    var responseAll = response.data;


                    this.setState({
                        item:responseAll.data
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );


    }
    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props) {


            this.setActiveKey("productinfo")
        }
    }

    loadInfo() {
        if (this.state.item) {
            // this.getOrgs();
            //
            // if (this.state.item.listing && this.props.isLoggedIn) {
            //     this.getListing();
            // }
            //
            // if (this.state.item && this.state.item.searches.length > 0) {
            //     this.getSearches();
            // }
            //
            // if (this.state.showRegister && this.state.isLoggedIn && this.state.userDetail)
            //     this.getSites();
        }
    }



    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                {this.state.item ? (
                    <>

                            <>
                                <CampaignDetail refreshData={this.props.refreshData} toggleEditMode={this.toggleEditMode} item={this.state.item} />
                            </>
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
export default connect(mapStateToProps, mapDispachToProps)(CampaignDetailContent);
