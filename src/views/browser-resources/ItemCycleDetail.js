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
import BottomDetail from '../../img/bottom-detail.png';
import BottomDetailInfo from '../../img/bottom-detail-info.png';

import ProImg from '../../img/img-product.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import PaperImg from '../../img/paper-big.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Camera from '@material-ui/icons/CameraAlt';
import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar,Spinner, Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

import {baseUrl} from "../../Util/Constants";
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
import TextField from '@material-ui/core/TextField';


class  ItemCycleDetail extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false,
            item:{},
            codeImg:null,
            searches:[],
            fields: {},
            errors: {},
            active: 0  , //0 logn. 1- sign up , 3 -search,
            formValid : false
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




    handleValidationSubmitGreen(){

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["password"]){
            formIsValid = false;
            // errors["password"] = "Required";
        }


        if(!fields["email"]){
            formIsValid = false;
            // errors["email"] = "Required";
        }

        if(typeof fields["email"] !== "undefined"){

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                // errors["email"] = "Invalid email address";
            }
        }


        this.setState({formValid: formIsValid});


    }



    handleValidation(){

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["password"]){
            formIsValid = false;
            errors["password"] = "Required";
        }


        if(!fields["email"]){
            formIsValid = false;
            errors["email"] = "Required";
        }

        if(typeof fields["email"] !== "undefined"){

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }



    handleChange(field, e){
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({fields});

        this.handleValidationSubmitGreen()
    }


    handleSubmit = event => {

        event.preventDefault();


        const form = event.currentTarget;

        if (this.handleValidation()){
            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const username = data.get("email")
            const password = data.get("password")


            this.props.logIn({"email": username, "password": password})

        }else {

            }


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



        var url = baseUrl+"code/"+this.slug;

        console.log(url)

        // baseUrl+"product/"+this.slug


        axios.get(url
            // {
            //     headers: {
            //         "Authorization" : "Bearer "+this.props.userDetail.token
            //     }
            // }
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

                    console.log("Code  error")

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

                    <div className="container mt-5 pt-5 ">



                        {!this.props.isLoggedIn &&   <>

                            <div className="row justify-content-start pb-3 pt-4 listing-row-border ">

                            <div className="col-12">
                                <h3 className={"blue-text text-heading"}>Register my product
                                </h3>

                            </div>

                        </div>
                          <div className="row   ">
                            <div className="row no-gutters">
                                <div className="col-12 p-3">
                                    <p >Congratulations on your recent purchase!
                                    </p>

                                    <p >To register your product with Loopcycle, please sign in below or <span className={"blue-text forgot-password-link"}>sign up</span>.

                                    </p>

                                    <p >Register your product and we’ll give you back 5% of the product’s original cost if you eventually sell it on the platform.

                                    </p>

                                </div>
                            </div>

                              <div className="row no-gutters">




                                  <div className="col-12 p-3">

                                <form  onSubmit={this.handleSubmit}>
                                <div className="row no-gutters justify-content-center">
                                    <div className="col-12">

                                        <TextField
                                            type={"email"}
                                            onChange={this.handleChange.bind(this, "email")}
                                            id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"}/>

                                        {this.state.errors["email"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["email"]}</span>}



                                    </div>

                                    <div className="col-12 mt-4">

                                        <TextField type={"password"} onChange={this.handleChange.bind(this, "password")}   id="outlined-basic" label="Password" variant="outlined" fullWidth={true} name={"password"} />

                                        {this.state.errors["password"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["password"]}</span>}

                                    </div>

                                    <div className="col-12 mt-4">
                                        <p onClick={this.forGotPass} className={"forgot-password-link text-mute small"}>Forgot your password? </p>
                                    </div>


                                    {this.props.loginFailed &&

                                    <div className="col-12 mt-4">
                                        <Alert key={"alert"} variant={"danger"}>
                                            {this.props.loginError}
                                        </Alert>
                                    </div>
                                    }

                                    <div className="col-12 mt-4">

                                        <button type={"submit"} className={this.state.formValid?"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn":"btn btn-default btn-lg btn-rounded shadow btn-block btn-gray login-btn"}>
                                            { this.props.loading && <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"

                                            /> }

                                            { this.props.loading  ? "Wait.." : "Log In"}

                                        </button>
                                    </div>


                                </div>

                            </form>
                                  </div>

                              </div>

                        </div>

                        </>}



                        <div>

                            <div className="col-12 mt-5 mb-4" >
                                <h3 className={"blue-text text-heading"}>Product Details
                                </h3>

                            </div>

                            <div className="col-12 mt-5 mb-4" >

                                <img src={ProImg}  />
                            </div>

                        </div>


                        <div className="row justify-content-start pb-3 pt-4 ">



                            <div className="col-12">
                                <h3 className={"blue-text text-bold"}>{this.state.item.title  }</h3>
                            </div>

                            <div className="col-12  pb-3 listing-row-border">
                                <p>Manufactured by  By <span className={"green-text"}> {this.state.item.org_id}</span></p>
                            </div>

                            <div className="col-12 mt-3 pb-3 listing-row-border">
                                <p>{this.state.item.description  }</p>
                            </div>
                            {/*<div className="col-12 mt-3 pb-3 ">*/}
                                {/*<p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{this.state.item.purpose  }</p>*/}

                                {/*<p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{"Shelving" }</p>*/}
                                {/*<p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{"PP" }</p>*/}

                            {/*</div>*/}

                        </div>


                        <div className="row justify-content-start pb-3 pt-4 border-box">

                            <div className="col-12">

                                {/*{this.state.codeImg && <img src={this.state.codeImg} />}*/}

                                {/*{this.state.codeImg && <img src={"base64,"+this.state.codeImg}/> }*/}

                                {/*{this.state.codeImg && <img src={this.state.codeImg}/> }*/}


                                <img src={"http://api.makealoop.io/api/1/product/"+this.state.item.id+"/code"} />



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


                        <div className="row justify-content-center pb-3 pt-4 ">

                            <div style={{textAlign:"center"}} className="col-12">


                                <img style={{width:"98%"}} src={BottomDetailInfo} />
                            </div>
                        </div>



                        <div className="row justify-content-start pb-3 pt-3 ">

                            <div className="col-12">
                                <h5 className={"text-bold blue-text"}>Product Provenance</h5>
                            </div>

                            <div className="col-12">
                                <p  style={{fontSize:"16px"}} className={"text-gray-light "}>
                                    See where this product has travelled since the day it was created.
                                </p>

                            </div>

                        </div>


                        <div className="row justify-content-center pb-3 pt-4 border-box">

                            <div style={{textAlign:"center"}} className="col-12">


                                <img style={{width:"90%"}} src={BottomDetail} />

                            </div>
                        </div>





                        {/*<div className="row justify-content-start pb-3 pt-3 ">*/}
                        
                            {/*<div className="col-12">*/}
                                {/*<h5 className={"text-bold blue-text"}>Searches</h5>*/}
                            {/*</div>*/}
                        
                            {/*<div className="col-12">*/}
                                {/*<p  style={{fontSize:"16px"}} className={"text-gray-light "}>*/}
                                    {/*All searches assigned to this product.*/}
                                {/*</p>*/}
                        
                            {/*</div>*/}
                        
                        {/*</div>*/}



                        {/*<div className="row justify-content-start pb-3 pt-4 border-box">*/}

                            {/*<div className="col-12">*/}




                                {/*{this.state.searches.map((item)=>*/}
                                    {/*<div  style={{border:"none"}} data-name={item.title}  className="row mr-2 ml-2 selection-row selected-row p-3 mb-3  " onClick={this.selectProduct}>*/}

                                        {/*<div  className="col-10">*/}
                                            {/*/!*<Link to={"/search"}>*!/*/}
                                            {/*<p className={"blue-text "} style={{fontSize:"16px"}}>{item.name}</p>*/}
                                            {/*/!*</Link>*!/*/}
                                        {/*</div>*/}
                                        {/*<div className="col-2">*/}
                                            {/*<NavigateNextIcon/>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}

                                {/*)}*/}



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
)(ItemCycleDetail);
