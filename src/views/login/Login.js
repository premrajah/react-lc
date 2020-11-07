import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import history from "../../History/history";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Spinner, Alert } from 'react-bootstrap';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


class Login extends Component {


    constructor(props) {

        super(props)

        this.state = {
            fields: {},
            errors: {},
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
            formValid: false

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
        this.hideLoginPopUp = this.hideLoginPopUp.bind(this);



    }
    hideLoginPopUp = (event) => {


        // document.body.classList.add('sidemenu-open');
        this.props.showLoginPopUp(false)

    }


    goHome() {

        history.push("/")
    }



    handleValidationSubmitGreen() {

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["password"]) {
            formIsValid = false;
            // errors["password"] = "Required";
        }


        if (!fields["email"]) {
            formIsValid = false;
            // errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                // errors["email"] = "Invalid email address";
            }
        }




        this.setState({ formValid: formIsValid });




        // return formIsValid;




    }



    handleValidation() {

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Required";
        }


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

        this.handleValidationSubmitGreen()
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
            const password = data.get("password")


            this.props.logIn({ "email": username, "password": password })

            // alert("valid")

        } else {


            // alert("invalid")
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



        this.setState({

            active: 3
        })

    }

    goToSuccess() {
        this.setState({

            active: 6
        })



    }

    forGotPass() {



        this.props.setLoginPopUpStatus(2)


        //
        // this.setState({
        //
        //     active:2
        // })
    }




    componentWillMount() {

    }

    componentDidMount() {


    }





    goToSignIn() {


        this.setState({

            active: 0
        })
    }

    goToSignUp() {


        this.props.setLoginPopUpStatus(1)
    }



    render() {

        return (

            <>

                <div className="container  ">
                    <div className="row no-gutters">
                        <div className="col-12">
                            <h3 className={"blue-text text-heading text-center"}>Log in
                            </h3>

                        </div>
                    </div>

                    <form onSubmit={this.handleSubmit}>
                        <div className="row no-gutters justify-content-center">
                            <div className="col-12">

                                <TextField
                                    type={"email"}
                                    onChange={this.handleChange.bind(this, "email")}
                                    id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} />

                                {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}



                            </div>

                            <div className="col-12 mt-4">

                                <TextField type={"password"} onChange={this.handleChange.bind(this, "password")} id="outlined-basic" label="Password" variant="outlined" fullWidth={true} name={"password"} />

                                {this.state.errors["password"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["password"]}</span>}

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

                                <button type={"submit"} className={this.state.formValid ? "btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn" : "btn btn-default btn-lg btn-rounded shadow btn-block btn-gray login-btn"}>
                                    {this.props.loading && <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"

                                    />}

                                    {this.props.loading ? "Wait.." : "Log In"}

                                </button>
                            </div>


                            <div className="col-12 mt-4">

                                <p className={"or-text-divider"}><span>or</span></p>
                            </div>
                            <div className="col-auto mt-4 justify-content-center">

                                <button
                                    onClick={this.goToSignUp}
                                    type="button" className="mt-1 mb-4 btn topBtn btn-outline-primary sign-up-btn">Sign up</button>



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
)(Login);
