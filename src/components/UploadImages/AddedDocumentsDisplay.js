import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { baseUrl, MIME_TYPES } from "../../Util/Constants";
import { useParams } from "react-router-dom";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import MoreMenu from "../MoreMenu";
import ArtifactIconDisplayBasedOnMimeType from "./ArtifactIconDisplayBasedOnMimeType";

const AddedDocumentsDisplay = (props) => {
    const { artifacts, pageRefreshCallback, showSnackbar} = props;

    const [show, setShow] = useState(false);
    const [docKey, setDocKey] = useState(null);
    let { slug } = useParams();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDocumentKey = (key) => {
        handleShow();
        setDocKey(key);
    };

    const handleDeleteDocument = (key) => {
        let afterRemoveDoc = artifacts.filter((item) => item._key !== key);
        let artifactIds = [];

        afterRemoveDoc.forEach((item) => artifactIds.push(item._key));

        const payload = {
            product_id: slug,
            artifact_ids: artifactIds,
        };

        handleClose();

        handleReplaceArtifacts(payload);
    };

    const callBackResult = (action, key, blob_url) => {
        if (action === "download") {
            window.location.href = blob_url;
        } else if (action === "delete") {
            setDocKey(key);

            handleDeleteDocument(key);
        }
    };

    const handleReplaceArtifacts = (payload) => {
        axios
            .post(`${baseUrl}product/artifact/replace`, payload)
            .then((response) => {
                if (response.status === 200) {
                    handleClose();

                    props.loadCurrentProduct(payload.product_id);
                    props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: "Artifact removed successfully from product. Thanks",
                    });
                }
            })
            .catch((error) => {
                console.log("artifact replace error ", error);
                // handlePageRefreshCallback("fail", payload.product_id)
            });
    };

    return (
        <>
            <div className="row">
                <div className="col">
                    {artifacts.length > 0 ? (
                        artifacts.map((artifact, index) => {
                                return (
                                    <React.Fragment key={artifact._key}>
                                        {index === 0 && (
                                            <p className=" custom-label text-bold text-blue mt-4 mb-4">
                                                Files Uploaded
                                            </p>
                                        )}
                                        <div
                                            key={index}
                                            className="mt-1 mb-1 text-left pt-1 pb-1 bg-white row">
                                            <div className="col-10">
                                                <ArtifactIconDisplayBasedOnMimeType artifact={artifact}  />
                                                <span
                                                    className="ms-4  text-blue text-bold"
                                                    // href={artifact.blob_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    {artifact.name}
                                                </span>
                                            </div>
                                            <div className="col-2 d-flex justify-content-end">
                                                <MoreMenu
                                                    triggerCallback={(action) =>
                                                        callBackResult(
                                                            action,
                                                            artifact._key,
                                                            artifact.blob_url
                                                        )
                                                    }
                                                    download={true}
                                                    delete={props.isLoggedIn}
                                                />

                                                {!props.hideAdd && (
                                                    <span
                                                        className="ms-2 text-danger d-none"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            handleDocumentKey(artifact._key)
                                                        }>
                                                        <IndeterminateCheckBoxIcon
                                                            style={{ opacity: "0.5" }}
                                                            className={"text-blue"}
                                                        />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            // }
                        })
                    ) : (
                        <div className="mt-2">No documents added.</div>
                    )}
                </div>
            </div>



            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove document</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-green me-1" onClick={() => handleDeleteDocument()}>
                        Yes
                    </button>
                    <button className="btn btn-close" onClick={handleClose}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
        showSubProductView: state.showSubProductView,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadCurrentProduct: (data) => dispatch(actionCreator.loadCurrentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddedDocumentsDisplay);
