import React, { useState } from "react";
import { Card, CardContent } from "@material-ui/core";
import PlaceHolderImg from "../../img/place-holder-lc.png";
import moment from "moment/moment";
import MoreMenu from "../../components/MoreMenu";
import { Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import IssueSubmitForm from "../../components/IssueSubmitForm";

const IssueItem = ({ item, onSubmitted }) => {
    const { artifacts, creator, issue, product, service_agent } = item;
    const [editModal, setEditModal] = useState(false);

    const handleShowEditModal = () => setEditModal(true);
    const handleHideEditModal = () => setEditModal(false);

    const headerTextStyle = {
        fontSize: "1.4em",
    };
    const textStyle = {
        fontSize: "1em",
        marginTop: 0,
        marginBottom: 0,
        lineHeight: "1.2em",
    };

    const checkPriority = (priority) => {
        if (priority === "high") return "danger";
        if (priority === "medium") return "warning";
        if (priority === "low") return "info";
    };

    const handleEdit = (e) => {
        handleShowEditModal();
    };

    const handleIssueSubmitted = () => {
        onSubmitted();
    };

    return (
        <>
            {item && (
                <Link to={`/issue/${issue._key}`}>
                    <div className="row mb-2">
                        <div className="col">
                            <Card variant="outlined">
                                <CardContent>
                                    <div className="row">
                                        <div className="col-md-2 col-sm-12">
                                            {product.artifacts && product.artifacts.length > 0 ? (
                                                <img
                                                    className="img-fluid img-list"
                                                    src={product.artifacts[0].blob_url}
                                                    alt=""
                                                />
                                            ) : (
                                                <img
                                                    className="img-fluid"
                                                    src={PlaceHolderImg}
                                                    alt=""
                                                />
                                            )}
                                        </div>

                                        <div className="col-md-8 col-sm-12">
                                            {issue && (
                                                <div className="mb-3">
                                                    <div>
                                                        {issue.title && (
                                                            <div style={headerTextStyle}>
                                                                {issue.title}
                                                            </div>
                                                        )}
                                                        {issue.description && (
                                                            <div style={textStyle}>
                                                                {issue.description}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div style={textStyle}>
                                                        <span className="mr-3">
                                                            <Badge
                                                                variant={checkPriority(
                                                                    issue.priority
                                                                )}>
                                                                {issue.priority.toUpperCase()}
                                                            </Badge>
                                                        </span>

                                                        <span>
                                                            {issue.stage && (
                                                                <span>
                                                                    Stage: <b>{issue.stage}</b>
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {product && (
                                                <div>
                                                    <div style={textStyle} className="mb-1">
                                                        {product.product.name}
                                                    </div>
                                                    <div style={textStyle}>
                                                        <span>{product.product.purpose}, </span>
                                                        <span>{product.product.category}, </span>
                                                        <span>{product.product.type}, </span>
                                                        <span>{product.product.state}, </span>
                                                        <span>{product.product.volume} </span>
                                                        <span>{product.product.units}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {issue && (
                                            <div className="col-md-2 col-sm-12 d-flex flex-column align-items-end">
                                                <p className={"text-gray-light small"}>
                                                    {moment(issue._ts_epoch_ms).format(
                                                        "DD MMM YYYY"
                                                    )}
                                                </p>
                                                <MoreMenu
                                                    triggerCallback={(e) => handleEdit(e)}
                                                    edit={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Link>
            )}
            <Modal show={editModal} onHide={handleHideEditModal}>
                <Modal.Header closeButton>
                    {issue.title ? (
                        <Modal.Title>Edit Issue: {issue.title}</Modal.Title>
                    ) : (
                        <Modal.Title>New Issue</Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <IssueSubmitForm
                        issue={issue}
                        edit
                        productId={product.product._id}
                        onSubmitted={handleIssueSubmitted}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default IssueItem;
