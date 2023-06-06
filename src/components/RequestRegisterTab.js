import React, { Component } from "react";
import PlaceholderImg from "../img/place-holder-lc.png";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";
import { Modal, ModalBody } from "react-bootstrap";
import moment from "moment/moment";
import { withStyles } from "@mui/styles/index";
import ImageOnlyThumbnail from "./ImageOnlyThumbnail";

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
        };

        this.fetchRegisterRequest = this.fetchRegisterRequest.bind(this);
    }

    fetchRegisterRequest() {
        axios.get(baseUrl + "register").then(
            (response) => {
                var responseAll = response.data.data;

                this.setState({
                    registerRequests: responseAll,
                });
            },
            (error) => {}
        );
    }

    componentDidMount() {
        this.fetchRegisterRequest();
    }

    render() {
        const classes = withStyles();

        return (
            <>
                {this.state.item && (
                    <>
                        <div className="row no-gutters justify-content-center mt-4 mb-4 ">
                            <div className={"col-2 "}>
                                {this.state.images.length > 0 ? (
                                    <ImageOnlyThumbnail images={this.state.images} />
                                ) : (
                                    <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                                )}
                            </div>
                            <div className={"col-5 pl-2  content-box-listing"}>
                                <p style={{ fontSize: "18px" }} className=" mb-1">
                                    {this.state.item.product.product.name}
                                </p>
                                <p style={{ fontSize: "16px" }} className=" mb-1 text-caps">
                                    {this.state.item.registration.stage}
                                </p>

                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    {this.state.item.product.product.purpose}
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    {this.state.item.product.product.category},}
                                    {this.state.item.product.product.type},}
                                    {this.state.item.product.product.state}}
                                </p>
                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                    }
                                    {this.state.item.product.product.volume}}
                                    {this.state.item.product.product.units}
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
                                    }
                                    {moment(this.state.item.product.product._ts_epoch_ms).format(
                                        "DD MMM YYYY"
                                    )}}
                                </p>

                                <div className="row  pb-4 pb-4 mb-4">
                                    <div className="col-12 text-right pb-2 pt-2">
                                        {this.state.item.next_action.is_mine &&
                                            this.state.item.next_action.possible_actions.map(
                                                (actionName, index) => (
                                                    <React.Fragment key={index}>
                                                        <button
                                                            data-id={
                                                                this.state.item.registration_key
                                                            }
                                                            data-action={actionName}
                                                            onClick={this.showPopUpInitiateAction}
                                                            type="button"
                                                            className={
                                                                actionName === "accepted"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                    : actionName === "cancelled"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "rejected"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "declined"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                    : actionName === "progress"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                    : actionName === "complete"
                                                                    ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                    : "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
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
                                            }
                                            {this.state.initiateAction}
                                        </p>
                                        <p>
                                            Are you sure you want to {this.state.initiateAction} ?}
                                        </p>
                                    </div>
                                </div>

                                <div className={"row justify-content-center"}>
                                    <div className={"col-12 text-center mt-2"}>
                                        <div className={"row justify-content-center"}>
                                            <div
                                                className={"col-6"}
                                                style={{ textAlign: "center" }}>
                                                <button
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
export default connect(mapStateToProps, mapDispachToProps)(RequestRegisterItem);
