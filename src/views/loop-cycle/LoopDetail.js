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

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



class  LoopDetail extends Component {


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

                    <div className="container header-container pt-3 pb-3">

                        <div className="row no-gutters ">
                            <div className="col-auto" style={{margin:"auto"}}>

                                <NavigateBefore  style={{ fontSize: 32 }}/>
                            </div>

                            <div className="col text-center blue-text"  style={{margin:"auto"}}>
                                <p>Loop Details </p>
                            </div>

                            <div className="col-auto">

                                <button className="btn   btn-link text-dark menu-btn">
                                    <Close className="" style={{ fontSize: 32 }} />

                                </button>
                            </div>


                        </div>
                    </div>


                    <BottomAppBar/>
                    <div className="container  pt-3 pb-3">


                        <LoopAccordion />
                    </div>



                </div>



            </div>
        );
    }
}



const useStylesAccordian = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));



 function LoopAccordion() {
    const classes = useStylesAccordian();

    return (
        <div className={classes.root}>
            <p className={"heading-accordian small"}>From</p>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>

                        <div className="row no-gutters justify-content-center ">

                            <div className={"col-auto"}>

                                <figure className="avatar avatar-60 border-0"><img src="img/user1.png" alt="" /></figure>
                            </div>
                            <div className={"col-auto pl-3 content-box-listing"}>
                                <p style={{fontSize:"18px"}} className=" mb-1">Tesco</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">Paper Card</p>

                            </div>

                        </div>


                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                       <FromContent />
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <p className={"heading-accordian small"}>To</p>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography className={classes.heading}>

                        <div className="row no-gutters justify-content-center ">

                            <div className={"col-auto"}>

                                <figure className="avatar avatar-60 border-0"><img src="img/user1.png" alt="" /></figure>
                            </div>
                            <div className={"col-auto pl-3 content-box-listing"}>
                                <p style={{fontSize:"18px"}} className=" mb-1">Company B</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">@company-b</p>

                            </div>

                        </div>

                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <ToContent />
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <p className={"heading-accordian small"}>Via</p>
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography className={classes.heading}>
                        <div className="row no-gutters justify-content-center ">

                            <div className={"col-auto"}>

                                <figure className="avatar avatar-60 border-0"><img src="img/user1.png" alt="" /></figure>
                            </div>
                            <div className={"col-auto pl-3 content-box-listing"}>
                                <p style={{fontSize:"18px"}} className=" mb-1">DPD Group</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">@dpd</p>

                            </div>

                        </div>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <ViaContent />
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}


function FromContent() {




     return(


         <>


             <div className="row no-gutters  justify-content-center">



                 <div className="col-auto ">
                     <img className={"img-fluid"}  src={PaperImg} />

                 </div>
             </div>

             <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                 <div className="col-12">
                     <p className={"green-text text-heading"}>@Tesco
                     </p>

                 </div>
                 <div className="col-12 mt-2">
                     <h5 className={"blue-text text-heading"}>Food boxes needed
                     </h5>

                 </div>
             </div>


             <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                 <div className="col-auto">
                     <p  style={{fontSize:"16px"}} className={"text-gray-light "}>Lots of disposable food boxes. In good condition, cleaned thoroughly. Only used once.
                         Please message if you are interested.
                     </p>

                 </div>

             </div>

             <div className="row justify-content-start pb-4 pt-3 ">
                 <div className="col-auto">
                     <h6 className={""}>Item Details
                     </h6>

                 </div>
             </div>

         </>
     );
}
function ToContent() {




    return(


        <>


            <div className="row no-gutters  justify-content-center">



                <div className="col-auto ">
                    <img className={"img-fluid"}  src={PaperImg} />

                </div>
            </div>

            <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                <div className="col-12">
                    <p className={"green-text text-heading"}>@Tesco
                    </p>

                </div>
                <div className="col-12 mt-2">
                    <h5 className={"blue-text text-heading"}>Food boxes needed
                    </h5>

                </div>
            </div>


            <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                <div className="col-auto">
                    <p  style={{fontSize:"16px"}} className={"text-gray-light "}>Lots of disposable food boxes. In good condition, cleaned thoroughly. Only used once.
                        Please message if you are interested.
                    </p>

                </div>

            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <h6 className={""}>Item Details
                    </h6>

                </div>
            </div>

        </>
    );
}
function ViaContent() {




    return(


        <>


            <div className="row no-gutters  justify-content-center">



                <div className="col-auto ">
                    <img className={"img-fluid"}  src={PaperImg} />

                </div>
            </div>

            <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                <div className="col-12">
                    <p className={"green-text text-heading"}>@Tesco
                    </p>

                </div>
                <div className="col-12 mt-2">
                    <h5 className={"blue-text text-heading"}>Food boxes needed
                    </h5>

                </div>
            </div>


            <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                <div className="col-auto">
                    <p  style={{fontSize:"16px"}} className={"text-gray-light "}>Lots of disposable food boxes. In good condition, cleaned thoroughly. Only used once.
                        Please message if you are interested.
                    </p>

                </div>

            </div>

            <div className="row justify-content-start pb-4 pt-3 ">
                <div className="col-auto">
                    <h6 className={""}>Item Details
                    </h6>

                </div>
            </div>

        </>
    );
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
                                Cancel Loop
                            </button>

                        </div>
                        <div className="col-auto">

                            <button type="button"
                                    className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                Select Provider

                            </button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}


export default LoopDetail;
