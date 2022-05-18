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
import {capitalize, fetchErrorMessage} from "../../Util/GlobalFunctions";
import Layout from "../../components/Layout/Layout";
import {Link} from "react-router-dom";
import BlueBorderButton from "../../components/FormsUI/Buttons/BlueBorderButton";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import GreenButton from "../../components/FormsUI/Buttons/GreenButton";
import SiteFormNew from "../../components/Sites/SiteFormNew";
import ListForm from "../../components/Listings/ListForm";


class ListFormPage extends Component {
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
            showFieldErrors:false,
            items:[],
            loading:false,
            types: ["sale", "rental"],
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

        try {
            axios
                .get(baseUrl + "product/" + (id)
                )
                .then(
                    (response) => {

                        if (response.data&&response.data.data) {
                            var responseAll = response.data;

                            this.setState({
                                previewProduct: responseAll.data.product
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

    toggleSite(refresh) {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });


        if (refresh){
            this.props.loadSites();

        }
    }

    getSites() {
        this.props.loadSites(this.props.userDetail.token);
    }


    createListing() {

        this.setState({
            loading:true
        })

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
              listing_type: this.state.fields["listing_type"],

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

                this.setState({
                    loading:false
                })

                // this.props.history.push("/"+res.data.data._key)
            })
            .catch((error) => {

                this.setState({
                    loading:false
                })

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

        // this.props.loadProductsWithoutParentNoListing()
        this.getProductsNoParentNoListingNoRelease();

        this.props.loadSites(this.props.userDetail.token);
    }


    getProductsNoParentNoListingNoRelease=async () => {

        const url = baseUrl + "seek?name=Product&no_parent=true&&relation=&count=false&no-from-relation=Listing:listing_of&no-from-relation=ProductRelease:release_for";


        let items = await axios.get(url).catch((error) => {

             fetchErrorMessage(error)

        });


        if (items)
        this.setState({
            items: items.data.data
        })
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
            <Layout hideFooter>
                <div className="container  pb-4 pt-4">
             <ListForm/>
                </div>
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
export default connect(mapStateToProps, mapDispachToProps)(ListFormPage);
