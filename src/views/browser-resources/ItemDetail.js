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

import clsx from 'clsx';
import SearchIcon from '../../img/icons/search-big-gray.png';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import AppBar from '@material-ui/core/AppBar';
import ShippingIcon from '../../img/icons/shipping-icon.png';
import ShippingWhite from '../../img/icons/truck.png';
import SettingsWhite from '../../img/icons/settings-24px.png';
import HandWhite from '../../img/icons/hand-white.png';
import Cube from '../../img/icons/cube.png';
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
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';
import ListIcon from '../../img/icons/list.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import PaperImg from '../../img/paper-big.png';

import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Camera from '@material-ui/icons/CameraAlt';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';


import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
import Close from '@material-ui/icons/Close';
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import Moment from 'react-moment';


class  ItemDetail extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false,
            item:{}
        }

        this.slug = props.match.params.slug

        this.getResources=this.getResources.bind(this)

    }




    getResources(){


        axios.get(baseUrl+"resource/"+this.slug,
            {
                headers: {
                    "Authorization" : "Bearer "+this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var response = response.data;
                    console.log("detail resource response")
                    console.log(response)


                this.setState({

                    item: response.content
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

this.getResources()

    }

    intervalJasmineAnim





    render() {

        return (
            <div>

                <Sidebar />
                <div className="accountpage">

                    <div className="container-fluid " style={{padding:"0"}}>


                        <div className="row no-gutters  justify-content-center">

                            <div className="floating-back-icon" style={{margin:"auto"}}>

                                <NavigateBefore  style={{ fontSize: 32, color:"white" }}/>
                            </div>


                            <div className="col-auto ">
                                <img className={"img-fluid"}  src={PaperImg} />

                            </div>
                        </div>
                    </div>
                    <div className="container ">
                        <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                            <div className="col-12">
                                <p className={"green-text text-heading"}>@{this.state.item.tags}
                                </p>

                            </div>
                            <div className="col-12 mt-2">
                                <h5 className={"blue-text text-heading"}>{this.state.item.name}
                                </h5>
                            </div>
                        </div>


                        <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                            <div className="col-auto">
                                <p  style={{fontSize:"16px"}} className={"text-gray-light "}>{this.state.item.description}
                                </p>

                            </div>

                        </div>

                        <div className="row justify-content-start pb-4 pt-3 ">
                            <div className="col-auto">
                                <h6 className={""}>Item Details
                                </h6>

                            </div>
                        </div>

                    </div>
                    <div className={"container"}>

                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={ListIcon} />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Category</p>
                                <p style={{fontSize:"18px"}} className="  mb-1">{this.state.item.category} ></p>
                                <p style={{fontSize:"18px"}} className="  mb-1">{this.state.item.type}</p>
                            </div>
                        </div>
                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={AmountIcon} />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Amount</p>
                                <p style={{fontSize:"18px"}} className="  mb-1"> {this.state.item.volume} {this.state.item.units}</p>
                            </div>
                        </div>


                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={StateIcon} />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">State</p>
                                <p style={{fontSize:"18px"}} className="  mb-1">{this.state.item.state} </p>
                            </div>
                        </div>

                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={CalenderIcon} />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Required by </p>
                                <p style={{fontSize:"18px"}} className="  mb-1">
                                    <Moment   unix  >
                                    {this.state.item.availableFrom}
                                </Moment>
                                </p>
                            </div>
                        </div>
                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={MarkerIcon} />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Location  </p>
                                <p style={{fontSize:"18px"}} className="  mb-1">Mapledown, Which Hill Lane,</p>
                                <p style={{fontSize:"18px"}} className="  mb-1">Woking, Surrey, GU22 0AH</p>
                            </div>
                        </div>


                        <BottomAppBar />


                    </div>

                </div>



            </div>
        );
    }
}






const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}));

function BottomAppBar() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline/>

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{margin:"auto"}}>
                        <div className="col-auto">

                            <button type="button" className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                Message Seller
                            </button>

                        </div>
                        <div className="col-auto">

                            <button type="button"
                                    className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                Make Offer

                            </button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
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
)(ItemDetail);
