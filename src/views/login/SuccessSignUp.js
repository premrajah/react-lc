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

import HandIcon from '../../img/icons/hand.png';
import {baseUrl,baseImgUrl} from  '../../Util/Constants'

import SearchIcon from '../../img/icons/search-icon.png';

import ShippingIcon from '../../img/icons/shipping-icon.png';
import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";

import history from "../../History/history";
import MenuIcon from '@material-ui/icons/Menu';
import MenuOutline from '@material-ui/icons/MailOutline';
import Close from '@material-ui/icons/Close';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar,Alert} from 'react-bootstrap';

import Checkbox from '@material-ui/core/Checkbox';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';



const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


class  RecoverPassword extends Component {


    constructor(props) {

        super(props)

        this.state = {
            fields: {},
            errors: {},
            timerEnd: false,
            count : 0,
            nextIntervalFlag: false,
            active: 0   //0 logn. 1- sign up , 3 -search,


        }
        this.goToSignUp=this.goToSignUp.bind(this)
        this.goToSignIn=this.goToSignIn.bind(this)
        this.goToSuccess=this.goToSuccess.bind(this)
        this.forGotPass=this.forGotPass.bind(this)
        this.accountRecover=this.accountRecover.bind(this)
        this.resetPassword=this.resetPassword.bind(this)
        this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)

        this.goHome=this.goHome.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValidation = this.handleValidation.bind(this);


    }


    goHome(){

        history.push("/")
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

        // alert("valid")

        }else {


         // alert("invalid")
     }






    }

    resetPasswordSuccessLogin(){



        this.setState({

            active:5
        })


    }
    resetPassword(){

        this.setState({

            active:4
        })

    }
    accountRecover(){



        this.setState({

            active:3
        })

    }

    goToSuccess(){
        this.setState({

            active:6
        })



    }

    forGotPass(){




        this.setState({

            active:2
        })
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



    render() {

        return (

            <>
                <div className="container  p-2">
                </div>
                <div className="container  pt-2 pb-3">

                    <div className="row no-gutters">
                        <div className="col-auto">

                            <img src={LogoNew} alt=""
                                 className="header-logo" />
                            <img className={"text-logo-home-right"} src={LogoText} />
                        </div>


                        <div className="col text-right">


                            <Link to={"/"} > < Close onClick={this.goHome} className="blue-text" style={{ fontSize: 32 }} /> </Link>

                        </div>


                    </div>
                </div>


                <div className="container   pb-5 pt-5">
                    <div className="row no-gutters justify-content-center">
                        <div className="col-auto">
                            <h3 className={"blue-text text-heading"}>Success!
                            </h3>

                        </div>
                    </div>
                    <div className="row no-gutters justify-content-center p-5">
                        <div className="col-auto p-4   justify-content-center">

                          <img  src={SendIcon} className={"send-icon-middle"} />

                        </div>


                    </div>
                    <div className="row no-gutters justify-content-center mt-5">
                        <div className="col-12 ">

                            <p className={"text-mute "} style={{textAlign:"center"}}> A verification link has been sent to<br/>
                                your email account.  </p>

                        </div>


                        <div className="col-4 mt-5">

                            <button onClick={this.goToSignIn} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green"}>Log In <NavigateNextIcon /></button>
                        </div>


                        <div className="col-12 mt-4">
                            <p style={{textAlign:"center"}} className={"text-mute small"}>Didn’t get a link? <span className={"forgot-password-link"}> Resend Verification</span></p>
                        </div>


                    </div>



                </div>


            </>





        );
    }
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




    };
};

const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),


    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(RecoverPassword);
