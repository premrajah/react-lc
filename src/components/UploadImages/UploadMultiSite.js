import React, {useState} from 'react';
import {Formik, Form} from 'formik';
import {Input} from "reactstrap";
import {baseUrl, getImageAsBytes, MATCH_STRATEGY_OPTIONS, MERGE_STRATEGY_OPTIONS} from "../../Util/Constants";
import axios from "axios/index";
import SelectArrayWrapper from "../FormsUI/Select";





const UploadMultiSite = ({}) => {

    const [artifactIds, setArtifactIds] = useState([]);

    const INITIAL_VALUES = {
        artifact: '',
        match_strategy: MATCH_STRATEGY_OPTIONS[0],
        merge_strategy: MERGE_STRATEGY_OPTIONS[0],
    }

    const handleFormSubmit = (values, {setSubmitting}) => {
        const {artifact, match_strategy, merge_strategy} = values;


        getImageAsBytes(values.artifact)
            .then(data => {
                setSubmitting(false)
                postArtifact(data, artifact, match_strategy, merge_strategy);
            })
            .catch(error => {
                console.log('Convert as bytes error ', error);
            });

    }

    const postArtifact = (payload, file, match_strategy, merge_strategy) => {
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
                console.log('artifact upload res ', _id, blob_url)
                postLoadSites(payload);
            })
            .catch(error => {
                console.log('artifact upload error ', error)
            })
    }

    const postLoadSites = (payload) => {
        axios.post(`${baseUrl}load/sites`, payload)
            .then(res => {
                console.log('site load ', res.data.data);
            })
            .catch(error => {
                console.log("multi site upload error ", error);
            })
    }


    return <>

        <div className="row">
            <div className="col">
                <Formik
                    initialValues={INITIAL_VALUES}
                    onSubmit={(values, {setSubmitting}) => handleFormSubmit(values, {setSubmitting})}
                    validator={() => ({})}
                >
                    {(formProps) => (
                        <Form>

                            <div className="row mb-2">
                                <div className="col">
                                    <Input type="file" name="artifact" onChange={(event => formProps.setFieldValue('artifact', event.target.files[0]))} />
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

                            <div className="row">
                                <div className="col">
                                    <button disabled={formProps.isSubmitting} className="btn btn-block btn-green" onClick={formProps.submitForm} style={{backgroundColor: '#07AD88'}} >Submit</button>
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