import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import Close from "@material-ui/icons/Close";
import SiteItem from "../../components/SiteItem";
import AddSite from "../../components/AddSite";
import * as actionCreator from "../../store/actions/actions";
import { Alert } from "react-bootstrap";
import EditSite from "../../components/Sites/EditSite";

class PaymentMethod extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            sites: [],
            site: {},
            showCreateSite: false,
            fieldsSite: {},
            errorsSite: {},
            submitSuccess: false,
        };

        this.getSites = this.getSites.bind(this);
        this.getSite = this.getSite.bind(this);
        this.toggleSite = this.toggleSite.bind(this);
        this.handleSubmitSite = this.handleSubmitSite.bind(this);
    }

    handleSubmitSite = (event) => {
        event.preventDefault();

        if (this.handleValidationSite()) {
            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);

            const email = data.get("email");
            const others = data.get("others");
            const name = data.get("name");
            const contact = data.get("contact");
            const address = data.get("address");
            const phone = data.get("phone");

            axios
                .put(
                    baseUrl + "site",

                    {
                        site: {
                            name: name,
                            email: email,
                            contact: contact,
                            address: address,
                            phone: phone,
                            others: others,
                        },
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
                    }
                )
                .then((res) => {
                    this.toggleSite();

                    this.getSites();
                })
                .catch((error) => {});
        }
    };

    getSite() {
        axios
            .get(baseUrl + "site/" + this.state.siteSelected, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.content;

                    this.setState({
                        site: responseAll,
                    });
                },
                (error) => {}
            );
    }

    getSites() {
        axios
            .get(baseUrl + "site", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        sites: responseAll,
                    });
                },
                (error) => {}
            );
    }

    toggleSite() {

        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
    }


    componentDidMount() {
        window.scrollTo(0, 0);

        this.props.loadSites();
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
                                <p className={"blue-text"}>
                                    <Link to={"/account"}> Account </Link> > Addresses/Sites
                                </p>

                                <h4 className={"text-blue text-bold"}>Addresses/Sites</h4>
                            </div>
                        </div>

                        {this.state.submitSuccess && (
                            <Alert key={"alert"} variant={"success"}>
                                {"New address created successfully"}
                            </Alert>
                        )}

                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="list-group main-menu accountpage-list">
                                    <p
                                        onClick={this.toggleSite}
                                        className="green-link-url"
                                        style={{ cursor: "pointer" }}>
                                        Add New Site
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col-12">
                                <div className="list-group">
                                    {this.props.siteList.map((site, index) => (
                                        <React.Fragment key={index}>
                                            <SiteItem site={site}/>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container ">
                        <div className="row"></div>
                    </div>
                </div>

                {this.state.showCreateSite && (
                    <>
                        <div className={"body-overlay"}>
                            <div className={"modal-popup site-popup"}>
                                <div className=" text-right ">
                                    <Close
                                        onClick={this.toggleSite}
                                        className="blue-text"
                                        style={{ fontSize: 32 }}
                                    />
                                </div>

                                <div className={"row"}>
                                    <div className={"col-12"}>
                                        <EditSite site={{}} submitCallback={() => {
                                            this.toggleSite();
                                            this.setState({submitSuccess: true,})
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        siteList: state.siteList,
        showSitePopUp: state.showSitePopUp,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showSiteModal: (data) => dispatch(actionCreator.showSiteModal(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(PaymentMethod);
