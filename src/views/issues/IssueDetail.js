import React, { Component } from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import axios from "axios/index";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import ImagesSlider from "../../components/ImagesSlider";
import PlaceholderImg from "../../img/place-holder-lc.png";
import MoreMenu from "../../components/MoreMenu";
import Org from "../../components/Org/Org";
import { Link } from "react-router-dom";
import { Badge, Modal } from "react-bootstrap";
import IssueSubmitForm from "../../components/IssueSubmitForm";
import { FormControl, FormHelperText, MenuItem, Select } from "@material-ui/core";

class IssueDetail extends Component {
    state = {
        issue: null,
        editModal: false,
        stageModal: false,
        stageForm: "open",
        stageSelectedValue: "",
    };

    handleShowEditModal = () => this.setState({ editModal: true });
    handleHideEditModal = () => this.setState({ editModal: false });

    handleShowStageModal = () => this.setState({ stageModal: true });
    handleHideStageModal = () => this.setState({ stageModal: false });

    getIssue = (issueKey) => {
        if (!issueKey) return;

        axios
            .get(`${baseUrl}issue/${issueKey}`, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                this.setState({ issue: response.data.data });

                if (response.status === 200) {
                    this.setState({ stageSelectedValue: this.state.issue.issue.stage });
                }

            })
            .catch((error) => {});
    };

    checkPriority = (priority) => {
        if (priority === "high") return "danger";
        if (priority === "medium") return "warning";
        if (priority === "low") return "info";
    };

    handleIssueSubmitted = (issueKey) => {
        this.getIssue(issueKey);
    };

    handleSetStage = () => {
        this.handleShowStageModal();
    };

    handleEdit = (e) => {
        if (e === "edit") {
            this.handleShowEditModal();
        }

        if (e === "stage") {
            this.handleSetStage();
        }
    };

    handleStageSubmit = (e) => {
        if (!e) return;
        e.preventDefault();

        const payload = {
            id: this.state.issue.issue._key,
            new_stage: this.state.stageSelectedValue,
        };

        this.updateStage(payload);
    };

    updateStage = (payload) => {
        axios
            .post(`${baseUrl}issue/stage`, payload, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                if (response.status === 200) {
                    this.getIssue(this.state.issue.issue._key);
                    this.handleHideStageModal();
                }
            })
            .catch((error) => {});
    };

    handleStageSelect = (e) => {
        if (!e) return;
        this.setState({ stageSelectedValue: e.target.value });
    };

    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        const { issueKey } = params;
        this.getIssue(issueKey);
    }

    render() {
        return (
            <div className="mb-5">
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />
                    <div className="container  pb-4 pt-4">
                        {this.state.issue && (
                            <div>
                                <div className="row">
                                    <div className="col-md-4 col-sm-12 col-xs-12 ">
                                        <div className="row stick-left-box ">
                                            <div className="col-12 text-center">
                                                {this.state.issue.product &&
                                                this.state.issue.product.artifacts &&
                                                this.state.issue.product.artifacts.length > 0 ? (
                                                    <ImagesSlider
                                                        images={this.state.issue.product.artifacts}
                                                    />
                                                ) : (
                                                    <img
                                                        className={"img-fluid"}
                                                        src={PlaceholderImg}
                                                        alt=""
                                                    />
                                                )}
                                            </div>

                                            <div className="col-12 mt-5">
                                                {this.state.issue.product && (
                                                    <div>
                                                        <Link
                                                            to={`/product/${this.state.issue.product.product._key}`}>
                                                            <h4
                                                                className={
                                                                    "blue-text text-heading"
                                                                }>
                                                                {
                                                                    this.state.issue.product.product
                                                                        .name
                                                                }
                                                            </h4>
                                                        </Link>
                                                        <p>
                                                            {
                                                                this.state.issue.product.product
                                                                    .description
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-8 col-sm-12 col-xs-12 pl-5">
                                        <div className="row mt-3">
                                            <div className="col-md-10">
                                                <h4 className={"blue-text text-heading"}>
                                                    {this.state.issue.issue.title}
                                                </h4>
                                            </div>
                                            <div className="col-md-2 text-right">
                                                <MoreMenu
                                                    triggerCallback={(e) => this.handleEdit(e)}
                                                    edit
                                                    stage
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <div>
                                                    {this.state.issue.issue && (
                                                        <span className="mr-3">
                                                            <Badge
                                                                variant={this.checkPriority(
                                                                    this.state.issue.issue.priority
                                                                )}>
                                                                {this.state.issue.issue.priority.toUpperCase()}
                                                            </Badge>
                                                        </span>
                                                    )}

                                                    {this.state.issue.issue.stage && (
                                                        <span className="mr-3">
                                                            <span>Stage: </span>
                                                            <span>
                                                                <b>
                                                                    {this.state.issue.issue.stage}
                                                                </b>
                                                            </span>
                                                        </span>
                                                    )}

                                                    {this.state.issue.creator && (
                                                        <span className="mr-3">
                                                            <span>Created by:</span>{" "}
                                                            <Org
                                                                orgId={this.state.issue.creator._id}
                                                                orgDescription={
                                                                    this.state.issue.creator
                                                                        .description
                                                                }
                                                            />
                                                        </span>
                                                    )}
                                                    {this.state.issue.service_agent && (
                                                        <span>
                                                            <span>
                                                                Service agent:{" "}
                                                                <Org
                                                                    orgId={
                                                                        this.state.issue
                                                                            .service_agent._id
                                                                    }
                                                                    orgDescription={
                                                                        this.state.issue
                                                                            .service_agent
                                                                            .description
                                                                    }
                                                                />
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mt-2 mb-2">
                                            <div className="col">
                                                <div className={"listing-row-border "}></div>
                                            </div>
                                        </div>

                                        {this.state.issue.issue.description && (
                                            <div>
                                                <div className="row">
                                                    <div className="col">
                                                        <p className="text-gray-light">
                                                            {this.state.issue.issue.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="row mt-2 mb-2">
                                                    <div className="col">
                                                        <div
                                                            className={"listing-row-border "}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/*Modals*/}
                {this.state.issue && (
                    <>
                        <Modal show={this.state.editModal} onHide={this.handleHideEditModal}>
                            <Modal.Header closeButton>
                                {this.state.issue.issue.title ? (
                                    <Modal.Title>
                                        Edit Issue: {this.state.issue.issue.title}
                                    </Modal.Title>
                                ) : (
                                    <Modal.Title>Edit Issue</Modal.Title>
                                )}
                            </Modal.Header>
                            <Modal.Body>
                                <IssueSubmitForm
                                    issue={this.state.issue.issue}
                                    edit
                                    productId={this.state.issue.product.product._id}
                                    onSubmitted={() =>
                                        this.handleIssueSubmitted(this.state.issue.issue._key)
                                    }
                                />
                            </Modal.Body>
                        </Modal>

                        <Modal show={this.state.stageModal} onHide={this.handleHideStageModal}>
                            <Modal.Header closeButton>
                                {this.state.issue.issue.title ? (
                                    <Modal.Title>
                                        Set Stage: {this.state.issue.issue.title}
                                    </Modal.Title>
                                ) : (
                                    <Modal.Title>Set Stage</Modal.Title>
                                )}
                            </Modal.Header>

                            <Modal.Body>
                                <div className="row">
                                    <div className="col">
                                        <form
                                            noValidate
                                            autoComplete="off"
                                            onSubmit={(e) => this.handleStageSubmit(e)}>
                                            {this.state.issue.issue.stage === "closed" ? (
                                                <FormControl>
                                                    <FormHelperText>Select Stage</FormHelperText>
                                                    <Select
                                                        className="mb-3"
                                                        name="stage"
                                                        defaultValue="open"
                                                        onChange={(e) => this.handleStageSelect(e)}>
                                                        <MenuItem value="open">open</MenuItem>
                                                        <MenuItem value="progress">progress</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <FormControl>
                                                    <FormHelperText>Select Stage</FormHelperText>
                                                    <Select
                                                        className="mb-3"
                                                        name="stage"
                                                        defaultValue={this.state.issue.issue.stage}
                                                        onChange={(e) => this.handleStageSelect(e)}>
                                                        <MenuItem value="open">open</MenuItem>
                                                        <MenuItem value="closed">closed</MenuItem>
                                                        <MenuItem value="progress">progress</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}

                                            <div className="mt-3 mb-3 d-flex justify-content-center">
                                                <button className="btn btn-green">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
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
    };
};

export default connect(mapStateToProps)(IssueDetail);
