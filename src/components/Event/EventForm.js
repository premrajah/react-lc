import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Select from "@mui/material/Select";
import "../../Util/upload-file.css";
import {Cancel, Check, Error, Info, Publish} from "@mui/icons-material";
import axios from "axios/index";
import {baseUrl, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import _ from "lodash";
import {Spinner} from "react-bootstrap";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import {createProductUrl} from "../../Util/Api";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {capitalize, fetchErrorMessage} from "../../Util/GlobalFunctions";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomPopover from "../FormsUI/CustomPopover";
import InfoIcon from "../FormsUI/ProductForm/InfoIcon";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import SiteFormNew from "../Sites/SiteFormNew";
import Slider from '@mui/material/Slider';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import ProductExpandItemNew from "../Products/ProductExpandItemNew";
import CustomizedSelect from "../FormsUI/ProductForm/CustomizedSelect";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import CustomizedInput from "../FormsUI/ProductForm/CustomizedInput";
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
            timerEnd: false,
            isEditProduct:false,
            count: 0,
            nextIntervalFlag: false,
            activePage: 0, //0 logn. 1- sign up , 3 -search,
            categories: [],
            subCategories: [],
            catSelected: {},
            subCatSelected: {},
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
            progressBar: 33,
            products: [],
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
            listResourceData: null,
            resourcesMatched: [],
            showCreateSite: false,
            showProductList: false,
            showAddComponent: false,
            siteSelected: null,
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
            energyRating:0,
            productId:null,
            showForm:true,
            templates:[],
            selectedTemplated:null,
            artifacts:[],
            is_manufacturer:false,
            intervals:[
                {key:1000,value:"Weekly"},
                {key:2000,value:"Montly"},
                {key:1000,value:"Annualy"},
            ],
            processes:[


                {key:"service",value:"Service"},
                {key:"warranty",value:"Warranty Expire"},
                {key:"clean",value:"Clean"},
                {key:"repair_or_replace",value:"Repair / Replacement of parts"},
                {key:"other",value:"Other"},

            ]


        };


        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)

        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

        this.checkListable = this.checkListable.bind(this);
        this.showMoreDetails = this.showMoreDetails.bind(this);
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


    getFiltersCategories() {
        axios.get(baseUrl + "category")
            .then(
                (response) => {
                    let   responseAll=[]
                     responseAll = _.sortBy(response.data.data, ["name"]);

                    this.setState({
                        categories: responseAll,
                    });

                    if (responseAll.length>0&&this.props.item){

                        let cat=responseAll.filter((item) => item.name === this.props.item.product.category)
                        let subCategories=cat.length>0?cat[0].types:[]
                       let states = subCategories.length>0?responseAll.filter((item) => item.name === this.props.item.product.category)[0].types.filter((item) => item.name === this.props.item.product.type)[0].state:[]
                          let  units = states.length>0?responseAll.filter((item) => item.name === this.props.item.product.category)[0].types.filter((item) => item.name === this.props.item.product.type)[0].units:[]

                        this.setState({
                            subCategories:subCategories,
                            states : states,
                            units : units
                        })

                    }

                },
                (error) => {}
            );
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

    showMoreDetails() {
        this.setState({
            moreDetail: !this.state.moreDetail,
        });
    }

    setUpYearList() {
        let years = [];

        let currentYear = new Date().getFullYear();

        //Loop and add the Year values to DropDownList.
        for (let i = currentYear; i >= 1950; i--) {
            years.push(i);
        }

        this.setState({
            yearsList: years,
        });
    }


    handleValidationProduct() {


        let fields = this.state.fields;


        let validations=[
            validateFormatCreate("title", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}],fields),


        ]



        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
            // console.log(errors)
        return formIsValid;
    }

    handleChangeProduct(value,field ) {


        if (field==="startDate"){
            this.setState({
                startDate:value
            })
        }

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });




    }


    showProductSelection=() =>{


        this.props.loadProductsWithoutParentNoListing({offset:0,size:this.props.productPageSize, refresh:true});


        if (!this.props.parentProduct) {
            this.props.setProduct(this.state.product);
            this.props.setParentProduct(this.state.parentProduct);
        } else {
        }

        // this.props.loadProducts(this.props.userDetail.token);
        // this.props.loadProductsWithoutParent(this.props.userDetail.token);

        this.props.showProductPopUp({ type: "sub_product_view", show: true });

        this.props.loadProductsWithoutParent({offset:0,size:this.props.productPageSize, refresh:true});

    }

    handleSubmit = (event) => {


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


            // if (this.props.item&&!this.props.productLines){
            //
            //     this.updateSubmitProduct(data)
            // }
            // else {

                this.setState({isSubmitButtonPressed: true})

                    axios
                        .post(
                            baseUrl+"event",
                            {
                                event:{
                                     title : data.get("title"),
                                     description : data.get("description"),
                                     resolution_epoch_ms : new Date(this.state.startDate).getTime(),
                                     recur_in_epoch_ms : data.get("interval"),
                                     process : data.get("process"),
                                    // stage:"open"
                                },
                                product_id : this.props.productId,
                                artifact_ids: this.state.images

                            },
                        )
                        .then((res) => {



                            this.props.showSnackbar({
                                show: true,
                                severity: "success",
                                message:   "Event created successfully. Thanks"
                            })

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
        // console.log(artifacts)
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
            // fileItem.status = 1  //success
            // fileItem.id = this.state.item.artifacts[k]._key
            // fileItem.url = this.state.item.artifacts[k].blob_url

            images.push(artifacts[k]._key);

            currentFiles.push(fileItem);
        }

        this.setState({
            files: currentFiles,
            images: images,
        });
    }


    updateImages() {
        axios
            .post(
                baseUrl + "product/artifact/replace",

                {
                    product_id: this.props.item.product._key,
                    artifact_ids: this.state.images,
                },
            )
            .then((res) => {
                if (!this.props.parentProduct) {
                    // this.setState({
                    //     product: res.data.data,
                    //     parentProduct: res.data.data,
                    // });
                }

                this.triggerCallback();

            })
            .catch((error) => {

            });
    }

    updateSite(site) {
        axios
            .post(
                baseUrl + "product/site",

                {
                    product_id: this.props.item.product._key,
                    site_id: site,
                },
            )
            .then((res) => {})
            .catch((error) => {

            });
    }

    updateSubmitProduct = (formData) => {

            const data = formData;
            const title = data.get("title");
            const purpose = data.get("purpose");
            const condition = data.get("condition");
            const description = data.get("description");
            const category = data.get("category");
            const type = data.get("type");
            const units = data.get("units");

            const serial = data.get("serial");
            const model = data.get("model");
            const brand = data.get("brand");

            const volume = data.get("volume");
            const sku = data.get("sku");
            const upc = data.get("upc");
            const part_no = data.get("part_no");
            const state = data.get("state");
           const external_reference = data.get("external_reference")
            const site = data.get("deliver");
           const power_supply = data.get("power_supply");

            const productData = {
                id: this.props.item.product._key,
                is_manufacturer: this.state.is_manufacturer,
                update: {
                    artifacts: this.state.images,
                    purpose: purpose.toLowerCase(),
                    condition: condition.toLowerCase(),
                    name: title,
                    description: description,
                    category: category,
                    type: type,
                    units: units,
                    state: state,
                    volume: Number(volume),
                    stage: "certified",
                    energy_rating : this.state.energyRating,
                    external_reference : external_reference,
                    is_listable: this.state.is_listable,


                    sku: {
                        serial: serial,
                        model: model,
                        brand: brand,
                        sku: sku,
                        upc: upc,
                        part_no: part_no,
                        power_supply: power_supply,
                    },
                    year_of_making: Number(data.get("manufacturedDate")),

                },
            };

            axios
                .post(
                    baseUrl + "product",

                    productData
                )
                .then((res) => {

                        this.updateSite(site);
                        this.updateImages();
                       this.props.loadCurrentProduct(this.props.item.product._key)
                    this.props.showSnackbar({show:true,severity:"success",message:this.props.item.product.name+" updated successfully. Thanks"})

                    this.props.triggerCallback("edit")


                })
                .catch((error) => {});

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps!=this.props){
              // alert("called")

        }
    }

    fetchCache=()=> {

        this.setState({
            btnLoading: true,

        });
        axios
            .get(baseUrl + "org/cache")
            .then(
                (response) => {

                    // this.setState({
                    //     btnLoading: false,
                    //
                    // });

                    let responseObj=response.data.data

                    let keys=Object.keys(responseObj)

                    let templates=[]
                    keys.forEach((item)=> {

                            if (item.includes("product_line"))
                                templates.push({key: item, value: JSON.parse(responseObj[item])})
                        }
                    )
                    // console.log(templates)

                    this.setState({
                        templates: templates,

                    });


                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    componentDidMount() {

        window.scrollTo(0, 0);

        // console.log(this.props.productId,this.props.type)
        this.setState({
            parentProductId:null
        }, ()=>{

            this.handleView(this.props.productId,this.props.type)

        })

      // alert("called")

        if (this.props.item){
            this.loadImages(this.props.item.artifacts)
            this.setState({
                isEditProduct:true,
            })
        }


        this.setUpYearList();

        this.props.loadSites(this.props.userDetail.token);

        // if (this.props.productId){
        //     this.setState({
        //         productId:this.props.productId,
        //         showForm:false
        //     })
        // }else{
        //     this.setState({
        //         productId:null,
        //         showForm:true
        //     })
        // }

        this.fetchCache()

    }


    showMultipleUpload=()=>{

        this.props.setMultiplePopUp({show:true,type:"isProduct"})
            this.props.showProductPopUp({ action: "hide_all", show: false });

    }


    handleView=(productId,type)=>{

        this.setState({
            categories:[],
            subCategories:[],
            states :[],
            units : []
        })
        this.getFiltersCategories();

        if (type=='new') {
            this.setState({
                parentProductId: productId?productId:null,
                showForm: true
            })
        }
        else if (type=='parent') {
            this.setState({
                parentProductId: productId,
                showForm: false
            })
        }


        // this.props.setMultiplePopUp({show:true,type:"isProduct"})
        // this.props.showProductPopUp({ action: "hide_all", show: false });

    }





    render() {


        return (
            <>


                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-12"}>
                          <form onSubmit={this.handleSubmit}>
                            <div className="row ">

                                <div className="col-12 mt-2">

                                   <TextFieldWrapper
                                       details="The name of a event"
                                     initialValue={(this.props.item?this.props.item.product.name:"")
                                     ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.name:"")
                                     }
                                     onChange={(value)=>this.handleChangeProduct(value,"title")}
                                     error={this.state.errors["title"]}
                                     name="title" title="Title"

                                   />

                                </div>
                            </div>

                            <div className="row  mt-2">
                                <div className="col-12">

                                    <TextFieldWrapper  details="Describe the product your adding"
                                        initialValue={this.props.item&&this.props.item.product.description
                                        ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.description:"")
                                        }
                                        onChange={(value)=>this.handleChangeProduct(value,"description")}
                                        error={this.state.errors["description"]}
                                        multiline
                                  rows={4}
                                                       name="description" title="Description" />


                                </div>
                            </div>

                              <div className="row  mt-2">
                              <div className="col-md-4 col-12">
                                  <div
                                      className={
                                          "custom-label text-bold text-blue "
                                      }>
                                      Date
                                  </div>

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>

                                      <MobileDatePicker

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
                                          value={this.state.startDate}

                                          // value={this.state.fields["startDate"]?this.state.fields["startDate"]:this.props.item&&this.props.item.campaign.start_ts}
                                          // onChange={this.handleChangeDateStartDate.bind(
                                          //     this
                                          // )}
                                          renderInput={(params) => <CustomizedInput {...params} />}
                                          onChange={(value)=>this.handleChangeProduct(value,"startDate")}

                                      />
                                  </LocalizationProvider>

                                  {this.state.showFieldErrors&&this.state.startDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                              </div>

                                  <div className="col-md-4  col-sm-12 col-xs-12  ">

                                      <SelectArrayWrapper
                                          // detailsHeading="What is the purpose of your product?"
                                          // details="Defined: a whole product,
                                          //       Aggregate: a product made up from other products,
                                          //       Prototype: a first version of a product"

                                          // initialValue={this.props.item?(this.props.item.product.purpose):""
                                          //     ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.purpose:"")
                                          // }

                                          option={"value"}
                                          valueKey={"key"}
                                          onChange={(value)=> {
                                              this.handleChangeProduct(value,"interval")

                                          }}

                                          options={this.state.intervals} name={"interval"}
                                          title="Recurring interval"/>

                                  </div>
                                  <div className="col-md-4  col-sm-12 col-xs-12  ">

                                      <SelectArrayWrapper
                                          // detailsHeading="What is the purpose of your product?"
                                          // details="Defined: a whole product,
                                          //       Aggregate: a product made up from other products,
                                          //       Prototype: a first version of a product"

                                          // initialValue={this.props.item?(this.props.item.product.purpose):""
                                          //     ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.purpose:"")
                                          // }
                                          onChange={(value)=> {
                                              this.handleChangeProduct(value,"process")

                                          }}
                                          option={"value"}
                                          valueKey={"key"}
                                          options={this.state.processes} name={"process"}
                                          title="Process"/>

                                  </div>
                              </div>

                           <div className={"row"}>
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
                                                                                backgroundImage: `url("${item.imgUrl ? item.imgUrl : URL.createObjectURL(item.file)}")`

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
                                        title={this.props.item?"Update Product":"Add Product"}
                                        type={"submit"}
                                        loading={this.state.loading}
                                        disabled={this.state.loading||this.state.isSubmitButtonPressed}

                                    >
                                    </GreenButton>

                                    )
                                ) : (
                                    <GreenButton
                                    title={this.props.item?"Update Product":"Add Product"}
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
