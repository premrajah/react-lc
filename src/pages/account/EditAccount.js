import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import {Alert} from "react-bootstrap";
import PageHeader from "../../components/PageHeader";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import BlueButton from "../../components/FormsUI/Buttons/BlueButton";
import AutoCompleteComboBox from "../../components/FormsUI/ProductForm/AutoCompleteComboBox";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import ChangePassword from "../../components/Account/ChangePassword";
import ErrorBoundary from "../../components/ErrorBoundary";


class EditAccount extends Component {
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
                <ErrorBoundary skip>
                        <PageHeader
                            pageTitle="Personal Info"
                            subTitle="Add and change your personal details here"

                        />

                        {this.state.submitSuccess && (
                            <Alert key={"alert"} variant={"success"}>
                                {"Personal information updated successfully"}
                            </Alert>
                        )}

                        <div className="row d-none">
                            <div className="col-12">
                                <span className={"text-bold"}>
                                    <h4 className="text-capitalize product-title">
                                        Welcome {this.state.firstName} {this.state.lastName}
                                    </h4>
                                </span>
                            </div>
                        </div>

                        {this.state.user && (
                            <div className="row">
                                <div className="col-12">


                                    <form onSubmit={this.handleSubmit}>
                                        <div className="row no-gutters justify-content-start ">
                                            <div className="col-6 pe-2 mt-2">

                                                <TextFieldWrapper
                                                    initialValue={this.state.firstName}
                                                    onChange={(value)=>this.handleChange(value,"firstName")}
                                                    error={this.state.errors["firstName"]}
                                                    name="firstName" title="First Name" />
                                            </div>

                                            <div className="col-6 mt-2 ps-2">
                                                <TextFieldWrapper
                                                    initialValue={this.state.lastName}
                                                    onChange={(value)=>this.handleChange(value,"lastName")}
                                                    error={this.state.errors["lastName"]}
                                                    name="lastName" title="Last Name" />
                                            </div>

                                            <div className="col-6 mt-2 pe-2">
                                                <TextFieldWrapper
                                                    disabled={true}
                                                    initialValue={this.state.email}
                                                    onChange={(value)=>this.handleChange(value,"email")}
                                                    error={this.state.errors["email"]}
                                                    name="email" title="Email" />
                                            </div>

                                            <div className="col-6 mt-2 ps-2">
                                                {/*<TextFieldWrapper*/}
                                                {/*    initialValue={this.state.phone}*/}
                                                {/*    onChange={(value)=>this.handleChange(value,"phone")}*/}
                                                {/*    error={this.state.errors["phone"]}*/}
                                                {/*    name="phone" title="Phone" />*/}

                                                <div
                                                    className="custom-label text-bold text-blue mb-0 ellipsis-end">Phone
                                                </div>

                                                <PhoneInput

                                                    value={this.state.phone}
                                                    // onChange={this.handleChange.bind(this, "phone")}
                                                    onChange={(value)=>this.handleChange(value,"phone")}
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

                                            <div className="col-12 mt-2 d-none">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <AutoCompleteComboBox
                                                            initialValue={this.state.reason}

                                                            onChange={(value)=>this.handleChange(value,"reason")}
                                                            options={this.state.reasons}
                                                            error={this.state.errors["reason"]}
                                                            name="reason" title="Tell us, what’s the main reason for using Loopcycle?"
                                                        />

                                                    </div>
                                                </div>
                                            </div>



                                            <div className="col-3 mt-2 justify-content-center">

                                                <BlueButton
                                                    title={this.state.loading ? "Wait.." : "Update Account"}
                                                    type={"submit"}
                                                    loading={this.state.loading}

                                                    fullWidth
                                                >
                                                </BlueButton>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        )}


                <div className="row mt-5">
                    <div className="col-12">
                    <ChangePassword />
                    </div>
                </div>
                </ErrorBoundary>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditAccount);
