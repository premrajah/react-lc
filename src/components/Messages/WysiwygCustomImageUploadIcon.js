import React, { Component } from "react";
import PropTypes from "prop-types";
import { Cancel, Check, Error, Publish, AttachFile } from "@mui/icons-material";
import { baseUrl, MIME_TYPES_ACCEPT } from "../../Util/Constants";
import { Spinner } from "react-bootstrap";
import axios from "axios";

class WysiwygCustomImageUploadIcon extends Component {


    render() {
        return (
            <div className="rdw-image-custom-option">
                <div className={" d-flex justify-content-center align-items-center"}>
                    <>
                        <label htmlFor="fileInput">
                            <AttachFile
                                style={{
                                    fontSize: 18,
                                    color: "#000",
                                    margin: "auto",
                                }}
                            />
                        </label>
                        <input
                            accept={MIME_TYPES_ACCEPT}
                            style={{ display: "none" }}
                            id="fileInput"
                            multiple
                            type="file"
                            onChange={this.props.handleChangeFile}
                        />
                    </>
                </div>

            </div>
        );
    }
}

export default WysiwygCustomImageUploadIcon;
