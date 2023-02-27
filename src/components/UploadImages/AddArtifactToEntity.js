import FormControl from "@mui/material/FormControl";
import { Button, MenuItem } from "@mui/material";
import { Add, Upload } from "@mui/icons-material";
import React, { useState } from "react";
import MenuDropdown from "../FormsUI/MenuDropdown";
import { baseUrl, BYTES_TO_SIZE, getImageAsBytes, MIME_TYPES_ACCEPT } from "../../Util/Constants";
import axios from "axios";
import { cleanFilename } from "../../Util/GlobalFunctions";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";

const UPLOAD_TYPE_VALUES = ["From System", "Youtube Id", "Video link"];
const MAX_COUNT = 5;
const MAX_FILE_SIZE = 26214400;

const AddArtifactToEntity = ({ entityId, entityType, loadCurrentProduct, showSnackbar }) => {
    // console.log("entity Id ", entityId);
    const [uploadType, setUploadType] = useState(UPLOAD_TYPE_VALUES[0]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);
    const [uploadedYoutubeIds, setUploadedYoutubeIds] = useState([]);
    const [videoLinks, setVideoLinks] = useState([]);

    const handleUploadTypeSelect = (value) => {
        setUploadType(value);
    };

    const addArtifactToProduct = async (key) => {
        const payload = {
            product_id: entityId,
            artifact_ids: [key],
        };

        const uploadToServer = await axios.post(`${baseUrl}product/artifact`, payload);

        if (uploadToServer.status === 200) {
            setUploadedFiles([]);
            loadCurrentProduct(entityId); // reload page
            showSnackbar({
                show: true,
                severity: "success",
                message: "Artifacts added successfully to product. Thanks",
            });
        }
    };

    const handleUploadFiles = () => {

        uploadedFiles.map((file, index) => {
            getImageAsBytes(file)
                .then(async (convertedData) => {
                    try {
                        const uploadedFile = await axios.post(
                            `${baseUrl}artifact/load?name=${cleanFilename(
                                file.name.toLowerCase()
                            )}`,
                            convertedData
                        );
                        const uploadedToCloudDataKey = uploadedFile.data.data._key;

                        // add to product
                        await addArtifactToProduct(uploadedToCloudDataKey);
                    } catch (error) {
                        console.log("handleUploadFileToProduct try/catch error ", error);
                        showSnackbar({
                            show: true,
                            severity: "warning",
                            message: "Unable to add images at this time.",
                        });
                    }
                })
                .catch((error) => {
                    console.log("getImageAsBytes error ", error);
                });
        });
    };

    const handleUploadedFiles = (files) => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;

        files.some((file) => {
            // check if already exist
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                if (file.size > MAX_FILE_SIZE) {
                    showSnackbar({ show: true, severity: "warning", message: `File is too large` });
                    return;
                } else {
                    uploaded.push(file);
                    if (uploaded.length === MAX_COUNT) setFileLimit(true);
                    if (uploaded.length > MAX_COUNT) {
                        showSnackbar({
                            show: true,
                            severity: "warning",
                            message: ` you can only add a maximum of ${MAX_COUNT} files`,
                        });
                        setFileLimit(false);
                        limitExceeded = true;
                        return true;
                    }
                }
            }
        });
        if (!limitExceeded) setUploadedFiles(uploaded);
    };

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        handleUploadedFiles(chosenFiles);
    };

    const handleRemoveUploadedFiles = (file) => {
        const uploaded = [...uploadedFiles];
        const index = uploaded.indexOf(file);

        if (index > -1) {
            uploaded.splice(index, 1);
            setUploadedFiles(uploaded);
        }

        uploaded.length === MAX_COUNT ? setFileLimit(true) : setFileLimit(false);
    };

    const handleRemoveYoutubeIds = (file) => {
        const uploaded = [...uploadedYoutubeIds];
        const index = uploaded.indexOf(file);

        if (index > -1) {
            uploaded.splice(index, 1);
            setUploadedYoutubeIds(uploaded);
        }
    };

    const handleRemoveVideoLinks = (file) => {
        const uploaded = [...videoLinks];
        const index = uploaded.indexOf(file);

        if (index > -1) {
            uploaded.splice(index, 1);
            setVideoLinks(uploaded);
        }
    }

    const validationYoutubeIdSchema = yup.object({
        youtubeId: yup.string("Enter Youtube id").required("Youtube id required"),
        youtubeIdTitle: yup.string("Enter a title").required("Title required"),
    });

    const formikYoutubeIdForm = useFormik({
        initialValues: {
            youtubeId: "",
            youtubeIdTitle: "",
        },
        validationSchema: validationYoutubeIdSchema,
        onSubmit: (values, { resetForm }) => {
            const data = {
                youtubeId: values.youtubeId,
                youtubeIdTitle: values.youtubeIdTitle,
            };
            setUploadedYoutubeIds((oldArray) => [...oldArray, data]);
            resetForm();
        },
    });

    const validationVideoLinkSchema = yup.object({
        videoLink: yup.string("Add a direct link (url) to video").required("Link (url) required"),
        videoLinkTitle: yup.string("Enter a title").required("Title required"),
    });

    const formikVideoLinkForm = useFormik({
        initialValues: {
            videoLink: "",
            videoLinkTitle: "",
        },
        validationSchema: validationVideoLinkSchema,
        onSubmit: (values, { resetForm }) => {
            const data = {
                videoLink: values.videoLink,
                videoLinkTitle: values.videoLinkTitle,
            };
            setVideoLinks(oldArray => [...oldArray, data]);
            resetForm();
        },
    });

    return (
        <>
            <div className="row mt-3 mb-2">
                <div className="col-md-3">
                    <FormControl fullWidth>
                        <MenuDropdown
                            setSelection={(value) => handleUploadTypeSelect(value)}
                            options={UPLOAD_TYPE_VALUES}
                        />
                    </FormControl>
                </div>
                <div className="col-md-9">
                    {uploadType === UPLOAD_TYPE_VALUES[0] && (
                        <>
                            <div className="row">
                                <div className="d-flex">
                                    <Button
                                        className="me-3"
                                        variant="outlined"
                                        component="label"
                                        disabled={fileLimit}>
                                        <Add /> Files
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileEvent}
                                            multiple
                                            accept={MIME_TYPES_ACCEPT}
                                            disabled={fileLimit}
                                        />
                                    </Button>

                                    {uploadedFiles.length > 0 && (
                                        <div>
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleUploadFiles()}>
                                                <Upload />
                                                Upload
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <small>
                                        Upto {MAX_COUNT} files at a time only. Each file{" "}
                                        {BYTES_TO_SIZE(MAX_FILE_SIZE)}.
                                        {uploadedFiles.length > 0 && (
                                            <span className="ms-3 click-item">
                                                Clear all selected
                                            </span>
                                        )}
                                    </small>
                                </div>
                            </div>

                            {uploadedFiles.length > 0 && (
                                <div className="row mt-2">
                                    <div className="col-12">
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="mb-1">
                                                <span
                                                    className="me-2 click-item text-danger border p-1"
                                                    onClick={() => handleRemoveUploadedFiles(file)}>
                                                    X
                                                </span>
                                                {file.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {uploadType === UPLOAD_TYPE_VALUES[1] && (
                        <>
                            <form
                                noValidate
                                autoComplete="off"
                                onSubmit={formikYoutubeIdForm.handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="youtubeId"
                                            name="youtubeId"
                                            label="Youtube Id"
                                            value={formikYoutubeIdForm.values.youtubeId}
                                            onChange={formikYoutubeIdForm.handleChange}
                                            error={
                                                formikYoutubeIdForm.touched.youtubeId &&
                                                Boolean(formikYoutubeIdForm.errors.youtubeId)
                                            }
                                            helperText={
                                                formikYoutubeIdForm.touched.youtubeId &&
                                                formikYoutubeIdForm.errors.youtubeId
                                            }
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="youtubeIdTitle"
                                            name="youtubeIdTitle"
                                            label="Youtube Title"
                                            value={formikYoutubeIdForm.values.youtubeIdTitle}
                                            onChange={formikYoutubeIdForm.handleChange}
                                            error={
                                                formikYoutubeIdForm.touched.youtubeIdTitle &&
                                                Boolean(formikYoutubeIdForm.errors.youtubeIdTitle)
                                            }
                                            helperText={
                                                formikYoutubeIdForm.touched.youtubeIdTitle &&
                                                formikYoutubeIdForm.errors.youtubeIdTitle
                                            }
                                        />
                                    </div>
                                    <div className="col-md-3 d-flex">
                                        <Button
                                            className="me-1"
                                            sx={{ maxHeight: 40 }}
                                            variant="outlined"
                                            size="small"
                                            type="submit">
                                            Add
                                        </Button>
                                        {uploadedYoutubeIds.length > 0 && (
                                            <Button
                                                sx={{ maxHeight: 40 }}
                                                variant="outlined"
                                                type="button">
                                                Upload
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>

                            {uploadedYoutubeIds.length > 0 && (
                                <div className="row mt-2">
                                    <div className="col-12">
                                        {/*TODO are you sure*/}
                                        <small>Clear all selected</small>
                                    </div>
                                    <div className="col-12">
                                        {uploadedYoutubeIds.map((yId, index) => (
                                            <div key={index} className="mb-1">
                                                <span
                                                    className="me-2 click-item text-danger border p-1"
                                                    onClick={() => handleRemoveYoutubeIds(yId)}>
                                                    X
                                                </span>
                                                {yId.youtubeId} {yId.youtubeIdTitle}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {uploadType === UPLOAD_TYPE_VALUES[2] && (
                        <>
                            <form
                                noValidate
                                autoComplete="off"
                                onSubmit={formikVideoLinkForm.handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="videoLink"
                                            name="videoLink"
                                            label="Video Link"
                                            value={formikVideoLinkForm.values.videoLink}
                                            onChange={formikVideoLinkForm.handleChange}
                                            error={
                                                formikVideoLinkForm.touched.videoLink &&
                                                Boolean(formikVideoLinkForm.errors.videoLink)
                                            }
                                            helperText={
                                                formikVideoLinkForm.touched.videoLink &&
                                                formikVideoLinkForm.errors.videoLink
                                            }
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            id="videoLinkTitle"
                                            name="videoLinkTitle"
                                            label="Video Link Title"
                                            value={formikVideoLinkForm.values.videoLinkTitle}
                                            onChange={formikVideoLinkForm.handleChange}
                                            error={
                                                formikVideoLinkForm.touched.videoLinkTitle &&
                                                Boolean(formikVideoLinkForm.errors.videoLinkTitle)
                                            }
                                            helperText={
                                                formikVideoLinkForm.touched.videoLinkTitle &&
                                                formikVideoLinkForm.errors.videoLinkTitle
                                            }
                                        />
                                    </div>
                                    <div className="col-md-3 d-flex">
                                        <Button
                                            className="me-1"
                                            sx={{ maxHeight: 40 }}
                                            variant="outlined"
                                            size="small"
                                            type="submit">
                                            Add
                                        </Button>
                                        {videoLinks.length > 0 && <Button
                                            sx={{maxHeight: 40}}
                                            variant="outlined"
                                            type="button">
                                            Upload
                                        </Button>}
                                    </div>
                                </div>
                            </form>

                            {videoLinks.length > 0 && (
                                <div className="row mt-2">
                                    <div className="col-12">
                                        {/*TODO are you sure*/}
                                        <small>Clear all selected</small>
                                    </div>
                                    <div className="col-12">
                                        {videoLinks.map((vid, index) => (
                                            <div key={index} className="mb-1">
                                                <span
                                                    className="me-2 click-item text-danger border p-1"
                                                    onClick={() => handleRemoveVideoLinks(vid)}>
                                                    X
                                                </span>
                                                {vid.videoLink} {vid.videoLinkTitle}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loadCurrentProduct: (data) => dispatch(actionCreator.loadCurrentProduct(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddArtifactToEntity);
