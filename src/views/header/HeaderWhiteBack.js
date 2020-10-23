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
import MenuIcon from '@material-ui/icons/Menu';
import MenuOutline from '@material-ui/icons/MailOutline';
import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';
import IndexNavbar from "../../components/Navbars/IndexNavbar";
import Close from '@material-ui/icons/Close';
import NavigateBefore from '@material-ui/icons/NavigateBefore';



class  HeaderWhiteBack extends Component {


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

    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
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





    render() {

        return (


<>


    <div className="container header-white listing-row-border">

        <div className="row no-gutters p-2">
            <div className="col-auto" style={{margin:"auto"}}>

                <NavigateBefore onClick={this.handleBack}  style={{ fontSize: 32 }}/>
            </div>

            <div className="col text-left blue-text text-center text-bold"  style={{margin:"auto"}}>
                <p>{this.props.heading} </p>
            </div>

            <div className="col-auto">

                <button className="btn   btn-link text-dark menu-btn">
                    <Close onClick={this.handleBack}  className="" style={{ fontSize: 32 }} />

                </button>
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
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
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
)(HeaderWhiteBack);
