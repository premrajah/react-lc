import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
    baseUrl,
    ENTITY_TYPES,
    getImageAsBytes,
    MIME_TYPES,
    MIME_TYPES_ACCEPT,
} from "../../Util/Constants";
import axios from "axios";
import {checkIfMimeTypeAllowed, cleanFilename, isValidUrl, LoaderAnimated} from "../../Util/GlobalFunctions";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import ArtifactIconDisplayBasedOnMimeType from "../UploadImages/ArtifactIconDisplayBasedOnMimeType";
import MoreMenu from "../MoreMenu";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import TextFieldWrapper from "./ProductForm/TextField";
import { validateFormatCreate, validateInputs, Validators } from "../../Util/Validator";
import {ArrowDropUp, ArrowDropDown} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const ArtifactManager = ({
    entityId,
    entityType,
    loadCurrentProduct,
    showSnackbar,
    refresh,
    type,
    setArtifacts,
    ...props
}) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [artifactsTmp, setArtifactsTmp] = useState(props.artifacts ? props.artifacts : []);
    const [errorsTmp, setErrorsTmp] = useState({});
    const [fields, setFields] = useState({});
    const [resetTmp, setResetTmp] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLinksVisible, setIsLinksVisible] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);


    const resetForm = (type) => {
        if ("youtubeId") {
            setResetTmp({
                youtubeId: true,
                youtubeIdTitle: true,
            });
        }
        if ("link") {
            setResetTmp({
                videoLink: true,
                videoLinkTitle: true,
            });
        }
    };

    const handleDeleteDocument = (key) => {
        let afterRemoveDoc = artifactsTmp.filter((item) => item._key !== key);
        let artifactIds = [];

        afterRemoveDoc.forEach((item) => artifactIds.push(item._key));

        setArtifactsTmp(afterRemoveDoc);
        const payload = {
            product_id: entityId,
            artifact_ids: artifactIds,
        };

        if (entityId) handleReplaceArtifacts(payload);
    };

    const onUploadProgress = event => {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        // console.log('onUploadProgress', percentCompleted);
        setUploadProgress(percentCompleted);
    };

    const handleReplaceArtifacts = (payload) => {

        axios
            .post(`${baseUrl}product/artifact/replace`, payload)
            .then((response) => {
                if (response.status === 200) {

                    loadCurrentProduct(payload.product_id);
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: "Artifact removed successfully from product. Thanks",
                    });
                }
            })
            .catch((error) => {
                console.log("artifact replace error ", error);
                showSnackbar({
                    show: true,
                    severity: "warning",
                    message: "Unable to delete artifact at this time",
                });
            });
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
            showSnackbar({
                show: true,
                severity: "warning",
                message: "Unable to add Artifacts to the product at this time.",
            });
        }
    };

    useEffect(() => {

        if (props.artifacts&&props.artifacts.length>0)
        setArtifactsTmp(props.artifacts);
    }, [props.artifacts]);

    useEffect(() => {
        setIsLoading(false);
        if (setArtifacts && artifactsTmp && artifactsTmp.length > 0) {
            setArtifacts(artifactsTmp);
        }
    }, [artifactsTmp]);

    const handleUploadFiles = async (file) => {
        setIsLoading(true);

        getImageAsBytes(file)
            .then(async (convertedData) => {
                try {
                    const uploadedFile = await axios.post(
                        `${baseUrl}artifact/load?name=${cleanFilename(file.name.toLowerCase())}`,
                        convertedData, {onUploadProgress}
                    );

                    if (uploadedFile) {
                        const uploadedToCloudDataKey = uploadedFile.data.data._key;

                        if (entityType === ENTITY_TYPES.Product) {
                            // add to product
                            if (type !== "add") {
                                await addArtifactToProduct(uploadedToCloudDataKey, file.type);
                            }

                            const a = uploadedFile.data.data;
                            setArtifactsTmp((artifactsTmp) => [a].concat(artifactsTmp));
                        }
                    }
                } catch (error) {
                    console.log("handleUploadFileToProduct try/catch error ", error);
                    setIsLoading(false);
                    showSnackbar({
                        show: true,
                        severity: "warning",
                        message: "Unable to add artifact at this time.",
                    });
                }
            })
            .catch((error) => {
                console.log("getImageAsBytes error ", error);
                setIsLoading(false);
            })
            .finally(() => {
                setUploadProgress(null);
            });
    };
    const handleValidationFile = (type) => {
        let validations = [];

        if (type === "link")
            validations = [
                validateFormatCreate(
                    "videoLink",
                    [{ check: Validators.required, message: "" }],
                    fields
                ),
                validateFormatCreate(
                    "videoLinkTitle",
                    [{ check: Validators.required, message: "" }],
                    fields
                ),
            ];

        let { formIsValid, errors } = validateInputs(validations, fields);


        setErrorsTmp(errors);
        return formIsValid;
    };

    const handleChange = (value, field) => {
        let fieldsTmp = fields;
        fieldsTmp[field] = value;
        setFields(fieldsTmp);
    };

    const checkUrl = async (url) => {
        return fetch(url, {method: 'HEAD', headers: {'Access-Control-Allow-Headers': 'true', 'Access-Control-Allow-Origin': '*'}}).then(res => {
            // return res.headers.get('Content-Type').startsWith('image')
            return console.log(res.headers.get('Content-Type'))
        })
    }


    const handleUploadVideoLinks = async (data) => {
        if (!handleValidationFile("link")) {
            return;
        }

        if(isValidUrl(fields.videoLink)) {

            try {
                const payload = {
                    context: "video-link",
                    content: `Direct video uploaded by user [${fields.videoLink}]`,
                    blob_data: {
                        blob_url: fields.videoLink,
                        blob_name: fields.videoLinkTitle,
                        blob_mime: MIME_TYPES.MP4,
                    },
                };

                const videoLinksUploaded = await axios.post(`${baseUrl}artifact/preloaded`, payload, {onUploadProgress});

                if (videoLinksUploaded) {
                    const videoLinksUploadedKey = videoLinksUploaded.data.data._key;

                    if (entityType === ENTITY_TYPES.Product) {
                        if (type !== "add") await addArtifactToProduct(videoLinksUploadedKey);
                        const a = videoLinksUploaded.data.data;

                        setArtifactsTmp((artifactsTmp) => [a].concat(artifactsTmp));
                        resetForm("link");
                    }
                }
            } catch (error) {
                console.log("handleUploadVideoLinks error ", error);
            } finally {
                setUploadProgress(null);
            }
        } else {
            showSnackbar({
                show: true,
                severity: "warning",
                message: "Please enter a valid url.",
            });
        }
    };

    const handleUploadedFiles = (files) => {
        const uploaded = [...uploadedFiles];

        files.some((file) => {
            if (!checkIfMimeTypeAllowed(file)) {
                showSnackbar({
                    show: true,
                    severity: "warning",
                    message: `${file.name} File type not supported`,
                });
                return;
            } else if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                handleUploadFiles(file);
            }
        });

    };

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        handleUploadedFiles(chosenFiles);
    };

    return (
        <>
            <div className="row d-flex align-items-end mt-3 mb-2">
                <div className="col-md-10">
                    <>
                        {!props.isArchiver &&  <div className="row d-flex align-items-end">
                            <div className="col-12 d-flex mb-2">
                                <div className="me-3">
                                    {!isLoading ? (
                                        <Button style={{height:"61px"}} className="" variant="outlined" component="label">
                                            Upload Files
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleFileEvent}
                                                multiple
                                                accept={MIME_TYPES_ACCEPT}
                                            />
                                        </Button>
                                    ) : (
                                        <LoaderAnimated />
                                    )}
                                </div>

                                <div className="">
                                    <Button  style={{height:"61px"}} variant="outlined" onClick={() => setIsLinksVisible(prev => !prev)}>
                                        Add Video Links {isLinksVisible ? <ArrowDropUp /> : <ArrowDropDown/> }
                                    </Button>
                                </div>
                            </div>
                        </div>}
                    </>

                    {isLinksVisible && <>
                        <div className="row d-flex align-items-end">
                            <div className="col-md-5">
                                <TextFieldWrapper
                                    reset={resetTmp["videoLink"]}
                                    onChange={(value) => handleChange(value, "videoLink")}
                                    name="videoLink"
                                    error={errorsTmp["videoLink"]}
                                    placeholder="Link"
                                    height={"44px"}
                                />
                            </div>
                            <div className="col-md-5">
                                <TextFieldWrapper
                                    height={"44px"}
                                    reset={resetTmp["videoLinkTitle"]}
                                    onChange={(value) => handleChange(value, "videoLinkTitle")}
                                    name="videoLinkTitle"
                                    error={errorsTmp["videoLinkTitle"]}
                                    placeholder="Title"
                                />
                            </div>
                            <div className="col-md-2  mb-2">
                                <Button
                                    className="me-1"
                                    style={{height: '61px'}}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleUploadVideoLinks}>
                                    Upload
                                </Button>
                            </div>
                        </div>
                    </>}
                </div>
            </div>

            <div className="row">
                <div className="col">
                    {uploadProgress && <>
                        <small>{uploadProgress}% Uploaded</small>
                        <progress id="progressBar" value={uploadProgress ? uploadProgress : 0} max="100"
                                  style={{width: '100%'}}></progress>
                    </>}
                </div>
            </div>

            <div className="row ">
                <div className="col-12">
                    {artifactsTmp && artifactsTmp.length > 0 ? (
                        artifactsTmp.map((artifact, index) => {
                            return (
                                <React.Fragment key={artifact._key}>
                                    <div key={index} className="mt-1 mb-1 text-left pt-1 pb-1  row">
                                        <div className="col-10 ellipsis-end">
                                            <ArtifactIconDisplayBasedOnMimeType
                                                artifact={artifact}
                                            />
                                            <span
                                                className="ms-4  text-blue text-bold"
                                                rel="noopener noreferrer">
                                                {artifact.name}
                                            </span>
                                        </div>
                                        <div className="col-2 d-flex justify-content-end">
                                            {!props.hideMenu && (
                                                <MoreMenu
                                                    triggerCallback={() => {
                                                        handleDeleteDocument(artifact._key);
                                                    }}
                                                    download={true}
                                                    delete={props.isLoggedIn&&!props.isArchiver}
                                                />
                                            )}
                                            {props.showDelete && (
                                                <span
                                                    className="ms-2 text-danger "
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        handleDeleteDocument(artifact._key)
                                                    }>
                                                    <CloseIcon
                                                        // style={{ opacity: "0.5" }}
                                                        className=" text-danger "
                                                    />
                                                </span>
                                            )}
                                        </div>

                                    </div>
                                </React.Fragment>
                            );

                        })
                    ) : (
                        <div className="mt-2 d-none">No documents added.</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactManager);
