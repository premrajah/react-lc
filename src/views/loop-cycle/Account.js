import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import ShippingWhite from '../../img/icons/delivery-blue.png';
import SettingsWhite from '../../img/icons/settings-blue.png';
import SearchWhite from '../../img/icons/search-blue.png';
import VerticalLines from '../../img/icons/stat-blue-2.png';
import Rings from '../../img/icons/ring-blue.png';
import BuildingIcon from '../../img/icons/building-icon.png';
import ProductBlue from '../../img/icons/product-blue.png';
import ListingBlue from '../../img/icons/listing-blue.png';
import { Router, Route, Switch , Link} from "react-router-dom";

import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


class  Account extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }


        this.getResources=this.getResources.bind(this)

    }


    getResources(){


        axios.get(baseUrl+"resource",
            {
                headers: {
                    "Authorization" : "Bearer "+this.props.userDetail.token
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


    componentWillMount(){

    }

    componentDidMount(){



    }



    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper  accountpage">

                <HeaderDark />


                    <div className="container  pt-3">

                        <div className="row mb-3 justify-content-center ">

                            <div className="col-12  justify-content-center">
                                <h4 className={"text-blue text-bold"}>My Loopcycle</h4>
                            </div>
                        </div>

                        <div className="row mb-5 justify-content-center account-header-box">

                            <div className="col-6  justify-content-center">

                                    <h5 className={"text-blue text-bold"}>Company A</h5>
                                    <p className={" text-mute small"}>Joined in 2010<br/>
                                        Surrey, UK</p>

                            </div>

                            <div className="col-6   justify-content-center">

                                <div className="figure-profile account-figure shadow ">

                                    <figure>
                                        <Link to={"/company"}><img src={BuildingIcon} alt="" /></Link>
                                    </figure>

                                </div>

                                <p className={"text-blue text-underline text-upload"}>

                                    Upload Photo

                                </p>

                            </div>
                        </div>


                        {/*<div className="row mb-5 justify-content-center">*/}

                            {/*<div className="text-center">*/}
                                {/*<div className="figure-profile shadow my-4">*/}
                                    {/*<figure><img src="img/user1.png" alt="" /></figure>*/}
                                    {/*<div className="btn btn-dark text-white floating-btn">*/}
                                        {/*<Camera className="green-text" style={{ fontSize: 24 }} />*/}
                                        {/*<input type="file" className="float-file" />*/}
                                    {/*</div>*/}
                                {/*</div>*/}


                                {/*<div>*/}
                                    {/*<h5 className={"text-white"}>Tesco</h5>*/}
                                    {/*<p className={"text-white text-mute small"}>Joined in 2010 • Surrey, UK</p>*/}

                                {/*</div>*/}
                            {/*</div>*/}

                        {/*</div>*/}

                    <div className="row">
                        <div className="col">
                            <div className="list-group main-menu accountpage-list">
                                <Link to={"/listings"} className="list-group-item list-group-item-action ">
                                    <img src={SettingsWhite} className={"account-icons truck-icon "} />
                                Account  <NavigateNextIcon /> </Link>
                                <Link to={"my-search"} className="list-group-item list-group-item-action ">
                                    <img src={SearchWhite} className={"account-icons truck-icon "} />
                                    My Searches  <NavigateNextIcon /></Link>

                                <Link to={"/listings"} className="list-group-item list-group-item-action ">
                                    <img src={ListingBlue} className={"account-icons truck-icon "} />
                                    My Listings <NavigateNextIcon /></Link>

                                <Link to={"/loops"} className="list-group-item list-group-item-action ">
                                    <img src={Rings} className={"account-icons truck-icon "} />
                                    My Cycles <NavigateNextIcon /></Link>



                            </div>
                        </div>
                    </div>
                    </div>


                    <div className="container ">
                        <div className="row">
                        </div>
                    </div>

                    <div className="container   pt-4">

                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu accountpage-list">

                                    <Link to={"/my-products"} className="list-group-item list-group-item-action ">
                                        <img src={ProductBlue} className={"account-icons truck-icon "} />
                                        Products <NavigateNextIcon /></Link>

                                    <Link to={"/my-deliveries"} className="list-group-item list-group-item-action ">
                                        <img src={ShippingWhite} className={"account-icons truck-icon "} />
                                        Deliveries <NavigateNextIcon /></Link>

                                    <Link to={"/statistics"} className="list-group-item list-group-item-action ">
                                        <img src={VerticalLines} className={"account-icons truck-icon "} />
                                        Statistics <NavigateNextIcon /></Link>

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





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Account);
