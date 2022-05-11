import React, {Component} from "react";
import PlaceholderImg from "../img/place-holder-lc.png";
import axios from "axios/index";
import {baseUrl} from "../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../store/actions/actions";

import {Modal, ModalBody} from "react-bootstrap";
import TextField from "@mui/material/TextField";
import moment from "moment/moment";
import FormControl from "@mui/material/FormControl";
import {withStyles} from "@mui/styles/index";
import ImageOnlyThumbnail from "./ImageOnlyThumbnail";
import {Link} from "react-router-dom";
import {capitalize} from "../Util/GlobalFunctions";
import CustomizedSelect from "./FormsUI/ProductForm/CustomizedSelect";
import GlobalDialog from "./RightBar/GlobalDialog";
import BlueButton from "./FormsUI/Buttons/BlueButton";
import BlueBorderButton from "./FormsUI/Buttons/BlueBorderButton";
import GreenButton from "./FormsUI/Buttons/GreenButton";

class RequestSiteReleaseItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers: [],
            images: [],
            showSubmitSite: false,
            errorRegister: false,
            showProductEdit: false,
            productDuplicate: false,
            showProductHide: false,
            showPopUpInitiateAction: false,
            action: null,
            initiateAction: null,
            item: this.props.item,
            sites: [],
            site: null,
            siteSelected: null,
            fieldsSite: {},
            fields:{},
            errorsSite: {},
            isLoading:false,
            product:null,
            artifacts:[]
        };

        this.actionSubmit = this.actionSubmit.bind(this);
        this.togglePopUpInitiateAction = this.togglePopUpInitiateAction.bind(this);

        this.showSubmitSite = this.showSubmitSite.bind(this);
    }


    togglePopUpInitiateAction(event) {
        // if(!event) return;

        this.setState({
            showPopUpInitiateAction: !this.state.showPopUpInitiateAction,
            initiateAction: event?event.currentTarget.dataset.action:null,
        });
    }

    showSubmitSite() {
        this.setState({
            errorRegister: null,
            showSubmitSite: !this.state.showSubmitSite,
        });
    }

    handleValidationSite() {
        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }

        // if (!fields["others"]) {
        //     formIsValid = false;
        //     errors["others"] = "Required";
        // }

        if (!fields["address"]) {
            formIsValid = false;
            errors["address"] = "Required";
        }

        if (!fields["contact"]) {
            formIsValid = false;
            errors["contact"] = "Required";
        }

        if (!fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Required";
        }

        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    fields["email"].indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    fields["email"].length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errorsSite: errors });
        return formIsValid;
    }

    handleChangeSite(field, e) {
        let fields = this.state.fieldsSite;
        fields[field] = e.target.value;
        this.setState({ fields: fields });
    }

    handleChange(field, e) {
        // this.setState({ site: e.target.value });

        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields: fields })
    }

    handleSubmitSite = (event) => {
        if(!event) return;

        this.setState({
            errorRegister: null,
        });

        event.preventDefault();

        if (this.handleValidationSite()) {
            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);
            const email = data.get("email");
            const others = data.get("others");
            const name = data.get("name");
            const contact = data.get("contact");
            const address = data.get("address");
            const phone = data.get("phone");

            const payload = {
                site: {
                    name: name,
                    email: email,
                    contact: contact,
                    address: address,
                    phone: phone,
                    others: others,
                }
            }

            this.addNewSite(payload);

        }
    };

    addNewSite = (payload) => {
        axios
            .put(`${baseUrl}site`, payload)
            .then((res) => {
                this.props.loadSites();

                    this.showSubmitSite();
                this.setState({
                    siteSelected: res.data.data,
                });
            })
            .catch((error) => {});
    }

    submitRegisterProduct = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
            errorRegister: null,
        });

        const data = new FormData(event.target);

        const site = data.get("site");

        axios
            .post(baseUrl + "register",
                {
                    site_id: site,
                    product_id: this.props.item.product._key,
                }
            )
            .then((res) => {
                // this.toggleSite()
                // this.showRegister()

                this.setState({
                    showRegisterSuccess: true,
                });
            })
            .catch((error) => {
                this.setState({
                    errorRegister: error.response.data.errors[0].message,
                });
            });
    };

    actionSubmit() {
        let data = {
            id: this.state.item.Release._key,
            new_stage: this.state.initiateAction,
            site_id: this.state.fields["site"],
            parent_product_id:this.state.fields["parent_parent_id"]
        };




        this.setState({
            isLoading:true
        })
        axios
            .post(`${baseUrl}site-release/stage`, data)
            .then((res) => {
                this.setState({
                    isLoading:false
                })
                // this.getDetails();
                this.togglePopUpInitiateAction();
                // this.props.refreshPageCallback();
                this.props.refresh()
            })
            .catch((error) => {
                this.setState({
                    isLoading:false
                })
            });
    }

    componentDidMount() {
        this.loadSiteSync()
        // this.getArtifactsForProduct()
    }

    getArtifactsForProduct = () => {

        axios.get(`${baseUrl}product/${this.props.item.product_id.replace("Product/","")}/artifact`)
            .then(res => {
                const data = res.data.data;


                this.setState({
                    artifacts:data
                })
            })
            .catch(error => {
            })


    }

    loadSiteSync = () => {

        axios
            .get(baseUrl + "site/" + this.props.item.Site_id.replace("Site/",""))
            .then(
                (response) => {
                    let responseAll = response.data;

                    this.setState({
                        site:responseAll.data
                    })

                },
                (error) => {

                }
            );

    };



    render() {
        const classes = withStyles();

        return (
            <>
                {this.state.site && (
                    <>
                        <div key={this.state.item.Release._id}
                             id={this.state.item.Release._id}
                             className="row no-gutters bg-white rad-8 p-3 justify-content-center  mb-4 ">
                            <div className={"col-md-2 col-sm-12 col-xs-12 "}>
                                {this.state.site.geo_codes && this.state.site.geo_codes[0] ?
                                    <img className={"small-image img-fluid img-list rad-4"}
                                         src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.site.geo_codes[0].address_info.geometry.location.lat},${this.state.site.geo_codes[0].address_info.geometry.location.lng}&markers=color:0x212529%7Clabel:C%7C${this.state.site.geo_codes[0].address_info.geometry.location.lat},${this.state.site.geo_codes[0].address_info.geometry.location.lng}&zoom=12&size=110x110&scale=2&key=AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM`} alt="" />
                                    :<img className={"img-fluid img-list"} src={PlaceholderImg} alt="" />}
                            </div>
                            <div className={"col-sm-5 col-xs-12 pl-3-desktop  content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className="title-bold mb-1 text-capitlize">
                                    <Link to={`/ps/${this.state.site._key}`}>
                                        {this.state.site&&this.state.site.name}
                                    </Link>
                                </p>



                                <p style={{ fontSize: "16px" }} className="text-gray-light  mt-1 mb-1  text-capitalize">
                                    Stage: <span className={"text-blue"}>{this.state.item.Release.stage}</span>
                                </p>

                                <p style={{ fontSize: "16px" }} className="text-gray-light  mt-1 mb-1  text-capitalize">
                                    Address: <span className={"text-blue"}> {this.state.site&&this.state.site.address}</span>
                                </p>



                            </div>
                            <div style={{ textAlign: "right" }} className={"col-md-5 col-xs-12 col-sm-12"}>

                                <p className={"text-gray-light   date-bottom"}>
                                    {moment(this.state.item.Release._ts_epoch_ms).format(
                                        "DD MMM YYYY"
                                    )}
                                </p>
                                <div className="row  pb-4 pb-4 mb-4">
                                    <div className="col-12 text-right pb-2 pt-2">
                                        {this.props.item.next_action.is_mine &&
                                            this.props.item.next_action.possible_actions.map(
                                                (actionName, index) => (
                                                    <>
                                                        <button
                                                            data-id={this.props.item.Release._key}
                                                            data-action={actionName}
                                                            onClick={this.togglePopUpInitiateAction}
                                                            type="button"
                                                            className={
                                                                actionName === "accepted"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border-auto"
                                                                    : actionName === "cancelled"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "rejected"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "declined"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "progress"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border-auto"
                                                                    : actionName === "complete"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border-auto"
                                                                    : "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border-auto"
                                                            }>
                                                            {actionName === "accepted" && "Accept"}
                                                            {actionName === "cancelled" && "Cancel"}
                                                            {actionName === "rejected" && "Reject"}
                                                            {actionName === "declined" && "Decline"}

                                                            {actionName === "confirmed" &&
                                                                "Confirm"}
                                                            {actionName === "progress" &&
                                                                "Progress"}
                                                            {actionName === "complete" &&
                                                                "Complete"}
                                                        </button>
                                                    </>
                                                )
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <GlobalDialog
                            size={"xs"}

                            heading={this.state.initiateAction==="cancelled"?"Cancel":this.state.initiateAction}
                            show={this.state.showPopUpInitiateAction}
                            hide={this.togglePopUpInitiateAction}
                        >
                            <>

                                    <div className={"col-12 text-center"}>

                                        <div className=" mb-2 text-left title-bold">
                                            Are you sure you want to <span className={"text-lowercase"}>{this.state.initiateAction==="cancelled"?"cancel":this.state.initiateAction}?</span>

                                        </div>
                                    </div>


                                {this.state.initiateAction === "complete" && (
                                    <>
                                        <FormControl
                                            variant="outlined"
                                            className={classes.formControl}>

                                            <div
                                                className={"custom-label text-bold text-blue mb-3"}>
                                                Parent Product
                                            </div>


                                            <CustomizedSelect
                                                variant={"standard"}
                                                name={`parent_parent_id}]`}
                                                // label={"Link a product"}
                                                required={true}
                                                native
                                                onChange={this.handleChange.bind(
                                                    this,
                                                    "parent_parent_id"
                                                )}
                                                inputProps={{
                                                    // name: {`product[${index}]`},
                                                    id: "outlined-age-native-simple",
                                                }}>
                                                <option value={null}>Select</option>
                                                {this.props.productWithoutParentList.map((item) => (
                                                        <option value={item._key}>
                                                            {item.name}
                                                        </option>
                                                    ))}


                                            </CustomizedSelect>

                                            <div
                                                className={"custom-label text-bold text-blue mb-3"}>
                                                Select the location of product
                                            </div>

                                            <CustomizedSelect
                                                variant={"standard"}
                                                required={true}
                                                name={"site"}
                                                native
                                                onChange={this.handleChange.bind(this, "site")}
                                                inputProps={{
                                                    name: "site",
                                                    id: "outlined-age-native-simple",
                                                }}>
                                                <option value={""}>Select</option>

                                                {this.props.siteList.map((item, index) => (
                                                    <option value={item._key} key={index}>
                                                        {item.name + "(" + item.address + ")"}
                                                    </option>
                                                ))}
                                            </CustomizedSelect>
                                        </FormControl>

                                        <p className="text-left" style={{ margin: "10px 0" }}>
                                            Don’t see it on here?
                                            <span
                                                onClick={this.showSubmitSite}
                                                className="green-text forgot-password-link text-gray-light small ml-1">
                                                Add a site
                                            </span>
                                        </p>
                                    </>
                                )}

                                {!this.state.showSubmitSite && (
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-12 text-center mt-2"}>
                                            <div className={"row justify-content-center"}>
                                                <div
                                                    className={"col-6"}
                                                    >
                                                    <GreenButton

                                                        disabled={this.state.isLoading?true:false}
                                                        onClick={this.actionSubmit}
                                                       fullWidth
                                                        // className={
                                                        //     "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                        // }
                                                        title={"Yes"}
                                                        type={"submit"}>

                                                    </GreenButton>
                                                </div>
                                                <div
                                                    className={"col-6"}
                                                   >
                                                    <BlueBorderButton
                                                        fullWidth
                                                        title={"Cancel"}
                                                        onClick={this.togglePopUpInitiateAction}
                                                        // className={
                                                        //     "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                        // }
                                                    >

                                                    </BlueBorderButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}



                                </>
                        </GlobalDialog>
                        {/*    </ModalBody>*/}
                        {/*</Modal>*/}
                    </>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartthis.state.items: state.cartthis.state.items,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartathis.state.item : state.abondonCartthis.state.item,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
        siteList: state.siteList,
        productWithoutParentList: state.productWithoutParentList,

    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(RequestSiteReleaseItem);
