import React, {Component} from "react";
import axios from "axios/index";
import {baseUrl} from "../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../store/actions/actions";
import {Modal, ModalBody} from "react-bootstrap";
import TextField from "@mui/material/TextField";
import {Link} from "react-router-dom";
import GreenButton from "./FormsUI/Buttons/GreenButton";
import BlueBorderButton from "./FormsUI/Buttons/BlueBorderButton";
import {getActionName} from "../Util/GlobalFunctions";
import GrayBorderBtn from "./FormsUI/Buttons/GrayBorderBtn";

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
            price:null
        };

        this.acceptMatch = this.acceptMatch.bind(this);
        this.rejectMatch = this.rejectMatch.bind(this);

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

    showPopUp=(showListedPrice)=> {

        this.setState({
            showPopUp: !this.state.showPopUp,
            price:showListedPrice?this.props.item.listing.listing.price:null
        });

    }

    getOffer() {
        axios
            .get(baseUrl + "offer/match/" + this.props.item.match._key,)
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

        this.setState({
            loading:true
        })
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
                this.setState({
                    loading:false
                })
            })
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })

                this.setState({
                    loading:false
                })
            });
    }

    makeOfferMatchNew = (event) => {

        event.preventDefault();


        const data = new FormData(event.target);

        const price = data.get("price");

        this.setState({
            loading:true
        })

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
                this.setState({
                    loading:false
                })
            })
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })

                this.setState({
                    loading:false
                })
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

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props) {
            this.getOffer();
        }
    }
    componentDidMount() {


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
            <div className="col-12 ">

            <div className="row no-gutters justify-content-center mt-4 ">
                <div style={{ textAlign: "center" }} className={"col-12"}>
                    {!this.props.hideStage && <p>
                        Match Stage: <span className={"text-blue img-list text-bold text-caps"}>
                            {this.props.item.match.stage}
                        </span>
                    </p>}
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
                <div style={{ textAlign: "right" }} className={"col-12 d-flex mb-4"}>
                    {(this.props.item.match.stage === "accepted" ||
                        this.props.item.match.stage === "offered") &&
                    this.props.item.listing.org._id !== this.props.userDetail.orgId && (
                        // <div className={"row justify-content-center"}>
                            <span className="me-2 ">
                                <GreenButton
                                    onClick={()=>this.props.makeOffer(this.props.item.match._key,true,"Accept Listed Price")}
                                    title={"Accept Seller's Offer"}
                                    // onClick={()=> this.showPopUp(true)}
                                    type="button"
                                   >

                                </GreenButton>
                             </span>
                        // </div>
                    )}

                    {(this.props.item.match.stage === "accepted" ||
                        this.props.item.match.stage === "offered") &&
                        this.props.item.listing.org._id !== this.props.userDetail.orgId && (

                                    <BlueBorderButton
                                        onClick={()=>this.props.makeOffer(this.props.item.match._key,false,"Make an offer")}
                                        type="button"
                                        title={"Make an Offer"}
                                        >

                                    </BlueBorderButton>
                            //     </div>
                            // </div>
                        )}
                </div>



                {/*{this.props.item.match.stage === "offered" && (*/}
                    <>
                    {this.state.offers&& this.state.offers.length>0 &&    <>
                    <div className="col-1 ">

                    </div>
                    <div className="col-3 text-bold">
                        Offer

                    </div>
                        <div className="text-bold col-6 ">
                            Actions
                        </div>
                        <div className="text-bold col-2 ">
                            Stage
                        </div>
                            </>}

                        {this.state.offers.map((item, index) => (
                            <div
                                key={index}
                                className={

                                        "col-12"
                                }>
                                <hr/>
                                <div className={"row no-gutters text-left mb-2 mt-2"}>
                                    <div className="col-1 ">
                                        <span className={"text-blue text-bold"}>{index+1}.</span>
                                    </div>
                                    <div className="col-3 ">

                                        <span

                                            className="  mb-1 list-title  text-blue">
                                             GBP {item.offer.amount.value}
                                        </span>
                                    </div>
                                    <div className="col-6 ">

                                        {item.next_action.is_mine && (
                                            <>
                                                {item.next_action.possible_actions.map(
                                                    (actionName, index) => (
                                                        <React.Fragment key={index}>
                                                           <span className={"me-1"}>
                                                               <GrayBorderBtn
                                                                   loading={this.state.loading}
                                                                   disabled={this.state.loading}
                                                                title={getActionName(actionName)}
                                                                data-id={item.offer._key}
                                                                data-action={actionName}
                                                                onClick={()=>this.props.actionOffer(item.offer._key,actionName)}
                                                                type="button"
                                                            >
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
                                                            </GrayBorderBtn>
                                                               </span>
                                                        </React.Fragment>
                                                    )
                                                )}
                                            </>
                                        )}

                                    </div>
                                    <div className="col-2 ">
                                        <span className={"text-caps"}>{item.offer.stage}</span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </>


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
                                    {this.state.action === "accepted"
                                        ? "Accept"
                                        : this.state.action === "cancelled"
                                        ? "Cancel"
                                        : this.state.action === "declined"
                                        ? "Decline"
                                        : this.state.action === "counter"
                                        ? "Counter"
                                        : this.state.action === "widthdraw"
                                        ? "Widthdraw"
                                        : ""}
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
                                            <GreenButton
                                                loading={this.state.loading}
                                                disabled={this.state.loading}
                                                title="Submit"
                                                type={"submit"}>

                                            </GreenButton>
                                        </div>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <p
                                                onClick={this.editPopUp}
                                                className={
                                                    "shadow-sm me-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
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
                    onHide={()=> this.showPopUp(true)}

                    animation={false}>
                    <ModalBody>
                        {/*<div className={"row justify-content-center"}>*/}
                        {/*<div className={"col-4 text-center"}>*/}
                        {/*<img className={"ring-pop-pup"} src={GrayLoop} alt=""/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold"}>{this.state.price?"Accept Seller's Offer":"Make an offer"}</p>

                            </div>
                        </div>


                        <form onSubmit={()=>this.makeOfferMatchNew()}>
                            <div className={"row justify-content-center"}>
                                <div className={"col-12 text-center"}>
                                    <TextField
                                        className={this.state.price?"d-none":""}
                                        id="outlined-basic"
                                        label="Offer Price"
                                        variant="outlined"
                                        fullWidth={true}
                                        name={"price"}
                                        type={"number"}
                                        value={this.state.price&&this.state.price.value}
                                    />
                                </div>
                                <div className={"col-12 text-center mt-2"}>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <GreenButton
                                               title={"Submit"}
                                                type={"submit"}
                                               loading={this.state.loading}
                                               disabled={this.state.loading}
                                            >

                                            </GreenButton>
                                        </div>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <BlueBorderButton
                                                title={"Cancel"}
                                                onClick={this.showPopUp}
                                             type={"button"}
                                            >

                                            </BlueBorderButton>
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
