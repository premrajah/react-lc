import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import history from "../../History/history";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "react-bootstrap";
import { Checkbox, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import AutocompleteCustom from "../../components/AutocompleteCustom";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import {capitalize} from "../../Util/GlobalFunctions";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

class SignUp extends Component {
    constructor(props) {
        super(props);



        this.state = {
            fields: {},
            errors: {},
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
            showPassword: false,
            isChecked: false,
            org_id: null,
            industries:["Commercial kitchen equipment","Commercial laundry equipment","Hospitality","Healthcare","Other:(Please Specify)"],
            reasons:["Register new products","Access Marketplace","Other:(Please Specify)"],
            businessFields:["Manufacturer","Dealer","Operator","Other:(Please Specify)"],
            reasonOtherShow:false,
            industryOtherShow:false,
            businessFieldOtherShow:false


        };

        this.goToSignUp = this.goToSignUp.bind(this);
        this.goToSignIn = this.goToSignIn.bind(this);
        this.goToSuccess = this.goToSuccess.bind(this);
        this.forGotPass = this.forGotPass.bind(this);
        this.accountRecover = this.accountRecover.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.resetPasswordSuccessLogin = this.resetPasswordSuccessLogin.bind(this);

        this.goHome = this.goHome.bind(this);

        this.hideLoginPopUp = this.hideLoginPopUp.bind(this);
        // this.changeInput=this.changeInput.bind(this)
    }

    companyDetails = (detail) => {
        if (detail.org) {
            this.setState({
                org_id: detail.org,
            });
        } else {
            axios.get(baseUrl + "org/company/" + detail.company).then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        org_id: responseAll._key,
                    });
                },
                (error) => {}
            );
        }
    };

    hideLoginPopUp = (event) => {
        // document.body.classList.add('sidemenu-open');
        this.props.showLoginPopUp(false);
    };

    goHome() {
        history.push("/");
    }

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
        this.setState({
            active: 2,
        });
    }


    goToSignIn() {
        this.props.setLoginPopUpStatus(0);
    }

    goToSignUp() {
        this.setState({
            active: 1,
        });
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Required";
        }
        if (!fields["firstName"]) {
            formIsValid = false;
            errors["firstName"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }

        if (!this.state.isChecked) {
            formIsValid = false;
            errors["agree"] = "Required";
        }

        if (!fields["lastName"]) {
            formIsValid = false;
            errors["lastName"] = "Required";
        }
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Required";
        }

        if (!fields["confirmPassword"]) {
            formIsValid = false;
            errors["confirmPassword"] = "Required";
        }

        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (fields["password"] !== fields["confirmPassword"]) {
            formIsValid = false;
            errors["password"] = "Does-Not-Match";
            errors["confirmPassword"] = "Does-Not-Match";
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

    handleToggleChecked = () => {
        this.setState((prevState) => ({ isChecked: !prevState.isChecked }));
    };

    handleShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

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
            const firstName = data.get("firstName");
            const lastName = data.get("lastName");
            const phone = data.get("phone");

            let dataSignUp = {};

            if (this.state.org_id) {
                dataSignUp = {
                    email: username,
                    password: password,
                    lastName: lastName,
                    firstName: firstName,
                    phone: phone,
                    org_id: this.state.org_id,
                };
            } else {
                dataSignUp = {
                    email: username,
                    password: password,
                    lastName: lastName,
                    firstName: firstName,
                    phone: phone,
                };
            }

            this.props.signUp(dataSignUp);
        } else {
        }
    };

    render() {
        return (
            <>
                <div className="container  ">
                    <div className="row no-gutters">
                        <div className="col-12">
                            <h3 className={"blue-text text-heading text-center"}>Sign up</h3>
                        </div>
                    </div>

                    <form onSubmit={this.handleSubmit}>
                        <div className="row no-gutters justify-content-center ">
                            <div className="col-12 mt-4">
                                <TextField
                                    id="outlined-basic"
                                    label="*First Name"
                                    variant="outlined"
                                    fullWidth={true}
                                    name={"firstName"}
                                    onChange={this.handleChange.bind(this, "firstName")}
                                />

                                {this.state.errors["firstName"] && (
                                    <span className={"text-mute small"}>
                                        <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["firstName"]}
                                    </span>
                                )}
                            </div>

                            <div className="col-12 mt-4">
                                <TextField
                                    id="outlined-basic"
                                    label="*Last Name"
                                    variant="outlined"
                                    fullWidth={true}
                                    name={"lastName"}
                                    onChange={this.handleChange.bind(this, "lastName")}
                                />

                                {this.state.errors["lastName"] && (
                                    <span className={"text-mute small"}>
                                        <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["lastName"]}
                                    </span>
                                )}
                            </div>

                            <div className="col-12 mt-4">
                                <TextField
                                    id="outlined-basic"
                                    label="*Email"
                                    variant="outlined"
                                    fullWidth={true}
                                    name={"email"}
                                    type={"email"}
                                    onChange={this.handleChange.bind(this, "email")}
                                />

                                {this.state.errors["email"] && (
                                    <span className={"text-mute small"}>
                                        <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["email"]}
                                    </span>
                                )}
                            </div>

                            <div className="col-12 mt-4">
                                <TextField
                                    id="phone"
                                    label="Phone"
                                    variant="outlined"
                                    fullWidth={true}
                                    name="phone"
                                    type="number"
                                    onChange={this.handleChange.bind(this, "phone")}
                                />
                                {this.state.errors["phone"] && (
                                    <span className={"text-mute small"}>
                                        <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["phone"]}
                                    </span>
                                )}
                            </div>

                            <div className="col-12 mt-4">
                                <AutocompleteCustom
                                    orgs={true}
                                    companies={true}
                                    suggestions={this.state.orgNames}
                                    selectedCompany={(action) => this.companyDetails(action)}
                                />


                            </div>
                            <div className="col-12 mt-4">

                                <div className="row">
                                    <div className={this.state.industryOtherShow?"col-6 ":"col-12"}>
                               <SelectArrayWrapper

                                   onChange={(value)=> {
                                       if (value==="Other:(Please Specify)"){

                                           this.setState({
                                               industryOtherShow:true
                                           })
                                       }else{
                                           this.setState({
                                               industryOtherShow:false
                                           })
                                       }
                                   }}
                                   options={this.state.industries} name={"industry"} title="Industry"
                               />
                                    </div>

                                    <div className={this.state.industryOtherShow?"col-6 ":"d-none"}>
                                        <TextFieldWrapper

                                            // onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                            error={this.state.errors["industry"]}
                                            name="industry" title=" Specify here" />
                                    </div>
                                </div>

                            </div>
                            <div className="col-12 mt-4">
                                <div className="row">
                                <div className={this.state.reasonOtherShow?"col-6 ":"col-12"}>
                                <SelectArrayWrapper
                                    // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                    onChange={(value)=> {

                                        if (value==="Other:(Please Specify)"){

                                            this.setState({
                                                reasonOtherShow:true
                                            })
                                        }else{
                                            this.setState({
                                                reasonOtherShow:false
                                            })
                                        }

                                    }}
                                    options={this.state.reasons} name={"reason"} title="Main Reason for using Loopcycle"
                                />
                                </div>

                                <div className={this.state.reasonOtherShow?"col-6 ":"d-none"}>
                                <TextFieldWrapper

                                    // onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                    error={this.state.errors["volume"]}
                                    name="reason" title=" Specify here" />
                                </div>
                                </div>

                            </div>
                            <div className="col-12 mt-4">
                                <div className="row">
                                    <div className={this.state.reasonOtherShow?"col-6 ":"col-12"}>
                                <SelectArrayWrapper
                                    // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                    onChange={(value)=> {
                                        if (value==="Other:(Please Specify)"){

                                            this.setState({
                                                businessFieldOtherShow:true
                                            })
                                        }else{
                                            this.setState({
                                                businessFieldOtherShow:false
                                            })
                                        }
                                    }}
                                    options={this.state.businessFields} name={"businessField"} title="Field of Business"
                                />
                                    </div>
                                <div className={this.state.businessFieldOtherShow?"col-6 ":"d-none"}>
                                    <TextFieldWrapper

                                        // onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                        error={this.state.errors["businessField"]}
                                        name="businessField" title=" Specify here" />
                                </div>

                            </div>

                            </div>
                            <div className="col-12 mt-4">
                                <TextField
                                    onChange={this.handleChange.bind(this, "password")}
                                    name={"password"}
                                    id="password"
                                    label="*Password"
                                    variant="outlined"
                                    fullWidth={true}
                                    type={this.state.showPassword ? "text" : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={this.handleShowPassword}
                                                    edge="end">
                                                    {this.state.showPassword ? (
                                                        <Visibility />
                                                    ) : (
                                                        <VisibilityOff />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {this.state.errors["password"] && (
                                    <span className={"text-mute small"}>
                                        <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["password"]}
                                    </span>
                                )}
                                {this.state.errors["Does-Not-Match"] && (
                                    <span className={"text-mute small"}>
                                        <span> style={{ color: "red" }}>* </span>
                                        {this.state.errors["Does-Not-Match"]}
                                    </span>
                                )}
                            </div>

                            <div className="col-12 mt-4">
                                <TextField
                                    onChange={this.handleChange.bind(this, "confirmPassword")}
                                    name={"confirmPassword"}
                                    id="outlined-basic"
                                    label="*Confirm Password"
                                    variant="outlined"
                                    fullWidth={true}
                                    type={this.state.showPassword ? "text" : "password"}
                                />

                                {this.state.errors["confirmPassword"] && (
                                    <span className={"text-mute small"}>
                                        <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["confirmPassword"]}
                                    </span>
                                )}
                                {this.state.errors["Does-Not-Match"] && (
                                    <span className={"text-mute small"}>
                                        <span> style={{ color: "red" }}>* </span>
                                        {this.state.errors["Does-Not-Match"]}
                                    </span>
                                )}
                            </div>

                            {/*<div className="col-12 mt-4 justify-content-center">*/}
                            {/*<p className={"text-mute small"}>Don’t see your company here?</p>*/}
                            {/*<p className={"forgot-password-link text-mute small"}>Create a new company profile</p>*/}
                            {/*</div>*/}

                            <div className="col-12 mt-4 justify-content-center">
                                <p className={"text-mute small"}>
                                    <Checkbox
                                        name={"agree"}
                                        onChange={this.handleToggleChecked}
                                        checked={this.state.isChecked}
                                        // color="#07AD88"
                                        style={{
                                            color: this.state.errors["agree"] ? "red" : "#07AD88",
                                        }}
                                        inputProps={{ "aria-label": "secondary checkbox" }}
                                    />
                                    I agree to the
                                    <span className={"forgot-password-link"}>
                                        <a href="/terms" target="_blank" rel="noopener noreferrer">
                                            Terms and Conditions
                                        </a>
                                    </span>
                                    <p>
                                        {this.state.errors["agree"] && (
                                            <span className={"text-mute small"}>
                                                <span style={{ color: "red" }}>* </span>
                                                {this.state.errors["agree"]}
                                            </span>
                                        )}
                                    </p>
                                </p>
                            </div>

                            {this.props.signUpFailed && (
                                <div className="col-12 mt-4">
                                    <Alert key={"alert"} variant={"danger"}>
                                        {this.props.signUpError}
                                    </Alert>
                                </div>
                            )}

                            <div className="col-12 mt-4">
                                <button
                                    type={"submit"}
                                    className={
                                        "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                    }>
                                    Create Account
                                </button>
                            </div>

                            <div className="col-12 mt-4">
                                <p className={"or-text-divider"}>
                                    <span>or</span>
                                </p>
                            </div>
                            <div className="col-auto mt-4 justify-content-center">
                                <button
                                    onClick={this.goToSignIn}
                                    type="button"
                                    className="mt-1 mb-4 btn topBtn btn-outline-primary sign-up-btn">
                                    Log in
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
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

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SignUp);