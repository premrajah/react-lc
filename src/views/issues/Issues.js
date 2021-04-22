import React, { Component } from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import _ from "lodash";
import IssueItem from "./IssueItem";

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
            <div className="mb-5">
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />
                    <div className="container  pb-4 pt-4">
                        <PageHeader pageTitle="Issues" subTitle="Issues related to products" />

                        <div className="row">
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
                                    : "No issues yet..."}
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
        test: null,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Issues);
