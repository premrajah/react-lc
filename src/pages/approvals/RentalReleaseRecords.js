import React, {Component} from 'react'
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import RequestRentalReleaseItem from "../../components/Approvals/RequestRentalReleaseItem";

class RentalReleaseRecords extends Component {

    state = {
        rentalRequests:[]
    }

    componentDidMount() {


        this.fetchRentalRequests()

    }

    fetchRentalRequests = () => {

        axios.get(baseUrl + "rental-release").then(
            (response) => {

                let responseAll = response.data.data;

                this.setState({
                    rentalRequests:responseAll
                })

                // dispatch()
            },
            (error) => {
                // let status = error.response.status
                // dispatch({ type: "PRODUCT_LIST", value: [] })
            }
        )
            .catch(error => {});

        // dispatch({ type: "PRODUCT_LIST", value: [] })
    };


    render() {
        return (
            <Layout>
                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={ArchiveIcon}
                            pageTitle="Rental  Records"
                            subTitle="Your previously released requests"
                            bottomLine={<hr />}
                        />

                        <div className="row mt-3 mb-3">
                            <div className="col-12 d-flex justify-content-end">
                                <Link to="/approve" className="btn btn-sm blue-btn mr-2">
                                    Approvals
                                </Link>
                            </div>
                        </div>

                        {this.state.rentalRequests.length > 0 ?
                            <div className="row">
                            <div className="col">
                                {
                                    <>
                                        {this.state.rentalRequests.length !== 0 ?
                                            this.state.rentalRequests
                                                .filter(r => r.Release.stage !== "requested")
                                                .map((item, index) => (
                                            <div className="row" key={index}>
                                                <div className="col">
                                                    <Link to={`/product/${item.product_id}`}>
                                                        <RequestRentalReleaseItem
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
                </Layout>

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

export default connect(mapStateToProps, mapDispatchToProps)(RentalReleaseRecords);
