import React, { Component } from "react";
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Close from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles/index";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import ProductExpandItem from "./ProductExpandItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import MomentUtils from "@date-io/moment";
import _ from "lodash";
import clsx from "clsx";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

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

class ListEditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            item: null,
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
            progressBar: 33,

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
            handleUpdateListingData: null,
            searchObj: null,
            resourcesMatched: [],
            showCreateSite: false,
            siteSelected: null,
            productSelection: false,
            purpose: ["defined", "prototype", "aggregate"],
            site: {},
            dateRequiredBy: null,
            dateRequiredFrom: null,
        };

        this.selectCreateSearch = this.selectCreateSearch.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectState = this.selectState.bind(this);
        this.addDetails = this.addDetails.bind(this);
        this.nextClick = this.nextClick.bind(this);
        this.linkProduct = this.linkProduct.bind(this);
        this.previewSearch = this.previewSearch.bind(this);
        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
        this.getFiltersCategories = this.getFiltersCategories.bind(this);
        this.selectSubCatType = this.selectSubCatType.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
        // this.handleDateChange = this.handleDateChange.bind(this)
        this.handleUpdateListing = this.handleUpdateListing.bind(this);
        this.loadMatches = this.loadMatches.bind(this);
        this.showCreateSite = this.showCreateSite.bind(this);
        this.getSites = this.getSites.bind(this);
        this.getSite = this.getSite.bind(this);
        this.toggleSite = this.toggleSite.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
        this.toggleDateOpen = this.toggleDateOpen.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.makeActive = this.makeActive.bind(this);
        this.goToSearchPage = this.goToSearchPage.bind(this);
        this.getListing = this.getListing.bind(this);
        this.triggerCallback = this.triggerCallback.bind(this);
        this.loadSelection = this.loadSelection.bind(this);
        this.toggleFree = this.toggleFree.bind(this);
        this.toggleSale = this.toggleSale.bind(this);
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

    loadSelection() {
        this.setState({
            dateRequiredBy: this.state.item.listing.expire_after_epoch_ms,
            dateRequiredFrom: this.state.item.listing.available_from_epoch_ms,
        });

        let catSelected = this.state.categories.filter(
            (item) => item.name === this.state.item.listing.category
        )[0];

        var subCategories = catSelected.types;

        this.setState({
            catSelected: catSelected,
        });

        this.setState({
            subCategories: subCategories,
        });

        let subCatSelected = subCategories.filter(
            (item) => item.name === this.state.item.listing.type
        )[0];

        if (subCatSelected) {
            var states = subCatSelected.state;

            var units = subCatSelected.units;

            this.setState({
                subCatSelected: subCatSelected,
            });

            this.setState({
                states: states,
                units: units,
            });
        }
    }

    getListing() {
        axios
            .get(baseUrl + "listing/" + this.props.listingId + "/expand", {
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

                    this.loadSelection();
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

    handleChangeProduct(field, e) {
        let fields = this.state.fieldsProduct;
        fields[field] = e.target.value;
        this.setState({ fields });
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
    }

    getSites() {
        this.props.loadSites(this.props.userDetail.token);
    }

    toggleSite() {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
    }

    handleUpdateListing(event) {
        event.preventDefault();

        const dataFORM = new FormData(event.target);

        // this.triggerCallback()

        var data = {
            id: this.state.item.listing._key,
            update: {
                name: dataFORM.get("title"),
                description: dataFORM.get("description"),
                category: dataFORM.get("category"), //this.state.catSelected.name,
                type: dataFORM.get("type"),
                state: dataFORM.get("state"),
                available_from_epoch_ms: new Date(this.state.dateRequiredFrom).getTime(),
                expire_after_epoch_ms: new Date(this.state.dateRequiredBy).getTime(),

                // "require_after_epoch_ms":  new Date(dataFORM.get("dateRequiredFrom")).getTime(),
                // "expire_after_epoch_ms":  new Date(dataFORM.get("dateRequiredBy")).getTime(),
            },
            // "site_id": this.state.siteSelected,
            // "product_id":this.state.productSelected
        };

        axios
            .post(baseUrl + "listing", data, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {
                this.triggerCallback();

                // this.setState({
                //     // handleUpdateListingData: res.data.data,
                //     item:res.data.data,
                // })

                this.getSite();
            })
            .catch((error) => {});
    }

    loadMatches() {
        for (var i = 0; i < this.state.handleUpdateListingData.resources.length; i++) {
            axios
                .get(baseUrl + "resource/" + this.state.handleUpdateListingData.resources[i], {
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
        if (this.state.page === 2) {
            if (this.handleValidation()) {
                this.setState({
                    page: 1,
                    active: 0,
                    progressBar: 33,
                });
            }
        }
    }

    goToSearchPage() {
        this.props.history.push("/search/" + this.state.listingObj._key);
    }

    handleNext() {
        this.getSites();
        if (this.state.page === 1) {
            if (this.handleValidation()) {
                this.setState({
                    active: 4,
                    page: 2,
                    progressBar: 66,
                });
            }
        } else if (this.state.page === 2) {
            if (this.handleValidationAddDetail()) {
                this.setState({
                    active: 6,
                    page: 3,
                    progressBar: 100,
                });

                this.handleUpdateListing();
            }
        } else if (this.state.page === 3) {
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
                    var response = _.sortBy(response.data.data, ["name"]);

                    this.setState({
                        categories: response,
                    });

                    this.getListing(this.props.listingId);
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
        let fields = this.state.fields;
        fields[field] = event.target.value;

        const value = event.target.value;

        this.setState({
            [field]: value,
        });

        this.setState({ fields });

        this.setState({
            price: fields["price"],
        });

        if (field === "product") {
            this.setState({
                productSelected: event.target.value,
            });
        }

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

                this.setState({
                    stateSelected: null,
                });

                this.setState({
                    subCatSelected: null,
                });

                this.setState({
                    states: [],
                    units: [],
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

        if (field === "state") {
            if (event.target.value !== "Select") {
                this.setState({
                    stateSelected: event.target.value,
                });
            } else {
                this.setState({
                    stateSelected: null,
                });
            }
        }
    }

    addDetails() {
        this.setState({
            active: 4,
        });
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
        this.getSites();
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

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                {this.state.item && (
                    <div className="container  ">
                        <div className="row no-gutters mt-3">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Edit Listing</h3>
                            </div>
                        </div>

                        <form onSubmit={this.handleUpdateListing}>
                            <div className="row no-gutters justify-content-center mt-2 pb-4">
                                <div className="col-12">
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Title
                                    </div>

                                    <TextField
                                        value={
                                            this.state.title
                                                ? this.state.title
                                                : this.state.item.listing.name
                                        }
                                        onChange={this.handleChange.bind(this, "title")}
                                        name={"title"}
                                        placeholder={"Title"}
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
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Description
                                    </div>

                                    <TextField
                                        value={
                                            this.state.description
                                                ? this.state.description
                                                : this.state.item.listing.description
                                        }
                                        onChange={this.handleChange.bind(this, "description")}
                                        name={"description"}
                                        placeholder={"Search description"}
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

                                <div className="col-12 mt-4 mb-3">
                                    <div className={"row"}>
                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                            <div
                                                className={"custom-label text-bold text-blue mb-3"}>
                                                Resource Category
                                            </div>
                                            <FormControl
                                                variant="outlined"
                                                className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                                <Select
                                                    native
                                                    onChange={this.handleChange.bind(
                                                        this,
                                                        "category"
                                                    )}
                                                    inputProps={{
                                                        name: "category",
                                                        id: "outlined-age-native-simple",
                                                    }}>
                                                    {/*<option value={null}>Select</option>*/}

                                                    {this.state.categories.map((item) => (
                                                        <option
                                                            selected={
                                                                this.state.item.listing.category ===
                                                                item.name
                                                                    ? true
                                                                    : false
                                                            }
                                                            value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </Select>

                                                <FormHelperText>
                                                    Which category is your product located within?
                                                </FormHelperText>
                                            </FormControl>
                                            {this.state.errors["category"] && (
                                                <span className={"text-mute small"}>
                                                    <span style={{ color: "red" }}>* </span>
                                                    {this.state.errors["category"]}
                                                </span>
                                            )}
                                        </div>

                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                            <div
                                                className={"custom-label text-bold text-blue mb-3"}>
                                                Type
                                            </div>
                                            <FormControl
                                                disabled={
                                                    this.state.subCategories.length > 0
                                                        ? false
                                                        : true
                                                }
                                                variant="outlined"
                                                className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                                <Select
                                                    native
                                                    onChange={this.handleChange.bind(this, "type")}
                                                    inputProps={{
                                                        name: "type",
                                                        id: "outlined-age-native-simple",
                                                    }}>
                                                    {/*<option value={null}>Select</option>*/}

                                                    {this.state.subCategories.map((item) => (
                                                        <option
                                                            selected={
                                                                this.state.item.listing.type ===
                                                                item.name
                                                                    ? true
                                                                    : false
                                                            }
                                                            value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {this.state.errors["type"] && (
                                                <span className={"text-mute small"}>
                                                    <span style={{ color: "red" }}>* </span>
                                                    {this.state.errors["type"]}
                                                </span>
                                            )}
                                        </div>

                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                            <div
                                                className={"custom-label text-bold text-blue mb-3"}>
                                                State
                                            </div>
                                            <FormControl
                                                disabled={
                                                    this.state.states.length > 0 ? false : true
                                                }
                                                variant="outlined"
                                                className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                                <Select
                                                    native
                                                    onChange={this.handleChange.bind(this, "state")}
                                                    inputProps={{
                                                        name: "state",
                                                        id: "outlined-age-native-simple",
                                                    }}>
                                                    {/*<option value={null}>Select</option>*/}

                                                    {this.state.states.map((item) => (
                                                        <option
                                                            selected={
                                                                this.state.item.listing.state ===
                                                                item
                                                                    ? true
                                                                    : false
                                                            }
                                                            value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {this.state.errors["state"] && (
                                                <span className={"text-mute small"}>
                                                    <span style={{ color: "red" }}>* </span>
                                                    {this.state.errors["state"]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mb-1">
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Quantity
                                    </div>
                                    <p></p>
                                </div>

                                <div className="col-6 pr-2">
                                    <FormControl
                                        disabled={this.state.units.length > 0 ? false : true}
                                        variant="outlined"
                                        className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple">
                                            Unit
                                        </InputLabel>
                                        <Select
                                            name={"unit"}
                                            native
                                            onChange={this.handleChange.bind(this, "unit")}
                                            label="Age"
                                            inputProps={{
                                                name: "unit",
                                                id: "outlined-age-native-simple",
                                            }}>
                                            {/*<option value={null}>Select</option>*/}

                                            {this.state.units.map((item) => (
                                                <option
                                                    selected={
                                                        this.state.item.listing.units === item
                                                            ? true
                                                            : false
                                                    }
                                                    value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {this.state.errors["unit"] && (
                                        <span className={"text-mute small"}>
                                            <span style={{ color: "red" }}>* </span>
                                            {this.state.errors["unit"]}
                                        </span>
                                    )}
                                </div>
                                <div className="col-6 pl-2">
                                    <TextField
                                        value={
                                            this.state.volume
                                                ? this.state.volume
                                                : this.state.item.listing.volume
                                        }
                                        onChange={this.handleChange.bind(this, "volume")}
                                        name={"volume"}
                                        id="outlined-basic"
                                        label="Volume"
                                        variant="outlined"
                                        fullWidth={true}
                                    />

                                    {this.state.errors["volume"] && (
                                        <span className={"text-mute small"}>
                                            <span style={{ color: "red" }}>* </span>
                                            {this.state.errors["volume"]}
                                        </span>
                                    )}
                                </div>

                                <div className="col-12 mb-2">
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Link a product (Optional)
                                    </div>

                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <Select
                                            name="product"
                                            native
                                            onChange={this.handleChange.bind(this, "product")}
                                            inputProps={{
                                                name: "product",
                                                id: "outlined-age-native-simple",
                                            }}>
                                            {/*<option value={null}>Select</option>*/}

                                            {this.props.productList
                                                .filter((item) => item.listing_id === null)
                                                .map((item) => (
                                                    <option
                                                        selected={
                                                            this.state.item.product &&
                                                            this.state.item.product._key === item
                                                                ? true
                                                                : false
                                                        }
                                                        value={item.product._key}>
                                                        {item.product.name} (
                                                        {item.sub_product_ids.length} Sub Products)
                                                    </option>
                                                ))}
                                        </Select>
                                        {this.state.errors["product"] && (
                                            <span className={"text-mute small"}>
                                                <span style={{ color: "red" }}>* </span>
                                                {this.state.errors["product"]}
                                            </span>
                                        )}

                                        <FormHelperText>
                                            Please select the product you wish to sell. <br />
                                            Don’t see it on here?
                                            <span
                                                onClick={this.showProductSelection.bind(this)}
                                                className={
                                                    "green-text forgot-password-link text-mute "
                                                }>

                                                Create a new product
                                            </span>
                                        </FormHelperText>
                                    </FormControl>

                                    {this.state.productSelected && (
                                        <>
                                            <ProductExpandItem
                                                hideAddAll={true}
                                                productId={this.state.productSelected}
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="col-12 mb-2">
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Deliver To
                                    </div>

                                    <FormControl variant="outlined" className={classes.formControl}>
                                        {/*<InputLabel htmlFor="outlined-age-native-simple">Deliver To</InputLabel>*/}

                                        <Select
                                            name={"deliver"}
                                            native
                                            // label="Deliver To"
                                            onChange={this.handleChange.bind(this, "deliver")}
                                            inputProps={{
                                                name: "deliver",
                                                id: "outlined-age-native-simple",
                                            }}>
                                            {/*<option value={null}>Select</option>*/}

                                            {this.props.siteList.map((item) => (
                                                <option
                                                    selected={
                                                        this.state.item.site &&
                                                        this.state.item.site._key === item._key
                                                            ? true
                                                            : false
                                                    }
                                                    value={item._key}>
                                                    {item.name + "(" + item.address + ")"}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {this.state.errors["deliver"] && (
                                        <span className={"text-mute small"}>
                                            <span style={{ color: "red" }}>* </span>
                                            {this.state.errors["deliver"]}
                                        </span>
                                    )}

                                    <p style={{ margin: "10px 0" }}>

                                        Don’t see it on here?
                                        <span
                                            onClick={this.toggleSite}
                                            className={
                                                "green-text forgot-password-link text-mute small"
                                            }>
                                            Add a site
                                        </span>
                                    </p>
                                </div>

                                <div className="col-12 mb-2">
                                    <div className={"custom-label text-bold text-blue "}>
                                        Required From
                                    </div>

                                    <MuiPickersUtilsProvider utils={MomentUtils}>
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
                                                    : this.state.item.listing.require_after_epoch_ms
                                            }
                                            onChange={this.handleChangeDateStartDate.bind(this)}
                                        />
                                    </MuiPickersUtilsProvider>
                                    {this.state.errors["startDate"] && (
                                        <span className={"text-mute small"}>
                                            <span style={{ color: "red" }}>* </span>
                                            {this.state.errors["startDate"]}
                                        </span>
                                    )}
                                </div>

                                <div className="col-12 mb-2">
                                    <div className={"custom-label text-bold text-blue "}>
                                        Required By
                                    </div>

                                    <MuiPickersUtilsProvider utils={MomentUtils}>
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
                                                    : this.state.item.listing.expire_after_epoch_ms
                                            }
                                            onChange={this.handleChangeDate.bind(this)}
                                        />
                                    </MuiPickersUtilsProvider>
                                    {this.state.errors["endDate"] && (
                                        <span className={"text-mute small"}>
                                            <span style={{ color: "red" }}>* </span>
                                            {this.state.errors["endDate"]}
                                        </span>
                                    )}
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
                                                                value={
                                                                    this.state.price
                                                                        ? this.state.price
                                                                        : this.state.item.listing
                                                                              .price
                                                                        ? this.state.item.listing
                                                                              .price.value
                                                                        : 0
                                                                }
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
                                                                    ) + " full-width-field"
                                                                }
                                                                id="input-with-icon-textfield"
                                                            />

                                                            {this.state.errors["price"] && (
                                                                <span className={"text-mute small"}>
                                                                    <span style={{ color: "red" }}>
                                                                        *
                                                                    </span>
                                                                    {this.state.errors["price"]}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mt-4 mb-5 pb-5">
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
export default connect(mapStateToProps, mapDispachToProps)(ListEditForm);
