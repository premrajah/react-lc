import React, {Component} from "react";
import Paper from "../img/place-holder-lc.png";
import axios from "axios/index";
import {baseUrl} from "../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../store/actions/actions";
import {Link} from "react-router-dom";
import moment from "moment/moment";
import Org from "./Org/Org";
import {TextField} from '@material-ui/core';


class AddSite extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers:[],
            fieldsSite: {},
            errorsSite: {},
        }


    }


    phonenumber=(inputtxt)=> {



        var phoneNoWithCode= /^[+#*\\(\\)\\[\\]]*([0-9][ ext+-pw#*\\(\\)\\[\\]]*){6,45}$/;


        var phoneWithZero= /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;


        if(inputtxt.match(phoneNoWithCode)) {
            return true;
        }
        else if (inputtxt.match(phoneWithZero)) {
            return true

        }

        else {
            return false;
        }


    }



    handleValidationSite=() =>{


        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }

        // if (!fields["others"]) {
        //     formIsValid = false;
        //     errors["others"] = "Required";
        // }


        if (!fields["address"]) {
            formIsValid = false;
            errors["address"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }

        //
        // if (!fields["name"]) {
        //     formIsValid = false;
        //     errors["name"] = "Required";
        // }
        if (!fields["contact"]) {
            formIsValid = false;
            errors["contact"] = "Required";
        }





        // if (!fields["phone"]) {
        //     formIsValid = false;
        //     errors["phone"] = "Required";
        // }



        if ((!fields["phone"])) {
            formIsValid = false;
            errors["phone"] = "Required";
        }

        if ((fields["phone"])&&!this.phonenumber(fields["phone"])) {

            formIsValid = false;
            errors["phone"] = "Invalid Phone Number!";
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

        this.setState({ errorsSite: errors });
        return formIsValid;
    }

    handleChangeSite=(field, e) =>{

        let fields = this.state.fieldsSite;
        fields[field] = e.target.value;
        this.setState({ fields: fields });

    }


    handleSubmitSite = event => {


        this.setState({

            errorRegister:null
        })




        event.preventDefault();


        if(this.handleValidationSite()) {

            const form = event.currentTarget;





            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const email = data.get("email")
            const others = data.get("others")
            const name = data.get("name")
            const contact = data.get("contact")
            const address = data.get("address")
            const phone = data.get("phone")





            axios.put(baseUrl + "site",

                {site: {
                        "name": name,
                        "email": email,
                        "contact": contact,
                        "address": address,
                        "phone": phone,
                        "others": others
                    }

                }
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {

                    // this.toggleSite()
                    // this.getSites()


                    this.props.loadSites(this.props.userDetail.token)


                    this.props.triggerCallback()


                }).catch(error => {






            });




        }
    }






    componentWillMount() {

    }

    componentDidMount() {
    }





    render() {


        return (


                            <form onSubmit={this.handleSubmitSite}>
                                <div className="row no-gutters justify-content-center ">

                                    <div className="col-12 mt-4">

                                        <TextField id="outlined-basic" label=" Name" variant="outlined" fullWidth={true} name={"name"} onChange={this.handleChangeSite.bind(this, "name")} />

                                        {this.state.errorsSite["name"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["name"]}</span>}

                                    </div>

                                    <div className="col-12 mt-4">

                                        <TextField id="outlined-basic" label="Contact" variant="outlined" fullWidth={true} name={"contact"} onChange={this.handleChangeSite.bind(this, "contact")} />

                                        {this.state.errorsSite["contact"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["contact"]}</span>}

                                    </div>

                                    <div className="col-12 mt-4">

                                        <TextField id="outlined-basic" label="Address" variant="outlined" fullWidth={true} name={"address"} type={"text"} onChange={this.handleChangeSite.bind(this, "address")} />

                                        {this.state.errorsSite["address"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["address"]}</span>}

                                    </div>
                                    <div className="col-12 mt-4">

                                        <TextField id="outlined-basic" type={"number"} name={"phone"}  onChange={this.handleChangeSite.bind(this, "phone")} label="Phone" variant="outlined" fullWidth={true} />

                                        {this.state.errorsSite["phone"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["phone"]}</span>}

                                    </div>

                                    <div className="col-12 mt-4">

                                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChangeSite.bind(this, "email")} />

                                        {this.state.errorsSite["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["email"]}</span>}

                                    </div>
                                    <div className="col-12 mt-4">

                                        <TextField onChange={this.handleChangeSite.bind(this, "others")} name={"others"} id="outlined-basic" label="Others" variant="outlined" fullWidth={true} type={"others"} />

                                        {/*{this.state.errorsSite["others"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["others"]}</span>}*/}

                                    </div>

                                    <div className="col-12 mt-4">

                                        <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Add Site</button>
                                    </div>


                                </div>
                            </form>


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
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,


    };
};

const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(AddSite);

