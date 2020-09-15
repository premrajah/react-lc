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
import PaperImg from '../../img/paper.png';

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

class  ViewSearchPage extends Component {


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
                <div className="wrapper accountpage">

                    <div className="container  pt-3 pb-3 listing-row-border">

                        <div className="row no-gutters">
                            <div className="col-auto" style={{margin:"auto"}}>

                                <NavigateBefore  style={{ fontSize: 32 }}/>
                            </div>

                            <div className="col text-center blue-text"  style={{margin:"auto"}}>
                                <p>View Search </p>
                            </div>

                            <div className="col-auto">

                                <button className="btn   btn-link text-dark menu-btn">
                                    <Close className="" style={{ fontSize: 32 }} />

                                </button>
                            </div>


                        </div>
                    </div>


                    <div className="container listing-row-border ">


                        <div className="row no-gutters justify-content-center mt-4 mb-4  pb-4">

                            <div className={"col-4"}>

                                <img className={"img-fluid"} src={PaperImg}/>
                            </div>
                            <div className={"col-6 pl-3 content-box-listing"}>
                                <p style={{fontSize:"18px"}} className=" mb-1">Metal</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">Loose / 14 kg</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">@Tescos</p>
                            </div>
                            <div style={{textAlign:"right"}} className={"col-2"}>
                                <p className={"gray-text"}><NavigateNextIcon  style={{ fontSize: 32 }} /></p>

                            </div>
                        </div>




                    </div>
                    <div className="container listing-row-border ">


                        <div className="row no-gutters justify-content-center mt-4 mb-4  pb-4">

                            <div className={"col-4"}>

                                <img className={"img-fluid"} src={PaperImg}/>
                            </div>
                            <div className={"col-6 pl-3 content-box-listing"}>
                                <p style={{fontSize:"18px"}} className=" mb-1">Metal</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">Loose / 14 kg</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">@Tescos</p>
                            </div>
                            <div style={{textAlign:"right"}} className={"col-2"}>
                                <p className={"gray-text"}><NavigateNextIcon style={{ fontSize: 32 }}  /></p>

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

                            <button type="button" className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Cancel Search
                            </button>

                        </div>
                        <div className="col-auto">

                            <button type="button"
                                    className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                View (0) Matches

                            </button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}


export default ViewSearchPage;
