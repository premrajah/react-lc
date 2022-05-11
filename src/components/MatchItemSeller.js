import React, {Component} from "react";
import axios from "axios/index";
import {baseUrl} from "../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../store/actions/actions";
import TextField from "@mui/material/TextField";
import {Link} from "react-router-dom";
import OrgComponent from "./Org/OrgComponent";
import GreenButton from "./FormsUI/Buttons/GreenButton";
import BlueBorderButton from "./FormsUI/Buttons/BlueBorderButton";
import GlobalDialog from "./RightBar/GlobalDialog";
import GrayBorderBtn from "./FormsUI/Buttons/GrayBorderBtn";
import {getActionName, getTimeFormat} from "../Util/GlobalFunctions";
import GreenSmallBtn from "./FormsUI/Buttons/GreenSmallBtn";

class MatchItemSeller extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers: [],
            editPopUp: false,
            editOfferKey: null,
            showPopUpInitiateAction: false,
            action: null,
            initiateAction: null,
            initiateActionId: null,
            cycle: null,
            messages:[]
        };

        this.acceptMatch = this.acceptMatch.bind(this);
        this.rejectMatch = this.rejectMatch.bind(this);
        this.makeOfferMatch = this.makeOfferMatch.bind(this);
        this.showPopUp = this.showPopUp.bind(this);
        this.editPopUp = this.editPopUp.bind(this);
        this.actionOffer = this.actionOffer.bind(this);
        this.getOffer = this.getOffer.bind(this);
        this.showPopUpInitiateAction = this.showPopUpInitiateAction.bind(this);
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

    editPopUp(editOfferKey,action) {

        this.setState({
            editPopUp: !this.state.editPopUp,
        });

        this.setState({
            editOfferKey:editOfferKey,
            action: action,
        });
    }

    showPopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp,
        });
    }

    showPopUpInitiateAction(type) {
        this.setState({
            showPopUpInitiateAction: !this.state.showPopUpInitiateAction,
        });

        this.setState({
            initiateAction: type,
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
                    showPopUpInitiateAction: false,
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

            )
            .then((res) => {

                this.showPopUp()

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
            )
            .then((res) => {

                this.editPopUp()


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
                    note: "Reject Note",
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {
                this.setState({
                    showPopUpInitiateAction: false,
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


    getMatchMessage() {
        axios
            .get(baseUrl + "message/match/" + this.props.item.match._key, )
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        messages:responseAll
                    })

                },
                (error) => {}
            );
    }


    componentDidMount() {
        this.getOffer();
        this.getMatchMessage()

        this.interval = setInterval(() => {
            if (this.props.item.match.stage) {
                this.getCycleId();
            }

            this.getOffer();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="row no-gutters rad-8 bg-white mt-4 mb-4  p-4 border-light">

                <div className={"col-6  content-box-listing"}>
                    <p style={{ fontSize: "16px" }} className="title-bold ellipsis-end mb-1 width-75">
                        {this.props.item.search.search.name}
                    </p>
                    <p style={{ fontSize: "18px" }} className="text-bold mb-1">

                        <OrgComponent org={this.props.item.search.org} />
                    </p>
                    <p  className=" mb-1 text-gray-light">
                        Stage: <span className={"text-blue text-capitalize"}> {this.props.item.match.stage}</span>
                    </p>

                </div>
                <div style={{ textAlign: "right" }} className={"col-6"}>
                    {this.state.cycle && (
                        <p>
                            <Link
                                className="btn blue-btn-border mt-2 mb-2 "
                                color="default"
                                to={"/cycle/" + this.state.cycle.cycle._key}>
                                View Cycle
                            </Link>
                        </p>
                    )}

                    {this.props.item.match.stage === "created" &&
                        this.props.item.listing.org._id === this.props.userDetail.orgId && (
                            <div className={"row"}>
                                <div className="col-6">
                                    <GreenButton
                                        title={"Accept"}
                                        data-action="accept"
                                        onClick={()=>this.showPopUpInitiateAction("accept")}
                                        type="button"
                                    >

                                    </GreenButton>
                                </div>
                                <div className="col-6">
                                    <BlueBorderButton
                                        title={"Reject"}
                                        data-action="reject"
                                        onClick={()=>this.showPopUpInitiateAction("reject")}
                                        type="button"
                                    >

                                    </BlueBorderButton>
                                </div>
                            </div>
                        )}

                    {(this.props.item.match.stage === "accepted" ||
                        this.props.item.match.stage === "offered") &&
                        this.props.item.listing.org._id !== this.props.userDetail.orgId && (
                            <div className={"row"}>
                                <div className="col-auto">
                                    <button
                                        onClick={this.showPopUp}
                                        type="button"
                                        className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                        Make an Offer
                                    </button>
                                </div>
                            </div>
                        )}
                </div>

                <div style={{ textAlign: "left" }} className={"col-12"}>
                    {/*{this.props.item.match.stage === "offered" && (*/}

                        <>
                            {this.state.offers.length>0 &&
                                <>

                            <div className={"row  mt-4 "}>
                                <div className={"col-1 text-bold "}>
                                </div>
                                <div className={"col-3 text-bold "}>
                                    Offer
                                </div>
                                <div className={"col-6 text-bold "}>
                                    Actions
                                </div>
                                <div className={"col-2 text-bold "}>
                                    Stage
                                </div>
                            </div>

                                    </>
                            }

                            {this.state.offers.map((item, index) => (
                                <>
                                <hr/>
                        <div className={"row  "}>





                                    <div className={"col-1 text-bold "}>
                                        {index + 1}.
                                    </div>
                                    <div className={"col-3 text-blue "}>
                                        GBP {item.offer.amount.value}
                                    </div>


                                <div
                                    className={"col-6  "
                                    }>


                                    {item.next_action.is_mine && (
                                        <>
                                            {item.next_action.possible_actions.map((actionName) => (
                                                <span className={"mr-1"}>
                                                    <GrayBorderBtn
                                                        title={getActionName(actionName)}
                                                        data-id={item.offer._key}
                                                        data-action={actionName}
                                                        onClick={()=>this.editPopUp(item.offer._key,actionName)}
                                                        type="button"
                                                        // className={
                                                        //     actionName === "accepted"
                                                        //         ? "shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 green-btn-border"
                                                        //         : actionName === "cancelled"
                                                        //         ? "shadow-sm mr-2 btn btn-link  ml-3 mt-2 mb-2 orange-btn-border"
                                                        //         : actionName === "rejected"
                                                        //         ? "shadow-sm mr-2 btn btn-link ml-3 mt-2 mb-2 orange-btn-border"
                                                        //         : actionName === "declined"
                                                        //         ? "shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 orange-btn-border"
                                                        //         : actionName === "progress"
                                                        //         ? "shadow-sm mr-2 btn btn-link ml-3 mt-2 mb-2 green-btn-border"
                                                        //         : actionName === "completed"
                                                        //         ? "shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 green-btn-border"
                                                        //         : actionName === "counter"
                                                        //         ? "shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 blue-btn-border"
                                                        //         : "shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 green-btn-border"
                                                        // }
                                                    >
                                                        {/*{actionName === "accepted" && "Accept"}*/}
                                                        {/*{actionName === "cancelled" && "Cancel"}*/}
                                                        {/*{actionName === "rejected" && "Reject"}*/}
                                                        {/*{actionName === "declined" && "Decline"}*/}
                                                        {/*{actionName === "confirmed" && "Confirm"}*/}
                                                        {/*{actionName === "progress" && "Progress"}*/}
                                                        {/*{actionName === "completed" && "Complete"}*/}
                                                        {/*{actionName === "withdrawn" && "Withdraw"}*/}
                                                        {/*{actionName === "counter" &&*/}
                                                        {/*    "Counter Offer"}*/}
                                                    </GrayBorderBtn>

                                                    {/*<button data-id={item.offer._key} data-action={actionName} onClick={this.editPopUp.bind(this)}*/}
                                                    {/*type="button"*/}
                                                    {/*className=" ml-3  btn btn-link green-border-btn mt-2 mb-2 btn-blue">*/}

                                                    {/*{actionName}*/}
                                                    {/**/}

                                                    {/*</button>*/}
                                                </span>
                                            ))}
                                        </>
                                    )}
                                </div>

                                    <div className={"col-2 text-capitalize text-blue"}>
                                        {item.offer.stage}
                                    </div>




                        </div>
                                </>
                            ))}

                        </>
                    {/*)}*/}
                </div>



                    <div className="col-12">


                            {this.state.messages.filter(item=> item.message.type=="message").map((message)=>
                                <>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                        <span> Message: <span className="text-gray-light">{message.message.text}</span></span>
                                    </div>
                                    <div className="col-3 text-right">
                                        <span className="text-gray-light "><span className="mr-4"> {getTimeFormat(message.message._ts_epoch_ms)}</span></span>
                                    </div>
                                </div>
                                </>

                        )}



                    </div>

                        <GlobalDialog size={"xs"}
                                      hide={this.editPopUp}
                                      show={this.state.editPopUp}
                                      heading={`${getActionName(this.state.action)} Offer`} >
                            <>

                                <div className={"col-12"}>
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

                                                title={"Submit"}
                                                type={"submit"}>

                                            </GreenButton>
                                        </div>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <BlueBorderButton
                                                title={"Cancel"}
                                                onClick={this.editPopUp}

                                            >

                                            </BlueBorderButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                                </div>

                                </>
                        </GlobalDialog>



                        <GlobalDialog size={"xs"}
                                      hide={this.showPopUp}
                                      show={this.state.showPopUp}
                                      heading={`Match Request: ${this.state.initiateAction}`} >
                            <>
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

                        </>
                        </GlobalDialog>





                        <GlobalDialog size={"xs"}
                                      hide={this.showPopUpInitiateAction}
                                      show={this.state.showPopUpInitiateAction}
                                      heading={`Match Request: ${this.state.initiateAction}`} >
                            <>



                            <div className={"col-12 text-center mt-2"}>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <GreenButton

                                            title={"Submit"}
                                            onClick={
                                                this.state.initiateAction === "accept"
                                                    ? this.acceptMatch
                                                    : this.rejectMatch
                                            }

                                            type={"submit"}>

                                        </GreenButton>
                                    </div>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <BlueBorderButton
                                            onClick={this.showPopUpInitiateAction}
                                           title={"Cancel"}
                                            type={"button"}
                                        >
                                        </BlueBorderButton>
                                    </div>
                                </div>
                            </div>

                            </>
                        </GlobalDialog>

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
export default connect(mapStateToProps, mapDispachToProps)(MatchItemSeller);
