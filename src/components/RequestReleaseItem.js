import React, { Component } from "react";
import PlaceholderImg from "../img/place-holder-lc.png";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";

import { Modal, ModalBody } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import moment from "moment/moment";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles/index";
import Org from "./Org/Org";
import ImageOnlyThumbnail from "./ImageOnlyThumbnail";
import {Link} from "react-router-dom";

class RequestReleaseItem extends Component {
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
            errorsSite: {},
            isLoading:false
        };

        this.actionSubmit = this.actionSubmit.bind(this);
        this.showPopUpInitiateAction = this.showPopUpInitiateAction.bind(this);
        this.getSites = this.getSites.bind(this);
        this.showSubmitSite = this.showSubmitSite.bind(this);
        this.getDetails = this.getDetails.bind(this);
    }

    getSites() {
        axios.get(baseUrl + "site").then(
            (response) => {
                let responseAll = response.data.data;

                this.setState({
                    sites: responseAll,
                });
            }
        ).catch(error => {

        });
    }

    showPopUpInitiateAction(event) {
        if(!event) return;

        this.setState({
            showPopUpInitiateAction: !this.state.showPopUpInitiateAction,
            initiateAction: event.currentTarget.dataset.action,
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
        // if ((fields["phone"])&&!this.phonenumber(fields["phone"])) {
        //
        //     formIsValid = false;
        //     errors["phone"] = "Invalid Phone Number!";
        // }

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
        this.setState({ site: e.target.value });
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
            site_id: this.state.site,
        };


        this.setState({
            isLoading:true
        })
        axios
            .post(`${baseUrl}release/stage`, data)
            .then((res) => {
                this.setState({
                    isLoading:false
                })
                this.getDetails();
                this.showPopUpInitiateAction();
                this.props.refreshPageCallback();
            })
            .catch((error) => {
                this.setState({
                    isLoading:false
                })
            });
    }

    componentDidMount() {
        // this.getSites();
    }

    getDetails() {
        axios
            .get(baseUrl + "release/" + this.state.item.Release._key)
            .then(
                (response) => {
                    let responseAll = response.data.data;
                    this.setState({
                        item: responseAll.data,
                    });
                }
            )
            .catch(error => {});
    }

    render() {
        const classes = withStyles();

        return (
            <>
                {this.state.item && (
                    <>
                        <div key={this.state.item.Release._id} id={this.state.item.Release._id} className="row  justify-content-center mt-4 mb-4 ">
                            <div className={"col-2 "}>
                                {this.state.item.product.artifacts.length > 0 ? (
                                    <ImageOnlyThumbnail
                                        images={this.state.item.product.artifacts}
                                    />
                                ) : (
                                    <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                                )}
                            </div>
                            <div className={"col-5 pl-2  content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">
                                    <Link to={`/p/${this.state.item.product.product._key}`}>{this.state.item.product.product.name}</Link>
                                </p>

                                <div style={{ margin: "0" }}>
                                    <Org orgId={this.state.item.originator._id} />
                                    <span>→</span>
                                    <Org orgId={this.state.item.responder._id} />
                                </div>

                                <p style={{ fontSize: "16px" }} className=" mb-1 text-caps">
                                    {this.state.item.Release.stage}
                                </p>

                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    {this.state.item.product.product.purpose}
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    <span className="mr-1">{this.state.item.product.product.category},</span>
                                    <span className="mr-1">{this.state.item.product.product.type},</span>
                                    <span>{this.state.item.product.product.state}</span>,
                                    <span> {this.state.item.product.product.volume}</span>
                                    <span>{this.state.item.product.product.units}</span>
                                </p>


                                {this.state.item.search_ids && (
                                    <p
                                        style={{ fontSize: "16px" }}
                                        className="text-mute mb-1 bottom-tag-p">
                                        {this.state.item.search_ids.length} Searches
                                    </p>
                                )}
                                {this.state.item.sub_product_ids &&
                                    this.state.item.sub_product_ids.length > 0 && (
                                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                            {this.state.item.sub_product_ids.length} Sub Products
                                        </p>
                                    )}
                            </div>
                            <div style={{ textAlign: "right" }} className={"col-5"}>
                                <p className={"text-gray-light small"}>
                                    {moment(this.state.item.product.product._ts_epoch_ms).format(
                                        "DD MMM YYYY"
                                    )}
                                </p>

                                <div className="row  pb-4 pb-4 mb-4">
                                    <div className="col-12 text-right pb-2 pt-2">
                                        {this.state.item.next_action.is_mine &&
                                            this.state.item.next_action.possible_actions.map(
                                                (actionName, index) => (
                                                    <>
                                                        <button
                                                            data-id={this.state.item.Release_key}
                                                            data-action={actionName}
                                                            onClick={this.showPopUpInitiateAction}
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

                        <Modal
                            className={"loop-popup"}
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            show={this.state.showPopUpInitiateAction}
                            onHide={this.showPopUpInitiateAction}
                            animation={false}>
                            <ModalBody>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-10 text-center"}>
                                        <p
                                            style={{ textTransform: "uppercase" }}
                                            className={"text-bold"}>
                                            {this.state.initiateAction==="cancelled"?"Cancel":this.state.initiateAction}
                                        </p>
                                        <p>
                                            Are you sure you want to <span className={"text-lowercase"}>{this.state.initiateAction==="cancelled"?"cancel":this.state.initiateAction}?</span>

                                        </p>
                                    </div>
                                </div>

                                {this.state.initiateAction === "complete" && (
                                    <>
                                        <FormControl
                                            variant="outlined"
                                            className={classes.formControl}>
                                            <div
                                                className={"custom-label text-bold text-blue mb-3"}>
                                                Select the location of product
                                            </div>

                                            <Select
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
                                            </Select>
                                        </FormControl>

                                        <p className="text-left" style={{ margin: "10px 0" }}>
                                            Don’t see it on here?
                                            <span
                                                onClick={this.showSubmitSite}
                                                className="green-text forgot-password-link text-mute small ml-1">
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
                                                    style={{ textAlign: "center" }}>
                                                    <button

                                                        disabled={this.state.isLoading?true:false}
                                                        onClick={this.actionSubmit}
                                                        style={{ minWidth: "120px" }}
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
                                                        onClick={this.showPopUpInitiateAction}
                                                        className={
                                                            "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                        }>
                                                        Cancel
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.state.showSubmitSite && (
                                    <div className={"row justify-content-center p-2"}>
                                        <div className="col-md-12 col-sm-12 col-xs-12 ">
                                            <div
                                                className={"custom-label text-bold text-blue mb-1"}>
                                                Add New Site
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12 ">
                                            <div className={"row"}>
                                                <div className={"col-12"}>
                                                    <form onSubmit={this.handleSubmitSite}>
                                                        <div className="row no-gutters justify-content-center ">
                                                            <div className="col-12 mt-4">
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    label=" Name"
                                                                    variant="outlined"
                                                                    fullWidth={true}
                                                                    name={"name"}
                                                                    onChange={this.handleChangeSite.bind(
                                                                        this,
                                                                        "name"
                                                                    )}
                                                                />

                                                                {this.state.errorsSite["name"] && (
                                                                    <span
                                                                        className={
                                                                            "text-mute small"
                                                                        }>
                                                                        <span style={{color: "red"}}>*</span>
                                                                        {
                                                                            this.state.errorsSite[
                                                                                "name"
                                                                            ]
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="col-12 mt-4">
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    label="Contact"
                                                                    variant="outlined"
                                                                    fullWidth={true}
                                                                    name={"contact"}
                                                                    onChange={this.handleChangeSite.bind(
                                                                        this,
                                                                        "contact"
                                                                    )}
                                                                />

                                                                {this.state.errorsSite[
                                                                    "contact"
                                                                ] && (
                                                                    <span
                                                                        className={
                                                                            "text-mute small"
                                                                        }>
                                                                        <span style={{color: "red",}}>*</span>
                                                                        {
                                                                            this.state.errorsSite[
                                                                                "contact"
                                                                            ]
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="col-12 mt-4">
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    label="Address"
                                                                    variant="outlined"
                                                                    fullWidth={true}
                                                                    name={"address"}
                                                                    type={"text"}
                                                                    onChange={this.handleChangeSite.bind(
                                                                        this,
                                                                        "address"
                                                                    )}
                                                                />

                                                                {this.state.errorsSite[
                                                                    "address"
                                                                ] && (
                                                                    <span
                                                                        className={
                                                                            "text-mute small"
                                                                        }>
                                                                        <span style={{color: "red",}}>*</span>
                                                                        {
                                                                            this.state.errorsSite[
                                                                                "address"
                                                                            ]
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="col-12 mt-4">
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    type={"number"}
                                                                    name={"phone"}
                                                                    onChange={this.handleChangeSite.bind(
                                                                        this,
                                                                        "phone"
                                                                    )}
                                                                    label="Phone"
                                                                    variant="outlined"
                                                                    fullWidth={true}
                                                                />

                                                                {this.state.errorsSite["phone"] && (
                                                                    <span
                                                                        className={
                                                                            "text-mute small"
                                                                        }>
                                                                        <span style={{color: "red"}}>*</span>
                                                                        {
                                                                            this.state.errorsSite[
                                                                                "phone"
                                                                            ]
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="col-12 mt-4">
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    label="Email"
                                                                    variant="outlined"
                                                                    fullWidth={true}
                                                                    name={"email"}
                                                                    type={"email"}
                                                                    onChange={this.handleChangeSite.bind(
                                                                        this,
                                                                        "email"
                                                                    )}
                                                                />

                                                                {this.state.errorsSite["email"] && (
                                                                    <span
                                                                        className={
                                                                            "text-mute small"
                                                                        }>
                                                                        <span style={{color: "red"}}>*</span>
                                                                        {
                                                                            this.state.errorsSite[
                                                                                "email"
                                                                            ]
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="col-12 mt-4">
                                                                <TextField
                                                                    onChange={this.handleChangeSite.bind(
                                                                        this,
                                                                        "others"
                                                                    )}
                                                                    name={"others"}
                                                                    id="outlined-basic"
                                                                    label="Others"
                                                                    variant="outlined"
                                                                    fullWidth={true}
                                                                    type={"others"}
                                                                />
                                                            </div>

                                                            <div className="col-12 mt-4">
                                                                <button
                                                                    type="submit"
                                                                    className={
                                                                        "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                                    }>
                                                                    Add Site
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                        </Modal>
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
export default connect(mapStateToProps, mapDispachToProps)(RequestReleaseItem);