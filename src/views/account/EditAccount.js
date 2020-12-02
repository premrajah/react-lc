import React, { Component } from 'react';
import { connect } from "react-redux";
import ShippingWhite from '../../img/icons/delivery-blue.png';
import SettingsWhite from '../../img/icons/settings-blue.png';
import SearchWhite from '../../img/icons/search-blue.png';
import VerticalLines from '../../img/icons/stat-blue-2.png';
import Rings from '../../img/icons/ring-blue.png';
import BuildingIcon from '../../img/icons/building-icon.png';
import ProductBlue from '../../img/icons/product-blue.png';
import ListingBlue from '../../img/icons/listing-blue.png';
import { Link } from "react-router-dom";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';



class EditAccount extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            fields: {},
            errors: {},
        }


        this.getResources = this.getResources.bind(this)

    }


    getResources() {


        axios.get(baseUrl + "resource",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {
                    var response = response.data;

                    console.log("resource response")
                    console.log(response)

                },
                (error) => {
                    var status = error.response.status


                    console.log("resource error")
                    console.log(error)




                }
            );

    }




    handleValidationSite() {

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }



        if (!fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Required";
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

        this.setState({ errors: errors });
        return formIsValid;
    }



    handleChangeSite(field, e) {

        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields: fields });

    }


    handleSubmitSite = event => {

        event.preventDefault();


        if(this.handleValidationSite()) {

            const form = event.currentTarget;
            console.log(new FormData(event.target))


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


            console.log("site submit called")


            axios.post(baseUrl + "site",

                {
                    "name": name,
                    "email": email,
                    "contact": contact,
                    "address": address,
                    "phone": phone,
                    "others": others

                }
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {

                    this.toggleSite()
                    this.getSites()




                }).catch(error => {


                console.log(error)



            });




        }
    }


    componentWillMount() {

    }

    componentDidMount() {



    }



    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper  accountpage">

                    <HeaderDark />


                    <div className="container  pt-3">

                        <div className="row mb-3 justify-content-center ">

                            <div className="col-12  justify-content-center">

                                <p className={"blue-text"}><Link to={"/my-account"} >Account </Link> > Personal Info </p>
                                <h4 className={"text-blue text-bold"}>Personal Info</h4>

                            </div>
                        </div>


                        <div className={"row"}>
                            <div className={"col-12"}>
                                <form onSubmit={this.handleSubmitSite}>
                                    <div className="row no-gutters justify-content-center ">

                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic" label="Name" variant="outlined" fullWidth={true} name={"name"} onChange={this.handleChangeSite.bind(this, "name")} />

                                            {this.state.errors["name"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["name"]}</span>}

                                        </div>

                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} onChange={this.handleChangeSite.bind(this, "email")} />

                                            {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}

                                        </div>


                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic" type={"number"} name={"phone"}  onChange={this.handleChangeSite.bind(this, "phone")} label="Contact number" variant="outlined" fullWidth={true} />

                                            {this.state.errors["phone"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["phone"]}</span>}

                                        </div>


                                        <div className="col-12 mt-4">

                                            <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Submit Site</button>
                                        </div>


                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>



                </div>

            </div>
        );
    }
}





const mapStateToProps = state => {
    return {

        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,


    };
};

const mapDispachToProps = dispatch => {
    return {



    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(EditAccount);
