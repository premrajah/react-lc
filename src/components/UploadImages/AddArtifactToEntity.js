
import FormControl from "@mui/material/FormControl";
import { Button, MenuItem } from "@mui/material";
import {Add, Upload} from '@mui/icons-material';
import { useState } from "react";
import MenuDropdown from "../FormsUI/MenuDropdown";
import {baseUrl, BYTES_TO_SIZE, getImageAsBytes, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import axios from "axios";
import {cleanFilename} from "../../Util/GlobalFunctions";
import login from "../../views/login/Login";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

const UPLOAD_TYPE_VALUES = ["From System", "Youtube Id", "Video link"];
const MAX_COUNT = 5;
const MAX_FILE_SIZE = 26214400;

const AddArtifactToEntity = ({ entityId, loadCurrentProduct, showSnackbar }) => {
    // console.log("entity Id ", entityId);
    const [uploadType, setUploadType] = useState(UPLOAD_TYPE_VALUES[0]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);




    const addArtifactToProduct = async (key) => {

        const payload = {
            product_id: entityId,
            artifact_ids: [key],
        };

        const uploadToServer = await  axios.post(`${baseUrl}product/artifact`, payload);

        if(uploadToServer.status === 200) {
            setUploadedFiles([]);
            loadCurrentProduct(entityId); // reload page
            showSnackbar({show:true,severity:"success",message:"Artifacts added successfully to product. Thanks"});
        }
    }

    const handleUploadFileToProduct = () => {

        uploadedFiles.map((file, index) => {
            getImageAsBytes(file)
                .then(async convertedData => {
                    try {

                        const uploadedFile = await axios.post(`${baseUrl}artifact/load?name=${cleanFilename(file.name.toLowerCase())}`, convertedData);
                        const uploadedToCloudDataKey = uploadedFile.data.data._key;

                        // add to product
                        await addArtifactToProduct(uploadedToCloudDataKey);

                    }catch (error) {
                        console.log("handleUploadFileToProduct try/catch error ", error);
                        showSnackbar({show:true,severity:"warning",message:"Unable to add images at this time."});
                    }
                })
                .catch(error => {
                    console.log("getImageAsBytes error ", error);
                });
        })
    }

    const handleUploadedFiles = (files) => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;

        files.some((file) => {
            // check if already exist
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                if(file.size > MAX_FILE_SIZE) {
                    showSnackbar({show:true,severity:"warning",message:`File is too large`});
                    return;
                } else {
                    uploaded.push(file);
                    if (uploaded.length === MAX_COUNT) setFileLimit(true);
                    if (uploaded.length > MAX_COUNT) {
                        showSnackbar({show:true,severity:"warning",message:` you can only add a maximum of ${MAX_COUNT} files`});
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

    const handleRemoveFile = (file) => {
        const uploaded = [...uploadedFiles];
        const index = uploaded.indexOf(file);

        if (index > -1) {
            uploaded.splice(index, 1);
            setUploadedFiles(uploaded);
        }

        uploaded.length === MAX_COUNT ? setFileLimit(true) : setFileLimit(false);
    };

    return (
        <>
            <div className="row mt-3 mb-2">
                <div className="col-md-3">
                    <FormControl fullWidth>
                        <MenuDropdown
                            setSelection={(value) => setUploadType(value)}
                            options={UPLOAD_TYPE_VALUES}
                        />
                    </FormControl>
                </div>
                <div className="col-md-9">
                    {uploadType === UPLOAD_TYPE_VALUES[0] && (
                        <>
                            <div className="d-flex">
                                <Button className="me-3" variant="outlined" component="label" disabled={fileLimit}>
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

                                {uploadedFiles.length > 0 && <div>
                                    <Button variant="outlined" onClick={() => handleUploadFileToProduct()}><Upload/>Upload</Button>
                                </div>}
                            </div>
                            <div>
                                <small>Upto {MAX_COUNT} files at a time only. Each file {BYTES_TO_SIZE(MAX_FILE_SIZE)}.
                                    {uploadedFiles.length > 0 && <span className="ms-3 click-item" onClick={() => {
                                        setUploadedFiles([]);
                                        setFileLimit(false);
                                    }}>Clear all selected</span>}
                                </small>
                            </div>
                        </>
                    )}

                    {uploadType === UPLOAD_TYPE_VALUES[1] && (
                        <>
                            <form noValidate autoComplete="off">
                                <div className="row">
                                    <div className="col-md-5">Youtube id</div>
                                    <div className="col-md-5">title</div>
                                    <div className="col-md-2">button</div>
                                </div>
                            </form>
                        </>
                    )}

                    {uploadType === UPLOAD_TYPE_VALUES[2] && (
                        <>
                            <form noValidate autoComplete="off">
                                <div className="row">
                                    <div className="col-md-5">Link</div>
                                    <div className="col-md-5">title</div>
                                    <div className="col-md-2">button</div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>

            {uploadedFiles.length > 0 && <div className="row mt-2">
                <div className="col-12">
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="mb-1">
                            <span
                                className="me-2 click-item text-danger border p-1"
                                onClick={() => handleRemoveFile(file)}>
                                X
                            </span>
                            {file.name}
                        </div>
                    ))}
                </div>
            </div>}
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
