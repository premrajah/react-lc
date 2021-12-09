import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Select from "@mui/material/Select";
import "../../Util/upload-file.css";
import {Cancel, Check, Error, Info, Publish} from "@mui/icons-material";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import _ from "lodash";
import {Spinner} from "react-bootstrap";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import {createProductUrl} from "../../Util/Api";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {capitalize} from "../../Util/GlobalFunctions";
import SiteForm from "../Sites/SiteForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomPopover from "../FormsUI/CustomPopover";
import InfoIcon from "../FormsUI/ProductForm/InfoIcon";


class ProductForm extends Component {

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
            condition: ["New", "Used", "Salvage"],
            product: null,
            parentProduct: null,
            imageLoading: false,
            showSubmitSite: false,
            is_listable: false,
            moreDetail: false,
            isSubmitButtonPressed: false,
            disableVolume:false
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
    }


    getFiltersCategories() {
        axios
            .get(baseUrl + "category", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
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

                                    this.setState({
                                        images: images,
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
            validateFormatCreate("brand", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("category", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("type", [{check: Validators.required, message: '<Sw>'}],fields),
            validateFormatCreate("state", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("deliver", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("units", [{check: Validators.required, message: 'Required'}],fields),

        ]

        if (!this.state.disableVolume){
            validations.push( validateFormatCreate("volume", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'This field should be a number.'}],fields),
            )
        }



        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChangeProduct(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

        if (field==="purpose"&&value==="Aggregate"){

            this.setState({
                disableVolume:true
            })
        }
       else if (field==="purpose"&&value!=="Aggregate"){

            this.setState({
                disableVolume:false
            })
        }


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
            });

            const data = new FormData(event.target);


            if (this.props.item){
                this.updateSubmitProduct(data)
            }
            else {

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
                const is_listable = this.state.is_listable;
                const site = data.get("deliver")
                const year_of_making = data.get("manufacturedDate")?data.get("manufacturedDate"):0
                const external_reference = data.get("external_reference")


                const productData = {
                    purpose: purpose.toLowerCase(),
                    condition: condition.toLowerCase(),
                    name: title,
                    description: description,
                    category: category,
                    type: type,
                    units: units,
                    state: state,
                    volume: volume,
                    is_listable: is_listable,
                    "external_reference" : external_reference,
                    sku: {
                        serial: serial,
                        model: model,
                        brand: brand,
                        sku: sku,
                        upc: upc,
                        part_no: part_no,
                    },

                    year_of_making: year_of_making,
                };

                if (this.props.createProductId){

                    productData._id="Product/"+this.props.createProductId
                }

                var completeData;

                if (this.props.parentProduct) {
                    completeData = {
                        product: productData,
                        sub_products: [],
                        artifact_ids: this.state.images,
                        site_id: site,
                        parent_product_id: this.props.parentProduct,
                    };
                } else {
                    completeData = {
                        product: productData,
                        sub_products: [],
                        // "sub_product_ids": [],
                        artifact_ids: this.state.images,
                        parent_product_id: null,
                        site_id: site,
                    };
                }

                this.setState({isSubmitButtonPressed: true})

                // return false
                axios
                    .put(
                        createProductUrl,
                        completeData,
                        {
                            headers: {
                                Authorization: "Bearer " + this.props.userDetail.token,
                            },
                        }
                    )
                    .then((res) => {
                        if (!this.props.parentProduct) {
                            this.setState({
                                product: res.data.data,
                                parentProduct: res.data.data,
                            });
                        }

                        this.props.showSnackbar({show:true,severity:"success",message:title+" created successfully. Thanks"})
                        this.showProductSelection();
                        // this.props.loadProducts(this.props.userDetail.token);
                        // this.props.loadProductsWithoutParent();



                    })
                    .catch((error) => {
                        this.setState({isSubmitButtonPressed: false})
                    });
            }

    };
    loadImages=()=> {
        let images = [];

        let currentFiles = [];

        for (let k = 0; k < this.props.item.artifacts.length; k++) {

            var fileItem = {
                status: 1,
                id: this.props.item.artifacts[k]._key,
                imgUrl: this.props.item.artifacts[k].blob_url,
                file: {
                    mime_type: this.props.item.artifacts[k].mime_type,
                    name: this.props.item.artifacts[k].name,
                },
            };
            // fileItem.status = 1  //success
            // fileItem.id = this.state.item.artifacts[k]._key
            // fileItem.url = this.state.item.artifacts[k].blob_url

            images.push(this.props.item.artifacts[k]._key);

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

            const productData = {
                id: this.props.item.product._key,
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
                    external_reference : external_reference,
                    is_listable: this.state.is_listable,
                    sku: {
                        serial: serial,
                        model: model,
                        brand: brand,
                        sku: sku,
                        upc: upc,
                        part_no: part_no,
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

    componentDidMount() {
        window.scrollTo(0, 0);

        this.getFiltersCategories();


        if (this.props.item){
            this.loadImages()
            this.setState({
                isEditProduct:true,

            })

        }


        this.setUpYearList();

        this.props.loadSites(this.props.userDetail.token);
    }


    showMultipleUpload=()=>{

        this.props.setMultiplePopUp({show:true,type:"isProduct"})
            this.props.showProductPopUp({ action: "hide_all", show: false });



    }


    render() {
        const classes = withStyles();
        const classesBottom = withStyles();


        return (
            <>


                    <div className={!this.state.showSubmitSite?"":"d-none"}>

                <div className="row   pt-2 ">
                    <div className="col-7  ">
                        <h4 className={"blue-text text-heading"}>{this.props.heading} {this.state.isEditProduct&&"- "+this.props.item.product.name}</h4>
                    </div>
                    <div className="col-5  ">
                        <button className="btn btn-sm blue-btn" onClick={() => this.showMultipleUpload()} type="button">Upload Multiple Products</button>
                    </div>
                </div>




                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-12"}>

                          <form onSubmit={this.handleSubmit}>


                            <div className="row ">
                                <div className="col-12 mt-2">

                                   <TextFieldWrapper  details="the name of your product"
                                     initialValue={this.props.item&&this.props.item.product.name}
                                     onChange={(value)=>this.handleChangeProduct(value,"title")}
                                     error={this.state.errors["title"]}
                                     name="title" title="Title"

                                   />

                                </div>
                            </div>

                            <div className="row  mt-2">
                                <div className="col-md-4 col-sm-12  justify-content-start align-items-center">

                                    <CheckboxWrapper
                                        details="do you wish to list your product now or in the future ?"
                                        initialValue={this.props.item&&this.props.item.product.is_listable}
                                        onChange={(checked)=>this.checkListable(checked)} color="primary"
                                        name={"is_listable"} title="Allow product to be listed" />

                                </div>

                                <div className="col-md-8 col-sm-12">

                                    <SelectArrayWrapper  details="Which category is your product associated with"
                                        initialValue={this.props.item&&this.props.item.product.category}
                                        option={"name"}
                                        valueKey={"name"}
                                        select={"Select"}
                                        error={this.state.errors["category"]}
                                        onChange={(value)=> {

                                            this.handleChangeProduct(value,"category")
                                            this.setState({
                                                catSelected:  this.state.categories.length>0? this.state.categories.filter(
                                                    (item) => item.name === value
                                                )[0]:null,

                                                subCategories:this.state.categories.length>0?this.state.categories.filter(
                                                    (item) => item.name === value
                                                )[0]&&this.state.categories.filter(
                                                    (item) => item.name === value
                                                )[0].types:[],
                                                states: [],
                                                units: [],

                                            })
                                        }}
                                        options={this.state.categories} name={"category"} title="Resource Category"
                                    />



                                </div>

                                {/*<div className="col-md-4 col-sm-12">*/}

                                {/* */}

                                {/*</div>*/}
                            </div>

                            <div className="row mt-2">


                                <div className={"col-md-4 col-sm-12 col-xs-12"}>

                                    <SelectArrayWrapper  details="What is your product?"
                                        initialValue={this.props.item&&this.props.item.product.type}
                                        option={"name"}
                                        valueKey={"name"}
                                        select={"Select"}
                                        error={this.state.errors["type"]}
                                        onChange={(value)=> {
                                            this.handleChangeProduct(value,"type")

                                            this.setState({
                                                subCatSelected:  this.state.subCategories.length>0? this.state.subCategories.filter(
                                                    (item) => item.name === value
                                                )[0]:null,

                                                states: this.state.subCategories.length>0?this.state.subCategories.filter(
                                                    (item) => item.name === value
                                                )[0].state:[],
                                                units: this.state.subCategories.length>0?this.state.subCategories.filter(
                                                    (item) => item.name === value
                                                )[0].units:[]
                                            })
                                        }}

                                        disabled={
                                            ((this.state.subCategories&&this.state.subCategories.length > 0)) ? false : true
                                        } options={this.state.subCategories?this.state.subCategories:[]} name={"type"} title="Type"/>

                                </div>

                                <div className={"col-md-4 col-sm-12 col-xs-12"}>



                                    <SelectArrayWrapper  details="What is the functionality of your product? "
                                        initialValue={this.props.item&&this.props.item.product.state}
                                        onChange={(value)=>this.handleChangeProduct(value,"state")}
                                        error={this.state.errors["state"]}

                                        select={"Select"}
                                        disabled={ (this.state.states.length > 0 )? false : true}
                                        options={this.state.states?this.state.states:[]} name={"state"} title="State"/>
                                </div>

                                <div className={"col-md-4 col-sm-12 col-xs-12"}>

                                    <SelectArrayWrapper  details="What condition is your product currently? "

                                        initialValue={this.props.item&&capitalize(this.props.item.product.condition)}
                                        onChange={(value)=>this.handleChangeProduct(value,"condition")}
                                        error={this.state.errors["condition"]}
                                        options={this.state.condition}
                                        name={"condition"} title="Condition"
                                    />


                                </div>
                            </div>



                            <div className="row  mt-2">
                                <div className="col-12">
                                    <div className="row camera-grids      ">
                                        <div className="col-md-4 col-sm-12 col-xs-12  ">

                                            <SelectArrayWrapper  detailsHeading="What is the purpose of your product?"  details="
                                            Defined – A product as a whole,
                                            Aggregate – A product made up of aggregates (other products),
                                            Prototype – A prototype product"

                                                initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                                onChange={(value)=> {
                                                    this.handleChangeProduct(value,"purpose")

                                                }}
                                               options={this.state.purpose} name={"purpose"} title="Purpose"/>

                                        </div>
                                        <div className="col-md-4 col-sm-12 col-xs-12  ">
                                        <TextFieldWrapper  details="Who the product is made by?"
                                            initialValue={this.props.item&&this.props.item.product.sku.brand}
                                            onChange={(value)=>this.handleChangeProduct(value,"brand")}
                                            error={this.state.errors["title"]}
                                            name="brand" title="Brand" />
                                        </div>
                                        <div className="col-md-4 col-sm-12 col-xs-12 ">

                                            <SelectArrayWrapper  details="Select the site where your product is currently located. If the site is not found, please create below using ‘Add New Address’"

                                                initialValue={this.props.item&&this.props.item.site._key}
                                                option={"name"}
                                                valueKey={"_key"}
                                                error={this.state.errors["deliver"]}
                                                onChange={(value)=> {

                                                                    this.handleChangeProduct(value,"deliver")

                                                                }} select={"Select"}
                                                options={this.props.siteList} name={"deliver"}
                                                title="Dispatch/Collection Address"/>


                                            <p style={{ marginTop: "10px" }}>
                                                <span className="mr-1 text-gray-light">or </span>
                                                <span
                                                    onClick={this.showSubmitSite}
                                                    className={
                                                        "green-text forgot-password-link"
                                                    }>
                                                    {this.state.showSubmitSite
                                                        ? "Hide add site"
                                                        : "Add new address"}
                                                </span>
                                            </p>



                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className="row  mt-2">
                                    <div className="col-12">
                                        <div className="row  justify-content-start ">
                                            <div className="col-12 ">
                                                <div
                                                    className={"custom-label text-bold text-blue mb-1"}>
                                                    Quantity
                                                </div>
                                            </div>

                                            <div className="col-4 ">
                                                <SelectArrayWrapper  details="The units the product is measured in"
                                                    select={"Select"}
                                                    initialValue={this.props.item&&this.props.item.product.units}
                                                    onChange={(value)=>this.handleChangeProduct(value,"units")}
                                                    error={this.state.errors["units"]}

                                                    disabled={ (this.state.units.length > 0) ? false : true}
                                                    options={this.state.units} name={"units"} title="(Units)"/>
                                            </div>
                                            <div className="col-4 ">

                                                {!this.state.disableVolume&&   <TextFieldWrapper  details="The number of units there are of the product"
                                                    // readonly ={this.state.disableVolume}
                                                    initialValue={this.props.item&&this.props.item.product.volume+""}
                                                    // value={this.state.disableVolume?"0":""}
                                                    onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                                    error={this.state.errors["volume"]}
                                                    name="volume" title="(Volume)" />}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            <div className="row  mt-2">
                                <div className="col-12">

                                    <TextFieldWrapper  details="Give your product a description "
                                        initialValue={this.props.item&&this.props.item.product.description}
                                        onChange={(value)=>this.handleChangeProduct(value,"description")}
                                        error={this.state.errors["description"]}
                                        multiline
                                  rows={4} name="description" title="Description" />


                                </div>
                            </div>

                            <div className="row  mt-2">
                                <div className="col-12 text-left">
                                    <span style={{ float: "left" }}>
                                        <span
                                            onClick={this.showMoreDetails}
                                            className={
                                                "green-text forgot-password-link"
                                            }>
                                            {this.state.moreDetail
                                                ? "Hide Details"
                                                : "Add More details"} <CustomPopover text={"Optional fields for the product "}><Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"24px"}/></CustomPopover>
                                        </span>
                                    </span>
                                </div>
                            </div>



                                    <div className={this.state.moreDetail?"col-12 mt-2": "d-none    "}>
                                        <div className="row">
                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <SelectArrayWrapper  details="Select when the product was manufactured "


                                                    initialValue={this.props.item&&this.props.item.product.year_of_making}
                                                    select={"Select"}
                                                    onChange={(value)=> {

                                                    }}
                                                    options={this.state.yearsList} name={"manufacturedDate"} title="Year Of Manufacture"/>

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">

                                                <TextFieldWrapper  details="Model number of the product "   initialValue={this.props.item&&this.props.item.product.sku.model} name="model" title="Model" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  details="Serial number of the product "   initialValue={this.props.item&&this.props.item.product.sku.serial} name="serial" title="Serial Number" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  details="The Stock Keeping Unit of the product"   initialValue={this.props.item&&this.props.item.product.sku.sku} name="sku" title="Sku" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  details="The Universal Product Code of the product"    initialValue={this.props.item&&this.props.item.product.sku.upc} name="upc" title="UPC" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  details=" The part number of the product"   initialValue={this.props.item&&this.props.item.product.sku.part_no} name="part_no" title="Part No." />

                                            </div>
                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  details="A unique number used by external systems"   initialValue={this.props.item&&this.props.item.product.external_reference} name="external_reference" title="External reference" />

                                            </div>
                                        </div>
                                    </div>

<div className={"row"}>
                            <div className="col-12 mt-2">
                                <div className={"custom-label text-bold text-blue mb-3"}>
                                   Add Attachments <CustomPopover text={"Any images, videos, documents or external links you wish to add to the product. \n" +
                                "\n" +
                                "Files that can be uploaded are: png, jpeg, jpg, .doc, .csv"}><InfoIcon/></CustomPopover>
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
                            <div className="col-12  mb-2">
                                {this.state.files.length > 0 ? (
                                    this.state.files.filter((item) => item.status === 0).length >
                                    0 ? (
                                        <button
                                            className={
                                                "btn btn-default btn-lg btn-rounded shadow btn-block btn-gray login-btn"
                                            }>
                                            Upload in progress ....
                                        </button>
                                    ) : (
                                        <button
                                            type={"submit"}
                                            className={
                                                "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                            }
                                        disabled={this.state.isSubmitButtonPressed}>
                                            {this.props.item?"Update Product":"Add Product"}
                                        </button>
                                    )
                                ) : (
                                    <button
                                        type={"submit"}
                                        className={
                                            "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                        }
                                        disabled={this.state.isSubmitButtonPressed}>
                                        {this.props.item?"Update Product":"Add Product"}
                                    </button>
                                )}
                            </div>
                    </div>
                            </form>



                    </div>
                </div>
                        </div>



                {this.state.showSubmitSite && (
                    <div
                        className={
                            "row justify-content-center p-2 "
                        }>


                        <div className="col-md-12 col-sm-12 col-xs-12 ">
                            <div
                                onClick={this.showSubmitSite}
                                className={
                                    "custom-label text-bold text-blue pt-2 pb-2 click-item"
                                }>
                                <ArrowBackIcon /> Add Product
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12 ">
                            <div className={"row"}>
                                <div className={"col-12"}>

                                    <SiteForm submitCallback={() => this.showSubmitSite()} setSiteFormNew={{show:true,item:this.props.item,type:"new",heading:"Add New Site"}} removePopUp={true} />
                                    {/*<EditSite showHeader={false} site={{}} submitCallback={() => this.showSubmitSite()} />*/}

                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductForm);
