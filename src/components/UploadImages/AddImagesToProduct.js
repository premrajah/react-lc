import React, { Component } from "react";
import AddPhotoIcon from "@material-ui/icons/AddAPhoto";
import { baseUrl, MIME_TYPES_ACCEPT } from "../../Util/Constants";
import { Spinner } from "react-bootstrap";
import { Cancel, Check, Error } from "@material-ui/icons";
import axios from "axios";
import { connect } from "react-redux";

class AddImagesToProduct extends Component {
    state = {
        files: [],
        images: [],
        productKey: null,
    };

    componentDidMount() {
        this.setState({ productKey: this.props.productKey });
    }

    handleChangeFile = (event) => {
        if (!event) return;
        this.handleCallbackImagesUploadStatus('');

        let files = this.state.files;
        let newFiles = [];

        for (let i = 0; i < event.target.files.length; i++) {
            files.push({ file: event.target.files[i], status: 0, id: null });
            newFiles.push({ file: event.target.files[i], status: 0, id: null });
        }

        this.uploadImage(newFiles);
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.handleCallbackImagesUploadStatus('');

        let index = e.currentTarget.dataset.index;
        let name = e.currentTarget.dataset.name;
        let url = e.currentTarget.dataset.url;

        let files = this.state.files.filter((item) => item.file.name !== name);

        let images = [];
        for (let k = 0; k < files.length; k++) {
            if (files[k].id) {
                images.push(files[k].id);
            }
        }

        this.setState({ images: images, files: files });
    };

    handleUploadImagesToServer = () => {
        this.handleCallbackImagesUploadStatus('');
        this.addArtifactsToProduct(this.state.productKey, this.state.images);
    };

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    handleCallbackImagesUploadStatus = (imageUploadStatus) => {
        this.props.handleCallBackImagesUploadStatus(imageUploadStatus);
    };

    addArtifactsToProduct = (productKey, images) => {
        if (!productKey || !images.length > 0) return;
        this.handleCallbackImagesUploadStatus('');

        const payload = {
            product_id: productKey,
            artifact_ids: images,
        };


        axios
            .post(`${baseUrl}product/artifact`, payload)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        images: [],
                        files: [],
                    });
                    this.handleCallbackImagesUploadStatus("Images uploaded successfully!");
                }
            })
            .catch((error) => {
                console.log("upload artifact to product error ", error);
                this.handleCallbackImagesUploadStatus("Sorry, Unable to upload images at this time");
            });
    };

    uploadImage(files) {
        if (!files) return;

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let imgFile = files[i];

                this.getBase64(imgFile.file).then((data) => {
                    axios
                        .post(
                            `${baseUrl}artifact`,
                            {
                                metadata: {
                                    name: imgFile.file.name,
                                    mime_type: imgFile.file.type,
                                    context: "",
                                },
                                data_as_base64_string: btoa(data),
                            }
                            // {
                            //     headers: {
                            //         Authorization: `Bearer ${this.props.userDetail.token}`,
                            //     },
                            // }
                        )
                        .then((res) => {
                            //

                            let images = this.state.images;

                            images.push(res.data.data._key);

                            this.setState({
                                images: images,
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
                        })
                        .catch((error) => {
                            let currentFiles = this.state.files;

                            for (let k = 0; k < currentFiles.length; k++) {
                                if (currentFiles[k].file.name === imgFile.file.name) {
                                    currentFiles[k].status = 2; //failed
                                }
                            }

                            this.setState({
                                files: currentFiles,
                            });
                        });
                });
            }
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col">
                    <div className="container-fluid">
                        <div className={"custom-label text-bold text-blue"}>
                            Add Photos or Documents
                        </div>

                        <div className="row camera-grids   no-gutters   ">
                            <div className="col-12  text-left ">
                                <div className="">
                                    <div className={""}>
                                        <div className={"file-uploader-box"}>
                                            <div className={"file-uploader-thumbnail-container"}>
                                                <div
                                                    className={"file-uploader-thumbnail-container"}>
                                                    <label
                                                        className={"label-file-input"}
                                                        htmlFor="fileInput">
                                                        <AddPhotoIcon
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
                                                        onChange={(e) => this.handleChangeFile(e)}
                                                    />
                                                </div>

                                                {this.state.files &&
                                                    this.state.files.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className={
                                                                "file-uploader-thumbnail-container"
                                                            }>
                                                            <div
                                                                data-index={index}
                                                                className={
                                                                    "file-uploader-thumbnail"
                                                                }
                                                                style={{
                                                                    backgroundImage:
                                                                        "url(" +
                                                                        URL.createObjectURL(
                                                                            item.file
                                                                        ) +
                                                                        ")",
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
                                                                        className={
                                                                            " file-upload-img-thumbnail-check"
                                                                        }
                                                                    />
                                                                )}
                                                                {item.status === 2 && (
                                                                    <span
                                                                        className={
                                                                            "file-upload-img-thumbnail-error"
                                                                        }>
                                                                        <Error
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                            className={" "}
                                                                        />
                                                                        <p>Error!</p>
                                                                    </span>
                                                                )}
                                                                <Cancel
                                                                    data-name={item.file.name}
                                                                    data-index={item.id}
                                                                    onClick={(e) =>
                                                                        this.handleCancel(e)
                                                                    }
                                                                    className={
                                                                        "file-upload-img-thumbnail-cancel"
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col no-gutters d-flex justify-content-center">
                                <button
                                    disabled={this.state.files.length > 0 ? false : true}
                                    onClick={() => this.handleUploadImagesToServer()}
                                    className={`btn btn-default btn-lg btn-rounded shadow login-btn ${
                                        this.state.files.length > 0 ? "btn-green" : "btn-gray"
                                    }`}>
                                    Upload files
                                </button>
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

export default connect(mapStateToProps)(AddImagesToProduct);
