import React from "react";
import {Tab} from "react-bootstrap";

const AddedDocumentsDisplay = (props) => {
    const { artifacts } = props;
    return (
        <div className="row">
            <div className="col">
                <p className="mt-1 mb-3 text-gray-light">If documents have been added, please find the links to download below</p>
                {artifacts.length > 0 ? (
                    artifacts.map(
                        (artifact, index) => {
                            if (
                                artifact.mime_type ===
                                "application/pdf" ||
                                artifact.mime_type ===
                                "application/rtf" ||
                                artifact.mime_type ===
                                "application/msword" ||
                                artifact.mime_type === "text/rtf" ||
                                artifact.mime_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                artifact.mime_type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                artifact.mime_type === "application/vnd.ms-excel"
                            ) {
                                return (
                                    <div
                                        key={index}
                                        className="mt-1 mb-2">
                                        <a
                                            className="btn-link"
                                            href={artifact.blob_url}
                                            target="_blank">
                                            {artifact.blob_name}
                                        </a>
                                    </div>
                                );
                            }
                        }
                    )
                ) : (
                    <div>No documents added.</div>
                )}
            </div>
        </div>
    )
}

export default AddedDocumentsDisplay;