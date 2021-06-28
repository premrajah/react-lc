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
import {Alert, Button, Modal} from "react-bootstrap";
import EditSite from "../../components/Sites/EditSite";
import PageHeader from "../../components/PageHeader";
import UploadMultiSiteOrProduct from "../../components/UploadImages/UploadMultiSiteOrProduct";

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
            showMultiUpload: false,
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
            .get(baseUrl + "site/" + this.state.siteSelected)
            .then(
                (response) => {
                    let responseAll = response.data.content;

                    this.setState({
                        site: responseAll,
                    });
                },
                (error) => {}
            );
    }

    getSites() {
        axios
            .get(baseUrl + "site")
            .then(
                (response) => {
                    let responseAll = response.data.data;

                    this.setState({
                        sites: responseAll,
                    });
                },
                (error) => {}
            );
    }

    toggleSite() {
        this.setState({showCreateSite: !this.state.showCreateSite,});
    }

    toggleMultiSite = () => {
        this.setState({showMultiUpload: !this.state.showMultiUpload});
    }

    handleMultiUploadCallback = () => {
        this.props.loadSites();
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

                    <div className="container pb-4 pt-4">
                        <div>
                            <Link to={"/account"}>Account </Link> > Addresses
                        </div>

                        <PageHeader
                            pageTitle="Addresses/Sites"
                            subTitle="Add or edit addresses"
                            bottomLine={<hr />}
                        />

                        {this.state.submitSuccess && (
                            <Alert key={"alert"} variant={"success"}>
                                {"New address created successfully"}
                            </Alert>
                        )}

                        <div className="row mb-3">
                            <div className="col-md-2">
                                <div
                                    onClick={this.toggleSite}
                                    className="green-link-url"
                                    style={{ cursor: "pointer" }}>
                                    Add New Site
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div
                                    onClick={() => this.toggleMultiSite()}
                                    className="green-link-url"
                                    style={{ cursor: "pointer" }}>
                                    Upload Multiple Sites
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


                {this.state.showMultiUpload && (
                    <>
                        <Modal size="lg" show={this.state.showMultiUpload} backdrop="static" onHide={() => this.toggleMultiSite()}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    <div className="row">
                                        <div className="col">
                                            <h4 className="text-center green-text">Upload Multiple</h4>
                                        </div>
                                    </div>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <UploadMultiSiteOrProduct isSite multiUploadCallback={() => this.handleMultiUploadCallback()} />
                            </Modal.Body>
                        </Modal>
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

const mapDispatchToProps = (dispatch) => {
    return {
        showSiteModal: (data) => dispatch(actionCreator.showSiteModal(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod);
