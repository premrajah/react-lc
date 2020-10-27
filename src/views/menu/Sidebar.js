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
import TescoImg from '../../img/tesco.png';

import history from "../../History/history";

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';


import Close from '@material-ui/icons/Close';


class  Sidebar extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }
        this.toggleMenu=this.toggleMenu.bind(this)
        this.logOut=this.logOut.bind(this)

    }




    toggleMenu = (event) => {


        document.body.classList.remove('sidemenu-open');

    }



    logOut = (event) => {
        document.body.classList.remove('sidemenu-open');
        this.props.logOut()

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


<>


    <div className="sidebar">

        <div className="row container-black pt-2 pb-2">
        </div>
        <div className="sidebar-container">

            <div className="row mt-3">
                <div className="col">
                    <a href="javascript:void(0)" className="closesidemenu">
                        <Close onClick={this.toggleMenu} className="white-text" style={{ fontSize: 32 }} />
                        </a>
                </div>
            </div>


            {this.props.isLoggedIn && <div className="row mt-2">
                <div className="col">
                    <div className="list-group main-menu">
                        <Link className="list-group-item list-group-item-action green-text">Hello, {this.props.userDetail.firstName} </Link>


                    </div>
                </div>
            </div>
            }

            <div className="mt-2 mb-3">
                <div className="row">
                    <div className="col-auto">
                        <figure className="avatar avatar-60 border-0">
                            {/*<img src={TescoImg} alt="" />*/}

                            <span className={"word-user-big"}>
                                    {this.props.userDetail.email=="test.3@parallelai.com" &&   "M"}
                                {this.props.userDetail.email=="crajah@karedo.co.uk" &&   "L"}
                                {this.props.userDetail.email=="scorpion_rain@yahoo.com" &&   "C"}

                                </span>

                        </figure>
                    </div>
                    {/*<div className="col pl-0 align-self-center">*/}
                    {/*<h5 className="mb-1">Ammy Jahnson</h5>*/}
                    {/*<p className="text-mute small">Work, London, UK</p>*/}
                    {/*</div>*/}
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="list-group main-menu">
                        <Link onClick={this.toggleMenu} to={"/"} className="white-text list-group-item list-group-item-action">Homes </Link>
                        <Link onClick={this.toggleMenu} to={"/resources"} className="white-text list-group-item list-group-item-action">Browse All Resouces </Link>
                        <Link onClick={this.toggleMenu} to={"/create-search"} className="white-text list-group-item list-group-item-action">Create A Search </Link>
                        <Link onClick={this.toggleMenu} to={"/create-listing"} className="white-text list-group-item list-group-item-action">Create A Listing </Link>
                        {/*{this.props.isLoggedIn &&   <Link onClick={this.toggleMenu} to={"/delivery-resource"} className="white-text list-group-item list-group-item-action">Deliver Resources </Link>}*/}
                        {this.props.isLoggedIn &&   <Link onClick={this.toggleMenu} to={"/account"} className="white-text list-group-item list-group-item-action">Account</Link>}
                        {this.props.isLoggedIn &&   <Link onClick={this.toggleMenu} to={"/loops"} className="white-text list-group-item list-group-item-action">My Cycles</Link>}

                        {this.props.isLoggedIn &&   <Link onClick={this.toggleMenu} to={"/my-listings"} className="white-text list-group-item list-group-item-action">My Listings </Link>}
                        {this.props.isLoggedIn &&   <Link onClick={this.toggleMenu} to={"/searches"} className="white-text list-group-item list-group-item-action">My Searches </Link>}
                        {this.props.isLoggedIn &&   <Link onClick={this.toggleMenu} to={"/my-products"} className="white-text list-group-item list-group-item-action">My Products </Link>}
                        {this.props.isLoggedIn &&   <Link onClick={this.toggleMenu} to={"/statistics"} className="white-text list-group-item list-group-item-action">Statistics</Link>}


                    </div>
                </div>
            </div>
            <div className="row mt-3 mb-3">
                <div className="col">
                    <div className={"menu_divider_line"}></div>
                </div>
            </div>


            <div className="row">
                <div className="col">
                    <div className="list-group main-menu">
                        {!this.props.isLoggedIn &&   <Link onClick={this.toggleMenu}  to={"/login"} className="list-group-item list-group-item-action green-text">Log in </Link>}
                        {this.props.isLoggedIn &&  <Link onClick={this.logOut}  to={"/login"} className="list-group-item list-group-item-action green-text">Log out </Link>}
                        <Link onClick={this.toggleMenu} to={"/account"} className="list-group-item list-group-item-action green-text">My Loopcycle </Link>

                    </div>
                </div>
            </div>
        </div>
    </div>
    </>





        );
    }
}




const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter




    };
};


const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),


    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Sidebar);
