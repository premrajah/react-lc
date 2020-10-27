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
import TescoImg from '../../img/tesco.png';
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

import {baseImgUrl, baseUrl,frontEndUrl} from "../../Util/Constants";
import axios from "axios/index";
import Moment from 'react-moment';
import { withRouter } from 'react-router-dom'
import CubeBlue from '../../img/icons/product-icon-big.png';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import HotelIcon from '@material-ui/icons/Hotel';
import BusinessIcon from '@material-ui/icons/Business';
import RepeatIcon from '@material-ui/icons/Repeat';






class  ProductDetail extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false,
            item:{},
            codeImg:null,
            searches:[]
        }

        this.slug = props.match.params.slug

        this.getResources=this.getResources.bind(this)
        this.getQrCode=this.getQrCode.bind(this)
        this.loadSearches=this.loadSearches.bind(this)



    }



    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
    }





    loadSearches(){


        for (var i=0;i<this.state.item.searches.length;i++){


            axios.get(baseUrl+"search/"+this.state.item.searches[i],
                {
                    headers: {
                        "Authorization" : "Bearer "+this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var response = response.data;

                        console.log("search code")

                        console.log(response)

                       var searches = this.state.searches

                       searches.push(response.content)

                       this.setState({

                            searches: searches

                        })
                    },
                    (error) => {

                        var status = error.response.status

                        console.log("search error")

                        console.log(error)

                    }
                );


        }




    }

    getQrCode(){



        axios.get(baseUrl+"product/"+this.slug+"/code",
            {
                headers: {
                    "Authorization" : "Bearer "+this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var response = response.data;
                    console.log("qr code")
                    console.log(response)


                    this.setState({

                        codeImg: response
                    })

                },
                (error) => {

                    var status = error.response.status

                    console.log("resource error")

                    console.log(error)


                }
            );




    }



    getResources(){


        axios.get(baseUrl+"product/"+this.slug,
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


                this.loadSearches()
                this.getQrCode()

                },
                (error) => {

                    var status = error.response.status

                    console.log("resource error")

                    console.log(error)


                }
            );

    }



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

                    <HeaderDark />
                    {/*<div className="container-fluid " style={{padding:"0"}}>*/}


                        {/*<div className="row no-gutters  justify-content-center">*/}

                            {/*<div className="floating-back-icon" style={{margin:"auto"}}>*/}

                                {/*<NavigateBefore onClick={this.handleBack}  style={{ fontSize: 32, color:"white" }}/>*/}
                            {/*</div>*/}


                            {/*/!*<div className="col-auto ">*!/*/}
                                {/*/!*<img className={"img-fluid"}  src={PaperImg} />*!/*/}
                            {/**/}
                            {/*/!*</div>*!/*/}
                        {/*</div>*/}
                    {/*</div>*/}


                    <div className="container mt-5 pt-5 ">


                        <div className="row justify-content-start pb-3 pt-4 ">

                            <div className="col-12">
                                <h3 className={"blue-text text-heading"}>View Products
                                </h3>

                            </div>
                            {/*<div className="col-12 mt-2">*/}
                                {/*<h5 className={"blue-text text-heading"}>{this.state.item.name}*/}
                                {/*</h5>*/}
                            {/*</div>*/}
                        </div>



                        <div className="row justify-content-start pb-3 pt-4 border-box">


                            <div className="col-12">
                            <h3 className={"blue-text text-bold"}>{this.state.item.title  }</h3>
                            </div>

                            <div className="col-12  pb-3 listing-row-border">
                            <p>Made By <span className={"green-text"}> {this.state.item.org_id}</span></p>
                            </div>

                            <div className="col-12 mt-3 pb-3 listing-row-border">
                                <p>{this.state.item.description  }</p>
                            </div>
                            <div className="col-12 mt-3 pb-3 ">
                                <p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{this.state.item.purpose  }</p>

                                <p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{"Shelving" }</p>
                                <p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{"PP" }</p>

                            </div>
                            <div className="col-12 mt-3 pb-3 ">

                                <div className="row ">
                                <div className="col-1 ">
                                    <img style={{width: "40px"}} className={"search-icon-middle"}  src={CubeBlue} />
                                </div>
                                <div className="col-11 ">
                                     <div className={"col-12 blue-text text-bold"}>Purpose</div>
                                    <div className={"col-12 "}>Aggregate, an intermediary product which aggregates to another large product.</div>


                                </div>
                                </div>


                            </div>

                            <div className="col-12 mt-3 pb-3 ">
                                <div className="row ">
                                <div className="col-1 ">
                                    <img style={{width: "40px"}} className={"search-icon-middle"}  src={CubeBlue} />
                                </div>
                                <div className="col-11 ">
                                    <div className={"col-12 blue-text text-bold"}>Created</div>
                                    <div className={"col-12 "}>Sept 9, 2020 at 9:34 AM</div>


                                </div>
                                </div>


                            </div>

                        </div>


                        <div className="row justify-content-start pb-3 pt-3 ">

                            <div className="col-12">
                            <h5 className={"text-bold blue-text"}>Cycle Code</h5>
                            </div>

                            <div className="col-12">
                                <p  style={{fontSize:"16px"}} className={"text-gray-light "}>
                                    Scan the QR code below to view this product
                                </p>

                            </div>

                        </div>

                        <div className="row justify-content-start pb-3 pt-4 border-box">

                            <div className="col-12">

                                {/*{this.state.codeImg && <img src={this.state.codeImg} />}*/}
                                {/*{this.state.codeImg && <img src={`data:image/png;base64,${this.state.codeImg}`}/> }*/}

                                <img src={"http://api.makealoop.io/api/1/product/"+this.state.item.id+"/code?u="+frontEndUrl+"product-cycle-detail/"+this.state.item.id} />

                            </div>
                        </div>



                        {/*<div className="row justify-content-start pb-3 pt-3 ">*/}

                            {/*<div className="col-12">*/}
                                {/*<h5 className={"text-bold blue-text"}>Product Journey</h5>*/}
                            {/*</div>*/}

                            {/*<div className="col-12">*/}
                                {/*<p  style={{fontSize:"16px"}} className={"text-gray-light "}>*/}
                                    {/*Click on an icon to see more information.*/}
                                {/*</p>*/}

                            {/*</div>*/}

                        {/*</div>*/}

                        {/*<div className="row justify-content-start pb-3 pt-4 border-box">*/}

                            {/*<div className="col-12">*/}


                          {/*<CustomizedTimeline />*/}
                            {/*</div>*/}
                        {/*</div>*/}





                        <div className="row justify-content-start pb-3 pt-3 ">

                            <div className="col-12">
                                <h5 className={"text-bold blue-text"}>Searches</h5>
                            </div>

                            <div className="col-12">
                                <p  style={{fontSize:"16px"}} className={"text-gray-light "}>
                                    All searches assigned to this product.
                                </p>

                            </div>

                        </div>



                        <div className="row justify-content-start pb-3 pt-4 border-box">

                            <div className="col-12">




                                {this.state.searches.map((item)=>
                                    <div  style={{border:"none"}} data-name={item.title}  className="row mr-2 ml-2 selection-row selected-row p-3 mb-3  " onClick={this.selectProduct}>

                                        <div  className="col-10">
                                          {/*<Link to={"/search"}>*/}
                                            <p className={"blue-text "} style={{fontSize:"16px"}}>{item.name}</p>
                                          {/*</Link>*/}
                                        </div>
                                        <div className="col-2">
                                            <NavigateNextIcon/>
                                        </div>
                                    </div>

                                )}



                            </div>
                        </div>




                    </div>
                    <div className={"container"}>

                        {/*<div className="row  justify-content-start search-container  pb-4">*/}
                            {/*<div className={"col-1"}>*/}
                                {/*<img className={"icon-about"} src={ListIcon} />*/}
                            {/*</div>*/}
                            {/*<div className={"col-auto"}>*/}

                                {/*<p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Category</p>*/}
                                {/*<p style={{fontSize:"18px"}} className="  mb-1">{this.state.item.category} ></p>*/}
                                {/*<p style={{fontSize:"18px"}} className="  mb-1">{this.state.item.type}</p>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="row  justify-content-start search-container  pb-4">*/}
                            {/*<div className={"col-1"}>*/}
                                {/*<img className={"icon-about"} src={AmountIcon} />*/}
                            {/*</div>*/}
                            {/*<div className={"col-auto"}>*/}

                                {/*<p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Amount</p>*/}
                                {/*<p style={{fontSize:"18px"}} className="  mb-1"> {this.state.item.volume} {this.state.item.units}</p>*/}
                            {/*</div>*/}
                        {/*</div>*/}


                        {/*<div className="row  justify-content-start search-container  pb-4">*/}
                            {/*<div className={"col-1"}>*/}
                                {/*<img className={"icon-about"} src={StateIcon} />*/}
                            {/*</div>*/}
                            {/*<div className={"col-auto"}>*/}

                                {/*<p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">State</p>*/}
                                {/*<p style={{fontSize:"18px"}} className="  mb-1">{this.state.item.state} </p>*/}
                            {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="row  justify-content-start search-container  pb-4">*/}
                            {/*<div className={"col-1"}>*/}
                                {/*<img className={"icon-about"} src={CalenderIcon} />*/}
                            {/*</div>*/}
                            {/*<div className={"col-auto"}>*/}

                                {/*<p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Required by </p>*/}
                                {/*<p style={{fontSize:"18px"}} className="  mb-1">*/}
                                    {/*<Moment   unix  >*/}
                                        {/*{this.state.item.availableFrom}*/}
                                    {/*</Moment>*/}
                                {/*</p>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="row  justify-content-start search-container  pb-4">*/}
                            {/*<div className={"col-1"}>*/}
                                {/*<img className={"icon-about"} src={MarkerIcon} />*/}
                            {/*</div>*/}
                            {/*<div className={"col-auto"}>*/}

                                {/*<p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Delivery From</p>*/}
                                {/*<p style={{fontSize:"18px"}} className="  mb-1">Mapledown, Which Hill Lane,</p>*/}
                                {/*<p style={{fontSize:"18px"}} className="  mb-1">Woking, Surrey, GU22 0AH</p>*/}
                            {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="container container-divider">*/}
                            {/*<div className="row">*/}
                            {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="container mt-4 mb-5 pb-5 ">*/}

                            {/*<div className="row no-gutters mb-5">*/}
                                {/*<div className="col-12 mb-4">*/}
                                    {/*<h5 className="mb-1">About the seller  </h5>*/}
                                {/*</div>*/}
                                {/*<div className="col-auto ">*/}
                                    {/*<figure className="avatar avatar-60 border-0"><img src={TescoImg} alt="" /></figure>*/}
                                {/*</div>*/}
                                {/*<div className="col pl-2 align-self-center">*/}
                                    {/*<div className="row no-gutters">*/}
                                        {/*<div className="col-12">*/}


                                            {/*<p style={{fontSize:"18px"}} className=" ">@Tesco</p>*/}
                                            {/*<p style={{fontSize:"18px"}} className="">48 items listed | 4 cycles</p>*/}

                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}





                    </div>

                </div>



            </div>
        );
    }
}



const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

  function CustomizedTimeline() {
    const classes = useStyles();

    return (
        <Timeline align="alternate">
            <TimelineItem>
                {/*<TimelineOppositeContent>*/}
                    {/*<Typography variant="body2" color="textSecondary">*/}
                        {/*9:30 am*/}
                    {/*</Typography>*/}
                {/*</TimelineOppositeContent>*/}
                <TimelineSeparator>
                    <TimelineDot>
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company A
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Plastics</p>
                            <p>4 Kgs</p>
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                {/*<TimelineOppositeContent>*/}
                    {/*<Typography variant="body2" color="textSecondary">*/}
                        {/*10:00 am*/}
                    {/*</Typography>*/}
                {/*</TimelineOppositeContent>*/}
                <TimelineSeparator>
                    <TimelineDot color="primary">
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company B
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Paper and Card </p>
                            <p>5 Kgs</p>

                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary" variant="outlined">
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector className={classes.secondaryTail} />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company C
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Other </p>
                            <p>9 Kgs</p>

                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>

        </Timeline>
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
)(ProductDetail);
