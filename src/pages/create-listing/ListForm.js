import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Close from "@mui/icons-material/Close";
import "../../Util/upload-file.css";
import {makeStyles} from "@mui/styles";
import Toolbar from "@mui/material/Toolbar";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import LinearProgress from "@mui/material/LinearProgress";
import ProductBlue from "../../img/icons/product-blue.png";

import ItemDetailPreview from "../../components/ItemDetailPreview";
import ProductTreeView from "../../components/ProductTreeView";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';


import PageHeader from "../../components/PageHeader";
import EditSite from "../../components/Sites/EditSite";
import ProductItem from "../../components/Products/Item/ProductItem";
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import {capitalize} from "../../Util/GlobalFunctions";
import Layout from "../../components/Layout/Layout";
import TextField from "@mui/material/TextField";
import clsx from "clsx";
import {Link} from "react-router-dom";


class ListFormNew extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
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
            filesUrl: [],
            uploadFiles: [],
            uploadFilesUrl: [],
            free: false,
            price: null,
            brand: null,
            manufacturedDate: null,
            model: null,
            serial: null,
            startDate: null,
            endDate: null,
            images: [],
            yearsList: [],
            purpose: ["defined", "prototype", "aggregate"],
            previewImage: null,
            selectedProductId: null,
            previewProduct:null,
            selectedLoading:false,
            createListingError:null,
            activeStep:0,
            showFieldErrors:false
        };

        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.createListing = this.createListing.bind(this);
        this.getSites = this.getSites.bind(this);
        this.toggleAddComponent = this.toggleAddComponent.bind(this);
        this.toggleSite = this.toggleSite.bind(this);
        this.toggleProductList = this.toggleProductList.bind(this);
        this.toggleFree = this.toggleFree.bind(this);
        this.toggleSale = this.toggleSale.bind(this);
        this.makeFirstActive = this.makeFirstActive.bind(this);
        this.makeActive = this.makeActive.bind(this);
        this.getPreviewImage = this.getPreviewImage.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
        this.phonenumber = this.phonenumber.bind(this);
        this.productSelected = this.productSelected.bind(this);
    }

    productSelected(productId) {
        this.loadSelectedProduct(productId)

        this.setState({
            selectedProductId: productId,
        });

        this.getPreviewImage(productId);

        let fields = this.state.fields;

        fields["product"] = productId;

        this.setState({ fields });
    }


    loadSelectedProduct = (id) =>  {

        this.setState({
            selectedLoading:true
        })

        axios
            .get(baseUrl + "product/" + (id)
            )
            .then(
                (response) => {
                    var responseAll = response.data;

                    this.setState({
                        previewProduct:responseAll.data.product
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            ).finally(()=>{

            this.setState({
                selectedLoading:false
            })
        });

    };

    phonenumber(inputtxt) {
        var phoneNoWithCode = /^[+#*\\(\\)\\[\\]]*([0-9][ ext+-pw#*\\(\\)\\[\\]]*){6,45}$/;

        var phoneWithZero = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;

        if (inputtxt.match(phoneNoWithCode)) {
            return true;
        } else if (inputtxt.match(phoneWithZero)) {
            return true;
        } else {
            return false;
        }
    }

    getPreviewImage(productSelectedKey) {
        axios.get(baseUrl + "product/" + productSelectedKey + "/artifact", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    let image=(responseAll.find(
                        (item) =>
                            item.mime_type === "image/jpeg" || item.mime_type === "image/png"
                    ))

                    if (responseAll.length > 0) {
                        this.setState({
                            previewImage:image?image.blob_url:null,
                        });
                    }
                },
                (error) => {}
            );
    }

    handleNext = () => {


        this.setState({
            showFieldErrors:true
        })

        if (this.handleValidationList(this.state.activeStep)) {

            window.scrollTo(0, 0);

            if (this.state.activeStep!=2) {
                if (this.handleValidationList(this.state.activeStep + 1)) {

                    this.setState({
                        nextBlue: true,

                    });
                } else {
                    this.setState({
                        nextBlue: false
                    });

                }

                this.setState({
                    activeStep: this.state.activeStep + 1,
                    progressBar: 100,
                    showFieldErrors: false
                });


            }



         if (this.state.activeStep === 2) {
                this.createListing();

            }
         // else if (this.state.activeStep === 3) {
         //     if ( this.state.listResourceData)
         //        this.props.history.push("/" + this.state.listResourceData._key);
         //    }


        }



    };


    handleNextOld() {
        if (this.state.page === 1 && this.handleValidateOne()) {
            window.scrollTo(0, 0);

            this.setState({
                page: 2,
                progressBar: 66,
            });
        } else if (this.state.page === 2 && this.handleValidateTwo()) {
            window.scrollTo(0, 0);

            this.setState({
                page: 3,
                progressBar: 100,
            });
        } else if (this.state.page === 3) {
            this.createListing();
            //
        } else if (this.state.page === 4) {
            this.props.history.push("/" + this.state.listResourceData._key);
        }
    }

    handleBackOld() {
        if (this.state.page === 3) {
            this.setState({
                page: 2,
                progressBar: 66,
            });
        } else if (this.state.page === 2) {
            this.setState({
                page: 1,
                progressBar: 33,
            });
        }
    }

    handleBack() {


        if ((this.state.activeStep - 1) == 0) {

            if (this.handleValidationList(this.state.activeStep - 1)) {

                this.setState({
                    nextBlue: true
                });

            } else {

                this.setState({
                    nextBlue: false
                });
            }

        }

        window.scrollTo(0, 0);

        if (this.state.activeStep>0)
            this.setState({
                activeStep: this.state.activeStep - 1
            });





        this.setState({

            progressBar: 50,
        });
    }

    handleBackOld() {
        if (this.state.page === 3) {
            window.scrollTo(0, 0);
            this.setState({
                page: 2,
                progressBar: 66,
            });
        } else if (this.state.page === 2) {
            window.scrollTo(0, 0);

            this.setState({
                page: 1,
                progressBar: 33,
            });
        }
    }

    validateDates=()=>{


        let valid=true

        if (!this.state.startDate){

            this.setState({
                startDateError:true
            })

            valid=  false

        }else{
            this.setState({
                startDateError:false
            })
        }

        if (!this.state.endDate){

            this.setState({
                endDateError:true
            })

            valid =  false

        }else{
            this.setState({
                endDateError:false
            })

        }
        return valid


    }


    handleValidationList=(activeStep)=> {


        let fields = this.state.fields;

        let validations=[]



        if (activeStep===0) {

            validations = [
                validateFormatCreate("product", [{check: Validators.required, message: 'Required'}], fields),

                validateFormatCreate("title", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),

            ]

        }
        else if (activeStep===1) {
            validations = [
                validateFormatCreate("deliver", [{check: Validators.required, message: 'Required'}], fields)

            ]

            if (!this.state.free){
                validations .push(
                    validateFormatCreate("price", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'Invalid input.'}], fields)
                )
            }

        }
        else if (activeStep===2) {

        }

        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});

        return formIsValid;

    }


    handleChange=(value,field)=>{


        if (field==="deliver") {

            this.setState({
                siteSelected:this.props.siteList.filter((site)=> site._key===value)[0]
            })

        }




        if (field==="startDate"){
            this.setState({
                startDate:value
            })
        }else if(field==="endDate"){
            this.setState({
                endDate:value
            })
        }

        let fields = this.state.fields;
        fields[field] = value;

        this.setState({ fields });

        this.setState({
            showFieldErrors:false,

        })



        if (this.handleValidationList(this.state.activeStep)){


            if (this.state.activeStep===1){

                if (this.validateDates()){

                    this.setState({
                        nextBlue:true,

                    })
                }else{

                    this.setState({
                        nextBlue:false,

                    })
                }

            }else{

                this.setState({
                    nextBlue:true,

                })

            }

        }else{
            this.setState({
                nextBlue:false,

            })

        }
    }
    handleChangeOld(field, e) {
        let fields = this.state.fields;

        fields[field] = e.target.value;

        this.setState({ fields });

        this.setState({
            price: fields["price"],
        });

        if (this.state.selectedProductId === "product") {
            this.setState({
                productSelected: e.target.value,
            });

            this.getPreviewImage(e.target.value);
        }

        if (field === "deliver") {
            this.setState({
                siteSelected: this.props.siteList.filter((item) => item._key === e.target.value)[0],
            });
        }

        if (this.state.page === 1) {
            this.handleValidateOne();
        }

        if (this.state.page === 2) {
            this.handleValidateTwo();
        }
    }



    handleChangeDateStartDate = (date) => {
        this.setState({
            startDate: date,
        });

        let fields = this.state.fields;
        fields["startDate"] = date;

        this.setState({ fields });
    };

    handleChangeDateEndDate = (date) => {
        this.setState({
            endDate: date,
        });

        let fields = this.state.fields;
        fields["endDate"] = date;

        this.setState({ fields });
    };

    makeActive(event) {
        var active = event.currentTarget.dataset.active;

        this.setState({
            activePage: parseInt(active),
        });
    }

    toggleSale() {
        this.setState({
            free: false,
        });
    }

    toggleFree() {
        this.setState({
            free: true,
        });
    }

    toggleProductList() {
        this.setState({
            showProductList: !this.state.showProductList,
        });
    }

    toggleSite() {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
    }

    getSites() {
        this.props.loadSites(this.props.userDetail.token);
    }


    createListing() {
        var data = {};

        data = {
            name: this.state.fields["title"],
            description: this.state.fields["description"],
            available_from_epoch_ms: new Date(this.state.startDate).getTime(),
            expire_after_epoch_ms: new Date(this.state.endDate).getTime(),

            price: {
                value: this.state.free ? 0 : this.state.fields["price"],
                currency: "gbp",
            },
        };


     let dataNew= {
            name: this.state.fields["title"],
                description: this.state.fields["description"],
                category: this.state.fields["category"],
                type: this.state.fields["type"],
                units: this.state.fields["units"],
                volume: this.state.fields["volume"],
                state: this.state.fields["state"],
               available_from_epoch_ms: new Date(this.state.startDate).getTime(),
                expire_after_epoch_ms: new Date(this.state.endDate).getTime(),
         price: {
             value: this.state.free ? 0 : this.state.fields["price"],
             currency: "gbp",
         },
        }

        axios
            .put(
                baseUrl + "listing",
                {
                    listing: dataNew,
                    site_id: this.state.fields["deliver"],
                    product_id: this.state.fields["product"],
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {

                this.setState({
                    listResourceData: res.data.data,
                    page: 4,
                });
                this.setState({
                    activeStep: this.state.activeStep + 1,
                    progressBar: 100,
                    showFieldErrors: false,
                    createListingError:null
                });

                // this.props.history.push("/"+res.data.data._key)
            })
            .catch((error) => {

                console.log(error.response)
                if (error&&error.response){

                    this.setState({
                        notFoundError:true,
                        createListingError:error.response.data.errors[0].message
                    })
                }

            });
    }

    toggleAddComponent() {
        this.setState({
            showAddComponent: !this.state.showAddComponent,
        });
    }

    showProductSelection(event) {
        var action = event.currentTarget.dataset.id;

        this.props.showProductPopUp({ type: "create_product", show: true });


    }

    handleValidationProduct() {
        let fields = this.state.fieldsProduct;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["purpose"]) {
            formIsValid = false;
            errors["purpose"] = "Required";
        }
        if (!fields["title"]) {
            formIsValid = false;
            errors["title"] = "Required";
        }

        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Required";
        }
        if (!fields["category"]) {
            formIsValid = false;
            errors["category"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    fields["email"].indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    fields["email"].length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errorsProduct: errors });
        return formIsValid;
    }

    handleChangeProduct(field, e) {
        let fields = this.state.fieldsProduct;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    makeFirstActive() {
        this.setState({
            page: 1,
            activePage: 0,
            progressBar: 33,
        });
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["title"]) {
            formIsValid = false;
            errors["title"] = "Required";
        } else {
            this.setState({
                title: fields["title"],
            });
        }

        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Required";
        } else {
            this.setState({
                description: fields["description"],
            });
        }

        if (!fields["serial"]) {
            formIsValid = false;
            errors["serial"] = "Required";
        } else {
            this.setState({
                serial: fields["serial"],
            });
        }
        if (!fields["brand"]) {
            formIsValid = false;
            errors["brand"] = "Required";
        } else {
            this.setState({
                brand: fields["brand"],
            });
        }
        if (!fields["model"]) {
            formIsValid = false;
            errors["model"] = "Required";
        } else {
            this.setState({
                model: fields["model"],
            });
        }

        if (!fields["manufacturedDate"]) {
            formIsValid = false;
            errors["manufacturedDate"] = "Required";
        } else {
            this.setState({
                manufacturedDate: fields["manufacturedDate"],
            });
        }

        if (!fields["model"]) {
            formIsValid = false;
            errors["model"] = "Required";
        } else {
            this.setState({
                model: fields["model"],
            });
        }

        if (
            this.state.catSelected.name &&
            this.state.subCatSelected.name &&
            this.state.stateSelected
        ) {
        } else {
            formIsValid = false;
            errors["category"] = "Required";
        }

        this.setState({ errors: errors });

        return formIsValid;
    }


    componentDidMount() {
        window.scrollTo(0, 0);

        this.props.loadProductsWithoutParentNoListing()

        this.props.loadSites(this.props.userDetail.token);
    }

    classes = useStylesSelect;

    handleValidationSite() {
        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }

        if (!fields["address"]) {
            formIsValid = false;
            errors["address"] = "Required";
        }

        if (!fields["contact"]) {
            formIsValid = false;
            errors["contact"] = "Required";
        }

        if (!fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Required";
        }

        // if ((fields["phone"])&&!this.phonenumber(fields["phone"])) {
        //
        //     formIsValid = false;
        //     errors["phone"] = "Invalid Phone Number!";
        // }

        if (fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Invalid Phone Number!";
        }

        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    fields["email"].indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    fields["email"].length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errorsSite: errors });
        return formIsValid;
    }

    handleChangeSite(field, e) {
        let fields = this.state.fieldsSite;
        fields[field] = e.target.value;
        this.setState({ fields: fields });
    }

    handleSubmitSite = (event) => {
        event.preventDefault();

        if (this.handleValidationSite()) {
            const form = event.currentTarget;

            // if (this.handleValidationSite()){

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);

            const email = data.get("email");
            const others = data.get("others");
            const name = data.get("name");
            const contact = data.get("contact");
            const address = data.get("address");
            const phone = data.get("phone");

            // var postData={
            //     "name": name,
            //     "email": email,
            //     "contact" : contact,
            //     "address": address,
            //     "phone": phone,
            //     "others": others
            //
            // }

            //

            axios
                .put(
                    baseUrl + "site",

                    {
                        site: {
                            name: name,
                            email: email,
                            contact: contact,
                            address: address,
                            phone: phone,
                            others: others,
                        },
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
                    }
                )
                .then((res) => {
                    // dispatch({type: "SIGN_UP", value : res.data})

                    this.toggleSite();

                    this.getSites();
                })
                .catch((error) => {
                    // dispatch(stopLoading())
                    // dispatch(signUpFailed(error.response.data.content.message))
                    // dispatch({ type: AUTH_FAILED });
                    // dispatch({ type: ERROR, payload: error.data.error.message });
                });
        }
    };

    handleSubmitComponent = (event) => {
        event.preventDefault();

        this.toggleAddComponent();
    };


    goToStepOne=()=>{


            this.setState({
                activeStep: 0,
                createListingError:null
            });

        this.setState({

            progressBar: 0,
        });
    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>

                <div className="container  pb-4 pt-4">
                    {this.state.activeStep<3 &&
                    <PageHeader pageTitle="New Listing" subTitle={this.state.activeStep==0?"Basic Details":this.state.activeStep==1?"More Details":"Preview"} />}

                        <div className={this.state.activeStep === 0 ? "" : "d-none"}>
                            <div className="row add-listing-container   pb-5 pt-2">
                                <div className={"col-12"}>
                                    <div onSubmit={this.createListing} className={"mb-5"}>
                                        <div className="row no-gutters justify-content-center mt-2">
                                            <div className="col-12">
                                                <TextFieldWrapper
                                                    initialValue={this.props.item&&this.props.item.search.name}
                                                    onChange={(value)=>this.handleChange(value,"title")}
                                                    error={this.state.showFieldErrors&&this.state.errors["title"]}
                                                    name="title"
                                                    title="Title"
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    fullWidth={true}
                                                />

                                            </div>

                                            <div className="col-12 mt-2">

                                                <TextFieldWrapper
                                                    onChange={(value)=>this.handleChange(value,"description")}
                                                    name={"description"}
                                                    error={this.state.showFieldErrors&&this.state.errors["description"]}
                                                    id="outlined-basic"
                                                    multiline
                                                    rows={4}
                                                    variant="outlined"
                                                    fullWidth={true}
                                                    title="Description"
                                                />

                                            </div>

                                            <div className="col-12 mt-4 mb-4">

                                                <div
                                                    className={
                                                        "custom-label text-bold text-blue mb-1"
                                                    }>
                                                    Link a product
                                                    <span onClick={this.showProductSelection}
                                                        style={{float:"right"}}
                                                        className={
                                                            "green-text forgot-password-link text-mute small"
                                                        }>
                                                    Add New product
                                                </span>
                                                </div>

                                                <div className="row">
                                                    <div className="col-4">
                                                {this.props.productWithoutParentNoList&&this.props.productWithoutParentNoList.length>0&&
                                                <ProductTreeView
                                                    items={this.props.productWithoutParentNoList}
                                                    triggerCallback={(productId) => {
                                                        this.productSelected(productId)
                                                        this.handleChange(productId,"product")

                                                    }
                                                    }
                                                    className={"mb-4"}
                                                />
                                                }
                                                    </div>
                                                    <div className="col-8 pt-2" style={{marginTop:"75px"}}>

                                                        {!this.state.selectedLoading&&this.state.previewProduct&&
                                                        <ProductItem
                                                            biggerImage={true}
                                                            index={22111}
                                                            goToLink={true}
                                                            delete={false}
                                                            edit={false}
                                                            remove={false}
                                                            duplicate={false}
                                                            hideAdd={true}
                                                            item={this.state.previewProduct}
                                                            hideMore
                                                            listOfProducts={(returnedItem) => this.handleAddToProductsExportList(returnedItem)}
                                                            showAddToListButton
                                                        />}
                                                        {this.state.selectedLoading&&
                                                        <div>Loading.....</div>
                                                        }

                                                    </div>
                                                </div>

                                                {/*<CustomizedInput*/}
                                                {/*    value={this.state.selectedProductId}*/}
                                                {/*    className={"d-none"}*/}
                                                {/*    onChange={(value)=>this.handleChange(value,"product")}*/}
                                                {/*    name={"product"}*/}
                                                {/*    placeholder={"product"}*/}
                                                {/*    id="outlined-basic"*/}
                                                {/*    variant="outlined"*/}
                                                {/*    fullWidth={true}*/}
                                                {/*/>*/}

                                               <div className={"d-none"}> <TextFieldWrapper
                                                    value={this.state.selectedProductId}
                                                    onChange={(value)=>this.handleChange(value,"product")}
                                                    name={"product"}
                                                    error={this.state.showFieldErrors&&this.state.errors["product"]}
                                                    id="outlined-basic"

                                                    rows={4}

                                                    variant="outlined"
                                                    fullWidth={true}
                                                    title="Product Select"
                                                />
                                                </div>

                                                {this.state.showFieldErrors&&this.state.errors&&this.state.errors["product"] && (
                                                    <span style={{ color: "#f44336" }} className={""}>
                                                       {this.state.errors["product"].message}

                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.activeStep === 1 ? "" : "d-none"}>
                            <div className="row add-listing-container   pb-5 pt-2">
                                <div className={"col-12"}>
                                    <div onSubmit={this.createListing} className={"mb-5"}>
                                        <div className="row no-gutters justify-content-center mt-2">
                                            <div className="col-12 ">
                                                <div className="row ">

                                                    <div className="col-12 mb-2">

                                                        <SelectArrayWrapper
                                                            valueKey={"_key"}
                                                            initialValue={this.props.item&&capitalize(this.props.item.product.deliver)}
                                                            onChange={(value)=>this.handleChange(value,"deliver")}
                                                            error={this.state.showFieldErrors&&this.state.errors["deliver"]}
                                                            options={this.props.siteList}
                                                            option={"name"}
                                                            select={"Select"}
                                                            name={"deliver"} title="Delivery From"
                                                            native
                                                        />
                                                        <p className={"text-g"} style={{ marginTop: "10px" }}>

                                                            or <span
                                                                onClick={this.toggleSite}
                                                                className={
                                                                    "green-text forgot-password-link "
                                                                }>Add new</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row  justify-content-start ">
                                            <div className="col-6 ">
                                                <div
                                                    className={
                                                        "custom-label text-bold text-blue "
                                                    }>
                                                    Available From
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
                                                        onChange={(value)=>this.handleChange(value,"startDate")}

                                                    />
                                                </LocalizationProvider>

                                                {this.state.showFieldErrors&&this.state.startDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                            </div>

                                            <div className="col-6  ">

                                                <div
                                                    className={
                                                        "custom-label text-bold text-blue "
                                                    }>
                                                    Available By
                                                </div>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                    <MobileDatePicker
                                                        disableHighlightToday={true}

                                                        minDate={new Date()}
                                                        // label="Required By"
                                                        inputVariant="outlined"
                                                        variant={"outlined"}
                                                        margin="normal"
                                                        id="date-picker-dialog"
                                                        inputFormat="dd/MM/yyyy"
                                                        value={this.state.endDate}
                                                        // value={this.state.fields["endDate"]?this.state.fields["endDate"]:this.props.item&&this.props.item.campaign.end_ts}

                                                        renderInput={(params) => <CustomizedInput {...params} />}
                                                        onChange={(value)=>this.handleChange(value,"endDate")}

                                                    />
                                                </LocalizationProvider>
                                                {this.state.showFieldErrors&&this.state.endDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                            </div>
                                        </div>

                                        <div className="row no-gutters justify-content-start ">

                                        <div className="col-12 mb-3">
                                            <div className="row">
                                                <div className="col-md-6 col-sm-12 col-xs-12">
                                                    <div className="row mt-3">


                                                        <div className="col-md-12 col-sm-12 col-xs-12 mb-2">
                                                            <button
                                                                onClick={this.toggleSale}
                                                                className={
                                                                    !this.state.free
                                                                        ? "col-12 btn-select-free green-bg"
                                                                        : "btn-select-free"
                                                                }>
                                                                For Sale
                                                            </button>

                                                            <button
                                                                onClick={this.toggleFree}
                                                                className={
                                                                    this.state.free
                                                                        ? "col-12 btn-select-free green-bg"
                                                                        : "btn-select-free"
                                                                }>
                                                                Free
                                                            </button>
                                                        </div>

                                                        <div
                                                            style={{ paddingLeft: "0" }}
                                                            className="col-md-12 col-sm-12 col-xs-12 ">
                                                            {!this.state.free && (
                                                                <div className="col-12 mb-5">
                                                                    <TextFieldWrapper
                                                                        onChange={(value)=>this.handleChange(value,"price")}
                                                                        name={"price"}
                                                                        error={this.state.showFieldErrors&&this.state.errors["price"]}
                                                                        id="outlined-basic"

                                                                        rows={4}
                                                                        variant="outlined"
                                                                        fullWidth={true}
                                                                        title="Price"
                                                                    />
                                                                </div>
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
                        </div>

                        <div className={this.state.activeStep === 2 ? "" : "d-none"}>
                            <ItemDetailPreview
                                previewImage={this.state.previewImage}
                                site={this.state.siteSelected}
                                userDetail={this.props.userDetail}
                                item={this.state.fields}
                            />
                        </div>

                        <div className={this.state.activeStep === 3 ? "" : "d-none"}>
                            <div className="container   pb-4 pt-4">
                                <div className="row justify-content-center pb-2 pt-4 ">
                                    <div className="col-auto text-center">
                                        <h4 className={"green-text text-heading text-bold"}>
                                            Success!
                                        </h4>
                                    </div>
                                </div>

                                <div className="row justify-content-center">
                                    <div className="col-auto pb-4 pt-5">
                                        <img
                                            className={"search-icon-middle"}
                                            src={ProductBlue}
                                            alt=""
                                        />
                                    </div>
                                </div>

                                {this.state.listResourceData &&      <div className="row justify-content-center pb-4 pt-2 ">
                                    <div className="col-auto text-center">
                                        <Link

                                            to={"/"+this.state.listResourceData._key}
                                            onClick={this.handleNext}
                                            type="button"
                                            className={
                                                "btn-next shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2"
                                            }>
                                            View Listing
                                        </Link>

                                        <p className={"text-blue text-center"}>
                                            Your listing has been created. You will be notified when
                                            a match is found.
                                        </p>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>

                    {this.state.activeStep < 3 && (
                        <React.Fragment>
                            <div
                                position="fixed"
                                color="#ffffff"
                                className={ "custom-bottom-fixed-appbar  custom-bottom-appbar"}>

                                {this.state.activeStep < 3 && (
                                    <LinearProgress
                                        variant="determinate"
                                        value={this.state.progressBar}
                                    />
                                )}
                                <Toolbar>
                                    <div
                                        className="row  justify-content-center search-container "
                                        style={{ margin: "auto" }}>
                                        <div className="col-auto">
                                            {this.state.activeStep > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={this.handleBack}
                                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                    Back
                                                </button>
                                            )}
                                        </div>
                                        <div className="col-auto" style={{ margin: "auto" }}>
                                            <p className={"blue-text"}> Page {this.state.activeStep+1}/3</p>
                                        </div>
                                        <div className="col-auto">
                                            {this.state.activeStep < 2 && (
                                                <button
                                                    onClick={this.handleNext}
                                                    type="button"
                                                    className={
                                                        this.state.nextBlue
                                                            ? "btn-next shadow-sm mr-2  blue-btn-border   mt-2 mb-2 "
                                                            : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2"
                                                    }>
                                                    Next
                                                </button>
                                            )}

                                            {this.state.activeStep === 2 && (
                                                <button
                                                    onClick={this.handleNext}
                                                    type="button"
                                                    className={this.state.nextBlue
                                                            ? "btn-next shadow-sm mr-2  blue-btn-border   mt-2 mb-2  "
                                                            : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "
                                                    }>
                                                    Post Listing
                                                </button>
                                            )}






                                        </div>
                                    </div>
                                </Toolbar>
                            </div>
                        </React.Fragment>
                    )}

                    {this.state.showCreateSite && (
                        <>
                            <div className={"body-overlay"}>
                                <div className={"modal-popup site-popup"}>
                                    <div className=" text-right ">
                                        <Close
                                            onClick={this.toggleSite}
                                            className="blue-text"
                                            style={{ fontSize: 32 }}
                                        />
                                    </div>

                                    <div className={"row"}>
                                        <div className={"col-12"}>
                                            <EditSite site={{}} submitCallback={() => this.toggleSite()} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}


                {this.state.createListingError && (
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">
                                <Close
                                    onClick={this.goToStepOne}
                                    className="blue-text"
                                    style={{ fontSize: 32 }}
                                />
                            </div>

                            <div className={"row"}>
                                <div className={"col-12"}>
                                    {this.state.createListingError}
                                </div>
                                <div className={"col-12"}>
                                <button
                                    onClick={this.goToStepOne}
                                    type="button"
                                    className={
                                        "btn-next shadow-sm mr-2  blue-btn-border   mt-2 mb-2  "

                                    }>
                                    Edit Listing
                                </button>
                                </div>.
                            </div>
                        </div>
                    </div>
                )}

            </Layout>
        );
    }
}





const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        width: "100%",
        // minWidth: auto,
    },
    selectEmpty: {
        marginTop: theme.spacing(0),
    },
}));

function ComponentItem({ title, subTitle, serialNo, imageName }) {
    return (
        <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">
            <div className={"col-4"}>
                <img
                    className={"img-fluid"}
                    src={imageName}
                    alt=""
                    style={{ maxHeight: "140px", objectFit: "contain" }}
                />
            </div>
            <div className={"col-8 pl-3 content-box-listing"}>
                <p style={{ fontSize: "18px" }} className=" mb-1">
                    {title}
                </p>
                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                    {subTitle}
                </p>
                <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                    Serial No: {serialNo}
                </p>
            </div>
        </div>
    );
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
        showSubProductView: state.showSubProductView,
        showCreateProduct: state.showCreateProduct,
        showCreateSubProduct: state.showCreateSubProduct,
        showProductView: state.loginPopUpStatus,
        productList: state.productList,
        siteList: state.siteList,
        productWithoutParentNoList : state.productWithoutParentNoList ,

    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadProductsWithoutParentNoListing: (data) => dispatch(actionCreator.loadProductsWithoutParentNoListing(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(ListFormNew);
