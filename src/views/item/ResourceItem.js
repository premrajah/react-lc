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
import HeaderDark from '../header/HeaderDark'
import Footer from '../Footer/Footer'
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
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchGray from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';
import {baseUrl,baseImgUrl} from  '../../Util/Constants'
import axios from "axios/index";


class  ResourceItem extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }

    }

    componentWillMount(){

    }

    componentDidMount(){

    }

    render() {

        const classes = withStyles();
        return (


                <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">


                              <div className={"col-4"}>

                                  <Link to={this.props.item.id}> <img className={"img-fluid"} src={Paper}/></Link>
                                </div>
                                <div className={"col-6 pl-3 content-box-listing"}>
                                    <p style={{fontSize:"18px"}} className=" mb-1">{this.props.item.name}</p>
                                    <p style={{fontSize:"16px"}} className="text-mute mb-1">{this.props.item.state} / {this.props.item.volume} {this.props.item.units}</p>
                                    <p style={{fontSize:"16px"}} className="text-mute mb-1">@{this.props.item.tags}</p>
                                </div>
                                <div style={{textAlign:"right"}} className={"col-2"}>
                                    <p className={"green-text"}>{this.props.item.price?this.props.item.price:"Free"}</p>
                                </div>



    </div>
        );
    }
}









function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    };
}

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,

    },
}));

function NavTabs() {
    const classes = useStylesTabs();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs
                    style={{backgroundColor:"#27245C", color:"#ffffff!important"}}
                    indicatorColor="secondary"
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                >
                    <LinkTab label="Listings" href="/drafts" {...a11yProps(0)} />
                    <LinkTab label="Loops" href="/trash" {...a11yProps(1)} />
                    <LinkTab label="About" href="/spam" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>

                <div className={"container"}>

                    <div className="row  justify-content-center search-container listing-row-border pb-4">
                        <div className={"col-12"}>

                            <TextField
                                label={"Search this seller’s listings"}
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
                        </div>
                    </div>

                    <div className="row  justify-content-center filter-row listing-row-border  mb-4 pt-4 pb-4">

                        <div className="col">
                            <p style={{fontSize:"18px"}} className="text-mute mb-1">5 out of 5 Listings </p>

                        </div>
                        <div className="text-mute col-auto pl-0">

                            <span style={{fontSize:"18px"}}>Filter</span>   <img src={FilterImg} className={"filter-icon"}  />

                        </div>

                    </div>

                    <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">

                        <div className={"col-4"}>

                            <img className={"img-fluid"} src={Paper}/>
                        </div>
                        <div className={"col-6 pl-3 content-box-listing"}>
                            <p style={{fontSize:"18px"}} className=" mb-1">Paper and Card</p>
                            <p style={{fontSize:"16px"}} className="text-mute mb-1">Loose / 14 kg</p>
                            <p style={{fontSize:"16px"}} className="text-mute mb-1">@Tescos</p>
                        </div>
                        <div style={{textAlign:"right"}} className={"col-2"}>
                            <p className={"green-text"}>£12</p>
                        </div>
                    </div>

                    <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">

                        <div className={"col-4"}>

                            <img className={"img-fluid"} src={Paper}/>
                        </div>
                        <div className={"col-6 pl-3 content-box-listing"}>
                            <p style={{fontSize:"18px"}} className=" mb-1">Metal</p>
                            <p style={{fontSize:"16px"}} className="text-mute mb-1">Loose / 14 kg</p>
                            <p style={{fontSize:"16px"}} className="text-mute mb-1">@Tescos</p>
                        </div>
                        <div style={{textAlign:"right"}} className={"col-2"}>
                            <p className={"green-text"}>Free</p>
                        </div>
                    </div>

                </div>




            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className={"container"}>

                    <div className="row  justify-content-center search-container listing-row-border pb-4">
                        <div className={"col-12"}>

                            <TextField
                                label={"Search this seller’s loops"}
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
                        </div>
                    </div>

                    <div className="row  justify-content-center filter-row listing-row-border  mb-4 pt-4 pb-4">

                        <div className="col">
                            <p style={{fontSize:"18px"}} className="text-mute mb-1">2 Loops</p>

                        </div>
                        {/*<div className="text-mute col-auto pl-0">*/}

                        {/*<span style={{fontSize:"18px"}}>Filter</span>   <img src={FilterImg} className={"filter-icon"}  />*/}

                        {/*</div>*/}

                    </div>

                    <div className="row no-gutters justify-content-start mt-4 mb-4 listing-row-border pb-4">

                        {/*<div className={"col-4"}>*/}

                        {/*<img className={"img-fluid"} src={Paper}/>*/}
                        {/*</div>*/}
                        <div className={"col-11 content-box-listing"}>
                            <p style={{fontSize:"18px"}} className=" mb-1">Tesco   →  Company B</p>
                            <p style={{fontSize:"16px"}} className="text-mute mb-1">Paper and Cardboard</p>
                            <p style={{fontSize:"16px"}} className="text-mute mb-1">bailed / 10 kg</p>
                        </div>
                        <div style={{textAlign:"right"}} className={"col-1"}>
                            <p className={"gray-text"}><NavigateNextIcon /></p>
                        </div>
                    </div>

                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className={"container"}>

                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={MarkerIcon} />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Surrey, UK</p>
                        </div>
                    </div>

                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={CalenderIcon} />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Joined in Jan 10, 2020
                            </p>
                        </div>
                    </div>
                    <div className="row  justify-content-start search-container listing-row-border pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={LangIcon} />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{fontSize:"18px"}} className="forgot-password-link text-mute text-gray-light mb-1">www.tesco.co.uk</p>
                        </div>
                    </div>
                    <div className="row  justify-content-start filter-row listing-row-border  mb-4 pt-5 pb-5">

                        <div className={"col-1"}>
                            <img className={"icon-about"} src={EditGray} />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{fontSize:"18px"}} className=" text-mute text-gray-light mb-1">Description</p>
                        </div>

                    </div>

                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={HandGreyIcon} />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{fontSize:"18px"}} className=" text-mute text-gray-light mb-1">5 Listings</p>
                        </div>
                    </div>
                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={RingGray} />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{fontSize:"18px"}} className=" text-mute text-gray-light mb-1">2 Loops</p>
                        </div>
                    </div>

                </div>
            </TabPanel>
        </div>
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
)(ResourceItem);