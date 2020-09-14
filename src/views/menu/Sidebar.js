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

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';


import Close from '@material-ui/icons/Close';


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


    <div className="sidebar">

        <div className="row container-black pt-2 pb-2">
        </div>
        <div className="sidebar-container">

            <div className="row mt-3">
                <div className="col">
                    <a href="javascript:void(0)" className="closesidemenu">
                        <Close className="white-text" style={{ fontSize: 32 }} />
                        </a>
                </div>
            </div>


            <div className="row mt-2">
                <div className="col">
                    <div className="list-group main-menu">
                        <Link className="list-group-item list-group-item-action green-text">Hello, Tesco </Link>


                    </div>
                </div>
            </div>

            <div className="mt-2 mb-3">
                <div className="row">
                    <div className="col-auto">
                        <figure className="avatar avatar-60 border-0"><img src="img/user1.png" alt="" /></figure>
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
                        <Link className="white-text list-group-item list-group-item-action">Homes </Link>
                        <Link className="white-text list-group-item list-group-item-action">Browse All Resouces </Link>
                        <Link className="white-text list-group-item list-group-item-action">Create A Search </Link>
                        <Link className="white-text list-group-item list-group-item-action">Create A Listing </Link>
                        <Link className="white-text list-group-item list-group-item-action">Deliver Resouces </Link>

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
                        <Link className="list-group-item list-group-item-action green-text">Log in </Link>
                        <Link className="list-group-item list-group-item-action green-text">Log out </Link>
                        <Link className="list-group-item list-group-item-action green-text">My Loopcycle </Link>

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
