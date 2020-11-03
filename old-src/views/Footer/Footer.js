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

import history from "../../History/history";
import FooterNew from "../../components/Footer/Footer";
import MenuIcon from '@material-ui/icons/Menu';
import MenuOutline from '@material-ui/icons/MailOutline';
import WaveBorder from './WaveBorder'


import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';





class  Footer extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }
        this.goToInbox=this.goToInbox.bind(this)
        this.toggleMenu=this.toggleMenu.bind(this)

    }


    goToInbox(){




        history.push("/inbox")

    }


    toggleMenu = (event) => {


        document.body.classList.add('sidemenu-open');

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
                <WaveBorder />
       <FooterNew/>



                {/*<div className="container  container-blue pt-5  footer-container">*/}

                    {/*<div className="row no-gutters mb-5">*/}
                        {/*<div className="col-auto">*/}
                            {/*<img className="header-logo" src={LogoNew} />*/}
                            {/*<img className={"text-logo-home"} src={LogoText} />*/}


                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="row no-gutters mb-3">*/}
                        {/*<div className="col-auto">*/}

                            {/*<ul>*/}
                                {/*<li>Home</li>*/}
                                {/*<li>Create a Search</li>*/}
                                {/*<li>Create a Listing</li>*/}
                                {/*<li>Deliver Resources</li>*/}
                                {/*<li>About Loopcycle</li>*/}
                                {/*<li>News</li>*/}
                                {/*<li>Contact </li>*/}
                            {/*</ul>*/}
                        {/*</div>*/}

                    {/*</div>*/}

                    {/*<div className="row no-gutters mb-5">*/}
                        {/*<div className="col-auto">*/}
                            {/*<img className="home-icon-bottom" src={Twitter} />*/}
                            {/*<img className={"home-icon-bottom"} src={Insta} />*/}


                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="row no-gutters mb-3">*/}
                        {/*<div className="col-auto copright-text">*/}

                            {/*<ul>*/}
                                {/*<li>*/}
                                    {/*<p className={" "}> ©  2020  Loopcycle</p>*/}
                                {/*</li>*/}
                                {/*<li>Terms</li>*/}
                                {/*<li>Privacy</li>*/}


                            {/*</ul>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                {/*</div>*/}


            </>





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





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Footer);
