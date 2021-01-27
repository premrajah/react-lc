import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import SendIcon from '../../img/send-icon.png';
import Select from '@material-ui/core/Select';
import { Alert} from 'react-bootstrap';
import LinkGray from '../../img/icons/link-icon.png';

import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '../../img/icons/search-icon.png';
import { Link } from "react-router-dom";
import InputLabel from '@material-ui/core/InputLabel';
import Close from '@material-ui/icons/Close';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import '../../Util/upload-file.css'
import { Cancel } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import clsx from 'clsx';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from "@material-ui/core/styles/index";
import CalGrey from '../../img/icons/calender-dgray.png';
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import AddPhotoIcon from '@material-ui/icons/AddAPhoto';
import ListIcon from '../../img/icons/list.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import LinearProgress from '@material-ui/core/LinearProgress';
import HeaderWhiteBack from '../header/HeaderWhiteBack'
import ResourceItem from '../item/ResourceItem'
import PumpImg from '../../img/components/Pump_Assembly_650.png';
import ProductBlue from '../../img/icons/product-blue.png';
import MaceratingImg from '../../img/components/Macerating_unit_1400.png';
import DewateringImg from '../../img/components/Dewatering_Unit_1950.png';
import CameraGray from '../../img/icons/camera-gray.png';
import PlusGray from '../../img/icons/plus-icon.png';
import ControlImg from '../../img/components/Control_Panel_1450.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import ProductForm from './ProductForm'
import SubProductView from './SubProductView'
import ProductView from './ProductView'
import FormHelperText from '@material-ui/core/FormHelperText';
import MomentUtils from '@date-io/moment';
import ProductItem from '../../components/ProductItemNew'
import ProductExpandItem from '../../components/ProductExpandItem'
import ItemDetailPreview from '../../components/ItemDetailPreview'

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    DatePicker
} from '@material-ui/pickers';
import moment from "moment/moment";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,

    },
}));



class ListForm extends Component {



    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            activePage: 0,  //0 logn. 1- sign up , 3 -search,
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
            yearsList:[],
            purpose: ["defined", "prototype", "aggregate"],
            previewImage:null


        }



        this.handleBack = this.handleBack.bind(this)
        this.handleNext = this.handleNext.bind(this)
        this.createListing = this.createListing.bind(this)
        this.getSites = this.getSites.bind(this)
        this.toggleAddComponent = this.toggleAddComponent.bind(this)
        this.toggleSite = this.toggleSite.bind(this)
        this.toggleProductList = this.toggleProductList.bind(this)
        this.toggleFree = this.toggleFree.bind(this)
        this.toggleSale = this.toggleSale.bind(this)
        this.makeFirstActive=this.makeFirstActive.bind(this)
        this.makeActive=this.makeActive.bind(this)
        this.getPreviewImage=this.getPreviewImage.bind(this)
        this.showProductSelection = this.showProductSelection.bind(this)



    }


    getPreviewImage(productSelectedKey){


        axios.get(baseUrl + "product/"+productSelectedKey+"/artifact",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;
                    console.log("product image  response")
                    console.log(responseAll)

                    if(responseAll.length>0) {
                        this.setState({

                            previewImage: responseAll[0].blob_url

                        })
                    }

                },
                (error) => {

                    console.log("produt image error")
                    console.log(error)

                }
            );

    }

    handleNextOld() {


        if (this.state.page === 1&&this.handleValidateOne()) {

            this.setState({

                page: 2,
                progressBar: 66
            })


        }
        else  if (this.state.page === 2&&this.handleValidateTwo()) {

            this.setState({

                page: 3,
                progressBar: 100
            })


            console.log(this.state.fields)
        }


        else  if (this.state.page === 3) {





            this.createListing()

        }

        else  if (this.state.page === 4) {

            this.props.history.push("/" + this.state.listResourceData._key)

        }

    }



    handleNext() {


        if (this.state.page === 1&&this.handleValidateOne()) {

            this.setState({

                page: 2,
                progressBar: 66
            })


            console.log(this.state.fields)

        }
        else  if (this.state.page === 2&&this.handleValidateTwo()) {

            this.setState({

                page: 3,
                progressBar: 100
            })


            console.log(this.state.fields)
        }


        else  if (this.state.page === 3) {





            this.createListing()
            // console.log(this.state.fields)
        }

        else  if (this.state.page === 4) {

            this.props.history.push("/" + this.state.listResourceData._key)

        }

    }

    handleBackOld() {


        if (this.state.page === 3) {

            this.setState({

                page: 2,
                progressBar: 66
            })


        }


        else  if (this.state.page === 2) {

            this.setState({

                page: 1,
                progressBar: 33
            })



        }

    }


    handleBack() {

        console.log(this.state.fields)



        if (this.state.page === 3) {

            this.setState({

                page: 2,
                progressBar: 66
            })


        }


        else  if (this.state.page === 2) {

            this.setState({

                page: 1,
                progressBar: 33
            })



        }

    }

    handleChange(field, e) {



        let fields = this.state.fields;

        fields[field] = e.target.value;


        this.setState({ fields });


        this.setState({

            price: fields["price"]
        })



        if (field === "product"){


            this.setState({

                productSelected: e.target.value

            })


            this.getPreviewImage(e.target.value)
        }


        if (field === "deliver"){

            this.setState({

                siteSelected: this.state.sites.filter((item)=> item._key===e.target.value)[0]

            })

            console.log(this.state.siteSelected)

        }



        if (this.state.page===1) {

            this.handleValidateOne()
        }

        if (this.state.page===2) {

            this.handleValidateTwo()
        }





    }



    handleValidateOne(){


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


        if (!fields["product"]) {
            formIsValid = false;
            errors["product"] = "Required";
        }




        console.log("validation one error")
        console.log(errors)


        this.setState({
            nextBlue: formIsValid,
            errors: errors
        })


        return formIsValid;



    }



    handleValidateTwo(){


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


        if(!this.state.free){
        if (!fields["price"]) {
            formIsValid = false;
            errors["price"] = "Required";
        }
        }


        console.log("validation two error")

        console.log(errors)



        this.setState({

            nextBlueAddDetail: formIsValid,
            errors: errors
        })


        return formIsValid;



    }

    handleChangeDateStartDate = date => {


        this.setState({

            startDate : date

        })


        let fields = this.state.fields;
        fields["startDate"] = date;

        this.setState({ fields });



    };



    handleChangeDateEndDate = date => {


        this.setState({

            endDate : date

        })


        let fields = this.state.fields;
        fields["endDate"] = date;

        this.setState({ fields });



    };




    makeActive(event){


        var active = event.currentTarget.dataset.active




        this.setState({

            activePage: parseInt(active)

        })


    }



    toggleSale() {


        this.setState({
            free: false
        })
    }

    toggleFree() {


        this.setState({
            free: true
        })
    }


    toggleProductList() {


        this.setState({
            showProductList: !this.state.showProductList
        })
    }




    toggleSite() {

        this.setState({
            showCreateSite: !this.state.showCreateSite
        })
    }





    getSites() {

        this.props.loadSites(this.props.userDetail.token)


    }


        createListingOld() {


            var data = {}


            data = {

                "name": this.state.fields["title"],
                "description": this.state.fields["description"],
                "available_from_epoch_ms": new Date(this.state.startDate).getTime() ,
                "expire_after_epoch_ms": new Date(this.state.endDate).getTime() ,

                "price": {
                    "value": this.state.free?0:this.state.fields["price"],
                    "currency": "gbp"
                },
            }


        console.log("listing data")
        console.log(data)

        axios.put(baseUrl + "listing",
            {
                listing:data,
                "site_id": this.state.fields["deliver"],
                "product_id": this.state.fields["product"],


            }, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {

                console.log(res.data.data)


                this.setState({
                        listResourceData: res.data.data,
                        page: 4,
                    })



                // this.props.history.push("/"+res.data.data._key)


            }).catch(error => {

            console.log("login error found ")
            console.log(error)

        });

    }


    createListing() {


        var data = {}


        data = {

            "name": this.state.fields["title"],
            "description": this.state.fields["description"],
            "available_from_epoch_ms": new Date(this.state.startDate).getTime() ,
            "expire_after_epoch_ms": new Date(this.state.endDate).getTime() ,

            "price": {
                "value": this.state.free?0:this.state.fields["price"],
                "currency": "gbp"
            },
        }


        console.log("listing data")
        console.log(data)

        axios.put(baseUrl + "listing",
            {
                listing:data,
                "site_id": this.state.fields["deliver"],
                "product_id": this.state.fields["product"],


            }, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {

                console.log(res.data.data)


                this.setState({
                    listResourceData: res.data.data,
                    page: 4,
                })



                // this.props.history.push("/"+res.data.data._key)


            }).catch(error => {

            console.log("login error found ")
            console.log(error)

        });

    }

    toggleAddComponent() {

        this.setState({
            showAddComponent: !this.state.showAddComponent
        })
    }


    showProductSelection(event) {


        var action=event.currentTarget.dataset.id


        this.props.showProductPopUp({type:"create_product",show:true})


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

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
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



    makeFirstActive(){

        this.setState({

            page: 1,
            activePage: 0,
            progressBar: 33

        })


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

                title: fields["title"]
            })
        }


        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Required";
        } else {


            this.setState({
                description: fields["description"]

            })

        }


        if (!fields["serial"]) {
            formIsValid = false;
            errors["serial"] = "Required";
        } else {


            this.setState({

                serial: fields["serial"]
            })
        }
        if (!fields["brand"]) {
            formIsValid = false;
            errors["brand"] = "Required";
        } else {


            this.setState({

                brand: fields["brand"]
            })
        }
        if (!fields["model"]) {
            formIsValid = false;
            errors["model"] = "Required";
        } else {


            this.setState({

                model: fields["model"]
            })
        }




        if (!fields["manufacturedDate"]) {

            formIsValid = false;
            errors["manufacturedDate"] = "Required";

        } else {


            this.setState({

                manufacturedDate: fields["manufacturedDate"]
            })
        }


        if (!fields["model"]) {
            formIsValid = false;
            errors["model"] = "Required";
        } else {


            this.setState({

                model: fields["model"]
            })
        }




        if (this.state.catSelected.name && this.state.subCatSelected.name && this.state.stateSelected) {

        } else {

            formIsValid = false;
            errors["category"] = "Required";

        }


        this.setState({ errors: errors });


        console.log(errors)
        return formIsValid;

    }




    componentWillMount() {
        window.scrollTo(0, 0)
    }

    componentDidMount() {


       this.props.loadSites(this.props.userDetail.token)
       this.props.loadProducts(this.props.userDetail.token)

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



        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
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


    handleSubmitSite = event => {

        event.preventDefault();




        if(this.handleValidationSite()) {


            const form = event.currentTarget;


            console.log(new FormData(event.target))
            // if (this.handleValidationSite()){


            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const email = data.get("email")
            const others = data.get("others")
            const name = data.get("name")
            const contact = data.get("contact")
            const address = data.get("address")
            const phone = data.get("phone")

            // var postData={
            //     "name": name,
            //     "email": email,
            //     "contact" : contact,
            //     "address": address,
            //     "phone": phone,
            //     "others": others
            //
            // }


            console.log("site submit called")
            // console.log(postData)


            axios.put(baseUrl + "site",

                { "site": {
                        "name": name,
                        "email": email,
                        "contact": contact,
                        "address": address,
                        "phone": phone,
                        "others": others
                    }
                }
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {

                    console.log("site added succesfull")

                    // dispatch({type: "SIGN_UP", value : res.data})


                    this.toggleSite()

                    this.getSites()

                }).catch(error => {

                // dispatch(stopLoading())

                // dispatch(signUpFailed(error.response.data.content.message))

                console.log(error)
                // dispatch({ type: AUTH_FAILED });
                // dispatch({ type: ERROR, payload: error.data.error.message });


            });



        }


    }



    handleSubmitComponent = event => {


        event.preventDefault();


        this.toggleAddComponent()

    }


    render() {

        const classes = withStyles();
        const classesBottom = withStyles();


        return (

            <>

                <Sidebar />
                <HeaderDark />

                <div className="container pt-4 p-2 mt-5 ">

                </div>


                <div className={this.state.page === 1 ? "" : "d-none"}>

                    <div className="container add-listing-container   pb-5 pt-5">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Create a Listing
                            </h3>

                            </div>
                        </div>


                        <div onSubmit={this.createListing} className={"mb-5"}>
                            <div className="row no-gutters justify-content-center mt-5">
                                <div className="col-12">
                                    <div className={"custom-label text-bold text-blue mb-1"}>Title</div>

                                    <TextField onChange={this.handleChange.bind(this, "title")} name={"title"} placeholder={"Title"} id="outlined-basic"  variant="outlined" fullWidth={true} />
                                    {this.state.errors["title"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["title"]}</span>}


                                </div>

                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-1"}>Description</div>


                                    <TextField onChange={this.handleChange.bind(this, "description")} name={"description"} placeholder={"Listing description"} id="outlined-basic"  multiline
                                        rows={4} variant="outlined" fullWidth={true} />
                                    {this.state.errors["description"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["description"]}</span>}

                                </div>

                                <div className="col-12 mt-4">

                                    <div className="row ">

                                <div className="col-md-12 col-sm-6 col-xs-12 ">
                                    <div className={"custom-label text-bold text-blue mb-1"}>Link a product</div>


                                    <FormControl variant="outlined" className={classes.formControl}>


                                        <Select

                                            name= "product"
                                            // label={"Link a product"}
                                            native
                                            onChange={this.handleChange.bind(this, "product")}
                                            inputProps={{
                                                name: 'product',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.props.productList.filter((item)=> item.listing_id === null ).map((item) =>
                                                

                                                <option value={item.product._key}>{item.product.name} ({item.sub_product_ids.length} Sub Products)</option>

                                            )}

                                        </Select>
                                        {this.state.errors["product"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["product"]}</span>}


                                        <FormHelperText>Please select the product you wish to sell. <br/>Don’t see it on here?

                                            <span onClick={this.showProductSelection.bind(this)} className={"green-text forgot-password-link text-mute "}> Create a new product</span>

                                        </FormHelperText>
                                    </FormControl>


                                    {this.state.productSelected&&
                                    <>

                                        <ProductExpandItem hideAddAll={true} productId={this.state.productSelected}/>

                                    </>
                                    }

                                </div>


                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>


                <div className={this.state.page === 2 ? "" : "d-none"}>

                    <div className="container add-listing-container   pb-5 pt-5">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Add Details
                                </h3>

                            </div>
                        </div>


                        <div onSubmit={this.createListing} className={"mb-5"}>
                            <div className="row no-gutters justify-content-center mt-5">

                                <div className="col-12 mt-4">

                                    <div className="row ">

                                        <div className="col-md-12 col-sm-6 col-xs-12 ">

                                            <div className={"custom-label text-bold text-blue mb-1"}>Located At</div>


                                            <FormControl variant="outlined" className={classes.formControl}>
                                                {/*<InputLabel htmlFor="outlined-age-native-simple">Located At</InputLabel>*/}
                                                <Select
                                                    name={"deliver"}
                                                    native
                                                    // label="Located At"
                                                    onChange={this.handleChange.bind(this, "deliver")}

                                                    inputProps={{
                                                        name: 'deliver',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >

                                                    <option value={null}>Select</option>

                                                    {this.props.siteList.map((item) =>

                                                        <option value={item._key}>{item.name + "(" + item.address + ")"}</option>

                                                    )}

                                                </Select>
                                            </FormControl>


                                            {this.state.errors["deliver"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["deliver"]}</span>}


                                            <p style={{ margin: "10px 0" }} onClick={this.toggleSite} className={"green-text forgot-password-link text-mute small"}>Add New Site</p>

                                        </div>


                                    </div>
                                </div>


                            </div>



                            <div className="row no-gutters justify-content-center mt-5">

                                <div className="col-12 mb-3">

                                    <div className="row ">
                                        <div className="col-6 ">
                                            <div className={"custom-label text-bold text-blue "}>Required From</div>



                                            <MuiPickersUtilsProvider utils={MomentUtils}>

                                                <DatePicker
                                                    minDate={new Date()}
                                                    // label="Required By"
                                                    inputVariant="outlined"
                                                    variant={"outlined"}
                                                    margin="normal"
                                                    id="date-picker-dialog"
                                                    label="Available From"
                                                    format="DD/MM/yyyy"
                                                    value={this.state.startDate} onChange={this.handleChangeDateStartDate.bind(this)} />

                                            </MuiPickersUtilsProvider>

                                            {this.state.errors["startDate"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["startDate"]}</span>}

                                        </div>
                                        <div className="col-6 ">
                                            <div className={"custom-label text-bold text-blue "}>Required By</div>


                                            <MuiPickersUtilsProvider utils={MomentUtils}>

                                                <DatePicker minDate={this.state.startDate?this.state.startDate:new Date()}
                                                            // label="Required By"
                                                            inputVariant="outlined"
                                                            variant={"outlined"}
                                                            margin="normal"
                                                            id="date-picker-dialog"
                                                            label="End Date "
                                                            format="DD/MM/yyyy"
                                                            value={this.state.endDate} onChange={this.handleChangeDateEndDate.bind(this)} />



                                            </MuiPickersUtilsProvider>

                                            {this.state.errors["endDate"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["endDate"]}</span>}


                                        </div>
                                    </div>
                                </div>


                                <div className="col-12 mb-3">


                                    <div className="row">

                                        <div className="col-md-6 col-sm-12 col-xs-12">
                                            <div className="row">

                                                <div className="col-md-12 col-sm-12 col-xs-12 mb-3">

                                                    <div className={"custom-label text-bold text-blue "}>Price</div>

                                                </div>

                                                <div  className="col-md-12 col-sm-12 col-xs-12 mb-3">
                                                    <button onClick={this.toggleSale} className={!this.state.free ? "col-12 btn-select-free green-bg" : "btn-select-free"}>For Sale</button>

                                                    <button onClick={this.toggleFree} className={this.state.free ? "col-12 btn-select-free green-bg" : "btn-select-free"}>Free</button>
                                                </div>

                                                <div style={{paddingLeft:"0"}} className="col-md-12 col-sm-12 col-xs-12 ">

                                                    {!this.state.free &&

                                                    <div className="col-12 mb-5">

                                                        <TextField
                                                            name={"price"}
                                                            type={"number"}
                                                            onChange={this.handleChange.bind(this, "price")}
                                                            id="input-with-icon-textfield"
                                                            label="£"
                                                            variant="outlined"
                                                            className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                                            id="input-with-icon-textfield"

                                                        />

                                                        {this.state.errors["price"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["price"]}</span>}


                                                    </div>

                                                    }

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


                    <ItemDetailPreview previewImage={this.state.previewImage} site={this.state.siteSelected} userDetail={this.props.userDetail} fields={this.state.fields}/>

                </div>


                <div className={this.state.page === 4? "" : "d-none"}>



                    <div className="container   pb-4 pt-4">

                        <div className="row justify-content-center pb-2 pt-4 ">

                            <div className="col-auto text-center">
                                <h4 className={"green-text text-heading text-bold"}>Success!
                                </h4>

                            </div>
                        </div>


                        <div className="row justify-content-center">

                            <div className="col-auto pb-4 pt-5">


                                <img className={"search-icon-middle"} src={ProductBlue} alt="" />

                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">

                            <div className="col-auto text-center">

                                <button onClick={this.handleNext} type="button"
                                        className={"btn-next shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2"}>
                                    View Listing

                                </button>

                                <p className={"text-blue text-center"}>
                                    Your listing has been created.
                                    You will be notified when a
                                    match is found.
                                </p>

                            </div>
                        </div>

                    </div>

                </div>

                {this.state.page <4 &&
                    <React.Fragment>

                        <CssBaseline />

                        <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>

                            {this.state.page < 4 && <LinearProgress variant="determinate" value={this.state.progressBar} />}
                            <Toolbar>

                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                        <div className="col-auto">
                                            {this.state.page > 1 &&
                                            <button type="button" onClick={this.handleBack}
                                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                Back

                                           </button>}
                                        </div>
                                        <div className="col-auto" style={{ margin: "auto" }}>

                                            <p className={"blue-text"}> Page {this.state.page}/3</p>
                                        </div>
                                        <div className="col-auto">

                                            {this.state.page  <3 &&
                                                <button onClick={this.handleNext} type="button"
                                                    className={((this.state.nextBlue&&this.state.page===1)||(this.state.page===2&&this.state.nextBlueAddDetail))? "btn-next shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2":"btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2"}>
                                                    Next

                                                </button>}

                                            {this.state.page === 3 &&
                                                <button onClick={this.handleNext} type="button"
                                                    className={this.state.nextBlueAddDetail ? "btn-next shadow-sm mr-2 btn btn-link blue-btn       mt-2 mb-2 " : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "}>
                                                    Post Listing

                                            </button>
                                            }


                                        </div>
                                    </div>



                            </Toolbar>
                        </AppBar>

                    </React.Fragment>}

                {this.state.showCreateSite &&

                <>
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">


                                <Close  onClick={this.toggleSite} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <form onSubmit={this.handleSubmitSite}>
                                        <div className="row no-gutters justify-content-center ">

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label=" Name" variant="outlined" fullWidth={true} name={"name"} onChange={this.handleChangeSite.bind(this, "name")} />

                                                {this.state.errorsSite["name"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["name"]}</span>}

                                            </div>

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label="Contact" variant="outlined" fullWidth={true} name={"contact"} onChange={this.handleChangeSite.bind(this, "contact")} />

                                                {this.state.errorsSite["contact"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["contact"]}</span>}

                                            </div>

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label="Address" variant="outlined" fullWidth={true} name={"address"} type={"text"} onChange={this.handleChangeSite.bind(this, "address")} />

                                                {this.state.errorsSite["address"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["address"]}</span>}

                                            </div>
                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" type={"number"} name={"phone"}  onChange={this.handleChangeSite.bind(this, "phone")} label="Phone" variant="outlined" fullWidth={true} />

                                                {this.state.errorsSite["phone"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["phone"]}</span>}

                                            </div>

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChangeSite.bind(this, "email")} />

                                                {this.state.errorsSite["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["email"]}</span>}

                                            </div>
                                            <div className="col-12 mt-4">

                                                <TextField onChange={this.handleChangeSite.bind(this, "others")} name={"others"} id="outlined-basic" label="Others" variant="outlined" fullWidth={true} type={"others"} />

                                                {/*{this.state.errorsSite["others"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["others"]}</span>}*/}

                                            </div>

                                            <div className="col-12 mt-4">

                                                <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Add Site</button>
                                            </div>


                                        </div>
                                    </form>
                                </div>
                            </div>


                        </div>
                    </div>
                </>
                }



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
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}));

function BottomAppBar() {
    const classes = useStylesBottomBar();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                        <div className="col-auto">
                            <button type="button"
                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Back

                            </button>
                        </div>
                        <div className="col-auto" style={{ margin: "auto" }}>

                            <p className={"blue-text"}> Page 2/3</p>
                        </div>
                        <div className="col-auto">

                            <button type="button"
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
        unit: '',
        name: 'hai',
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
                    label="Age"
                    inputProps={{
                        name: 'unit',
                        id: 'outlined-age-native-simple',
                    }}
                >

                    {props.units.map((item) =>

                        <option value={"Kg"}>{item}</option>

                    )}

                </Select>
            </FormControl>

        </div>
    );
}
function SiteSelect(props) {
    const classes = useStylesSelect();
    const [state, setState] = React.useState({
        unit: '',
        name: 'hai',
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
                    name={"site"}
                    native
                    value={state}
                    onChange={handleChange}
                    label="Age"
                    inputProps={{
                        name: 'unit',
                        id: 'outlined-age-native-simple',
                    }}
                >

                    <option value={null}>Select</option>

                    {props.sites.map((item) =>

                        <option value={item.id}>{item.name + "(" + item.address + ")"}</option>

                    )}

                </Select>
            </FormControl>

        </div>
    );
}

const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        width: "100%"
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
                <img className={"img-fluid"} src={imageName} alt="" style={{ maxHeight: '140px', objectFit: 'contain' }} />
            </div>
            <div className={"col-8 pl-3 content-box-listing"}>
                <p style={{ fontSize: "18px" }} className=" mb-1">{title}</p>
                <p style={{ fontSize: "16px" }} className="text-mute mb-1">{subTitle}</p>
                <p style={{ fontSize: "16px" }} className="text-mute mb-1">Serial No: {serialNo}</p>
            </div>
        </div>
    )
}








const mapStateToProps = state => {
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


};
};

const mapDispachToProps = dispatch => {
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
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ListForm);