import React, {Component} from 'react'
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import RequestReleaseItem from "../../components/RequestReleaseItem";
import * as actionCreator from "../../store/actions/actions";

class ApprovedReleases extends Component {

    state = {}

    componentDidMount() {
        this.props.fetchReleaseRequest();
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
                            subTitle="Your previously released requests"
                            bottomLine={<hr />}
                        />

                        <div className="row mt-3 mb-5">
                            <div className="col-12 d-flex justify-content-end">
                                <Link to="/approve" className="btn btn-sm blue-btn mr-2">
                                    Approvals
                                </Link>
                            </div>
                        </div>

                        {this.props.productReleaseRequests.length > 0 ? <div className="row">
                            <div className="col">
                                {
                                    <>
                                        {this.props.productReleaseRequests.length !== 0 ? this.props.productReleaseRequests.filter(r => r.Release.stage !== "requested").map((item, index) => (
                                            <div className="row" key={index}>
                                                <div className="col">
                                                    <Link to={`/product/${item.product.product._key}`}>
                                                        <RequestReleaseItem
                                                            history={this.props.history}
                                                            item={item}
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                        )) : <div>No released request records yet.</div>}
                                    </>
                                }
                            </div>
                        </div> : <div>Loading...No previously release requests records yet...</div>}


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
        productReleaseRequests: state.productReleaseRequests,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchReleaseRequest: () => dispatch(actionCreator.fetchReleaseRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApprovedReleases);
