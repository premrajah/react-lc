import React, {Component} from 'react';
import Paper from '../img/place-holder-lc.png';
import axios from "axios/index";
import {baseUrl} from "../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../store/actions/actions";


class MatchItem extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers:[],
            editPopUp:false,
            editOfferKey:null
        }

        this.acceptMatch=this.acceptMatch.bind(this)
        this.rejectMatch=this.rejectMatch.bind(this)
        this.makeOfferMatch=this.makeOfferMatch.bind(this)
        this.showPopUp=this.showPopUp.bind(this)
        this.editPopUp=this.editPopUp.bind(this)

        this.getOffer=this.getOffer.bind(this)



    }



    editPopUp(event) {



        this.setState({

            editOfferKey: event.currentTarget.dataset.id
        })
        this.setState({
            editPopUp: !this.state.editPopUp
        })

    }


    showPopUp() {

        this.setState({
            showPopUp: !this.state.showPopUp
        })

    }



    getOffer() {


        axios.get(baseUrl + "offer/match/" + this.props.item.match._key)
            .then((response) => {

                    var responseAll = response.data;




                    this.setState({

                        offers: responseAll.data

                    })

                },
                (error) => {

                }
            );

    }

    acceptMatch(){

            axios.post(baseUrl + "match/stage/accept",
                {
                    match_id:this.props.item.match._key,
                    note:"Accepted"

                }, {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then(res => {



                    this.setState({

                        showPopUp: true
                    })

                }).catch(error => {





            });

    }

    acceptOffer(event){

        axios.post(baseUrl + "offer/stage",
            {

                "offer_id": event.currentTarget.dataset.id,
                "new_stage": "accepted"

            }, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })





            }).catch(error => {






            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });

    }


    actionOffer(event){

        axios.post(baseUrl + "offer/stage",
            {

                "offer_id": event.currentTarget.dataset.id,
                "new_stage": "accepted"

            }, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })





            }).catch(error => {






            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });

    }

        makeOfferMatch = event => {

            event.preventDefault();


            const form = event.currentTarget;

            const data = new FormData(event.target);

            const price = data.get("price")

        axios.put(baseUrl + "offer",
            {
                match_id:this.props.item.match._key,

            "offer": {
            "amount": {
                "value": price,
                    "currency": "gbp"
            }

        }

            }, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: false
                })





            }).catch(error => {






            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });

    }



    counterOfferMatch = event => {

        event.preventDefault();


        const form = event.currentTarget;

        const data = new FormData(event.target);

        const price = data.get("price")

        axios.post(baseUrl + "offer/stage",
            {

            "offer_id": this.state.editOfferKey,
            "new_stage": "counter",
            "new_price": {
            "value": price,
                "currency": "gbp"
            }

            }, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: false
                })





            }).catch(error => {






            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });

    }


    editOfferMatch = event => {

        event.preventDefault();


        const id = event.currentTarget.dataset.id;

        const data = new FormData(event.target);

        const price = data.get("price")

        axios.put(baseUrl + "offer",
            {

            "offer_id": id,
            "new_stage": "counter",
            "new_price": {
            "value": 789.00,
                "currency": "gbp"

            } },
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: false
                })





            }).catch(error => {






            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });

    }


    rejectMatch(){




        axios.post(baseUrl + "match/stage/decline",
            {
                match_id:this.props.item.match._key,
                note:"Accepted"

            }, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })





            }).catch(error => {







            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });



    }


    componentDidMount() {
        this.getOffer()
    }





    render() {


        return (



            <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">


                <div className={"col-2"}>


                        <img className={"resource-item-img img-list img-fluid"}
                                                       src={this.props.item.listing.artifacts.length>0 ?this.props.item.listing.artifacts[0].blob_url:Paper} alt="" />



                </div>
                <div className={"col-6 pl-3 content-box-listing"}>

                        <p style={{ fontSize: "18px" }} className=" mb-1 list-title">{this.props.item.listing.listing.name}</p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.listing.org.name}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">Searched By: {this.props.item.search.org.name}</p>

                </div>



                <div className={"col-2 text-right"}>

                    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-caps"> {this.props.item.listing.listing.price?"GBP "+ this.props.item.listing.listing.price.value:"Free"}</p>

                </div>

                <div className={"col-2 text-right"}>

                    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-caps"> {this.props.item.match.stage}</p>

                </div>




                </div>

        );
    }
}



const mapStateToProps = state => {
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

const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(MatchItem);

