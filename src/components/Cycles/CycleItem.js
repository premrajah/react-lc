import React, { Component } from "react";
import Paper from "../../img/place-holder-lc.png";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import Org from "../Org/Org";
import ImageOnlyThumbnail from "../ImageOnlyThumbnail";
import OrgFull from "../Org/OrgFull";
import OrgComponent from "../Org/OrgComponent";
import {capitalize} from "../../Util/GlobalFunctions";

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
            <div className="row no-gutters justify-content-left mb-3 p-3 rad-8 bg-white ">
                <div className={"col-2 text-left"}>
                    <Link to={"cycle/" + this.props.item.cycle._key}>
                        <>
                            {this.props.item.product.artifacts.length > 0 ? (
                                <ImageOnlyThumbnail images={this.props.item.product.artifacts} />
                            ) : (
                                <img className={"img-fluid img-list"} src={Paper} alt="" />
                            )}
                        </>
                    </Link>
                </div>
                <div className={"col-6 pl-3 content-box-listing"}>
                    <Link to={"cycle/" + this.props.item.cycle._key}>
                        <>
                            {/*<p  className="text-capitlize mb-1 title-bold">*/}
                            {/*    {this.props.item.listing.name}*/}
                            {/*</p>*/}
                            <p  className=" mb-1 text-gray-light  ">
                                {this.props.item.product && (
                                    <>Listing: <span className={"text-blue"}>{this.props.item.listing.name}</span> </>
                                )}
                            </p>
                            <p  className=" mb-1 text-gray-light mt-2 ">
                                {this.props.item.product && (
                                    <>Search: <span className={"text-blue"}>{this.props.item.search.name}</span> </>
                                )}
                            </p>
                            <p  className=" mb-1 text-gray-light mt-2 ">
                                {this.props.item.product && (
                                    <>Product: <span className={"text-blue"}>{this.props.item.product.product.name}</span> </>
                                )}
                            </p>

                            <p className={"text-gray-light mt-2 "}>
                                Category:
                                <span

                                    className="ml-1 text-capitlize mb-1 cat-box text-left p-1">
                                                            <span className="text-capitlize">
                                                                {capitalize(this.props.item.listing.category)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className=" text-capitlize">
                                                                {capitalize(this.props.item.listing.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className="  text-capitlize">
                                                                {capitalize(this.props.item.listing.state)}
                                                            </span>



                                    </span>
                            </p>

                        </>
                    </Link>

                    <div  className=" mt-2">
                        <OrgComponent org={this.props.item.sender} /> →
                        <OrgComponent org={this.props.item.receiver} />
                    </div>

                    {/*<p style={{ fontSize: "16px" }} className=" text-mute mb-1">Sites: <span className={"text-bold"}>{this.props.item.from_site.name}  →  {this.props.item.to_site.name}</span></p>*/}
                </div>

                <div  className={"col-2 text-right"}>
                    <p className="text-gray-light mb-1 ">
                     Offer: <span className={"text-bold text-pink"}>

                            GBP {this.props.item.offer.amount.value}
                        </span>
                    </p>
                </div>


                <div  className={"col-2 justify-content-end"}>
                    <p className={"  status text-right"}>
                                <span className={this.props.item.cycle.stage!="closed"?" active text-capitlize":"text-capitlize waiting "}>
                                    {this.props.item.cycle.stage}
                                </span>
                    </p>
                    <p className={" text-gray-light date-bottom "}>
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
