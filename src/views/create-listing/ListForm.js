import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Close from "@mui/icons-material/Close";
import "../../Util/upload-file.css";
import {makeStyles} from "@mui/styles";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import TextField from "@mui/material/TextField";
import clsx from "clsx";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import LinearProgress from "@mui/material/LinearProgress";
import ProductBlue from "../../img/icons/product-blue.png";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import ItemDetailPreview from "../../components/ItemDetailPreview";
import ProductTreeView from "../../components/ProductTreeView";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MobileDatePicker from '@mui/lab/MobileDatePicker';


import PageHeader from "../../components/PageHeader";
import EditSite from "../../components/Sites/EditSite";
import ProductItem from "../../components/Products/Item/ProductItem";
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";


class ListForm extends Component {
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
            createListingError:null
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

    handleNext() {
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

    handleChange(field, e) {
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

    handleValidateOne() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let formIsValid = true;

        if (!fields["title"]) {
            formIsValid = false;
            errors["title"] = "Required";
        }

        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Required";
        }

        // if (!this.state.selectedProductId) {
        //     formIsValid = false;
        //     errors["product"] = "Required";
        // }

        if (!fields["product"]) {
            formIsValid = false;
            errors["product"] = "Required";
        }

        this.setState({
            nextBlue: formIsValid,
            errors: errors,
        });

        return formIsValid;
    }

    handleValidateTwo() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let formIsValid = true;

        if (!fields["deliver"]) {
            formIsValid = false;
            errors["deliver"] = "Required";
        }

        if (!fields["startDate"]) {
            formIsValid = false;
            errors["startDate"] = "Required";
        }

        if (!fields["endDate"]) {
            formIsValid = false;
            errors["endDate"] = "Required";
        }

        if (!this.state.free) {
            if (!fields["price"]) {
                formIsValid = false;
                errors["price"] = "Required";
            }
        }

        this.setState({
            nextBlueAddDetail: formIsValid,
            errors: errors,
        });

        return formIsValid;
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

        axios
            .put(
                baseUrl + "listing",
                {
                    listing: data,
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

                // this.props.history.push("/"+res.data.data._key)
            })
            .catch((error) => {


                if (error&&error.response&&error.response.status){

                    this.setState({
                        notFoundError:true,
                        createListingError:"some error"
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

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader pageTitle="New Listing" />

                        <div className={this.state.page === 1 ? "" : "d-none"}>
                            <div className="row add-listing-container   pb-5 pt-2">
                                <div className={"col-12"}>
                                    <div onSubmit={this.createListing} className={"mb-5"}>
                                        <div className="row no-gutters justify-content-center mt-2">
                                            <div className="col-12">
                                                <div
                                                    className={
                                                        "custom-label text-bold text-blue mb-1"
                                                    }>
                                                    Title
                                                </div>

                                                <TextField
                                                    onChange={this.handleChange.bind(this, "title")}
                                                    name={"title"}
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    fullWidth={true}
                                                />
                                                {this.state.errors["title"] && (
                                                    <span className={"text-mute small"}>
                                                        <span style={{ color: "red" }}>* </span>
                                                        {this.state.errors["title"]}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="col-12 mt-4">
                                                <div
                                                    className={
                                                        "custom-label text-bold text-blue mb-1"
                                                    }>
                                                    Description
                                                </div>

                                                <TextField
                                                    onChange={this.handleChange.bind(
                                                        this,
                                                        "description"
                                                    )}
                                                    name={"description"}
                                                    id="outlined-basic"
                                                    multiline
                                                    rows={4}
                                                    variant="outlined"
                                                    fullWidth={true}
                                                />
                                                {this.state.errors["description"] && (
                                                    <span className={"text-mute small"}>
                                                        <span style={{ color: "red" }}>* </span>
                                                        {this.state.errors["description"]}
                                                    </span>
                                                )}
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
                                                            triggerCallback={(productId) =>
                                                                this.productSelected(productId)
                                                            }
                                                            className={"mb-4"}
                                                        />
                                                        }
                                                    </div>
                                                    <div className="col-8  mt-5 pt-2">

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

                                                <TextField
                                                    value={this.state.selectedProductId}
                                                    className={"d-none"}
                                                    onChange={this.handleChange.bind(
                                                        this,
                                                        "product"
                                                    )}
                                                    name={"product"}
                                                    placeholder={"product"}
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    fullWidth={true}
                                                />

                                                {this.state.errors["product"] && (
                                                    <span className={"text-mute small"}>
                                                        <span style={{ color: "red" }}>* </span>
                                                        {this.state.errors["product"]}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.page === 2 ? "" : "d-none"}>
                            <div className="row add-listing-container   pb-5 pt-2">
                                <div className={"col-12"}>
                                    <div className="row no-gutters">
                                        <div className="col-auto">
                                            <h5 className={" text-heading"}>Add Details</h5>
                                        </div>
                                    </div>

                                    <div onSubmit={this.createListing} className={"mb-5"}>
                                        <div className="row no-gutters justify-content-center mt-2">
                                            <div className="col-12 mt-4">
                                                <div className="row ">
                                                    <div className="col-md-12 col-sm-6 col-xs-12 ">
                                                        <div
                                                            className={
                                                                "custom-label text-bold text-blue mb-1"
                                                            }>
                                                            Located At
                                                        </div>

                                                        <FormControl
                                                            variant="outlined"
                                                            className={classes.formControl}>
                                                            {/*<InputLabel htmlFor="outlined-age-native-simple">Located At</InputLabel>*/}
                                                            <Select
                                                                name={"deliver"}
                                                                native
                                                                // label="Located At"
                                                                onChange={this.handleChange.bind(
                                                                    this,
                                                                    "deliver"
                                                                )}
                                                                inputProps={{
                                                                    name: "deliver",
                                                                    id:
                                                                        "outlined-age-native-simple",
                                                                }}>
                                                                <option value={null}>Select</option>

                                                                {this.props.siteList.map((item) => (
                                                                    <option value={item._key}>
                                                                        {item.name +
                                                                        "(" +
                                                                        item.address +
                                                                        ")"}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>

                                                        {this.state.errors["deliver"] && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.errors["deliver"]}
                                                            </span>
                                                        )}

                                                        <p
                                                            style={{ margin: "10px 0" }}
                                                            onClick={this.toggleSite}
                                                            className={
                                                                "green-text forgot-password-link text-mute small"
                                                            }>
                                                            Add New Site
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row no-gutters justify-content-center mt-5">
                                            <div className="col-12 mb-3">
                                                <div className="row ">
                                                    <div className="col-6 ">
                                                        <div
                                                            className={
                                                                "custom-label text-bold text-blue "
                                                            }>
                                                            Required From
                                                        </div>

                                                        {/*<MuiPickersUtilsProvider*/}
                                                        {/*    utils={MomentUtils}>*/}
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                            <MobileDatePicker
                                                                minDate={new Date()}
                                                                // label="Required By"
                                                                inputVariant="outlined"
                                                                variant={"outlined"}
                                                                margin="normal"
                                                                id="date-picker-dialog"
                                                                label="Available From"
                                                                format="DD/MM/yyyy"
                                                                value={this.state.startDate}
                                                                onChange={this.handleChangeDateStartDate.bind(
                                                                    this
                                                                )}

                                                                renderInput={(params) => <CustomizedInput {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                        {/*</MuiPickersUtilsProvider>*/}

                                                        {this.state.errors["startDate"] && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.errors["startDate"]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="col-6 ">
                                                        <div
                                                            className={
                                                                "custom-label text-bold text-blue "
                                                            }>
                                                            Required By
                                                        </div>

                                                        {/*<MuiPickersUtilsProvider*/}
                                                        {/*    utils={MomentUtils}>*/}

                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                            <MobileDatePicker
                                                                minDate={
                                                                    this.state.startDate
                                                                        ? this.state.startDate
                                                                        : new Date()
                                                                }
                                                                // label="Required By"
                                                                inputVariant="outlined"
                                                                variant={"outlined"}
                                                                margin="normal"
                                                                id="date-picker-dialog"
                                                                label="End Date "
                                                                format="DD/MM/yyyy"
                                                                value={this.state.endDate}
                                                                onChange={this.handleChangeDateEndDate.bind(
                                                                    this
                                                                )}
                                                                renderInput={(params) => <CustomizedInput {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                        {/*</MuiPickersUtilsProvider>*/}

                                                        {this.state.errors["endDate"] && (
                                                            <span className={"text-mute small"}>
                                                                <span style={{ color: "red" }}>
                                                                    *
                                                                </span>
                                                                {this.state.errors["endDate"]}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 mb-3">
                                                <div className="row">
                                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                                        <div className="row">
                                                            <div className="col-md-12 col-sm-12 col-xs-12 mb-3">
                                                                <div
                                                                    className={
                                                                        "custom-label text-bold text-blue "
                                                                    }>
                                                                    Price
                                                                </div>
                                                            </div>

                                                            <div className="col-md-12 col-sm-12 col-xs-12 mb-3">
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
                                                                        <TextField
                                                                            name={"price"}
                                                                            type={"number"}
                                                                            onChange={this.handleChange.bind(
                                                                                this,
                                                                                "price"
                                                                            )}
                                                                            id="input-with-icon-textfield"
                                                                            label="£"
                                                                            variant="outlined"
                                                                            className={
                                                                                clsx(
                                                                                    classes.margin,
                                                                                    classes.textField
                                                                                ) +
                                                                                " full-width-field"
                                                                            }
                                                                            id="input-with-icon-textfield"
                                                                        />

                                                                        {this.state.errors[
                                                                            "price"
                                                                            ] && (
                                                                            <span
                                                                                className={
                                                                                    "text-mute small"
                                                                                }>
                                                                                <span
                                                                                    style={{
                                                                                        color:
                                                                                            "red",
                                                                                    }}>
                                                                                    *
                                                                                </span>
                                                                                {
                                                                                    this.state
                                                                                        .errors[
                                                                                        "price"
                                                                                        ]
                                                                                }
                                                                            </span>
                                                                        )}
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

                        <div className={this.state.page === 3 ? "" : "d-none"}>
                            <ItemDetailPreview
                                previewImage={this.state.previewImage}
                                site={this.state.siteSelected}
                                userDetail={this.props.userDetail}
                                fields={this.state.fields}
                            />
                        </div>

                        <div className={this.state.page === 4 ? "" : "d-none"}>
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

                                <div className="row justify-content-center pb-4 pt-2 ">
                                    <div className="col-auto text-center">
                                        <button
                                            onClick={this.handleNext}
                                            type="button"
                                            className={
                                                "btn-next shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2"
                                            }>
                                            View Listing
                                        </button>

                                        <p className={"text-blue text-center"}>
                                            Your listing has been created. You will be notified when
                                            a match is found.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.state.page < 4 && (
                        <React.Fragment>
                            <div
                                position="fixed"
                                color="#ffffff"
                                className={ "custom-bottom-fixed-appbar  custom-bottom-appbar"}>

                                {this.state.page < 4 && (
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
                                            {this.state.page > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={this.handleBack}
                                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                    Back
                                                </button>
                                            )}
                                        </div>
                                        <div className="col-auto" style={{ margin: "auto" }}>
                                            <p className={"blue-text"}> Page {this.state.page}/3</p>
                                        </div>
                                        <div className="col-auto">
                                            {this.state.page < 3 && (
                                                <button
                                                    onClick={this.handleNext}
                                                    type="button"
                                                    className={
                                                        (this.state.nextBlue &&
                                                            this.state.page === 1) ||
                                                        (this.state.page === 2 &&
                                                            this.state.nextBlueAddDetail)
                                                            ? "btn-next shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2"
                                                            : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2"
                                                    }>
                                                    Next
                                                </button>
                                            )}

                                            {this.state.page === 3 && (
                                                <button
                                                    onClick={this.handleNext}
                                                    type="button"
                                                    className={
                                                        this.state.nextBlueAddDetail
                                                            ? "btn-next shadow-sm mr-2 btn btn-link blue-btn       mt-2 mb-2 "
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
                </div>
            </>
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
export default connect(mapStateToProps, mapDispachToProps)(ListForm);
