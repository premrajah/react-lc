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
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import CheckboxWrapper from "../../components/FormsUI/ProductForm/Checkbox";

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
            industries:["Commercial kitchen equipment","Commercial laundry equipment","Hospitality","Healthcare","Other"],
            reasons:["Register new products","Access Marketplace","Other"],
            businessFields:["Manufacturer","Dealer","Operator","Other"],
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

                    // console.log(response.data.data)

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


        let validations=[
            validateFormatCreate("firstName", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("lastName", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("email", [{check: Validators.required, message: 'Required'},{check: Validators.email, message: 'Required'}],fields),
            validateFormatCreate("phone", [{check: Validators.number, message: 'This field should be a number.'}],fields),
            validateFormatCreate("password", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("confirmPassword", [{check: Validators.required, message: 'Required'},{check: Validators.confirmPassword, message: 'Confirm password do not match.'}],fields),
            validateFormatCreate("agree", [{check: Validators.requiredCheck, message: 'Required'}],fields),
            validateFormatCreate("no_of_staff", [{check: Validators.number, message: 'This field should be a number.'}],fields),

        ]



        let {formIsValid,errors}= validateInputs(validations)

        console.log(formIsValid,errors)

        this.setState({ errors: errors });
        return formIsValid;
    }



    handleChange(value,field ) {

        console.log(field,value)
        let fields = this.state.fields;
        fields[field] = value;
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
                    user_details:{
                        reason_for_joining:data.get("reason")!="Other"?data.get("reason"):data.get("reason-other")
                    },
                    org_details:{
                        "industry": data.get("industry")!="Other"?data.get("industry"):data.get("industry-other"),
                        "sector": data.get("businessField")!="Other"?data.get("businessField"):data.get("businessField-other"),
                        "no_of_staff": data.get("no_of_staff")
                    }
                };
            } else {
                dataSignUp = {
                    email: username,
                    password: password,
                    lastName: lastName,
                    firstName: firstName,
                    phone: phone,
                    user_details:{
                        reason_for_joining:data.get("reason")!="Other"?data.get("reason"):data.get("reason-other")
                    },
                    org_details:{
                        "industry": data.get("industry")!="Other"?data.get("industry"):data.get("industry-other"),
                        "sector": data.get("businessField")!="Other"?data.get("businessField"):data.get("businessField-other"),
                        "no_of_staff": data.get("no_of_staff")
                    }
                };
            }

            console.log(dataSignUp)
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
                            <h3 className={"blue-text text-heading text-center"}>Sign Up</h3>
                        </div>
                    </div>

                    <form onSubmit={this.handleSubmit}>
                        <div className="row no-gutters justify-content-center ">
                            <div className="col-6 pr-2 mt-4">

                                <TextFieldWrapper

                                    onChange={(value)=>this.handleChange(value,"firstName")}
                                    error={this.state.errors["firstName"]}
                                    name="firstName" label="First Name" />
                            </div>

                            <div className="col-6 mt-4 pl-2">
                                <TextFieldWrapper

                                    onChange={(value)=>this.handleChange(value,"lastName")}
                                    error={this.state.errors["lastName"]}
                                    name="lastName" label="Last Name" />
                            </div>

                            <div className="col-6 mt-4 pr-2">
                                <TextFieldWrapper
                                    onChange={(value)=>this.handleChange(value,"email")}
                                    error={this.state.errors["email"]}
                                    name="email" label="Email" />
                            </div>

                            <div className="col-6 mt-4 pl-2">
                                <TextFieldWrapper
                                    onChange={(value)=>this.handleChange(value,"phone")}
                                    error={this.state.errors["phone"]}
                                    name="phone" label="Phone" />
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
                                    <div className={this.state.industryOtherShow?"col-6 transition-width":"col-12 transition-width"}>
                               <SelectArrayWrapper

                                   select
                                   onChange={(value)=> {
                                       if (value==="Other"){

                                           this.setState({
                                               industryOtherShow:true
                                           })
                                       }else{
                                           this.setState({
                                               industryOtherShow:false
                                           })
                                       }
                                   }}
                                   options={this.state.industries} name={"industry"} label="Industry"
                               />
                                    </div>

                                    <div className={this.state.industryOtherShow?"col-6 append-animate":"d-none"}>
                                        <TextFieldWrapper

                                            // onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                            error={this.state.errors["industry"]}
                                            name="industry-other" label=" Specify here" />
                                    </div>
                                </div>

                            </div>
                            <div className="col-12 mt-4">
                                <div className="row">
                                <div className={this.state.reasonOtherShow?"col-6 ":"col-12"}>
                                <SelectArrayWrapper
                                    // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                    onChange={(value)=> {

                                        if (value==="Other"){

                                            this.setState({
                                                reasonOtherShow:true
                                            })
                                        }else{
                                            this.setState({
                                                reasonOtherShow:false
                                            })
                                        }

                                    }}
                                    select
                                    options={this.state.reasons} name={"reason"} label="Main Reason for using Loopcycle"
                                />
                                </div>

                                <div className={this.state.reasonOtherShow?"col-6 append-animate":"d-none"}>
                                <TextFieldWrapper

                                    // onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                    error={this.state.errors["reason"]}
                                    name="reason-other" label=" Specify here" />
                                </div>
                                </div>

                            </div>
                            <div className="col-12 mt-4">
                                <div className="row">
                                    <div className={this.state.businessFieldOtherShow?"col-6 ":"col-12"}>
                                <SelectArrayWrapper
                                    // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                    select
                                    onChange={(value)=> {
                                        if (value==="Other"){

                                            this.setState({
                                                businessFieldOtherShow:true
                                            })
                                        }else{
                                            this.setState({
                                                businessFieldOtherShow:false
                                            })
                                        }
                                    }}
                                    options={this.state.businessFields} name={"businessField"} label="Field of Business"
                                />
                                    </div>
                                <div className={this.state.businessFieldOtherShow?"col-6 append-animate":"d-none"}>
                                    <TextFieldWrapper

                                        // onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                        error={this.state.errors["businessField"]}
                                        name="businessField-other" label="Specify here" />
                                </div>

                            </div>


                            </div>
                            <div className="col-12 mt-4">
                                <TextFieldWrapper
                                    onChange={(value)=>this.handleChange(value,"no_of_staff")}
                                    error={this.state.errors["no_of_staff"]}
                                    name="no_of_staff" label="No. of staff" />
                            </div>
                            <div className="col-12 mt-4">

                                <TextFieldWrapper

                                    onChange={(value)=>this.handleChange(value,"password")}
                                    error={this.state.errors["password"]}
                                    name="password" label="Password"
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

                            </div>

                            <div className="col-12 mt-4">
                                <TextFieldWrapper

                                    type="password"
                                    onChange={(value)=>this.handleChange(value,"confirmPassword")}
                                    error={this.state.errors["confirmPassword"]}
                                    name="confirmPassword" label="Confirm Password" />

                            </div>

                            <div className="col-12 mt-4 justify-content-center">
                                <div className={""}>
                                <p className={""}>
                                    <CheckboxWrapper
                                        name={"agree"}
                                        onChange={(value)=>this.handleChange(value,"agree")}
                                        initialValue={false}
                                        // color="#07AD88"
                                        style={{
                                            color: this.state.errors["agree"] ? "red" : "#07AD88",
                                        }}
                                        inputProps={{ "aria-label": "secondary checkbox" }}
                                    />
                                {/*</div>*/}
                                {/*<div className={"col-10"}>*/}
                                <span className={"text-mute small"}>

                                    I agree to the
                                    <span className={"forgot-password-link"}>
                                        <a href="/terms" target="_blank" rel="noopener noreferrer">
                                            Terms and Conditions
                                        </a>
                                    </span>
                                </span>
                                </p>
                                </div>
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
                                    Log In
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
