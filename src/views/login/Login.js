import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import history from "../../History/history";
import {makeStyles} from "@mui/styles";
import TextField from "@mui/material/TextField";
import {Alert, Spinner} from "react-bootstrap";
import {IconButton, InputAdornment} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Link} from "react-router-dom";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import BlueBorderButton from "../../components/FormsUI/ProductForm/BlueBorderButton";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: {},
            errors: {},
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
            formValid: false,
            showPassword: false,
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
        this.hideLoginPopUp = this.hideLoginPopUp.bind(this);
    }

    hideLoginPopUp = (event) => {
        // document.body.classList.add('sidemenu-open');
        this.props.showLoginPopUp(false);
    };

    goHome() {
        history.push("/");
    }

    handleValidationSubmitGreen() {
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


        this.setState({ formValid: formIsValid });

        // return formIsValid;
    }

    handleValidation() {


        let fields = this.state.fields;


        let validations=[

            validateFormatCreate("email", [{check: Validators.required, message: 'Required'},{check: Validators.email, message: 'Required'}],fields),
            validateFormatCreate("password", [{check: Validators.required, message: 'Required'}],fields),
        ]



        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(field, value) {
        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

        this.handleValidationSubmitGreen();
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);

            const username = data.get("email");
            const password = data.get("password");

            this.props.logIn({ email: username, password: password });
        } else {
        }
    };

    handleShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
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
        this.setState({
            active: 3,
        });
    }

    goToSuccess() {
        this.setState({
            active: 6,
        });
    }

    forGotPass() {
        this.props.setLoginPopUpStatus(2);

        //
        // this.setState({
        //
        //     active:2
        // })
    }



    goToSignIn() {
        this.setState({
            active: 0,
        });
    }

    goToSignUp() {
        this.props.setLoginPopUpStatus(1);
    }

    render() {
        return (
            <>
                <div className="container  ">

                    <div className="row justify-content-center ">
                        <div className={this.props.parentClass?this.props.parentClass+" pt-5 mt-5":"col-12"}>

                    <div className="row no-gutters ">
                        <div className="col-12">
                            <h4 className={"blue-text text-heading"}>Log In</h4>
                        </div>
                    </div>

                <div className="row justify-content-center no-gutters mb-4">
                                <div className="col-12 ">

                    <form onSubmit={this.handleSubmit}>
                        <div className="row no-gutters justify-content-center">
                            <div className="col-12">
                                {/*<TextField*/}
                                {/*    type={"email"}*/}
                                {/*    onChange={this.handleChange.bind(this, "email")}*/}
                                {/*    id="outlined-basic"*/}
                                {/*    label="Email"*/}
                                {/*    variant="outlined"*/}
                                {/*    fullWidth={true}*/}
                                {/*    name={"email"}*/}
                                {/*/>*/}
                                <TextFieldWrapper


                                    onChange={(value)=>this.handleChange("email",value)}
                                    error={this.state.errors["email"]}
                                    name="email" title="Email" />

                                {/*{this.state.errors["email"] && (*/}
                                {/*    <span className={"text-mute small"}>*/}
                                {/*        <span style={{ color: "red" }}>* </span>*/}
                                {/*        {this.state.errors["email"]}*/}
                                {/*    </span>*/}
                                {/*)}*/}
                            </div>

                            <div className="col-12 ">
                                <TextFieldWrapper

                                    type="password"
                                    onChange={(value)=>this.handleChange("password",value)}
                                    error={this.state.errors["password"]}
                                    name="password" title="Password"

                                />


                            </div>

                            <div className="col-12 mt-2 mb-2">
                                {this.props.isPage ?
                                    <Link
                                        to={"/forgot-password"}

                                        className={"forgot-password-link text-mute small"}>
                                        Forgot your password?
                                    </Link> :
                                    <p
                                        onClick={this.forGotPass}
                                        className={"forgot-password-link text-mute small"}>
                                        Forgot your password?
                                    </p>
                                }
                            </div>

                            {this.props.loginFailed && (
                                <div className="col-12 mt-2">
                                    <Alert key={"alert"} variant={"danger"}>
                                        {this.props.loginError}
                                    </Alert>
                                </div>
                            )}

                            <div className="col-12 mt-2">
                                <BlueBorderButton
                                    title={this.props.loading ? "Wait.." : "Log In"}
                                    type={"submit"}
                                    loading={this.props.loading}
                                    disabled={!this.state.formValid}
                                    fullWidth
                                  >
                                </BlueBorderButton>
                            </div>

                            <div className="col-12 mt-2">
                                <p className={"or-text-divider"}>
                                    <span>or</span>
                                </p>
                            </div>
                            <div className="col-auto mt-4  justify-content-center">
                                {this.props.isPage?
                                    <Link
                                        style={{padding: ".375rem .75rem"}}
                                        to={"/sign-up"}
                                        type="button"
                                        className="mt-1 mb-4 btn topBtn  sign-up-btn">
                                        Sign Up
                                    </Link>

                                    :

                                    <BlueBorderButton

                                        title={"Sign Up"}
                                        fullWidth
                                        onClick={this.goToSignUp}
                                    >
                                    </BlueBorderButton>}
                            </div>
                        </div>
                    </form>
                                </div>
                            </div>
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

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Login);
