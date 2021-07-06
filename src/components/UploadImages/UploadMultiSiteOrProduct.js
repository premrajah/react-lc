import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Formik, Form, ErrorMessage, Field} from 'formik';
import  * as Yup from 'yup';
import {baseUrl, getImageAsBytes, MATCH_STRATEGY_OPTIONS, MERGE_STRATEGY_OPTIONS} from "../../Util/Constants";
import axios from "axios/index";
import SelectArrayWrapper from "../FormsUI/Select";
import Button from "@material-ui/core/Button";
import {Publish} from "@material-ui/icons";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {TextField} from "formik-material-ui";
import {MenuItem} from "@material-ui/core";



const UploadMultiSiteOrProduct = ({siteList, loadSites, isSite, isProduct, multiUploadCallback}) => {

    const [isDisabled, setIsDisabled] = useState(false);
    const [uploadArtifactError, setUploadArtifactError] = useState('');
    const [uploadSitesError, setUploadSitesError] = useState('');
    const [errorsArray, setErrorsArray] = useState([]);
    const [sites, setSites] = useState([]);
    const formikRef = useRef();

    useEffect(() => {
        if(isProduct) {
            setSites(siteList);
        }
    }, [])


    const INITIAL_VALUES = {
        artifact: '',
        match_strategy: MATCH_STRATEGY_OPTIONS[0],
        merge_strategy: MERGE_STRATEGY_OPTIONS[0],
        siteId: '',
    }

    const VALIDATION_SCHEMA = Yup.object().shape({
        artifact: Yup.mixed().required('A file is required'),
        siteId: isProduct && Yup.string().required('Site Required'),

    })

    const handleMultiUploadCallback = useCallback(() => {
        multiUploadCallback();
    }, [])

    const handleReset = () => {
        formikRef.current?.resetForm();
    }

    const handleFormSubmit = (values, {setSubmitting}) => {

        const {artifact, match_strategy, merge_strategy, siteId} = values;
        setIsDisabled(true);
        setUploadArtifactError(<span className="text-success"><b>Processing...</b></span>)

        getImageAsBytes(values.artifact)
            .then(data => {
                setSubmitting(false)
                postArtifact(data, artifact, match_strategy, merge_strategy, siteId);
            })
            .catch(error => {
                console.log('Convert as bytes error ', error);
                setIsDisabled(false);
            });
    }

    const postArtifact = (payload, file, match_strategy, merge_strategy, siteId) => {
        setUploadArtifactError(<span className="text-success"><b>Uploading ...</b></span>)
        axios.post(`${baseUrl}artifact/load?name=${file.name}`, payload)
            .then(res => {
                const {_id, blob_url } = res.data.data;
                let payload;

                if(isSite) {

                    payload = {
                        "ref": `${file.name}_${new Date().getMilliseconds()}`,
                        "config": {
                            "match_strategy": match_strategy,
                            "merge_strategy": merge_strategy,
                            "artifact_ids" : [_id]
                        }
                    }

                    const url = `${baseUrl}load/sites`;
                    // console.log('artifact upload res ', _id, blob_url)
                    if(res.status === 200) {
                        postLoadSitesOrProducts(url, payload);
                    }
                } else if (isProduct) {

                    payload = {
                        "ref": `${file.name}_${new Date().getMilliseconds()}`,
                        "site_id": siteId,
                        "config": {
                            "match_strategy": match_strategy,
                            "merge_strategy": merge_strategy,
                            "artifact_ids" : [_id]
                        }
                    }

                    const url = `${baseUrl}load/products`;

                    if(res.status === 200) {
                        postLoadSitesOrProducts(url, payload);
                    }

                }

            })
            .catch(error => {
                console.log('artifact upload error ', error)
                setUploadArtifactError(<span className="text-warning"><b>Unable to upload at this time, (try different Match or Merge Strategy) or please try again later</b></span>);
                setIsDisabled(false);
            })
    }



    const postLoadSitesOrProducts = (url, payload) => {
        axios.post(url, payload)
            .then(res => {
                if(res.status === 200) {
                    setUploadSitesError(<span className="text-success"><b>Uploaded {isSite ? "Sites" : "Products"} Successfully!</b></span>);
                    setErrorsArray(res.data.errors)
                    setUploadArtifactError('');
                    setIsDisabled(false);
                    handleMultiUploadCallback();
                    handleReset();
                }
            })
            .catch(error => {
                console.log("multi site upload error ", error);
                setUploadSitesError(<span className="text-warning"><b>Unable to upload at this time, (try different Match or Merge Strategy) or please try again later</b></span>);
                setIsDisabled(false)
            })
    }



    return <>

        <div className="row mb-3">
            <div className="col">
                <h4>{isSite && 'Sites Upload'}{isProduct && 'Products Upload'}</h4>
            </div>
        </div>

        <div className="row">
            <div className="col">
                <Formik
                    initialValues={INITIAL_VALUES}
                    validationSchema={VALIDATION_SCHEMA}
                    onSubmit={async (values, {setSubmitting}) => handleFormSubmit(values, {setSubmitting})}
                    innerRef={formikRef}
                    enableReinitialize
                >
                    {(formProps) => (
                        <Form>
                            <div className="row mb-2">
                                <div className="col">
                                    <div>{uploadArtifactError}</div>
                                    <div>{uploadSitesError}</div>
                                    {errorsArray.length > 0 && <div className="d-flex flex-column align-items-start">Partial upload with errors,
                                        please check file: {errorsArray.map(
                                            error => (
                                                <span className="text-danger">Error {error.message}</span>
                                            )
                                        )}</div>}
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col">
                                    {/*<Input type="file" name="artifact" onChange={(event => formProps.setFieldValue('artifact', event.target.files[0]))} />*/}
                                    <Button
                                        variant="contained"
                                        component="label"
                                    >
                                        <Publish />
                                        <input
                                            type="file"
                                            hidden
                                            accept="text/csv"
                                            name="artifact"
                                            onChange={(event => formProps.setFieldValue('artifact', event.target.files[0]))}
                                            onClick={() => { setUploadArtifactError(''); setUploadSitesError(''); setErrorsArray([])}}
                                        />
                                    </Button>
                                    <div className="mt-1">{formProps.errors.artifact && formProps.touched.artifact ? (<div className="text-danger">{formProps.errors.artifact}</div>) : null}</div>
                                    <div className="text-muted">Only CSV files</div>
                                    <div>File name: <b>{formProps.values.artifact.name}</b></div>
                                </div>
                            </div>

                            {isProduct && <div className="row mb-2">
                                <div className="col">
                                    <Field
                                        component={TextField}
                                        type="text"
                                        name="siteId"
                                        label="Pick a Site"
                                        select
                                        variant="outlined"
                                        helperText="Please select a Site"
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    >
                                        <MenuItem value="">Pick a site</MenuItem>
                                        {sites.length > 0 ? sites.map((option) => (
                                            <MenuItem key={option._id} value={option._id}>
                                                {`${option.name} - (${option.address})`}
                                            </MenuItem>
                                        )) : <MenuItem value="">Loading...</MenuItem> }
                                    </Field>
                                </div>
                            </div>}

                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <SelectArrayWrapper
                                        name="match_strategy"
                                        label="Match Strategy"
                                        helperText="Select how to match"
                                        options={MATCH_STRATEGY_OPTIONS}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <SelectArrayWrapper
                                        name="merge_strategy"
                                        label="Merge Strategy"
                                        helperText="Select how to merge"
                                        options={MERGE_STRATEGY_OPTIONS}
                                    />
                                </div>
                            </div>

                            <div className="row mt-4 mb-4">
                                <div className="col">
                                    <button disabled={isDisabled} type="button" className="btn btn-block btn-green" onClick={formProps.submitForm} style={{backgroundColor: '#07AD88'}} >Submit</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </>
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        siteList: state.siteList,
        showSitePopUp: state.showSitePopUp,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSiteModal: (data) => dispatch(actionCreator.showSiteModal(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadMultiSiteOrProduct);