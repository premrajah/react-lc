import React, { Component } from 'react';
import { connect } from "react-redux";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";





class Inbox extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }


        this.getResources = this.getResources.bind(this)

    }




    getResources() {




        axios.get(baseUrl + "resource",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {
                var response = response.data;

                console.log("resource response")
                console.log(response)

            },
                (error) => {
                    var status = error.response.status


                    console.log("resource error")
                    console.log(error)




                }
            );

    }








    interval


    componentWillMount() {

    }

    componentDidMount() {






    }

    intervalJasmineAnim





    render() {

        return (
            <div>







                <Sidebar />
                <div className="wrapper homepage">


                    <HeaderDark />



                    <div className="container   pb-5 pt-5">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Inbox
                                </h3>

                            </div>

                        </div>
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <p className={"text-mute small"}>You have 2 unread messages
                                </p>
                            </div>

                        </div>


                    </div>

                    <div className="container container-divider">
                        <div className="row">
                        </div>
                    </div>
                    <div className="container ">
                        <div className="mt-3 mb-3">
                            <div className="row">
                                <div className="col-auto">
                                    <figure className="avatar avatar-60 border-0"><img src="img/user1.png" alt="" /></figure>
                                </div>
                                <div className="col pl-0 align-self-center">
                                    <div className="row mb-1">
                                        <div className="col">
                                            <h5 className="mb-1">Ammy Jahnson </h5>
                                        </div>
                                        <div className="col-auto pl-0">
                                            <p className="small text-mute text-trucated mt-1 text-time-side">10:30am
                                                <span className="green-dot"></span>

                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-mute small">Hi there, I’m interested in buying this i…</p>
                                    <p className="text-mute small">Matched  •  Apr 9, 2020</p>

                                    <button type="button" className="mt-1 btn green-border-btn btn-outline-primary">Mark Item as delivered
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="container container-divider">
                        <div className="row">
                        </div>
                    </div>


                    <div className="container ">
                        <div className="mt-3 mb-3">
                            <div className="row">
                                <div className="col-auto">
                                    <figure className="avatar avatar-60 border-0"><img src="img/user1.png" alt="" /></figure>
                                </div>
                                <div className="col pl-0 align-self-center">
                                    <div className="row mb-1">
                                        <div className="col">
                                            <h5 className="mb-1">Ammy Jahnson </h5>
                                        </div>
                                        <div className="col-auto pl-0">
                                            <p className="small text-mute text-trucated mt-1 text-time-side">10:30am

                                                <span
                                                    className="orange-dot"></span>
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-mute small">Hi there, I’m interested in buying this i…</p>
                                    <p className="text-mute small">Matched  •  Apr 9, 2020</p>

                                    <button type="button" className="mt-1 btn green-border-btn btn-outline-primary">Write a review
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="container container-divider">
                        <div className="row">
                        </div>
                    </div>

                </div>


            </div>
        );
    }
}


function VoiceOver() {


    return (
        <>


        </>
    );
}



function PlayAudio() {
    // let audio = new Audio("http://www.ekrisi.com/jasmine/jasmine-voice.mp3")


    const audioEl = document.getElementsByClassName("jasmine-audio")[0]


    const start = () => {
        // audio.play()


        audioEl.play()
    }

    return (
        <div className={"audio-box"} >
            <button onClick={start}>Play</button>
        </div>
    );
}



const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        // loading: state.loading,
        // isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        // userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter




    };
};

const mapDispachToProps = dispatch => {
    return {





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Inbox);
