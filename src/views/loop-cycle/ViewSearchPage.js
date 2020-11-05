import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import PaperImg from '../../img/paper.png';


import AppBar from '@material-ui/core/AppBar';
import Sidebar from '../menu/Sidebar'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Camera from '@material-ui/icons/CameraAlt';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';

import { makeStyles } from '@material-ui/core/styles';

import Close from '@material-ui/icons/Close';
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";

class  ViewSearchPage extends Component {


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
