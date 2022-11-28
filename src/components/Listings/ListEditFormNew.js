import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {makeStyles} from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import _ from "lodash";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import CustomizedInput from "../FormsUI/ProductForm/CustomizedInput";
import SiteFormNew from "../Sites/SiteFormNew";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import ProductTreeView from "../ProductTreeView";
import ProductItem from "../Products/Item/ProductItem";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import GlobalDialog from "../RightBar/GlobalDialog";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import {DesktopDatePicker} from "@mui/x-date-pickers";

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

class ListEditFormNew extends Component {
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
            types: ["sale", "rental"],
            addressMismatch:false,
            selectedLoading:false,
            showTree:false
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


        if (this.state.item)
        this.setState({
            dateRequiredBy: this.state.item.listing.expire_after_epoch_ms,
            dateRequiredFrom: this.state.item.listing.available_from_epoch_ms,
        });

        // let catSelected = this.state.categories.filter(
        //     (item) => item.name === this.state.item.listing.category
        // )[0];
        //
        // var subCategories = catSelected.types;
        //
        // this.setState({
        //     catSelected: catSelected,
        // });
        //
        // this.setState({
        //     subCategories: subCategories,
        // });
        //
        // let subCatSelected = subCategories.filter(
        //     (item) => item.name === this.state.item.listing.type
        // )[0];
        //
        // if (subCatSelected) {
        //     var states = subCatSelected.state;
        //
        //     var units = subCatSelected.units;
        //
        //     this.setState({
        //         subCatSelected: subCatSelected,
        //     });
        //
        //     this.setState({
        //         states: states,
        //         units: units,
        //     });
        // }
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

    showProductSelectionTree=()=> {

        this.setState({
            showTree:!this.state.showTree
        })
    }

    handleValidationEdit=()=> {

        let fields = this.state.fields;

        let validations= [
                // validateFormatCreate("product", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("title", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("deliver", [{check: Validators.required, message: 'Required'}], fields)

            ]


            if (!this.state.free){
                validations .push(
                    validateFormatCreate("price", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'Invalid input.'}], fields)
                )
            }




        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});


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

    toggleSite(refresh) {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });

        if (refresh){
            this.getSites()
        }
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
                // category: dataFORM.get("category"), //this.state.catSelected.name,
                // type: dataFORM.get("type"),
                // state: dataFORM.get("state"),
                available_from_epoch_ms: new Date(this.state.dateRequiredFrom).getTime(),
                expire_after_epoch_ms: new Date(this.state.dateRequiredBy).getTime(),

                // "require_after_epoch_ms":  new Date(dataFORM.get("dateRequiredFrom")).getTime(),
                // "expire_after_epoch_ms":  new Date(dataFORM.get("dateRequiredBy")).getTime(),
            },
            // "site_id": this.state.siteSelected,
            // "product_id":this.state.productSelected
        };

        axios
            .post(baseUrl + "listing", data)
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




    handleChange=(value,field)=>{


        if (field==="deliver") {

            this.setState({
                siteSelected:this.props.siteList.filter((site)=> site._key===value)[0]
            })



            if (this.state.previewProduct&&this.state.previewProduct.site_id&&
                value!=this.state.previewProduct.site_id.replace("Site/","")){

                this.showAddressMismatch()
            }

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



    }


    // handleChange(field, event) {
    //     let fields = this.state.fields;
    //     fields[field] = event.target.value;
    //
    //     const value = event.target.value;
    //
    //     this.setState({
    //         [field]: value,
    //     });
    //
    //     this.setState({ fields });
    //
    //     this.setState({
    //         price: fields["price"],
    //     });
    //
    //     if (field === "product") {
    //         this.setState({
    //             productSelected: event.target.value,
    //         });
    //     }
    //
    // }

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

    loadSelectedProduct = (id) =>  {

        this.setState({
            selectedLoading:true
        })

        try {
            axios
                .get(baseUrl + "product/" + (id))
                .then(
                    (response) => {

                        if (response.data&&response.data.data) {
                            var responseAll = response.data;

                            let product=responseAll.data.product
                            product.site_id=responseAll.data.site_id
                            this.setState({
                                previewProduct: product
                            })
                            this.setState({
                                selectedLoading: false
                            })
                        }else{
                            this.setState({
                                selectedLoading: false
                            })
                        }

                    },
                    (error) => {
                        this.setState({
                            selectedLoading: false
                        })

                    }
                )

        }catch (e) {
            this.setState({
                selectedLoading: false
            })

        }

    };

    productSelected=(productId)=> {

        this.loadSelectedProduct(productId)

        this.setState({
            selectedProductId: productId,
        });

        this.getPreviewImage(productId);

        let fields = this.state.fields;

        fields["product"] = productId;

        this.setState({ fields });
    }

    getProductsNoParentNoListingNoRelease=async () => {

        const url = baseUrl + "seek?name=Product&no_parent=true&relation=belongs_to&count=false&no-from-relation=Listing:listing_of&no-from-relation=ProductRelease:release_for";


        let items = await axios.get(url).catch((error) => {


            // fetchErrorMessage(error)

        });


        if (items)
            this.setState({
                items: items.data.data
            })
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.loadProducts(this.props.userDetail.token);
        this.getSites();
        this.getFiltersCategories();

        if (this.props.item) {



            this.setState({
                free: this.props.item.listing.price.value==0?true:false,
                startDate: this.props.item.listing.available_from_epoch_ms,
                endDate: this.props.item.listing.expire_after_epoch_ms,
                previewProduct:this.props.item.product
            })
        }
        this.getProductsNoParentNoListingNoRelease();

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


    updateListing=(e)=> {


        e.preventDefault()
        e.stopPropagation()


        if (!this.handleValidationEdit()){

            this.setState({
                showFieldErrors:true
            })
            return
        }else {
            this.setState({
                showFieldErrors:true
            })
        }






        try {
            const data = new FormData(e.target);


            this.setState({
                btnLoading: true,
                loading: true
            });

            const title = data.get("title");
            const description = data.get("description");
            const listing_type = data.get("listing_type");
            const available_from_epoch_ms = new Date(this.state.startDate).getTime()
            const expire_after_epoch_ms = new Date(this.state.endDate).getTime()


            // const purpose = data.get("purpose");
            // const condition = data.get("condition");
            // const category = data.get("category");


            const price = {
                    value: this.state.free ? 0 : this.state.fields["price"],
                    currency: "gbp",
                },

                postData = {
                    id: this.props.item.listing._key,
                    "product_id": this.state.previewProduct._key,
                    site_id: data.get("deliver"),


                    update: {
                        name: title,
                        description: description,
                        available_from_epoch_ms: available_from_epoch_ms,
                        expire_after_epoch_ms: expire_after_epoch_ms,
                        price: price,
                        listing_type: listing_type,
                    }


                };


            // let dataNew= {
            //     name: this.state.fields["title"],
            //     description: this.state.fields["description"],
            //     category: this.state.fields["category"],
            //     type: this.state.fields["type"],
            //     units: this.state.fields["units"],
            //     volume: this.state.fields["volume"],
            //     state: this.state.fields["state"],
            //     listing_type: this.state.fields["listing_type"],
            //
            //     available_from_epoch_ms: new Date(this.state.startDate).getTime(),
            //     expire_after_epoch_ms: new Date(this.state.endDate).getTime(),
            //     price: {
            //         value: this.state.free ? 0 : this.state.fields["price"],
            //         currency: "gbp",
            //     },
            // }




            axios
                .post(
                    baseUrl + "listing",
                    postData,
                )
                .then((res) => {

                    this.setState({

                        showFieldErrors: false,
                        createListingError: null
                    });

                    this.setState({
                        loading: false
                    })

                    this.props.hide()

                })
                .catch((error) => {

                    this.setState({
                        loading: false
                    })

                    if (error && error.response) {

                        this.setState({
                            notFoundError: true,
                            createListingError: error.response.data.errors[0].message
                        })
                    }

                });
        }

        catch (e){
            console.log(e)
        }
    }


    render() {


        return (
            <>

                <>



                    <form onSubmit={this.updateListing} >


                        <div className="row add-listing-container  pt-2">
                            <div className={"col-12"}>
                                <div  className={""}>
                                    <div className="row no-gutters justify-content-center mt-2">
                                        <div className="col-12">
                                            <TextFieldWrapper
                                                initialValue={this.props.item&&this.props.item.listing.name}
                                                onChange={(value)=>this.handleChange(value,"title")}
                                                error={this.state.showFieldErrors&&this.state.errors["title"]}
                                                name="title"
                                                title="Title"
                                                fullWidth={true}
                                            />

                                        </div>

                                        <div className="col-12 mt-2">

                                            <TextFieldWrapper
                                                initialValue={this.props.item&&this.props.item.listing.description}
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

                                        {/*<div className="col-12 mt-2 ">*/}
                                        {/*    <div*/}
                                        {/*        className={*/}
                                        {/*            "custom-label text-bold text-blue mb-1"*/}
                                        {/*        }>*/}


                                        {/*        <ActionIconBtn onClick={this.showProductSelectionTree}*/}
                                        {/*              style={{float:"right"}}>*/}
                                        {/*            <CloseButtonPopUp />*/}
                                        {/*        </ActionIconBtn>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="col-12 mt-2 d-none ">

                                            <>
                                            <div
                                                className={
                                                    "custom-label text-bold text-blue mb-1"
                                                }>
                                                Linked product
                                                <span onClick={this.showProductSelection}
                                                      style={{float:"right"}}
                                                      className={
                                                          " forgot-password-link "
                                                      }>
                                                    Add new product
                                                </span>
                                            </div>
                                            <span className={"text-gray-light"}>Search Products.... </span>

                                            </>
                                            <div className="row">
                                                  <div className="col-4">
                                                    {this.state.items&&this.state.items.length>0&&
                                                    <ProductTreeView
                                                        items={this.state.items}
                                                        triggerCallback={(productId) => {

                                                            this.handleChange(productId,"product")
                                                            this.productSelected(productId)
                                                        }
                                                        }
                                                        className={"mb-4"}
                                                    />
                                                    }
                                                </div>
                                                <div className="col-8 pt-2" style={{marginTop:"75px"}}>

                                                    {(!this.state.selectedLoading&&this.state.previewProduct)&&
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


                                            <div className={"d-none"}>
                                                <TextFieldWrapper
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

                        <div className="row add-listing-container pt-2">
                            <div className={"col-12"}>
                                <div  className={""}>
                                    <div className="row no-gutters justify-content-center mt-2">
                                        <div className="col-12 ">
                                            <div className="row ">

                                                <div className="col-12 mb-2">

                                                    <SelectArrayWrapper
                                                        valueKey={"_key"}
                                                        initialValue={this.props.item&&this.props.item.site._key}
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
                                                            " forgot-password-link "
                                                        }>Add new</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row  justify-content-start ">
                                        <div className="col-4 ">
                                            <div
                                                className={
                                                    "custom-label text-bold text-blue "
                                                }>
                                                Available From
                                            </div>

                                            <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                <DesktopDatePicker

                                                    className={"full-width-field"}
                                                    disableHighlightToday={true}
                                                    minDate={new Date()}
                                                    // label="Required By"
                                                    inputVariant="outlined"
                                                    variant={"outlined"}
                                                    margin="normal"
                                                    id="date-picker-dialog-1"
                                                    inputFormat="dd/MM/yyyy"
                                                    value={this.state.startDate}
                                                    renderInput=   {({ inputRef, inputProps, InputProps }) => (
                                                        <div className="custom-calander-container">
                                                            <CustomizedInput ref={inputRef} {...inputProps} />
                                                            <span className="custom-calander-icon">{InputProps?.endAdornment}</span>
                                                        </div>
                                                    )}
                                                    // renderInput={(params) => <CustomizedInput {...params} />}
                                                    onChange={(value)=>this.handleChange(value,"startDate")}

                                                />
                                            </LocalizationProvider>

                                            {this.state.showFieldErrors&&this.state.startDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                        </div>

                                        <div className="col-4  ">

                                            <div
                                                className={
                                                    "custom-label text-bold text-blue "
                                                }>
                                                Available By
                                            </div>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                <DesktopDatePicker
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
                                                    renderInput=   {({ inputRef, inputProps, InputProps }) => (
                                                        <div className="custom-calander-container">
                                                            <CustomizedInput ref={inputRef} {...inputProps} />
                                                            <span className="custom-calander-icon">{InputProps?.endAdornment}</span>
                                                        </div>
                                                    )}
                                                    // renderInput={(params) => <CustomizedInput {...params} />}
                                                    onChange={(value)=>this.handleChange(value,"endDate")}

                                                />
                                            </LocalizationProvider>
                                            {this.state.showFieldErrors&&this.state.endDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                        </div>

                                        <div className="col-4">

                                            <SelectArrayWrapper

                                                // select={"Select"}

                                                initialValue={this.props.item?this.props.item.listing.listing_type:""}

                                                onChange={(value)=> {
                                                    this.handleChange(value,"listing_type")

                                                }}
                                                options={this.state.types} name={"listing_type"} title="Type"/>


                                        </div>
                                    </div>

                                    <div className="row no-gutters justify-content-start ">

                                        <div className="col-12 mb-3">
                                            <div className="row">

                                                <div className="col-md-6 col-sm-12 col-xs-12">
                                                    <div className="row mt-3">


                                                        <div className="col-md-12 col-sm-12 col-xs-12 mb-2">
                                                            <button
                                                                type="button"
                                                                onClick={this.toggleSale}
                                                                className={
                                                                    !this.state.free
                                                                        ? "col-12 btn-select-free green-bg"
                                                                        : "btn-select-free"
                                                                }>
                                                                For Sale
                                                            </button>

                                                            <button
                                                                type="button"
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
                                                                        initialValue={this.props.item&&this.props.item.listing.price&&this.props.item.listing.price.value?this.props.item.listing.price.value:""}
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
                    <div className="row  text-center ">

                        <div className="col-12 mb-3 justify-content-center">

                    <GreenButton
                        title={"Update"}
                        type={"submit"}
                        loading={this.state.loading}
                        disabled={this.state.loading||this.state.isSubmitButtonPressed}

                    >
                    </GreenButton>
                        </div>
                    </div>

                    </form>



                    <GlobalDialog size={"xs"}
                                  hide={this.showAddressMismatch} show={this.state.addressMismatch}
                                  heading={"Address"} >

                        <div className={"col-12 mb-3"}>
                            <p>Selected address do not match the linked product's address , do you still want to continue with the different address ?</p>
                        </div>


                        <div
                            className={"col-6"}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueBorderButton
                                type="button"
                                title={"Ok"}
                                onClick={this.showAddressMismatch}
                            >

                            </BlueBorderButton>
                        </div>

                    </GlobalDialog>


                    <GlobalDialog size={"xs"} hide={this.goToStepOne} show={this.state.createListingError} heading={"Error"} >

                        <div className={"col-12 mb-3"}>
                            {this.state.createListingError}
                        </div>


                        <div
                            className={"col-6"}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueBorderButton
                                type="button"

                                title={" Edit Listing"}

                                onClick={this.goToStepOne}
                            >

                            </BlueBorderButton>
                        </div>

                    </GlobalDialog>




                    <GlobalDialog

                        size={"lg"}
                        hide={this.toggleSite}
                        show={this.state.showCreateSite}
                        heading={"Add new site"}>
                        <>
                            <div className="col-12 ">

                                <SiteFormNew refresh={()=>this.toggleSite(true)} />
                            </div>
                        </>
                    </GlobalDialog>

                </>
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
export default connect(mapStateToProps, mapDispachToProps)(ListEditFormNew);
