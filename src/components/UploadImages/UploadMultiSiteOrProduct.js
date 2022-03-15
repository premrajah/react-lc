import React, {useCallback, useEffect, useState} from 'react';
import * as Yup from 'yup';
import {baseUrl, getImageAsBytes, MATCH_STRATEGY_OPTIONS, MERGE_STRATEGY_OPTIONS} from "../../Util/Constants";
import axios from "axios/index";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import Button from "@mui/material/Button";
import {Download, Publish} from "@mui/icons-material";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import EditSite from "../Sites/EditSite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SiteForm from "../Sites/SiteForm";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import * as XLSX from 'xlsx';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import BlueButton from "../FormsUI/Buttons/BlueButton";
import GreenButton from "../FormsUI/Buttons/GreenButton";

let productProperties=[
    {field:"name",required:true},
    {field:"description",required:true},
    {field:"external_reference",required:false},
    {field:"condition",required:true},
    {field:"purpose",required:true},
    {field:"year_of_making",required:false},
    {field:"category",required:true},
    {field:"type",required:true},
    {field:"state",required:true},
    {field:"units",required:true},
    {field:"volume",required:true},
    {field:"brand",required:true},
    {field:"model",required:false},
    {field:"serial",required:false},
    {field:"sku",required:false},
    {field:"upc",required:false},
    {field:"part_no",required:false},
    {field:"line",required:false},
    {field:"is_listable",required:false},
]

let siteProperties=[
    {field:"name",required:true},
    {field:"description",required:false},
    {field:"external_reference",required:false},
    {field:"contact",required:true},
    {field:"address",required:true},
    {field:"phone",required:false},
    {field:"email",required:false},
    {field:"others",required:false},
    {field:"is_head_office",required:false},
]


// const getField=(field,required)=>{
//
//     return ({"field":field,required:required})
//
// }

const UploadMultiSiteOrProduct = (props) => {


    const [isDisabled, setIsDisabled] = useState(false);
    const [uploadArtifactError, setUploadArtifactError] = useState('');
    const [isProduct, setIsProduct] = useState(false);
    const [showAdvanceStrategy, setShowAdvanceStrategy] = useState(false);

    const [isSite, setIsSite] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [uploadSitesError, setUploadSitesError] = useState('');
    const [errorsArray, setErrorsArray] = useState([]);
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    // const [sites, setSites] = useState([]);
    const [siteShowHide, setSiteShowHide] = useState(false);
    const [submitSiteError, setSubmitSiteError] = useState("");
    const [submitSiteErrorClassName, setSubmitSiteErrorClassName] = useState("")
    const [list,setList] = useState([]);
    const [showProgress, setShowProgress] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);

    useEffect(() => {

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

    }

    const [progress, setProgress] = useState(0);

    // React.useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    //     }, 800);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);


    const handleValidation=()=> {

        let fieldsLocal = fields;

        let validations = [
            validateFormatCreate("artifact", [{check: Validators.required, message: 'Required'}], fieldsLocal),
            // validateFormatCreate("match_strategy", [{check: Validators.required, message: 'Required'}], fieldsLocal),
            // valid   // validateFormatCreate("match_strategy", [{check: Validators.required, message: 'Required'}], fieldsLocal),
            // validateFormatCreate("merge_strategy", [{check: Validators.required, message: 'Required'}], fieldsLocal),
        ]


       if (isProduct){
           validations.push(   validateFormatCreate("deliver", [{check: Validators.required, message: 'Required'}], fieldsLocal),
           )
       }
        let result = validateInputs(validations)

       setErrors(result.errors);
        return result.formIsValid;
    }

    const  handleChange=(value, field) =>{


        if (field==="artifact"){

            setFileName(value.name)
            let tmppath = URL.createObjectURL(value);


            const reader = new FileReader();
            reader.onload = (evt) => {
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                processData(data);
            };
            reader.readAsBinaryString(value);

        }

            let fieldsLocal = fields;

            fieldsLocal[field] = value;

            setFields(fieldsLocal)
            handleValidation()

    }



    // process CSV data
    const processData = dataString => {

        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

        const listLocal = [];
        for (let i = 1; i < dataStringLines.length; i++) {

            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length == headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }

                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    listLocal.push(obj);
                }
            }
        }

        setList(listLocal)


        let errorFound=false

        for (let i=0;i<headers.length;i++){

            if(isProduct){

                if (!headers.length === productProperties[i].length) {
                    let errorsFound = errors

                    errorsFound.artifact = {
                        error: true,
                        message: "Invalid/Missing CSV columns. Download CSV template to check correct format and sequence of columns/fields"
                    }
                    setErrors(errorsFound)
                    errorFound = true
                    return
                }
                if (!(productProperties[i].field.toLowerCase() === headers[i].toLowerCase())) {

                    let errorsFound = errors

                    errorsFound.artifact = {
                        error: true,
                        message: "Invalid/Missing CSV columns. Download CSV template to check correct format and sequence of columns/fields"
                    }
                    setErrors(errorsFound)
                    errorFound = true

                    return
                }

            }

            if(isSite){

                if (!headers.length === siteProperties[i].length) {
                    let errorsFound = errors

                    errorsFound.artifact = {
                        error: true,
                        message: "Invalid/Missing CSV columns. Download CSV template to check correct format and sequence of columns/fields"
                    }
                    setErrors(errorsFound)
                    errorFound = true
                    return
                }
                if (!(siteProperties[i].field.toLowerCase() === headers[i].toLowerCase())) {

                    let errorsFound = errors

                    errorsFound.artifact = {
                        error: true,
                        message: "Invalid/Missing CSV columns. Download CSV template to check correct format and sequence of columns/fields"
                    }
                    setErrors(errorsFound)
                    errorFound = true

                    return
                }

            }

        }

        if (!errorFound) {

            let artifactError=null

            for (let i = 0; i < list.length; i++) {

                if(isProduct){
                    for (let k = 0; k < productProperties.length; k++) {

                        if (!list[i][productProperties[k].field] && productProperties[k].required) {

                            artifactError=(artifactError?artifactError+", ":"")+ "Entry:"+(i+1)+" Missing "+productProperties[k].field

                         }
                  }
               }
                if(isSite){


                    for (let k = 0; k < siteProperties.length; k++) {

                        if (!list[i][siteProperties[k].field] && siteProperties[k].required) {

                            artifactError=(artifactError?artifactError+", ":"")+ "Entry:"+(i+1)+" Missing "+siteProperties[k].field

                        }
                    }
                }
             }

            if (artifactError) {

                let errorsFound = errors
                errorsFound.artifact = {
                    error: true,
                    message: artifactError
                }
                setErrors(errorsFound)
                return

            }
        }
        // prepare columns list from headers



        // setData(list);
        // setColumns(columns);
    }



    const handleFormSubmitNew=(event)=>{


        let parentId;
        event.preventDefault();
        if (!handleValidation()) {


            setShowErrors(true)
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
    const handleFormSubmit = (event) => {

        let parentId;
        event.preventDefault();
        if (!handleValidation()) {

            setShowErrors(true)
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

        if (isProduct)
        postSingleRowDataProduct(match_strategy,merge_strategy,siteId)

        if (isSite)
            postSingleRowDataSite(match_strategy,merge_strategy)
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


    const postSingleRowDataProduct = async (match_strategy, merge_strategy, siteId) => {


        setShowCompletion(false)
        setShowProgress(true)
        let newProgress= 0
        let errorsFound=errors
        let uploadError=[];

        for (let k = 0; k < list.length; k++) {

            let listItem = list[k]
            let payload = {
                "match_strategy": match_strategy,
                "merge_strategy": merge_strategy,
                "site_id": siteId,
                "row": {
                    "name": listItem.name,
                    "description": listItem.description,
                    "external_reference": listItem.external_reference,
                    "condition": listItem.condition,
                    "purpose": listItem.purpose,
                    "year_of_making": listItem.year_of_making,
                    "category": listItem.category,
                    "type": listItem.type,
                    "state": listItem.state,
                    "units": listItem.units,
                    "volume": listItem.volume,
                    "brand": listItem.brand,
                    "model": listItem.model,
                    "serial": listItem.serial,
                    "sku": listItem.sku,
                    "upc": listItem.upc,
                    "part_no": listItem.part_no,
                    "line": listItem.line,
                    "is_listable": Boolean(listItem.is_listable.toLowerCase())
                }
            }

            try {
                const result = await axios.post(`${baseUrl}load/product`, payload);
            }
            catch(e){


                if (e.response.data.errors&&e.response.data.errors.length>0) {
                   e.response.data.errors.forEach(item => {
                       uploadError.push(<div className="d-flex flex-column">
                           <div><b>CSV Entry {k+1}</b>: {item.message}</div>
                       </div>)
                   })
                }else{

                    // alert(e.response.status)
                    if (e.response.status===400) {

                            uploadError.push(<div className="d-flex flex-column">
                                <div><b>CSV Entry {k + 1}</b>: Invalid values for columns</div>
                            </div>)

                    }else{
                        uploadError.push(<div className="d-flex flex-column">
                            <div><b>CSV Entry {k + 1}</b>: {e.response.status} error received from server</div>
                        </div>)

                    }
                }



                    // uploadError=e.response.data.errors.forEach(item => `${item.message}, `)

                    errorsFound.upload = {
                        error: true,
                        message: uploadError
                    }
                    setErrors(errorsFound)


            }
            // const {data}=await  result

            // const getData = async () => {
            //     await axios.post(`${baseUrl}load/product`,payload)
            //         .then(res => {
            //             console.log(res)
            //
            //
            //         })
            //         .catch(err => {
            //             console.log(err)
            //         });
            // }
            // getData()

            newProgress= newProgress + parseInt(100/list.length)
            setProgress(newProgress )



        }


        errorsFound.upload = {
            error: true,
            message: uploadError
        }
        setErrors(errorsFound)

        setIsDisabled(false);
        setShowProgress(false)

        setShowCompletion(true)

    }

    const postSingleRowDataSite = async (match_strategy, merge_strategy) => {

        setShowCompletion(false)
        setShowProgress(true)
        let newProgress= 0
        let errorsFound=errors
        let uploadError=[];

        for (let k = 0; k < list.length; k++) {


            let listItem = list[k]



            let payload = {
                "match_strategy": match_strategy,
                "merge_strategy": merge_strategy,
                "row": {
                    "name": listItem.name,
                    "description": listItem.description,
                    "external_reference": listItem.external_reference,
                    "contact": listItem.contact,
                    "address": listItem.address,
                    "phone": listItem.phone,
                    "email": listItem.email,
                    "others": listItem.others,
                    "is_head_office": listItem.is_head_office.toLowerCase()==="true"?true:false,

                }
            }

            try {


                console.log(payload)

                

                // const result = await axios.post(`${baseUrl}load/site`, payload);


            }
            catch(e){

                if (e.response.data.errors&&e.response.data.errors.length>0) {
                    e.response.data.errors.forEach(item => {
                        uploadError.push(<div className="d-flex flex-column">
                            <div><b>CSV Entry {k+1}</b>: {item.message}</div>
                        </div>)
                    })
                }else{

                    // alert(e.response.status)
                    if (e.response.status===400) {

                        uploadError.push(<div className="d-flex flex-column">
                            <div><b>CSV Entry {k + 1}</b>: Invalid values for columns</div>
                        </div>)

                    }else{
                        uploadError.push(<div className="d-flex flex-column">
                            <div><b>CSV Entry {k + 1}</b>: {e.response.status} error received from server</div>
                        </div>)

                    }
                }


                // uploadError=e.response.data.errors.forEach(item => `${item.message}, `)
                // console.log(e.response.data.errors[0])
                errorsFound.upload = {
                    error: true,
                    message: uploadError
                }
                setErrors(errorsFound)


            }

            newProgress= newProgress + parseInt(100/list.length)
            setProgress(newProgress )



        }


        errorsFound.upload = {
            error: true,
            message: uploadError
        }
        setErrors(errorsFound)

        setIsDisabled(false);
        setShowProgress(false)
        setShowCompletion(true)

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

                    setUploadSitesError(<span className="text-success"><b>Uploaded {isSite ? "Sites" : "Products"} Successfully!</b></span>);
                    setErrorsArray(res.data.errors)
                    setUploadArtifactError('');
                    setIsDisabled(false);
                    // handleMultiUploadCallback();
                    handleReset();

            })
            .catch(error => {
                // alert(" errror found")
                console.log("multi site upload error ", error.message);
                setUploadSitesError(<span className="text-warning"><b>Unable to upload at this time, (try different Match or Merge Strategy) or please try again later</b></span>);
                setIsDisabled(false)
            })
    }



    return <>
        <div className={!siteShowHide?"":"d-none"}>
        <div className="row mb-2">
            <div className="col">
                <h4 className={"blue-text text-heading"}>{isSite && 'Upload Multiple Sites'}{isProduct && 'Upload Multiple Products'}</h4>
                <span className="top-element  text-underline">
                   <Download style={{fontSize:"16px"}} /><a href={isProduct ? '/downloads/products.csv' : '/downloads/sites.csv'} title={isProduct ? 'products.csv' : 'sites.csv'} download={isProduct ? 'products.csv' : 'sites.csv'}>Download {isProduct ? "" : ""} CSV template</a>
                </span>
            </div>
        </div>

        <div className="row ">
            <div className="col">

                <form onSubmit={handleFormSubmit}>
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

                            <div className="row  justify-content-center text-center bg-white rad-8 p-3 no-gutters ">
                                <div className="col-12">
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
                                    <div className="text-gray-light text-14">(Click To Upload CSV File)</div>


                                </div>
                                {showProgress &&  <div className="col-12 tex">
                                     <LinearProgressWithLabel value={progress} />
                                </div>}

                            </div>
                    {showCompletion&&<div className={"text-blue text-center"}>CSV bulk upload completed.</div>}
                    <p style={{color: "rgb(244, 67, 54)"}} className="text-danger">{errors["artifact"]&&errors["artifact"].message}</p>
                    <div style={{color: "rgb(244, 67, 54)"}} className="text-danger">{errors["upload"]&&errors["upload"].message}</div>




                    {isProduct &&  <div className="row">
                                <div className="col mt-2">

                                        <SelectArrayWrapper

                                            // initialValue={this.props.item&&this.props.item.site._key}
                                            option={"name"}
                                            valueKey={"_key"}
                                            error={showErrors&&errors["deliver"]}
                                            onChange={(value)=> {

                                                handleChange(value,"deliver")

                                            }}
                                            select={"Select"}
                                            options={props.siteList} name={"deliver"}
                                            title="Dispatch / Collection Address"/>


                                        <p style={{ marginTop: "10px" }} className="text-right">
                                            <span className="mr-1 text-gray-light">Don’t see your address?</span>
                                            <span
                                                onClick={handleShowHideSite}
                                                className={
                                                    "forgot-password-link  "
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

                                </div>
                            </div>}
                    {!showAdvanceStrategy &&<div className={`row `}>

                            <input
                                type="hidden"
                                name="match_strategy"
                              value="exact_match"

                            />
                        <input
                            type="hidden"
                            name="merge_strategy"
                            value="pick_first"

                        />



                    </div>}

                    {showAdvanceStrategy &&     <div className={`row `}>
                                <div className="col-md-6">
                                    <SelectArrayWrapper
                                        name="match_strategy"
                                        error={showErrors&&errors["match_strategy"]}
                                        helperText="Select how to match"
                                        options={MATCH_STRATEGY_OPTIONS}

                                        // select={"Select"}
                                        onChange={(value)=> {
                                            handleChange(value,"match_strategy")
                                        }}

                                        title="Match Strategy"

                                    />
                                </div>

                                <div className="col-md-6">
                                    <SelectArrayWrapper
                                        // select={"Select"}
                                        name="merge_strategy"
                                        error={showErrors&&errors["merge_strategy"]}
                                        helperText="Select how to merge"
                                        options={MERGE_STRATEGY_OPTIONS}
                                        onChange={(value)=> {
                                            handleChange(value,"merge_strategy")
                                        }}

                                        title="Merge Strategy"
                                    />
                                </div>
                            </div>}
                    <p style={{ marginTop: "10px" }} className=" mb-2">
                        <span className="mr-1 text-gray-light"> </span>
                        <span
                            onClick={()=>setShowAdvanceStrategy(!showAdvanceStrategy)}
                            className={
                                "forgot-password-link "
                            }>
                                                    {!showAdvanceStrategy
                                                        ? "Show advanced settings"
                                                        : "Hide advanced settings"}
                                                </span>
                    </p>

                            <div className="row mt-4 mb-4">
                                <div className="col text-center">
                                    <GreenButton
                                        title={"Submit"}
                                        type={"submit"}

                                        disabled={isDisabled}

                                    >
                                    </GreenButton>
                                </div>
                            </div>
                        </form>


            </div>
        </div>
        </div>


        {siteShowHide && (
            <div
                className={
                    "row justify-content-center p-2 "
                }>


                <div className="col-md-12 col-sm-12 col-xs-12 ">
                    <div
                        onClick={handleShowHideSite}
                        className={
                            "custom-label text-bold text-blue pt-2 pb-2 click-item"
                        }>
                        <ArrowBackIcon /> Upload Multiple {isProduct?"Products":"Site"}
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 ">
                    <div className={"row"}>
                        <div className={"col-12"}>

                            <SiteForm submitCallback={ handleShowHideSite} setSiteFormNew={{show:true,type:"new",heading:"Add New Site"}} removePopUp={true} />
                            {/*<EditSite showHeader={false} site={{}} submitCallback={() => this.showSubmitSite()} />*/}

                        </div>
                    </div>
                </div>
            </div>
        )}



    </>
};
function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
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
