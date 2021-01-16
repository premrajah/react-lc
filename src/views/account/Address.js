import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import {TextField} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import SiteItem from "../../components/SiteItem";



class PaymentMethod extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            sites: [],
            site:{},
            showCreateSite: false,
            fieldsSite: {},
            errorsSite: {},


        }


        this.getResources = this.getResources.bind(this)
        this.getSites = this.getSites.bind(this)
        this.getSite = this.getSite.bind(this)
        this.toggleSite = this.toggleSite.bind(this)
        this.handleValidationSite = this.handleValidationSite.bind(this)
        this.handleChangeSite = this.handleChangeSite.bind(this)
        this.handleSubmitSite = this.handleSubmitSite.bind(this)


    }




    handleValidationSite() {


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

        this.setState({ errorsSite: errors });
        return formIsValid;
    }



    handleChangeSite(field, e) {

        let fields = this.state.fieldsSite;
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


            axios.put(baseUrl + "site",

                {site:  {
                    "name": name,
                    "email": email,
                    "contact": contact,
                    "address": address,
                    "phone": phone,
                    "others": others

                }}
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




    getSite() {

        axios.get(baseUrl + "site/" + this.state.siteSelected,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.content;
                    console.log("resource response")
                    console.log(responseAll)

                    this.setState({

                        site: responseAll

                    })




                },
                (error) => {

                    console.log("site resource error")
                    console.log(error)

                }
            );

    }

    getSites() {

        axios.get(baseUrl + "site",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;
                    console.log("sites  response")
                    console.log(responseAll)

                    this.setState({

                        sites: responseAll

                    })

                },
                (error) => {

                    console.log("sites response error")
                    console.log(error)

                }
            );

    }




    toggleSite() {

        this.setState({
            showCreateSite: !this.state.showCreateSite
        })
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




    interval


    componentWillMount() {

    }

    componentDidMount() {

     this.getSites()

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
                                <p className={"blue-text"}><Link to={"/account"}> Account </Link> > Addresses/Sites </p>

                                <h4 className={"text-blue text-bold"}>Addresses/Sites</h4>

                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="list-group main-menu accountpage-list">
                                    <p onClick={this.toggleSite} className="green-link-url" style={{cursor: 'pointer'}}>Add New Address</p>
                                </div>
                            </div>
                        </div>


                        <div className="row mb-5">
                            <div className="col-12">
                                <div className="list-group">
                                    {this.state.sites.map((site) => <SiteItem key={site._key}
                                                  name={site.name}
                                                  address={site.address}
                                                  email={site.email}
                                                  contact={site.contact}
                                                  phone={site.phone}
                                                  others={site.others}
                                                  itemKey={site._key}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="container ">
                        <div className="row">
                        </div>
                    </div>



                </div>



                {this.state.showCreateSite &&

                <>
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">


                                <Close  onClick={this.toggleSite} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <form onSubmit={this.handleSubmitSite}>
                                        <div className="row no-gutters justify-content-center ">

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label="Site name" variant="outlined" fullWidth={true} name={"name"} onChange={this.handleChangeSite.bind(this, "name")} />

                                                {this.state.errorsSite["name"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["name"]}</span>}

                                            </div>

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label="Contact person" variant="outlined" fullWidth={true} name={"contact"} onChange={this.handleChangeSite.bind(this, "contact")} />

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

                                                <TextField onChange={this.handleChangeSite.bind(this, "others")} name={"others"} id="outlined-basic" label="Other information" variant="outlined" fullWidth={true} type={"others"} />

                                                {/*{this.state.errorsSite["others"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["others"]}</span>}*/}

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
                </>
                }

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
)(PaymentMethod);
