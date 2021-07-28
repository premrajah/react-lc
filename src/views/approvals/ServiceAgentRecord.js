import React, {useEffect} from 'react'
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {fetchServiceAgentRequest} from "../../store/actions/actions";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import {Link} from "react-router-dom";
import RequestRegisterItem from "../../components/RequestRegisterItem";
import RequestServiceAgentItem from "../../components/RequestServiceAgentItem";

const ServiceAgentRecord = ({serviceAgentRequests, fetchServiceAgentRequest, history}) => {

    useEffect(() => {
        fetchServiceAgentRequest();
    }, [])

    return (
        <div>
            <Sidebar />
            <div className="wrapper">
                <HeaderDark />

                <div className="container  pb-4 pt-4">
                    <PageHeader
                        pageIcon={ArchiveIcon}
                        pageTitle="Service Agent Request Records"
                        subTitle="Your previously registered service agent requests"
                        bottomLine={<hr />}
                    />

                    <div className="row mt-3 mb-5">
                        <div className="col-12 d-flex justify-content-end">
                            <Link to="/approve" className="btn btn-sm blue-btn mr-2">
                                Approvals
                            </Link>
                        </div>
                    </div>

                    {serviceAgentRequests.length > 0 ? (
                        <div className="row">
                            <div className="col">
                                {serviceAgentRequests.length !== 0 ?
                                    serviceAgentRequests.filter(r => r.Release.stage !== "requested").map((item, index) => (
                                        <div className="row" key={index}>
                                            <div className="col">
                                                <Link to={`/product/${item.product.product._key}`}>
                                                    <RequestServiceAgentItem
                                                        history={history}
                                                        item={item}
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                    : (
                                        <div>No registered request records yet.</div>
                                    )}
                            </div>
                        </div>
                    ) : (
                        <div>Loading...No previously registered requests records yet...</div>
                    )}



                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        serviceAgentRequests: state.serviceAgentRequests,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchServiceAgentRequest: () => dispatch(actionCreator.fetchServiceAgentRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceAgentRecord);