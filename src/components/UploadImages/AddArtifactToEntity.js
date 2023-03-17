import FormControl from "@mui/material/FormControl";
import { Button } from "@mui/material";
import React, {useState } from "react";
import MenuDropdown from "../FormsUI/MenuDropdown";
import {
    baseUrl,
    BYTES_TO_SIZE,
    ENTITY_TYPES,
    getImageAsBytes,
    MIME_TYPES,
    MIME_TYPES_ACCEPT,
} from "../../Util/Constants";
import axios from "axios";
import {checkIfMimeTypeAllowed, cleanFilename, LoaderAnimated} from "../../Util/GlobalFunctions";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";


const UPLOAD_TYPE_VALUES = ["From System", "Youtube Id", "Video link"];
const MAX_COUNT = 5;
const MAX_FILE_SIZE = 52428800;

const AddArtifactToEntity = ({
    entityId,
    entityType,
    loadCurrentProduct,
    showSnackbar,
    refresh,
}) => {
    const [uploadType, setUploadType] = useState(UPLOAD_TYPE_VALUES[0]);
    const [fileLimit, setFileLimit] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedYoutubeIds, setUploadedYoutubeIds] = useState([]);
    const [videoLinks, setVideoLinks] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleUploadTypeSelect = (value) => {
        setUploadType(value);
    };

    const resetAllFileUploads = async () => {
        setUploadedFiles([]);
        setUploadedYoutubeIds([]);
        setVideoLinks([]);
        setFileLimit(false); // reset size limit
    };

    const addArtifactToProduct = async (key, type) => {
        try {
            const payload = {
                product_id: entityId,
                artifact_ids: [key],
            };

            const uploadToServer = await axios.post(`${baseUrl}product/artifact`, payload);

            if (uploadToServer.status === 200) {
                setIsLoading(false);
                refresh();
                setUploadedFiles([]); // reset uploaded files

                if (
                    type === MIME_TYPES.PNG ||
                    type === MIME_TYPES.JPEG ||
                    type === MIME_TYPES.JPG
                ) {
                    loadCurrentProduct(entityId);
                }

                showSnackbar({
                    show: true,
                    severity: "success",
                    message: "Artifacts added successfully to product. Thanks",
                });
            }
        } catch (error) {
            console.log("addArtifactToProduct error ", error);
            setIsLoading(false);
        }
    };

    const handleUploadFiles = async (file) => {
        setIsLoading(true);
        // uploadedFiles.map((file) => {
        getImageAsBytes(file)
            .then(async (convertedData) => {
                try {
                    const uploadedFile = await axios.post(
                        `${baseUrl}artifact/load?name=${cleanFilename(file.name.toLowerCase())}`,
                        convertedData
                    );

                    if (uploadedFile) {
                        const uploadedToCloudDataKey = uploadedFile.data.data._key;

                        if (entityType === ENTITY_TYPES.Product) {
                            // add to product
                            await addArtifactToProduct(uploadedToCloudDataKey, file.type);
                        }
                    }
                } catch (error) {
                    console.log("handleUploadFileToProduct try/catch error ", error);
                    setIsLoading(false);
                    showSnackbar({
                        show: true,
                        severity: "warning",
                        message: "Unable to add images at this time.",
                    });
                }
            })
            .catch((error) => {
                console.log("getImageAsBytes error ", error);
                setIsLoading(false);
            });
        // });
    };

    const handleUploadYoutubeIds = async (data) => {
        // uploadedYoutubeIds.map(async (yId) => {
        try {
            const payload = {
                context: "youtube-id",
                content: `Youtube id uploaded by user [${data.youtubeId}]`,
                blob_data: {
                    // "blob_url": yId.youtubeId,
                    blob_url: `https://www.youtube.com/watch?v=${data.youtubeId}`,
                    blob_name: data.youtubeIdTitle,
                    blob_mime: MIME_TYPES.MP4,
                },
            };

            const youtubeIdsUpload = await axios.post(`${baseUrl}artifact/preloaded`, payload);

            if (youtubeIdsUpload) {
                const youtubeIdsUploadedKey = youtubeIdsUpload.data.data._key;

                if (entityType === ENTITY_TYPES.Product) {
                    // add to product
                    await addArtifactToProduct(youtubeIdsUploadedKey);
                }
            }
        } catch (error) {
            console.log("handleUploadYoutubeIds error ", error);
        }
        // });
    };

    const handleUploadVideoLinks = async (data) => {
        // videoLinks.map(async (vId) => {
        try {
            const payload = {
                context: "video-link",
                content: `Direct video uploaded by user [${data.videoLink}]`,
                blob_data: {
                    // "blob_url": yId.youtubeId,
                    blob_url: data.videoLink,
                    blob_name: data.videoLinkTitle,
                    blob_mime: MIME_TYPES.MP4,
                },
            };

            const videoLinksUploaded = await axios.post(`${baseUrl}artifact/preloaded`, payload);

            if (videoLinksUploaded) {
                const videoLinksUploadedKey = videoLinksUploaded.data.data._key;

                if (entityType === ENTITY_TYPES.Product) {
                    // add to product
                    await addArtifactToProduct(videoLinksUploadedKey);
                }
            }
        } catch (error) {
            console.log("handleUploadVideoLinks error ", error);
        }
        // });
    };

    const handleUploadedFiles = (files) => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;

        files.some((file) => {
            if (!checkIfMimeTypeAllowed(file)) {
                showSnackbar({
                    show: true,
                    severity: "warning",
                    message: `${file.name} File type not supported`,
                });
                return;
            } else if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                if (file.size > MAX_FILE_SIZE) {
                    showSnackbar({ show: true, severity: "warning", message: `File is too large` });
                    return;
                } else {
                    uploaded.push(file);

                    handleUploadFiles(file);

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
    };

    const handleUploadAllFiles = async () => {
        if (uploadedFiles.length > 0) {
            await handleUploadFiles();
        }

        if (uploadedYoutubeIds.length > 0) {
            await handleUploadYoutubeIds();
        }
        if (videoLinks.length > 0) {
            await handleUploadVideoLinks();
        }

        await resetAllFileUploads();
    };

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

            handleUploadYoutubeIds(data);
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
            setVideoLinks((oldArray) => [...oldArray, data]);
            resetForm();

            handleUploadVideoLinks(data);
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
                <div className="col-md-8">
                    {uploadType === UPLOAD_TYPE_VALUES[0] && (
                        <>
                            <div className="row">
                                <div className="">
                                    {!isLoading ? <Button
                                        className=""
                                        variant="outlined"
                                        component="label"
                                        disabled={fileLimit}>
                                        Add Files
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileEvent}
                                            multiple
                                            accept={MIME_TYPES_ACCEPT}
                                            disabled={fileLimit}
                                        />
                                    </Button> : <LoaderAnimated />}
                                </div>
                                <div>
                                    <small>
                                        Upto {MAX_COUNT} files at a time only. Each file {BYTES_TO_SIZE(MAX_FILE_SIZE)} Max.
                                    </small>
                                </div>
                            </div>
                        </>
                    )}

                    {uploadType === UPLOAD_TYPE_VALUES[1] && (
                        <>
                            <form
                                noValidate
                                autoComplete="off"
                                onSubmit={formikYoutubeIdForm.handleSubmit}>
                                <div className="row">
                                    <div className="col-md-5">
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
                                    <div className="col-md-2 d-flex">
                                        <Button
                                            className="me-1"
                                            sx={{ maxHeight: 40 }}
                                            variant="outlined"
                                            size="small"
                                            type="submit">
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}

                    {uploadType === UPLOAD_TYPE_VALUES[2] && (
                        <>
                            <form
                                noValidate
                                autoComplete="off"
                                onSubmit={formikVideoLinkForm.handleSubmit}>
                                <div className="row">
                                    <div className="col-md-5">
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
                                    <div className="col-md-2 d-flex">
                                        <Button
                                            className="me-1"
                                            sx={{ maxHeight: 40 }}
                                            variant="outlined"
                                            size="small"
                                            type="submit">
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <div className="row d-none">
                {uploadedFiles.length > 0 && (
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
                )}

                {uploadedYoutubeIds.length > 0 && (
                    <div className="col-12">
                        {uploadedYoutubeIds.map((yId, index) => (
                            <div key={index} className="mb-1">
                                <span
                                    className="me-2 click-item text-danger border p-1"
                                    onClick={() => handleRemoveYoutubeIds(yId)}>
                                    X
                                </span>
                                {yId.youtubeId} - {yId.youtubeIdTitle}
                            </div>
                        ))}
                    </div>
                )}

                {videoLinks.length > 0 && (
                    <div className="col-12">
                        {videoLinks.map((vid, index) => (
                            <div key={index} className="mb-1">
                                <span
                                    className="me-2 click-item text-danger border p-1"
                                    onClick={() => handleRemoveVideoLinks(vid)}>
                                    X
                                </span>
                                {vid.videoLink} - {vid.videoLinkTitle}
                            </div>
                        ))}
                    </div>
                )}

                <div className="col-12  pt-2 pb-2">
                    {(uploadedFiles.length > 0 ||
                        uploadedYoutubeIds.length > 0 ||
                        videoLinks.length > 0) && (
                        <div className="col-md-1">
                            <Button variant="outlined" onClick={() => handleUploadAllFiles()}>
                                Upload
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="border mt-1 mb-1"></div>
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
