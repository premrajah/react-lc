import React, { Component } from 'react';
import Paper from '../img/place-holder-lc.png';
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";

import { Modal, ModalBody } from 'react-bootstrap';
import GrayLoop from '../img/icons/gray-loop.png';
import TextField from '@material-ui/core/TextField';

import CompanyInfo from './CompanyInfo'
class MatchItemSeller extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers:[],
            editPopUp:false,
            editOfferKey:null,
            showPopUpInitiateAction:false,
            action:null,
            initiateAction:null,
            initiateActionId:null,
        }

        this.acceptMatch=this.acceptMatch.bind(this)
        this.rejectMatch=this.rejectMatch.bind(this)
        this.makeOfferMatch=this.makeOfferMatch.bind(this)
        this.showPopUp=this.showPopUp.bind(this)
        this.editPopUp=this.editPopUp.bind(this)
        this.actionOffer=this.actionOffer.bind(this)
        this.getOffer=this.getOffer.bind(this)
        this.showPopUpInitiateAction=this.showPopUpInitiateAction.bind(this)




    }



    editPopUp(event) {


        this.setState({
            editPopUp: !this.state.editPopUp
        })

        this.setState({

            editOfferKey: event.currentTarget.dataset.id,
            action:event.currentTarget.dataset.action
        })

    }


    showPopUp() {

        this.setState({
            showPopUp: !this.state.showPopUp
        })

    }


    showPopUpInitiateAction(event) {

        this.setState({
            showPopUpInitiateAction: !this.state.showPopUpInitiateAction
        })


        this.setState({

            initiateAction:event.currentTarget.dataset.action
        })



    }


    getOffer() {


        axios.get(baseUrl + "offer/match/" + this.props.item.match._key,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data;

                    console.log("offers with match response")
                    console.log(responseAll)

                    this.setState({

                        offers: responseAll.data

                    })

                },
                (error) => {
                    console.log("offers error", error)
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

                    console.log(res.data.data)

                    this.setState({

                        showPopUpInitiateAction: false
                    })


                }).catch(error => {

                console.log("loop accept error found ")
                console.log(error)


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

                console.log(res.data.data)

                this.setState({

                    showPopUp: true
                })





            }).catch(error => {



            console.log("loop accept error found ")

            console.log(error)
            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });

    }


    actionOffer(event){


        event.preventDefault();





        const form = event.currentTarget;

        const formData = new FormData(event.target);

        const price = formData.get("price")



        var data

        if (this.state.action !== "counter") {

            data = {

                "offer_id": this.state.editOfferKey,
                "new_stage": this.state.action

            }

        }else {


            data = {

                "offer_id": this.state.editOfferKey,
                "new_stage": "counter",
                "new_price": {
                    "value": price,
                    "currency": "gbp"
                }


            }

        }



        console.log(data)


        axios.post(baseUrl + "offer/stage",
            data

            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {

                console.log(res.data.data)

                this.setState({

                    editPopUp: false
                })


            }).catch(error => {



            console.log("offer action error ")

            console.log(error)
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

                console.log(res.data.data)

                this.setState({

                    showPopUp: false
                })





            }).catch(error => {



            console.log("make an offer error found ")

            console.log(error)
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

                console.log(res.data.data)

                this.setState({

                    editPopUp: false
                })





            }).catch(error => {



            console.log("make an offer error found ")

            console.log(error)
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

                console.log(res.data.data)

                this.setState({

                    showPopUp: false
                })





            }).catch(error => {



            console.log("make an offer error found ")

            console.log(error)
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
                note:"Reject Note"

            }, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {

                console.log(res.data.data)

                this.setState({

                    showPopUpInitiateAction: false
                })


            }).catch(error => {



            console.log("loop decline error found ")

            console.log(error)

            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });



    }

    componentWillMount() {

    }

    componentDidMount() {

        this.getOffer()

        this.interval = setInterval(() => {

            this.getOffer()


        }, 5000);



    }

    componentWillUnmount() {

        clearInterval(this.interval)
    }





    render() {


        return (



            <div className="row no-gutters  mt-4 mb-4  p-4 border-light">

                {/*<div className={"col-1  content-box-listing"}>*/}
                    {/*<p style={{ fontSize: "18px" }} className="text-bold mb-1"> {this.props.index+1}.</p>*/}
                {/*</div>*/}
                <div className={"col-4  content-box-listing"}>

                        {/*<p style={{ fontSize: "18px" }} className=" mb-1 list-title">{this.props.item.listing.listing.name}</p>*/}
                    <p style={{ fontSize: "18px" }} className="text-bold mb-1">{this.props.item.search.org._id} <CompanyInfo item={this.props.item.search.org}/></p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.search.search.name} </p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">Stage: {this.props.item.match.stage}</p>



                </div>
                <div style={{ textAlign: "right" }} className={"col-8"}>

                    {this.props.item.match.stage==="created" &&  this.props.item.listing.org._id == this.props.userDetail.orgId &&
                    <div className={"row"}>

                        <div className="col-auto">

                            <button  data-action="accept" onClick={this.showPopUpInitiateAction} type="button" className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                Accept
                            </button>

                        </div>
                        <div className="col-auto">

                            <button data-action="reject" onClick={this.showPopUpInitiateAction} type="button"
                                  className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                Reject

                            </button>
                        </div>


                    </div>}



                    {(this.props.item.match.stage==="accepted" ||this.props.item.match.stage==="offered")&&  this.props.item.listing.org._id != this.props.userDetail.orgId &&



                    <div className={"row"}>

                        <div className="col-auto">

                            <button  onClick={this.showPopUp} type="button" className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                Make an Offer
                            </button>

                        </div>
                    </div>

                    }


                </div>

                <div style={{ textAlign: "left" }} className={"col-12"}>



                { this.props.item.match.stage==="offered"  && <div className={"row container-gray"}>


                    {this.state.offers.map((item, index) =>

                        <div className="col-12 ">



                            <span style={{ fontSize: "18px" }}
                                  className=" mb-1 list-title text-bold ">Offer Stage: {item.offer.stage}</span>
                            <br/>
                            <span style={{ fontSize: "18px" }}
                                  className=" mb-1 list-title text-bold text-blue">GBP {item.offer.amount.value}</span>


                            {/*<button data-id={item.offer._key} onClick={this.acceptOffer.bind(this)} type="button"*/}
                                    {/*className=" ml-3  btn btn-link green-border-btn mt-2 mb-2 btn-blue">*/}
                                {/*Accept*/}
                            {/*</button>*/}




                            {/*<button data-id={item.offer._key} onClick={this.editPopUp.bind(this)} type="button"*/}
                                    {/*className=" ml-3  btn btn-link green-border-btn mt-2 mb-2 btn-blue">*/}
                                {/*Counter offer*/}
                            {/*</button>*/}



                            {item.next_action.is_mine &&

                            <>

                                {item.next_action.possible_actions.map((actionName) =>


                                    <>


                                        <button
                                            data-id={item.offer._key} data-action={actionName} onClick={this.editPopUp.bind(this)}
                                                type="button"
                                                className={actionName==="accepted"?"shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 green-btn-border":
                                                    actionName==="cancelled"?"shadow-sm mr-2 btn btn-link  ml-3 mt-2 mb-2 orange-btn-border":
                                                        actionName==="rejected"?"shadow-sm mr-2 btn btn-link ml-3 mt-2 mb-2 orange-btn-border":
                                                            actionName==="declined"?"shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 orange-btn-border":
                                                                actionName==="progress"?"shadow-sm mr-2 btn btn-link ml-3 mt-2 mb-2 green-btn-border":
                                                                    actionName==="completed"?"shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 green-btn-border":

                                                                        "shadow-sm mr-2 btn btn-link ml-3  mt-2 mb-2 green-btn-border"}

                                        >

                                            {actionName==="accepted" && "Accept"}
                                            {actionName==="cancelled" && "Cancel"}
                                            {actionName==="rejected" && "Reject"}
                                            {actionName==="declined" && "Decline"}
                                            {actionName==="confirmed" && "Confirm"}
                                            {actionName==="progress" && "Progress"}
                                            {actionName==="completed" && "Complete"}
                                            {actionName==="withdrawn" && "Withdraw"}
                                            {actionName==="counter" && "Counter"}
                                        </button>


                                    {/*<button data-id={item.offer._key} data-action={actionName} onClick={this.editPopUp.bind(this)}*/}
                                            {/*type="button"*/}
                                            {/*className=" ml-3  btn btn-link green-border-btn mt-2 mb-2 btn-blue">*/}

                                        {/*{actionName}*/}
                                        {/**/}


                                    {/*</button>*/}


                                        </>

                                )}

                            </>
                            }





                        </div>
                    )

                    }
                </div>}

                </div>


                { this.props.item.match.stage==="converted"  && <div className={"row"}>


                    {this.state.offers.map((item, index) =>

                        <div className="col-12">


                            {index + 1}. <span style={{ fontSize: "18px" }}
                                               className=" mb-1 list-title text-bold text-blue">GBP {item.offer.amount.value}</span>,
                            Offer Stage: {item.offer.stage}


                        </div>
                    )

                    }
                </div>}



                <Modal className={"loop-popup"}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered show={this.state.editPopUp} onHide={this.editPopUp} animation={false}>

                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-4 text-center"}>
                                <img className={"ring-pop-pup"} src={GrayLoop} alt=""/>
                            </div>
                        </div>



                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold"}>{this.state.action} offer</p>
                                <p>Make an offer</p>
                            </div>
                        </div>


                        <form onSubmit={this.actionOffer}>

                            <div className={"row justify-content-center"}>

                                {this.state.action==="counter" && <div className={"col-12 text-center"}>


                                    <TextField id="outlined-basic" label="Offer Price" variant="outlined" fullWidth={true} name={"price"} type={"number"} />

                                </div>}
                                <div className={"col-12 text-center mt-2"}>


                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{textAlign:"center"}}>

                                            <button  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Submit </button>


                                        </div>
                                        <div className={"col-6"} style={{textAlign:"center"}}>
                                            <p onClick={this.editPopUp} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</p>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </form>

                    </ModalBody>

                </Modal>


                <Modal className={"loop-popup"}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered show={this.state.showPopUp} onHide={this.showPopUp} animation={false}>

                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-4 text-center"}>
                                <img className={"ring-pop-pup"} src={GrayLoop} alt=""/>
                            </div>
                        </div>



                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold"}>Make an offer</p>
                                <p>Make an offer</p>
                            </div>
                        </div>




                        <form onSubmit={this.makeOfferMatch}>
                            <div className={"row justify-content-center"}>

                                <div className={"col-12 text-center"}>
                                    <TextField id="outlined-basic" label="Offer Price" variant="outlined" fullWidth={true} name={"price"} type={"number"} />

                                </div>
                                <div className={"col-12 text-center mt-2"}>


                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{textAlign:"center"}}>

                                            <button  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Submit </button>


                                        </div>
                                        <div className={"col-6"} style={{textAlign:"center"}}>
                                            <p onClick={this.showPopUp} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</p>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </form>



                        {/*</>*/}


                        {/*}*/}
                    </ModalBody>

                </Modal>



                <Modal className={"loop-popup"}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered show={this.state.showPopUpInitiateAction} onHide={this.showPopUpInitiateAction} animation={false}>

                    <ModalBody>
                        {/*<div className={"row justify-content-center"}>*/}
                            {/*<div className={"col-4 text-center"}>*/}
                                {/*<img className={"ring-pop-pup"} src={GrayLoop} alt=""/>*/}
                            {/*</div>*/}
                        {/*</div>*/}



                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p  style={{textTransform:"uppercase"}} className={"text-bold"}>Match: {this.state.initiateAction}</p>
                                <p>Are you sure you want to {this.state.initiateAction} ? </p>
                            </div>
                        </div>


                            <div className={"row justify-content-center"}>


                                <div className={"col-12 text-center mt-2"}>


                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{textAlign:"center"}}>

                                            <button onClick={this.state.initiateAction==="accept"?this.acceptMatch:this.rejectMatch} style={{minWidth:"120px"}}  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Yes</button>


                                        </div>
                                        <div className={"col-6"} style={{textAlign:"center"}}>
                                            <p onClick={this.showPopUpInitiateAction} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</p>
                                        </div>
                                    </div>

                                </div>

                            </div>



                        {/*</>*/}


                        {/*}*/}
                    </ModalBody>

                </Modal>



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
)(MatchItemSeller);

