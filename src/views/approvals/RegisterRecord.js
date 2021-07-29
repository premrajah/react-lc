import React, { useEffect } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import { Link } from "react-router-dom";
import RequestRegisterItem from "../../components/RequestRegisterItem";
import RequestReleaseItem from "../../components/RequestReleaseItem";

const RegisterRecord = ({ productRegisterRequests, fetchRegisterRequest, history }) => {
    useEffect(() => {
        console.log("running");
        fetchRegisterRequest();
    }, []);

    return (
        <div>
            <Sidebar />
            <div className="wrapper">
                <HeaderDark />

                <div className="container  pb-4 pt-4">
                    <PageHeader
                        pageIcon={ArchiveIcon}
                        pageTitle="Register Request Records"
                        subTitle="Your previously registered requests"
                        bottomLine={<hr />}
                    />

                    <div className="row mt-3 mb-5">
                        <div className="col-12 d-flex justify-content-end">
                            <Link to="/approve" className="btn btn-sm blue-btn mr-2">
                                Approvals
                            </Link>
                        </div>
                    </div>

                    {productRegisterRequests.length > 0 ? (
                        <div className="row">
                            <div className="col">
                                {productRegisterRequests.length !== 0 ?
                                    productRegisterRequests.filter(r => r.registration.stage !== "requested").map((item, index) => (
                                        <div className="row" key={index}>
                                            <div className="col">
                                                <Link to={`/product/${item.product.product._key}`}>
                                                    <RequestRegisterItem
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
    );
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        productRegisterRequests: state.productRegisterRequests,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchRegisterRequest: () => dispatch(actionCreator.fetchRegisterRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterRecord);
