import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import "../../Util/upload-file.css";
import {Cancel, Check, Error, Publish} from "@mui/icons-material";
import axios from "axios/index";
import {baseUrl, MIME_TYPES_ACCEPT, RECUR_UNITS} from "../../Util/Constants";
import _ from "lodash";
import {Spinner} from "react-bootstrap";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {fetchErrorMessage} from "../../Util/GlobalFunctions";
import CustomPopover from "../FormsUI/CustomPopover";
import InfoIcon from "../FormsUI/ProductForm/InfoIcon";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import CustomizedInput from "../FormsUI/ProductForm/CustomizedInput";
import docs from "../../img/icons/docs.png";
import ProductAutocomplete from "../AutocompleteSearch/ProductAutocomplete";
import Switch from "@mui/material/Switch";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import {Box} from "@mui/material";
import {DesktopDatePicker} from "@mui/x-date-pickers";

var slugify = require('slugify')


function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
};

class EventForm extends Component {

    slug = null;

    constructor(props) {
        super(props);

        this.state = {


            stateSelected: null,
            states: [],
            sites: [],
            page: 1,
            fields: {},
            errors: {},
            fieldsSite: {},
            errorsSite: {},
            fieldsProduct: {},
            errorsProduct: {},
            units: [],

            productSelected: null,
            nextBlue: false,
            nextBlueAddDetail: false,
            nextBlueViewSearch: false,
            matches: [],
            unitSelected: null,
            volumeSelected: null,
            title: null,
            description: null,
            volume: null,
            productError:false,
            files: [],
            filesStatus: [],
            images: [],
            free: false,
            price: null,
            brand: null,
            manufacturedDate: null,
            model: null,
            serial: null,
            startDate: null,
            endDate: null,
            currentUploadingImages: [],
            yearsList: [],
            purpose: ["Defined", "Prototype", "Aggregate"],
            condition: ["new", "used", "salvage"],
            powerSupply: ["gas", "electric", "hybrid", "solid_fuel"],
            product: null,
            parentProduct: null,
            parentProductId: null,
            imageLoading: false,
            showSubmitSite: false,
            is_listable: false,
            moreDetail: false,
            isSubmitButtonPressed: false,
            disableVolume:false,
            loading:false,
            showForm:true,
            showRepeatIntervalSelection:false,
            selectedTemplated:null,
            artifacts:[],
            is_manufacturer:false,
            intervals:[
                {key:86400000 ,value:"Every Day"},
                {key:604800000 ,value:"Every Week"},
                {key:864000000,value:"Every 10 Days"},
                // {key:2629743000 ,value:"Every Month(30 Days)"},
                // {key:31556926000 ,value:"Every Year(365 Days)"},
            ],

            processes:[

                {key:"service",value:"Service"},
                {key:"warranty",value:"Warranty Expire"},
                {key:"clean",value:"Clean"},
                {key:"repair_or_replace",value:"Repair / Replacement of parts"},
                {key:"other",value:"Other"},

            ],
            productId:null,


        };


        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)

        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);


    }

    showSubmitSite=()=> {

        window.scrollTo(0, 0);

        this.setState({
            errorRegister: null,
        });

        this.setState({
            showSubmitSite: !this.state.showSubmitSite,
        });

        this.props.loadSites(this.props.userDetail.token);
    }





    handleChangeFile(event) {
        let files = this.state.files;
        // var filesUrl = this.state.filesUrl

        let newFiles = [];

        for (var i = 0; i < event.target.files.length; i++) {
            files.push({ file: event.target.files[i], status: 0, id: null });
            newFiles.push({ file: event.target.files[i], status: 0, id: null });
        }


        this.setState({
            files: files,
        });

        this.uploadImage(newFiles);
    }

    handleCancel(e) {
        e.preventDefault();

        var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name;
        var url = e.currentTarget.dataset.url;

        var files = this.state.files.filter((item) => item.file.name !== name);
        this.setState({
            artifacts: this.state.artifacts.filter(item=> item.name!==name)
        })
        // var filesUrl = this.state.filesUrl.filter((item) => item.url !== url)

        // var images = this.state.images.filter((item)=> item !==index )

        // var images = this.state.images

        // images.splice(index,1)

        var images = [];
        for (let k = 0; k < files.length; k++) {
            if (files[k].id) {
                images.push(files[k].id);
            }
        }

        this.setState({
            images: images,
        });

        this.setState({
            files: files,
        });
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    getImageAsBytes(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = () => {
                let arrayBuffer = reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            };
            reader.onerror = (error) => reject(error);
        });
    }

    uploadImage(files) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let imgFile = files[i];

                this.getImageAsBytes(imgFile.file)
                    .then(data => {
                        const payload = data;


                        try {
                            axios.post(`${baseUrl}artifact/load?name=${imgFile.file.name.toLowerCase()}`, payload)
                                .then(res => {

                                    let images = [...this.state.images];
                                    images.push(res.data.data._key);


                                    let artifacts=this.state.artifacts

                                    artifacts.push(res.data.data)

                                    this.setState({
                                        images: images,
                                        artifacts:artifacts

                                    });

                                    let currentFiles = this.state.files;

                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 1; //success
                                            currentFiles[k].id = res.data.data._key; //success
                                        }
                                    }

                                    this.setState({
                                        files: currentFiles,
                                    });
                                })
                                .catch(error => {

                                    let currentFiles = [...this.state.files];
                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 2; //failed
                                        }
                                    }

                                    this.setState({
                                        files: currentFiles,
                                    });
                                })

                        } catch (e) {
                            console.log('catch Error ', e);
                        }

                    })
                    .catch(error => {
                      console.log('image upload error ', error);
                    })

            }
        }
    }



    checkListable(checked) {


        this.setState({
            is_listable: checked,
        });
    }
    checkListableManufacturer(checked) {


        this.setState({
            is_manufacturer: checked,
        });
    }




    handleValidationProduct() {





        let fields = this.state.fields;


        let validations=[
            validateFormatCreate("title", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}],fields),
        ]


        if (this.state.showRepeatIntervalSelection)
            validations.push(validateFormatCreate("recurValue", [{check: Validators.required, message: 'Required'}],fields))
            validations.push(validateFormatCreate("recurUnit", [{check: Validators.required, message: 'Required'}],fields))







        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });


        if (!this.state.productId) {

            this.setState({
                productError:true
            })

            formIsValid=false
        }else{
            this.setState({
                productError:false
            })
        }

        return formIsValid;
    }

    handleChangeProduct(value,field ) {


        if (field==="startDate"){
            this.setState({
                startDate:value
            })
        }
        if (field==="endDate"){
            this.setState({
                endDate:value
            })
        }



        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });




    }


    handleSubmit = (event) => {


        try {
            event.preventDefault();
            event.stopPropagation()
            if (!this.handleValidationProduct()) {

                return
            }




            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
                loading: true
            });

            const data = new FormData(event.target);


            let eventData = {
                title: data.get("title"),
                description: data.get("description"),
                resolution_epoch_ms: new Date(this.state.startDate).getTime() + 100,
                recur_until_epoch_ms: new Date(this.state.endDate).getTime() + 100,

                process: data.get("process"),
            }


            if (data.get("recurValue") && data.get("recurUnit")) {
                eventData.recur = {value: data.get("recurValue"), unit: data.get("recurUnit")}
            }

            if (data.get("interval")) {

                eventData.recur_in_epoch_ms = data.get("interval")
            }




            this.setState({isSubmitButtonPressed: true})



            axios.post(
                    baseUrl + "event",
                    {
                        event: eventData,
                        product_id: this.state.productId,
                        artifact_ids: this.state.images

                    },
                )
                .then((res) => {

                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: "Event created successfully. Thanks"
                    })

                    this.props.hide()
                })
                .catch((error) => {
                    this.setState({
                        btnLoading: false,
                        loading: false,
                        isSubmitButtonPressed: false
                    });
                    this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

                });


        }catch (e){
            console.log(e)
        }

    };

    updateEvent = (event) => {

        event.preventDefault();
        event.stopPropagation()

        if (!this.handleValidationProduct()){
            return
        }
        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
            loading:true
        });

        const data = new FormData(event.target);


        let eventData=  {
            title : data.get("title"),
            description : data.get("description"),
            resolution_epoch_ms : new Date(this.state.startDate).getTime()+100,
            recur_until_epoch_ms: new Date(this.state.endDate).getTime() + 100,
            process : data.get("process"),
            // stage:"open"
        }


        if (data.get("interval")){

            eventData.recur_in_epoch_ms = data.get("interval")
        }


        if (data.get("recurValue") && data.get("recurUnit")) {
            eventData.recur = {value: data.get("recurValue"), unit: data.get("recurUnit")}
        }

        this.setState({isSubmitButtonPressed: true})

        axios
            .post(
                baseUrl+"event/update",
                {
                    id:this.props.event.event._key,
                    update:
                         eventData,
                        // product_id: this.props.event.product.product._key,
                        // artifact_ids: this.state.images

                },
            )
            .then((res) => {



                this.props.showSnackbar({
                    show: true,
                    severity: "success",
                    message:   "Event updated successfully. Thanks"
                })

                this.props.hide()
            })
            .catch((error) => {
                this.setState({
                    btnLoading: false,
                    loading: false,
                    isSubmitButtonPressed: false
                });
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

            });
        // }

    };



    loadImages=(artifacts)=> {

        let images = [];

        let currentFiles = [];

        for (let k = 0; k < artifacts.length; k++) {

            var fileItem = {
                status: 1,
                id: artifacts[k]._key,
                imgUrl: artifacts[k].blob_url,
                file: {
                    mime_type: artifacts[k].mime_type,
                    name: artifacts[k].name,
                },
            };

            images.push(artifacts[k]._key);

            currentFiles.push(fileItem);
        }

        this.setState({
            files: currentFiles,
            images: images,
        });
    }


    selectedProduct = (data) => {

        this.setState({
            productId:data.key?data.key:null
        })
    };




    componentDidUpdate(prevProps, prevState, snapshot) {


        if (prevProps!=this.props){

         this.updateProps()


        }
    }


    updateProps=()=>{
        if (this.props.event){
            this.setState({
                isEditProduct:true,
                startDate:this.props.event.event.resolution_epoch_ms
            })
            this.loadImages(this.props.event.artifacts)

        }else{

            this.setState({
                isEditProduct:true,

            })

            if (this.props.date) {
                this.setState({
                    startDate: this.props.date
                })
            }
            else{

                this.setState({
                    startDate: new Date()
                })
            }

        }
    }


    componentDidMount() {

        window.scrollTo(0, 0);

        if (this.props.productId){
            this.setState({
                productId:this.props.productId
            })
        }

        this.updateProps()

        if (this.props.event&&this.props.event.event.recur&&this.props.event.event.recur.value){

            this.setState({
                showRepeatIntervalSelection:true
            })
        }

    }

    showMultipleUpload=()=>{

        this.props.setMultiplePopUp({show:true,type:"isProduct"})
            this.props.showProductPopUp({ action: "hide_all", show: false });

    }

     handleChangeSwitch = (event) => {

       this.setState({
           showRepeatIntervalSelection:!this.state.showRepeatIntervalSelection
       })

    };


    render() {


        return (
            <>


                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-12"}>


                          <form onSubmit={this.props.event?this.updateEvent:this.handleSubmit}>

                              {/*{!this.props.hideProduct &&*/}
                              <ProductAutocomplete
                                  disableEdit={this.props.event?true:false}
                                  initial={this.props.event?this.props.event.product.product:null}
                                  suggestions={this.state.orgNames}
                                  selectedProduct={(data) =>
                                      this.selectedProduct(data)
                                  }
                              />
                              {/*}*/}

                              {this.state.productError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Product from your inventory not selected."}</span>}
                            <div className="row ">

                                <div className="col-12 mt-2">

                                   <TextFieldWrapper
                                       details="The name of a event"
                                     initialValue={(this.props.event?this.props.event.event.title:"")}
                                     onChange={(value)=>this.handleChangeProduct(value,"title")}
                                     error={this.state.errors["title"]}
                                     name="title" title="Title"

                                   />

                                </div>
                            </div>

                            <div className="row  mt-2">
                                <div className="col-12">

                                    <TextFieldWrapper  details="Describe the product your adding"
                                        initialValue={this.props.event&&this.props.event.event.description}
                                        onChange={(value)=>this.handleChangeProduct(value,"description")}
                                        error={this.state.errors["description"]}
                                        multiline
                                  rows={4}
                                                       name="description" title="Description" />


                                </div>
                            </div>

                              <div className="row  mt-2">
                              <div className="col-md-6 col-6">
                                  <div
                                      className={
                                          "custom-label text-bold text-blue "
                                      }>
                                      Resolution Date
                                  </div>

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>

                                      <DesktopDatePicker

                                          className={"full-width-field"}
                                          disableHighlightToday={true}
                                          minDate={new Date()}
                                          disablePast
                                          // label="Required By"
                                          inputVariant="outlined"
                                          variant={"outlined"}
                                          margin="normal"
                                          id="date-picker-dialog-1"
                                          // label="Available From"
                                          inputFormat="dd/MM/yyyy"
                                          hintText="Select Date"
                                          value={this.state.startDate||this.props.date}
                                          style={{position:"relative"}}

                                          // value={this.state.fields["startDate"]?this.state.fields["startDate"]:this.props.event&&this.props.event.campaign.start_ts}
                                          // onChange={this.handleChangeDateStartDate.bind(
                                          //     this
                                          // )}
                                          OpenPickerIcon={<InfoIcon/>}

                                          // renderInput={(params) => <CustomizedInput {...params} />}

                                          renderInput=   {({ inputRef, inputProps, InputProps }) => (
                                              <div className="custom-calander-container">
                                                  <CustomizedInput ref={inputRef} {...inputProps} />
                                                  <span className="custom-calander-icon">{InputProps?.endAdornment}</span>
                                              </div>
                                          )}
                                          onChange={(value)=>this.handleChangeProduct(value,"startDate")}

                                      />
                                  </LocalizationProvider>

                                  {this.state.showFieldErrors&&this.state.startDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                              </div>

                                  <div className="col-md-6 d-none  col-sm-12 col-xs-12  ">

                                      <SelectArrayWrapper

                                          initialValue={this.props.event&&this.props.event.event.recur_in_epoch_ms}

                                          select={"Select interval"}
                                          option={"value"}
                                          valueKey={"key"}
                                          onChange={(value)=> {
                                              this.handleChangeProduct(value,"interval")

                                          }}

                                          options={this.state.intervals} name={"interval"}
                                          title="Recurring interval"/>

                                  </div>
                                  <div className="col-6  ">

                                      <SelectArrayWrapper

                                          initialValue={this.props.event&&this.props.event.event.process}
                                          onChange={(value)=> {
                                              this.handleChangeProduct(value,"process")

                                          }}
                                          option={"value"}
                                          valueKey={"key"}
                                          options={this.state.processes} name={"process"}
                                          title="Process"/>

                                  </div>
                                  <div className="col-md-12  col-sm-12 col-xs-12  ">
                                  <div className="row  ">
                                      <div className="col-12">
                                          <div className="row  ">
                                              <div className="col-12 ">
                                                  <div className="custom-label text-bold text-blue ">Repeat ?</div>
                                              </div>
                                              <div className="col-12 ">
                                          <Stack direction="row" spacing={1} alignItems="center">
                                              <Typography>No</Typography>

                                                  <Switch
                                                      checked={this.state.showRepeatIntervalSelection}
                                                      onChange={this.handleChangeSwitch}
                                                  color="primary"   />

                                              <Typography>Yes</Typography>
                                          </Stack>
                                              </div>
                                          </div>
                                      </div>




                                  </div>

                                      {this.state.showRepeatIntervalSelection &&
                                      <div className="row bg-light pb-4 pt-2 ">
                                          <div className="col-md-6 col-6">
                                              <div
                                                  className={
                                                      "custom-label text-bold text-blue "
                                                  }>
                                                  End Date
                                              </div>

                                              <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                  <DatePicker

                                                      className={"full-width-field"}
                                                      disableHighlightToday={true}
                                                      minDate={new Date()}
                                                      // label="Required By"
                                                      inputVariant="outlined"
                                                      variant={"outlined"}
                                                      margin="normal"
                                                      id="date-picker-dialog-1"
                                                      // label="Available From"
                                                      inputFormat="dd/MM/yyyy"
                                                      hintText="Select Date"
                                                      value={this.state.endDate||this.props.date}
                                                      style={{position:"relative"}}

                                                      OpenPickerIcon={<InfoIcon/>}

                                                      // renderInput={(params) => <CustomizedInput {...params} />}

                                                      renderInput=   {({ inputRef, inputProps, InputProps }) => (
                                                          <div className="custom-calander-container">
                                                              <CustomizedInput ref={inputRef} {...inputProps} />
                                                              <span className="custom-calander-icon">{InputProps?.endAdornment}</span>
                                                          </div>
                                                      )}
                                                      onChange={(value)=>this.handleChangeProduct(value,"endDate")}

                                                  />
                                              </LocalizationProvider>


                                          </div>
                                      <div className="col-6 ">
                                          <div className="row  ">
                                              <div className="col-12 ">
                                                  <div className="custom-label text-bold text-blue ">Repeating interval</div>
                                              </div>
                                              <div className="col-12 connected-fields ">

                                                  <div>
                                                      <TextFieldWrapper
                                                          noMargin
                                                          placeholder="Enter value e.g. 1,2,3 .."
                                                          initialValue={this.props.event && this.props.event.event.recur&&this.props.event.event.recur.value?this.props.event.event.recur.value:""}
                                                          onChange={(value)=>this.handleChangeProduct(value,"recurValue")}
                                                          error={this.state.errors["recurValue"]}
                                                          name="recurValue"
                                                          numberInput

                                                      />
                                                  </div>
                                                  <div style={{width:"200px"}}>
                                                      <SelectArrayWrapper
                                                          noMargin
                                                          initialValue={this.props.event && this.props.event.event.recur&&this.props.event.event.recur.unit?this.props.event.event.recur.unit:""}
                                                          select={"Select unit"}
                                                          option={"value"}
                                                          valueKey={"key"}
                                                          error={this.state.errors["recurUnit"]}
                                                          onChange={(value)=> {
                                                              this.handleChangeProduct(value,"recurUnit")
                                                          }}
                                                          options={RECUR_UNITS} name={"recurUnit"}
                                                      />
                                                  </div>

                                              </div>


                                          </div>
                                      </div>

                                      </div>
                                      }


                                  </div>




                              </div>

                           <div className={"row b"}>
                            <div className="col-12 mt-2">
                                <div className={"custom-label text-bold text-blue mb-3"}>
                                   Add Attachments <CustomPopover text="Add images, videos, manuals and other documents or external links (png, jpeg, jpg, doc, csv)"><InfoIcon/></CustomPopover>
                                </div>

                                <div className="container-fluid  pb-3 ">
                                    <div className="row camera-grids      ">
                                        <div className="col-12  text-left ">
                                            <div className="">
                                                <div className={""}>

                                                    <div className={"file-uploader-box"}>
                                                        <div
                                                            className={
                                                                "file-uploader-thumbnail-container"
                                                            }>
                                                            <div
                                                                className={
                                                                    "file-uploader-thumbnail-container"
                                                                }>
                                                                <label
                                                                    className={"label-file-input"}
                                                                    htmlFor="fileInput">
                                                                    <Publish
                                                                        style={{
                                                                            fontSize: 32,
                                                                            color: "#a8a8a8",
                                                                            margin: "auto",
                                                                        }}
                                                                    />
                                                                </label>
                                                                <input
                                                                    accept={MIME_TYPES_ACCEPT}
                                                                    style={{ display: "none" }}
                                                                    id="fileInput"
                                                                    className={""}
                                                                    multiple
                                                                    type="file"
                                                                    onChange={this.handleChangeFile.bind(
                                                                        this
                                                                    )}

                                                                />
                                                            </div>

                                                            {this.state.files &&
                                                            this.state.files.map(
                                                                (item, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className={
                                                                            "file-uploader-thumbnail-container"
                                                                        }>

                                                                        <div

                                                                            data-index={
                                                                                index
                                                                            }
                                                                            className={
                                                                                "file-uploader-thumbnail"
                                                                            }

                                                                            style={{
                                                                                // backgroundImage: `url("${item.imgUrl ? item.imgUrl : URL.createObjectURL(item.file)}")`
                                                                                backgroundImage: `url("${item.imgUrl ? item.imgUrl : URL.createObjectURL(item.file)}"),url(${docs})`

                                                                            }}
                                                                        >
                                                                            {item.status ===
                                                                            0 && (
                                                                                <Spinner
                                                                                    as="span"
                                                                                    animation="border"
                                                                                    size="sm"
                                                                                    role="status"
                                                                                    aria-hidden="true"
                                                                                    style={{
                                                                                        color:
                                                                                            "#cccccc",
                                                                                    }}
                                                                                    className={
                                                                                        "center-spinner"
                                                                                    }
                                                                                />
                                                                            )}

                                                                            {item.status ===
                                                                            1 && (
                                                                                <Check
                                                                                    style={{
                                                                                        color:
                                                                                            "#cccccc",
                                                                                    }}
                                                                                    className={
                                                                                        " file-upload-img-thumbnail-check"
                                                                                    }
                                                                                />
                                                                            )}
                                                                            {item.status ===
                                                                            2 && (
                                                                                <span
                                                                                    className={
                                                                                        "file-upload-img-thumbnail-error"
                                                                                    }>
                                                                                                <Error
                                                                                                    style={{
                                                                                                        color:
                                                                                                            "red",
                                                                                                    }}
                                                                                                    className={
                                                                                                        " "
                                                                                                    }
                                                                                                />
                                                                                                <p>
                                                                                                    Error!
                                                                                                </p>
                                                                                            </span>
                                                                            )}
                                                                            <Cancel
                                                                                data-name={
                                                                                    item.file &&
                                                                                    item
                                                                                        .file[
                                                                                        "name"
                                                                                        ]
                                                                                        ? item
                                                                                            .file[
                                                                                            "name"
                                                                                            ]
                                                                                        : ""
                                                                                }
                                                                                data-index={
                                                                                    item.id
                                                                                }
                                                                                onClick={this.handleCancel.bind(
                                                                                    this
                                                                                )}
                                                                                className={
                                                                                    "file-upload-img-thumbnail-cancel"
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                      </div>
                           <div className={"row"}>
                            <div className="col-12 text-center  mb-2">
                                {this.state.files.length > 0 ? (
                                    this.state.files.filter((item) => item.status === 0).length >
                                    0 ? (
                                            <GreenButton
                                                title={"Upload in progress ...."}
                                                type={"submit"}
                                                loading={true}
                                                disabled={true}

                                            >
                                            </GreenButton>

                                    ) : (
                                    <GreenButton
                                        title={this.props.event?"Update Event":"Add Event"}
                                        type={"submit"}
                                        loading={this.state.loading}
                                        disabled={this.state.loading||this.state.isSubmitButtonPressed}

                                    >
                                    </GreenButton>

                                    )
                                ) : (
                                    <GreenButton
                                    title={this.props.event?"Update Event":"Add Event"}
                                    type={"submit"}
                                    loading={this.state.loading}

                                    disabled={this.state.loading||this.state.isSubmitButtonPressed}

                                    >
                                    </GreenButton>

                                )}
                            </div>
                    </div>
                            </form>
                    </div>
                </div>



            </>
        );
    }
}




const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,
        parentProduct: state.parentProduct,
        product: state.product,
        showProductPopUp: state.showProductPopUp,
        siteList: state.siteList,
        productWithoutParentList: state.productWithoutParentList,
        productPageOffset:state.productPageOffset,
        productPageSize:state.productPageSize,
        createProductId:state.createProductId
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),

        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadProductsWithoutParentNoListing: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentNoListing(data)),

        loadProductsWithoutParentPagination: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentPagination(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        refreshPage: (data) => dispatch(actionCreator.refreshPage(data)),
        setCurrentProduct: (data) => dispatch(actionCreator.setCurrentProduct(data)),


    };
};
export default  connect(mapStateToProps, mapDispachToProps)(EventForm);
