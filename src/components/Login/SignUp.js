import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import history from "../../History/history";
import {Alert} from "react-bootstrap";
import {IconButton, InputAdornment} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import AutocompleteCustom from "../AutocompleteSearch/AutocompleteCustom";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import CheckboxWrapper from "../../components/FormsUI/ProductForm/Checkbox";
import {Link} from "react-router-dom";
import GreenBorderButton from "../FormsUI/Buttons/GreenBorderButton";
import GreenButton from "../FormsUI/Buttons/GreenButton";

import PasswordStrength from "../FormsUI/PasswordStrength";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import CloseButtonPopUp from "../FormsUI/Buttons/CloseButtonPopUp";


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
            businessFieldOtherShow:false,
            isLoopCycleCompany:false,
            companyNumber:null,

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

        let fields = this.state.fields

        if (detail.org) {
            this.setState({
                org_id: detail.org,
            });

            this.setState({
                isLoopCycleCompany:true
            })


            fields.company = detail.org

        } else if (detail.company) {


            fields.company = detail.company



            this.setState({
                isLoopCycleCompany:false,
                companyNumber:detail.company
            })
        }else{

            fields.company = null



        }
        this.setState({
            fields: fields
        })


    };


    createCompanyWithDetails = (data) => {

      return       axios.post(baseUrl + "org/company/",{


                "company_number":this.state.companyNumber,
                "email":data.get("email"),
                // "details": {
                //
                //     "industry": data.get("industry")!=="Other"?data.get("industry"):data.get("industry-other"),
                //     "sector": data.get("businessField")!=="Other"?data.get("businessField"):data.get("businessField-other"),
                //     "no_of_staff": data.get("no_of_staff")?data.get("no_of_staff"):0
                // }

            }).then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        org_id: responseAll._key,
                    });
                },
                (error) => {}
            );

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
            validateFormatCreate("company", [{check: Validators.required, message: 'Required'}],fields),

            validateFormatCreate("lastName", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("email", [{check: Validators.required, message: 'Required'},{check: Validators.email, message: 'Required'}],fields),
            validateFormatCreate("phone", [{check: Validators.number, message: 'This field should be a number.'}],fields),
            // validateFormatCreate("password",
            //     [{check: Validators.password, message: "Minimum of 8 characters, should contain at least 3 of the following 4 types of characters: lower case, upper case, numbers, special characters "}],fields),

            validateFormatCreate("password",
                [{check: Validators.password, message: "Required"}],fields),


            validateFormatCreate("confirmPassword", [{check: Validators.required, message: 'Required'},{check: Validators.confirmPassword, message: 'Confirm password do not match.'}],fields),
            validateFormatCreate("agree", [{check: Validators.requiredCheck, message: 'Required'}],fields),
            validateFormatCreate("no_of_staff", [{check: Validators.number, message: 'This field should be a number.'}],fields),

        ]



        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });


        return formIsValid;
    }


    handleChange(value,field ) {

        // if (field==="password"){
        //
        //     this.checkPasswordInputs(value)
        // }

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

    handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);


            //update company details first


            if (this.state.companyNumber&&!this.state.isLoopCycleCompany){

                   await   this.createCompanyWithDetails(data)
            }



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
                    // user_details: {
                    //     reason_for_joining: data.get("reason") !== "Other" ? data.get("reason") : data.get("reason-other")
                    // },

                };
            } else {
                dataSignUp = {
                    type:"page",
                    email: username,
                    password: password,
                    lastName: lastName,
                    firstName: firstName,
                    phone: phone,
                    // user_details: {
                    //     reason_for_joining: data.get("reason") !== "Other" ? data.get("reason") : data.get("reason-other")
                    // },

                };
            }


            // if (!this.state.org_id){
            //     dataSignUp.org_details = {
            //
            //             "industry": data.get("industry") !== "Other" ? data.get("industry") : data.get("industry-other"),
            //             "sector": data.get("businessField") !== "Other" ? data.get("businessField") : data.get("businessField-other"),
            //             "no_of_staff": data.get("no_of_staff")?data.get("no_of_staff"):0
            //
            //     }
            // }


            this.props.signUp(dataSignUp);

        } else {
        }
    };

    render() {
        return (
            <>
                <div className="container  ">
                    <div className="row justify-content-center ">
                        <div className={this.props.parentClass?this.props.parentClass+" pt-5 mt-5":"col-12"}>
                    <div className="row no-gutters">
                        <div className="col-12 position-relative mt-2">
                            <h4 className="blue-text text-heading  ">Sign Up</h4>
                            <div className="top-right  me-3 "><CloseButtonPopUp onClick={this.props.hideLoginPopUp}/></div>
                        </div>
                    </div>
                      <div className="row justify-content-center no-gutters">
                                <div className="col-12 ">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row no-gutters justify-content-center ">
                            <div className="col-6 pe-2 ">

                                <TextFieldWrapper

                                    onChange={(value)=>this.handleChange(value,"firstName")}
                                    error={this.state.errors["firstName"]}
                                    name="firstName" title="First Name" />
                            </div>

                            <div className="col-6  ps-2">
                                <TextFieldWrapper

                                    onChange={(value)=>this.handleChange(value,"lastName")}
                                    error={this.state.errors["lastName"]}
                                    name="lastName" title="Last Name" />
                            </div>

                            <div className="col-6  pe-2">
                                <TextFieldWrapper
                                    onChange={(value)=>this.handleChange(value,"email")}
                                    error={this.state.errors["email"]}
                                    name="email" title="Email" />
                            </div>

                            <div className="col-6  ps-2">
                                {/*<TextFieldWrapper*/}
                                {/*    onChange={(value)=>this.handleChange(value,"phone")}*/}
                                {/*    error={this.state.errors["phone"]}*/}
                                {/*    name="phone" title="Phone" />*/}

                                <div
                                    className="custom-label text-bold text-blue mb-0 ellipsis-end">Phone
                                </div>

                                <PhoneInput

                                    value={this.props.item&&this.props.item.site && this.props.item&&this.props.item.site.phone}
                                    onChange={this.handleChange.bind(this, "phone")}
                                    inputClass={this.state.phoneNumberInValid ? "is-invalid" : ""}
                                    inputProps={{
                                        name: 'phone',
                                        // required: true,
                                        defaultErrorMessage: "Invalid",
                                        // minLength:9,
                                    }}
                                    country={'gb'}
                                />
                                {this.state.errors["phone"] &&
                                <span style="color: rgb(244, 67, 54);"
                                      className="text-danger">Required</span>}


                            </div>

                            <div className="col-12 mb-2 ">
                                <div className={"custom-label text-bold text-blue "}>
                                    Select Company
                                </div>
                                <AutocompleteCustom

                                    email={this.state.fields["email"]}
                                    orgs={true}
                                    companies={true}
                                    suggestions={this.state.orgNames}
                                    selectedCompany={(action) => this.companyDetails(action)}
                                />
                                { this.state.errors["company"] &&<span style={{color: "rgb(244, 67, 54)"}} className="text-danger">Required</span>}


                            </div>


                            {/*<div className="col-12 ">*/}
                            {/*    <div className="row ">*/}

                            {/*        <div className="col-6 ">*/}
                            {/*    <TextFieldWrapper*/}
                            {/*        onChange={(value)=>this.handleChange(value,"referral")}*/}
                            {/*        error={this.state.errors["referral"]}*/}
                            {/*        name="referral" title="Referral Code (If Any)" />*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}


                            <div className="col-12 ">
                                <div className="row ">
                                <div className="col-6 ">
                                    <TextFieldWrapper

                                        onChange={(value)=>this.handleChange(value,"password")}
                                        error={this.state.errors["password"]}
                                        name="password" title="Password"
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
                                  <PasswordStrength
                                      error={this.state.errors["password"]}
                                      input={this.state.fields["password"]} />
                                </div>
                                    <div className="col-6 ">
                                        <TextFieldWrapper

                                            type="password"
                                            onChange={(value)=>this.handleChange(value,"confirmPassword")}
                                            error={this.state.errors["confirmPassword"]}
                                            name="confirmPassword" title="Confirm Password"
                                        />
                                    </div>
                                </div>


                            </div>

                            <div className="col-12  justify-content-center">
                                <div className={"mb-2"}>
                                <p className={"mt-1 mb-0"}>
                                    <CheckboxWrapper
                                        showErrorMessage
                                        name={"agree"}
                                        onChange={(value)=>this.handleChange(value,"agree")}
                                        initialValue={false}
                                        // color="#07AD88"
                                        error={this.state.errors["agree"]}
                                        inputProps={{ "aria-label": "secondary checkbox" }}
                                    />

                                {/*</div>*/}
                                {/*<div className={"col-10"}>*/}
                                <span className={"small"}>

                                    I agree to the <span className={"forgot-password-link"}>
                                        <a href="/terms" target="_blank" rel="noopener noreferrer">
                                            Terms and Conditions
                                        </a>
                                    </span>
                                </span>
                                </p>

                                    {this.state.errors["agree"] && (
                                        <span
                                            style={{ color: "#f44336", fontSize: "12px!important" }}
                                            className="text-danger">
                    {this.state.errors["agree"].message}
                </span>
                                    )}
                                </div>
                            </div>

                            {this.props.signUpFailed && (
                                <div className="col-12 ">
                                    <Alert key={"alert"} variant={"danger"}>
                                        {this.props.signUpError}
                                    </Alert>
                                </div>
                            )}

                            <div className="col-12 text-center ">
                                <GreenButton
                                    title={this.props.loading ? "Wait.." : "Create Account"}
                                    type={"submit"}
                                    loading={this.props.loading}
                                >
                                </GreenButton>
                            </div>


                        </div>
                    </form>
                                </div>
                            </div>

                            <div className="row mb-4 justify-content-center no-gutters">
                                <div className="col-12 mb-2 mt-2 ">
                                    <p className={"or-text-divider"}>
                                        <span>or</span>
                                    </p>
                                </div>
                            <div className="col-12 mt-2   justify-content-center text-center">

                                {this.props.isPage?
                                    <Link
                                        style={{padding: ".375rem .75rem"}}
                                       to={"/login"}
                                        type="button"
                                        className="mt-1 mb-4 btn topBtn  sign-up-btn">
                                     Log In
                                    </Link>

                                    :
                                    <GreenBorderButton
                                        title={"Log In"}
                                        type={"submit"}
                                        onClick={this.goToSignIn}
                                    >
                                    </GreenBorderButton>
                                }

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
        signUpPageSubmitted: state.signUpPageSubmitted,
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
