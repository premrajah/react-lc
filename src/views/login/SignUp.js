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


class  SignUp extends Component {


    constructor(props) {

        super(props)

        // this.state = {
        //
        //     timerEnd: false,
        //     count : 0,
        //     nextIntervalFlag: false,
        //     active: 0   //0 logn. 1- sign up , 3 -search
        // }


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


        this.hideLoginPopUp = this.hideLoginPopUp.bind(this);


    }
    hideLoginPopUp = (event) => {


        // document.body.classList.add('sidemenu-open');
        this.props.showLoginPopUp(false)

    }


    goHome(){


        history.push("/")
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



    componentWillMount(){

    }

    componentDidMount(){

    }



    goToSignIn(){

        this.props.setLoginPopUpStatus(0)

    }

    goToSignUp(){


        this.setState({

            active:1
        })
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
        if(!fields["firstName"]){
            formIsValid = false;
            errors["firstName"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }


        if(!fields["lastName"]){
            formIsValid = false;
            errors["lastName"] = "Required";
        }
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
            const firstName = data.get("firstName")
            const lastName = data.get("lastName")


            this.props.signUp({"email": username, "password": password,"lastName":lastName,"firstName":firstName})


            // alert("valid")

        }else {


            // alert("invalid")
        }



    }



    render() {

        return (

            <>

                <div className="container  ">
                    <div className="row no-gutters">
                        <div className="col-12">
                            <h3 className={"blue-text text-heading text-center"}>Sign Up
                            </h3>

                        </div>
                    </div>

                    <form  onSubmit={this.handleSubmit}>
                    <div className="row no-gutters justify-content-center ">

                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic" label="First Name" variant="outlined" fullWidth={true} name={"firstName"} onChange={this.handleChange.bind(this, "firstName")} />

                            {this.state.errors["firstName"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["firstName"]}</span>}

                        </div>

                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic" label="Last Name" variant="outlined" fullWidth={true} name={"lastName"}  onChange={this.handleChange.bind(this, "lastName")} />

                            {this.state.errors["lastName"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["lastName"]}</span>}

                        </div>

                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChange.bind(this, "email")} />

                            {this.state.errors["email"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["email"]}</span>}

                        </div>
                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic" label="Company" variant="outlined" fullWidth={true} />


                        </div>
                        <div className="col-12 mt-4 justify-content-center">
                            <p className={"text-mute small"}>Don’t see your company here?</p>
                            <p className={"forgot-password-link text-mute small"}>Create a new company profile</p>
                        </div>

                        <div className="col-12 mt-4 justify-content-center">


                            <p className={"text-mute small"}>
                                <Checkbox
                                    name={"agree"}
                           onChange={this.handleChange.bind(this, "agree")}
                          checked={true}
                                // color="#07AD88"
                                style={{color:"#07AD88"}}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                                I agree to the <span className={"forgot-password-link"}>Loopcycle Terms</span></p>
                            {this.state.errors["agree"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["agree"]}</span>}

                        </div>


                        <div className="col-12 mt-4">

                            <TextField onChange={this.handleChange.bind(this, "password")} name={"password"} id="outlined-basic" label="Password" variant="outlined" fullWidth={true} type={"password"} />

                            {this.state.errors["password"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["password"]}</span>}

                        </div>

                        {this.props.signUpFailed &&

                        <div className="col-12 mt-4">
                            <Alert key={"alert"} variant={"danger"}>
                                {this.props.signUpError}
                            </Alert>
                        </div>
                        }

                        <div className="col-12 mt-4">

                            <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Create Account</button>
                        </div>


                        <div className="col-12 mt-4">

                            <p className={"or-text-divider"}><span>or</span></p>
                        </div>
                        <div className="col-auto mt-4 justify-content-center">

                            <button onClick={this.goToSignIn}  type="button" className="mt-1 mb-4 btn topBtn btn-outline-primary sign-up-btn">Log In</button>
                        </div>

                    </div>
                    </form>

                </div>



            </>





        );
    }
}




const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        signUpFailed: state.signUpFailed,
        signUpError: state.signUpError,
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
)(SignUp);
