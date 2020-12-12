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
import { Spinner} from 'react-bootstrap';



class CompanyInfo extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            fields: {},
            errors: {},
            org:null,
            companyName:null,
            description:null,
            loading:false

        }


        this.companyInfo = this.companyInfo.bind(this)

    }


    companyInfo() {





        axios.get(baseUrl + "org",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {


                    var responseOrg = response.data;

                    console.log("org response")
                    console.log(responseOrg)


                    this.setState({

                        org : responseOrg.data,
                        companyName:responseOrg.data.name,
                        description:responseOrg.data.description,

                    })

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
        if (!this.state.companyName&&!fields["companyName"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }



        if (!this.state.description&&!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Required";
        }





        this.setState({ errors: errors });
        return formIsValid;
    }



    handleChangeSite(field, e) {

        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields: fields });


        if (field=="companyName"){
            this.setState({
                companyName: e.target.value
            })
        }
        else if (field=="description"){

            this.setState({
                description: e.target.value
            })
        }

    }


    handleSubmitSite = event => {

        event.preventDefault();


        this.setState({


            loading: true
        })



        if(this.handleValidationSite()) {

            const form = event.currentTarget;
            console.log(new FormData(event.target))


            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);


            const name = this.state.companyName
            const description = this.state.description



            console.log("site submit called")


            axios.post(baseUrl + "org",

                {


                    "id": this.state.org._key,
                    "update": {
                        "name": name,
                        "description": description
                    }
                    
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



                }).catch(error => {


                console.log(error)


                this.setState({


                    loading: false
                })




            });




        }
    }


    componentWillMount() {

    }

    componentDidMount() {

this.companyInfo()

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

                                <p className={"blue-text"}><Link to={"/account"} >Account </Link> > Company Info </p>
                                <h4 className={"text-blue text-bold"}>Company Info</h4>

                            </div>
                        </div>


                        {this.state.org &&
                        <div className={"row"}>
                            <div className={"col-12"}>
                                <form onSubmit={this.handleSubmitSite}>
                                    <div className="row no-gutters justify-content-center ">

                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic" label="Company Name" variant="outlined"
                                                       fullWidth={true} name={"companyName"}
                                                       value={this.state.companyName}
                                                       onChange={this.handleChangeSite.bind(this, "companyName")}/>

                                            {this.state.errors["companyName"] && <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errors["companyName"]}</span>}

                                        </div>

                                        <div className="col-12 mt-4">

                                            <TextField id="outlined-basic" label="Description" variant="outlined"
                                                       value={this.state.description}
                                                       fullWidth={true} name={"description"}
                                                       onChange={this.handleChangeSite.bind(this, "description")}/>

                                            {this.state.errors["description"] && <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errors["description"]}</span>}

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
)(CompanyInfo);
