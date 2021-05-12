import React, { useState } from "react";
import {Modal, Tab} from "react-bootstrap";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import { useParams} from 'react-router-dom';

const AddedDocumentsDisplay = (props) => {
    const { artifacts, pageRefreshCallback } = props;

    const [show, setShow] = useState(false);
    const [docKey, setDocKey] = useState(null);
    let {slug} = useParams();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDocumentKey = (key) => {
        handleShow();
        setDocKey(key);
    }

    const handleDeleteDocument = () => {
        if(!docKey) return;

        let afterRemoveDoc = artifacts.filter(item => item._key !== docKey);
        let artifactIds = [];

        afterRemoveDoc.forEach(item => artifactIds.push(item._key));

        const payload = {
            "product_id": slug,
            "artifact_ids": artifactIds
        }

        handleReplaceArtifacts(payload);
        handleClose();

    }



    const handleReplaceArtifacts = (payload) => {
        axios.post(`${baseUrl}product/artifact/replace`, payload)
            .then(response => {
                if(response.status === 200) {
                    handleClose();
                    handlePageRefreshCallback("success", payload.product_id);
                }
            })
            .catch(error => {
                console.log('artifact replace error ', error);
                handlePageRefreshCallback("fail", payload.product_id)
            })
    }

    const handlePageRefreshCallback = (status, productKey) => {
        pageRefreshCallback(status, productKey); // "success"/"fail"
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <p className="mt-1 mb-3 text-gray-light">
                        If documents have been added, please find the links to download below
                    </p>
                    {artifacts.length > 0 ? (
                        artifacts.map((artifact, index) => {
                            if (
                                artifact.mime_type === "application/pdf" ||
                                artifact.mime_type === "application/rtf" ||
                                artifact.mime_type === "application/msword" ||
                                artifact.mime_type === "text/rtf" ||
                                artifact.mime_type ===
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                artifact.mime_type ===
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                artifact.mime_type === "application/vnd.ms-excel"
                            ) {
                                return (
                                    <div key={index} className="mt-1 mb-2">
                                        <a
                                            className="btn-link"
                                            href={artifact.blob_url}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            {artifact.blob_name}
                                        </a>
                                        <span
                                            className="ml-1 text-danger"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleDocumentKey(artifact._key)}>
                                            <b>X</b>
                                        </span>

                                    </div>
                                );
                            }
                        })
                    ) : (
                        <div>No documents added.</div>
                    )}
                </div>
            </div>




            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove document</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-green mr-1" onClick={() => handleDeleteDocument()}>Yes</button>
                    <button className="btn btn-close" onClick={handleClose}>Cancel</button>
                </Modal.Footer>
            </Modal>


        </>
    );
};

export default AddedDocumentsDisplay;
