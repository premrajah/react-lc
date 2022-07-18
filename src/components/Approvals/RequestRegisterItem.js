import React, { Component } from "react";
import PlaceholderImg from "../../img/place-holder-lc.png";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import { Modal, ModalBody } from "react-bootstrap";
import moment from "moment/moment";
import { withStyles } from "@mui/styles/index";
import Org from "../Org/Org";
import ImageOnlyThumbnail from "../ImageOnlyThumbnail";
import {Link} from "react-router-dom";
import {capitalize, fetchErrorMessage} from "../../Util/GlobalFunctions";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import GlobalDialog from "../RightBar/GlobalDialog";

class RequestRegisterItem extends Component {
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
            isLoading:false,
            product:null,
            artifacts:[]
        };

        this.actionSubmit = this.actionSubmit.bind(this);
        this.togglePopUpInitiateAction = this.togglePopUpInitiateAction.bind(this);
        this.getDetails = this.getDetails.bind(this);
    }



    togglePopUpInitiateAction(event) {
        this.setState({
            showPopUpInitiateAction: !this.state.showPopUpInitiateAction,
        });

        this.setState({
            initiateAction: event?event.currentTarget.dataset.action:null,
        });
    }




    handleChangeSite(field, e) {
        let fields = this.state.fieldsSite;
        fields[field] = e.target.value;
        this.setState({ fields: fields });
    }

    handleChange(field, e) {
        this.setState({ site: e.target.value });
    }


    submitRegisterProduct = (event) => {
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
                baseUrl + "register",

                {
                    site_id: site,
                    product_id: this.props.item.product._key,
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
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

        this.setState({
            isLoading:true
        })


        var data = {
            id: this.state.item.registration._key,
            new_stage: this.state.initiateAction,
        };

        axios
            .post(
                baseUrl + "register/stage",
                data
            )
            .then((res) => {
                this.setState({
                    isLoading:false
                })

                this.props.refresh()
                this.togglePopUpInitiateAction();
            })
            .catch((error) => {

                this.setState({
                    isLoading:false
                })
                this.togglePopUpInitiateAction();
                this.props.showSnackbar({show:true,severity:"error",message:fetchErrorMessage(error)})

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
            .get(baseUrl + "register/" + this.state.item.registration._key, )
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
                        <div className="row no-gutters bg-white rad-8 p-3 mb-4 ">
                            <div className={"col-md-2 col-xs-12 col-sm-12 "}>
                                {this.state.artifacts.length > 0 ? (
                                    <ImageOnlyThumbnail images={this.state.artifacts} />
                                ) : (
                                    <img className={"img-fluid img-list"} src={PlaceholderImg} alt="" />
                                )}
                            </div>
                            <div className={"col-md-5 col-xs-12 col-sm-12  pl-3-desktop  content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className="title-bold mb-1 text-capitlize">
                                    <Link to={`/p/${this.state.item.product_id.replace("Product/","")}`}>
                                        {this.state.product&&this.state.product.name}
                                    </Link>
                                </p>



                                <p style={{ fontSize: "16px" }} className="text-gray-light mt-2  text-capitalize">
                                    Stage: <span className={"text-blue"}>{this.state.item.registration.stage}</span>
                                </p>

                                <p style={{ fontSize: "16px" }} className="text-gray-light mt-2  text-capitalize">
                                    Purpose: <span className={"text-blue"}> {this.state.product&&this.state.product.purpose}</span>
                                </p>


                                {this.state.product&&  <div className={"text-gray-light mt-2 width-75"}>
                                    Category:
                                    <span

                                        className="ml-1 text-capitlize mb-1 cat-box text-left p-1">
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
                                    {moment(this.state.item._ts_epoch_ms).format("DD MMM YYYY")}
                                </p>

                            </div>
                            <div style={{ textAlign: "right" }} className={"col-md-5 col-xs-12 col-sm-12 "}>


                                        {this.state.item.next_action.is_mine &&
                                            this.state.item.next_action.possible_actions.map(
                                                (actionName, index) => (
                                                    <>
                                                        <button

                                                            data-id={
                                                                this.state.item.registration_key
                                                            }
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
                                                        {/*}*/}
                                                    </>
                                                )
                                            )}

                            </div>
                        </div>

                        {/*<Modal*/}
                        {/*    className={"loop-popup"}*/}
                        {/*    aria-labelledby="contained-modal-title-vcenter"*/}
                        {/*    centered*/}
                        {/*    show={this.state.showPopUpInitiateAction}*/}
                        {/*    onHide={this.togglePopUpInitiateAction}*/}
                        {/*    animation={false}>*/}

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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(RequestRegisterItem);