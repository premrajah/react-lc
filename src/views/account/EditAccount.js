import React, {Component} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import {Spinner} from 'react-bootstrap';
import {Card, CardContent, TextField, Typography} from '@material-ui/core'


class EditAccount extends Component {

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            fields: {},
            errors: {},
            user: null,
            firstName:null,
            lastName:null,
            email:null,
            phone:null,
            loading: false
        }



        this.UserInfo = this.UserInfo.bind(this)

    }


    UserInfo() {


        axios.get(baseUrl + "user",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {


                    var response = response.data;


                this.setState({

                    user : response.data,
                    firstName:response.data.firstName,
                    lastName:response.data.lastName,
                    email:response.data.email,
                    phone:response.data.phone,
                })

                },
                (error) => {
                    // var status = error.response.status








                }
            );

    }


    handleValidationSite() {


        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!this.state.firstName&&!fields["firstName"]) {
            formIsValid = false;
            errors["firstName"] = "Required";
        }

        //Name
        if (!this.state.lastName&&!fields["lastName"]) {
            formIsValid = false;
            errors["lastName"] = "Required";
        }


        if (!this.state.phone&&!fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Required";
        }


        this.setState({ errors: errors });
        return formIsValid;
    }


    handleChangeSite(field, e) {

        let fields = this.state.fields;

        fields[field] = e.target.value;



        if (field=="firstName"){

            this.setState({
                firstName: e.target.value
            })
        }
        else if (field=="lastName"){

            this.setState({
                lastName: e.target.value
            })
        }

        else if (field=="email"){

            this.setState({
                email: e.target.value
            })
        }

        else if (field=="phone"){

            this.setState({
                phone: e.target.value
            })
        }

        this.setState({ fields: fields });

    }


    handleSubmitSite = event => {

        event.preventDefault();


        if(this.handleValidationSite()) {

            const form = event.currentTarget;

            this.setState({
                loading: true
            })



            const data = new FormData(event.target);

            const firstName = data.get("firstName")
            const lastName = data.get("lastName")
            // const email = data.get("email")
            const phone = data.get("phone")





            axios.post(baseUrl + "user",

                {
                    "firstName": firstName,
                    // "email": email,
                    "lastName": lastName,
                    "phone": phone,

                }
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {


                    this.setState({
                        loading: false
                    })

                    this.UserInfo()

                }).catch(error => {


                this.setState({
                    loading: false
                })





            });




        }
    }


    componentDidMount() {
        this.UserInfo()
    }


    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper  ">

                    <HeaderDark />


                    <div className="container  pt-3">

                        <div className="row mb-3 justify-content-center ">
                            <div className="col-12  justify-content-center">
                                <p className={"blue-text"}><Link to={"/account"} >Account </Link> > Personal Info </p>
                                <h4 className={"text-blue text-bold"}>Personal Info</h4>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <Card>
                                    <CardContent>
                                        <Typography>Full Name</Typography>
                                        <Typography variant="h5" component="h2">{this.state.firstName} {this.state.lastName}</Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>


                        {this.state.user &&

                        <div className={"row"}>
                            <div className={"col-12"}>
                                <form onSubmit={this.handleSubmitSite}>
                                    <div className="row no-gutters justify-content-center ">

                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic" required

                                                       value={this.state.firstName}
                                                       label="First Name"
                                                       variant="outlined" fullWidth={true} name={"firstName"}
                                                       onChange={this.handleChangeSite.bind(this, "firstName")} />

                                            {this.state.errors["firstName"] && <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errors["firstName"]}</span>}

                                        </div>

                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic" required

                                                       value={this.state.lastName}
                                                       label="Last Name"
                                                       variant="outlined" fullWidth={true} name={"lastName"}
                                                       onChange={this.handleChangeSite.bind(this, "lastName")}/>

                                            {this.state.errors["lastName"] && <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errors["lastName"]}</span>}

                                        </div>

                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic2"
                                                       InputProps={{
                                                           readOnly: true,
                                                       }}
                                                       value={this.state.email}
                                                       label="Email" variant="outlined" fullWidth={true} name={"email"}
                                                       onChange={this.handleChangeSite.bind(this, "email")} disabled/>

                                            {this.state.errors["email"] && <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}

                                        </div>


                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic3"
                                                       value={this.state.phone}
                                                       type={"number"} name={"phone"}
                                                       onChange={this.handleChangeSite.bind(this, "phone")}
                                                       label="Contact number" variant="outlined" fullWidth={true}/>

                                            {this.state.errors["phone"] && <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errors["phone"]}</span>}

                                        </div>


                                        <div className="col-12 mt-4">

                                            <button type={"submit"}
                                                    className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>

                                                {this.state.loading && <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"

                                                />}

                                                {this.state.loading ? "Wait.." : "Save"}

                                            </button>
                                        </div>


                                    </div>
                                </form>
                            </div>
                        </div>
                        }


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
