import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as Yup from 'yup';
import {baseUrl, getImageAsBytes, MATCH_STRATEGY_OPTIONS, MERGE_STRATEGY_OPTIONS} from "../../Util/Constants";
import axios from "axios/index";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import Button from "@mui/material/Button";
import {Publish, Download} from "@mui/icons-material";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
// import {TextField} from "formik-material-ui";
import EditSite from "../Sites/EditSite";
import {validateInputs} from "../../Util/Validator";


const UploadMultiSiteOrProduct = (props) => {

    // {siteList, loadSites, multiUploadCallback, popUpType}

    const [isDisabled, setIsDisabled] = useState(false);
    const [uploadArtifactError, setUploadArtifactError] = useState('');
    const [isProduct, setIsProduct] = useState(false);
    const [isSite, setIsSite] = useState(false);
    const [fileName, setFileName] = useState(null);


    const [uploadSitesError, setUploadSitesError] = useState('');
    const [errorsArray, setErrorsArray] = useState([]);
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});

    // const [sites, setSites] = useState([]);
    const [siteShowHide, setSiteShowHide] = useState(false);
    const [submitSiteError, setSubmitSiteError] = useState("");
    const [submitSiteErrorClassName, setSubmitSiteErrorClassName] = useState("")
    const formikRef = useRef();

    useEffect(() => {

        // console.log("popUpType")
        //
        // console.log(props.popUpType)


        if(props.popUpType=="isProduct") {
            props.loadSites();
            setIsProduct(true)
            setIsSite(false)
        }else if(props.popUpType=="isSite") {
            props.loadSites();
            setIsProduct(false)
            setIsSite(true)
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
        props.multiUploadCallback();
    }, [])

    const handleReset = () => {
        formikRef.current?.resetForm();
    }


   const handleValidation=()=> {


        let fieldsLocal = fields;


        let validations = [
            // validateFormatCreate("deliver", [{check: Validators.required, message: 'Required'}], fieldsLocal),
            // validateFormatCreate("email", [{check: Validators.required, message: 'Required'}], fields),
            // validateFormatCreate("address", [{check: Validators.required, message: 'Required'}], fields),


        ]


        let {formIsValid, errorsLocal} = validateInputs(validations)

       setErrors(errorsLocal);
        return formIsValid;
    }

    const  handleChange=(value, field) =>{

        // console.log( field)


        if (field==="artifact"){

            setFileName(value.name)

        }

            let fieldsLocal = fields;

            fieldsLocal[field] = value;

            setFields(fieldsLocal)

    }




    const handleFormSubmitNew=(event)=>{

alert("Called")
        let parentId;
        event.preventDefault();
        if (!handleValidation()) {

            return

        }




        const data = new FormData(event.target);


        const formData = {
             artifact: data.get("artifact"),
                match_strategy: data.get("match_strategy"),
                merge_strategy: data.get("merge_strategy"),
                siteId: data.get("deliver"),


        };



        const {artifact, match_strategy, merge_strategy, siteId} = formData;
        setIsDisabled(true);
        setUploadArtifactError(<span className="text-success"><b>Processing...</b></span>)


        getImageAsBytes(formData.artifact)
            .then(data => {


                postArtifact(data, artifact, match_strategy, merge_strategy, siteId);
            })
            .catch(error => {
                console.log('Convert as bytes error ', error.message);
                setIsDisabled(false);
            });

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
                console.log('Convert as bytes error ', error.message);
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
                console.log('artifact upload error ', error.message)
                setUploadArtifactError(<span className="text-warning"><b>Unable to upload at this time, (try different Match or Merge Strategy) or please try again later</b></span>);
                setIsDisabled(false);
            })
    }

    const handleShowHideSite = () => {
        props.loadSites();
        setSiteShowHide(!siteShowHide);
        setSubmitSiteError('');
        setSubmitSiteErrorClassName('');
    }

    const handleEditSiteCallBack = (e) => {
        setSubmitSiteError(e.props.children);
        setSubmitSiteErrorClassName(e.props.className);
        setSiteShowHide(!siteShowHide);

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
                console.log("multi site upload error ", error.message);
                setUploadSitesError(<span className="text-warning"><b>Unable to upload at this time, (try different Match or Merge Strategy) or please try again later</b></span>);
                setIsDisabled(false)
            })
    }



    return <>

        <div className="row mb-2">
            <div className="col">
                <h4 className={"blue-text text-heading"}>{isSite && 'Multiple Sites Upload'}{isProduct && 'Multiple Products Upload'}</h4>
                <span className="top-element text-capitlize text-underline">
                   <Download style={{fontSize:"16px"}} /> <a href={isProduct ? '/downloads/products.csv' : '/downloads/sites.csv'} title={isProduct ? 'products.csv' : 'sites.csv'} download={isProduct ? 'products.csv' : 'sites.csv'}>Download {isProduct ? "products" : "sites"} csv template</a>
                </span>
            </div>
        </div>

        <div className="row ">
            <div className="col">

                <form onSubmit={handleFormSubmitNew}>
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



                            <div className="row mb-2 justify-content-center text-center bg-white rad-8 p-3 m-2 ">
                                <div className="col">


                                    <Button
                                        // variant="contained"
                                        component="label"
                                        className={"text-blue"}
                                        style={{backgroundColor:"#D31169"}}
                                    >
                                        <Publish  style={{color:"#fff"}} />
                                        <input
                                            type="file"
                                            hidden
                                            accept="text/csv"
                                            name="artifact"
                                            onChange={(event) => handleChange( event.target.files[0],'artifact')}
                                            // onChange={(value)=> {
                                            //
                                            //     handleChange(event,"deliver")
                                            //
                                            // }}

                                            onClick={() => { setUploadArtifactError(''); setUploadSitesError(''); setErrorsArray([])}}
                                        />
                                    </Button>
                                    <div className="mt-1">
                                        {/*{formProps.errors.artifact && formProps.touched.artifact ? (<div className="text-danger">{formProps.errors.artifact}</div>) : null}*/}
                                    </div>
                                    {fileName &&<div className="text-blue">File: {fileName}</div>}
                                    <div className="text-gray-light">(Click To Upload CSV File)</div>


                                </div>
                            </div>

                    {isProduct &&  <div className="row">
                                <div className="col">

                                        <SelectArrayWrapper

                                            // initialValue={this.props.item&&this.props.item.site._key}
                                            option={"name"}
                                            valueKey={"_key"}
                                            // error={this.state.errors["deliver"]}
                                            onChange={(value)=> {

                                                handleChange(value,"deliver")

                                            }}
                                            select={"Select"}
                                            options={props.siteList} name={"deliver"}
                                            title="Dispatch / Collection Address"/>


                                        <p style={{ marginTop: "10px" }}>
                                            <span className="mr-1 text-gray-light">Do not see your address?</span>
                                            <span
                                                onClick={handleShowHideSite}
                                                className={
                                                    "green-text forgot-password-link text-mute small"
                                                }>
                                                    {siteShowHide
                                                        ? "Hide add site"
                                                        : "Add a site"}
                                                </span>
                                        </p>

                                        {siteShowHide && (
                                            <div
                                                className={
                                                    "row justify-content-center p-2 container-gray"
                                                }>
                                                <div className="col-md-12 col-sm-12 col-xs-12 ">
                                                    <div
                                                        className={
                                                            "custom-label text-bold text-blue mb-1"
                                                        }>
                                                        Add New Site
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12 ">
                                                    <div className={"row"}>
                                                        <div className={"col-12"}>
                                                            <EditSite showHeader={false} site={{}} submitCallback={() => handleEditSiteCallBack()} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                    {/*<Field*/}
                                    {/*    component={TextField}*/}
                                    {/*    type="text"*/}
                                    {/*    name="siteId"*/}
                                    {/*    label="Pick a Site"*/}
                                    {/*    select*/}
                                    {/*    variant="outlined"*/}
                                    {/*    helperText="Please select a Site"*/}
                                    {/*    margin="normal"*/}
                                    {/*    InputLabelProps={{*/}
                                    {/*        shrink: true,*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    {/*    <MenuItem value="">Pick a site</MenuItem>*/}
                                    {/*    {siteList.length > 0 ? siteList.map((option) => (*/}
                                    {/*        <MenuItem key={option._id} value={option._id}>*/}
                                    {/*            {`${option.name} - (${option.address})`}*/}
                                    {/*        </MenuItem>*/}
                                    {/*    )) : <MenuItem value="">Loading...</MenuItem> }*/}
                                    {/*</Field>*/}
                                </div>
                            </div>}

                            {/*{isProduct && <div className="row mb-2">*/}
                            {/*    <div className="col">*/}
                            {/*        <div className="row">*/}
                            {/*            <div className="col-md-6 green-text" style={{cursor: "pointer"}} onClick={() => handleShowHideSite()}>Add Site {siteShowHide ? <span className='text-warning'><b>Close</b></span> : ""}</div>*/}
                            {/*        </div>*/}
                            {/*        <div className={submitSiteErrorClassName}><b>{submitSiteError}</b></div>*/}
                            {/*        {siteShowHide && <div className="row">*/}
                            {/*            <div className="col">*/}
                            {/*                <div className="container p-4" style={{backgroundColor: "#f2f2f2", width: '70%'}}>*/}
                            {/*                    <EditSite site={{}} submitCallback={(e) => handleEditSiteCallBack(e)} />*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>}*/}
                            {/*    </div>*/}
                            {/*</div>}*/}

                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <SelectArrayWrapper
                                        name="match_strategy"

                                        helperText="Select how to match"
                                        options={MATCH_STRATEGY_OPTIONS}


                                        onChange={(value)=> {
                                            handleChange(value,"match_strategy")
                                        }}

                                        title="Match Strategy"

                                    />
                                </div>

                                <div className="col-md-6">
                                    <SelectArrayWrapper

                                        name="merge_strategy"

                                        helperText="Select how to merge"
                                        options={MERGE_STRATEGY_OPTIONS}
                                        onChange={(value)=> {
                                            handleChange(value,"merge_strategy")
                                        }}

                                        title="Merge Strategy"
                                    />
                                </div>
                            </div>

                            <div className="row mt-4 mb-4">
                                <div className="col">
                                    <button disabled={isDisabled} type="submit" className="btn btn-block btn-green"
                                            // onClick={formProps.submitForm}
                                            style={{backgroundColor: '#07AD88'}} >Submit</button>
                                </div>
                            </div>
                        </form>


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
