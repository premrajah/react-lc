import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Select from "@mui/material/Select";
import Close from "@mui/icons-material/Close";
import {makeStyles} from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import TextField from "@mui/material/TextField";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import _ from "lodash";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DatePicker from '@mui/lab/DatePicker';

import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import EditSite from "../Sites/EditSite";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";

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

class SearchEditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            item: null,
            count: 0,
            loading: false,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
            categories: [],
            subCategories: [],
            catSelected: null,
            subCatSelected: null,
            stateSelected: null,
            states: [],
            sites: [],
            page: 1,
            fields: {},
            errors: {},
            fieldsProduct: {},
            errorsProduct: {},
            fieldsSite: {},
            errorsSite: {},
            units: [],
            progressBar: 33,

            productSelected: null,

            matches: [],
            unitSelected: null,
            volumeSelected: null,
            title: null,
            description: null,
            volume: null,
            createSearchData: null,
            searchObj: null,
            resourcesMatched: [],
            showCreateSite: false,
            siteSelected: null,
            productSelection: false,
            purpose: ["defined", "prototype", "aggregate"],
            site: {},
            dateRequiredBy: null,
            dateRequiredFrom: null,
            free: false,
            price: null,
        };

        this.selectCreateSearch = this.selectCreateSearch.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectState = this.selectState.bind(this);
        this.addDetails = this.addDetails.bind(this);
        this.linkProduct = this.linkProduct.bind(this);
        this.searchLocation = this.searchLocation.bind(this);
        this.previewSearch = this.previewSearch.bind(this);
        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
        this.getFiltersCategories = this.getFiltersCategories.bind(this);
        this.selectSubCatType = this.selectSubCatType.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
        // this.handleDateChange = this.handleDateChange.bind(this)
        // this.createSearch = this.createSearch.bind(this);
        this.showCreateSite = this.showCreateSite.bind(this);
        this.getSites = this.getSites.bind(this);
        this.getSite = this.getSite.bind(this);
        this.toggleSite = this.toggleSite.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
        this.toggleDateOpen = this.toggleDateOpen.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.makeActive = this.makeActive.bind(this);
        this.goToSearchPage = this.goToSearchPage.bind(this);
        this.getSearch = this.getSearch.bind(this);
        this.triggerCallback = this.triggerCallback.bind(this);

        this.phonenumber = this.phonenumber.bind(this);
    }

    phonenumber(inputtxt) {
        var phoneno = /((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/g;
        if (inputtxt.match(phoneno)) {
            return true;
        } else {
            return false;
        }
    }



    getSearch() {
        axios
            .get(baseUrl + "search/" + this.props.searchId + "/expand", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data.data;

                    this.setState({
                        item: responseData,
                    });

                    // this.loadSelection();
                },
                (error) => {
                    this.setState({
                        notFound: true,
                    });
                }
            );
    }

    triggerCallback(event) {
        this.props.triggerCallback();
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

    showSubmitSite=()=> {
        this.setState({
            errorRegister: null,
        });

        this.setState({
            showSubmitSite: !this.state.showSubmitSite,
        });
    }



    toggleDateOpen() {
        this.setState({
            requiredDateOpen: true,
        });
    }

    toggleDateClose() {
        this.setState({
            requiredDateOpen: false,
        });
    }

    makeActive(event) {
        var active = event.currentTarget.dataset.active;

        this.setState({
            active: parseInt(active),
        });
    }

    getProducts() {
        axios.get(baseUrl + "product").then(
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

    getSite() {
        axios.get(baseUrl + "site/" + this.state.siteSelected).then(
            (response) => {
                var responseAll = response.data;

                this.setState({
                    site: responseAll,
                });
            },
            (error) => {
                var status = error.response.status;
            }
        );
    }

    getSites() {
        this.props.loadSites(this.props.userDetail.token);
    }

    toggleSite() {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
    }


    handleValidationSearch=()=>{


        let fields = this.state.fields;




        let validations=[
            validateFormatCreate("title", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("volume", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'This field should be a number.'}],fields),
            validateFormatCreate("category", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("type", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("state", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("deliver", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("units", [{check: Validators.required, message: 'Required'}],fields),

        ]


        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
        return formIsValid;

    }



    handleSubmit=(event)=> {
        event.preventDefault();


        if (!this.handleValidationSearch()){

            return

        }


        const dataFORM = new FormData(event.target);

        // this.triggerCallback()

        var data = {
            id: this.props.item.search._key,
            update: {
                name: dataFORM.get("title"),
                description: dataFORM.get("description"),
                category: dataFORM.get("category"), //this.state.catSelected.name,
                type: dataFORM.get("type"),
                units: dataFORM.get("units"),
                volume: dataFORM.get("volume"),
                state: dataFORM.get("state"),
                require_after_epoch_ms: new Date(this.state.dateRequiredFrom).getTime(),
                expire_after_epoch_ms: new Date(this.state.dateRequiredBy).getTime(),

                // "require_after_epoch_ms":  new Date(dataFORM.get("dateRequiredFrom")).getTime(),
                // "expire_after_epoch_ms":  new Date(dataFORM.get("dateRequiredBy")).getTime(),
            },
            "site_id": dataFORM.get("deliver"),
            "product_id":dataFORM.get("product")
        };

        console.log(data)

        axios
            .post(baseUrl + "search", data, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {
                // this.triggerCallback();
                this.updateProduct(this.props.item.search._key,dataFORM.get("product"))
                this.updateSite(this.props.item.search._key,dataFORM.get("deliver"))


                this.getSite();
            })
            .catch((error) => {});
    }

updateSite=(search,site)=>{

    axios
        .post(baseUrl + "search/site", {"id":search,site_id:site}, {
            headers: {
                Authorization: "Bearer " + this.props.userDetail.token,
            },
        })
        .then((res) => {
            this.triggerCallback();

            // this.setState({
            //     // createSearchData: res.data.data,
            //     item:res.data.data,
            // })

        })
        .catch((error) => {});

}

    updateProduct=(search,product)=>{

        axios
            .post(baseUrl + "search/product", {"id":search,product_id:product}, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {

                // this.setState({
                //     // createSearchData: res.data.data,
                //     item:res.data.data,
                // })

                this.getSite();
            })
            .catch((error) => {});

    }

    goToSearchPage() {
        this.props.history.push("/search/" + this.state.searchObj._key);
    }



    getFiltersCategories() {
        this.setState({
            loading:false
        })

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

                        this.setState({
                            subCategories:responseAll.find((item) => item.name === this.props.item.search.category)&&responseAll.find((item) => item.name === this.props.item.search.category).types,
                            states : responseAll.find((item) => item.name === this.props.item.search.category)&&responseAll.find((item) => item.name === this.props.item.search.category).types.find((item) => item.name === this.props.item.search.type).state,
                            units :responseAll.find((item) => item.name === this.props.item.search.category)&&responseAll.find((item) => item.name === this.props.item.search.category).types.find((item) => item.name === this.props.item.search.type).units
                        })

                    }




                },
                (error) => {}
            );
    }

    selectCreateSearch() {
        this.setState({
            active: 0,
            page: 1,
        });
    }

    selectCategory() {
        this.setState({
            active: 1,
        });
    }

    selectProduct(event) {
        this.setState({
            productSelected: this.state.products.filter(
                (item) => item.title === event.currentTarget.dataset.name
            )[0],
        });

        this.setState({
            active: 4,
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
            active: 2,
        });
    }

    selectSubCatType(event) {
        this.setState({
            subCatSelected: this.state.subCategories.filter(
                (item) => event.currentTarget.dataset.name === item.name
            )[0],
        });

        this.setState({
            active: 3,
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
            active: 0,

            units: this.state.subCatSelected.units,
        });
    }

    handleDateChange() {}

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
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

        if (!this.isNumeric(fields["volume"])) {
            formIsValid = false;
            errors["volume"] = "Invalid Input";
        } else {
            this.setState({
                volumeSelected: fields["volume"],
            });
        }

        if (!this.state.catSelected) {
            formIsValid = false;
            errors["category"] = "Required";
        }

        if (!this.state.subCatSelected) {
            formIsValid = false;
            errors["type"] = "Required";
        }

        if (!this.state.stateSelected) {
            formIsValid = false;
            errors["state"] = "Required";
        }

        if (!fields["unit"]) {
            formIsValid = false;
            errors["unit"] = "Required";
        } else {
            this.setState({
                unitSelected: fields["unit"],
            });
        }

        this.setState({ errors: errors });

        return formIsValid;
    }

    showCreateSite() {}

    handleValidationDetail() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["title"]) {
            formIsValid = false;
            errors["title"] = "Required";
        }
        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }

        if (!fields["volume"]) {
            formIsValid = false;
            errors["volume"] = "Required";
        }
        // if(!fields["unit"]){
        //     formIsValid = false;
        //     errors["unit"] = "Required";
        // }

        // if (this.state.catSelected.name && this.state.subCatSelected.name && this.state.stateSelected) {
        //
        //
        // } else {
        //
        //
        //     formIsValid = false;
        //     errors["category"] = "Required";
        //
        // }

        this.setState({ errors: errors });
        return formIsValid;
    }


    handleValidationAddDetail() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
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

        // if (!this.state.productSelected) {
        //     formIsValid = false;
        //     errors["product"] = "Required";
        // }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleValidationAddDetailNextColor() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["deliver"]) {
            formIsValid = false;
            errors["deliver"] = "Required";
        } else {
            this.setState({
                siteSelected: fields["deliver"],
            });
        }

        if (!fields["startDate"]) {
            formIsValid = false;
            errors["startDate"] = "Required";
        }

        if (!this.state.productSelected) {
            formIsValid = false;
            errors["product"] = "Required";
        }

        this.setState({
            nextBlueAddDetail: formIsValid,
        });
    }

    handleChangeDateStartDate = (date) => {
        this.setState({
            dateRequiredFrom: date,
        });

        let fields = this.state.fields;
        fields["startDate"] = date;

        this.setState({ fields });
    };

    handleChangeDate = (date) => {
        this.setState({
            dateRequiredBy: date,
        });

        let fields = this.state.fields;
        fields["endDate"] = date;

        this.setState({ fields });
    };

    handleChange(field, event) {

    }

    addDetails() {
        this.setState({
            active: 4,
        });
    }


    handleChangeProduct(value,field ) {

        // console.log(field,value)
        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }


    linkProduct() {
        this.getProducts();

        this.setState({
            active: 5,
        });
    }

    searchLocation() {
        this.setState({
            active: 6,
        });
    }

    previewSearch() {
        this.setState({
            active: 7,
        });
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.loadProducts(this.props.userDetail.token);


        this.setState({

            dateRequiredFrom:this.props.item.search.require_after_epoch_ms,
            dateRequiredBy:this.props.item.search.expire_after_epoch_ms
        })

        this.getFiltersCategories();
        this.getSites();
        this.setState({
            loading:true
        })

    }

    goToSignIn() {
        this.setState({
            active: 0,
        });
    }

    goToSignUp() {
        this.setState({
            active: 1,
        });
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




    handleSubmitSite = (event) => {
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
                    this.toggleSite();
                    this.getSites();
                })
                .catch((error) => {});
        }
    };

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                {this.props.item &&this.state.loading && (
                    <div className="container  ">
                        <div className="row no-gutters mt-3">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Edit Search</h3>
                            </div>
                        </div>

                        <form onSubmit={this.handleSubmit}>

                            <div className="row no-gutters">
                                <div className="col-12 mt-4">

                                    <TextFieldWrapper
                                        initialValue={this.props.item&&this.props.item.search.name}
                                        onChange={(value)=>this.handleChangeProduct(value,"title")}
                                        error={this.state.errors["title"]}
                                        name="title" title="Title" />

                                </div>
                            </div>


                            <div className="row mt-4">
                                <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                    <SelectArrayWrapper
                                        initialValue={this.props.item&&this.props.item.search.category}
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
                                        options={this.state.categories} name={"category"} title="Resource Category"/>

                                </div>

                                <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                    <SelectArrayWrapper
                                        initialValue={this.props.item&&this.props.item.search.type}
                                        option={"name"}
                                        valueKey={"name"}
                                        select={"Select"}
                                        error={this.state.errors["type"]}
                                        onChange={(value)=> {
                                            this.handleChangeProduct(value,"type")

                                            this.setState({
                                                subCatSelected:  this.state.subCategories.length>0? this.state.subCategories.filter(
                                                    (item) => item.name === value
                                                ):null,

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
                                    <SelectArrayWrapper
                                        initialValue={this.props.item&&this.props.item.search.state}

                                        onChange={(value)=>this.handleChangeProduct(value,"state")}
                                        error={this.state.errors["state"]}

                                        select={"Select"}
                                        disabled={ (this.state.states.length > 0 )? false : true}
                                        options={this.state.states?this.state.states:[]} name={"state"} title="State"/>

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
                                                select={"Select"}
                                                initialValue={this.props.item&&this.props.item.search.units}
                                                onChange={(value)=>this.handleChangeProduct(value,"units")}
                                                error={this.state.errors["units"]}

                                                disabled={ (this.state.units.length > 0) ? false : true}
                                                options={this.state.units} name={"units"} title="(Units)"/>
                                        </div>
                                        <div className="col-6 pl-2">

                                            <TextFieldWrapper
                                                initialValue={this.props.item&&this.props.item.search.volume}
                                                onChange={(value)=>this.handleChangeProduct(value,"volume")}
                                                error={this.state.errors["volume"]}
                                                name="volume" title="(Volume)" />

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row no-gutters mt-4">
                                <div className="col-12">
                                    <div className="row camera-grids   no-gutters   ">
                                        <div className="col-md-6 col-sm-12 col-xs-12 pr-2 ">
                                            <SelectArrayWrapper

                                                initialValue={this.props.item&&this.props.item.product&&this.props.item.product._key}
                                                option={"name"}
                                                valueKey={"_key"}
                                                error={this.state.errors["product"]}
                                                onChange={(value)=> {

                                                    this.handleChangeProduct(value,"product")

                                                }} select={"Select"} options={this.props.productList} name={"product"} title="Link a product (Optional)"/>

                                        </div>

                                        <div className="col-md-6 col-sm-12 col-xs-12 pl-2">

                                            <SelectArrayWrapper

                                                initialValue={this.props.item&&this.props.item.site._key}
                                                option={"name"}
                                                valueKey={"_key"}
                                                error={this.state.errors["deliver"]}
                                                onChange={(value)=> {

                                                    this.handleChangeProduct(value,"deliver")

                                                }} select={"Select"} options={this.props.siteList} name={"deliver"} title="Deliver to"/>


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

                                    <TextFieldWrapper
                                        initialValue={this.props.item&&this.props.item.search.description}
                                        onChange={(value)=>this.handleChangeProduct(value,"description")}
                                        error={this.state.errors["description"]}
                                        multiline
                                        rows={4} name="description" title="Description" />


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
                            <div className="row no-gutters mt-2">
                            <div className="col-6 mb-2 pr-2">
                                <div className={"custom-label text-bold text-blue "}>
                                    Required From
                                </div>

                                {/*<MuiPickersUtilsProvider utils={MomentUtils}>*/}
                                    <DatePicker
                                        name={"dateRequiredFrom"}
                                        inputVariant="outlined"
                                        variant={"outlined"}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        format="DD/MM/yyyy"
                                        value={
                                            this.state.dateRequiredFrom
                                                ? this.state.dateRequiredFrom
                                                : this.props.item.search.require_after_epoch_ms
                                        }
                                        onChange={this.handleChangeDateStartDate.bind(this)}
                                    />
                                {/*</MuiPickersUtilsProvider>*/}
                                {this.state.errors["startDate"] && (
                                    <span className={"text-mute small"}>
                                            <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["startDate"]}
                                        </span>
                                )}
                            </div>

                            <div className="col-6 mb-2 pl-2">
                                <div className={"custom-label text-bold text-blue "}>
                                    Required By
                                </div>

                                {/*<MuiPickersUtilsProvider utils={MomentUtils}>*/}
                                    <DatePicker
                                        name={"dateRequiredBy"}
                                        minDate={
                                            this.state.dateRequiredFrom
                                                ? this.state.dateRequiredFrom
                                                : new Date()
                                        }
                                        // label="Required By"
                                        inputVariant="outlined"
                                        variant={"outlined"}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        format="DD/MM/yyyy"
                                        value={
                                            this.state.dateRequiredBy
                                                ? this.state.dateRequiredBy
                                                : this.props.item.search.expire_after_epoch_ms
                                        }
                                        onChange={this.handleChangeDate.bind(this)}
                                    />
                                {/*</MuiPickersUtilsProvider>*/}
                                {this.state.errors["endDate"] && (
                                    <span className={"text-mute small"}>
                                            <span style={{ color: "red" }}>* </span>
                                        {this.state.errors["endDate"]}
                                        </span>
                                )}
                            </div>
                            </div>
                            <div className="row  mb-5 pb-5 no-gutters mt-2">
                            <div className="col-12 ">
                                <button
                                    type={"submit"}
                                    className={
                                        "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                    }>
                                    Submit
                                </button>
                            </div>
                            </div>

                        </form>
                    </div>
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
                                        <form onSubmit={this.handleSubmitSite}>
                                            <div className="row no-gutters justify-content-center ">
                                                <div className="col-12 mt-4">
                                                    <TextField
                                                        id="outlined-basic"
                                                        label=" Name"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        name={"name"}
                                                        onChange={this.handleChangeSite.bind(
                                                            this,
                                                            "name"
                                                        )}
                                                    />

                                                    {this.state.errorsSite["name"] && (
                                                        <span className={"text-mute small"}>
                                                            <span style={{ color: "red" }}>* </span>
                                                            {this.state.errorsSite["name"]}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="col-12 mt-4">
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Contact"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        name={"contact"}
                                                        onChange={this.handleChangeSite.bind(
                                                            this,
                                                            "contact"
                                                        )}
                                                    />

                                                    {this.state.errorsSite["contact"] && (
                                                        <span className={"text-mute small"}>
                                                            <span style={{ color: "red" }}>* </span>
                                                            {this.state.errorsSite["contact"]}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="col-12 mt-4">
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Address"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        name={"address"}
                                                        type={"text"}
                                                        onChange={this.handleChangeSite.bind(
                                                            this,
                                                            "address"
                                                        )}
                                                    />

                                                    {this.state.errorsSite["address"] && (
                                                        <span className={"text-mute small"}>
                                                            <span style={{ color: "red" }}>* </span>
                                                            {this.state.errorsSite["address"]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-12 mt-4">
                                                    <TextField
                                                        id="outlined-basic"
                                                        type={"text"}
                                                        name={"phone"}
                                                        onChange={this.handleChangeSite.bind(
                                                            this,
                                                            "phone"
                                                        )}
                                                        label="Phone"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                    />

                                                    {this.state.errorsSite["phone"] && (
                                                        <span className={"text-mute small"}>
                                                            <span style={{ color: "red" }}>* </span>
                                                            {this.state.errorsSite["phone"]}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="col-12 mt-4">
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Email"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        name={"email"}
                                                        type={"email"}
                                                        onChange={this.handleChangeSite.bind(
                                                            this,
                                                            "email"
                                                        )}
                                                    />

                                                    {this.state.errorsSite["email"] && (
                                                        <span className={"text-mute small"}>
                                                            <span style={{ color: "red" }}>* </span>
                                                            {this.state.errorsSite["email"]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-12 mt-4">
                                                    <TextField
                                                        onChange={this.handleChangeSite.bind(
                                                            this,
                                                            "others"
                                                        )}
                                                        name={"others"}
                                                        id="outlined-basic"
                                                        label="Others"
                                                        variant="outlined"
                                                        fullWidth={true}
                                                        type={"others"}
                                                    />

                                                    {/*{this.state.errorsSite["others"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["others"]}</span>}*/}
                                                </div>

                                                <div className="col-12 mt-4">
                                                    <button
                                                        type={"submit"}
                                                        className={
                                                            "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                        }>
                                                        Add Site
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </>
        );
    }
}

const useStylesBottomBar = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: "auto",
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: "absolute",
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: "0 auto",
    },
}));

function BottomAppBar() {
    const classes = useStylesBottomBar();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div
                        className="row  justify-content-center search-container "
                        style={{ margin: "auto" }}>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Back
                            </button>
                        </div>
                        <div className="col-auto" style={{ margin: "auto" }}>
                            <p className={"blue-text"}> Page 2/3</p>
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                Next
                            </button>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
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
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
        showSubProductView: state.showSubProductView,
        showCreateProduct: state.showCreateProduct,
        showCreateSubProduct: state.showCreateSubProduct,
        showProductView: state.loginPopUpStatus,
        productList: state.productList,
        siteList: state.siteList,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),

        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SearchEditForm);
