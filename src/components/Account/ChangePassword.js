import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import {Alert} from "react-bootstrap";
import PageHeader from "../../components/PageHeader";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import BlueBorderButton from "../../components/FormsUI/Buttons/BlueBorderButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {fetchErrorMessage} from "../../Util/GlobalFunctions";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import PasswordStrength from "../FormsUI/PasswordStrength";

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
            showHidePassword: false,
        };

    }


   submitChangePassword = () => {


        if (this.handleValidation()) {

            let payload = {"password": this.state.fields["password"]}
            this.postChangePassword(payload);

        }
    }



    handleChangePassword = () => {


        if (this.state.password&&this.state.repeatPassword) {
            let password = this.state.password
            let repeatPassword = this.state.repeatPassword;
            this.setState({passwordChangeErrors: "", missMatchPasswords: ""}) // reset

            if (password === repeatPassword) {
                this.setState({missMatchPasswords: ''});
                let payload = {"password": password}
                this.postChangePassword(payload);

            } else {
                this.setState({missMatchPasswords: "Passwords do not match."})
            }
        }else{

            this.setState({missMatchPasswords: "Input Required!"})
        }
    }

    postChangePassword = (payload) => {
        axios.post(`${baseUrl}user/change`, payload)
            .then(res => {

                this.setState({showPasswordFields: false,
                    password: '', repeatPassword: '',
                    submitSuccess:true,
                    passwordChangeErrors: <span className="text-success">Password changed successfully.</span>})

            })
            .catch(error => {
                // this.setState({passwordChangeErrors: error.message})

                    // this.setState({passwordChangeErrors: fetchErrorMessage(error)})

                // if (error.data.errors){
                    this.setState({missMatchPasswords: fetchErrorMessage(error)})
                // }

            })
    }
    handleValidation() {


        let fields = this.state.fields;


        let validations=[

            validateFormatCreate("password",
                [{check: Validators.password, message: "Required"}],fields),
            validateFormatCreate("confirmPassword", [{check: Validators.required, message: 'Required'},{check: Validators.confirmPassword, message: 'Confirm password do not match.'}],fields),

        ]



        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });

        console.log(errors)

        return formIsValid;
    }

    handleChange(value,field ) {


        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
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
                                {"Password updated successfully. Thanks"}
                            </Alert>
                        )}

                {this.state.missMatchPasswords && (
                    <Alert key={"alert"} variant={"warning"}>
                        {this.state.missMatchPasswords}
                    </Alert>
                )}



                            <div className="row">
                                <div className="col-12">


                                    <div className="row d-flex flex-row justify-content-start ">

                                        <div className="col-md-6">
                                            <TextFieldWrapper
                                                // initialValue={this.state.password}
                                                name="password"
                                                title="Password"
                                                error={this.state.errors["password"]}
                                                onChange={(value)=>this.handleChange(value,"password")}
                                                type={this.state.showHidePassword ? "text" :"password"}
                                            />
                                            <PasswordStrength
                                                error={this.state.errors["password"]}
                                                input={this.state.fields["password"]} />
                                        </div>
                                        <div className="col-md-6">
                                            <TextFieldWrapper

                                                type={this.state.showHidePassword ? "text" :"password"}
                                                onChange={(value)=>this.handleChange(value,"confirmPassword")}
                                                error={this.state.errors["confirmPassword"]}
                                                name="confirmPassword" title="Confirm Password"
                                            />
                                        </div>

                                         <div className="col-md-12 d-flex justify-content-end">
                                            <div
                                                className="d-flex justify-content-center align-items-center forgot-password-link"
                                                onClick={() => this.setState({showHidePassword: !this.state.showHidePassword})}
                                            >
                                                {this.state.showHidePassword ? <VisibilityOffIcon className="mr-1"/> :
                                                    <VisibilityIcon className="mr-1"/>}
                                                <span>{this.state.showHidePassword ? "Hide" : "Show"} Password</span>
                                            </div>
                                        </div>

                                        <div className="col-md-4 pt-2">
                                            <BlueBorderButton
                                                title={this.state.loading ? "Wait.." : "Update Password"}
                                                loading={this.state.loading}
                                                fullWidth
                                                disabled={this.state.loading}
                                                onClick={() => this.submitChangePassword()}
                                                type="button"
                                            >
                                            </BlueBorderButton>
                                        </div>
                                        <div className="col-md-12 mt-2">
                                        <small className="text-gray-light ">Password should be at least 8 characters including at least 3 of the following 4 types of characters: a lower-case letter, an upper-case letter, a number, a special character (such as !@#$%^&*).</small>
                                        </div>
                                    </div>

                                </div>
                            </div>

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
