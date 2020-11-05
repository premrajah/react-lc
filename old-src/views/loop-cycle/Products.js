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

import Paper from '../../img/paper.png';
import clsx from 'clsx';
import SearchIcon from '../../img/icons/search-icon.png';

import ShippingIcon from '../../img/icons/shipping-icon.png';
import ShippingWhite from '../../img/icons/truck.png';
import SettingsWhite from '../../img/icons/settings-24px.png';
import HandWhite from '../../img/icons/hand-white.png';
import CubeBlue from '../../img/icons/product-icon-big.png';
import SearchWhite from '../../img/icons/search-white.png';
import VerticalLines from '../../img/icons/vertical-lines.png';
import Rings from '../../img/icons/rings.png';
import FilterImg from '../../img/icons/filter-icon.png';


import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";

import LangIcon from '../../img/icons/lang.png';
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import HandGreyIcon from '../../img/icons/hand-gray.png';
import HandBlue from '../../img/icons/hand.png';
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';

import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Camera from '@material-ui/icons/CameraAlt';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';


import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchGray from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import CssBaseline from '@material-ui/core/CssBaseline';

import Toolbar from '@material-ui/core/Toolbar';
import {withStyles} from "@material-ui/core/styles/index";


class  Products extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false,
            products:[]
        }


        this.getProducts=this.getProducts.bind(this)

    }




    getProducts(){

        axios.get(baseUrl+"product",
            {
                headers: {
                    "Authorization" : "Bearer "+this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var response = response.data.content;
                    console.log("resource response")
                    console.log(response)

                    this.setState({

                        products:response

                    })

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

        this.getProducts()


    }






    render() {


        const    classes = withStyles();
        const classesBottom = withStyles();



        return (
            <div>

                <Sidebar />
                <div className="wrapper accountpage">

                <HeaderDark />


                    <div className="container   pb-4 pt-4">


                        <div className="row ">

                            <div className="col-auto pb-4 pt-4">
                               <img className={"search-icon-middle"}  src={CubeBlue} />

                            </div>
                        </div>
                        <div className="row  pb-2 pt-2 ">

                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Products
                                </h3>

                            </div>
                        </div>


                        <div className="row  pb-4 pt-2 ">

                            <div className="col-auto">
                                <p className={"text-gray-light "}>Products created can be assigned to resource searches</p>

                            </div>
                        </div>

                        <div className="row  justify-content-center search-container listing-row-border pt-3 pb-4">
                            <div className={"col-12"}>
                        <SearchField />


                            </div>
                        </div>


                            <div className="row  justify-content-center filter-row listing-row-border   pt-3 pb-3">

                                <div className="col">
                                    <p style={{fontSize:"18px"}} className="text-mute mb-1">{this.state.products.length} Products </p>

                                </div>
                                <div className="text-mute col-auto pl-0">

                                    <span style={{fontSize:"18px"}}>Created</span>

                                </div>

                            </div>


                        {this.state.products.map((item) =>

                                <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">
                                    <div className={"col-10  content-box-listing"}>

                                        <Link to={"/product/"+item.id}>
                                <p style={{fontSize:"18px"}} className=" mb-1">{item.title}</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">{item.purpose}</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">{item.searches.length} Searches</p>
                                        </Link>
                            </div>
                            <div style={{textAlign:"right"}} className={"col-2"}>
                                <p className={"text-gray-light small"}>9/5/2020</p>

                            </div>
                              </div>

                            )}





                    </div>




                    <React.Fragment>

                        <CssBaseline/>

                        <AppBar  position="fixed" color="#ffffff" className={classesBottom.appBar+"  custom-bottom-appbar"}>
                            <Toolbar>


                                <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                                    <div className="col-auto">

                                        <Link to={"/create-product"}><p className={"green-text bottom-bar-text"}> Create New Product </p></Link>


                                    </div>

                                </div>


                            </Toolbar>
                        </AppBar>

                    </React.Fragment>


                </div>



            </div>
        );
    }
}

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,

    },
}));

function SearchField() {

    const classes = useStylesTabs();

        return (
            <TextField
                variant="outlined"
                className={clsx(classes.margin, classes.textField)+" full-width-field" }
                id="input-with-icon-textfield"

                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchGray  style={{ fontSize: 24, color: "#B2B2B2" }}/>
                        </InputAdornment>
                    ),
                }}
            />

    );
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
)(Products);