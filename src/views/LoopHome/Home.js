import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Logo from '../../img/logo-2x.png';
import LogoSmall from '../../img/logo-small.png';
import LogoNew from '../../img/logo-cropped.png';

import LogoText from '../../img/logo-text.png';
import PhoneHome from '../../img/phone-home.png';
import BikeHome from '../../img/bike-home.png';
import LoopHome from '../../img/LoopHome.png';

import HandIcon from '../../img/icons/hand.png';

import SearchIcon from '../../img/icons/search-icon.png';

import ShippingIcon from '../../img/icons/shipping-icon.png';
import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";

import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import Footer from '../Footer/Footer'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';





class  Home extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }


    }



    handleSongLoading() {

    }

    handleSongFinishedPlaying() {


    }

    handleSongPlaying() {



    }


    interval


    componentWillMount(){

    }

    componentDidMount(){






    }

    intervalJasmineAnim





    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper homepage">

                <HeaderDark />
                    <div className="container container-blue pt-5">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <img src={LogoText} alt=""
                                     className="text-logo-home" />
                            </div>

                        </div>
                    </div>
                    <div className="container container-blue  pt-5">
                        <div className="row no-gutters">
                            <div className="col-auto">

                                <h1 className={"white-text"}>A Platform for
                                    the future </h1>
                            </div>
                        </div>
                    </div>
                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">


                                <p className={"white-text"}>Loopcycle is a match making platform for organisations that generate waste and for those that need waste to manufacture their products.
                                </p>

                            </div>



                        </div>

                    </div>
                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">

                                <img className={"img-fluid"} src={PhoneHome}  />
                            </div>



                        </div>

                    </div>
                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <p className={"white-text"}>Loopcycle uses artificial intelligence to match organizations and blockchain technology is used to ensure the transaction is secure and traceable.
                                </p>

                            </div>



                        </div>

                    </div>


                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">

                                <img className={"img-fluid"} src={BikeHome}  />
                            </div>



                        </div>

                    </div>
                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"white-text"}>Do more, with less
                                </h3>

                            </div>



                        </div>

                    </div>
                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <p className={"white-text"}>We’re closing the loop on excess material extraction; breaking the ‘take, make waste’ cycle and empowering creators to do more, with less.
                                </p>

                            </div>



                        </div>

                    </div>

                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">

                                <img className={"img-fluid"} src={LoopHome}  />
                            </div>



                        </div>

                    </div>
                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"white-text"}>Igniting community
                                </h3>

                            </div>



                        </div>

                    </div>
                    <div className="container container-blue  pt-4">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <p className={"white-text"}>Resource exchange is just part of the process. Loopcycle is a platform for building relationships.
                                </p>

                            </div>



                        </div>

                    </div>


                    <div className="container   p-5">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"blue-text"}>View all resources on<br/>
                                    the Loopcycle<br/>
                                    Platform.
                                </h3>
                            </div>

                        </div>

                                <div className="row no-gutters">
                                    <div className="col-auto">

                                <button type="button" className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                    Browse all resources <NavigateNextIcon />
                                </button>

                                    </div>
                                </div>


                    </div>

                    <div className="container container-divider">
                        <div className="row">
                        </div>
                        </div>




                    <div className="container  p-5">

                        <div className="row no-gutters mb-3">
                            <div className="col-auto">
                                <img className={"search-icon"} src={SearchIcon} />

                            </div>
                        </div>
                        <div className="row no-gutters mb-3">
                            <div className="col-auto">
                                <p className={"blue-text"}>Need resources to make your product? Start a search and enter your requirements.
                                </p>
                            </div>

                        </div>

                        <div className="row no-gutters">
                            <div className="col-auto">

                                <button type="button" className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Create a search
                                </button>

                            </div>
                        </div>


                    </div>
                    <div className="container container-divider">
                        <div className="row">
                        </div>
                    </div>
                    <div className="container  p-5">

                        <div className="row no-gutters mb-3">
                            <div className="col-auto">
                                <img className={"home-icon"} src={HandIcon} />

                            </div>
                        </div>
                        <div className="row no-gutters mb-3">
                            <div className="col-auto">
                                <p className={"blue-text"}>Do you have used resources to offer? Start listing any used resources.
                                </p>
                            </div>

                        </div>

                        <div className="row no-gutters">
                            <div className="col-auto">

                                <button type="button" className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Create a listing
                                </button>

                            </div>
                        </div>

                    </div>
                    <div className="container container-divider">
                        <div className="row">
                        </div>
                    </div>


                    <div className="container  p-5">

                        <div className="row no-gutters mb-3">
                            <div className="col-auto">
                                <img className={"home-icon"} src={ShippingIcon} />

                            </div>
                        </div>
                        <div className="row no-gutters mb-3">
                            <div className="col-auto">
                                <p className={"blue-text"}>Able to collect and deliver resources? Register your company on the platform.
                                </p>
                            </div>

                        </div>

                        <div className="row no-gutters">
                            <div className="col-auto">

                                <button type="button" className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Deliver Resources
                                </button>

                            </div>
                        </div>


                    </div>

                    <Footer />




                </div>

            </div>
        );
    }
}


function VoiceOver() {


    return(
        <>


        </>
    );
}



function PlayAudio() {
    // let audio = new Audio("http://www.ekrisi.com/jasmine/jasmine-voice.mp3")


    const audioEl = document.getElementsByClassName("jasmine-audio")[0]


    const start = () => {
        // audio.play()

        alert("palying")
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


        songLoadingComplete: () => dispatch(actionCreator.songLoadingComplete())



    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Home);
