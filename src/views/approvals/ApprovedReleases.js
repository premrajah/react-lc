import React, {Component} from 'react'
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import RequestReleaseItem from "../../components/RequestReleaseItem";

class ApprovedReleases extends Component {

    state = {
        approvedRequests: [],
    }

    componentDidMount() {
        this.getAllRequests();
    }

    getAllRequests = () => {
        axios.get(`${baseUrl}release`)
            .then(response => {
                const data = response.data.data;
                this.setState({approvedRequests: data.filter((item) => item.Release.stage !== "requested")});
            })
            .catch(error => {

            })
    }

    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={ArchiveIcon}
                            pageTitle="Release Request Record"
                            subTitle="Your previously release requests"
                            bottomLine={<hr />}
                        />

                        <div className="row mt-3 mb-5">
                            <div className="col-12 d-flex justify-content-end">
                                <Link to="/approve" className="btn btn-sm blue-btn mr-2">
                                    Approvals
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                {
                                    this.state.approvedRequests.length > 0 ? <>
                                        {this.state.approvedRequests.map((item, index) => (
                                            <div className="row" key={index}>
                                                <div className="col">
                                                    <RequestReleaseItem
                                                        history={this.props.history}
                                                        item={item}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </> : this.state.approvedRequests.length === 0 ? " No previously release requests yet..." : "loading..."
                                }
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
    return {
        test: {}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApprovedReleases);
