import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { Router, Route, Switch , Link} from "react-router-dom";

import history from "../../History/history";


import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar,Alert} from 'react-bootstrap';


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


        this.hideLoginPopUp = this.hideLoginPopUp.bind(this);


    }
    hideLoginPopUp = (event) => {


        // document.body.classList.add('sidemenu-open');
        this.props.showLoginPopUp(false)

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

        this.props.setLoginPopUpStatus(4)


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


                <div className="container  ">
                    <div className="row no-gutters">
                        <div className="col-12">
                            <h3 className={"blue-text text-heading text-center"}>Account Recovery
                            </h3>

                        </div>
                    </div>
                    <div className="row no-gutters justify-content-center">

                        <div className="col-12 ">

                            <p className={"text-mute small"}>A verification code was just sent to your email address.  </p>

                        </div>



                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic" label="Enter Code" variant="outlined" fullWidth={true} />


                        </div>

                        <div className="col-12 mt-4">
    <p className={"text-mute small"}>Didn’t get a link? <span className={"forgot-password-link"}> Resend Verification</span></p>
               </div>


                    </div>
                    <div className="row no-gutters justify-content-end mt-3">




                        <div className="col-3 mt-4">

                            <button onClick={this.resetPassword} className={"btn btn-default mb-4 btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Next</button>
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
)(RecoverPassword);
