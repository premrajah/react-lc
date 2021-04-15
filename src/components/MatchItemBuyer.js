import React, { Component } from "react";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";
import { Modal, ModalBody } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";

class MatchItemBuyer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers: [],
            editPopUp: false,
            editOfferKey: null,
            action: null,
            cycle: null,
        };

        this.acceptMatch = this.acceptMatch.bind(this);
        this.rejectMatch = this.rejectMatch.bind(this);
        this.makeOfferMatch = this.makeOfferMatch.bind(this);
        this.showPopUp = this.showPopUp.bind(this);
        this.editPopUp = this.editPopUp.bind(this);

        this.getOffer = this.getOffer.bind(this);
        this.actionOffer = this.actionOffer.bind(this);
        this.getCycleId = this.getCycleId.bind(this);
    }

    getCycleId() {
        axios
            .get(baseUrl + "cycle/match/" + this.props.item.match._key, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data;

                    this.setState({
                        cycle: responseAll.data,
                    });
                },
                (error) => {}
            );
    }

    editPopUp(event) {
        this.setState({
            editPopUp: !this.state.editPopUp,
        });

        this.setState({
            editOfferKey: event.currentTarget.dataset.id,
            action: event.currentTarget.dataset.action,
        });
    }

    showPopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp,
        });
    }

    getOffer() {
        axios
            .get(baseUrl + "offer/match/" + this.props.item.match._key, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data;

                    this.setState({
                        offers: responseAll.data,
                    });
                },
                (error) => {}
            );
    }

    acceptMatch() {
        axios
            .post(
                baseUrl + "match/stage/accept",
                {
                    match_id: this.props.item.match._key,
                    note: "Accepted",
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: true,
                });
            })
            .catch((error) => {});
    }

    acceptOffer(event) {
        axios
            .post(
                baseUrl + "offer/stage",
                {
                    offer_id: event.currentTarget.dataset.id,
                    new_stage: "accepted",
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: true,
                });
            })
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
            });
    }

    actionOffer(event) {
        event.preventDefault();

        const form = event.currentTarget;

        const formData = new FormData(event.target);

        const price = formData.get("price");

        var data;

        if (this.state.action !== "counter") {
            data = {
                offer_id: this.state.editOfferKey,
                new_stage: this.state.action,
            };
        } else {
            data = {
                offer_id: this.state.editOfferKey,
                new_stage: "counter",
                new_price: {
                    value: price,
                    currency: "gbp",
                },
            };
        }

        axios
            .post(
                baseUrl + "offer/stage",
                data,

                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    editPopUp: false,
                });
            })
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
            });
    }

    makeOfferMatch = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = new FormData(event.target);

        const price = data.get("price");

        axios
            .put(
                baseUrl + "offer",
                {
                    match_id: this.props.item.match._key,

                    offer: {
                        amount: {
                            value: price,
                            currency: "gbp",
                        },
                    },
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: false,
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

    counterOfferMatch = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = new FormData(event.target);

        const price = data.get("price");

        axios
            .post(
                baseUrl + "offer/stage",
                {
                    offer_id: this.state.editOfferKey,
                    new_stage: "counter",
                    new_price: {
                        value: price,
                        currency: "gbp",
                    },
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    editPopUp: false,
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

    actionMatch = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = new FormData(event.target);

        const price = data.get("price");

        axios
            .post(
                baseUrl + "offer/stage",
                {
                    offer_id: this.state.editOfferKey,
                    new_stage: "counter",
                    new_price: {
                        value: price,
                        currency: "gbp",
                    },
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    editPopUp: false,
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

    editOfferMatch = (event) => {
        event.preventDefault();

        const id = event.currentTarget.dataset.id;

        const data = new FormData(event.target);

        const price = data.get("price");

        axios
            .put(
                baseUrl + "offer",
                {
                    offer_id: id,
                    new_stage: "counter",
                    new_price: {
                        value: 789.0,
                        currency: "gbp",
                    },
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUp: false,
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

    rejectMatch() {
        axios
            .post(
                baseUrl + "match/stage/decline",
                {
                    match_id: this.props.item.match._key,
                    note: "Accepted",
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                // this.setState({
                //
                //     showPopUp: true
                // })
            })
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
            });
    }


    componentDidMount() {
        this.getOffer();

        this.interval = setInterval(() => {
            if (this.props.item.match.stage) {
                this.getCycleId();
            }

            this.getOffer();
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="row no-gutters justify-content-center mt-4 mb-4  border-light p-2">
                <div style={{ textAlign: "center" }} className={"col-12"}>
                    <p>
                        Match Stage:{" "}
                        <span className={"text-blue img-list text-bold text-caps"}>
                            {this.props.item.match.stage}
                        </span>
                    </p>

                    {this.state.cycle && (
                        <p>
                            <Link
                                className="btn blue-btn-border mb-2 mt-2 "
                                color="default"
                                to={"/cycle/" + this.state.cycle.cycle._key}>
                                View Cycle
                            </Link>
                        </p>
                    )}
                </div>
                <div style={{ textAlign: "right" }} className={"col-12"}>
                    {(this.props.item.match.stage === "accepted" ||
                        this.props.item.match.stage === "offered") &&
                        this.props.item.listing.org._id != this.props.userDetail.orgId && (
                            <div className={"row justify-content-center"}>
                                <div className="col-auto ">
                                    <button
                                        onClick={this.showPopUp}
                                        type="button"
                                        className=" mr-2 btn btn-link btn-green mt-2 mb-2 ">
                                        Make an Offer
                                    </button>
                                </div>
                            </div>
                        )}
                </div>

                {this.props.item.match.stage === "offered" && (
                    <>
                        {this.state.offers.map((item, index) => (
                            <div
                                className={
                                    this.state.offers.length > index + 1
                                        ? "col-12 listing-row-border "
                                        : "col-12"
                                }>
                                <div className={"row text-left mb-2 mt-2"}>
                                    <div className="col-12 ">
                                        Stage:{" "}
                                        <span className={"text-caps"}>{item.offer.stage}</span>
                                        <br />
                                        <span
                                            style={{ fontSize: "18px" }}
                                            className="  mb-1 list-title text-bold text-blue">
                                            Offer: GBP {item.offer.amount.value}
                                        </span>
                                        <br />
                                        {item.next_action.is_mine && (
                                            <>
                                                {item.next_action.possible_actions.map(
                                                    (actionName) => (
                                                        <>
                                                            <button
                                                                data-id={item.offer._key}
                                                                data-action={actionName}
                                                                onClick={this.editPopUp.bind(this)}
                                                                type="button"
                                                                className={
                                                                    actionName === "accepted"
                                                                        ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                        : actionName === "cancelled"
                                                                        ? "shadow-sm mr-2 btn btn-link  ml-1 mt-2 mb-2 orange-btn-border"
                                                                        : actionName === "rejected"
                                                                        ? "shadow-sm mr-2 btn btn-link mt-2 mb-2 orange-btn-border"
                                                                        : actionName === "declined"
                                                                        ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border"
                                                                        : actionName === "progress"
                                                                        ? "shadow-sm mr-2 btn btn-link mt-2 mb-2 green-btn-border"
                                                                        : actionName === "completed"
                                                                        ? "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                        : actionName === "counter"
                                                                        ? "shadow-sm mr-2 btn btn-link ml-1  mt-2 mb-2 blue-btn-border"
                                                                        : "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"
                                                                }>
                                                                {actionName === "accepted" &&
                                                                    "Accept"}
                                                                {actionName === "cancelled" &&
                                                                    "Cancel"}
                                                                {actionName === "rejected" &&
                                                                    "Reject"}
                                                                {actionName === "declined" &&
                                                                    "Decline"}
                                                                {actionName === "confirmed" &&
                                                                    "Confirm"}
                                                                {actionName === "progress" &&
                                                                    "Progress"}
                                                                {actionName === "completed" &&
                                                                    "Complete"}
                                                                {actionName === "withdrawn" &&
                                                                    "Withdraw"}
                                                                {actionName === "counter" &&
                                                                    "Counter Offer"}
                                                            </button>

                                                            {/*<button data-id={item.offer._key} data-action={actionItem} onClick={this.editPopUp.bind(this)} type="button"*/}
                                                            {/*className=" text-caps ml-3  btn btn-link green-border-btn mt-2 mb-2 btn-blue">*/}
                                                            {/*{actionItem}*/}
                                                            {/*</button>*/}
                                                        </>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {this.props.item.match.stage === "converted" && (
                    <div className={"row"}>
                        {this.state.offers.map((item, index) => (
                            <div className="col-12">
                                {index + 1}.{" "}
                                <span
                                    style={{ fontSize: "18px" }}
                                    className=" mb-1 list-title text-bold text-blue">
                                    GBP {item.offer.amount.value}
                                </span>
                                , Offer Stage:{" "}
                                <span className={"text-caps"}>{item.offer.stage}</span>
                            </div>
                        ))}
                    </div>
                )}

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.editPopUp}
                    onHide={this.editPopUp}
                    animation={false}>
                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold"}>
                                    {this.state.action == "accepted"
                                        ? "Accept"
                                        : this.state.action == "cancelled"
                                        ? "Cancel"
                                        : this.state.action == "declined"
                                        ? "Decline"
                                        : this.state.action == "counter"
                                        ? "Counter"
                                        : this.state.action == "widthdraw"
                                        ? "Widthdraw"
                                        : ""}{" "}
                                    Offer
                                </p>
                                <p>Are you sure you want to proceed ?</p>
                            </div>
                        </div>

                        <form onSubmit={this.actionOffer}>
                            <div className={"row justify-content-center"}>
                                {this.state.action === "counter" && (
                                    <div className={"col-12 text-center"}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Offer Price"
                                            variant="outlined"
                                            fullWidth={true}
                                            name={"price"}
                                            type={"number"}
                                        />
                                    </div>
                                )}
                                <div className={"col-12 text-center mt-2"}>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <button
                                                className={
                                                    "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                }
                                                type={"submit"}>
                                                Submit
                                            </button>
                                        </div>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <p
                                                onClick={this.editPopUp}
                                                className={
                                                    "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                }>
                                                Cancel
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showPopUp}
                    onHide={this.showPopUp}
                    animation={false}>
                    <ModalBody>
                        {/*<div className={"row justify-content-center"}>*/}
                        {/*<div className={"col-4 text-center"}>*/}
                        {/*<img className={"ring-pop-pup"} src={GrayLoop} alt=""/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold"}>Make an offer</p>
                                <p>Make an offer</p>
                            </div>
                        </div>

                        <form onSubmit={this.makeOfferMatch}>
                            <div className={"row justify-content-center"}>
                                <div className={"col-12 text-center"}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Offer Price"
                                        variant="outlined"
                                        fullWidth={true}
                                        name={"price"}
                                        type={"number"}
                                    />
                                </div>
                                <div className={"col-12 text-center mt-2"}>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <button
                                                className={
                                                    "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                                }
                                                type={"submit"}>
                                                Submit
                                            </button>
                                        </div>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <p
                                                onClick={this.showPopUp}
                                                className={
                                                    "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                                }>
                                                Cancel
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/*</>*/}

                        {/*}*/}
                    </ModalBody>
                </Modal>
            </div>
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
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(MatchItemBuyer);
