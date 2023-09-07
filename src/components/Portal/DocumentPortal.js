import React, { useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import PropTypes from 'prop-types';
import PageHeader from '../PageHeader';
import {Box, Button, Card, CardContent, CardHeader, Tab, Tabs} from '@mui/material';
import { Download } from '@mui/icons-material';
import Layout from '../Layout/Layout';
import {TabContext, TabList, TabPanel} from "@mui/lab";
import ArtifactManager from "../FormsUI/ArtifactManager";
import {baseUrl, ENTITY_TYPES, getImageAsBytes, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import {checkIfMimeTypeAllowed, cleanFilename} from "../../Util/GlobalFunctions";
import ArtifactIconDisplayBasedOnMimeType from "../UploadImages/ArtifactIconDisplayBasedOnMimeType";
import Tooltip from "@mui/material/Tooltip";
import MoreMenu from "../MoreMenu";
import GreenButton from "../FormsUI/Buttons/GreenButton";
const DocumentPortal=({
                          showSnackbar,
                          refresh,
                          type,
                          setArtifacts,
                          ...props
                      })=> {
    const [activeKey,setActiveKey]=useState("1"   )
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const [artifactsTmp,setArtifactsTmp]=useState([])
    const [file,setFile]=useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        handleUploadedFiles(chosenFiles);
    };



    const handleCancel=(e) =>{
        e.preventDefault();

        this.setState({
            orgImage: null,
        });

        this.setState({
            file: null,
        });
    }

   const getBase64=(file)=> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const onUploadProgress = event => {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percentCompleted);
    };

    const handleChangeFile=(event)=> {
        let fileTmp = file;

        let newFile = null;

        for (let i = 0; i < event.target.files.length; i++) {
            fileTmp=({ file: event.target.files[i], status: 0, id: null });
            newFile =({ file: event.target.files[i], status: 0, id: null });
        }

        setFile(fileTmp)

        handleUploadFiles(file);
    }


    const handleUploadFiles = async (file) => {
        setIsLoading(true);

        getImageAsBytes(file)
            .then(async (convertedData) => {
                try {
                    const uploadedFile = await axios.post(
                        `${baseUrl}artifact/load?name=${cleanFilename(file.name.toLowerCase())}`,
                        convertedData, { onUploadProgress }
                    );

                    if (uploadedFile) {
                        const uploadedToCloudDataKey = uploadedFile.data.data._key;

                            const a = uploadedFile.data.data;
                            setArtifactsTmp((artifactsTmp) => [a].concat(artifactsTmp));

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

    const submitDoc = async (file) => {
        setIsLoading(true);

        console.log(artifactsTmp)

        let artifactIds=artifactsTmp.map((item)=>item._key)

        console.log(artifactIds)

                try {
                    const uploadedFile = await axios.post(
                        `${baseUrl}carbon`,
                        {
                            // composition_carbon:{
                            //  name:cleanFilename(file.name.toLowerCase())
                            // },
                            artifact_ids:artifactIds
                        }, { onUploadProgress }
                    ).finally(()=>{
                        showSnackbar({
                            show: true,
                            severity: "success",
                            message: "Document uploaded successfully. Thanks",
                        });
                    });


                } catch (error) {
                    console.log("handleUploadFileToProduct try/catch error ", error);
                    setIsLoading(false);
                    showSnackbar({
                        show: true,
                        severity: "warning",
                        message: "Unable to add artifact at this time.",
                    });
                }


    };



    const handleDocActions = (action, key, blob_url) => {


        if (action === "download")
            window.location.href = blob_url;
        else {
            handleDeleteDocument(key)
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

    const handleDeleteDocument = (key) => {
        let afterRemoveDoc = artifactsTmp.filter((item) => item._key !== key);
        let artifactIds = [];

        afterRemoveDoc.forEach((item) => artifactIds.push(item._key));

        setArtifactsTmp(afterRemoveDoc);

        // if (entityType === ENTITY_TYPES.Site) {
        //     const payload = {
        //         site_id: entityId,
        //         artifact_ids: artifactIds,
        //     };
        //
        //     if (entityId) handleReplaceArtifacts(payload);
        // }
        // if (entityType === ENTITY_TYPES.Product) {
        //     const payload = {
        //         product_id: entityId,
        //         artifact_ids: artifactIds,
        //     };
        //
        //     if (entityId) handleReplaceArtifacts(payload);
        // }

    };


    return (
        <>
            <Layout>
                <div className="container mt-3">
                    <PageHeader
                        pageTitle="Documents Portal"
                        subTitle=""
                    />

                    <div className="row   justify-content-center">
                    <div className={"col-6 "}>
                        <h4 className={"blue-text text-heading mb-4"}>Upload documents</h4>

                        <label htmlFor="images" className="drop-container" id="dropcontainer">
                            {/*<span className="drop-title">Drop files here</span>*/}
                            {/*or*/}
                            {/*<input*/}
                            {/*    onChange={handleFileEvent}*/}
                            {/*    multiple type="file" id="images" accept="image/*" required/>*/}

                            <Button className="" variant="outlined" component="label">
                                Upload Files
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileEvent}
                                    multiple
                                    accept={MIME_TYPES_ACCEPT}
                                />
                            </Button>
                        </label>

                        <div className="row justify-content-center d-flex align-items-center">
                            <div className="col-12 ">
                                {uploadProgress && <>
                                    <small>{uploadProgress}% Uploaded</small>
                                    <progress id="progressBar" value={uploadProgress ? uploadProgress : 0} max="100"
                                              style={{ width: '100%' }}></progress>
                                </>}
                            </div>
                            <div className="col-12 ">
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
                                                            <Tooltip title={artifact.blob_url ?? ""}>
                                                                <a href={artifact.blob_url} target="_blank" rel="noopener noreferrer">
                                                    <span
                                                        className="ms-4  text-blue text-bold"
                                                        rel="noopener noreferrer">
                                                        {artifact.name}
                                                    </span>
                                                                </a>
                                                            </Tooltip>
                                                        </div>
                                                        <div className="col-2 d-flex justify-content-end">
                                                            {!props.hideMenu && (
                                                                <MoreMenu
                                                                    triggerCallback={(action) => {
                                                                        handleDocActions(action,
                                                                            artifact._key,
                                                                            artifact.blob_url);
                                                                    }}
                                                                    download={true}
                                                                    delete={props.isLoggedIn && !props.isArchiver}
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


                                {artifactsTmp && artifactsTmp.length > 0 ? ( <div className="col-12 text-center" >

                                    <GreenButton
                                    title={"Submit Files"}
                                    onClick={submitDoc}
                                    />
                                </div>):""}
                            </div>
                            </div>


                        </div>

                        <div className="mt-4">

                                <span className="top-element  text-underline">
                   <Download style={{fontSize:"16px"}} /><a href={'/downloads/docs/manufacturer-sustainability-compliance-documents.zip'} title={'/downloads/docs/manufacturer-sustainability-compliance-documents.zip'} download={'/downloads/docs/manufacturer-sustainability-compliance-documents.zip'}>Download Manufacture Compliance Documents</a>

                        </span>
                            <br/>
                            <span>( Please fill out these documents & once completed, upload to the Upload Documents tab. )</span>

                        </div>
                    </div>
                        <div className={"col-6 "}>

                            <h4 className={"blue-text text-heading mb-4"}>Previous Uploads</h4>


                        </div>
                    </div>



                </div >
            </Layout>
        </>
    )
}



const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loadCurrentSite: (data) => dispatch(actionCreator.loadCurrentSite(data)),
        loadCurrentProduct: (data) => dispatch(actionCreator.loadCurrentProduct(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPortal);