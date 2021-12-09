import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import PlaceHolderImg from "../../img/place-holder-lc.png";
import moment from "moment/moment";
import MoreMenu from "../../components/MoreMenu";
import { Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import IssueSubmitForm from "../../components/IssueSubmitForm";
import ImageOnlyThumbnail from "../../components/ImageOnlyThumbnail";
import {capitalize} from "../../Util/GlobalFunctions";

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
        handleHideEditModal()
    };

    return (
        <>
            {item && (
                <Link to={`/issue/${issue._key}`}>


                                    <div className="row  no-gutters  mb-4 bg-white rad-8  p-3">
                                        <div className="col-md-2 col-sm-12">
                                            {product.artifacts && product.artifacts.length > 0 ? (
                                                <ImageOnlyThumbnail images={product.artifacts} />
                                            ) : (
                                                <img
                                                    className="img-fluid rad-4 img-list"
                                                    src={PlaceHolderImg}
                                                    alt=""
                                                />
                                            )}
                                        </div>

                                        <div className="col-md-8  pl-3  col-sm-12">
                                            {issue && (
                                                <>
                                                    <p className={"mb-1"}>
                                                        {issue.title && (
                                                            <span style={{ fontSize: "18px" }} className={"title-bold"}>
                                                                {issue.title}
                                                            </span>
                                                        )}
                                                        <span className="ml-3 ">
                                                        <Badge
                                                            variant={checkPriority(
                                                                issue.priority
                                                            )}>
                                                            {issue.priority.toUpperCase()}
                                                        </Badge>
                                                        </span>
                                                        {/*{issue.description && (*/}
                                                        {/*    <div className={"text-gray-light mt-2  text-capitalize"}>*/}
                                                        {/*        {issue.description}*/}
                                                        {/*    </div>*/}
                                                        {/*)}*/}
                                                    </p>

                                                    <p style={{ fontSize: "16px" }} className="text-gray-light mb-1  text-capitalize">
                                                        Stage: <span className={"text-blue"}> {issue.stage}</span>
                                                    </p>


                                                </>
                                            )}
                                            {product &&
                                                <>
                                                <p style={{ fontSize: "16px" }} className="text-gray-light mb-1  text-capitalize">
                                                Product: <span className={"text-blue"}> {product.product.name}</span>
                                            </p>

                                                <p className={"text-gray-light mb-1 "}>
                                                Category:
                                                <span

                                                    className="ml-1 text-capitlize mb-1 cat-box text-left p-1">
                                                            <span className="text-capitlize">
                                                                {capitalize(product.product.category)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className=" text-capitlize">
                                                                {capitalize(product.product.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className="  text-capitlize">
                                                                {capitalize(product.product.state)}
                                                            </span>



                                    </span>
                                            </p>
                                                    <p  className=" text-capitalize  text-gray-light">

                                                        {product.product.purpose!=="aggregate"?"Qty:":""} {product.product.purpose!=="aggregate"&&  <span className={"text-blue"}>{product.product.volume} </span>}
                                                        {product.product.purpose!=="aggregate"&&     <span  className={"text-blue"}>{product.product.units}</span>}
                                                    </p>
                                                </>}


                                        </div>

                                        {issue && (
                                            <div className="col-md-2 col-sm-12 d-flex flex-column align-items-end">
                                                <p className={"text-gray-light date-bottom"}>
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

                </Link>
            )}
            <Modal show={editModal} onHide={handleHideEditModal}>

                    <IssueSubmitForm
                        issue={issue}
                        edit
                        productId={product.product._id}
                        onSubmitted={handleIssueSubmitted}
                    />

            </Modal>
        </>
    );
};

export default IssueItem;
