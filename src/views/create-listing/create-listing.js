import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import SendIcon from '../../img/send-icon.png';
import Select from '@material-ui/core/Select';
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
import MomentUtils from '@date-io/moment';

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



class CreateListing extends Component {



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
            showAddComponent: false,
            siteSelected: null,
            files: [],
            filesUrl: [],
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



        }

        this.selectCreateSearch = this.selectCreateSearch.bind(this)
        this.selectCategory = this.selectCategory.bind(this)
        this.selectType = this.selectType.bind(this)
        this.selectState = this.selectState.bind(this)
        this.addDetails = this.addDetails.bind(this)
        this.linkProduct = this.linkProduct.bind(this)
        this.searchLocation = this.searchLocation.bind(this)
        this.previewSearch = this.previewSearch.bind(this)
        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
        this.getFiltersCategories = this.getFiltersCategories.bind(this)
        this.selectSubCatType = this.selectSubCatType.bind(this)
        this.handleNext = this.handleNext.bind(this)
        this.handleBack = this.handleBack.bind(this)
        this.getProducts = this.getProducts.bind(this)
        this.selectProduct = this.selectProduct.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.createListing = this.createListing.bind(this)

        this.loadMatches = this.loadMatches.bind(this)
        this.showCreateSite = this.showCreateSite.bind(this)
        this.getSites = this.getSites.bind(this)
        this.toggleAddComponent = this.toggleAddComponent.bind(this)
        this.toggleSite = this.toggleSite.bind(this)
        this.toggleFree = this.toggleFree.bind(this)
        this.toggleSale = this.toggleSale.bind(this)
        this.handleChangeFile = this.handleChangeFile.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.setUpYearList = this.setUpYearList.bind(this)
        this.makeFirstActive=this.makeFirstActive.bind(this)



    }



    setUpYearList(){


        let years=[]

        let currentYear = (new Date()).getFullYear();

        //Loop and add the Year values to DropDownList.
        for (let i = currentYear; i >= 1950; i--) {

            years.push(i)
        }

        this.setState({

            yearsList: years
        })
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


    handleChangeFile(event) {

        console.log(event.target.files)

        var files = []
        var filesUrl = []


        for (var i = 0; i < event.target.files.length; i++) {


            files.push(event.target.files[i])
            filesUrl.push(URL.createObjectURL(event.target.files[i]))

            console.log(URL.createObjectURL(event.target.files[i]))

        }

        this.setState({
            files: files,
            filesUrl: filesUrl
        })


        this.uploadImage(files)
    }


    handleCancel(e) {


        e.preventDefault()

        var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name;
        var url = e.currentTarget.dataset.url;

        console.log("image selected " + index)


        var files = this.state.files.filter((item) => item.name !== name)
        var filesUrl = this.state.filesUrl.filter((item) => item.url !== url)



        this.setState({

            files: files,
            filesUrl: filesUrl
        })



    }

    getBase64(file) {

        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        //
        //
        // return reader.result;
        // reader.onload = () => resolve(reader.result);
        // reader.onerror = error => reject(error);



        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }



    uploadImage(files) {




        if (files && files.length > 0) {



            for (var i = 0; i < files.length; i++) {


                this.getBase64(files[0]).then(
                    data => {
                        console.log(data)


                        axios.post(baseUrl + "resource/image64", btoa(data)
                            , {
                                headers: {
                                    "Authorization": "Bearer " + this.props.userDetail.token
                                }
                            }
                        )
                            .then(res => {

                                console.log(res.data.content)


                                var images = this.state.images

                                images.push(res.data.content)


                                this.setState({
                                    images: images
                                })

                            }).catch(error => {

                                console.log("image upload error ")
                                // console.log(error.response.data)

                            })

                    }
                );

            }





        }


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


    toggleSite() {

        this.setState({
            showCreateSite: !this.state.showCreateSite
        })
    }


    getProducts() {

        axios.get(baseUrl + "product",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                var response = response.data.content;
                console.log("resource response")
                console.log(response)

                this.setState({

                    products: response

                })

            },
                (error) => {

                    var status = error.response.status
                    console.log("resource error")
                    console.log(error)

                }
            );

    }

    getSites() {



        axios.get(baseUrl + "site",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                var response = response.data.content;
                console.log("sites  response")
                console.log(response)

                this.setState({

                    sites: response

                })

            },
                (error) => {

                    var status = error.response.status
                    console.log("sites error")
                    console.log(error)

                }
            );

    }

    createListing() {



        var data = {}



        if (this.state.price) {
            data = {

                "name": this.state.title,
                "description": this.state.description,
                "category": this.state.catSelected.name,
                "type": this.state.subCatSelected.name,
                "units": "units",

                "serial": this.state.serial,
                "model": this.state.model,
                "brand": this.state.brand,

                "volume": this.state.volume,
                "state": this.state.stateSelected,
                "site_id": this.state.siteSelected,
                "age": {
                    "unit": "MILLISECOND",
                    "value": new Date(this.state.manufacturedDate).getTime()
                },
                "availableFrom": {
                    "unit": "MILLISECOND",
                    "value": new Date(this.state.startDate).getTime()
                },
                "expiry": {
                    "unit": "MILLISECOND",
                    "value": new Date(this.state.endDate).getTime()
                },
                "price": {
                    "value": this.state.price,
                    "currency": "gbp"
                },
                "images": this.state.images
            }

        }else{


            data = {

                "name": this.state.title,
                "description": this.state.description,
                "category": this.state.catSelected.name,
                "type": this.state.subCatSelected.name,
                "units": "units",

                "serial": this.state.serial,
                "model": this.state.model,
                "brand": this.state.brand,

                "volume": this.state.volume,
                "state": this.state.stateSelected,
                "site_id": this.state.siteSelected,
                "age": {
                    "unit": "MILLISECOND",
                    "value": new Date(this.state.manufacturedDate).getTime()
                },
                "availableFrom": {
                    "unit": "MILLISECOND",
                    "value": new Date(this.state.startDate).getTime()
                },
                "expiry": {
                    "unit": "MILLISECOND",
                    "value": new Date(this.state.startDate).getTime() + 8640000000
                },

                "images": this.state.images
            }
        }

        axios.post(baseUrl + "resource",
            data, {
            headers: {
                "Authorization": "Bearer " + this.props.userDetail.token
            }
        }
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


    toggleAddComponent() {

        this.setState({
            showAddComponent: !this.state.showAddComponent
        })
    }



    // handleChangeSite = (event) => {
    //     //
    //     // const name = event.target.name;
    //     //
    //
    //     // setState({
    //     //     ...state,
    //     //     [name]: event.target.value,
    //     // });
    //     //
    //
    // };


    loadMatches() {


        for (var i = 0; i < this.state.listResourceData.resources.length; i++) {

            axios.get(baseUrl + "resource/" + this.state.listResourceData.resources[i],
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
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






    makeFirstActive(){

// alert("make home active")




        this.setState({

            page: 1,
            activePage: 0,
            progressBar: 33

        })


    }


    handleBack() {


        if (this.state.page === 3) {



                this.setState({

                    page: 2,
                    activePage: 4,
                    progressBar: 66
                })


        }


      else  if (this.state.page === 2) {

                this.setState({

                    page: 1,
                    activePage: 0,
                    progressBar: 33
                })



        }

    }


      handleNext() {



        console.log("next clicked ", this.state.page ,this.state.activePage )


        if (this.state.activePage === 0) {


            if (this.handleValidation()) {

                  this.setState({

                    activePage: 4,
                    page: 2,
                    progressBar: 66
                })


            }


        }

        else if (this.state.activePage === 4) {


            this.setState({

                activePage: 5,
                page: 3,
                progressBar: 100
            })

            // this.createSearch()


        }


        else if (this.state.activePage === 5) {


            if (this.handleValidationAddDetail()) {


                // alert("on page 4")

                this.setState({

                    activePage: 7,
                    page: 4,
                    progressBar: 100
                })


                this.createListing()
            }

        }


        else if (this.state.activePage === 7) {


            this.setState({

                activePage: 8,

            })

        }



    }


    getResources() {



    }


    getFiltersCategories() {

        axios.get(baseUrl + "category",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

            var response = response.data.content;
            console.log("resource response")
            console.log(response)

            this.setState({

                categories: response
            })

        },
            (error) => {

                var status = error.response.status
                console.log("resource error")
                console.log(error)

            }
        );

    }





    selectCreateSearch() {


        this.setState({

            activePage: 0,
            page: 1
        })


    }


    selectCategory() {


        this.setState({

            activePage: 1
        })

    }



    selectProduct(event) {

        // console.log(this.state.categories.filter((item) => item.name === event.currentTarget.dataset.name))

        this.setState({

            productSelected: this.state.products.filter((item) => item.title === event.currentTarget.dataset.name)[0]
        })



        console.log(this.state.products.filter((item) => item.title === event.currentTarget.dataset.name)[0])


        this.setState({

            activePage: 5
        })

    }

    selectType(event) {

        // console.log(this.state.categories.filter((item) => item.name === event.currentTarget.dataset.name))

        this.setState({

            catSelected: this.state.categories.filter((item) => item.name === event.currentTarget.dataset.name)[0]
        })

        this.setState({

            subCategories: this.state.categories.filter((item) => item.name === event.currentTarget.dataset.name)[0].types

        })

        this.setState({

            activePage: 2
        })

    }


    selectSubCatType(event) {


        this.setState({

            subCatSelected: this.state.subCategories.filter((item) => event.currentTarget.dataset.name === item.name)[0]

        })


        this.setState({

            activePage: 3,
            states: this.state.subCategories.filter((item) => event.currentTarget.dataset.name === item.name)[0].state

        })


    }



    selectState(event) {


        this.setState({

            stateSelected: event.currentTarget.dataset.name
        })


        this.setState({

            activePage: 0,

            units: this.state.subCatSelected.units

        })

    }

    handleDateChange() {



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


            // alert(fields["manufacturedDate"])

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




    showCreateSite() {



    }
    handleValidationDetail() {

        // alert("called")
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




        if (!fields["startDate"]) {
            formIsValid = false;
            errors["startDate"] = "Required";
        } else {


            this.setState({

                startDate: fields["startDate"]
            })
        }

        // if(!fields["unit"]){
        //     formIsValid = false;
        //     errors["unit"] = "Required";
        // }




        if (this.state.catSelected.name && this.state.subCatSelected.name && this.state.stateSelected) {


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



        this.setState({

            nextBlue: formIsValid
        })

    }


    handleValidationAddDetail() {

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["deliver"]) {
            formIsValid = false;
            errors["deliver"] = "Required";
        }

        // if(!fields["endDate"]){
        //     formIsValid = false;
        //     errors["endDate"] = "Required";
        // }

        if (!fields["startDate"]) {
            formIsValid = false;
            errors["startDate"] = "Required";
        } else {



            // alert(fields["startDate"])
            this.setState({

                startDate: fields["startDate"]
            })
        }



        if (!fields["endDate"]) {
            formIsValid = false;
            errors["endDate"] = "Required";
        } else {

            this.setState({

                endDate: fields["endDate"]
            })
        }







        console.log(errors)

        this.setState({ errors: errors });
        return formIsValid;

    }


    handleValidationAddDetailNextColor() {

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["deliver"]) {
            formIsValid = false;
            errors["deliver"] = "Required";
        } else {

            this.setState({

                siteSelected: fields["deliver"]
            })

            // alert(fields["deliver"])

        }


        if (!fields["startDate"]) {
            formIsValid = false;
            errors["startDate"] = "Required";
        } else {

            this.setState({

                startDate: fields["startDate"]
            })

        }


        if (!this.state.productSelected) {
            formIsValid = false;
            errors["product"] = "Required";
        }


        this.setState({

            nextBlueAddDetail: formIsValid
        })


    }



    handleChange(field, e) {



        let fields = this.state.fields;
        fields[field] = e.target.value;

        // alert(fields[field])

        this.setState({ fields });
        this.handleValidationNextColor()
        this.handleValidationAddDetailNextColor()


        this.setState({

            price: fields["price"]
        })





        // alert(new Date(fields["manufacturedDate"]).getTime())


    }





    addDetails() {


        this.setState({

            activePage: 4
        })

    }



    linkProduct() {


        this.getProducts()

        // alert(5)

        this.setState({

            activePage: 6

        })

    }



    searchLocation() {

        this.setState({

            activePage: 6
        })
    }


    previewSearch() {


        this.setState({

            activePage: 7
        })
    }





    interval


    componentWillMount() {
        window.scrollTo(0, 0)
    }

    componentDidMount() {




        this.getFiltersCategories()

        this.setUpYearList()
        this.getSites()


    }




    classes = useStylesSelect;






    handleValidationSite() {

        // alert("called")
        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["email"]) {
            formIsValid = false;
            errors["password"] = "Required";
        }
        if (!fields["address"]) {
            formIsValid = false;
            errors["address"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }


        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
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



        if (!fields["others"]) {
            formIsValid = false;
            errors["others"] = "Required";
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

            // alert("site submit")
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


            axios.post(baseUrl + "site",

                {
                    "name": name,
                    "email": email,
                    "contact": contact,
                    "address": address,
                    "phone": phone,
                    "others": others

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


            // alert("valid")

            // }else {
            //
            //
            //     // alert("invalid")
            // }


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


                <div className={this.state.activePage === 0 ? "" : "d-none"}>

                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Create a Listing </h6>
                            </div>


                            <div className="col-2 text-right">


                                <Link to={"/"}><Close className="blue-text" style={{ fontSize: 32 }} /></Link>

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
                                    {this.state.errors["title"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["title"]}</span>}


                                </div>

                                <div className="col-12 mt-4">

                                    <TextField onChange={this.handleChange.bind(this, "description")} name={"description"} id="outlined-basic" label="Description" multiline
                                        rows={4} variant="outlined" fullWidth={true} />
                                    {this.state.errors["description"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["description"]}</span>}



                                </div>
                                <div className="col-12 mt-4" onClick={this.selectCategory}>

                                    <div onClick={this.selectCategory} className={"dummy-text-field"}>

                                        {this.state.catSelected && this.state.catSelected.name && this.state.subCatSelected && this.state.stateSelected ?

                                            this.state.catSelected.name + " > " + this.state.subCatSelected.name + " > " + this.state.stateSelected : "Resource Category"}


                                    </div>
                                    {this.state.errors["category"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["category"]}</span>}


                                </div>

                                <div className="col-12 mt-4">

                                    <TextField onChange={this.handleChange.bind(this, "brand")} name={"brand"} id="outlined-basic" label="Brand" variant="outlined" fullWidth={true} />
                                    {this.state.errors["brand"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["brand"]}</span>}

                                </div>


                                <div className="col-12 mt-4">

                                    <TextField onChange={this.handleChange.bind(this, "model")} name={"model"} id="outlined-basic" label="Model Number" variant="outlined" fullWidth={true} />
                                    {this.state.errors["model"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["model"]}</span>}

                                </div>

                                <div className="col-12 mt-4">

                                    <TextField onChange={this.handleChange.bind(this, "serial")} name={"serial"} id="outlined-basic" label="Serial Number" variant="outlined" fullWidth={true} />
                                    {this.state.errors["serial"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["serial"]}</span>}

                                </div>


                                <div className="col-12  mt-4">



                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple">Year Of Manufacture</InputLabel>
                                        <Select
                                            native
                                            name={"manufacturedDate"}
                                            onChange={this.handleChange.bind(this, "manufacturedDate")}
                                            label="Year Of Manufacture"
                                            inputProps={{
                                                name: 'Year Of Manufacture',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.yearsList.map((item) =>

                                                <option value={item}>{item}</option>

                                            )}

                                        </Select>
                                    </FormControl>

                                    {/*<TextField*/}
                                        {/*onChange={this.handleChange.bind(this, "manufacturedDate")}*/}
                                        {/*name={"manufacturedDate"}*/}
                                        {/*id="input-with-icon-textfield"*/}
                                        {/*InputLabelProps={{*/}
                                            {/*shrink: true,*/}
                                            {/*name: "manufacturedDate"*/}
                                        {/*}}*/}
                                        {/*label="Year Of Manufacture"*/}
                                        {/*type={"date"}*/}
                                        {/*variant="outlined"*/}
                                        {/*className={clsx(classes.margin, classes.textField) + " full-width-field"}*/}
                                        {/*id="input-with-icon-textfield"*/}
                                        {/*minDate={new Date()}*/}
                                        {/*InputProps={{*/}
                                            {/*endAdornment: (*/}
                                                {/*<InputAdornment position="end">*/}
                                                    {/*<img className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />*/}
                                                {/*</InputAdornment>*/}
                                            {/*),*/}
                                        {/*}}*/}
                                    {/*/>*/}
                                    {this.state.errors["manufacturedDate"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["manufacturedDate"]}</span>}

                                </div>



                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Add Photos</div>

                                    <div className="container  pb-5 ">

                                        <div className="row camera-grids   no-gutters   ">

                                            <div className="col-4 p-1 text-center ">

                                                <div className="">
                                                    <div className={"card-body"}>
                                                        {/*<img src={CameraGray} className={"camera-icon-preview"}/>*/}

                                                        <div className={"file-uploader-box"}>
                                                            <input className={""} multiple type="file" onChange={this.handleChangeFile} />
                                                            <div className={"file-uploader-img-container"}>

                                                                {this.state.files && this.state.files.map((item, index) =>

                                                                    <div className={"file-uploader-thumbnail-container"}>

                                                                        {/*<img src={URL.createObjectURL(item)}/>*/}
                                                                        <div data-index={index} data-url={URL.createObjectURL(item)}

                                                                            className={"file-uploader-thumbnail"} style={{ backgroundImage: "url(" + URL.createObjectURL(item) + ")" }}>
                                                                            <Cancel data-name={item.name} data-index={index} onClick={this.handleCancel.bind(this)} className={"file-upload-img-thumbnail-cancel"} />
                                                                        </div>
                                                                    </div>

                                                                )}

                                                            </div>

                                                        </div>


                                                    </div>
                                                </div>

                                            </div>
                                            {/*<div className="col-4 p-1 text-center ">*/}

                                            {/*<div className="card shadow border-0 mb-3 container-gray border-rounded">*/}
                                            {/*<div className={"card-body"}>*/}
                                            {/*<img src={CameraGray} className={"camera-icon-preview"}/>*/}
                                            {/*</div>*/}
                                            {/*</div>*/}

                                            {/*</div>*/}
                                            {/*<div className="col-4  p-1 text-center ">*/}

                                            {/*<div className="card shadow border-0 mb-3 container-gray border-rounded ">*/}
                                            {/*<div className={"card-body"}>*/}

                                            {/*<img style={{padding: "10px"}} src={PlusGray} className={"camera-icon-preview"}/>*/}

                                            {/*/!*<AddIcon style={{color:"#747474",fontSize:"32px"}}/>*!/*/}

                                            {/*</div>*/}
                                            {/*</div>*/}

                                            {/*</div>*/}
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






                <div className={this.state.activePage === 1 ? "" : "d-none"}>

                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Select a category </h6>
                            </div>


                            <div className="col-2" style={{textAlign:"right"}}>

                                <Close onClick={this.selectCreateSearch} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>

                    <div className="container  mt-2 mb-5 pb-5  pt-3">

                        {this.state.categories.map((item) =>

                            <div data-name={item.name} className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3" onClick={this.selectType.bind(this)}>
                                <div className="col-2">
                                    <img className={"icon-left-select"} src={SendIcon} alt="" />
                                </div>
                                <div className="col-8">

                                    <p className={"blue-text "} style={{ fontSize: "16px", marginBottom: "5px" }}>{item.name}</p>
                                    <p className={"text-mute small"} style={{ fontSize: "14px" }}>{item.types.length + " Types"}</p>

                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>

                        )}

                    </div>
                </div>



                <div className={this.state.activePage === 2 ? "" : "d-none"}>
                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Select a type </h6>
                            </div>

                            <div className="col-2" style={{textAlign:"right"}}>

                                <Close onClick={this.selectCreateSearch} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>

                    <div className="container mt-2 mb-5 pb-5  ">

                        {this.state.subCategories && this.state.subCategories.map((item) =>

                            <div data-name={item.name} className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3"
                                onClick={this.selectSubCatType.bind(this)}>
                                <div className="col-10">

                                    <p className={" "} style={{ fontSize: "16px" }}>{item.name}</p>

                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>
                        )}

                    </div>
                </div>




                <div className={this.state.activePage === 3 ? "" : "d-none"}>

                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Select a State </h6>
                            </div>


                            <div className="col-2" style={{textAlign:"right"}}>


                                <Close onClick={this.selectCreateSearch} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>

                    <div className="container   pb-3 pt-3">

                        {this.state.states.map((item) =>

                            <div data-name={item} className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3  " onClick={this.selectState.bind(this)}>
                                <div className="col-10">
                                    <p className={" "} style={{ fontSize: "16px" }}>{item}</p>

                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>

                        )}

                    </div>
                </div>




                <div className={this.state.activePage === 4? "" : "d-none"}>


                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>List Components </h6>
                            </div>


                            <div className="col-2 text-right">

                                <Close className="blue-text" style={{ fontSize: 32 }} onClick={this.makeFirstActive} />

                            </div>


                        </div>
                    </div>

                    <div className="container  search-container pb-5 pt-3">
                        <div className="row no-gutters">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>List Components
                                </h3>
                                <p>Does this resource have any components that you wish to list? List them below.</p>

                            </div>
                        </div>
                        <div className="row no-gutters flex-column  mt-2">

                            <div className={"custom-label text-bold text-blue mb-3"}>Components</div>


                            <ComponentItem title="Macerating Unit" subTitle="Kitchen Equipment > Other" serialNo="1234321" imageName={MaceratingImg} />
                            <ComponentItem title="Pump Assembly" subTitle="Kitchen Equipment > Other" serialNo="2345321" imageName={PumpImg} />
                            <ComponentItem title="Dewatering Unit" subTitle="Kitchen Equipment > Other" serialNo="0022331" imageName={DewateringImg} />
                            <ComponentItem title="Control Panel" subTitle="Kitchen Equipment > Other" serialNo="9988776" imageName={ControlImg} />


                            <div className="col-12 mb-3">

                                <p style={{ margin: "10px 0" }} onClick={this.toggleAddComponent} className={"green-text forgot-password-link text-mute small"}>+ Add Component</p>


                            </div>

                        </div>
                    </div>
                </div>



                <div className={this.state.activePage === 5 ? "" : "d-none"}>

                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Add Details </h6>
                            </div>


                            <div className="col-auto">

                                <Link onClick={this.handleBack}><Close className="blue-text" style={{ fontSize: 32 }} /></Link>

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
                                                      <div className="col-12 mb-3">



                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel htmlFor="outlined-age-native-simple">Deliver To</InputLabel>
                                    <Select
                                        name={"deliver"}
                                        native
                                        label="Deliver To"
                                        onChange={this.handleChange.bind(this, "deliver")}

                                        inputProps={{
                                            name: 'deliver',
                                            id: 'outlined-age-native-simple',
                                        }}
                                    >

                                        <option value={null}>Select</option>

                                        {this.state.sites.map((item) =>

                                            <option value={item.id}>{item.name + "(" + item.address + ")"}</option>

                                        )}

                                    </Select>
                                </FormControl>


                                {this.state.errors["deliver"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["deliver"]}</span>}


                                <p style={{ margin: "10px 0" }} onClick={this.toggleSite} className={"green-text forgot-password-link text-mute small"}>Add new Site</p>
                            </div>
                            <div className="col-12 mb-3">


                                <MuiPickersUtilsProvider utils={MomentUtils}>

                                    <DatePicker
                                        minDate={new Date()}
                                                label="Required By"
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



                            <div className="col-12 mb-3">

                                <MuiPickersUtilsProvider utils={MomentUtils}>

                                    <DatePicker minDate={this.state.startDate?this.state.startDate:new Date()}
                                                label="Required By"
                                                inputVariant="outlined"
                                                variant={"outlined"}
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="End Date "
                                                format="DD/MM/yyyy"
                                                value={this.state.endDate} onChange={this.handleChangeDateEndDate.bind(this)} />



                                </MuiPickersUtilsProvider>


                                {/*<TextField*/}
                                    {/*onChange={this.handleChange.bind(this, "endDate")}*/}
                                    {/*name={"endDate"}*/}
                                    {/*id="input-with-icon-textfield"*/}
                                    {/*InputLabelProps={{*/}
                                        {/*shrink: true,*/}
                                    {/*}}*/}
                                    {/*label="Expires"*/}
                                    {/*type={"date"}*/}
                                    {/*variant="outlined"*/}
                                    {/*className={clsx(classes.margin, classes.textField) + " full-width-field"}*/}
                                    {/*id="input-with-icon-textfield"*/}
                                    {/*minDate={new Date()}*/}
                                    {/*InputProps={{*/}
                                        {/*endAdornment: (*/}
                                            {/*<InputAdornment position="end">*/}
                                                {/*<img className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />*/}
                                            {/*</InputAdornment>*/}
                                        {/*),*/}
                                    {/*}}*/}
                                {/*/>*/}
                                {this.state.errors["endDate"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["endDate"]}</span>}


                            </div>


                            <div className="col-12 mb-3">

                                <p>Price</p>

                                <div onClick={this.toggleSale} className={!this.state.free ? "btn-select-free green-bg" : "btn-select-free"}>For Sale</div>

                                <div onClick={this.toggleFree} className={this.state.free ? "btn-select-free green-bg" : "btn-select-free"}>Free</div>


                            </div>

                            {!this.state.free && <div className="col-12 mb-5">

                                <TextField
                                    onChange={this.handleChange.bind(this, "price")}
                                    id="input-with-icon-textfield"
                                    label="£"
                                    variant="outlined"
                                    className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                    id="input-with-icon-textfield"

                                />

                            </div>
                            }

                        </div>
                    </div>
                </div>



                <div className={this.state.activePage === 6 ? "" : "d-none"}>


                    <div className="container  pt-2 pb-3">

                        <div className="row no-gutters">
                            <div className="col-10">

                                <h6>Link a Product </h6>
                            </div>


                            <div className="col-auto">


                                <Close onClick={""} className="blue-text" style={{ fontSize: 32 }} />

                            </div>


                        </div>
                    </div>


                    <div className="container   pb-3 pt-3">

                        {this.state.products.map((item) =>
                            <div data-name={item.title} className="row mr-2 ml-2 selection-row unselected-row p-3 mb-3  " onClick={this.selectProduct}>
                                <div className="col-2">
                                    <img className={"icon-left-select"} src={SendIcon} alt="" />
                                </div>
                                <div className="col-8">
                                    <p className={"blue-text "} style={{ fontSize: "16px" }}>{item.title}</p>
                                    <p className={"text-mute small"} style={{ fontSize: "16px" }}>{item.searches.length} Searches</p>

                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon />
                                </div>
                            </div>

                        )}

                    </div>




                </div>



                <div className={this.state.activePage === 7 ? "" : "d-none"}>

                    <div className="container  pt-3 pb-3">

                        <div className="row no-gutters justify-content-end">

                            <div className="col-auto">

                                <button className="btn   btn-link text-dark menu-btn">
                                    <Close onClick={""} className="" style={{ fontSize: 32 }} />

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


                                <img className={"search-icon-middle"} src={ProductBlue} alt="" />

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


                <div className={this.state.activePage === 8 ? "" : "d-none"}>


                    {this.state.listResourceData &&
                        <>
                            <div className="container  pt-3 pb-3">

                                <div className="row no-gutters">
                                    <div className="col-auto" style={{ margin: "auto" }}>

                                        <NavigateBefore style={{ fontSize: 32 }} />
                                    </div>

                                    <div className="col text-center blue-text" style={{ margin: "auto" }}>
                                        <p>View Search </p>
                                    </div>

                                    <div className="col-auto">

                                        <button className="btn   btn-link text-dark menu-btn">
                                            <Close onClick={""} className="" style={{ fontSize: 32 }} />

                                        </button>
                                    </div>


                                </div>
                            </div>


                            <div className="container ">


                                <div className="row container-gray justify-content-center pb-5 pt-5">

                                    <div className="col-auto pb-5 pt-5">
                                        <img className={"my-search-icon-middle"} src={SearchIcon} alt="" />

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
                                        <p style={{ fontSize: "16px" }} className={"text-gray-light "}>{this.state.listResourceData.description}
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
                                        <img className={"icon-about"} src={ListIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>

                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Surrey, UK</p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.listResourceData.category} ></p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.listResourceData.type}</p>

                                    </div>
                                </div>
                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={AmountIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>

                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Amount</p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.listResourceData.volume} {this.state.listResourceData.units}</p>
                                    </div>
                                </div>


                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={StateIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>

                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">State</p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.listResourceData.state}</p>
                                    </div>
                                </div>

                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={CalenderIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>

                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Required by </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">{moment(this.state.listResourceData.expiry.value).format("DD MMM YYYY")} </p>
                                    </div>
                                </div>
                                <div className="row  justify-content-start search-container  pb-4">
                                    <div className={"col-1"}>
                                        <img className={"icon-about"} src={MarkerIcon} alt="" />
                                    </div>
                                    <div className={"col-auto"}>

                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Location  </p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">Mapledown, Which Hill Lane,</p>
                                        <p style={{ fontSize: "18px" }} className="  mb-1">Woking, Surrey, GU22 0AH</p>
                                    </div>
                                </div>


                                {/*<BottomAppBar />*/}


                            </div>



                        </>
                    }
                </div>



                <div className={this.state.activePage === 9 ? "" : "d-none"}>



                    <HeaderWhiteBack history={this.props.history} heading={"Preview Matches"} />


                    <div className="container   pb-4 ">


                        {this.state.resourcesMatched.map((item) =>

                            <ResourceItem item={item} />

                        )}


                    </div>

                </div>

                {this.state.activePage < 9 &&
                    <React.Fragment>

                        <CssBaseline />

                        <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                            {/*<ProgressBar now={this.state.progressBar}  />*/}
                            {this.state.page < 4 && <LinearProgress variant="determinate" value={this.state.progressBar} />}
                            <Toolbar>


                                {this.state.activePage === 6 &&

                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                        <div className="col-auto">
                                            <p style={{ margin: "10px 0" }} className={"green-text forgot-password-link text-mute small"}>
                                                <Link to={"/create-product"} >Create New Product  </Link> </p>

                                        </div>

                                    </div>
                                }


                                {this.state.activePage < 7 && this.state.activePage !== 6 &&

                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                        <div className="col-auto">
                                            {this.state.page > 1  && <button type="button" onClick={this.handleBack}
                                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                Back

                                    </button>}
                                        </div>
                                        <div className="col-auto" style={{ margin: "auto" }}>

                                            <p className={"blue-text"}> Page {this.state.page}/3</p>
                                        </div>
                                        <div className="col-auto">

                                            {this.state.page === 1 &&
                                                <button onClick={this.handleNext} type="button"
                                                    className={this.state.nextBlue ? "btn-next shadow-sm mr-2 btn btn-link blue-btn   mt-2 mb-2 " : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "}>
                                                    Next

                                                </button>}


                                            {this.state.page === 2 &&
                                                <button onClick={this.handleNext} type="button"
                                                    className={this.state.nextBlueAddDetail ? "btn-next shadow-sm mr-2 btn btn-link blue-btn       mt-2 mb-2 " : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "}>
                                                    Next

                                                  </button>}


                                            {this.state.page === 3 &&
                                                <button onClick={this.handleNext} type="button"
                                                    className={this.state.nextBlueAddDetail ? "btn-next shadow-sm mr-2 btn btn-link blue-btn       mt-2 mb-2 " : "btn-next shadow-sm mr-2 btn btn-link btn-gray mt-2 mb-2 "}>
                                                    Post Listing

                                    </button>
                                            }


                                        </div>
                                    </div>}

                                {this.state.activePage === 7 &&
                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>


                                        {this.state.listResourceData && <div className="col-auto">


                                            <Link to={"/" + this.state.listResourceData && this.state.listResourceData.id} type="button" className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">

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
                                        <form onSubmit={this.handleSubmitComponent}>
                                            <div className="row no-gutters justify-content-center ">

                                                <div className="col-12 mt-4">

                                                    <TextField id="outlined-basic" label="Component Name" variant="outlined" fullWidth={true} name={"name"} onChange={this.handleChangeSite.bind(this, "name")} />

                                                    {this.state.errors["name"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["name"]}</span>}

                                                </div>

                                                <div className="col-12 mt-4">

                                                    <TextField id="outlined-basic" label="Brand " variant="outlined" fullWidth={true} name={"brand"} onChange={this.handleChangeSite.bind(this, "brand")} />

                                                    {this.state.errors["brand"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["brand"]}</span>}

                                                </div>

                                                <div className="col-12 mt-4">

                                                    <TextField id="outlined-basic" label="Model Number(If Applicable)" variant="outlined" fullWidth={true} name={"model"} type={"text"} onChange={this.handleChangeSite.bind(this, "model")} />

                                                    {this.state.errors["model"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["model"]}</span>}

                                                </div>
                                                <div className="col-12 mt-4">

                                                    <TextField id="outlined-basic" type={"serial"} name={"serial"} label="Serial Number" variant="outlined" fullWidth={true} />


                                                </div>
                                                <div className="col-12 mt-4">

                                                    <div className="  ">

                                                        <div className="row camera-grids   no-gutters   ">
                                                            <div className="col-4 p-1 text-center ">

                                                                <div className="card shadow border-0 mb-3 container-gray border-rounded">
                                                                    <div className={"card-body"}>
                                                                        <img src={CameraGray} className={"camera-icon-preview"} alt="" />
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="col-4  p-1 text-center ">

                                                                <div className="card shadow border-0 mb-3 container-gray border-rounded ">
                                                                    <div className={"card-body"}>

                                                                        <img style={{ padding: "10px" }} src={PlusGray} className={"camera-icon-preview"} alt="" />

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


                                     < Close onClick={this.toggleSite} className="blue-text" style={{ fontSize: 32 }} />

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

                                                    <TextField id="outlined-basic" type={"number"} name={"phone"} label="Phone" variant="outlined" fullWidth={true} />
                                                    {this.state.errorsSite["phone"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["phone"]}</span>}


                                                </div>

                                                <div className="col-12 mt-4">

                                                    <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChangeSite.bind(this, "email")} />

                                                    {this.state.errorsSite["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["email"]}</span>}

                                                </div>
                                                <div className="col-12 mt-4">

                                                    <TextField onChange={this.handleChangeSite.bind(this, "others")} name={"others"} id="outlined-basic" label="Others" variant="outlined" fullWidth={true} type={"others"} />

                                                    {this.state.errorsSite["others"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["others"]}</span>}

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