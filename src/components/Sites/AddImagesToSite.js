import React, {Component} from "react";
import {baseUrl, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import {Spinner} from "react-bootstrap";
import {Cancel, Check, Error, Publish} from "@mui/icons-material";
import axios from "axios";
import {connect} from "react-redux";
import docs from '../../img/icons/docs.png';
import * as actionCreator from "../../store/actions/actions";
import {cleanFilename} from "../../Util/GlobalFunctions";

class AddImagesToSite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            images: [],
            productKey: null,
        };
    }


    handleChangeFile = (event) => {
        if (!event) return;

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
    };

    handleCancel = (e) => {
        e.preventDefault();

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
        this.addArtifactsToProduct( this.state.images);

    };

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

    handleCallbackImagesUploadStatus = (imageUploadStatus) => {
        // this.props.handleCallBackImagesUploadStatus(imageUploadStatus);
    };



    addArtifactsToProduct = ( images) => {


        if (!images.length > 0) return;
        // this.handleCallbackImagesUploadStatus("");

        const payload = {
            site_id: this.props.item.site._key,
            artifact_ids: images,
        };



        axios
            .post(`${baseUrl}site/artifact`, payload)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        images: [],
                        files: [],
                    });


                    this.props.showSnackbar({show:true,severity:"success",message:"Artifacts linked successfully to site. Thanks"})

                    this.props.loadCurrentSite(this.props.item.site._key)
                    // this.props.loadCurrentProduct(this.props.item.product._key)


                }
            })
            .catch((error) => {

                this.handleCallbackImagesUploadStatus("fail");
            });
    };

    uploadImage(files) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let imgFile = files[i];

                this.getImageAsBytes(imgFile.file)
                    .then(data => {
                        const payload = data;

                        try {
                            axios.post(`${baseUrl}artifact/load?name=${cleanFilename(imgFile.file.name.toLowerCase())}`, payload)
                                .then(res => {

                                    let images = [...this.state.images];
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
                                .catch(error => {

                                    let currentFiles = [...this.state.files];
                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 2; //failed
                                        }
                                    }

                                    this.setState({
                                        files: currentFiles,
                                    });
                                })

                        } catch (e) {

                        }

                    })
                    .catch(error => {
                        // console.log('image upload error ', error);
                    })

            }
        }
    }

    render() {
        return (
            <div className="row mt-4">
                <div className="col">

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
                                                        htmlFor="fileInput-2">
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
                                                        id="fileInput-2"
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
                                                                    backgroundImage: `url(${URL.createObjectURL(item.file)}), url(${docs})`
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
                            <div className="col no-gutters d-flex ">
                                <button
                                    disabled={this.state.files.length > 0 ? false : true}
                                    onClick={() => this.handleUploadImagesToServer()}
                                    className={`btn btn-default   ${
                                        this.state.files.length > 0 ? " blue-btn-border" : "btn-gray"
                                    }`}>
                                    Upload files
                                </button>
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
const mapDispachToProps = (dispatch) => {
    return {

        loadCurrentSite: (data) =>
            dispatch(actionCreator.loadCurrentSite(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};

export default connect(mapStateToProps, mapDispachToProps)(AddImagesToSite);
