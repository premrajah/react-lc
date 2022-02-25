import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import HeaderDark from "../../views/header/HeaderDark";
import Sidebar from "../../views/menu/Sidebar";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import {Alert} from "react-bootstrap";
import {Typography} from "@mui/material";
import PageHeader from "../../components/PageHeader";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import BlueButton from "../../components/FormsUI/Buttons/BlueButton";
import BlueBorderButton from "../../components/FormsUI/Buttons/BlueBorderButton";
import AutoCompleteComboBox from "../../components/FormsUI/ProductForm/AutoCompleteComboBox";

class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            fields: {},
            errors: {},
            reasons:["Register new products","Access Marketplace","Other"],
            reasonOtherShow:false,
            user: null,
            firstName: null,
            lastName: null,
            email: null,
            phone: null,
            loading: false,
            submitSuccess: false,
            reason:null,
            showPasswordFields: false,
            password: '',
            repeatPassword: '',
            missMatchPasswords: '',
            passwordChangeErrors: '',
        };

    }

    UserInfo=()=> {
        axios
            .get(baseUrl + "user")
            .then(
                (response) => {
                    var response = response.data;

                    this.setState({
                        user: response.data,
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email,
                        phone: response.data.phone,
                        reason:response.data.user_details&&response.data.user_details.reason_for_joining?response.data.user_details.reason_for_joining:null
                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    handleValidation() {
        let fields = this.state.fields;
        let validations=[
            validateFormatCreate("firstName", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("lastName", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("email", [{check: Validators.required, message: 'Required'},{check: Validators.email, message: 'Required'}],fields),
            validateFormatCreate("phone", [{check: Validators.number, message: 'This field should be a number.'}],fields),
        ]
        let {formIsValid,errors}= validateInputs(validations)
        this.setState({ errors: errors });
        return formIsValid;
    }



    handleChange(value,field ) {
        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });
    }

    handleValidationSite() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!this.state.firstName && !fields["firstName"]) {
            formIsValid = false;
            errors["firstName"] = "Required";
        }

        //Name
        if (!this.state.lastName && !fields["lastName"]) {
            formIsValid = false;
            errors["lastName"] = "Required";
        }

        if (!this.state.phone && !fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Required";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChangeSite(field, e) {
        let fields = this.state.fields;

        fields[field] = e.target.value;

        if (field === "firstName") {
            this.setState({
                firstName: e.target.value,
            });
        } else if (field === "lastName") {
            this.setState({
                lastName: e.target.value,
            });
        } else if (field === "email") {
            this.setState({
                email: e.target.value,
            });
        } else if (field === "phone") {
            this.setState({
                phone: e.target.value,
            });
        }

        this.setState({ fields: fields });
    }

    handleShowPasswordFields = () => {
        this.setState(prevState => ({
            showPasswordFields: !prevState.showPasswordFields, passwordChangeErrors: ""
        }));

    }

    handleChangePassword = () => {
        let password = this.state.password
        let repeatPassword = this.state.repeatPassword;
        this.setState({passwordChangeErrors:"", missMatchPasswords: ""}) // reset

        if(password.toLowerCase() !== repeatPassword.toLowerCase()) {
            this.setState({missMatchPasswords: "Passwords do not match."})
        } else {
            this.setState({missMatchPasswords: ''});
            let payload = { "password": password }
            this.postChangePassword(payload);
        }
    }

    postChangePassword = (payload) => {
        axios.post(`${baseUrl}user/change`, payload)
            .then(res => {
                this.setState({showPasswordFields: false, password: '', repeatPassword: '', passwordChangeErrors: <span className="text-success">Password changed successfully.</span>})
            })
            .catch(error => {
                this.setState({passwordChangeErrors: error.message})
                if(error.response) {
                    this.setState({passwordChangeErrors: error.response.data.errors.map((e, i) => <div className="text-danger" key={i}>{e.message}</div>)})
                }
            })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.handleValidation()) {
            const form = event.currentTarget;

            this.setState({
                loading: true,
            });

            const data = new FormData(event.target);

            const firstName = data.get("firstName");
            const lastName = data.get("lastName");
            // const email = data.get("email")
            const phone = data.get("phone");

            axios
                .post(
                    baseUrl + "user",

                    {
                        firstName: firstName,
                        // "email": email,
                        lastName: lastName,
                        phone: phone,
                        user_details:{
                            reason_for_joining:data.get("reason")!=="Other"?data.get("reason"):data.get("reason-other")
                        }
                    }
                )
                .then((res) => {
                    this.setState({
                        loading: false,
                        submitSuccess: true,
                    });

                    this.UserInfo();
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                    });
                });
        }
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        this.UserInfo();
    }

    render() {
        return (


            <div className="container ">

                        <PageHeader
                            pageTitle="Change Password"
                            subTitle="Update your password."

                        />

                        {this.state.submitSuccess && (
                            <Alert key={"alert"} variant={"success"}>
                                {"Personal information updated successfully"}
                            </Alert>
                        )}


                        {this.state.user && (
                            <div className="row">
                                <div className="col-12">


                                    <div className="row d-flex flex-row justify-content-start align-items-end">

                                        <div className="col-md-6">
                                            <TextFieldWrapper
                                                initialValue={this.state.password}
                                                name="password"
                                                title="Password"
                                                error={this.state.errors["password"]}
                                                onChange={(value) => this.setState({password: value})}
                                                type="password"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <TextFieldWrapper
                                                initialValue={this.state.repeatPassword}
                                                name="repeatPassword"
                                                title="Repeat Password"
                                                error={this.state.errors["repeatPassword"]}
                                                onChange={(value) => this.setState({repeatPassword: value})}
                                                type="password"
                                            />
                                        </div>

                                        <div className="col-md-4 pt-2">
                                            <BlueBorderButton
                                                title={this.state.loading ? "Wait.." : "Update Password"}
                                                loading={this.state.loading}

                                                fullWidth
                                                disabled={this.state.password === '' || this.state.repeatPassword === ''}
                                                onClick={() => this.handleChangePassword()}
                                                type="button"
                                            >
                                            </BlueBorderButton>
                                            {/*<button*/}
                                            {/*    disabled={this.state.password === '' || this.state.repeatPassword === ''}*/}
                                            {/*    onClick={() => this.handleChangePassword()}*/}
                                            {/*    type="button"*/}
                                            {/*    className="btn btn-block  btn-outline-warning sign-up-btn">*/}
                                            {/*    Update Password*/}
                                            {/*</button>*/}
                                        </div>
                                        <div className="col-md-12 mt-2">
                                        <small className="text-gray-light ">Password should be at least 8 characters including at least 3 of the following 4 types of characters: a lower-case letter, an upper-case letter, a number, a special character (such as !@#$%^&*).</small>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
