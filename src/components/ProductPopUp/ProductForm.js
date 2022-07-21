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
import docs from '../../img/icons/docs.png';

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
            condition: ["new", "used", "salvage"],
            powerSupply: ["gas", "electric" ],
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
            is_manufacturer:false

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
            validateFormatCreate("brand", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("category", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("type", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("state", [{check: Validators.required, message: 'Required'}],fields),

        ]

        if(!this.props.productLines&&!this.props.item){
            validations.push(validateFormatCreate("units", [{check: Validators.required, message: 'Required'}],fields))
            validations.push(validateFormatCreate("deliver", [{check: Validators.required, message: 'Required'}],fields))
            // validations.push(validateFormatCreate("templateName", [{check: Validators.required, message: 'Required'}],fields))

        }
        if(this.props.productLines){

            validations.push(validateFormatCreate("templateName", [{check: Validators.required, message: 'Required'}],fields))

        }

            if (!this.state.disableVolume&&!this.props.productLines){
            validations.push( validateFormatCreate("volume", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'This field should be a number.'}],fields),
            )
        }



        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
            // console.log(errors)
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
                loading:true
            });

            const data = new FormData(event.target);


            if (this.props.item&&!this.props.productLines){


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
                const is_listable = this.state.is_listable?true:false;
                const is_manufacturer = this.state.is_manufacturer;

                const site = data.get("deliver")
                const year_of_making = data.get("manufacturedDate") ? data.get("manufacturedDate") : 0
                const external_reference = data.get("external_reference")
                const power_supply = data.get("power_supply");
                const energy_rating = this.state.energyRating;


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
                    energy_rating: energy_rating,
                    is_listable: is_listable,


                    "external_reference": external_reference,
                    sku: {
                        serial: serial,
                        model: model,
                        brand: brand,
                        sku: sku,
                        upc: upc,
                        part_no: part_no,
                        // power_supply: power_supply?power_supply.toLowerCase():,
                    },
                    year_of_making: year_of_making,
                };

                if (power_supply){

                    productData.sku.power_supply=  power_supply.toLowerCase()

                }

                if (this.props.createProductId) {

                    productData._id = "Product/" + this.props.createProductId
                }

                var completeData;

                // if (this.props.parentProduct) {
                completeData = {
                    product: productData,
                    sub_products: [],
                    is_manufacturer: is_manufacturer,
                    artifact_ids: this.state.images,
                    site_id: site,
                    parent_product_id: this.state.parentProductId ? this.state.parentProductId : null,
                };
                // } else {
                //     completeData = {
                //         product: productData,
                //         sub_products: [],
                //         // "sub_product_ids": [],
                //         artifact_ids: this.state.images,
                //         parent_product_id: null,
                //         site_id: site,
                //     };
                // }

                this.setState({isSubmitButtonPressed: true})


                if (this.props.productLines) {

                    completeData.name=data.get("templateName")

                    this.saveProductLines(data.get("templateName") ,completeData)
                } else {
                    axios
                        .put(
                            createProductUrl,
                            completeData,
                        )
                        .then((res) => {

                            if (!this.props.parentProduct) {
                                this.setState({
                                    product: res.data.data,
                                    parentProduct: res.data.data,
                                });
                            }

                            this.props.refreshPage(true)
                            this.props.showSnackbar({
                                show: true,
                                severity: "success",
                                message: title + " created successfully. Thanks"
                            })
                            this.showProductSelection();

                            // this.props.loadProducts(this.props.userDetail.token);
                            // this.props.loadProductsWithoutParent();


                            // this.setState({
                            //     parentProductId:res.data.data.product._key
                            // })

                            this.setState({loading: false,})


                            this.setState({
                                btnLoading: false,
                                loading: false,
                                isSubmitButtonPressed: false
                            });

                            if (!this.state.parentProductId) {
                                this.handleView(res.data.data.product._key, 'parent')
                            } else {
                                this.handleView(this.state.parentProductId, 'parent')
                            }

                        })
                        .catch((error) => {
                            this.setState({
                                btnLoading: false,
                                loading: false,
                                isSubmitButtonPressed: false
                            });
                            this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

                        });
                }
            }
    };

    saveProductLines=(name,completeData)=>{


        completeData.artifacts=this.state.artifacts


        axios
            .post(
                `${baseUrl}org/cache`, {
                    key: "product_line_"+slugify(name,{
                        lower: true,
                        replacement: '_',
                    },),
                    value:   JSON.stringify(completeData),
                },
            )
            .then((res) => {

                // if (!this.props.parentProduct) {
                //     this.setState({
                //         product: res.data.data,
                //         parentProduct: res.data.data,
                //     });
                // }
                //
                // this.props.refreshPage(true)
                this.props.showSnackbar({
                    show: true,
                    severity: "success",
                    message:  "Product line created successfully. Thanks"
                })

                if (this.props.refresh) {
                    this.props.refresh()
                    this.props.hide()
                }
                // this.showProductSelection();

                // this.props.loadProducts(this.props.userDetail.token);
                // this.props.loadProductsWithoutParent();


                // this.setState({
                //     parentProductId:res.data.data.product._key
                // })

                this.setState({loading: false,})


                this.setState({
                    btnLoading: false,
                    loading: false,
                    isSubmitButtonPressed: false
                });

                // if (!this.state.parentProductId) {
                //     this.handleView(res.data.data.product._key, 'parent')
                // } else {
                //     this.handleView(this.state.parentProductId, 'parent')
                // }

            })
            .catch((error) => {
                this.setState({
                    btnLoading: false,
                    loading: false,
                    isSubmitButtonPressed: false
                });
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

            });
    }



    loadImages=(artifacts)=> {

        let images = [];

        let currentFiles = [];


        this.setState({
            artifacts:artifacts
        })
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
                        // power_supply: power_supply,
                    },
                    year_of_making: Number(data.get("manufacturedDate")),

                },
            };


        if (power_supply){

            productData.sku.power_supply=  power_supply.toLowerCase()

        }
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
                .catch((error) => {

                    this.setState({
                        btnLoading: false,
                        loading: false,
                        isSubmitButtonPressed: false
                    });
                    this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

                });

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps!=this.props){

            if (this.props.item){

                this.loadImages(this.props.item.artifacts)

                this.isManufacturer()
            }

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


    isManufacturer = () => {

        axios.get(baseUrl + "product/"+this.props.item.product._key+"/oc-vc" ).then(
            (response) => {

                console.log(response.data.data.ownership_context)
                this.setState({
                    is_manufacturer:response.data.data.ownership_context.is_manufacturer
                })
            }
        ).catch(error => {});

    };
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
            this.isManufacturer()
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
            units : [],
            selectedTemplate:null
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
                {!this.state.showForm&&
                    <ProductExpandItemNew
                        createNew={this.handleView}
                        productId={this.state.parentProductId}
                    />}

                {this.state.showForm &&
                <div className={`${!this.state.showSubmitSite?"":"d-none"} `}>
                    <div className="row">
                    <div className="col-md-8  col-xs-12">
                        <h4 className={"blue-text text-heading "}>
                            {this.props.edit?"Edit Product":this.props.productLines?this.props.item?"Edit "+this.props.item.name:"Add Product Line":this.state.parentProductId?"Add subproduct":"Add product"}

                        </h4>

                    </div>
                        {!this.props.hideUpload&&!this.props.productLines &&
                        <div className="col-md-4  col-xs-12 desktop-right">
                        <button className="btn btn-sm blue-btn pt-2" onClick={() => this.showMultipleUpload()} type="button">Upload Multiple Products</button>
                        </div>}

                        {!this.props.item&&!this.props.productLines &&this.state.templates.length>0&&
                        <div className="col-4 ">

                            <select

                                className="rad-8 "
                                style={{height:"60px",
                                    padding: '18.5px 14px',
                                    borderRadius: 4,
                                    fontSize: 16,
                                    border: '1px solid #ced4da',}}
                                variant="standard"
                                // details=""
                                // initialValue={this.props.item&&this.props.item.site._key}
                                // option={"name"}
                                // valueKey={"key"}
                                // subValueKey={"name"}
                                onChange={(value)=> {


                                    this.setState({
                                        selectedTemplate:this.state.templates.find(item=>item.key==value.currentTarget.value )
                                    })

                                    this.loadImages(this.state.templates.find(item=>item.key==value.currentTarget.value).value.artifacts)


                                }}
                                // select={"Select"}
                                // options={this.state.templates}
                                name={"template"}
                                title="Select Product Line..">
                                <option value={""}>Select Product Line</option>
                                {this.state.templates.map((item)=>
                                <option value={item.key}>{item.value.name?item.value.name:item.value.product.name}</option>

                                )}
                            </select>

                        </div>}

                    </div>


                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-12"}>
                          <form onSubmit={this.handleSubmit}>
                            <div className="row ">
                                {this.props.productLines &&
                                <div className="col-12 mt-2">
                                <TextFieldWrapper

                                    details="The name of  template"

                                    initialValue={(this.props.item?this.props.item.name:"")}
                                    hidden={this.props.item?true:false}
                                        onChange={(value)=>this.handleChangeProduct(value,"templateName")}
                                        error={this.state.errors["templateName"]}
                                        name="templateName" title="Template Name"
                                />
                                </div>
                                }
                                <div className="col-12 mt-2">

                                   <TextFieldWrapper
                                       details="The name of a product"
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
                                {!this.props.productLines &&    <div className="col-md-4 col-sm-12  justify-content-start align-items-center">

                                    <CheckboxWrapper
                                        details="When listed, product will appear in the marketplace searches"
                                        initialValue={this.props.item&&this.props.item.product.is_listable}
                                        onChange={(checked)=>this.checkListable(checked)} color="primary"
                                        name={"is_listable"} title="List for sale" />

                                </div>}
                                {!this.props.productLines &&    <div className="col-md-4 col-sm-12  justify-content-start align-items-center">

                                    <CheckboxWrapper
                                        details="Is Manufacturer ?"
                                        initialValue={this.state.is_manufacturer}
                                        onChange={(checked)=>this.checkListableManufacturer(checked)} color="primary"
                                        name={"is_manufacturer"} title="Manufacturer" />

                                </div>}

                                <div className="col-md-4 col-sm-12">

                                    <SelectArrayWrapper
                                        details="Materials or category a product belongs to Type"
                                        initialValue={this.props.item?this.props.item.product.category:""
                                        ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.category:"")
                                        }
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
                                        options={this.state.categories} name={"category"}
                                                         title="Resource Category"
                                    />



                                </div>

                                {/*<div className="col-md-4 col-sm-12">*/}

                                {/* */}

                                {/*</div>*/}
                            {/*</div>*/}

                            {/*<div className="row mt-2">*/}


                                <div className={"col-md-4 col-sm-12 col-xs-12"}>

                                    <SelectArrayWrapper
                                        initialValue={this.props.item?this.props.item.product.type:""
                                        ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.type:"")
                                        }
                                        option={"name"}
                                        valueKey={"name"}
                                        select={"Select"}
                                        error={this.state.errors["type"]}
                                        onChange={(value)=> {

                                            this.setState({
                                                states:[],
                                                units:[]
                                            })

                                            setTimeout(()=>{
                                                if ( this.state.subCategories&&this.state.subCategories.length>0){



                                                    let subCatSelected=this.state.subCategories.find(
                                                        (item) => item.name === value
                                                    )

                                                    let states=[]
                                                    let units=[]
                                                    if(subCatSelected) {
                                                        states = subCatSelected.state
                                                        units = subCatSelected.units
                                                    }

                                                    this.setState({
                                                        subCatSelected: subCatSelected ? subCatSelected : null,
                                                        states: states,
                                                        units: units
                                                    })
                                                }
                                            },500)


                                            this.handleChangeProduct(value,"type")

                                        }}

                                        disabled={
                                            ((this.state.subCategories&&this.state.subCategories.length > 0)) ? false : true
                                        }
                                        options={this.state.subCategories?this.state.subCategories:[]} name={"type"}
                                        title="Type"/>

                                </div>

                                <div className={"col-md-4 col-sm-12 col-xs-12"}>

                                    <SelectArrayWrapper
                                        initialValue={this.props.item?this.props.item.product.state:""
                                        ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.state:"")}
                                        onChange={(value)=>  {

                                            this.handleChangeProduct(value,"state")}
                                        }
                                        error={this.state.errors["state"]}
                                        select={"Select"}
                                        disabled={ (this.state.states.length > 0 )? false : true}
                                        options={this.state.states?this.state.states:[]} name={"state"} title="State"
                                    />
                                </div>

                                <div className={"col-md-4 col-sm-12 col-xs-12"}>

                                    <SelectArrayWrapper

                                        initialValue={this.props.item?(this.props.item.product.condition):""
                                        ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.condition:"")
                                        }
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
                                        <div className="col-md-4 d-none col-sm-12 col-xs-12  ">

                                            <SelectArrayWrapper
                                                detailsHeading="What is the purpose of your product?"
                                                details="Defined: a whole product,
                                                Aggregate: a product made up from other products,
                                                Prototype: a first version of a product"

                                                initialValue={this.props.item?(this.props.item.product.purpose):""
                                                ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.purpose:"")
                                                }
                                                onChange={(value)=> {
                                                    this.handleChangeProduct(value,"purpose")

                                                }}
                                               options={this.state.purpose} name={"purpose"} title="Purpose"/>

                                        </div>
                                        <div className="col-md-4 col-sm-12 col-xs-12  ">
                                        <TextFieldWrapper
                                            details="The brand name of a product"
                                            initialValue={this.props.item&&this.props.item.product.sku.brand||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.sku.brand:"")}
                                            onChange={(value)=>this.handleChangeProduct(value,"brand")}
                                            error={this.state.errors["brand"]}
                                            name="brand"
                                            title="Brand" />
                                        </div>
                                        {!this.props.productLines &&
                                        <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 ">

                                            <SelectArrayWrapper
                                                details="Select product’s location from the existing sites or add new address below"
                                                initialValue={this.props.item&&this.props.item.site._key}
                                                option={"name"}
                                                valueKey={"_key"}
                                                error={this.state.errors["deliver"]}
                                                onChange={(value)=> {

                                                                    this.handleChangeProduct(value,"deliver")

                                                                }} select={"Select"}
                                                options={this.props.siteList} name={"deliver"}
                                                title="Dispatch / Collection Address"/>


                                            <p style={{ marginTop: "10px" }}>
                                                <span className="mr-1 text-gray-light">or </span>
                                                <span
                                                    onClick={this.showSubmitSite}
                                                    className={
                                                        " forgot-password-link ellipsis-end"
                                                    }>
                                                    {this.state.showSubmitSite
                                                        ? "Hide Add Site"
                                                        : "Add New Address"}
                                                </span>
                                            </p>



                                        </div>}
                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <SelectArrayWrapper

                                                initialValue={this.props.item&&this.props.item.product.sku.power_supply
                                                ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.sku.power_supply:"")
                                                }
                                                select={"Select"}

                                                onChange={(value)=> {
                                                    this.handleChangeProduct(value,"power_supply")

                                                }}
                                                options={this.state.powerSupply} name={"power_supply"} title="Power Supply"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                              <div className="row  mt-2">


                                  <div className="col-md-8 d-none col-sm-12 col-xs-12">
                                      <div className="custom-label text-bold ellipsis-end text-blue mb-0">Energy Rating
                                      </div>
                                  <div className="d-flex mt-2  align-items-center flex-row ">
                                       <span className={"mr-2"}>0&nbsp;&nbsp;</span>
                                      <Slider
                                          step={1}
                                          min={0}
                                          max={100}
                                          style={{color: "var(--lc-pink) !important"}}
                                          valueLabelDisplay="on"
                                          components={{
                                              ValueLabel: ValueLabelComponent,
                                          }}
                                          aria-label="custom thumb label"
                                          defaultValue={this.props.item&&this.props.item.product.energy_rating?this.props.item.product.energy_rating:0}
                                          onChange={(event)=>{
                                              this.setState({
                                                  energyRating:event.target.value
                                              })
                                          }}
                                      /> <span className={"ml-2"}> &nbsp;&nbsp;{100}</span>
                                  </div>

                                  </div>
                              </div>
                              {!this.props.productLines && <div className="row  mt-2">
                                    <div className="col-12">
                                        <div className="row  justify-content-start ">
                                            <div className="col-12 ">
                                                <div
                                                    className={"custom-label text-bold text-blue mb-1"}>
                                                    Quantity
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-xs-12 ">
                                                <SelectArrayWrapper  details="A measurement chosen as a standard"
                                                    select={"Select"}
                                                    initialValue={this.props.item&&this.props.item.product.units}
                                                    onChange={(value)=>this.handleChangeProduct(value,"units")}
                                                    error={this.state.errors["units"]}

                                                    disabled={ (this.state.units.length > 0) ? false : true}
                                                    options={this.state.units} name={"units"} title="(Units)"/>
                                            </div>
                                            <div className="col-md-4 col-xs-12 ">

                                                {!this.state.disableVolume&&   <TextFieldWrapper
                                                    details="The number of units"
                                                    // readonly ={this.state.disableVolume}
                                                    initialValue={this.props.item&&this.props.item.product.volume+""}
                                                    // value={this.state.disableVolume?"0":""}
                                                    onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                                    error={this.state.errors["volume"]}
                                                    name="volume" title="(Volume)" />}

                                            </div>
                                        </div>
                                    </div>
                                </div>}

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
                                <div className="col-12 text-left">
                                    <span style={{ float: "left" }}>
                                        <span
                                            onClick={this.showMoreDetails}
                                            className={
                                                " forgot-password-link"
                                            }>
                                            {this.state.moreDetail
                                                ? "Hide Details"
                                                : "Add More Details"} <CustomPopover text="Optional details of a product"><Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"24px"}/></CustomPopover>
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className={`row  ${this.state.moreDetail?"mt-2":"d-none"}`}>
                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <SelectArrayWrapper
                                                    initialValue={this.props.item?this.props.item.product.year_of_making:""
                                                    ||(this.state.selectedTemplate?parseInt(this.state.selectedTemplate.value.product.year_of_making):"")
                                                    }
                                                    select={"Select"}
                                                    onChange={(value)=> {

                                                    }}
                                                    options={this.state.yearsList} name={"manufacturedDate"} title="Year Of Manufacture"/>

                                            </div>


                                <div className="col-md-4 col-sm-6 col-xs-6">

                                                <TextFieldWrapper
                                                    initialValue={this.props.item?this.props.item.product.sku.model:""
                                                    ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.sku.model:"")}
                                                    name="model"
                                                    title="Model"

                                                    onChange={(value)=>this.handleChangeProduct(value,"model")}

                                                />

                                            </div>

                                {!this.props.productLines &&
                                <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper
                                                    initialValue={this.props.item&&this.props.item.product.sku.serial}
                                                    name="serial"
                                                    title="Serial Number" />

                                            </div>}

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper
                                                    details="Stock Keeping Unit"
                                                    initialValue={this.props.item?this.props.item.product.sku.sku:""
                                                    ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.sku.sku:"")
                                                    }
                                                    onChange={(value)=>this.handleChangeProduct(value,"sku")}
                                                    name="sku"
                                                    title="Sku" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper
                                                    onChange={(value)=>this.handleChangeProduct(value,"upc")}
                                                    details="Universal Product Code"
                                                    initialValue={this.props.item?this.props.item.product.sku.upc:""
                                                    ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.sku.upc:"")
                                                    } name="upc" title="UPC" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper
                                                    onChange={(value)=>this.handleChangeProduct(value,"part_no")}
                                                    initialValue={this.props.item?this.props.item.product.sku.part_no:""
                                                    ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.sku.part_no:"")
                                                    } name="part_no" title="Part No." />

                                            </div>
                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper
                                                    onChange={(value)=>this.handleChangeProduct(value,"external_reference")}
                                                    details="A unique number used by external systems"
                                                                   initialValue={this.props.item?this.props.item.product.external_reference:""
                                                                   ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.external_reference:"")
                                                                   } name="external_reference" title="External reference" />

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
                                        title={this.props.productLines?"Submit":this.props.item?"Update Product":"Add Product"}
                                        type={"submit"}
                                        loading={this.state.loading}
                                        disabled={this.state.loading||this.state.isSubmitButtonPressed}

                                    >
                                    </GreenButton>

                                    )
                                ) : (
                                    <GreenButton
                                    title={this.props.productLines?"Submit":this.props.item?"Update Product":"Add Product"}
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
                        </div>
                }

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
                            <div className=" row  justify-content-center align-items-center">
                                <div className="col-12">
                                    <h4 className={"blue-text text-heading ellipsis-end mb-0 text-capitalize"}>Add New Site</h4>
                                </div>

                            </div>
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <SiteFormNew showHeader={false}  refresh={() => this.showSubmitSite()}   />
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
        refreshPage: (data) => dispatch(actionCreator.refreshPage(data)),
        setCurrentProduct: (data) => dispatch(actionCreator.setCurrentProduct(data)),


    };
};
export default  connect(mapStateToProps, mapDispachToProps)(ProductForm);
