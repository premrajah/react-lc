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





class  HeaderDark extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }
this.goToInbox=this.goToInbox.bind(this)

    }




goToInbox(){




        history.push("/inbox")

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


                    <div className="container container-black p-2">
                    </div>
                    <div className="container container-blue pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-auto">

                                <img src={LogoNew} alt=""
                                     className="header-logo" />
                            </div>

                            <div className="col text-right ">


                                <button  type="button" className="mt-1 btn topBtn btn-outline-primary">LOG IN</button>
                                <button onClick={this.goToInbox} className="btn  btn-link text-dark btn-inbox">
                                    <MenuOutline className="white-text" style={{ fontSize: 24 }} />
                                    <span className="new-notification"></span>
                                </button>
                            </div>

                            <div className="col-auto">

                                <button className="btn   btn-link text-dark menu-btn">
                                    <MenuIcon className="white-text" style={{ fontSize: 32 }}/>

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
)(HeaderDark);
