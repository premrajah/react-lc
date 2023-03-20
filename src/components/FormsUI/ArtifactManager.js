import {Button} from "@mui/material";
import React, {useEffect, useState} from "react";
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
import {connect} from "react-redux";
import * as yup from "yup";
import {useFormik} from "formik";
import ArtifactIconDisplayBasedOnMimeType from "../UploadImages/ArtifactIconDisplayBasedOnMimeType";
import MoreMenu from "../MoreMenu";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import TextFieldWrapper from "./ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";


const UPLOAD_TYPE_VALUES = ["System", "Youtube Id", "Video link"];
const MAX_COUNT = 5;
const MAX_FILE_SIZE = 52428800;

const ArtifactManager = ({
                                 entityId,
                                 entityType,
                                 loadCurrentProduct,
                                 showSnackbar,
                                 refresh,type,setArtifacts,...props
                             }) => {
    const [uploadType, setUploadType] = useState(UPLOAD_TYPE_VALUES[0]);
    const [fileLimit, setFileLimit] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedYoutubeIds, setUploadedYoutubeIds] = useState([]);
    const [videoLinks, setVideoLinks] = useState([]);
    const [artifactsTmp,setArtifactsTmp] = useState(props.artifacts?props.artifacts:[])
    const [show, setShow] = useState(false);
    const [errorsTmp, setErrorsTmp] = useState({});
    const [fields, setFields] = useState({});
    const [resetTmp, setResetTmp] = useState({});

    // const [artifacts,setArtifacts]=useState(props.artifacts)
    const [docKey, setDocKey] = useState(null);
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

    const resetForm = (type) => {

        if ("youtubeId"){
            setResetTmp({
                youtubeId:true,youtubeIdTitle:true})
        }
        if ("link"){
            setResetTmp({
                videoLink:true,videoLinkTitle:true})
        }
    };

    const callBackResult = (action, key, blob_url) => {
        if (action === "download") {
            window.location.href = blob_url;
        } else if (action === "delete") {
            setDocKey(key);

            handleDeleteDocument(key);
        }
    };
    const handleDeleteDocument = (key) => {
        let afterRemoveDoc = artifactsTmp.filter((item) => item._key !== key);
        let artifactIds = [];

        afterRemoveDoc.forEach((item) => artifactIds.push(item._key));

        setArtifactsTmp(afterRemoveDoc)
        const payload = {
            product_id: entityId,
            artifact_ids: artifactIds,
            // artifactsTmp:afterRemoveDoc
        };
        //
        // handleClose();
        //


        if (entityId)
        handleReplaceArtifacts(payload);
    };
    const handleDocumentKey = (key) => {
        handleShow();
        setDocKey(key);
    };
    const handleReplaceArtifacts = (payload) => {
        axios.post(`${baseUrl}product/artifact/replace`, payload)
            .then((response) => {
                if (response.status === 200) {
                    handleClose();
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
                // handlePageRefreshCallback("fail", payload.product_id)
            });
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
        }
    };

    useEffect(()=>{

        setArtifactsTmp(props.artifacts?props.artifacts:[])

    },[props.artifacts])

    useEffect(()=>{
        setIsLoading(false);

        console.log(artifactsTmp)
        if (setArtifacts&&artifactsTmp&&artifactsTmp.length>0){
            setArtifacts(artifactsTmp)
        }

    },[artifactsTmp])

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
                            if (type!=="add"){
                                await addArtifactToProduct(uploadedToCloudDataKey, file.type);
                            }

                            // else{

                                console.log(uploadedFile.data.data)


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
   const handleValidationFile=(type)=> {

       let validations=[]


       if (type=="youtubeId")
         validations=[
            validateFormatCreate("youtubeId", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("youtubeIdTitle", [{check: Validators.required, message: 'Required'}],fields),

        ]

       else if (type=="link")
           validations=[
               validateFormatCreate("videoLink", [{check: Validators.required, message: 'Required'}],fields),
               validateFormatCreate("videoLinkTitle", [{check: Validators.required, message: 'Required'}],fields),
           ]

        let {formIsValid,errors}= validateInputs(validations,fields)

        console.log(errors)

       setErrorsTmp(errorsTmp)
        return formIsValid;
    }


    const handleChange=(value,field ) => {

        let fieldsTmp = fields;
        fieldsTmp[field] = value;
        setFields(fieldsTmp)
    }

    const handleUploadYoutubeIds = async (data) => {
        // uploadedYoutubeIds.map(async (yId) => {

        if (!handleValidationFile("youtubeId")){
            return
        }

        try {
            const payload = {
                context: "youtube-id",
                content: `Youtube id uploaded by user [${fields.youtubeId}]`,
                blob_data: {
                    // "blob_url": yId.youtubeId,
                    blob_url: `https://www.youtube.com/watch?v=${fields.youtubeId}`,
                    blob_name: fields.youtubeIdTitle,
                    blob_mime: MIME_TYPES.MP4,
                },
            };

            const youtubeIdsUpload = await axios.post(`${baseUrl}artifact/preloaded`, payload);

            if (youtubeIdsUpload) {
                const youtubeIdsUploadedKey = youtubeIdsUpload.data.data._key;

                if (entityType === ENTITY_TYPES.Product) {
                    if (type!=="add")
                        await addArtifactToProduct(youtubeIdsUploadedKey);
                        const a = youtubeIdsUpload.data.data;


                        setArtifactsTmp((artifactsTmp) => [a].concat(artifactsTmp));

                        resetForm("youtubeId")
                    // }
                }
            }
        } catch (error) {
            console.log("handleUploadYoutubeIds error ", error);
        }
        // });
    };

    const handleUploadVideoLinks = async (data) => {

        if (!handleValidationFile("link")){
            return
        }

        // videoLinks.map(async (vId) => {
        try {
            const payload = {
                context: "video-link",
                content: `Direct video uploaded by user [${fields.videoLink}]`,
                blob_data: {
                    // "blob_url": yId.youtubeId,
                    blob_url: fields.videoLink,
                    blob_name: fields.videoLinkTitle,
                    blob_mime: MIME_TYPES.MP4,
                },
            };

            const videoLinksUploaded = await axios.post(`${baseUrl}artifact/preloaded`, payload);

            if (videoLinksUploaded) {
                const videoLinksUploadedKey = videoLinksUploaded.data.data._key;

                if (entityType === ENTITY_TYPES.Product) {
                    // add to product
                    if (type!=="add")
                        await addArtifactToProduct(videoLinksUploadedKey);
                    // else{

                        console.log(videoLinksUploaded)
                        // setUploadedFiles(files => [...files, videoLinksUploaded]);
                        // setArtifactsTmp(artifactsTmp => [...artifactsTmp, videoLinksUploaded])
                        // setIsLoading(false);
                        const a = videoLinksUploaded.data.data;

                        setArtifactsTmp((artifactsTmp) => [a].concat(artifactsTmp));
                        resetForm("link")
                    // }

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
                    uploaded.push(file);
                    handleUploadFiles(file);

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
        onSubmit: (values, e, { resetForm }) => {

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



            <div className="row d-flex align-items-end mt-3 mb-2">
                <div className="col-md-3">
                    <div className={"custom-label text-bold text-blue mb-0 ellipsis-end"}>
                        From
                    </div>
                    <div className="mb-2" style={{border:"1px solid #ced4da" ,borderRadius: "4px" }}>
                        <MenuDropdown
                            setSelection={(value) => handleUploadTypeSelect(value)}
                            options={UPLOAD_TYPE_VALUES}
                        />
                    </div>
                </div>
                <div className="col-md-8">
                    {uploadType === UPLOAD_TYPE_VALUES[0] && (
                        <>
                            <div className="row d-flex align-items-end">
                                <div className="">
                                    {!isLoading ? <Button
                                        className="mb-2"
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
                                <div className="d-none">
                                    <small>
                                        Upto {MAX_COUNT} files at a time only. Each file {BYTES_TO_SIZE(MAX_FILE_SIZE)} Max.
                                    </small>
                                </div>
                            </div>
                        </>
                    )}

                    {uploadType === UPLOAD_TYPE_VALUES[1] && (
                        <>

                            <div className="row d-flex align-items-end">
                                <div className="col-md-5">
                                    <TextFieldWrapper
                                        reset={resetTmp["youtubeId"]}
                                        onChange={(value)=>handleChange(value,"youtubeId")}
                                        name="youtubeId" title="Youtube Id"
                                        error={errorsTmp["youtubeId"]}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <TextFieldWrapper
                                        reset={resetTmp["youtubeIdTitle"]}
                                        onChange={(value)=>handleChange(value,"youtubeIdTitle")}
                                        name="youtubeIdTitle" title="Title"
                                        error={errorsTmp["youtubeIdTitle"]}
                                    />
                                </div>
                                <div className="col-md-2  mb-2">
                                    <Button
                                        className="me-1"
                                        sx={{ maxHeight: 40 }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleUploadYoutubeIds}>
                                        Add
                                    </Button>
                                </div>
                            </div>

                        </>
                    )}

                    {uploadType === UPLOAD_TYPE_VALUES[2] && (
                        <>

                                <div className="row d-flex align-items-end">
                                    <div className="col-md-5">
                                        <TextFieldWrapper
                                            reset={resetTmp["videoLink"]}
                                            onChange={(value)=>handleChange(value,"videoLink")}
                                            name="videoLink" title="Video Link"
                                            error={errorsTmp["videoLink"]}
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <TextFieldWrapper
                                            reset={resetTmp["videoLinkTitle"]}
                                            onChange={(value)=>handleChange(value,"videoLinkTitle")}
                                            name="videoLinkTitle" title="Title"
                                            error={errorsTmp["videoLinkTitle"]}
                                        />
                                    </div>
                                    <div className="col-md-2  mb-2">
                                        <Button
                                            className="me-1"
                                            sx={{ maxHeight: 40 }}
                                            variant="outlined"
                                            size="small"
                                            onClick={handleUploadVideoLinks}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>

                        </>
                    )}
                </div>
            </div>

            <div className="border mt-1 mb-1 d-none"></div>

            <div className="row ">
                <div className="col-12">
                    {artifactsTmp&&artifactsTmp.length > 0 ? (
                        artifactsTmp.map((artifact, index) => {
                            return (
                                <React.Fragment key={artifact._key}>

                                    <div
                                        key={index}
                                        className="mt-1 mb-1 text-left pt-1 pb-1  row">
                                        <div className="col-10 ellipsis-end">
                                            <ArtifactIconDisplayBasedOnMimeType artifact={artifact}  />
                                            <span
                                                className="ms-4  text-blue text-bold"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                    {artifact.name}
                                                </span>
                                        </div>
                                        <div className="col-2 d-flex justify-content-end">
                                            {!props.hideMenu && (
                                                <MoreMenu
                                                triggerCallback={(action) =>
                                                {
                                                    handleDeleteDocument(artifact._key)
                                                }}
                                                download={true}
                                                delete={props.isLoggedIn}
                                            />)}
                                            {props.showDelete && (
                                                <span
                                                    className="ms-2 text-danger "
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        handleDeleteDocument(artifact._key)
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

export default  connect(mapStateToProps, mapDispatchToProps)(ArtifactManager);
