import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Logo from '../../img/logo-2x.png';
import LogoSmall from '../../img/logo-small.png';
import LogoNew from '../../img/logo-cropped.png';

import LogoText from '../../img/logo-text.png';
import PhoneHome from '../../img/phone-home.png';
import BikeHome from '../../img/bike-home.png';
import LoopHome from '../../img/LoopHome.png';
import SendIcon from '../../img/send-icon.png';
import Select from '@material-ui/core/Select';
import HandIcon from '../../img/icons/hand.png';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '../../img/icons/search-icon.png';

import ShippingIcon from '../../img/icons/shipping-icon.png';
import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";
import InputLabel from '@material-ui/core/InputLabel';
import history from "../../History/history";
import MenuIcon from '@material-ui/icons/Menu';
import MenuOutline from '@material-ui/icons/MailOutline';
import Close from '@material-ui/icons/Close';
import NavigateBefore from '@material-ui/icons/NavigateBefore';


import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import PaperImg from '../../img/paper.png';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AppBar from '@material-ui/core/AppBar';

import TextField from '@material-ui/core/TextField';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar,ProgressBar,Alert} from 'react-bootstrap';

import Checkbox from '@material-ui/core/Checkbox';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import clsx from 'clsx';
import SearchGray from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import {withStyles} from "@material-ui/core/styles/index";
import CalGrey from '../../img/icons/calender-dgray.png';

import MarkerGrey from '../../img/icons/marker-dgray.png';

import LinkGray from '../../img/icons/link-icon.png';
import ViewSearch from "../loop-cycle/ViewSearch";

import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import HandGreyIcon from '../../img/icons/hand-gray.png';
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';
import ListIcon from '../../img/icons/list.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import LinearProgress from '@material-ui/core/LinearProgress';
import HeaderWhiteBack from '../header/HeaderWhiteBack'
import ResourceItem from  '../item/ResourceItem'

// import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// pick a date util library
// import MomentUtils from '@date-io/moment';
// import DateFnsUtils from '@date-io/date-fns';
// import LuxonUtils from '@date-io/luxon';
// import DateFnsUtils from 'date-i-fns';
// import DateFnsUtils from '@date-io/date-fns';

import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import {saveKey, saveUserToken} from "../../LocalStorage/user";
import {loginFailed} from "../../store/actions/actions";
import {signUpFailed} from "../../store/actions/actions";

import CameraGray from '../../img/icons/camera-gray.png';
import PlusGray from '../../img/icons/plus-icon.png';
import ComponentImg from '../../img/component.png';
import ProductBlue from '../../img/icons/product-blue.png';


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



class  CreateListing extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0,  //0 logn. 1- sign up , 3 -search,
            categories: [],
            subCategories: [],
            catSelected: {},
            subCatSelected: {},
            stateSelected: null,
            states:[],
            sites:[],
            page:1,
            fields: {},
            errors: {},
            fieldsSite: {},
            errorsSite: {},
            units:[],
            progressBar: 25,
            products:[],
            productSelected: null,
            nextBlue: false,
            nextBlueAddDetail: false,
            nextBlueViewSearch: false,
            matches:[],
            unitSelected: null,
            volumeSelected: null,
            title: null,
            description: null,
            volume:null,
            listResourceData:null,
            resourcesMatched:[],
            showCreateSite: false,
            showAddComponent: false,
            siteSelected: null,
            serial:null,
            free: false,
            price : null

        }

        this.selectCreateSearch=this.selectCreateSearch.bind(this)
        this.selectCategory=this.selectCategory.bind(this)
        this.selectType=this.selectType.bind(this)
        this.selectState=this.selectState.bind(this)
        this.addDetails=this.addDetails.bind(this)
        this.linkProduct=this.linkProduct.bind(this)
        this.searchLocation=this.searchLocation.bind(this)
        this.previewSearch=this.previewSearch.bind(this)
        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
        this.getFiltersCategories = this.getFiltersCategories.bind(this)
        this.selectSubCatType=this.selectSubCatType.bind(this)
        this.handleNext=this.handleNext.bind(this)
        this.handleBack=this.handleBack.bind(this)
        this.getProducts=this.getProducts.bind(this)
        this.selectProduct=this.selectProduct.bind(this)
        this.handleDateChange=this.handleDateChange.bind(this)
        this.createListing=this.createListing.bind(this)

        this.loadMatches=this.loadMatches.bind(this)
        this.showCreateSite=this.showCreateSite.bind(this)
        this.getSites=this.getSites.bind(this)
        this.toggleAddComponent=this.toggleAddComponent.bind(this)
        this.toggleSite=this.toggleSite.bind(this)
        this.toggleFree=this.toggleFree.bind(this)
        this.toggleSale=this.toggleSale.bind(this)



    }




    toggleSale(){


        this.setState({
            free: false
        })
    }

    toggleFree(){


        this.setState({
            free: true
        })
    }


    toggleSite(){

        this.setState({
            showCreateSite: !this.state.showCreateSite
        })
    }


    getProducts(){

        axios.get(baseUrl+"product",
            {
                headers: {
                    "Authorization" : "Bearer "+this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var response = response.data.content;
                    console.log("resource response")
                    console.log(response)

                    this.setState({

                        products:response

                    })

                },
                (error) => {

                    var status = error.response.status
                    console.log("resource error")
                    console.log(error)

                }
            );

    }

    getSites(){

        axios.get(baseUrl+"site",
            {
                headers: {
                    "Authorization" : "Bearer "+this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var response = response.data.content;
                    console.log("sites  response")
                    console.log(response)

                    this.setState({

                        sites:response

                    })

                },
                (error) => {

                    var status = error.response.status
                    console.log("sites error")
                    console.log(error)

                }
            );

    }

    createListing(){



        var data={}

        if (this.state.price) {

             data = {

                "name": this.state.title,
                "description": this.state.description,
                "category": this.state.catSelected.name,
                "type": this.state.subCatSelected.name,
                "units": "units",
                "volume": this.state.volume,
                "state": this.state.stateSelected,
                "site_id": this.state.siteSelected,
                "availableFrom": {
                    "unit": "MILLISECOND",
                    "value": 1603381408
                },
                "expiry": {
                    "unit": "MILLISECOND",
                    "value": 1605830400000
                },
                 "price": {
                     "value": this.state.price,
                     "currency": "gbp"
                 },
             }


        }else {

             data = {

                "name": this.state.title,
                "description": this.state.description,
                "category": this.state.catSelected.name,
                "type": this.state.subCatSelected.name,
                "units": "units",
                "volume": this.state.volume,
                "state": this.state.stateSelected,
                "site_id": this.state.siteSelected,
                "availableFrom": {
                    "unit": "MILLISECOND",
                    "value": 1603381408
                },
                "expiry": {
                    "unit": "MILLISECOND",
                    "value": 1605830400000
                }
            }


        }
        axios.post(baseUrl+"resource",
            data,{
             headers: {
            "Authorization" : "Bearer "+this.props.userDetail.token
        }}
            )
            .then(res => {

                console.log(res.data.content)


                this.setState({
                    listResourceData: res.data.content
                })

            }).catch(error => {

            console.log("login error found ")
            console.log(error.response.data)

        });

    }


    toggleAddComponent(){

        this.setState({
            showAddComponent: !this.state.showAddComponent
        })
    }



    handleChangeSite = (event) => {
        //
        // const name = event.target.name;
        //
        // setState({
        //     ...state,
        //     [name]: event.target.value,
        // });
        //

    };


    loadMatches(){


        for (var i=0;i<this.state.listResourceData.resources.length;i++){

            axios.get(baseUrl+"resource/"+this.state.listResourceData.resources[i],
                {
                    headers: {
                        "Authorization" : "Bearer "+this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var response = response.data.content;
                        console.log("resource response")
                        console.log(response)



                    var resources = this.state.resourcesMatched

                    resources.push(response)

                        this.setState({

                            resourcesMatched: resources
                        })

                    },
                    (error) => {

                        var status = error.response.status
                        console.log("resource error")
                        console.log(error)

                    }
                );


        }


    }





    handleBack(){

        if (this.state.page==2){

            if (this.handleValidation()){

                this.setState({

                    page:1,
                    active:0,
                    progressBar: 33
                })

            }

        }

    }


    handleNext(){

        if (this.state.page==1){

            this.getSites()
            if (this.handleValidation()){

                this.setState({

                    active:4,
                    page: 2,
                    progressBar: 50
                })

            }

        }

       else if (this.state.page==2){


            // if (this.handleValidationAddDetail()){

                this.setState({

                    active:5,
                    page: 3,
                    progressBar: 75
                })

                // this.createSearch()
            // }

        }


        else if (this.state.page==3){


            // alert("on page 4")

            this.setState({

                active:7,
                page: 4,
                progressBar: 100
            })

            this.createListing()

        }


        else if (this.state.active==8){


            // alert("here ")

            this.setState({

                active:8,

            })

        }



    }


    getResources(){



    }


    getFiltersCategories(){

        axios.get(baseUrl+"category",
            {
                headers: {
                    "Authorization" : "Bearer "+this.props.userDetail.token
                }
            }
        ).then((response) => {

                    var response = response.data.content;
                    console.log("resource response")
                    console.log(response)

                    this.setState({

                        categories:response
                    })

                },
                (error) => {

                    var status = error.response.status
                    console.log("resource error")
                    console.log(error)

                }
            );

    }





    selectCreateSearch(){


        this.setState({

            active:0,
            page:1
        })


    }


    selectCategory(){

        this.setState({

            active:1
        })

    }



    selectProduct(event){

        // console.log(this.state.categories.filter((item) => item.name == event.currentTarget.dataset.name))

        this.setState({

            productSelected : this.state.products.filter((item) => item.title == event.currentTarget.dataset.name)[0]
        })



        console.log(this.state.products.filter((item) => item.title == event.currentTarget.dataset.name)[0])

        this.setState({

            active: 5
        })

    }

    selectType(event){

        // console.log(this.state.categories.filter((item) => item.name == event.currentTarget.dataset.name))

        this.setState({

            catSelected : this.state.categories.filter((item) => item.name == event.currentTarget.dataset.name)[0]
        })

        this.setState({

            subCategories: this.state.categories.filter((item) => item.name == event.currentTarget.dataset.name)[0].types

        })

        this.setState({

            active: 2
        })

    }


    selectSubCatType(event){


        this.setState({

            subCatSelected : this.state.subCategories.filter((item)=> event.currentTarget.dataset.name==item.name)[0]

        })

        // alert(this.state.subCatSelected.name)


        this.setState({

            active:3,
            states:this.state.subCategories.filter((item)=> event.currentTarget.dataset.name==item.name)[0].state

        })


    }



    selectState(event){


        this.setState({

            stateSelected : event.currentTarget.dataset.name
        })


        this.setState({

            active:0,

            units: this.state.subCatSelected.units

        })

    }

    handleDateChange(){



    }


    handleValidation(){

        // alert("called")


        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["title"]){
            formIsValid = false;
            errors["title"] = "Required";
        }else{


            this.setState({

                title:fields["title"]
            })
        }



        if(!fields["description"]){
            formIsValid = false;
            errors["description"] = "Required";
        }else{


           this.setState({
               description:fields["description"]

           })

        }


        // if(!fields["volume"]){
        //     formIsValid = false;
        //     errors["volume"] = "Required";
        // }else{
        //
        //
        //     this.setState({
        //
        //         volume:fields["volume"]
        //     })
        // }



        if(!fields["serial"]){
            formIsValid = false;
            errors["serial"] = "Required";
        }else{


            this.setState({

                serial:fields["serial"]
            })
        }


        if(!fields["brand"]){
            formIsValid = false;
            errors["brand"] = "Required";
        }else{


            this.setState({

                serial:fields["brand"]
            })
        }


        if(!fields["manufacturedDate"]){
            formIsValid = false;
            errors["manufacturedDate"] = "Required";
        }else{


            this.setState({

                serial:fields["manufacturedDate"]
            })
        }


        if(!fields["model"]){
            formIsValid = false;
            errors["model"] = "Required";
        }else{


            this.setState({

                serial:fields["model"]
            })
        }






        if(this.state.catSelected.name && this.state.subCatSelected.name && this.state.stateSelected){

            }else{

            formIsValid = false;
            errors["category"] = "Required";

        }


        this.setState({errors: errors});
        return formIsValid;

    }


    
    
    showCreateSite(){



    }
    handleValidationDetail(){

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["title"]){
            formIsValid = false;
            errors["title"] = "Required";
        }
        if(!fields["description"]){
            formIsValid = false;
            errors["description"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }


        if(!fields["volume"]){
            formIsValid = false;
            errors["volume"] = "Required";
        }
        // if(!fields["unit"]){
        //     formIsValid = false;
        //     errors["unit"] = "Required";
        // }




        if(this.state.catSelected.name && this.state.subCatSelected.name && this.state.stateSelected){


        }else{


            formIsValid = false;
            errors["category"] = "Required";

        }


        this.setState({errors: errors});
        return formIsValid;

    }
    handleValidationNextColor(){

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["title"]){
            formIsValid = false;
            errors["title"] = "Required";
        }
        if(!fields["description"]){
            formIsValid = false;
            errors["description"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }


        if(!fields["volume"]){
            formIsValid = false;
            errors["volume"] = "Required";
        }
        // if(!fields["unit"]){
        //     formIsValid = false;
        //     errors["unit"] = "Required";
        // }




        if(this.state.catSelected.name && this.state.subCatSelected.name && this.state.stateSelected){


        }else{


            formIsValid = false;
            errors["category"] = "Required";

        }



        this.setState({

            nextBlue: formIsValid
        })

    }


    handleValidationAddDetail(){

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["deliver"]){
            formIsValid = false;
            errors["deliver"] = "Required";
        }

        // if(!fields["endDate"]){
        //     formIsValid = false;
        //     errors["endDate"] = "Required";
        // }

        if(!fields["startDate"]){
            formIsValid = false;
            errors["startDate"] = "Required";
        }



        // if(!this.state.productSelected){
        //     formIsValid = false;
        //     errors["product"] = "Required";
        // }



        this.setState({errors: errors});
        return formIsValid;

    }


    handleValidationAddDetailNextColor(){

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["deliver"]){
            formIsValid = false;
            errors["deliver"] = "Required";
        }else{

            this.setState({

                siteSelected: fields["deliver"]
            })

            // alert(fields["deliver"])

        }


        if(!fields["startDate"]){
            formIsValid = false;
            errors["startDate"] = "Required";
        }



        if(!this.state.productSelected){
            formIsValid = false;
            errors["product"] = "Required";
        }


        this.setState({

            nextBlueAddDetail: formIsValid
        })


    }



    handleChange(field, e){




        let fields = this.state.fields;
        fields[field] = e.target.value;

        // alert(fields[field])

        this.setState({fields});
        this.handleValidationNextColor()
        this.handleValidationAddDetailNextColor()


        this.setState({

            price : fields["price"]
        })


        // alert(fields["price"])


    }





    addDetails(){



        this.setState({

            active:4
        })

    }



    linkProduct(){


        this.getProducts()

        // alert(5)

        this.setState({

            active:6

        })

    }



    searchLocation(){




        this.setState({

            active:6
        })
    }


    previewSearch(){




        this.setState({

            active:7
        })
    }





    interval


    componentWillMount(){

    }

    componentDidMount(){



        this.getFiltersCategories()



    }



    goToSignIn(){


        this.setState({

            active:0
        })
    }

    goToSignUp(){


        this.setState({

            active:1
        })
    }

     classes = useStylesSelect;






    handleValidationSite(){

        // alert("called")
        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["email"]){
            formIsValid = false;
            errors["password"] = "Required";
        }
        if(!fields["address"]){
            formIsValid = false;
            errors["address"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }


        if(!fields["name"]){
            formIsValid = false;
            errors["name"] = "Required";
        }
        if(!fields["contact"]){
            formIsValid = false;
            errors["contact"] = "Required";
        }





        if(!fields["phone"]){
            formIsValid = false;
            errors["phone"] = "Required";
        }



        if(typeof fields["email"] !== "undefined"){

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({errorsSite: errors});
        return formIsValid;
    }



    handleChangeSite(field, e){
        let fields = this.state.fieldsSite;
        fields[field] = e.target.value;
        this.setState({fields: fields});
    }


    handleSubmitSite = event => {

        event.preventDefault();



        alert("site submit")
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



            axios.post(baseUrl+"site",

                {
                    "name": name,
                    "email": email,
                    "contact" : contact,
                    "address": address,
                    "phone": phone,
                    "others": others

                }
                ,{
                    headers: {
                        "Authorization" : "Bearer "+this.props.userDetail.token
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



            // alert("valid")

        // }else {
        //
        //
        //     // alert("invalid")
        // }



    }



    handleSubmitComponent = event => {


        event.preventDefault();


        this.toggleAddComponent()

    }


    render() {

        const    classes = withStyles();
        const classesBottom = withStyles();


        return (

            <>


                <div className="container  p-2 ">
                </div>



                <div className={this.state.active == 0?"":"d-none"}>

                <div className="container  pt-2 pb-3">

                    <div className="row no-gutters">
                        <div className="col-10">

                            <h6>Create a Listing </h6>
                        </div>


                        <div className="col-auto">


                            <Link to={"/create-search"}><Close  className="blue-text" style={{ fontSize: 32 }} /></Link>

                        </div>


                    </div>
                </div>

                <div className="container add-listing-container   pb-5 pt-5">
                    <div className="row no-gutters">
                        <div className="col-auto">
                            <h3 className={"blue-text text-heading"}>Create a Listing
                            </h3>

                        </div>
                    </div>


                    <form onSubmit={this.handleSubmit} className={"mb-5"}>
                    <div className="row no-gutters justify-content-center mt-5">
                        <div className="col-12">

                            <TextField onChange={this.handleChange.bind(this, "title")} name={"title"} id="outlined-basic" label="Title" variant="outlined" fullWidth={true} />
                            {this.state.errors["title"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["title"]}</span>}


                        </div>

                        <div className="col-12 mt-4">

                            <TextField onChange={this.handleChange.bind(this, "description")} name={"description"} id="outlined-basic" label="Description" multiline
                                       rows={4} variant="outlined" fullWidth={true} />
                            {this.state.errors["description"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["description"]}</span>}



                        </div>
                        <div className="col-12 mt-4" onClick={this.selectCategory}>

                            <div onClick={this.selectCategory} className={"dummy-text-field"}>

                                {this.state.catSelected&&this.state.catSelected.name&&this.state.subCatSelected && this.state.stateSelected?

                                    this.state.catSelected.name+ ">"+this.state.subCatSelected.name+">"+this.state.stateSelected :"Resource Category"}


                            </div>
                            {this.state.errors["category"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["category"]}</span>}


                        </div>

                        <div className="col-12 mt-4">

                            <TextField onChange={this.handleChange.bind(this, "brand")} name={"brand"} id="outlined-basic" label="Brand" variant="outlined" fullWidth={true} />
                            {this.state.errors["brand"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["brand"]}</span>}

                        </div>


                        <div className="col-12 mt-4">

                            <TextField onChange={this.handleChange.bind(this, "model")} name={"model"} id="outlined-basic" label="Model Number" variant="outlined" fullWidth={true} />
                            {this.state.errors["model"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["model"]}</span>}

                        </div>

                        <div className="col-12 mt-4">

                            <TextField onChange={this.handleChange.bind(this, "serial")} name={"serial"} id="outlined-basic" label="Serial Number" variant="outlined" fullWidth={true} />
                            {this.state.errors["serial"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["serial"]}</span>}

                        </div>


                        <div className="col-12  mt-4">

                            <TextField
                                onChange={this.handleChange.bind(this, "manufacturedDate")}
                                name={"manufacturedDate"}
                                id="input-with-icon-textfield"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                label="Year Of Manufacture"
                                type={"date"}
                                variant="outlined"
                                className={clsx(classes.margin, classes.textField)+" full-width-field" }
                                id="input-with-icon-textfield"
                                minDate={new Date()}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <img  className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }}/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {this.state.errors["manufacturedDate"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["manufacturedDate"]}</span>}

                        </div>



                        <div className="col-12 mt-4">
                            <div className={"custom-label text-bold text-blue mb-3"}>Add Photos</div>

                            <div className="container  pb-5 ">

                                <div className="row camera-grids   no-gutters   ">
                                    <div className="col-4 p-1 text-center ">

                                        <div className="card shadow border-0 mb-3 container-gray border-rounded">
                                            <div className={"card-body"}>
                                                <img src={CameraGray} className={"camera-icon-preview"}/>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-4  p-1 text-center ">

                                        <div className="card shadow border-0 mb-3 container-gray border-rounded ">
                                            <div className={"card-body"}>

                                                <img style={{padding: "10px"}} src={PlusGray} className={"camera-icon-preview"}/>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>


                    </div>



                    {/*<div className="row no-gutters justify-content-center mt-4">*/}

                    {/*<div className="col-6 pr-2">*/}

                        {/*<UnitSelect units={this.state.units} />*/}


                    {/*</div>*/}
                        {/*<div className="col-6 pl-2">*/}

                            {/*<TextField onChange={this.handleChange.bind(this, "volume")} name={"volume"} id="outlined-basic" label="Volume" variant="outlined" fullWidth={true} />*/}
                            {/*{this.state.errors["volume"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["volume"]}</span>}*/}


                        {/*</div>*/}
                    {/*</div>*/}
                    </form>

                </div>
         </div>






                <div className={this.state.active == 1?"":"d-none"}>

                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Select a category </h6>
                            </div>


                            <div className="col-auto">

                                <Close onClick={this.selectCreateSearch} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>

                    <div className="container  mt-5 mb-5 pb-5  pt-3">

                    {this.state.categories.map((item)=>

                        <div data-name={item.name} className="row mr-2 ml-2 selection-row selected-row p-3 mb-3" onClick={this.selectType.bind(this)}>
                            <div className="col-2">
                                <img className={"icon-left-select"} src={SendIcon} />
                            </div>
                            <div className="col-8">

                                <p className={"blue-text "} style={{fontSize:"16px",marginBottom:"5px"}}>{item.name}</p>
                                <p className={"text-mute small"}  style={{fontSize:"14px"}}>{item.types.length+" Types"}</p>

                            </div>
                            <div className="col-2">
                                <NavigateNextIcon/>
                            </div>
                        </div>

                    )}

                    </div>
                </div>



                <div className={this.state.active == 2?"":"d-none"}>
                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Select a type </h6>
                            </div>

                            <div className="col-auto">

                                <Close onClick={this.selectCreateSearch} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>

                    <div className="container mt-5 mb-5 pb-5  ">

                        {this.state.subCategories && this.state.subCategories.map((item) =>

                            <div data-name={item.name} className="row mr-2 ml-2 selection-row selected-row p-3 mb-3"
                                 onClick={this.selectSubCatType.bind(this)}>
                            <div className="col-10">

                                <p className={" "} style={{fontSize:"16px"}}>{item.name}</p>

                            </div>
                            <div className="col-2">
                                <NavigateNextIcon/>
                            </div>
                        </div>
                        )}

                    </div>
                </div>




                <div className={this.state.active == 3?"":"d-none"}>

                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Select a State </h6>
                            </div>


                            <div className="col-auto">


                                <Close onClick={this.selectCreateSearch} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>

                    <div className="container   pb-3 pt-3">

                        {this.state.states.map((item) =>

                        <div data-name={item} className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3  " onClick={this.selectState.bind(this)}>
                            <div className="col-10">
                                <p className={" "} style={{fontSize:"16px"}}>{item}</p>

                            </div>
                            <div className="col-2">
                                <NavigateNextIcon/>
                            </div>
                        </div>

                        )}

                    </div>
                </div>




                <div className={this.state.active == 4?"":"d-none"}>

                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>List Components </h6>
                            </div>


                            <div className="col-auto">

                                <Close onClick={this.handleBack}  className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>

                    <div className="container  search-container pb-5 pt-3">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>List Components
                                </h3>
                                <p>Does this resource have any components that you wish to sell? List them below.</p>

                            </div>
                        </div>
                        <div className="row no-gutters  mt-2">

                            <div className={"custom-label text-bold text-blue mb-3"}>Components</div>


                        <ComponentItem />


                            <div className="col-12 mb-3">

                                <p style={{margin:"10px 0"}} onClick={this.toggleAddComponent} className={"green-text forgot-password-link text-mute small"}>+ Add Component</p>


                            </div>

                        </div>
                    </div>
                </div>



                <div className={this.state.active == 5?"":"d-none"}>

                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Add Details </h6>
                            </div>


                            <div className="col-auto">

                                <Close onClick={this.handleBack}  className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>

                    <div className="container  search-container pb-5 pt-5">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>The Basics
                                </h3>

                            </div>
                        </div>
                        <div className="row no-gutters justify-content-center mt-5">
                            {/*<div onClick={this.linkProduct}  className="col-12 mb-3">*/}


                                {/*<div  className={"dummy-text-field"}>*/}
                                    {/*{this.state.productSelected?this.state.productSelected.title:"Link new a product"}*/}
                                    {/*<img  className={"input-field-icon"} src={LinkGray} style={{ fontSize: 24, color: "#B2B2B2" }}/>*/}
                                {/*</div>*/}
                                {/*{this.state.errors["product"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["linkProduct"]}</span>}*/}


                            {/*</div>*/}
                            <div className="col-12 mb-3">


                                {/*<SiteSelect   sites={this.state.sites}/>*/}


                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel htmlFor="outlined-age-native-simple">Deliver To</InputLabel>
                                    <Select
                                        name={"deliver"}
                                        native
                                        label="Age"
                                        onChange={this.handleChange.bind(this, "deliver")}

                                        inputProps={{
                                            name: 'deliver',
                                            id: 'outlined-age-native-simple',
                                        }}
                                    >

                                        <option value={null}>Select</option>

                                        {this.state.sites.map((item)=>

                                            <option value={item.id}>{item.name +"("+item.address+")"}</option>

                                        )}

                                    </Select>
                                </FormControl>


                                {this.state.errors["deliver"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["deliver"]}</span>}


                                <p style={{margin:"10px 0"}} onClick={this.toggleSite} className={"green-text forgot-password-link text-mute small"}>Add new Site</p>
                            </div>
                            <div className="col-12 mb-3">


                                <TextField
                                    onChange={this.handleChange.bind(this, "startDate")}
                                    name={"startDate"}
                                    id="input-with-icon-textfield"

                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    label="Available From"
                                    type={"date"}
                                    variant="outlined"
                                    className={clsx(classes.margin, classes.textField)+" full-width-field" }
                                    id="input-with-icon-textfield"
                                    minDate={new Date()}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <img  className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }}/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {this.state.errors["startDate"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["startDate"]}</span>}


                            </div>



                            <div className="col-12 mb-3">


                                <TextField
                                    onChange={this.handleChange.bind(this, "endDate")}
                                    name={"endDate"}
                                    id="input-with-icon-textfield"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    label="Expires"
                                    type={"date"}
                                    variant="outlined"
                                    className={clsx(classes.margin, classes.textField)+" full-width-field" }
                                    id="input-with-icon-textfield"
                                    minDate={new Date()}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <img  className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }}/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {this.state.errors["endDate"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["endDate"]}</span>}


                            </div>


                            <div className="col-12 mb-3">

                                <p>Price</p>

                                <div onClick={this.toggleSale} className={!this.state.free?"btn-select-free green-bg":"btn-select-free"}>For Sale</div>

                                <div  onClick={this.toggleFree} className={this.state.free?"btn-select-free green-bg":"btn-select-free"}>Free</div>


                            </div>

                            {!this.state.free && <div className="col-12 mb-5">

                                <TextField
                                    onChange={this.handleChange.bind(this, "price")}
                                    id="input-with-icon-textfield"
                                    label="Enter Value"
                                    variant="outlined"
                                    className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                    id="input-with-icon-textfield"

                                />

                            </div>
                            }

                        </div>
                    </div>
                </div>



                <div className={this.state.active == 6?"":"d-none"}>


                        <div className="container  pt-2 pb-3">

                            <div className="row no-gutters">
                                <div className="col-10">

                                    <h6>Link a Product </h6>
                                </div>


                                <div className="col-auto">


                                    <Close onClick={this.selectCreateSearch} className="blue-text" style={{ fontSize: 32 }} />

                                </div>


                            </div>
                        </div>


                        <div className="container   pb-3 pt-3">
                            {this.state.products.map((item)=>
                                <div  data-name={item.title}  className="row mr-2 ml-2 selection-row selected-row p-3 mb-3  " onClick={this.selectProduct}>
                                <div className="col-2">
                                    <img className={"icon-left-select"} src={SendIcon} />
                                </div>
                                <div className="col-8">
                                    <p className={"blue-text "} style={{fontSize:"16px"}}>{item.title}</p>
                                    <p className={"text-mute small"}  style={{fontSize:"16px"}}>{item.searches.length} Searches</p>

                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon/>
                                </div>
                            </div>

                        )}

                        </div>




                </div>



                <div className={this.state.active == 7?"":"d-none"}>

                    <div className="container  pt-3 pb-3">

                        <div className="row no-gutters justify-content-end">

                            <div className="col-auto">

                                <button className="btn   btn-link text-dark menu-btn">
                                    <Close onClick={this.selectCreateSearch} className="" style={{ fontSize: 32 }} />

                                </button>
                            </div>


                        </div>
                    </div>


                    <div className="container   pb-4 pt-4">

                        <div className="row justify-content-center pb-2 pt-4 ">

                            <div className="col-auto">
                                <h4 className={"blue-text text-heading text-bold"}>Success!
                                </h4>

                            </div>
                        </div>


                        <div className="row justify-content-center">

                            <div className="col-auto pb-4 pt-5">


                                <img className={"search-icon-middle"}  src={ProductBlue} />

                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">

                            <div className="col-auto">
                                <p className={"text-blue text-center"}>
                                    Your listing has been created.
                                    You will be notified when a
                                    match is found.
                                </p>

                            </div>
                        </div>

                    </div>

                </div>


                <div className={this.state.active == 8?"":"d-none"}>


                    {this.state.listResourceData &&
                        <>
                      <div className="container  pt-3 pb-3">

                            <div className="row no-gutters">
                                <div className="col-auto" style={{margin:"auto"}}>

                                    <NavigateBefore  style={{ fontSize: 32 }}/>
                                </div>

                                <div className="col text-center blue-text"  style={{margin:"auto"}}>
                                    <p>View Search </p>
                                </div>

                                <div className="col-auto">

                                    <button className="btn   btn-link text-dark menu-btn">
                                        <Close onClick={this.selectCreateSearch} className="" style={{ fontSize: 32 }} />

                                    </button>
                                </div>


                            </div>
                        </div>


                        <div className="container ">


                            <div className="row container-gray justify-content-center pb-5 pt-5">

                                <div className="col-auto pb-5 pt-5">
                                    <img className={"my-search-icon-middle"}  src={SearchIcon} />

                                </div>
                            </div>
                            <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                                <div className="col-12">
                                    <p className={"green-text text-heading"}>@Tesco
                                    </p>

                                </div>
                                <div className="col-12 mt-2">
                                    <h5 className={"blue-text text-heading"}>{this.state.listResourceData.name}
                                    </h5>

                                </div>
                            </div>


                            <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                                <div className="col-auto">
                                    <p  style={{fontSize:"16px"}} className={"text-gray-light "}>{this.state.listResourceData.description}
                                    </p>

                                </div>

                            </div>

                            <div className="row justify-content-start pb-4 pt-3 ">
                                <div className="col-auto">
                                    <h6 className={""}>Item Details
                                    </h6>

                                </div>
                            </div>

                        </div>

                        <div className={"container"}>

                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={ListIcon} />
                                </div>
                                <div className={"col-auto"}>

                                    <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Surrey, UK</p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">{this.state.listResourceData.category} ></p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">{this.state.listResourceData.type}</p>

                                </div>
                            </div>
                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={AmountIcon} />
                                </div>
                                <div className={"col-auto"}>

                                    <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Amount</p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">{this.state.listResourceData.volume} {this.state.listResourceData.units}</p>
                                </div>
                            </div>


                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={StateIcon} />
                                </div>
                                <div className={"col-auto"}>

                                    <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">State</p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">{this.state.listResourceData.state}</p>
                                </div>
                            </div>

                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={CalenderIcon} />
                                </div>
                                <div className={"col-auto"}>

                                    <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Required by </p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">Oct 1, 2020 </p>
                                </div>
                            </div>
                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={MarkerIcon} />
                                </div>
                                <div className={"col-auto"}>

                                    <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Location  </p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">Mapledown, Which Hill Lane,</p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">Woking, Surrey, GU22 0AH</p>
                                </div>
                            </div>


                            {/*<BottomAppBar />*/}


                        </div>



                        </>
                    }
                </div>



                <div className={this.state.active == 9?"":"d-none"}>



                    <HeaderWhiteBack history={this.props.history} heading={"Preview Matches"}/>


                    <div className="container   pb-4 ">


                        {this.state.resourcesMatched.map((item)=>

                        <ResourceItem item={item}/>

                            )}


                    </div>

                </div>

                {this.state.active<9 &&
                <React.Fragment>

                    <CssBaseline/>

                    <AppBar  position="fixed" color="#ffffff" className={classesBottom.appBar+"  custom-bottom-appbar"}>
                        {/*<ProgressBar now={this.state.progressBar}  />*/}
                        {this.state.page<4 &&  <LinearProgress variant="determinate" value={this.state.progressBar} />}
                        <Toolbar>


                            {this.state.active==6 &&

                            <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                                <div className="col-auto">
                                    <p style={{margin:"10px 0"}}  className={"green-text forgot-password-link text-mute small"}>
                                        <Link to={"/create-product"} >Create New Product  </Link> </p>

                                </div>

                            </div>
                            }


                            {this.state.active<7 && this.state.active!=6 &&

                            <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                                  <div className="col-auto">
                                      {this.state.page>1&&this.state.page<3 &&  <button type="button" onClick={this.handleBack}
                                            className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                        Back

                                    </button>}
                                </div>
                                <div className="col-auto" style={{margin:"auto"}}>

                                    <p  className={"blue-text"}> Page {this.state.page}/3</p>
                                </div>
                                <div className="col-auto">

                                    {this.state.page ==1 &&
                                    <button onClick={this.handleNext} type="button"
                                            className={this.state.nextBlue?"btn-next shadow-sm mr-2 btn btn-link blue-btn   mt-2 mb-2 ":"btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "}>
                                        Next

                                    </button>}


                                    {this.state.page ==2 &&
                                    <button onClick={this.handleNext} type="button"
                                            className={this.state.nextBlueAddDetail?"btn-next shadow-sm mr-2 btn btn-link blue-btn       mt-2 mb-2 ":"btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "}>
                                        Next

                                    </button>}


                                    {this.state.page ==3 &&
                                    <button onClick={this.handleNext} type="button"
                                            className={this.state.nextBlueAddDetail?"btn-next shadow-sm mr-2 btn btn-link blue-btn       mt-2 mb-2 ":"btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "}>
                                        Post Listing

                                    </button>
                                    }


                                </div>
                            </div>}

                            {this.state.active ==7 &&
                            <div className="row  justify-content-center search-container " style={{margin:"auto"}}>


                                {this.state.listResourceData &&<div className="col-auto">


                                        <Link  to={"/"+this.state.listResourceData&&this.state.listResourceData.id}  type="button" className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">

                                            View Listing

                                        </Link>
                                    </div>}
                                </div>
                                }

                        </Toolbar>
                    </AppBar>

                </React.Fragment>
                }



                {this.state.showAddComponent &&

                    <>
                <div className={"body-overlay"}>
                    <div className={"modal-popup site-popup"}>
                        <div className=" text-right ">


                             < Close onClick={this.toggleAddComponent} className="blue-text" style={{ fontSize: 32 }} />

                        </div>


                        <div className={"row"}>
                            <div className={"col-12"}>
                           <form  onSubmit={this.handleSubmitComponent}>
                    <div className="row no-gutters justify-content-center ">

                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic" label="Component Name" variant="outlined" fullWidth={true} name={"name"} onChange={this.handleChangeSite.bind(this, "name")} />

                            {this.state.errors["name"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["name"]}</span>}

                        </div>

                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic" label="Brand " variant="outlined" fullWidth={true} name={"brand"}  onChange={this.handleChangeSite.bind(this, "brand")} />

                            {this.state.errors["brand"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["brand"]}</span>}

                        </div>

                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic" label="Model Number(If Applicable)" variant="outlined" fullWidth={true} name={"model"} type={"text"} onChange={this.handleChangeSite.bind(this, "model")} />

                            {this.state.errors["model"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["model"]}</span>}

                        </div>
                        <div className="col-12 mt-4">

                            <TextField id="outlined-basic"  type={"serial"} name={"serial"} label="Serial Number" variant="outlined" fullWidth={true} />


                        </div>
                        <div className="col-12 mt-4">

                        <div className="  ">

                            <div className="row camera-grids   no-gutters   ">
                                <div className="col-4 p-1 text-center ">

                                    <div className="card shadow border-0 mb-3 container-gray border-rounded">
                                        <div className={"card-body"}>
                                            <img src={CameraGray} className={"camera-icon-preview"}/>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-4  p-1 text-center ">

                                    <div className="card shadow border-0 mb-3 container-gray border-rounded ">
                                        <div className={"card-body"}>

                                            <img style={{padding: "10px"}} src={PlusGray} className={"camera-icon-preview"}/>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        </div>


                        <div className="col-12 mt-4">

                            <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Add Component</button>
                        </div>


                    </div>
                </form>
                            </div>
                        </div>


                    </div>
                </div>
                </>
                }


                {this.state.showCreateSite &&

                <>
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">


                                <Link to={"/"} > < Close onClick={this.toggleSite} className="blue-text" style={{ fontSize: 32 }} /> </Link>

                            </div>


                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <form  onSubmit={this.handleSubmitSite}>
                                        <div className="row no-gutters justify-content-center ">

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label=" Name" variant="outlined" fullWidth={true} name={"name"} onChange={this.handleChangeSite.bind(this, "name")} />

                                                {this.state.errors["name"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["name"]}</span>}

                                            </div>

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label="Contact" variant="outlined" fullWidth={true} name={"contact"}  onChange={this.handleChangeSite.bind(this, "contact")} />

                                                {this.state.errors["contact"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["contact"]}</span>}

                                            </div>

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label="Address" variant="outlined" fullWidth={true} name={"address"} type={"text"} onChange={this.handleChangeSite.bind(this, "address")} />

                                                {this.state.errors["address"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["address"]}</span>}

                                            </div>
                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic"  type={"number"} name={"phone"} label="Phone" variant="outlined" fullWidth={true} />


                                            </div>

                                            <div className="col-12 mt-4">

                                                <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChangeSite.bind(this, "email")} />

                                                {this.state.errors["email"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["email"]}</span>}

                                            </div>
                                            <div className="col-12 mt-4">

                                                <TextField onChange={this.handleChangeSite.bind(this, "others")} name={"others"} id="outlined-basic" label="Others" variant="outlined" fullWidth={true} type={"others"} />

                                                {this.state.errors["others"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["others"]}</span>}

                                            </div>

                                            <div className="col-12 mt-4">

                                                <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Submit Site</button>
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
            <CssBaseline/>

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                        <div className="col-auto">
                            <button type="button"
                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Back

                            </button>
                        </div>
                        <div className="col-auto" style={{margin:"auto"}}>

                         <p  className={"blue-text"}> Page 2/3</p>
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

                    {props.units.map((item)=>

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

                    {props.sites.map((item)=>

                        <option value={item.id}>{item.name +"("+item.address+")"}</option>

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




function ComponentItem() {

    return(
        <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">


            <div className={"col-4"}>

                 <img className={"img-fluid"} src={ComponentImg}/>
            </div>
            <div className={"col-8 pl-3 content-box-listing"}>
                <p style={{fontSize:"18px"}} className=" mb-1">{"MO31 Bi-Directional Motor"}</p>
                <p style={{fontSize:"16px"}} className="text-mute mb-1">{"Commercial Ovens > "}</p>
                <p style={{fontSize:"16px"}} className="text-mute mb-1">{"Spare parts"}</p>
            </div>



        </div>

    )


}





const mapStateToProps = state => {
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


    };
};

const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(CreateListing);