import React, { Component } from "react";
import Paper from "../img/place-holder-lc.png";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import Org from "./Org/Org";
import ImageOnlyThumbnail from "./ImageOnlyThumbnail";

class CycleItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers: [],
        };

        this.acceptMatch = this.acceptMatch.bind(this);
        this.rejectMatch = this.rejectMatch.bind(this);
        this.makeOfferMatch = this.makeOfferMatch.bind(this);
        this.showPopUp = this.showPopUp.bind(this);
        this.getOffer = this.getOffer.bind(this);
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
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
            });
    }

    acceptOffer(event) {
        axios
            .post(
                baseUrl + "offer/stage",
                {
                    // match_id:this.props.item.match._key,
                    // note:"Accepted"

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

    makeOfferMatch = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        //
        // if (this.handleValidation()){
        //     this.setState({
        //         btnLoading: true
        //     })

        const data = new FormData(event.target);

        const username = data.get("price");

        axios
            .put(
                baseUrl + "offer",
                {
                    match_id: this.props.item.match._key,

                    offer: {
                        amount: {
                            value: 0.0,
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


    componentDidMount() {
        this.getOffer();
    }

    render() {
        return (
            <div className="row no-gutters justify-content-left mt-4 mb-4 listing-row-border pb-4">
                <div className={"col-2 text-left"}>
                    <Link to={"cycle/" + this.props.item.cycle._key}>
                        <>
                            {this.props.item.product.artifacts.length > 0 ? (
                                <ImageOnlyThumbnail images={this.props.item.product.artifacts} />
                            ) : (
                                <img className={"img-fluid"} src={Paper} alt="" />
                            )}
                        </>
                    </Link>
                </div>
                <div className={"col-4 pl-2 content-box-listing"}>
                    <Link to={"cycle/" + this.props.item.cycle._key}>
                        <>
                            <p style={{ fontSize: "18px" }} className=" mb-1 text-bold text-blue">
                                {this.props.item.product.product.name}
                            </p>
                            <p style={{ fontSize: "16px" }} className=" mb-1">
                                {this.props.item.product.product.description.substr(0, 60)} ..
                            </p>

                            <p style={{ fontSize: "16px" }} className=" mb-1">
                                Listing: {this.props.item.listing.name}
                            </p>
                        </>
                    </Link>

                    <div style={{ fontSize: "16px" }} className=" mb-1">
                        <Org orgId={this.props.item.sender._id} /> →
                        <Org orgId={this.props.item.receiver._id} />
                    </div>

                    {/*<p style={{ fontSize: "16px" }} className=" text-mute mb-1">Sites: <span className={"text-bold"}>{this.props.item.from_site.name}  →  {this.props.item.to_site.name}</span></p>*/}
                </div>

                <div style={{ textAlign: "right" }} className={"col-2"}>
                    <p className="text-mute mb-1 small">
                        <span className={"text-bold"}>

                            GBP {this.props.item.offer.amount.value}
                        </span>
                    </p>
                </div>

                <div style={{ textAlign: "right" }} className={"col-2"}>
                    <p className={"green-text text-mute text-bold text-caps small"}>
                        {this.props.item.cycle.stage}
                    </p>
                </div>
                <div style={{ textAlign: "right" }} className={"col-2"}>
                    <p className={" text-mute text-bold small"}>
                        {moment(this.props.item.cycle._ts_epoch_ms).format("DD MMM YYYY")}
                    </p>
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
export default connect(mapStateToProps, mapDispachToProps)(CycleItem);
