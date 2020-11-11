import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Router, Route, Switch , Link} from "react-router-dom";
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import ListIcon from '../../img/icons/list.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import PaperImg from '../../img/paper-big.png';
import Sidebar from '../menu/Sidebar'
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';

import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";

class  ItemDetail extends Component {


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

    intervalJasmineAnim





    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper accountpage">

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
                                <p  style={{fontSize:"16px"}} className={"text-gray-light "}>Looking for disposable food boxes. Any sizes are suitable. Please message me if you have any available.
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

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Surrey, UK</p>
                                <p style={{fontSize:"18px"}} className="  mb-1">Paper and Card ></p>
                                <p style={{fontSize:"18px"}} className="  mb-1">Disposable Food Boxes</p>
                            </div>
                        </div>
                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={AmountIcon} />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Amount</p>
                                <p style={{fontSize:"18px"}} className="  mb-1">10 Kgs</p>
                            </div>
                        </div>


                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={StateIcon} />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">State</p>
                                <p style={{fontSize:"18px"}} className="  mb-1">Bailed</p>
                            </div>
                        </div>

                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={CalenderIcon} />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Required by </p>
                                <p style={{fontSize:"18px"}} className="  mb-1">June 1, 2020 </p>
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

                            <button type="button" className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Cancel Listing
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


export default ItemDetail;
