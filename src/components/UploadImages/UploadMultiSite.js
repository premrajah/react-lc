import React, {useCallback, useRef, useState} from 'react';
import {Formik, Form, ErrorMessage} from 'formik';
import  * as Yup from 'yup';
import {baseUrl, getImageAsBytes, MATCH_STRATEGY_OPTIONS, MERGE_STRATEGY_OPTIONS} from "../../Util/Constants";
import axios from "axios/index";
import SelectArrayWrapper from "../FormsUI/Select";
import Button from "@material-ui/core/Button";
import {Publish} from "@material-ui/icons";





const UploadMultiSite = ({multiUploadCallback}) => {

    const [isDisabled, setIsDisabled] = useState(false);
    const [uploadArtifactError, setUploadArtifactError] = useState('');
    const [uploadSitesError, setUploadSitesError] = useState('');
    const formikRef = useRef();

    const INITIAL_VALUES = {
        artifact: '',
        match_strategy: MATCH_STRATEGY_OPTIONS[0],
        merge_strategy: MERGE_STRATEGY_OPTIONS[0],
    }

    const VALIDATION_SCHEMA = Yup.object().shape({
        artifact: Yup.mixed().required('A file is required')
    })

    const handleMultiUploadCallback = useCallback(() => {
        multiUploadCallback();
    }, [])

    const handleReset = () => {
        formikRef.current?.resetForm();
    }

    const handleFormSubmit = (values, {setSubmitting}) => {
        const {artifact, match_strategy, merge_strategy} = values;
        setIsDisabled(true);
        setUploadArtifactError(<span className="text-success"><b>Processing...</b></span>)

        getImageAsBytes(values.artifact)
            .then(data => {
                setSubmitting(false)
                postArtifact(data, artifact, match_strategy, merge_strategy);
            })
            .catch(error => {
                console.log('Convert as bytes error ', error);
                setIsDisabled(false);
            });

    }

    const postArtifact = (payload, file, match_strategy, merge_strategy) => {
        setUploadArtifactError(<span className="text-success"><b>Uploading ...</b></span>)
        axios.post(`${baseUrl}artifact/load?name=${file.name}`, payload)
            .then(res => {
                const {_id, blob_url } = res.data.data;
                const payload = {
                    "ref": `${file.name}_${new Date().getMilliseconds()}`,
                    "config": {
                        "match_strategy": match_strategy,
                        "merge_strategy": merge_strategy,
                        "artifact_ids" : [_id]
                    }
                }
                // console.log('artifact upload res ', _id, blob_url)
                if(res.status === 200) {
                    postLoadSites(payload);
                }
            })
            .catch(error => {
                console.log('artifact upload error ', error)
                setUploadArtifactError(<span className="text-warning"><b>Unable to upload at this time, (try different Match or Merge Strategy) or please try again later</b></span>);
                setIsDisabled(false);
            })
    }

    const postLoadSites = (payload) => {
        axios.post(`${baseUrl}load/sites`, payload)
            .then(res => {
                if(res.status === 200) {
                    setUploadSitesError(<span className="text-success"><b>Uploaded Sites Successfully!</b></span>);
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

        <div className="row">
            <div className="col">
                <Formik
                    initialValues={INITIAL_VALUES}
                    validationSchema={VALIDATION_SCHEMA}
                    onSubmit={(values, {setSubmitting}) => handleFormSubmit(values, {setSubmitting})}
                    innerRef={formikRef}
                >
                    {(formProps) => (
                        <Form>
                            <div className="row">
                                <div className="col">
                                    <div>{uploadArtifactError}</div>
                                    <div>{uploadSitesError}</div>
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col">
                                    {/*<Input type="file" name="artifact" onChange={(event => formProps.setFieldValue('artifact', event.target.files[0]))} />*/}
                                    <Button
                                        variant="contained"
                                        component="label"
                                        onChange={(event => formProps.setFieldValue('artifact', event.target.files[0]))}
                                        onClick={() => { setUploadArtifactError(''); setUploadSitesError('');}}
                                    >
                                        <Publish />
                                        <input
                                            type="file"
                                            hidden
                                            accept="text/csv"
                                            name="artifact"
                                        />
                                    </Button>
                                    {formProps.errors.artifact && formProps.touched.artifact ? (<div className="text-warning">{formProps.errors.artifact}</div>) : null}
                                    <ErrorMessage name="artifact" />
                                    <div className="text-muted">Only CSV file</div>
                                    <div>File name: <b>{formProps.values.artifact.name}</b></div>
                                </div>
                            </div>

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
                                    <button disabled={isDisabled} className="btn btn-block btn-green" onClick={formProps.submitForm} style={{backgroundColor: '#07AD88'}} >Submit</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </>
};

export default UploadMultiSite;