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
import QRCodeImg from '../../img/qr-code.png';


import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";

import LangIcon from '../../img/icons/lang.png';
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import CubeBlue from '../../img/icons/cube-blue.png';
import RingBlue from '../../img/icons/ring-blue.png';

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

class  CycleCode extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }


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

                <div className="wrapper accountpage">
                    <HeaderDark/>

                    <div className="container p-2 " style={{padding:"0"}}>


                        <div className="row no-gutters  justify-content-center listing-row-border">

                            {/*<div className="floating-back-icon" style={{margin:"auto"}}>*/}

                                {/*<NavigateBefore  style={{ fontSize: 32, color:"white" }}/>*/}
                            {/*</div>*/}


                            <div className="col-8 ">
                                <img className={"img-fluid"}  src={QRCodeImg} />

                            </div>
                        </div>
                    </div>
                    <div className="container p-2 ">
                        <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                            <div className="col-12">
                                <h3 className={"blue-text text-heading"}>AGG 02
                                </h3>

                            </div>
                            <div className="col-12 mt-2">
                                <p className={""}>Made by <span className={"green-text"}>Nestle</span></p>

                            </div>
                        </div>


                        <div className="row justify-content-start pb-2 pt-2 listing-row-border">

                            <div className="col-auto">
                                <p  style={{fontSize:"18px"}} className={"text-gray-light "}>Product Description
                                </p>

                            </div>

                        </div>

                        <div className="row justify-content-start pb-4 pt-3 ">
                            <div className="col-auto">

                                <div className={"green-tags tags"}>Aggregate</div>
                                <div className={"green-tags tags"}>PP</div>
                                <div className={"green-tags tags"}>Shelving</div>

                            </div>
                        </div>

                        <div className="row justify-content-start pb-4 pt-3 ">
                            <div className="col-6">

                                <img  style={{height:"24px"}} src={CubeBlue} className={""} />
                                <h6 className={"mt-3"}>Purpose</h6>
                            <p className={"mt-3"}>Aggregate, an intermediary product which aggregates to another large product.</p>

                            </div>

                            <div className="col-6">

                                <img style={{height:"24px"}} src={CubeBlue} className={""} />
                                <h6 className={"mt-3"}>Created</h6>
                                <p className={"mt-3"}>June 9, 2020 at 9:34 AM</p>

                            </div>

                        </div>

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

                            <button type="button" className=" mr-2 btn btn-link green-btn-min mt-2 mb-2 ">
                                Deliver
                            </button>

                        </div>
                        <div className="col-auto">

                            <button type="button"
                                    className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 ">
                                Buy

                            </button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}


export default CycleCode;
