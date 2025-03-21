import React, {Component} from "react";
import PlaceholderImg from "../../img/place-holder-lc.png";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import moment from "moment/moment";
import {withStyles} from "@mui/styles/index";
import ImageOnlyThumbnail from "../ImageOnlyThumbnail";
import {Link} from "react-router-dom";
import {capitalize, fetchErrorMessage} from "../../Util/GlobalFunctions";
import GlobalDialog from "../RightBar/GlobalDialog";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import OrgComponent from "../Org/OrgComponent";

class RequestServiceAgentItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers: [],
            images: [],
            showSubmitSite: false,
            errorServiceAgent: false,
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
            isLoading:false,
            product:null,
            artifacts:[]
        };

        this.actionSubmit = this.actionSubmit.bind(this);
        this.togglePopUpInitiateAction = this.togglePopUpInitiateAction.bind(this);
        this.getSites = this.getSites.bind(this);
        this.showSubmitSite = this.showSubmitSite.bind(this);
        this.getDetails = this.getDetails.bind(this);
    }

    getSites() {
        axios
            .get(baseUrl + "site", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        sites: responseAll,
                    });
                },
                (error) => {}
            );
    }

    togglePopUpInitiateAction(event) {
        this.setState({
            showPopUpInitiateAction: !this.state.showPopUpInitiateAction,
        });

        this.setState({
            initiateAction: event?event.currentTarget.dataset.action:null,
        });
    }

    showSubmitSite() {
        this.setState({
            errorServiceAgent: null,
        });

        this.setState({
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
        if (fields["phone"] && !this.phonenumber(fields["phone"])) {
            formIsValid = false;
            errors["phone"] = "Invalid Phone Number!";
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
        this.setState({ site: e.target.value });
    }

    handleSubmitSite = (event) => {
        this.setState({
            errorServiceAgent: null,
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

            axios
                .put(
                    baseUrl + "site",

                    {
                        site: {
                            name: name,
                            email: email,
                            contact: contact,
                            address: address,
                            phone: phone,
                            others: others,
                        },
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
                    }
                )
                .then((res) => {
                    // this.toggleSite()
                    this.getSites();

                    this.showSubmitSite();

                    this.setState({
                        siteSelected: res.data.data,
                    });
                })
                .catch((error) => {});
        }
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

        const site = data.get("site");

        axios
            .post(
                baseUrl + "service-agent",

                {
                    site_id: site,
                    product_id: this.props.item.product._key,
                }
            )
            .then((res) => {
                // this.toggleSite()
                // this.showServiceAgent()

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

    actionSubmit() {
        var data = {
            id: this.state.item.Release._key,
            new_stage: this.state.initiateAction,
            site_id: this.state.site,
        };


        this.setState({
            isLoading:true
        })
        axios
            .post(baseUrl + "service-agent/stage", data)
            .then((res) => {
                this.setState({
                    isLoading:false
                })

                this.togglePopUpInitiateAction();
                this.props.refresh()
            })
            .catch((error) => {


                this.setState({
                    isLoading:false
                })
                this.togglePopUpInitiateAction();
                this.props.showSnackbar({show:true,severity:"error",message:fetchErrorMessage(error)})

                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
            });
    }

    componentDidMount() {
        this.loadCurrentProductSync()
        this.getArtifactsForProduct()
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

    loadCurrentProductSync = () => {
        axios
            .get(baseUrl + "product/" + this.props.item.product_id.replace("Product/",""))
            .then(
                (response) => {
                    let responseAll = response.data;
                    this.setState({
                        product:responseAll.data.product
                    })
                },
                (error) => {

                }
            );

    };

    getDetails() {
        axios
            .get(baseUrl + "service-agent/" + this.state.item.Release._key, {
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
                },
                (error) => {}
            );
    }

    render() {
        const classes = withStyles();

        return (
            <>
                {this.state.product && (
                    <>
                        <div  className="row  justify-content-center bg-white no-gutters rad-8 p-3 mb-4 ">
                            <div className={"col-md-2 col-xs-12 col-sm-12 "}>
                                {this.state.artifacts.length > 0 ? (
                                    <ImageOnlyThumbnail images={this.state.artifacts} />
                                ) : (
                                    <img className={"img-fluid img-list"} src={PlaceholderImg} alt="" />
                                )}
                            </div>
                            <div className={"col-md-5 col-xs-12 position-relative col-sm-12 pl-3-desktop  content-box-listing"}>
                                <p  className="title-bold mb-1">
                                    {this.state.product &&  <Link to={`/p/${this.state.product._key}`}>{this.state.product.name}</Link>}
                                </p>
                                {/*<div style={{ margin: "0" }}>*/}
                                {/*    <OrgComponent orgId={this.state.item.originator._id} />*/}
                                {/*    <span>→</span>*/}
                                {/*    <OrgComponent orgId={this.state.item.responder._id} />*/}
                                {/*</div>*/}


                                <p style={{ fontSize: "16px" }} className="text-gray-light mt-1 mb-1  text-capitalize">
                                    Stage: <span className={"text-blue"}>{this.state.item.Release.stage}</span>
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-gray-light mt-1 mb-1 text-capitalize">
                                    Requested By: <OrgComponent orgId={this.state.item.originator_id.replace("Org/","")}/>
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-gray-light mt-1 mb-1  text-capitalize">
                                    Purpose: <span className={"text-blue"}> {this.state.product&&this.state.product.purpose}</span>
                                </p>


                                {this.state.product&&  <div className={"text-gray-light mt-1 width-90 "}>
                                    Category:
                                    <span

                                        className="ms-1 text-capitlize mb-1 cat-box text-left p-1">
                                                            <span className="text-capitlize">
                                                                {capitalize(this.state.product.category)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className=" text-capitlize">
                                                                {capitalize(this.state.product.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className="  text-capitlize">
                                                                {capitalize(this.state.product.state)}
                                                            </span>
                                    </span>
                                </div>}
                                <p className={"text-gray-light date-bottom"}>
                                    {moment(this.state.item.Release._ts_epoch_ms).format(
                                        "DD MMM YYYY"
                                    )}
                                </p>

                            </div>
                            <div style={{ textAlign: "right" }} className={"col-md-5 col-xs-12 col-sm-12"}>


                                <div className="row  pb-4 pb-4 mb-4">
                                    <div className="col-12 text-right pb-2 pt-2">
                                        {this.state.item.next_action.is_mine &&
                                            this.state.item.next_action.possible_actions.map(
                                                (actionName, index) => (
                                                    <React.Fragment key={index}>
                                                        <button
                                                            data-id={this.state.item.Release}
                                                            data-action={actionName}
                                                            onClick={this.togglePopUpInitiateAction}
                                                            type="button"
                                                            className={
                                                                actionName === "accepted"
                                                                    ? "shadow-sm me-2 btn btn-link  mt-2 mb-2 green-btn-border-auto"
                                                                    : actionName === "cancelled"
                                                                    ? "shadow-sm me-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "rejected"
                                                                    ? "shadow-sm me-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "declined"
                                                                    ? "shadow-sm me-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "progress"
                                                                    ? "shadow-sm me-2 btn btn-link  mt-2 mb-2 green-btn-border-auto"
                                                                    : actionName === "complete"
                                                                    ? "shadow-sm me-2 btn btn-link  mt-2 mb-2 green-btn-border-auto"
                                                                    : "shadow-sm me-2 btn btn-link  mt-2 mb-2 green-btn-border-auto"
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
                                                        {/*}*/}
                                                    </ React.Fragment>
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
                                    <div className={"col-12 mb-2 text-left"}>

                                        <p>
                                            Are you sure you want to <span className={"text-lowercase"}>{this.state.initiateAction==="cancelled"?"cancel":this.state.initiateAction}?</span>
                                        </p>
                                    </div>

                                    <div className={"col-12 text-center mt-2"}>
                                        <div className={"row justify-content-center"}>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <GreenButton

                                                    disabled={this.state.isLoading?true:false}
                                                    onClick={this.actionSubmit}
                                                    title={"Yes"}

                                                    type={"submit"}>

                                                </GreenButton>
                                            </div>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <BlueBorderButton
                                                    onClick={this.togglePopUpInitiateAction}
                                                   title={"Cancel"}

                                                >

                                                </BlueBorderButton>
                                            </div>
                                        </div>
                                    </div>
                           </>
                        </GlobalDialog>
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
        // abondonCartthis.state.item : state.abondonCartthis.state.item,
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
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(RequestServiceAgentItem);
