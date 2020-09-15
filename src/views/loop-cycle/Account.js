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
import ShippingWhite from '../../img/icons/truck.png';
import SettingsWhite from '../../img/icons/settings-24px.png';
import HandWhite from '../../img/icons/hand-white.png';
import Cube from '../../img/icons/cube.png';
import SearchWhite from '../../img/icons/search-white.png';
import VerticalLines from '../../img/icons/vertical-lines.png';
import Rings from '../../img/icons/rings.png';


import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";

import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Camera from '@material-ui/icons/CameraAlt';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';





class  Account extends Component {


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
                <div className="wrapper container-blue accountpage">

                <HeaderDark />


                    <div className="container container-blue  pt-4">

                        <div className="row mb-5 justify-content-center">

                            <div className="text-center">
                                <div className="figure-profile shadow my-4">
                                    <figure><img src="img/user1.png" alt="" /></figure>
                                    <div className="btn btn-dark text-white floating-btn">
                                        <Camera className="green-text" style={{ fontSize: 24 }} />
                                        <input type="file" className="float-file" />
                                    </div>
                                </div>


                                <div>
                                    <h5 className={"text-white"}>Tesco</h5>
                                    <p className={"text-white text-mute small"}>Joined in 2010 • Surrey, UK</p>

                                </div>
                            </div>

                        </div>

                    <div className="row">
                        <div className="col">
                            <div className="list-group main-menu accountpage-list">
                                <a className="list-group-item list-group-item-action ">
                                    <img src={SettingsWhite} className={"account-icons truck-icon "} />
                                Account</a>
                                <Link to={"my-search"} className="list-group-item list-group-item-action ">
                                    <img src={SearchWhite} className={"account-icons truck-icon "} />
                                    My Searches</Link>

                                <a className="list-group-item list-group-item-action ">
                                    <img src={HandWhite} className={"account-icons truck-icon "} />
                                    My Listings me</a>

                                <a className="list-group-item list-group-item-action ">
                                    <img src={Rings} className={"account-icons truck-icon "} />
                                    My Loops</a>



                            </div>
                        </div>
                    </div>
                    </div>


                    <div className="container  container-divider">
                        <div className="row">
                        </div>
                    </div>



                    <div className="container container-blue  pt-4">

                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu accountpage-list">

                                    <a className="list-group-item list-group-item-action ">
                                        <img src={Cube} className={"account-icons truck-icon "} />
                                        Products</a>

                                    <a className="list-group-item list-group-item-action ">
                                        <img src={ShippingWhite} className={"account-icons truck-icon "} />
                                        Deliveries</a>

                                    <a className="list-group-item list-group-item-action ">
                                        <img src={VerticalLines} className={"account-icons truck-icon "} />
                                        Statistics</a>

                                </div>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        );
    }
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
)(Account);
