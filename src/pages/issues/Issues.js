import React, {Component} from "react";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import _ from "lodash";
import Layout from "../../components/Layout/Layout";
import IssueItem from "../../components/issues/IssueItem";
import {Link} from "react-router-dom";
import CustomPopover from "../../components/FormsUI/CustomPopover";

class Issues extends Component {
    state = {
        allIssues: [],
    };

    getAllIssues = () => {
        axios
            .get(`${baseUrl}issue`, {
                headers: { Authorization: `Bearer ${this.props.userDetail.token}` },
            })
            .then((response) => {
                this.setState({
                    allIssues: _.orderBy(response.data.data, ["issue._ts_epoch_ms"], ["desc"]),
                });
            })
            .catch((error) => {});
    };

    handleOnSubmittedIssue = () => {
        this.getAllIssues();
    };

    componentDidMount() {
        this.getAllIssues();
    }

    render() {
        return (
            <Layout>

                    <div className="container  pb-4 pt-4">
                        <PageHeader pageTitle="Issues" subTitle="Find product related issues here" />
                        <div className="row">
                            <div className="col-md-12 btn-rows">
                                <Link to="/my-products" className=" btn-sm btn-gray-border mr-2">
                                    <CustomPopover text={" All of the products that you are responsible for as the Service Agent. The service agent is responsible for solving any issues that are reported by the owner of the product. "}>Products</CustomPopover>
                                </Link>

                                <Link to="/product-archive" className=" btn-sm btn-gray-border  mr-2">
                                    <CustomPopover text={"All of your products that have been released to another and are now out of your possession. Records gives you the ability to interact with the user of the product and by seeing the provenance of where the products are currently. "}> Records</CustomPopover>
                                </Link>

                                <Link to="/product-tracked" className=" btn-sm btn-gray-border  mr-2">
                                    <CustomPopover text={"Products that have entered the platform from another user that have your Brand attached to them. You have therefore wanted to know the provenance of these products and have now tracked these"}>Tracked</CustomPopover>
                                </Link>

                                <Link to="/issues" className=" btn-sm btn-gray-border ml-2-desktop ">
                                    {/*<CustomPopover*/}
                                    {/*    // text={"Products that have entered the platform from another user that have your Brand attached to them. You have therefore wanted to know the provenance of these products and have now tracked these"}*/}
                                    {/*>*/}
                                    Product Issues
                                    {/*</CustomPopover>*/}
                                </Link>
                                <div style={{float:"right"}} className=" text-right pl-3-desktop">
                                    <CustomPopover text={"Open QR codes that are not associated with any product yet. You can scan these codes and then associate them to a product that currently exists."}><button className="btn btn-sm btn-gray-border" onClick={() => this.toggleDownloadQrCodes()} type="button">Download Cyclecodes</button></CustomPopover>
                                    <button className="d-none btn btn-sm btn-gray-border ml-1" onClick={() => this.toggleMultiSite()} type="button">Upload Multiple Products</button>
                                </div>
                            </div>



                        </div>

                        <div className="row pt-3 pb-3">
                            <div className="col">
                                {this.state.allIssues.length > 0
                                    ? this.state.allIssues.map((issue, index) => {
                                          return (
                                              <IssueItem
                                                  key={index}
                                                  item={issue}
                                                  onSubmitted={this.handleOnSubmittedIssue}
                                              />
                                          );
                                      })
                                    : "Good one! There hasn't been any issues so far"}
                            </div>
                        </div>
                    </div>

            </Layout>
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
        test: null,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Issues);
