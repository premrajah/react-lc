import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Select from "@mui/material/Select";
import SearchIcon from "../../img/icons/search-icon.png";
import {Link} from "react-router-dom";
import {makeStyles} from "@mui/styles";
import Toolbar from "@mui/material/Toolbar";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import LinearProgress from "@mui/material/LinearProgress";
import ProductExpandItem from "../../components/Products/ProductExpandItem";
import FormHelperText from "@mui/material/FormHelperText";
import _ from "lodash";
// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import PageHeader from "../../components/PageHeader";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import {capitalize} from "../../Util/GlobalFunctions";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import Layout from "../../components/Layout/Layout";
import BlueBorderButton from "../../components/FormsUI/Buttons/BlueBorderButton";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import SiteFormNew from "../../components/Sites/SiteFormNew";


class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate:null,
            endDate:null,
            timerEnd: false,
            count: 0,
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
            progressBar: 50,

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
            createSearchData: null,
            searchObj: null,
            resourcesMatched: [],
            showCreateSite: false,
            siteSelected: null,
            productSelection: false,
            purpose: ["Defined", "Prototype", "Aggregate"],
            condition: ["New", "Used", "Salvage"],
            types: ["sale", "rental"],
            site: {},
            dateRequiredBy: null,
            dateRequiredFrom: null,
            success: false,
            activeStep:0,
            showFieldErrors:false,
            loading:false

        };

        this.selectCreateSearch = this.selectCreateSearch.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectState = this.selectState.bind(this);
        this.addDetails = this.addDetails.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.linkProduct = this.linkProduct.bind(this);
        this.searchLocation = this.searchLocation.bind(this);
        this.previewSearch = this.previewSearch.bind(this);
        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
        this.getFiltersCategories = this.getFiltersCategories.bind(this);
        this.selectSubCatType = this.selectSubCatType.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
        // this.handleDateChange = this.handleDateChange.bind(this)
        this.createSearch = this.createSearch.bind(this);
        this.loadMatches = this.loadMatches.bind(this);
        this.showCreateSite = this.showCreateSite.bind(this);
        this.getSites = this.getSites.bind(this);
        this.getSite = this.getSite.bind(this);
        this.toggleSite = this.toggleSite.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
        this.makeActive = this.makeActive.bind(this);
        this.goToSearchPage = this.goToSearchPage.bind(this);


        this.phonenumber = this.phonenumber.bind(this);
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

    showProductSelection(event) {
        var action = event.currentTarget.dataset.id;

        this.props.showProductPopUp({ type: "create_product", show: true });
    }



    makeActive(event) {
        var active = event.currentTarget.dataset.active;

        this.setState({
            active: parseInt(active),
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


    getSite() {


        let url=
        axios
            .get(baseUrl + "site/" + this.state.siteSelected, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
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
    }Upload

    getSites() {
        this.props.loadSites(this.props.userDetail.token);
    }

    toggleSite(refresh) {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });


        if (refresh){
            this.props.loadSites();
        }
    }

    createSearch() {


        this.setState({
            loading:true
        })


        var data = {
            search: {
                name: this.state.fields["title"],
                description: this.state.fields["description"],
                category: this.state.fields["category"],
                type: this.state.fields["type"],
                units: this.state.fields["units"],
                volume: this.state.fields["volume"],
                state: this.state.fields["state"],
                require_after_epoch_ms: new Date(this.state.startDate).getTime(),
                expire_after_epoch_ms: new Date(this.state.endDate).getTime(),
                search_type: this.state.fields["search_type"],
            },
            site_id: this.state.fields["deliver"],
            product_id: this.state.fields["product"],
        };

        axios
            .put(baseUrl + "search", data, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {
                this.setState({
                    // createSearchData: res.data.data,
                    searchObj: res.data.data,
                    success: true,
                    activeStep:2
                });

                this.setState({
                    loading:false
                })

                this.getSite();
            })
            .catch((error) => {

                this.setState({
                    loading:false
                })
            });
    }

    loadMatches() {
        for (var i = 0; i < this.state.createSearchData.resources.length; i++) {
            axios
                .get(baseUrl + "resource/" + this.state.createSearchData.resources[i], {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                })
                .then(
                    (response) => {
                        var response = response.data;

                        var resources = this.state.resourcesMatched;

                        resources.push(response);

                        this.setState({
                            resourcesMatched: resources,
                            activeStep:2
                        });
                    },
                    (error) => {
                        var status = error.response.status;
                    }
                );
        }
    }

    nextClick() {
        if (this.state.active < 4) {
            this.setState({
                active: 4,
            });
        } else if (this.state.active === 4) {
            this.setState({
                active: 7,
            });
        } else if (this.state.active === 7) {
            this.setState({
                active: 8,
            });
        }
    }

    handleBack() {


if ((this.state.activeStep-1)==0){

    if(this.handleValidationSearch(this.state.activeStep-1)){

        this.setState({
            nextBlue:true
        });

    }else{

        this.setState({
            nextBlue:false
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


        // if (this.state.page === 2) {
        //     window.scrollTo(0, 0);
        //
        //     if (this.handleValidation()) {
        //         this.setState({
        //             page: 1,
        //             active: 0,
        //             progressBar: 33,
        //         });
        //     }
        // }

    }

    goToSearchPage() {
        this.props.history.push("/search/" + this.state.searchObj._key);
    }

    handleNextOld() {
        this.getSites();
        if (this.state.page === 1) {
            if (this.handleValidation()) {
                window.scrollTo(0, 0);

                this.setState({
                    active: 4,
                    page: 2,
                    progressBar: 100,
                });
            }
        } else if (this.state.page === 2) {
            if (this.handleValidationAddDetail()) {
                window.scrollTo(0, 0);

                this.setState({
                    active: 6,
                    page: 3,
                    progressBar: 100,
                });

                this.createSearch();
            }
        } else if (this.state.page === 3) {
            window.scrollTo(0, 0);

            this.setState({
                active: 7,
                page: 4,
                progressBar: 100,
            });
        } else if (this.state.active === 7) {
            this.setState({
                active: 8,
            });
        }
    }

    getResources() {}

    getFiltersCategories() {
        axios
            .get(baseUrl + "category", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {

                 let   responseAll = _.sortBy(response.data.data, ["name"]);

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

    handleValidationNextColor() {
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

        if (!fields["volume"]) {
            formIsValid = false;
            errors["volume"] = "Required";
        }

        if (!fields["unit"]) {
            formIsValid = false;
            errors["unit"] = "Required";
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

        //
        // if (this.state.catSelected && this.state.subCatSelected && this.state.stateSelected) {
        //
        //
        // } else {
        //
        //
        //     formIsValid = false;
        //     errors["category"] = "Required";
        //
        // }

        this.setState({
            nextBlue: formIsValid,
        });
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



    handleChange(value,field) {


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



        if (this.handleValidationSearch(this.state.activeStep)){


            if (this.state.activeStep==1){

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

    addDetails() {
        this.setState({
            active: 4,
        });
    }


    handleValidationSearch=(activeStep)=> {


        let fields = this.state.fields;

        let validations=[]



        if (activeStep===0) {

             validations = [
                validateFormatCreate("title", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("category", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("type", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("state", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("volume", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("units", [{check: Validators.required, message: 'Required'}], fields),

            ]

        }
        else if (activeStep===1) {
            validations = [
                // validateFormatCreate("product", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("deliver", [{check: Validators.required, message: 'Required'}], fields),


            ]

        }
        else if (activeStep===2) {
        }

        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});

        return formIsValid;


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

    interval;



    componentDidMount() {
        window.scrollTo(0, 0);


        this.getFiltersCategories();
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


    validateDates(){


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


    handleNext = () => {


        this.setState({
            showFieldErrors:true
        })

        if (this.handleValidationSearch(this.state.activeStep)) {

            this.props.loadProducts();
            this.props.loadSites();

            window.scrollTo(0, 0);

            if(this.handleValidationSearch(this.state.activeStep+1)){

                this.setState({
                    nextBlue:true,

                });
            }else{
                this.setState({
                    nextBlue:false
                });

            }

            this.setState({
                activeStep: this.state.activeStep + 1,

                progressBar: 100,
                showFieldErrors:false
            });


        }



    };

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

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout hideFooter>

                    <div className="container  pb-4 pt-4">
                        {this.state.activeStep <2 &&<PageHeader pageTitle="New Search"  subTitle={this.state.activeStep === 0 ?"Basic Details":"More Details"}/>}

                        <div className={this.state.activeStep === 0 ? "mb-5 pb-5" : "d-none"}>
                            <div className="row">
                                <div className="col-12">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="row no-gutters justify-content-center ">
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


                                        </div>
                                        <div className="row mt-2">


                                            <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                                <SelectArrayWrapper
                                                    initialValue={this.props.item&&this.props.item.product.category}
                                                    option={"name"}
                                                    valueKey={"name"}
                                                    select={"Select"}
                                                      error={this.state.showFieldErrors&&this.state.errors["category"]}
                                                    onChange={(value)=> {

                                                        this.handleChange(value,"category")
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
                                                    options={this.state.categories}
                                                    name={"category"}
                                                    title="Resource Category"
                                                />

                                            </div>

                                            <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                                <SelectArrayWrapper
                                                    initialValue={this.props.item&&this.props.item.product.type}
                                                    option={"name"}
                                                    valueKey={"name"}
                                                    select={"Select"}
                                                      error={this.state.showFieldErrors&&this.state.errors["type"]}
                                                    onChange={(value)=> {
                                                        this.handleChange(value,"type")

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
                                                <SelectArrayWrapper
                                                    initialValue={this.props.item&&this.props.item.product.state}

                                                    onChange={(value)=>this.handleChange(value,"state")}
                                                      error={this.state.showFieldErrors&&this.state.errors["state"]}

                                                    select={"Select"}
                                                    disabled={ (this.state.states.length > 0 )? false : true}
                                                    options={this.state.states?this.state.states:[]} name={"state"} title="State"/>

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
                                                        <SelectArrayWrapper
                                                            select={"Select"}
                                                            initialValue={this.props.item&&this.props.item.product.units}
                                                            onChange={(value)=>this.handleChange(value,"units")}
                                                              error={this.state.showFieldErrors&&this.state.errors["units"]}

                                                            disabled={ (this.state.units.length > 0) ? false : true}
                                                            options={this.state.units} name={"units"} title="(Units)"/>
                                                    </div>
                                                    <div className="col-4 ">

                                                        <TextFieldWrapper

                                                            initialValue={this.props.item&&this.props.item.product.volume+""}
                                                            // value={this.state.disableVolume?"0":""}
                                                            onChange={(value)=>this.handleChange(value,"volume")}
                                                              error={this.state.showFieldErrors&&this.state.errors["volume"]}
                                                            name="volume" title="(Volume)" />

                                                    </div>

                                                    <div className="col-4 ">

                                                        <SelectArrayWrapper

                                                            select={"Select"}
                                                            onChange={(value)=> {
                                                                this.handleChange(value,"search_type")

                                                            }}
                                                            options={this.state.types} name={"search_type"} title="Type"/>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.activeStep == 1? "" : "d-none"}>
                            <div className="row  mb-5 pb-5">
                                <div className={"col-12"}>

                                    <div className="row  no-gutters justify-content-center ">

                                        <div className="col-12 d-none mb-2">

                                                <SelectArrayWrapper
                                                    valueKey={"_key"}
                                                    initialValue={this.props.item&&capitalize(this.props.item.product.name)}

                                                    onChange={(value)=>this.handleChange(value,"product")}
                                                      error={this.state.showFieldErrors&&this.state.errors["product"]}
                                                    options={this.props.productList}
                                                    name={"product"}
                                                    title="Product"
                                                    native
                                                    select={"Select"}
                                                    option={"name"}

                                                />
                                                <FormHelperText>
                                                    Please select the product you wish to sell.
                                                    <br />
                                                    Don’t see it on here?
                                                    <span
                                                        onClick={this.showProductSelection.bind(
                                                            this
                                                        )}
                                                        className={
                                                            " forgot-password-link text-mute "
                                                        }>

                                                        Create a new product
                                                    </span>
                                                </FormHelperText>


                                            {this.state.fields["product"] && (
                                                <>
                                                    <ProductExpandItem
                                                        hideMore={true}
                                                        hideAddAll={true}
                                                        productId={this.state.fields["product"]}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <div className="col-12 mb-2">

                                                <SelectArrayWrapper
                                                    valueKey={"_key"}
                                                    initialValue={this.props.item&&capitalize(this.props.item.product.deliver)}
                                                    onChange={(value)=>this.handleChange(value,"deliver")}
                                                    error={this.state.showFieldErrors&&this.state.errors["deliver"]}
                                                    options={this.props.siteList}
                                                    option={"name"}
                                                    select={"Select"}
                                                    name={"deliver"} title="Deliver to"
                                                    native
                                                  />
                                            <p style={{ marginTop: "10px" }}>

                                                Don’t see it on here?
                                                <span
                                                    onClick={this.toggleSite}
                                                    className={
                                                        " forgot-password-link text-mute small"
                                                    }>
                                                    Add a site
                                                </span>
                                            </p>
                                        </div>

                                    </div>
                                    <div className="row no-gutters justify-content-start ">
                                    <div className="col-4 pr-1">
                                        <div
                                            className={
                                                "custom-label text-bold text-blue "
                                            }>
                                            Required From
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

                                    <div className="col-4 pl-1 ">

                                        <div
                                            className={
                                                "custom-label text-bold text-blue "
                                            }>
                                            Required By
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
                                </div>
                            </div>
                        </div>

                        <div className={this.state.activeStep === 2 ? "" : "d-none"}>

                            <div className="container   pb-4 pt-4">
                                <div className="row justify-content-center pb-2 pt-4 ">
                                    <div className="col-12 pb-3 pt-5 text-center">
                                        <img
                                            style={{width:"48px"}}
                                            className={"search-icon-middle"}
                                            src={SearchIcon}
                                            alt=""
                                        />
                                    </div>
                                    <div className="col-12 pb-3 mt-3 text-center">
                                        <h4 className={"text-pink text-heading text-bold"}>
                                            Success!
                                        </h4>
                                    </div>
                                </div>

                                <div className="row justify-content-center">

                                    { this.state.searchObj &&  <div
                                        className="col-12 text-center blue-text"
                                        style={{ margin: "auto" }}>
                                        <p><Link className={"blue-btn-border"} to={"/search/"+this.state.searchObj._key}>View Search</Link> </p>
                                    </div>}
                                </div>


                                <div className="row justify-content-center pb-3 pt-3 mt-3 ">
                                    <div className="col-auto">
                                        <p className={"text-blue text-center"}>
                                            Your search has been created. You will be notified when
                                            a match is found.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>


                    {this.state.activeStep < 2 &&
                    <React.Fragment>

                            <div
                                position="fixed"
                                color="#ffffff"
                                className={ "custom-bottom-fixed-appbar  custom-bottom-appbar"}>
                                {/*<ProgressBar now={this.state.progressBar}  />*/}

                                    <LinearProgress
                                        variant="determinate"
                                        value={this.state.progressBar}
                                    />

                                <Toolbar>

                                        <div
                                            className="row align-items-center justify-content-center search-container "
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
                                            {this.state.activeStep < 2 && (
                                                <div
                                                    className="col-auto"
                                                    style={{ margin: "auto" }}>
                                                    <p className={"blue-text"}>

                                                        Step {this.state.activeStep+1}/2
                                                    </p>
                                                </div>
                                            )}
                                            <div className="col-auto ">

                                                {this.state.activeStep <2 && (
                                                    <BlueBorderButton
                                                        onClick={this.state.activeStep==0?this.handleNext:this.createSearch}
                                                        type="button"
                                                        loading={this.state.loading}


                                                       title= {this.state.activeStep==1?this.state.loading?"Wait...":"Submit Search":"Next"}
                                                        disabled={!this.state.nextBlue||this.state.loading}
                                                    >

                                                    </BlueBorderButton>
                                                )}

                                                {/*{this.state.activeStep <2 && (*/}
                                                {/*    <button*/}
                                                {/*        onClick={this.state.activeStep==0?this.handleNext:this.createSearch}*/}
                                                {/*        type="button"*/}
                                                {/*        className={*/}
                                                {/*            this.state.nextBlue*/}
                                                {/*                ? "btn-next shadow-sm mr-2  blue-btn-border   mt-2 mb-2 "*/}
                                                {/*                : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "*/}
                                                {/*        }>*/}
                                                {/*        {this.state.activeStep==1?"Submit Search":"Next"}*/}
                                                {/*    </button>*/}
                                                {/*)}*/}

                                                {/*{this.state.activeStep <3 && (*/}
                                                {/*    <button*/}
                                                {/*        onClick={this.handleNext}*/}
                                                {/*        type="button"*/}
                                                {/*        className={*/}
                                                {/*            this.state.nextBlueAddDetail*/}
                                                {/*                ? "btn-next shadow-sm mr-2 btn btn-link blue-btn       mt-2 mb-2 "*/}
                                                {/*                : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "*/}
                                                {/*        }>*/}
                                                {/*        New Search*/}
                                                {/*    </button>*/}
                                                {/*)}*/}

                                                {this.state.activeStep === 3 && this.state.success && (
                                                    <button
                                                        onClick={this.goToSearchPage}
                                                        type="button"
                                                        className={
                                                            "btn-next shadow-sm mr-2 btn btn-link blue-btn  mt-2 mb-2 "
                                                        }>
                                                        View Search
                                                    </button>
                                                )}
                                            </div>
                                        </div>



                                </Toolbar>
                            </div>
                        </React.Fragment>}


                <GlobalDialog

                    hide={this.toggleSite}
                    show={this.state.showCreateSite}
                    heading={"Add new site"}>
                    <>
                        <div className="col-12 ">

                            <SiteFormNew refresh={()=>this.toggleSite(true)} />
                        </div>
                    </>
                </GlobalDialog>


                    {/*{this.state.showCreateSite && (*/}
                    {/*    <>*/}
                    {/*        <div className={"body-overlay"}>*/}
                    {/*            <div className={"modal-popup site-popup"}>*/}
                    {/*                <div className=" text-right ">*/}
                    {/*                    <Close*/}
                    {/*                        onClick={this.toggleSite}*/}
                    {/*                        className="blue-text"*/}
                    {/*                        style={{ fontSize: 32 }}*/}
                    {/*                    />*/}
                    {/*                </div>*/}

                    {/*                <div className={"row"}>*/}
                    {/*                    <div className={"col-12"}>*/}
                    {/*                        <EditSite site={{}} submitCallback={() => this.toggleSite()} />*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </>*/}
                    {/*)}*/}





            </Layout>
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
export default connect(mapStateToProps, mapDispachToProps)(SearchForm);
