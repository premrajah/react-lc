import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { baseUrl } from '../../Util/Constants'
import history from "../../History/history";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from "axios/index";



const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


class ForgotPassword extends Component {


    constructor(props) {

        super(props)

        this.state = {
            fields: {},
            errors: {},
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0   //0 logn. 1- sign up , 3 -search,


        }
        this.goToSignUp = this.goToSignUp.bind(this)
        this.goToSignIn = this.goToSignIn.bind(this)
        this.goToSuccess = this.goToSuccess.bind(this)
        this.forGotPass = this.forGotPass.bind(this)
        this.accountRecover = this.accountRecover.bind(this)
        this.resetPassword = this.resetPassword.bind(this)
        this.resetPasswordSuccessLogin = this.resetPasswordSuccessLogin.bind(this)
        this.goHome = this.goHome.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValidation = this.handleValidation.bind(this);


    }


    goHome() {

        history.push("/")
    }



    handleValidation() {
        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;




        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errors: errors });
        return formIsValid;
    }



    handleChange(field, e) {

        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }


    handleSubmit = event => {

        event.preventDefault();


        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);
            const username = data.get("email")

            // this.props.logIn({"email": username, "password": password})


            // alert(data.get("email"))

            axios.post(baseUrl + "user/reset",
                { "email": data.email })
                .then(res => {

                    console.log(res.data)

                    document.body.classList.add('search-body');


                    if (res.data.status.code === 200) {


                        console.log("login success found")


                    } else {

                        console.log("login failed " + res.data.content.message)

                    }


                }).catch(error => {

                    console.log("login error found ")
                    console.log(error.response.data)

                    // dispatch({type: "LOGIN_FAILED", value : error})
                    // dispatch(stopLoading())
                    // dispatch(loginFailed(error.response.data.content.message))
                    // dispatch({type: "LOGIN_ERROR", value : res.data.content.message})

                    // console.log(error)

                });




        } else {


        }






    }

    resetPasswordSuccessLogin() {



        this.setState({

            active: 5
        })


    }
    resetPassword() {

        this.setState({

            active: 4
        })

    }
    accountRecover() {

        this.props.setLoginPopUpStatus(3)

        // this.setState({
        //
        //     active:3
        // })

    }

    goToSuccess() {
        this.setState({

            active: 6
        })



    }

    forGotPass() {




        this.setState({

            active: 2
        })
    }



    componentWillMount() {

    }

    componentDidMount() {


    }







    intervalJasmineAnim



    goToSignIn() {


        this.setState({

            active: 0
        })
    }

    goToSignUp() {


        this.setState({

            active: 1
        })
    }



    render() {

        return (

            <>
                <div className="container  ">
                    <div className="row no-gutters">
                        <div className="col-12">
                            <h3 className={"blue-text text-heading text-center"}>Forgot your password ?
                            </h3>

                        </div>
                    </div>

                    <form onSubmit={this.handleSubmit}>

                        <div className="row no-gutters justify-content-center ">

                            <div className="col-12 ">

                                <p className={"text-mute small fgt-password-text"}> We’ll send a verification code to your email address. Click on the link in the email to reset your password. </p>

                            </div>



                            <div className="col-12 mt-4">


                                <TextField
                                    type={"email"}
                                    onChange={this.handleChange.bind(this, "email")}
                                    id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} />

                                {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}


                            </div>


                            <div className="col-12 mt-4 mb-4">

                                <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Get Verification Code</button>
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
)(ForgotPassword);
