import React, { Component } from "react";
import PropTypes from "prop-types";
import { Cancel, Check, Error, Publish } from "@mui/icons-material";
import { baseUrl, MIME_TYPES_ACCEPT } from "../../Util/Constants";
import { Spinner } from "react-bootstrap";
import axios from "axios";

class WysiwygCustomImageUploadIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            images: [],
            artifacts: [],
        };

        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    static propTypes = {
        onChange: PropTypes.func,
        editorState: PropTypes.object,
    };

    resetImagesAfterMessageSend = () => {
        this.setState({
            files: [],
            images: [],
            artifacts: [],
        })
    }


    handleChangeFile(event) {
        let files = this.state.files;

        let newFiles = [];

        for (let i = 0; i < event.target.files.length; i++) {
            files.push({ file: event.target.files[i], status: 0, id: null });
            newFiles.push({ file: event.target.files[i], status: 0, id: null });
        }

        this.setState({
            files: files,
        });

        this.uploadImage(newFiles);
    }

    handleCancel(e) {
        e.preventDefault();

        let index = e.currentTarget.dataset.index;
        let name = e.currentTarget.dataset.name;
        let url = e.currentTarget.dataset.url;

        let files = this.state.files.filter((item) => item.file.name !== name);
        this.setState({
            artifacts: this.state.artifacts.filter((item) => item.name !== name),
        });

        let images = [];
        for (let k = 0; k < files.length; k++) {
            if (files[k].id) {
                images.push(files[k].id);
            }
        }

        this.setState({
            images: images,
            files: files,
        });


        this.props.handleUploadCallback(images); // callback for image ids
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    getImageAsBytes(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = () => {
                let arrayBuffer = reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            };
            reader.onerror = (error) => reject(error);
        });
    }

    uploadImage(files) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let imgFile = files[i];

                this.getImageAsBytes(imgFile.file)
                    .then((data) => {
                        const payload = data;

                        try {
                            axios
                                .post(
                                    `${baseUrl}artifact/load?name=${imgFile.file.name.toLowerCase()}`,
                                    payload
                                )
                                .then((res) => {
                                    let images = [...this.state.images];
                                    images.push(res.data.data._key);

                                    let artifacts = this.state.artifacts;

                                    artifacts.push(res.data.data);

                                    this.setState({
                                        images: images,
                                        artifacts: artifacts,
                                    });

                                    let currentFiles = this.state.files;

                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 1; //success
                                            currentFiles[k].id = res.data.data._key; //success
                                        }
                                    }

                                    this.setState({
                                        files: currentFiles,
                                    });

                                    this.props.handleUploadCallback(images, this.state.files);
                                })
                                .catch((error) => {
                                    let currentFiles = [...this.state.files];
                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 2; //failed
                                        }
                                    }

                                    this.setState({
                                        files: currentFiles,
                                    });
                                });
                        } catch (e) {
                            console.log("catch Error ", e);
                        }
                    })
                    .catch((error) => {
                        console.log("image upload error ", error);
                    });
            }
        }
    }

    render() {
        return (
            <div className="rdw-image-custom-option">
                <div className={" d-flex justify-content-center align-items-center"}>
                    <>
                        <label htmlFor="fileInput">
                            <Publish
                                style={{
                                    fontSize: 32,
                                    color: "#a8a8a8",
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
                            onChange={this.handleChangeFile.bind(this)}
                        />
                    </>
                </div>

                <div className="message-upload-images-container d-flex flex-row-reverse" style={{position: "absolute", right: "0", top: "-90px"}}>
                    {this.state.files &&
                    this.state.files.map((item, index) => (
                        <div key={index} className={"file-uploader-thumbnail-container"}>
                            <div
                                data-index={index}
                                className={"file-uploader-thumbnail"}
                                style={{
                                    backgroundImage: `url("${
                                        item.imgUrl ? item.imgUrl : URL.createObjectURL(item.file)
                                    }")`,
                                }}>
                                {item.status === 0 && (
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        style={{
                                            color: "#cccccc",
                                        }}
                                        className={"center-spinner"}
                                    />
                                )}

                                {item.status === 1 && (
                                    <Check
                                        style={{
                                            color: "#cccccc",
                                        }}
                                        className={" file-upload-img-thumbnail-check"}
                                    />
                                )}
                                {item.status === 2 && (
                                    <span className={"file-upload-img-thumbnail-error"}>
                                        <Error
                                            style={{
                                                color: "red",
                                            }}
                                        />
                                        <p>Error!</p>
                                    </span>
                                )}
                                <Cancel
                                    data-name={
                                        item.file && item.file["name"] ? item.file["name"] : ""
                                    }
                                    data-index={item.id}
                                    onClick={this.handleCancel.bind(this)}
                                    className={"file-upload-img-thumbnail-cancel"}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default WysiwygCustomImageUploadIcon;
