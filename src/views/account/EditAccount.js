import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import { Alert, Spinner } from "react-bootstrap";
import {IconButton, InputAdornment, TextField, Typography} from "@material-ui/core";
import PageHeader from "../../components/PageHeader";
import StatBLue from "../../img/icons/stat-blue.png";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import AutocompleteCustom from "../../components/AutocompleteCustom";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import CheckboxWrapper from "../../components/FormsUI/ProductForm/Checkbox";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {capitalize} from "../../Util/GlobalFunctions";

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
            reason:null
        };

    }

    UserInfo=()=> {
        axios
            .get(baseUrl + "user", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
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
            // validateFormatCreate("password", [{check: Validators.required, message: 'Required'}],fields),
            // validateFormatCreate("confirmPassword", [{check: Validators.required, message: 'Required'},{check: Validators.confirmPassword, message: 'Confirm password do not match.'}],fields),
            // validateFormatCreate("agree", [{check: Validators.requiredCheck, message: 'Required'}],fields),
            // validateFormatCreate("no_of_staff", [{check: Validators.number, message: 'This field should be a number.'}],fields),
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

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.handleValidationSite()) {
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
                            reason_for_joining:data.get("reason")!="Other"?data.get("reason"):data.get("reason-other")
                        }
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
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
            <div>
                <Sidebar />
                <div className="wrapper  ">
                    <HeaderDark />

                    <div className="container pb-4 pt-4">
                        <div>
                            <Link to={"/account"}>Account </Link> > Personal Information
                        </div>

                        <PageHeader
                            pageTitle="Personal Information"
                            subTitle="Add your personal information on this page"
                            bottomLine={<hr />}
                        />

                        {this.state.submitSuccess && (
                            <Alert key={"alert"} variant={"success"}>
                                {"Personal information updated successfully"}
                            </Alert>
                        )}

                        <div className="row">
                            <div className="col-12">
                                <span className={"text-bold"}>
                                    <Typography>
                                        Name: {this.state.firstName} {this.state.lastName}
                                    </Typography>
                                </span>
                            </div>
                        </div>

                        {this.state.user && (
                            <div className={"row"}>
                                <div className={"col-12"}>


                                    <form onSubmit={this.handleSubmit}>
                                        <div className="row no-gutters justify-content-center ">
                                            <div className="col-6 pr-2 mt-4">

                                                <TextFieldWrapper
                                                    initialValue={this.state.firstName}
                                                    onChange={(value)=>this.handleChange(value,"firstName")}
                                                    error={this.state.errors["firstName"]}
                                                    name="firstName" label="First Name" />
                                            </div>

                                            <div className="col-6 mt-4 pl-2">
                                                <TextFieldWrapper
                                                    initialValue={this.state.lastName}
                                                    onChange={(value)=>this.handleChange(value,"lastName")}
                                                    error={this.state.errors["lastName"]}
                                                    name="lastName" label="Last Name" />
                                            </div>

                                            <div className="col-6 mt-4 pr-2">
                                                <TextFieldWrapper
                                                    initialValue={this.state.email}
                                                    onChange={(value)=>this.handleChange(value,"email")}
                                                    error={this.state.errors["email"]}
                                                    name="email" label="Email" />
                                            </div>

                                            <div className="col-6 mt-4 pl-2">
                                                <TextFieldWrapper
                                                    initialValue={this.state.phone}
                                                    onChange={(value)=>this.handleChange(value,"phone")}
                                                    error={this.state.errors["phone"]}
                                                    name="phone" label="Phone" />
                                            </div>



                                            <div className="col-12 mt-4">
                                                <div className="row">
                                                    <div className={this.state.reasonOtherShow?"col-6 ":"col-12"}>
                                                        <SelectArrayWrapper
                                                            initialValue={this.state.reason}
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

                                                            onChange={(value)=>this.handleChange(value,"volume")}
                                                            error={this.state.errors["reason"]}
                                                            name="reason-other" label=" Specify here" />
                                                    </div>
                                                </div>

                                            </div>





                                            <div className="col-auto mt-4 justify-content-center">
                                                <button
                                                    type="submit"
                                                    className="mt-1 mb-4 btn topBtn btn-outline-primary sign-up-btn">
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    {/*<form onSubmit={this.handleSubmit}>*/}
                                    {/*    <div className="row no-gutters justify-content-center ">*/}
                                    {/*        <div className="col-12 mt-4">*/}
                                    {/*            <TextField*/}
                                    {/*                id="outlined-basic"*/}
                                    {/*                required*/}
                                    {/*                value={this.state.firstName}*/}
                                    {/*                label="First Name"*/}
                                    {/*                variant="outlined"*/}
                                    {/*                fullWidth={true}*/}
                                    {/*                name={"firstName"}*/}
                                    {/*                onChange={this.handleChangeSite.bind(*/}
                                    {/*                    this,*/}
                                    {/*                    "firstName"*/}
                                    {/*                )}*/}
                                    {/*            />*/}

                                    {/*            {this.state.errors["firstName"] && (*/}
                                    {/*                <span className={"text-mute small"}>*/}
                                    {/*                    <span style={{ color: "red" }}>* </span>*/}
                                    {/*                    {this.state.errors["firstName"]}*/}
                                    {/*                </span>*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}

                                    {/*        <div className="col-12 mt-4">*/}
                                    {/*            <TextField*/}
                                    {/*                id="outlined-basic"*/}
                                    {/*                required*/}
                                    {/*                value={this.state.lastName}*/}
                                    {/*                label="Last Name"*/}
                                    {/*                variant="outlined"*/}
                                    {/*                fullWidth={true}*/}
                                    {/*                name={"lastName"}*/}
                                    {/*                onChange={this.handleChangeSite.bind(*/}
                                    {/*                    this,*/}
                                    {/*                    "lastName"*/}
                                    {/*                )}*/}
                                    {/*            />*/}

                                    {/*            {this.state.errors["lastName"] && (*/}
                                    {/*                <span className={"text-mute small"}>*/}
                                    {/*                    <span style={{ color: "red" }}>* </span>*/}
                                    {/*                    {this.state.errors["lastName"]}*/}
                                    {/*                </span>*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}

                                    {/*        <div className="col-12 mt-4">*/}
                                    {/*            <TextField*/}
                                    {/*                id="outlined-basic2"*/}
                                    {/*                InputProps={{*/}
                                    {/*                    readOnly: true,*/}
                                    {/*                }}*/}
                                    {/*                value={this.state.email}*/}
                                    {/*                label="Email"*/}
                                    {/*                variant="outlined"*/}
                                    {/*                fullWidth={true}*/}
                                    {/*                name={"email"}*/}
                                    {/*                onChange={this.handleChangeSite.bind(*/}
                                    {/*                    this,*/}
                                    {/*                    "email"*/}
                                    {/*                )}*/}
                                    {/*                disabled*/}
                                    {/*            />*/}

                                    {/*            {this.state.errors["email"] && (*/}
                                    {/*                <span className={"text-mute small"}>*/}
                                    {/*                    <span style={{ color: "red" }}>* </span>*/}
                                    {/*                    {this.state.errors["email"]}*/}
                                    {/*                </span>*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}

                                    {/*        <div className="col-12 mt-4">*/}
                                    {/*            <TextField*/}
                                    {/*                id="outlined-basic3"*/}
                                    {/*                value={this.state.phone}*/}
                                    {/*                type={"number"}*/}
                                    {/*                name={"phone"}*/}
                                    {/*                onChange={this.handleChangeSite.bind(*/}
                                    {/*                    this,*/}
                                    {/*                    "phone"*/}
                                    {/*                )}*/}
                                    {/*                label="Contact number"*/}
                                    {/*                variant="outlined"*/}
                                    {/*                fullWidth={true}*/}
                                    {/*            />*/}

                                    {/*            {this.state.errors["phone"] && (*/}
                                    {/*                <span className={"text-mute small"}>*/}
                                    {/*                    <span style={{ color: "red" }}>* </span>*/}
                                    {/*                    {this.state.errors["phone"]}*/}
                                    {/*                </span>*/}
                                    {/*            )}*/}
                                    {/*        </div>*/}

                                    {/*        <div className="col-12 mt-4">*/}
                                    {/*            <button*/}
                                    {/*                type={"submit"}*/}
                                    {/*                className={*/}
                                    {/*                    "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"*/}
                                    {/*                }>*/}
                                    {/*                {this.state.loading && (*/}
                                    {/*                    <Spinner*/}
                                    {/*                        as="span"*/}
                                    {/*                        animation="border"*/}
                                    {/*                        size="sm"*/}
                                    {/*                        role="status"*/}
                                    {/*                        aria-hidden="true"*/}
                                    {/*                    />*/}
                                    {/*                )}*/}

                                    {/*                {this.state.loading ? "Wait.." : "Save"}*/}
                                    {/*            </button>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</form>*/}
                                </div>
                            </div>
                        )}
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

const mapDispachToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispachToProps)(EditAccount);
