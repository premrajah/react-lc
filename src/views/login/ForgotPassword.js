import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import history from "../../History/history";
import TextField from "@mui/material/TextField";
import axios from "axios/index";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: {},
            errors: {},
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
            resetSubmitStatus: '',
        };
        this.goToSignUp = this.goToSignUp.bind(this);
        this.goToSignIn = this.goToSignIn.bind(this);
        this.goToSuccess = this.goToSuccess.bind(this);
        this.forGotPass = this.forGotPass.bind(this);
        this.accountRecover = this.accountRecover.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.resetPasswordSuccessLogin = this.resetPasswordSuccessLogin.bind(this);
        this.goHome = this.goHome.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }

    goHome() {
        history.push("/");
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    fields["email"].indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    fields["email"].length - lastDotPos > 2
                )
            ) {
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

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({resetSubmitStatus: ""})

        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);
            const username = data.get("email");
            const payload = {email: username}

            axios
                .post(`${baseUrl}user/reset`, payload)
                .then((res) => {
                    this.setState({resetSubmitStatus: <span className="text-success">Email reset link sent successfully. Please check your email.</span>});
                    document.getElementById("email-reset-form").reset(); // reset form
                    document.body.classList.add("search-body");
                })
                .catch((error) => {
                    this.setState({resetSubmitStatus: <span className="text-warning">{error.message}</span>})
                });
        }
    };

    resetPasswordSuccessLogin() {
        this.setState({
            active: 5,
        });
    }

    resetPassword() {
        this.setState({
            active: 4,
        });
    }

    accountRecover() {
        this.props.setLoginPopUpStatus(3);
    }

    goToSuccess() {
        this.setState({
            active: 6,
        });
    }

    forGotPass() {
        this.setState({
            active: 2,
        });
    }

    goToSignIn() {
        this.setState({
            active: 0,
        });
    }

    goToSignUp() {
        this.setState({
            active: 1,
        });
    }

    render() {
        return (
            <>
                <div className="container  ">

                    <div className="row justify-content-center ">
                        <div className={this.props.parentClass?this.props.parentClass+" pt-5 mt-5":"col-12"}>
                    <div className="row no-gutters">
                        <div className="col-12">
                            <h3 className={"blue-text text-heading text-center"}>
                                Forgot your password?
                            </h3>
                        </div>
                    </div>

                    <form id="email-reset-form" onSubmit={this.handleSubmit}>
                        <div className="row no-gutters justify-content-center ">
                            <div className="col-12 ">
                                <p className={"text-mute small fgt-password-text"}>
                                    We’ll send a link to your email address. Click on
                                    the link in the email to reset your password.
                                </p>
                                <p>{this.state.resetSubmitStatus}</p>
                            </div>

                            <div className="col-12 mt-4">
                                <TextField
                                    type={"email"}
                                    onChange={this.handleChange.bind(this, "email")}
                                    id="outlined-basic"
                                    label="Email"
                                    variant="outlined"
                                    fullWidth={true}
                                    name={"email"}
                                />

                                {this.state.errors["email"] && (
                                    <span className={"text-mute small"}>
                                        <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["email"]}
                                    </span>
                                )}
                            </div>

                            <div className="col-12 mt-4 mb-4">
                                <button
                                    type="submit"
                                    className={
                                        "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                    }>
                                    Submit email
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ForgotPassword);
