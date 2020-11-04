import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";

import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';

import AppBar from '@material-ui/core/AppBar';

import { Router, Route, Switch , Link} from "react-router-dom";


import HeaderWhiteBack from '../header/HeaderWhiteBack'
import Sidebar from '../menu/Sidebar'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Camera from '@material-ui/icons/CameraAlt';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';




import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import Moment from 'react-moment';
import ResourceItem from  '../item/ResourceItem'
import { withRouter } from 'react-router-dom'






class  MakeOffer extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null
        }


        this.slug = props.match.params.slug
        this.getResource=this.getResource.bind(this)



    }




    getResource(){


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



    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
    }



    componentWillMount(){

    }

    componentDidMount(){

        this.getResource()

    }





    render() {

        return (
            <div>

                <HeaderWhiteBack history={this.props.history} heading={this.state.item&&this.state.item.name}/>


                <div className="container   pb-4 ">

                    <div className="row mt-5  ">
                        <div className={" col-12"}>
                            <h4 className={"text-bold"}>Make an offer</h4>
                            <p>Please contact the seller to arrange for a delivery provider.  </p>

                        </div>


                    </div>
                    {this.state.item&&<ResourceItem item={this.state.item}/>}



                    <div className="row mt-2 justify-content-center ">
                        <div className={" col-12"}>
                            <Grid justify="center" container spacing={2} alignItems="center">
                                <Grid  xs={1} item>
                                    £
                                </Grid>
                                <Grid  xs={11} item>
                                    <TextField id="input-with-icon-grid"  variant="outlined" />
                                </Grid>
                            </Grid>

                        </div>
                    </div>


                    <div>

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


function BottomAppBar(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline/>

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{margin:"auto",width:"100%"}}>

                        <div className="col-12">

                            <Link style={{margin:"auto",width:"100%"}} to={""} type="button"
                                  className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                Make Offer

                            </Link>
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
)(MakeOffer);
