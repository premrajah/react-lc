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
import SendIcon from '../../img/send-icon.png';
import Select from '@material-ui/core/Select';
import HandIcon from '../../img/icons/hand.png';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '../../img/icons/search-icon.png';

import ShippingIcon from '../../img/icons/shipping-icon.png';
import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";
import InputLabel from '@material-ui/core/InputLabel';
import history from "../../History/history";
import MenuIcon from '@material-ui/icons/Menu';
import MenuOutline from '@material-ui/icons/MailOutline';
import Close from '@material-ui/icons/Close';
import NavigateBefore from '@material-ui/icons/NavigateBefore';


import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import PaperImg from '../../img/paper.png';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AppBar from '@material-ui/core/AppBar';

import TextField from '@material-ui/core/TextField';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar,ProgressBar} from 'react-bootstrap';

import Checkbox from '@material-ui/core/Checkbox';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import clsx from 'clsx';
import SearchGray from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import {withStyles} from "@material-ui/core/styles/index";
import CalGrey from '../../img/icons/calender-dgray.png';

import MarkerGrey from '../../img/icons/marker-dgray.png';

import LinkGray from '../../img/icons/link-icon.png';
import ViewSearch from "../loop-cycle/ViewSearch";

import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import HandGreyIcon from '../../img/icons/hand-gray.png';
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';
import ListIcon from '../../img/icons/list.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import LinearProgress from '@material-ui/core/LinearProgress';
import HeaderWhiteBack from '../header/HeaderWhiteBack'
import ResourceItem from  './ResourceItem'

// import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// pick a date util library
// import MomentUtils from '@date-io/moment';
// import DateFnsUtils from '@date-io/date-fns';
// import LuxonUtils from '@date-io/luxon';
// import DateFnsUtils from 'date-i-fns';
// import DateFnsUtils from '@date-io/date-fns';

import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import {saveKey, saveUserToken} from "../../LocalStorage/user";
import {loginFailed} from "../../store/actions/actions";


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,

    },
}));


class  SearchMatches extends Component {



    slug
    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0,  //0 logn. 1- sign up , 3 -search,
            categories: [],
            subCategories: [],
            catSelected: {},
            subCatSelected: {},
            stateSelected: null,
            states:[],
            page:1,
            fields: {},
            errors: {},
            units:[],
            progressBar: 33,
            products:[],
            productSelected: null,
            nextBlue: false,
            nextBlueAddDetail: false,
            nextBlueViewSearch: false,
            matches:[],
            unitSelected: null,
            volumeSelected: null,
            title: null,
            description: null,
            volume:null,
            createSearchData:null,
            resourcesMatched:[],



        }

        this.slug = props.match.params.slug
        this.loadMatches=this.loadMatches.bind(this)

    }


    loadMatches(){


        for (var i=0;i<this.state.createSearchData.resources.length;i++){

            axios.get(baseUrl+"resource/"+this.state.createSearchData.resources[i],
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

                    var resources = this.state.resourcesMatched


                    resources.push(response)

                        this.setState({

                            resourcesMatched: resources
                        })

                    },
                    (error) => {

                        var status = error.response.status
                        console.log("resource error")
                        console.log(error)

                    }
                );
        }

    }


    interval

    componentWillMount(){

    }

    componentDidMount(){

        this.getResources()
    }



    getResources(){


        axios.get(baseUrl+"search/"+this.slug,
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

                        createSearchData: response.content
                    })


                this.loadMatches()

                },
                (error) => {

                    var status = error.response.status

                    console.log("resource error")

                    console.log(error)


                }
            );

    }


    goToSignIn(){


        this.setState({

            active:0
        })
    }

    goToSignUp(){


        this.setState({

            active:1
        })
    }

     classes = useStylesSelect;



    render() {

        const    classes = withStyles();
        const classesBottom = withStyles();


        return (

            <>
                <div className="container  p-2">
                </div>

                    <HeaderWhiteBack history={this.props.history} heading={"View Matches"}/>


                {this.state.resourcesMatched&& <>
                    {this.state.resourcesMatched.length>0?<div className="container   pb-4 ">


                        {this.state.resourcesMatched.map((item)=>

                        <ResourceItem item={item} searchId={this.state.createSearchData.id}/>

                        )}


                </div>:<div className={" column-empty-message"}>
                    <p>This search currently has no matches</p>
                </div>

                    }
                    </>
                        }
            </>

        );
    }
}

const useStylesBottomBar = makeStyles((theme) => ({
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
    const classes = useStylesBottomBar();

    return (
        <React.Fragment>
            <CssBaseline/>

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                        <div className="col-auto">
                            <button type="button"
                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Back

                            </button>
                        </div>
                        <div className="col-auto" style={{margin:"auto"}}>

                         <p  className={"blue-text"}> Page 2/3</p>
                        </div>
                        <div className="col-auto">

                            <button type="button"
                                    className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                Next

                            </button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}



function UnitSelect(props) {
    const classes = useStylesSelect();
    const [state, setState] = React.useState({
        unit: '',
        name: 'hai',
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    return (
        <div>

            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Unit</InputLabel>
                <Select
                    name={"unit"}
                    native
                    value={state.age}
                    onChange={handleChange}
                    label="Age"
                    inputProps={{
                        name: 'unit',
                        id: 'outlined-age-native-simple',
                    }}
                >

                    {props.units.map((item)=>

                    <option value={"Kg"}>{item}</option>

                        )}

                </Select>
            </FormControl>

        </div>
    );
}

const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        width: "100%"
        // minWidth: auto,
    },
    selectEmpty: {
        marginTop: theme.spacing(0),
    },
}));





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
)(SearchMatches);