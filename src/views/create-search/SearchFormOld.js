import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import SendIcon from "../../img/send-icon.png";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "../../img/icons/search-icon.png";
import { Link } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Close from "@material-ui/icons/Close";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { withStyles } from "@material-ui/core/styles/index";
import MarkerIcon from "../../img/icons/marker.png";
import CalenderIcon from "../../img/icons/calender.png";
import ListIcon from "../../img/icons/list.png";
import AmountIcon from "../../img/icons/amount.png";
import StateIcon from "../../img/icons/state.png";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import LinearProgress from "@material-ui/core/LinearProgress";
import HeaderWhiteBack from "../header/HeaderWhiteBack";
import ResourceItem from "../item/ResourceItem";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import ProductExpandItem from "../../components/ProductExpandItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import MomentUtils from "@date-io/moment";
import moment from "moment";
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

class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
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
        this.toggleDateOpen = this.toggleDateOpen.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.makeActive = this.makeActive.bind(this);
        this.goToSearchPage = this.goToSearchPage.bind(this);
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
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    toggleSite() {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
    }

    createSearch() {
        alert("search " + this.state.productSelected);

        var data = {
            search: {
                name: this.state.title,
                description: this.state.description,
                category: this.state.catSelected.name,
                type: this.state.subCatSelected.name,
                units: this.state.unitSelected,
                volume: this.state.volumeSelected,

                state: this.state.stateSelected,
                require_after_epoch_ms: new Date(this.state.dateRequiredFrom).getTime(),
                expire_after_epoch_ms: new Date(this.state.dateRequiredBy).getTime(),
            },
            site_id: this.state.siteSelected,
            product_id: this.state.productSelected,
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
                });

                this.getSite();
            })
            .catch((error) => {});
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
        this.props.history.push("/search/" + this.state.searchObj._key);
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

                this.createSearch();
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

    dynamicSort = (property) => {
        let sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a, b) {
            if (sortOrder == -1) {
                return b[property].localeCompare(a[property]);
            } else {
                return a[property].localeCompare(b[property]);
            }
        };
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
                    var response = response.data.data.sort(this.dynamicSort("name"));

                    this.setState({
                        categories: response,
                    });
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

        if (!fields["volume"]) {
            formIsValid = false;
            errors["volume"] = "Required";
        } else {
            this.setState({
                volumeSelected: fields["volume"],
            });
        }

        if (!fields["unit"]) {
            formIsValid = false;
            errors["unit"] = "Required";
        } else {
            this.setState({
                unitSelected: fields["unit"],
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

        if (
            this.state.catSelected.name &&
            this.state.subCatSelected.name &&
            this.state.stateSelected
        ) {
        } else {
            formIsValid = false;
            errors["category"] = "Required";
        }

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

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;

        this.setState({ fields });
        this.handleValidationNextColor();
        this.handleValidationAddDetailNextColor();

        if (fields["product"]) {
            this.setState({
                productSelected: e.target.value,
            });
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

    interval;



    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.loadProducts(this.props.userDetail.token);

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
                {/*<div className="container  p-2">*/}
                {/*</div>*/}
                <Sidebar />
                <HeaderDark />

                <div className="container pt-4 p-2 mt-3 "></div>

                <div className={this.state.active === 0 ? "mb-5 pb-5" : "d-none"}>
                    <div className="container   pb-5 pt-5">
                        <div className="row no-gutters mt-3">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Create a Search</h3>
                            </div>
                        </div>

                        <form onSubmit={this.handleSubmit}>
                            <div className="row no-gutters justify-content-center mt-5">
                                <div className="col-12">
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Title
                                    </div>

                                    <TextField
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
                                <div className="col-12 mt-4" onClick={this.selectCategory}>
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Resource Category
                                    </div>

                                    <div
                                        onClick={this.selectCategory}
                                        className={"dummy-text-field"}>
                                        {this.state.catSelected &&
                                        this.state.catSelected.name &&
                                        this.state.subCatSelected &&
                                        this.state.stateSelected
                                            ? this.state.catSelected.name +
                                              " > " +
                                              this.state.subCatSelected.name +
                                              " > " +
                                              this.state.stateSelected
                                            : "Resource Category"}
                                    </div>
                                    {this.state.errors["category"] && (
                                        <span className={"text-mute small"}>
                                            <span style={{ color: "red" }}>* </span>
                                            {this.state.errors["category"]}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="row no-gutters justify-content-center mt-4">
                                <div className="col-12 mb-1">
                                    <div className={"custom-label text-bold text-blue mb-1"}>
                                        Quantity
                                    </div>
                                    <p></p>
                                </div>

                                <div className="col-6 pr-2">
                                    <FormControl variant="outlined" className={classes.formControl}>
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
                                            <option value={null}>Select</option>

                                            {this.state.units.map((item) => (
                                                <option value={item}>{item}</option>
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
                            </div>
                        </form>
                    </div>
                </div>

                <div className={this.state.active === 1 ? "" : "d-none"}>
                    <div className="container mb-2  pt-5 pb-2">
                        <div className="row no-gutters">
                            <div className="col-10">
                                <h6>Select a category </h6>
                            </div>

                            <div className="col-2" style={{ textAlign: "right" }}>
                                <Close
                                    onClick={this.selectCreateSearch}
                                    className="blue-text"
                                    style={{ fontSize: 32 }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="container   pb-5 mb-5 pt-3">
                        {this.state.categories.map((item) => (
                            <div
                                data-name={item.name}
                                className="row mr-2 ml-2  unselected-row p-3 mb-3"
                                onClick={this.selectType.bind(this)}>
                                <div className="col-2">
                                    <img className={"icon-left-select"} src={SendIcon} alt="" />
                                </div>
                                <div className="col-8">
                                    <p
                                        className={"blue-text "}
                                        style={{ fontSize: "16px", marginBottom: "5px" }}>
                                        {item.name}
                                    </p>
                                    <p className={"text-mute small"} style={{ fontSize: "14px" }}>
                                        {item.types.length + " Types"}
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={this.state.active === 2 ? "" : "d-none"}>
                    <div className="container  pt-2 mb-2 pb-2">
                        <div className="row no-gutters">
                            <div className="col-10">
                                <h6>Select a type </h6>
                            </div>

                            <div className="col-2" style={{ textAlign: "right" }}>
                                <Close
                                    data-active={1}
                                    onClick={this.makeActive.bind(this)}
                                    className="blue-text"
                                    style={{ fontSize: 32 }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="container   pb-5 mb-5 pt-3">
                        {this.state.subCategories &&
                            this.state.subCategories.map((item) => (
                                <div
                                    data-name={item.name}
                                    className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3"
                                    onClick={this.selectSubCatType.bind(this)}>
                                    <div className="col-10">
                                        <p className= style={{ fontSize: "16px" }}>
                                            {item.name}
                                        </p>
                                    </div>
                                    <div className="col-2">
                                        <NavigateNextIcon />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className={this.state.active === 3 ? "" : "d-none"}>
                    <div className="container  pt-2 pb-2 mb-2">
                        <div className="row no-gutters">
                            <div className="col-10">
                                <h6>Select a State </h6>
                            </div>

                            <div className="col-2" style={{ textAlign: "right" }}>
                                <Close
                                    data-active={2}
                                    onClick={this.makeActive.bind(this)}
                                    className="blue-text"
                                    style={{ fontSize: 32 }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="container   pb-3 pt-3">
                        {this.state.states.map((item) => (
                            <div
                                data-name={item}
                                className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3  "
                                onClick={this.selectState.bind(this)}>
                                <div className="col-10">
                                    <p className= style={{ fontSize: "16px" }}>
                                        {item}
                                    </p>
                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={this.state.active === 4 ? "" : "d-none"}>
                    <div className="container pt-4  pl-2 mt-3 mb-5 pb-5">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h5 className={"blue-text text-heading"}>Create Search</h5>
                            </div>
                        </div>

                        <div className="row no-gutters mt-3">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Add Details</h3>
                            </div>
                        </div>
                        <div className="row no-gutters justify-content-center mt-5">
                            <div className="col-12 mb-2">
                                <div className={"custom-label text-bold text-blue mb-1"}>
                                    Link a product (Optional)
                                </div>

                                <FormControl variant="outlined" className={classes.formControl}>
                                    {/*<InputLabel htmlFor="outlined-age-native-simple">Link a product (Optional)</InputLabel>*/}
                                    <Select
                                        name="product"
                                        // label={"Link a product"}
                                        native
                                        onChange={this.handleChange.bind(this, "product")}
                                        inputProps={{
                                            name: "product",
                                            id: "outlined-age-native-simple",
                                        }}>
                                        <option value={null}>Select</option>

                                        {/*{this.props.productList.map((item) =>*/}
                                        {this.props.productList
                                            .filter((item) => item.listing_id === null)
                                            .map((item) => (
                                                <option value={item.product._key}>
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
                                        <option value={null}>Select</option>

                                        {this.state.sites.map((item) => (
                                            <option value={item._key}>
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
                                        minDate={new Date()}
                                        inputVariant="outlined"
                                        variant={"outlined"}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        // label="Required From"
                                        format="DD/MM/yyyy"
                                        value={this.state.dateRequiredFrom}
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
                                        value={this.state.dateRequiredBy}
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
                        </div>
                    </div>
                </div>

                <div className={this.state.active === 6 ? "" : "d-none"}>
                    {/*<div className="container  pt-3 pb-5 mb-5">*/}

                    {/*<div className="row no-gutters justify-content-end">*/}

                    {/*<div className="col-auto">*/}

                    {/*<button className="btn   btn-link text-dark menu-btn">*/}
                    {/*<Close onClick={this.selectCreateSearch} className="" style={{ fontSize: 32 }} />*/}

                    {/*</button>*/}
                    {/*</div>*/}

                    {/*</div>*/}
                    {/*</div>*/}

                    <div className="container   pb-4 pt-4">
                        <div className="row justify-content-center pb-2 pt-4 ">
                            <div className="col-auto">
                                <h4 className={"green-text text-heading text-bold"}>Success!</h4>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-auto pb-4 pt-5">
                                <img className={"search-icon-middle"} src={SearchIcon} alt="" />
                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">
                            <div className="col-auto">
                                <p className={"text-blue text-center"}>
                                    Your search has been created. You will be notified when a match
                                    is found.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={this.state.active === 7 ? "" : "d-none"}>
                    {this.state.createSearchData && (
                        <>
                            <div className="container  pt-3 pb-3">
                                <div className="row no-gutters">
                                    <div className="col-auto" style={{ margin: "auto" }}>
                                        <NavigateBefore style={{ fontSize: 32 }} />
                                    </div>

                                    <div
                                        className="col text-center blue-text"
                                        style={{ margin: "auto" }}>
                                        <p>View Search </p>
                                    </div>

                                    <div className="col-auto">
                                        <button className="btn   btn-link text-dark menu-btn">
                                            <Close
                                                onClick={this.selectCreateSearch}
                                                className=""
                                                style={{ fontSize: 32 }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="container ">
                                <div className="row container-gray justify-content-center pb-5 pt-5">
                                    <div className="col-auto pb-5 pt-5">
                                        <img
                                            className={"my-search-icon-middle"}
                                            src={SearchIcon}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-start pb-3 pt-4 listing-row-border">
                                    <div className="col-12">
                                        <p className={"green-text text-heading"}>
                                            @{this.state.createSearchData.org_id}
                                        </p>
                                    </div>
                                    <div className="col-12 mt-2">
                                        <h5 className={"blue-text text-heading"}>
                                            {this.state.createSearchData.name}
                                        </h5>
                                    </div>
                                </div>

                                <div className="row justify-content-start pb-3 pt-3 listing-row-border">
                                    <div className="col-auto">
                                        <p
                                            style={{ fontSize: "16px" }}
                                            className={"text-gray-light "}>
                                            {this.state.createSearchData.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="row justify-content-start pb-4 pt-3 ">
                                    <div className="col-auto">
                                        <h6 className={""}>Item Details</h6>
                                    </div>
                                </div>
                            </div>

                            <div className={"container pb-5"}>
                                <div className="row  justify-content-start search-container  pb-3 ">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={ListIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>
                                        <p
                                            style={{ fontSize: "18px" }}
                                            className="text-mute text-gray-light mb-1">
                                            Category
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">
                                            {this.state.createSearchData.category} >
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">
                                            {this.state.createSearchData.type}
                                        </p>
                                    </div>
                                </div>
                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={AmountIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>
                                        <p
                                            style={{ fontSize: "18px" }}
                                            className="text-mute text-gray-light mb-1">
                                            Amount
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">
                                            {this.state.createSearchData.volume}
                                            {this.state.createSearchData.units}
                                        </p>
                                    </div>
                                </div>

                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={StateIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>
                                        <p
                                            style={{ fontSize: "18px" }}
                                            className="text-mute text-gray-light mb-1">
                                            State
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">
                                            {this.state.createSearchData.state}
                                        </p>
                                    </div>
                                </div>

                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={CalenderIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>
                                        <p
                                            style={{ fontSize: "18px" }}
                                            className="text-mute text-gray-light mb-1">
                                            Required From
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">
                                            {moment(
                                                this.state.createSearchData.require_after.value
                                            ).format("DD MMM YYYY")}
                                        </p>
                                    </div>
                                </div>

                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={CalenderIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>
                                        <p
                                            style={{ fontSize: "18px" }}
                                            className="text-mute text-gray-light mb-1">
                                            Required by
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">
                                            {moment(
                                                this.state.createSearchData.expiry.value
                                            ).format("DD MMM YYYY")}
                                        </p>
                                    </div>
                                </div>
                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={MarkerIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>
                                        <p
                                            style={{ fontSize: "18px" }}
                                            className="text-mute text-gray-light mb-1">
                                            Location
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">
                                            {this.state.site.name},{this.state.site.contact}
                                        </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">
                                            {this.state.site.address}
                                        </p>
                                    </div>
                                </div>

                                {/*<BottomAppBar />*/}
                            </div>
                        </>
                    )}
                </div>

                <div className={this.state.active === 8 ? "" : "d-none"}>
                    <HeaderWhiteBack history={this.props.history} heading={"Preview Matches"} />

                    <div className="container   pb-4 ">
                        {this.state.resourcesMatched.map((item) => (
                            <ResourceItem item={item} />
                        ))}
                    </div>
                </div>

                {this.state.productSelection && (
                    <div>
                        <HeaderWhiteBack
                            history={this.props.history}
                            heading={this.state.item && this.state.item.name}
                        />

                        <div className="container   pb-4 pt-4">
                            {/*<div className="row ">*/}

                            {/*<div className="col-auto pb-4 pt-4">*/}
                            {/*<img className={"search-icon-middle"}  src={CubeBlue} alt=""/>*/}

                            {/*</div>*/}
                            {/*</div>*/}
                            <div className="row  pb-2 pt-4 ">
                                <div className="col-10">
                                    <h3 className={"blue-text text-heading"}>Add Product</h3>
                                </div>
                                <div className="col-2 text-right">
                                    <Close
                                        onClick={this.showProductSelection}
                                        className="blue-text"
                                        style={{ fontSize: 32 }}
                                    />
                                </div>
                            </div>

                            {/*<div className="row  pb-4 pt-2 ">*/}

                            {/*<div className="col-10">*/}
                            {/*<p className={"text-blue text-bold "}>What is the purpose of your new product? </p>*/}

                            {/*</div>*/}
                            {/*</div>*/}
                        </div>

                        <div className={"row justify-content-center create-product-row"}>
                            <div className={"col-11"}>
                                <form onSubmit={this.handleSubmitProduct}>
                                    <div className="row no-gutters justify-content-center ">
                                        <div className="col-12 mb-2">
                                            <div
                                                className={"custom-label text-bold text-blue mb-1"}>
                                                What is the purpose of your new product?
                                            </div>
                                            <FormControl
                                                variant="outlined"
                                                className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                                <Select
                                                    native
                                                    onChange={this.handleChangeProduct.bind(
                                                        this,
                                                        "purpose"
                                                    )}
                                                    inputProps={{
                                                        name: "purpose",
                                                        id: "outlined-age-native-simple",
                                                    }}>
                                                    <option value={null}>Select</option>

                                                    {this.state.purpose.map((item) => (
                                                        <option value={item}>{item}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {this.state.errorsProduct["purpose"] && (
                                                <span className={"text-mute small"}>
                                                    <span style={{ color: "red" }}>* </span>
                                                    {this.state.errorsProduct["purpose"]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="col-12 mb-2">
                                            <div
                                                className={"custom-label text-bold text-blue mb-1"}>
                                                Which category is your product located within?
                                            </div>
                                            <FormControl
                                                variant="outlined"
                                                className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                                <Select
                                                    native
                                                    onChange={this.handleChangeProduct.bind(
                                                        this,
                                                        "category"
                                                    )}
                                                    inputProps={{
                                                        name: "category",
                                                        id: "outlined-age-native-simple",
                                                    }}>
                                                    <option value={null}>Select</option>

                                                    {this.state.categories.map((item) => (
                                                        <option value={item}>{item.name}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {this.state.errorsProduct["category"] && (
                                                <span className={"text-mute small"}>
                                                    <span style={{ color: "red" }}>* </span>
                                                    {this.state.errorsProduct["category"]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-12 mt-4">
                                            <div
                                                className={"custom-label text-bold text-blue mb-1"}>
                                                Give your product a title
                                            </div>

                                            <TextField
                                                id="outlined-basic"
                                                type={"text"}
                                                label="Title"
                                                variant="outlined"
                                                fullWidth={true}
                                                name={"title"}
                                                onChange={this.handleChangeProduct.bind(
                                                    this,
                                                    "title"
                                                )}
                                            />

                                            {this.state.errorsProduct["title"] && (
                                                <span className={"text-mute small"}>
                                                    <span style={{ color: "red" }}>* </span>
                                                    {this.state.errorsProduct["title"]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="col-12 mt-4">
                                            <div
                                                className={"custom-label text-bold text-blue mb-1"}>
                                                Give it a description
                                            </div>

                                            <TextField
                                                multiline
                                                rows={4}
                                                type={"text"}
                                                id="outlined-basic"
                                                label="Description"
                                                variant="outlined"
                                                fullWidth={true}
                                                name={"description"}
                                                onChange={this.handleChangeProduct.bind(
                                                    this,
                                                    "description"
                                                )}
                                            />

                                            {this.state.errorsProduct["description"] && (
                                                <span className={"text-mute small"}>
                                                    <span style={{ color: "red" }}>* </span>
                                                    {this.state.errorsProduct["description"]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="col-12 mt-4 mb-5">
                                            <button
                                                type={"submit"}
                                                className={
                                                    "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                }>
                                                Finish
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {(this.state.active === 0 ||
                    this.state.active === 4 ||
                    this.state.active === 6 ||
                    this.state.active === 7) && (
                    <React.Fragment>
                        <CssBaseline />

                        <AppBar
                            position="fixed"
                            color="#ffffff"
                            className={classesBottom.appBar + "  custom-bottom-appbar"}>
                            {/*<ProgressBar now={this.state.progressBar}  />*/}
                            {this.state.page < 4 && (
                                <LinearProgress
                                    variant="determinate"
                                    value={this.state.progressBar}
                                />
                            )}
                            <Toolbar>
                                {this.state.active < 7 && (
                                    <div
                                        className="row  justify-content-center search-container "
                                        style={{ margin: "auto" }}>
                                        <div className="col-auto">
                                            {this.state.page > 1 && this.state.page < 4 && (
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
                                            {this.state.page === 1 && (
                                                <button
                                                    onClick={this.handleNext}
                                                    type="button"
                                                    className={
                                                        this.state.nextBlue
                                                            ? "btn-next shadow-sm mr-2 btn btn-link blue-btn   mt-2 mb-2 "
                                                            : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "
                                                    }>
                                                    Next
                                                </button>
                                            )}

                                            {this.state.page === 2 && (
                                                <button
                                                    onClick={this.handleNext}
                                                    type="button"
                                                    className={
                                                        this.state.nextBlueAddDetail
                                                            ? "btn-next shadow-sm mr-2 btn btn-link blue-btn       mt-2 mb-2 "
                                                            : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "
                                                    }>
                                                    Next
                                                </button>
                                            )}

                                            {this.state.page === 3 && (
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
                                )}

                                {this.state.active === 7 && (
                                    <div
                                        className="row  justify-content-center search-container "
                                        style={{ margin: "auto" }}>
                                        <div className="col-auto">
                                            <button
                                                type="button"
                                                onClick={this.selectCreateSearch}
                                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                Cancel Search
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <Link
                                                to={"/matches/" + this.state.createSearchData.id}
                                                type="button"
                                                // onClick={this.handleNext}
                                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                View ({this.state.createSearchData.resources.length}
                                                ) Matches
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </Toolbar>
                        </AppBar>
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
                                                        type={"number"}
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

function UnitSelect(props) {
    const classes = useStylesSelect();
    const [state, setState] = React.useState({
        unit: "",
        name: "hai",
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Unit</InputLabel>
                <Select
                    name={"unit"}
                    native
                    value={state.age}
                    onChange={handleChange}
                    inputProps={{
                        name: "unit",
                        id: "outlined-age-native-simple",
                    }}>
                    {props.units.map((item) => (
                        <option value={"Kg"}>{item}</option>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

function SiteSelect(props) {
    const classes = useStylesSelect();
    const [state, setState] = React.useState({
        unit: "",
        name: "hai",
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Deliver To</InputLabel>
                <Select
                    inputVariant="outlined"
                    variant={"outlined"}
                    name={"site"}
                    native
                    value={state}
                    onChange={handleChange}
                    label="Age"
                    inputProps={{
                        name: "unit",
                        id: "outlined-age-native-simple",
                    }}>
                    <option value={null}>Select</option>

                    {props.sites.map((item) => (
                        <option value={item.id}>{item.name + "(" + item.address + ")"}</option>
                    ))}
                </Select>
            </FormControl>
        </div>
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
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SearchForm);
