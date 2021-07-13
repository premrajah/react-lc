import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import "../../Util/upload-file.css";
import { Cancel, Check, Error, Publish } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles/index";
import axios from "axios/index";
import { baseUrl, MIME_TYPES_ACCEPT } from "../../Util/Constants";
import FormHelperText from "@material-ui/core/FormHelperText";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddSite from "../../components/AddSite";
import EditSite from "../../components/Sites/EditSite";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

class ProductForm extends Component {

     INITIAL_VALUES = {
        title:  '',
         description:  '',
         sku:  '',
         brand:  '',
         type:  '',
         state:  '',
         category:  '',
         units:  '',
         deliver:  '',
         volume:  '',
         purpose:  '',
         condition:  '',
         upc:  '',
         manufacturedDate:  '',
         serial:  '',
         model:  '',
         part_no:'',
         is_listable:true


    }

     VALIDATION_SCHEMA = Yup.object().shape({
        title: Yup.string().required('Required'),
         description:  Yup.string().required('Required'),
         // sku:  '',
         brand:  Yup.string().required('Required'),
         category:  Yup.string().required('Required'),
         type:  Yup.string().required('Required'),
         state:  Yup.string().required('Required'),
         units:  Yup.string().required('Required'),
         deliver:  Yup.string().required('Required'),
         volume:  Yup.string().required('Required'),
         purpose:  Yup.string().required('Required'),
         condition:  Yup.array().required('Required'),

    })
    slug = null;

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
            filesStatus: [],
            free: false,
            price: null,

            brand: null,
            manufacturedDate: null,
            model: null,
            serial: null,
            startDate: null,
            endDate: null,
            images: [],
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
        };

        this.selectCategory = this.selectCategory.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectState = this.selectState.bind(this);

        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
        this.getFiltersCategories = this.getFiltersCategories.bind(this);
        this.selectSubCatType = this.selectSubCatType.bind(this);

        this.getProducts = this.getProducts.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
        this.getSites = this.getSites.bind(this);
        this.showSubmitSite = this.showSubmitSite.bind(this);
        this.checkListable = this.checkListable.bind(this);
        this.showMoreDetails = this.showMoreDetails.bind(this);
        this.phonenumber = this.phonenumber.bind(this);
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
                            axios.post(`${baseUrl}artifact/load?name=${imgFile.file.name}`, payload)
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

    handleValidationSite() {
        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }

        // if (!fields["others"]) {
        //     formIsValid = false;
        //     errors["others"] = "Required";
        // }

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
        if (fields["phone"] && !this.phonenumber(fields["phone"])) {
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

    checkListable() {
        this.setState({
            is_listable: !this.state.is_listable,
        });
    }

    showMoreDetails() {
        this.setState({
            moreDetail: !this.state.moreDetail,
        });
    }

    showSubmitSite() {
        this.setState({
            errorRegister: null,
        });

        this.setState({
            showSubmitSite: !this.state.showSubmitSite,
        });
    }

    handleSubmitSite = (event) => {
        this.setState({
            errorRegister: null,
        });

        event.preventDefault();

        if (this.handleValidationSite()) {
            const form = event.currentTarget;

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
                    // this.toggleSite()
                    // this.getSites()

                    this.props.loadSites(this.props.userDetail.token);

                    this.showSubmitSite();
                })
                .catch((error) => {});
        }
    };

    getSites() {
        axios
            .get(baseUrl + "site", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        sites: responseAll,
                    });
                },
                (error) => {}
            );
    }

    showProductSelection() {
        if (!this.props.parentProduct) {
            this.props.setProduct(this.state.product);
            this.props.setParentProduct(this.state.parentProduct);
        } else {
        }

        this.props.loadProducts(this.props.userDetail.token);
        this.props.loadProductsWithoutParent(this.props.userDetail.token);

        this.props.showProductPopUp({ type: "sub_product_view", show: true });
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

    getProducts() {
        axios
            .get(baseUrl + "product", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        products: responseAll,
                    });
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    handleValidationProduct2() {
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

        if (!fields["type"]) {
            formIsValid = false;
            errors["type"] = "Required";
        }

        if (!fields["state"]) {
            formIsValid = false;
            errors["state"] = "Required";
        }

        if (!fields["deliver"]) {
            formIsValid = false;
            errors["deliver"] = "Required";
        }

        if (!fields["units"]) {
            formIsValid = false;
            errors["units"] = "Required";
        }

        if (!fields["volume"]) {
            formIsValid = false;
            errors["volume"] = "Required";
        }

        if (!fields["manufacturedDate"]) {
            formIsValid = false;
            errors["manufacturedDate"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {
            if (!fields["category"]) {
                formIsValid = false;
                errors["category"] = "Required";
            }

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

    handleValidationProduct() {
        let fields = this.state.fieldsProduct;
        let errors = {};
        let formIsValid = true;


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

        if (!fields["type"]) {
            formIsValid = false;
            errors["type"] = "Required";
        }

        if (!fields["state"]) {
            formIsValid = false;
            errors["state"] = "Required";
        }

        if (!fields["deliver"]) {
            formIsValid = false;
            errors["deliver"] = "Required";
        }

        if (!fields["units"]) {
            formIsValid = false;
            errors["units"] = "Required";
        }

        if (!fields["volume"]) {
            formIsValid = false;
            errors["volume"] = "Required";
        }

        if (!fields["brand"]) {
            formIsValid = false;
            errors["brand"] = "Required";
        }

        // if (!fields["manufacturedDate"]) {
        //     formIsValid = false;
        //     errors["manufacturedDate"] = "Required";
        // }

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

    handleChangeProduct(field, event) {
        let fields = this.state.fieldsProduct;
        fields[field] = event.target.value;
        this.setState({ fields });

        if (field === "category") {
            if (event.target.value !== "Select") {
                var catSelected = this.state.categories.filter(
                    (item) => item.name === event.target.value
                )[0];

                var subCategories = this.state.categories.filter(
                    (item) => item.name === event.target.value
                )[0].types;

                this.setState({
                    catSelected: catSelected,
                });

                this.setState({
                    subCategories: subCategories,
                });
            } else {
                this.setState({
                    catSelected: null,
                });

                this.setState({
                    subCategories: [],
                });
            }
        }

        if (field === "type") {
            if (event.target.value !== "Select") {
                var subCatSelected = this.state.subCategories.filter(
                    (item) => item.name === event.target.value
                )[0];

                var states = this.state.subCategories.filter(
                    (item) => item.name === event.target.value
                )[0].state;

                var units = this.state.subCategories.filter(
                    (item) => item.name === event.target.value
                )[0].units;

                this.setState({
                    subCatSelected: subCatSelected,
                });

                this.setState({
                    states: states,
                    units: units,
                });
            } else {
                this.setState({
                    subCatSelected: null,
                });

                this.setState({
                    states: [],
                    units: [],
                });
            }
        }
    }

    handleSubmit = (values) =>{

        // alert("submit")
        console.log((values))

    }

    handleSubmitProduct = (event) => {
        event.preventDefault();



        alert("submit")
        if (this.handleValidationProduct()) {
            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);

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

            // const site=data.get("deliver")

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
                is_listable: this.state.is_listable,
                // "stage" : "certified",
                sku: {
                    serial: serial,
                    model: model,
                    brand: brand,
                    sku: sku,
                    upc: upc,
                    part_no: part_no,
                },

                year_of_making: data.get("manufacturedDate"),
            };

            var completeData;

            if (this.props.parentProduct) {
                completeData = {
                    product: productData,
                    sub_products: [],
                    artifact_ids: this.state.images,
                    site_id: data.get("deliver"),
                    parent_product_id: this.props.parentProduct,
                };
            } else {
                completeData = {
                    product: productData,
                    sub_products: [],
                    // "sub_product_ids": [],
                    artifact_ids: this.state.images,
                    parent_product_id: null,
                    site_id: data.get("deliver"),
                };
            }

            this.setState({isSubmitButtonPressed: true})

            axios
                .put(
                    baseUrl + "product",

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

                    this.showProductSelection();

                    this.props.loadProducts(this.props.userDetail.token);
                    this.props.loadProductsWithoutParent();
                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                });

        }
    };

    getFiltersCategories() {
        axios
            .get(baseUrl + "category", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = _.sortBy(response.data.data, ["name"]);

                    this.setState({
                        categories: responseAll,
                    });
                },
                (error) => {}
            );
    }

    selectCategory() {
        this.setState({
            activePage: 1,
        });
    }

    selectProduct(event) {
        this.setState({
            productSelected: this.state.products.filter(
                (item) => item.title === event.currentTarget.dataset.name
            )[0],
        });

        this.setState({
            activePage: 5,
        });
    }

    selectType(event) {
        this.setState({
            catSelected: this.state.categories.filter(
                (item) => item.name === event.currentTarget.dataset.name
            )[0],
        });

        this.setState({
            subCategories: this.state.categories.filter(
                (item) => item.name === event.currentTarget.dataset.name
            )[0].types,
        });

        this.setState({
            activePage: 2,
        });
    }

    selectSubCatType(event) {
        this.setState({
            subCatSelected: this.state.subCategories.filter(
                (item) => event.currentTarget.dataset.name === item.name
            )[0],
        });

        this.setState({
            activePage: 3,
            states: this.state.subCategories.filter(
                (item) => event.currentTarget.dataset.name === item.name
            )[0].state,
        });
    }

    selectState(event) {
        this.setState({
            stateSelected: event.currentTarget.dataset.name,
        });

        this.setState({
            activePage: 0,

            units: this.state.subCatSelected.units,
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getFiltersCategories();

        this.setUpYearList();

        this.props.loadSites(this.props.userDetail.token);
    }

    classes = useStylesSelect;

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                <div className="row   pt-2 ">
                    <div className="col-12  ">
                        <h3 className={"blue-text text-heading"}>{this.props.heading}</h3>
                    </div>
                </div>

                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-12"}>
                        <Formik
                            initialValues={{...this.INITIAL_VALUES}}
                            validationSchema={this.VALIDATION_SCHEMA}
                            onSubmit={(values) => this.handleSubmit(values) }>
                            {({ errors,values, touched,setFieldValue }) => (
                            <Form>


                            <div className="row no-gutters">
                                <div className="col-12 mt-4">

                                   <TextFieldWrapper error={errors.title} name="title" title="Give your product a title" />

                                </div>
                            </div>

                            <div className="row  mt-4">
                                <div className="col-md-4 col-sm-12  justify-content-start align-items-center">

                                    <CheckboxWrapper onChange={this.checkListable} color="primary" name={"is_listable"} title="Allow product to be listed for sale" />
                                    {/*<FormControlLabel*/}
                                    {/*    control={*/}
                                    {/*        <Checkbox*/}
                                    {/*            checked={this.state.is_listable}*/}
                                    {/*            onChange={this.checkListable}*/}
                                    {/*            name="is_listable"*/}
                                    {/*            color="primary"*/}
                                    {/*        />*/}
                                    {/*    }*/}
                                    {/*    label="Allow product to be listed for sale"*/}
                                    {/*/>*/}
                                </div>

                                <div className="col-md-4 col-sm-12">

                                    <SelectArrayWrapper
                                        defaultValue={values.condition}
                                                        handleChange={(value)=> {
                                                            setFieldValue('condition', value);

                                                        }}
                                                        options={this.state.condition} name={"condition"} title="Condition"/>

                                </div>

                                <div className="col-md-4 col-sm-12">

                                    <TextFieldWrapper  name="brand" title="Brand" />

                                </div>
                            </div>

                            <div className="row mt-4">


                                <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                    <SelectArrayWrapper
                                        select={"Select"}
                                        defaultValue={values.category}
                                        handleChange={(value)=> {
                                            setFieldValue('category',value);
                                            this.setState({
                                        catSelected:   this.state.categories.filter(
                                            (item) => item.name === value
                                        )[0],

                                        subCategories:this.state.categories.filter(
                                            (item) => item.name === value
                                        )[0].types,
                                        states: [],
                                        units: [],

                                    })
                                    }}
                                       options={this.state.categories} name={"category"} title="Resource Category"/>

                                </div>

                                <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                    <SelectArrayWrapper
                                        select={"Select"}

                                        defaultValue={values.type}
                                        handleChange={(value)=> {
                                            setFieldValue('type',value);
                                            this.setState({
                                            subCatSelected:   this.state.subCategories.filter(
                                                (item) => item.name === value
                                            )[0],

                                            states:this.state.subCategories.filter(
                                                (item) => item.name === value
                                            )[0].state,
                                            units:this.state.subCategories.filter(
                                                (item) => item.name === value
                                            )[0].units


                                        })
                                        }}

                                        disabled={
                                        this.state.subCategories.length > 0 ? false : true
                                    } options={this.state.subCategories} name={"type"} title="Type"/>

                                </div>

                                <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                    <SelectArrayWrapper
                                        defaultValue={values.state}
                                        handleChange={(value)=> {
                                            setFieldValue('state', value);

                                        }}
                                        select={"Select"}
                                        disabled={this.state.states.length > 0 ? false : true}
                                        options={this.state.states} name={"state"} title="State"/>

                                </div>
                            </div>

                            <div className="row no-gutters mt-4">
                                <div className="col-12">
                                    <div className="row no-gutters justify-content-center ">
                                        <div className="col-12 ">
                                            <div
                                                className={"custom-label text-bold text-blue mb-1"}>
                                                Quantity
                                            </div>
                                        </div>

                                        <div className="col-6 pr-2">
                                            <SelectArrayWrapper
                                                defaultValue={values.units}
                                                handleChange={(value)=> {
                                                    setFieldValue('units', value);

                                                }}

                                                disabled={this.state.units.length > 0 ? false : true}
                                                options={this.state.units} name={"units"} title="(Units)"/>
                                        </div>
                                        <div className="col-6 pl-2">

                                            <TextFieldWrapper  name="volume" title="(Volume)" />

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row no-gutters mt-4">
                                <div className="col-12">
                                    <div className="row camera-grids   no-gutters   ">
                                        <div className="col-md-6 col-sm-12 col-xs-12 pr-2 ">
                                            <SelectArrayWrapper
                                                defaultValue={values.purpose}
                                                handleChange={(value)=> {
                                                    setFieldValue('purpose', value);

                                                }}
                                                select={"Select"} options={this.state.purpose} name={"purpose"} title="Purpose"/>

                                        </div>

                                        <div className="col-md-6 col-sm-12 col-xs-12 pl-2">

                                            <SelectArrayWrapper
                                                defaultValue={values.deliver}
                                                                handleChange={(value)=> {
                                                                    setFieldValue('deliver', value);

                                                                }} select={"Select"} options={this.props.siteList} name={"deliver"} title="Dispatch / Collection Address"/>


                                            <p style={{ margin: "10px 0" }}>
                                                <span className="mr-1">Do not see your address?</span>
                                                <span
                                                    onClick={this.showSubmitSite}
                                                    className={
                                                        "green-text forgot-password-link text-mute small"
                                                    }>
                                                    {this.state.showSubmitSite
                                                        ? "Hide add site"
                                                        : "Add a site"}
                                                </span>
                                            </p>

                                            {this.state.showSubmitSite && (
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
                                                                <EditSite site={{}} submitCallback={() => this.showSubmitSite()} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row no-gutters mt-4">
                                <div className="col-12">

                                    <TextFieldWrapper multiline
                                                      rows={4} name="description" title="Give it a description" />


                                </div>
                            </div>

                            <div className="row no-gutters mt-2">
                                <div className="col-12 text-left">
                                    <span style={{ margin: "10px 0", float: "left" }}>
                                        <span
                                            onClick={this.showMoreDetails}
                                            className={
                                                "green-text forgot-password-link text-mute small"
                                            }>
                                            {this.state.moreDetail
                                                ? "Hide Details"
                                                : "Add More details"}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {this.state.moreDetail && (
                                <>
                                    <div className="col-12 mt-4">
                                        <div className="row">
                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <SelectArrayWrapper
                                                    defaultValue={values.manufacturedDate}
                                                    handleChange={(value)=> {
                                                        setFieldValue('manufacturedDate', value);

                                                    }}
                                                    options={this.state.yearsList} name={"manufacturedDate"} title="Year Of Manufacture"/>



                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">


                                                <TextFieldWrapper  name="model" title="Model" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  name="serial" title="Serial Number" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  name="sku" title="Sku" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  name="upc" title="UPC" />

                                            </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper  name="part_no" title="Part No." />

                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="col-12 mt-4">
                                <div className={"custom-label text-bold text-blue mb-3"}>
                                    Add Photos or Documents
                                </div>

                                <div className="container-fluid  pb-5 ">
                                    <div className="row camera-grids   no-gutters   ">
                                        <div className="col-12  text-left ">
                                            <div className="">
                                                <div className={""}>
                                                    {/*<img src={CameraGray} className={"camera-icon-preview"}/>*/}

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
                                                                        <div key={index}
                                                                            className={
                                                                                "file-uploader-thumbnail-container"
                                                                            }>
                                                                            {/*<img src={URL.createObjectURL(item)}/>*/}
                                                                            <div
                                                                                data-index={index}
                                                                                // data-url={URL.createObjectURL(item.file)}

                                                                                className={
                                                                                    "file-uploader-thumbnail"
                                                                                }
                                                                                style={{
                                                                                    backgroundImage:
                                                                                        "url(" +
                                                                                        URL.createObjectURL(
                                                                                            item.file
                                                                                        ) +
                                                                                        ")",
                                                                                }}>
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
                                                                                        item.file
                                                                                            .name
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

                            <div className="col-12 mt-4 mb-5">
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
                                            Add Product
                                        </button>
                                    )
                                ) : (
                                    <button
                                        type={"submit"}
                                        className={
                                            "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                        }
                                        disabled={this.state.isSubmitButtonPressed}>
                                        Add Product
                                    </button>
                                )}
                            </div>
                            </Form>
                            )}

                        </Formik>
                    </div>
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
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductForm);
