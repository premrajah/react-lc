import React, { Component } from 'react';
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import SendIcon from '../img/send-icon.png';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import '../Util/upload-file.css'
import { Cancel,Check,Error } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles/index";
import AddPhotoIcon from '@material-ui/icons/AddAPhoto';
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import FormHelperText from '@material-ui/core/FormHelperText';
import _ from 'lodash';
import { Spinner} from 'react-bootstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';




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



class ProductEditForm extends Component {



    slug=null


    constructor(props) {

        super(props)

        this.state = {

            item:null,

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
            filesStatus:[],
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
            yearsList:[],
            purposeList: ["defined", "prototype", "aggregate"],
            purpose:null,
            product:null,
            parentProduct:null,
            imageLoading:false,
            showSubmitSite:false,
            is_listable:false

        }

        // this.slug = props.match.params.slug

        this.selectCategory = this.selectCategory.bind(this)
        this.selectType = this.selectType.bind(this)
        this.selectState = this.selectState.bind(this)

        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
        this.getFiltersCategories = this.getFiltersCategories.bind(this)
        this.selectSubCatType = this.selectSubCatType.bind(this)

        this.getProducts = this.getProducts.bind(this)
        this.selectProduct = this.selectProduct.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleChangeFile=this.handleChangeFile.bind(this)
        this.uploadImage=this.uploadImage.bind(this)
        this.showProductSelection=this.showProductSelection.bind(this)
        this.getSites=this.getSites.bind(this)
        this.showSubmitSite=this.showSubmitSite.bind(this)
        this.getResources=this.getResources.bind(this)
        this.loadSelection=this.loadSelection.bind(this)
        this.handleChangeSite=this.handleChangeSite.bind(this)
        this.loadImages=this.loadImages.bind(this)
        this.triggerCallback=this.triggerCallback.bind(this)
        this.checkListable=this.checkListable.bind(this)



    }


    checkListable(){


        this.setState({

            is_listable:!this.state.is_listable
        })
    }


    triggerCallback() {

        this.props.triggerCallback(this.props.isDuplicate?"duplicate":"edit")

    }


    loadImages() {




        let images = []




        let currentFiles = []

        for (let k=0;k<this.state.item.artifacts.length;k++){


               var fileItem={
                   status:1,
                   id:this.state.item.artifacts[k]._key,
                   url :this.state.item.artifacts[k].blob_url,
                  file:{
                       "mime_type": this.state.item.artifacts[k].mime_type,
                       "​​​​name": this.state.item.artifacts[k].name
                   }
               }
            // fileItem.status = 1  //success
            // fileItem.id = this.state.item.artifacts[k]._key
            // fileItem.url = this.state.item.artifacts[k].blob_url

                images.push(this.state.item.artifacts[k]._key)

            currentFiles.push(fileItem)



        }


        console.log("pre selection")
        console.log(currentFiles)

        this.setState({

            files: currentFiles,
        })

        this.setState({

            images: images,
        })





    }

        loadSelection(){




        let catSelected =  this.state.categories.filter((item) => item.name === this.state.item.product.category)[0]


                var subCategories = catSelected.types

                this.setState({

                    catSelected: catSelected
                })

                this.setState({

                    subCategories: subCategories

                })



        let subCatSelected = subCategories.filter((item) => item.name === this.state.item.product.type)[0]



        if (subCatSelected) {

            var states = subCatSelected.state

            var units = subCatSelected.units

            this.setState({

                subCatSelected: subCatSelected
            })

            this.setState({

                states: states,
                units: units

            })

            console.log(subCatSelected)
            console.log(states)

        }


    }




    getResources() {


        axios.get(baseUrl + "product/" + this.props.productId+"/expand",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data;
                    console.log("edit/duploacte product detail")
                    console.log(responseAll)

                    this.setState({

                        item: responseAll.data
                    })



                this.loadSelection()

                    this.loadImages()


                },
                (error) => {
                    console.log("listing error", error)

                    this.setState({

                        notFound: true
                    })
                }
            );

    }


    handleChangeFile(event) {

        console.log("change event files")
        console.log(event.target.files)

        let files = this.state.files
        // var filesUrl = this.state.filesUrl


        let newFiles = []

        for (var i = 0; i < event.target.files.length; i++) {

            files.push({file:event.target.files[i],status:0,id:null})
            newFiles.push({file:event.target.files[i],status:0,id:null})

        }


        //
        //
        console.log(files)
        // console.log(filesUrl)
        //


        this.setState({
            files: files,
        })


        this.uploadImage(newFiles)

    }





    handleCancel(e) {


        e.preventDefault()

        var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name;
        var url = e.currentTarget.dataset.url;

        console.log("image selected " + index)


        console.log("before delete")
        console.log(this.state.files)

        var files = this.state.files.filter((item) => item.file.name !== name)
        // var filesUrl = this.state.filesUrl.filter((item) => item.url !== url)


        console.log("after delete")
        console.log(files)

        // var images = this.state.images.filter((item)=> item !==index )

        // var images = this.state.images

        // images.splice(index,1)

        var images = []
        for (let k =0;k<files.length;k++){

            if (files[k].id){

                images.push(files[k].id)
            }

        }


        this.setState({
            images: images
        })


        console.log(images)

        this.setState({

            files: files,
        })



    }

    getBase64(file) {


        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


    uploadImageOld(files) {


        if (files && files.length > 0) {


            for (var i = 0; i < files.length; i++) {



                let imgFile = files[i]

                console.log(imgFile)


                this.getBase64(files[i]).then(

                    data => {

                        console.log("uploading "+i)
                        console.log(files[i])

                        axios.post(baseUrl + "artifact",
                            {
                                "metadata": {
                                    "name": imgFile.name,
                                    "mime_type": imgFile.type,
                                    "context": ""
                                },

                                data_as_base64_string: btoa(data)
                            },

                            {
                                headers: {
                                    "Authorization"
                                        :
                                    "Bearer " + this.props.userDetail.token
                                }
                            }



                        ).then(res => {

                            // console.log(res.data.content)


                            var images = this.state.images


                            images.push(res.data.data._key)


                            this.setState({

                                images: images,
                            })
                            console.log("images urls")
                            console.log(images)

                        }).catch(error => {

                            console.log("image upload error ")
                            console.log(error)
                            // console.log(error.response.data)

                        })

                    }
                );

            }





        }


    }


    uploadImage(files) {


        if (files.length > 0) {


            for (let i = 0; i < files.length; i++) {



                let imgFile = files[i]

                console.log(imgFile)


                this.getBase64(imgFile.file).then(

                    data => {


                        axios.post(baseUrl + "artifact",
                            {
                                "metadata": {
                                    "name": imgFile.file.name,
                                    "mime_type": imgFile.file.type,
                                    "context": ""
                            },

                                data_as_base64_string: btoa(data)
                            },
                            {
                                headers: {
                                    "Authorization"
                                        :
                                    "Bearer " + this.props.userDetail.token
                                }
                            }

                        ).then(res => {

                            // console.log(res.data.content)


                            let images = this.state.images

                            images.push(res.data.data._key)

                            this.setState({

                                images: images,
                            })


                            let currentFiles = this.state.files

                            for (let k=0;k<currentFiles.length;k++){

                                if (currentFiles[k].file.name === imgFile.file.name){


                                    currentFiles[k].status = 1  //success
                                    currentFiles[k].id = res.data.data._key  //success

                                }

                            }


                            this.setState({

                                files: currentFiles,
                            })


                            console.log("images urls")
                            console.log(images)

                        }).catch(error => {

                            console.log("image upload error")
                            console.log(error)
                            // console.log(error.response.data)



                            let currentFiles = this.state.files

                            for (let k=0;k<currentFiles.length;k++){

                                if (currentFiles[k].file.name === imgFile.file.name){

                                    currentFiles[k].status = 2  //failed

                                }

                            }


                            this.setState({

                                files: currentFiles,
                            })

                        })

                    }
                );

            }


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

    showSubmitSite(){


        this.setState({

            errorRegister:null
        })


        this.setState({

            showSubmitSite:!this.state.showSubmitSite
        })
    }


    handleSubmitSite = event => {


        this.setState({

            errorRegister:null
        })




        event.preventDefault();


        if(this.handleValidationSite()) {

            const form = event.currentTarget;


            console.log(new FormData(event.target))


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


            console.log("site submit called")


            axios.put(baseUrl + "site",

                {site: {
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

                    // this.toggleSite()
                    // this.getSites()


                    this.props.loadSites(this.props.userDetail.token)


                    this.showSubmitSite()


                }).catch(error => {


                console.log(error)



            });




        }
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

                    var responseAll = response.data.data;
                    console.log("sites  response")
                    console.log(responseAll)

                    this.setState({

                        sites: responseAll

                    })

                },
                (error) => {

                    console.log("sites response error")
                    console.log(error)

                }
            );

    }


    showProductSelection() {



        if (!this.props.parentProduct){



            this.props.setProduct(this.state.product)
            this.props.setParentProduct(this.state.parentProduct)


        }else{


        }


        this.props.loadProducts(this.props.userDetail.token)


        this.props.showProductPopUp({type:"sub_product_view",show:true})

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


    getProducts() {

        axios.get(baseUrl + "product",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;
                    console.log("resource response")
                    console.log(responseAll)

                    this.setState({

                        products: responseAll

                    })

                },
                (error) => {

                    var status = error.response.status
                    console.log("resource error")
                    console.log(error)

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

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
// =======
//         if (typeof fields["email"] !== "undefined") {
//             let lastAtPos = fields["email"].lastIndexOf("@");
//             let lastDotPos = fields["email"].lastIndexOf(".");

//             if (
//                 !(
//                     lastAtPos < lastDotPos &&
//                     lastAtPos > 0 &&
//                     fields["email"].indexOf("@@") === -1 &&
//                     lastDotPos > 2 &&
//                     fields["email"].length - lastDotPos > 2
//                 )
//             ) {
// >>>>>>> fe600133a7e564c485adc4f520a1e7468cb147f3
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errorsProduct: errors });


        console.log("val errors")
        console.log(errors)
        return formIsValid;
    }



    handleValidationProduct(data) {


        let fields = this.state.fieldsProduct;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!data.get("purpose")) {
            formIsValid = false;
            errors["purpose"] = "Required";
        }
        if (!data.get("title")) {
            formIsValid = false;
            errors["title"] = "Required";
        }

        if (!data.get("description")) {
            formIsValid = false;
            errors["description"] = "Required";
        }
        if (!data.get("category")) {
            formIsValid = false;
            errors["category"] = "Required";
        }

        if (!data.get("type")) {
            formIsValid = false;
            errors["type"] = "Required";
        }

        if (!data.get("state")) {
            formIsValid = false;
            errors["state"] = "Required";
        }

        if (!data.get("deliver")) {
            formIsValid = false;
            errors["deliver"] = "Required";
        }


        if (!data.get("units")) {
            formIsValid = false;
            errors["units"] = "Required";
        }

        if (!data.get("volume")) {
            formIsValid = false;
            errors["volume"] = "Required";
        }


        if (!data.get("manufacturedDate")) {
            formIsValid = false;
            errors["manufacturedDate"] = "Required";
        }




        // if (typeof data.get("email") !== "undefined") {
        //
        //     let lastAtPos = fields["email"].lastIndexOf('@');
        //     let lastDotPos = fields["email"].lastIndexOf('.');
        //
        //     if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
        //         formIsValid = false;
        //         errors["email"] = "Invalid email address";
        //     }
        // }

        this.setState({ errorsProduct: errors });
        return formIsValid;
    }


    handleChangeProduct(field, event) {


        console.log("handle change called "+field)

        let fields = this.state.fieldsProduct;
        fields[field] = event.target.value;
        this.setState({ fields });



        const value = event.target.value;

        this.setState({


            [field]: value
        });



        if (field === "category") {

            if (event.target.value !== "Select") {

                console.log(field, event.target.value)


                var catSelected = this.state.categories.filter((item) => item.name === event.target.value)[0]

                var subCategories = this.state.categories.filter((item) => item.name === event.target.value)[0].types

                this.setState({

                    catSelected: catSelected
                })

                this.setState({

                    subCategories: subCategories

                })


                console.log(catSelected)
                console.log(subCategories)

            } else {

                this.setState({

                    catSelected: null
                })

                this.setState({

                    subCategories: []

                })


            }
        }


        if (field === "type") {


            if (event.target.value !== "Select") {


                console.log(field, event.target.value)


                var subCatSelected = this.state.subCategories.filter((item) => item.name === event.target.value)[0]

                var states = this.state.subCategories.filter((item) => item.name === event.target.value)[0].state

                var units = this.state.subCategories.filter((item) => item.name === event.target.value)[0].units

                this.setState({

                    subCatSelected: subCatSelected
                })

                this.setState({

                    states: states,
                    units: units

                })


                console.log(subCatSelected)
                console.log(states)

            } else {

                this.setState({

                    subCatSelected: null
                })

                this.setState({

                    states: [],
                    units: []

                })

            }


        }




}



    handleSubmitProduct = event => {

        event.preventDefault();

        const data = new FormData(event.target);

        if (this.handleValidationProduct(data)) {


            const form = event.currentTarget;

            this.setState({
                btnLoading: true
            })


            console.log("form data")


            const title = data.get("title")
            const purpose = data.get("purpose")
            const description = data.get("description")
            const category = data.get("category")
            const type = data.get("type")
            const units = data.get("units")

            const serial = data.get("serial")
            const model = data.get("model")
            const brand = data.get("brand")

            const volume = data.get("volume")
            const sku = data.get("sku")
            const upc = data.get("upc")
            const part_no = data.get("part_no")
            const state = data.get("state")

            // const site=data.get("deliver")

            var productData = {

                "purpose": purpose,
                "name": title,
                "description": description,
                "category": category,
                "type": type,
                "units": units,
                "state": state,
                "volume": volume,
                // "stage" : "certified",
                "is_listable":this.state.is_listable,
                "sku": {
                    "serial": serial,
                    "model": model,
                    "brand": brand,
                    "sku": sku,
                    "upc": upc,
                    "part_no": part_no
                },

                "year_of_making": data.get("manufacturedDate")

            }


            var completeData;


            // if (this.props.parentProduct) {

                completeData = {

                    product: productData,
                    "sub_products": [],
                    "artifact_ids": this.state.images,
                    "site_id": data.get("deliver"),
                    "parent_product_id": null,


                }



            console.log("complete data")
            console.log(completeData)
            console.log(this.state.images)


            axios.put(baseUrl + "product",

                completeData
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {


                    console.log(res.data.data)

                    console.log("product added succesfully")


                    this.props.loadProducts(this.props.userDetail.token)


                    this.triggerCallback()


                    // if (this.slug) {
                    //     this.props.history.push("/sub-product-view/" + this.slug)
                    //
                    //
                    // }else{
                    //     this.props.history.push("/sub-product-view/" + res.data.data.product._key)
                    //
                    //
                    // }


                    // this.showProductSelection()

                    // this.getProducts()


                }).catch(error => {

                // dispatch(stopLoading())

                // dispatch(signUpFailed(error.response.data.message))

                console.log(error.data)
                // dispatch({ type: AUTH_FAILED });
                // dispatch({ type: ERROR, payload: error.data.error.message });


            });


            // } else {
            //
            //
            //
            // }

        }

    }



    updateSubmitProduct = event => {

        event.preventDefault();

        const data = new FormData(event.target);

        if (this.handleValidationProduct(data)) {


            const form = event.currentTarget;

            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            console.log("form data")


            const title = data.get("title")
            const purpose = data.get("purpose")
            const description = data.get("description")
            const category = data.get("category")
            const type = data.get("type")
            const units = data.get("units")

            const serial = data.get("serial")
            const model = data.get("model")
            const brand = data.get("brand")

            const volume = data.get("volume")
            const sku = data.get("sku")
            const upc = data.get("upc")
            const part_no = data.get("part_no")
            const state = data.get("state")

            const site=data.get("deliver")

            var productData = {

                "id": this.state.item.product._key,
                "update":{
                "purpose": purpose,
                "name": title,
                "description": description,
                "category": category,
                "type": type,
                "units": units,
                "state": state,
                "volume": volume,
                 "stage" : "certified",
                 "is_listable":this.state.is_listable,
                "sku": {
                    "serial": serial,
                    "model": model,
                    "brand": brand,
                    "sku": sku,
                    "upc": upc,
                    "part_no": part_no
                },

                "year_of_making": data.get("manufacturedDate")

            }
            }



            console.log("product data")

            console.log(productData)
            console.log(this.state.images)


            axios.post(baseUrl + "product",

                productData
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {


                    console.log(res.data.data)


                    if (!this.props.parentProduct) {

                        this.setState({
                            product: res.data.data,
                            parentProduct: res.data.data

                        })

                    }


                    this.triggerCallback()

                    // this.showProductSelection()

                    console.log("product updated succesfully")


                    // this.props.loadProducts(this.props.userDetail.token)


                    // if (this.slug) {
                    //     this.props.history.push("/sub-product-view/" + this.slug)
                    //
                    //
                    // }else{
                    //     this.props.history.push("/sub-product-view/" + res.data.data.product._key)
                    //
                    //
                    // }


                    // this.showProductSelection()

                    // this.getProducts()


                }).catch(error => {

                // dispatch(stopLoading())

                // dispatch(signUpFailed(error.response.data.message))

                console.log(error.data)
                // dispatch({ type: AUTH_FAILED });
                // dispatch({ type: ERROR, payload: error.data.error.message });


            });


            // } else {
            //
            //
            //
            // }

        }

    }

    getFiltersCategories() {

        axios.get(baseUrl + "category",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

                var responseAll = _.sortBy(response.data.data, ['name']);
                console.log("category response")
                console.log(responseAll)

                this.setState({

                    categories: responseAll
                })


                this.getResources()


            },
            (error) => {

                console.log("cat error")
                console.log(error)

            }
        );

    }



    selectCategory() {


        this.setState({

            activePage: 1
        })

    }



    selectProduct(event) {

        this.setState({

            productSelected: this.state.products.filter((item) => item.title === event.currentTarget.dataset.name)[0]
        })



        console.log(this.state.products.filter((item) => item.title === event.currentTarget.dataset.name)[0])


        this.setState({

            activePage: 5
        })

    }

    selectType(event) {


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



    componentWillMount() {
        window.scrollTo(0, 0)
    }

    componentDidMount() {


        this.getFiltersCategories()

        this.setUpYearList()


        this.props.loadSites(this.props.userDetail.token)




    }




    classes = useStylesSelect;






    render() {

        const classes = withStyles();
        const classesBottom = withStyles();


        return (

            <>

                {/*<HeaderWhiteBack history={this.props.history} heading={this.state.item && this.state.item.name} />*/}




                    <div className="row   justify-content-center create-product-row pb-2 pt-4 ">

                        <div className="col-11">
                            <h3 className={"blue-text text-heading"}>{this.props.isDuplicate?"Create Duplicate":"Edit Product"}
                            </h3>

                        </div>

                    </div>


                {this.state.item &&

                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-11"}>
                        <form onSubmit={this.props.isDuplicate?this.handleSubmitProduct:this.updateSubmitProduct}>
                            <div className="row no-gutters justify-content-center ">


                                <div className="col-12 mb-3">
                                    <div className={"custom-label text-bold text-blue mb-3"}>What is the purpose of your
                                        new product?
                                    </div>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                        <Select
                                            native

                                            onChange={this.handleChangeProduct.bind(this, "purpose")}

                                            inputProps={{
                                                name: 'purpose',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.purposeList.map((item) =>

                                                <option selected={this.state.item.product.purpose === item?true:false} value={item}>{item}</option>
                                            )}

                                        </Select>
                                    </FormControl>
                                    {this.state.errorsProduct["purpose"] && <span className={"text-mute small"}><span
                                        style={{ color: "red" }}>* </span>{this.state.errorsProduct["purpose"]}</span>}


                                </div>


                                <div className="col-12 mb-3">
                                    <div className={"row"}>
                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                            <div className={"custom-label text-bold text-blue mb-3"}>Resource Category
                                            </div>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                                <Select
                                                    native

                                                    onChange={this.handleChangeProduct.bind(this, "category")}
                                                    inputProps={{
                                                        name: 'category',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >

                                                    {/*<option value={null}>Select</option>*/}

                                                    {this.state.categories.map((item) =>

                                                        <option selected={this.state.item.product.category === item.name?true:false} value={item.name}>{item.name}</option>
                                                    )}

                                                </Select>

                                                <FormHelperText>What resources do you need to make this
                                                    product? </FormHelperText>

                                            </FormControl>
                                            {this.state.errorsProduct["category"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["category"]}</span>}
                                        </div>


                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                            <div className={"custom-label text-bold text-blue mb-3"}>Type</div>
                                            <FormControl
                                                         variant="outlined" className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                                <Select
                                                    native
                                                    onChange={this.handleChangeProduct.bind(this, "type")}
                                                    inputProps={{
                                                        name: 'type',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >

                                                    {/*<option value={null}>Select</option>*/}

                                                    {this.state.subCategories.map((item) =>

                                                        <option selected={this.state.item.product.type === item.name?true:false} value={item.name}>{item.name}</option>
                                                    )}

                                                </Select>
                                            </FormControl>
                                            {this.state.errorsProduct["type"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["type"]}</span>}


                                        </div>


                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>
                                            <div className={"custom-label text-bold text-blue mb-3"}>State</div>
                                            <FormControl
                                                         variant="outlined" className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                                <Select
                                                    native
                                                    onChange={this.handleChangeProduct.bind(this, "state")}
                                                    inputProps={{
                                                        name: 'state',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >

                                                    {/*<option  value={null}>Select</option>*/}

                                                    {this.state.states.map((item) =>

                                                        <option selected={this.state.item.product.state === item?true:false} value={item}>{item}</option>
                                                    )}

                                                </Select>
                                            </FormControl>
                                            {this.state.errorsProduct["type"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["type"]}</span>}

                                        </div>
                                    </div>

                                </div>


                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Give your product a title
                                    </div>

                                    <TextField


                                        id="outlined-basic" type={"text"} label="Title" variant="outlined"
                                               fullWidth={true} name={"title"}
                                               value={this.state.title?this.state.title:this.state.item.product.name}
                                               onChange={this.handleChangeProduct.bind(this, "title")}/>

                                    {this.state.errorsProduct["title"] && <span className={"text-mute small"}><span
                                        style={{ color: "red" }}>* </span>{this.state.errorsProduct["title"]}</span>}



                                </div>
                                <div className="col-12 mt-4">

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                // checked={this.state.is_listable}
                                                checked={this.state.is_listable?this.state.is_listable:this.state.item.product.is_listable}
                                                onChange={this.checkListable}
                                                // onChange={this.handleChangeProduct.bind(this, "description")}/>
                                                name="is_listable"
                                                color="primary"
                                            />
                                        }
                                        label="Is Listable ?"
                                    />

                                </div>

                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Give it a description</div>

                                    <TextField multiline
                                               value={this.state.description?this.state.description:this.state.item.product.description}
                                               rows={4} type={"text"} id="outlined-basic" label="Description"
                                               variant="outlined" fullWidth={true} name={"description"}
                                               onChange={this.handleChangeProduct.bind(this, "description")}/>

                                    {this.state.errorsProduct["description"] &&
                                    <span className={"text-mute small"}><span
                                        style={{ color: "red" }}>* </span>{this.state.errorsProduct["description"]}</span>}

                                </div>


                                <div className="col-12 mt-4">

                                    <div className="row">
                                        <div className="col-md-4 col-sm-6 col-xs-6">

                                            <div className={"custom-label text-bold text-blue mb-1"}>Brand</div>


                                            <TextField

                                                value={this.state.brand?this.state.brand:this.state.item.product.sku.brand}

                                                onChange={this.handleChangeProduct.bind(this, "brand")}
                                                       name={"brand"} id="outlined-basic" variant="outlined"
                                                       fullWidth={true}/>
                                            {this.state.errorsProduct["brand"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["brand"]}</span>}

                                        </div>

                                        <div className="col-md-4 col-sm-6 col-xs-6">

                                            <div className={"custom-label text-bold text-blue mb-1"}>Model Number</div>

                                            <TextField value={this.state.model}
                                                       value={this.state.model?this.state.model:this.state.item.product.sku.model}

                                                       onChange={this.handleChangeProduct.bind(this, "model")}
                                                       name={"model"} id="outlined-basic" variant="outlined"
                                                       fullWidth={true}/>
                                            {this.state.errorsProduct["model"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["model"]}</span>}
                                        </div>


                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <div className={"custom-label text-bold text-blue mb-1"}>Serial Number</div>


                                            <TextField
                                                value={this.state.serial?this.state.serial:this.state.item.product.sku.serial}
                                                onChange={this.handleChangeProduct.bind(this, "serial")}
                                                       name={"serial"} id="outlined-basic" variant="outlined"
                                                       fullWidth={true}/>
                                            {this.state.errorsProduct["serial"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["serial"]}</span>}

                                        </div>


                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <div className={"custom-label text-bold text-blue mb-1"}>SKU</div>

                                            <TextField

                                                value={this.state.sku?this.state.serial:this.state.item.product.sku.sku}
                                                onChange={this.handleChangeProduct.bind(this, "sku")}
                                                       name={"sku"} id="outlined-basic" variant="outlined"
                                                       fullWidth={true}/>
                                            {this.state.errorsProduct["sku"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["sku"]}</span>}

                                        </div>


                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <div className={"custom-label text-bold text-blue mb-1"}>UPC</div>


                                            <TextField

                                                value={this.state.upc?this.state.upc:this.state.item.product.sku.upc}
                                                onChange={this.handleChangeProduct.bind(this, "upc")}
                                                       name={"upc"} id="outlined-basic" variant="outlined"
                                                       fullWidth={true}/>
                                            {this.state.errorsProduct["upc"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["upc"]}</span>}

                                        </div>

                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <div className={"custom-label text-bold text-blue mb-1"}>Part No.</div>


                                            <TextField
                                                value={this.state.part_no?this.state.part_no:this.state.item.product.sku.part_no}

                                                onChange={this.handleChangeProduct.bind(this, "part_no")}
                                                       name={"part_no"} id="outlined-basic" variant="outlined"
                                                       fullWidth={true}/>
                                            {this.state.errorsProduct["part_no"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["part_no"]}</span>}
                                        </div>

                                    </div>

                                </div>


                                <div className="col-12 mt-4">
                                    <div className="row no-gutters justify-content-center ">
                                        <div className="col-12 ">
                                            <div className={"custom-label text-bold text-blue mb-1"}>Quantity</div>
                                        </div>


                                        <div className="col-6 pr-2">


                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel htmlFor="outlined-age-native-simple">Unit</InputLabel>
                                                <Select
                                                    name={"units"}
                                                    native
                                                    onChange={this.handleChangeProduct.bind(this, "units")}

                                                    label="Age"
                                                    inputProps={{
                                                        name: 'units',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >

                                                    {/*<option value={null}>Select</option>*/}


                                                    {this.state.units.map((item) =>

                                                        <option selected={this.state.item.product.units === item?true:false} value={item}>{item}</option>
                                                    )}

                                                </Select>
                                            </FormControl>
                                            {this.state.errorsProduct["unit"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["unit"]}</span>}


                                        </div>
                                        <div className="col-6 pl-2">

                                            <TextField

                                                value={this.state.volume?this.state.volume:this.state.item.product.volume}

                                                type={"number"}
                                                       onChange={this.handleChangeProduct.bind(this, "volume")}
                                                       name={"volume"}
                                                       id="outlined-basic" label="Volume" variant="outlined"
                                                       fullWidth={true}/>
                                            {this.state.errorsProduct["volume"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["volume"]}</span>}


                                        </div>
                                    </div>
                                </div>


                                <div className="col-12  mt-4">

                                    <div className="row camera-grids   no-gutters   ">

                                        <div className="col-md-6 col-sm-12 col-xs-12 pr-2 ">

                                            <div className={"custom-label text-bold text-blue mb-1"}>Year Of
                                                Manufacture
                                            </div>


                                            <FormControl variant="outlined" className={classes.formControl}>
                                                {/*<InputLabel htmlFor="outlined-age-native-simple">Year Of Manufacture</InputLabel>*/}
                                                <Select
                                                    native
                                                    name={"manufacturedDate"}
                                                    onChange={this.handleChangeProduct.bind(this, "manufacturedDate")}
                                                    // label="Year Of Manufacture"
                                                    inputProps={{
                                                        name: 'manufacturedDate',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >


                                                    {this.state.yearsList.map((item) =>

                                                        <option selected={this.state.item.product.year_of_making === item?true:false}    value={item}>{item}</option>
                                                    )}

                                                </Select>
                                            </FormControl>


                                            {this.state.errorsProduct["manufacturedDate"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["manufacturedDate"]}</span>}

                                        </div>

                                        <div className="col-md-6 col-sm-12 col-xs-12 pl-2">

                                            <div className={"custom-label text-bold text-blue mb-1"}>Collect At</div>


                                            <FormControl variant="outlined" className={classes.formControl}>

                                                <Select
                                                    name={"deliver"}
                                                    native
                                                    onChange={this.handleChangeProduct.bind(this, "deliver")}
                                                    inputProps={{
                                                        name: 'deliver',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >



                                                    {this.props.siteList.map((item) =>

                                                        <option
                                                            selected={this.state.item.site._key === item._key?true:false}
                                                            value={item._key}>{item.name + "(" + item.address + ")"}</option>
                                                    )}

                                                </Select>

                                            </FormControl>


                                            {this.state.errorsProduct["deliver"] &&
                                            <span className={"text-mute small"}><span
                                                style={{ color: "red" }}>* </span>{this.state.errorsProduct["deliver"]}</span>}


                                            <p style={{ margin: "10px 0" }}> Don’t see it on here? <span
                                                onClick={this.showSubmitSite}
                                                className={"green-text forgot-password-link text-mute small"}>Add a site</span>
                                            </p>


                                            {this.state.showSubmitSite &&

                                            <div className={"row justify-content-center p-2 container-gray"}>
                                                <div className="col-md-12 col-sm-12 col-xs-12 ">

                                                    <div className={"custom-label text-bold text-blue mb-1"}>Add New
                                                        Site
                                                    </div>

                                                </div>
                                                <div className="col-md-12 col-sm-12 col-xs-12 ">

                                                    <div className={"row"}>
                                                        <div className={"col-12"}>
                                                            <form onSubmit={this.handleSubmitSite}>
                                                                <div className="row no-gutters justify-content-center ">

                                                                    <div className="col-12 mt-4">

                                                                        <TextField id="outlined-basic" label=" Name"
                                                                                   variant="outlined" fullWidth={true}
                                                                                   name={"name"}
                                                                                   onChange={this.handleChangeSite.bind(this, "name")}/>

                                                                        {this.state.errorsSite["name"] &&
                                                                        <span className={"text-mute small"}><span
                                                                            style={{ color: "red" }}>* </span>{this.state.errorsSite["name"]}</span>}

                                                                    </div>

                                                                    <div className="col-12 mt-4">

                                                                        <TextField id="outlined-basic" label="Contact"
                                                                                   variant="outlined" fullWidth={true}
                                                                                   name={"contact"}
                                                                                   onChange={this.handleChangeSite.bind(this, "contact")}/>

                                                                        {this.state.errorsSite["contact"] &&
                                                                        <span className={"text-mute small"}><span
                                                                            style={{ color: "red" }}>* </span>{this.state.errorsSite["contact"]}</span>}

                                                                    </div>

                                                                    <div className="col-12 mt-4">

                                                                        <TextField id="outlined-basic" label="Address"
                                                                                   variant="outlined" fullWidth={true}
                                                                                   name={"address"} type={"text"}
                                                                                   onChange={this.handleChangeSite.bind(this, "address")}/>

                                                                        {this.state.errorsSite["address"] &&
                                                                        <span className={"text-mute small"}><span
                                                                            style={{ color: "red" }}>* </span>{this.state.errorsSite["address"]}</span>}

                                                                    </div>
                                                                    <div className="col-12 mt-4">

                                                                        <TextField id="outlined-basic" type={"number"}
                                                                                   name={"phone"}
                                                                                   onChange={this.handleChangeSite.bind(this, "phone")}
                                                                                   label="Phone" variant="outlined"
                                                                                   fullWidth={true}/>

                                                                        {this.state.errorsSite["phone"] &&
                                                                        <span className={"text-mute small"}><span
                                                                            style={{ color: "red" }}>* </span>{this.state.errorsSite["phone"]}</span>}

                                                                    </div>

                                                                    <div className="col-12 mt-4">

                                                                        <TextField id="outlined-basic" label="Email"
                                                                                   variant="outlined" fullWidth={true}
                                                                                   name={"email"} type={"email"}
                                                                                   onChange={this.handleChangeSite.bind(this, "email")}/>

                                                                        {this.state.errorsSite["email"] &&
                                                                        <span className={"text-mute small"}><span
                                                                            style={{ color: "red" }}>* </span>{this.state.errorsSite["email"]}</span>}

                                                                    </div>
                                                                    <div className="col-12 mt-4">

                                                                        <TextField
                                                                            onChange={this.handleChangeSite.bind(this, "others")}
                                                                            name={"others"} id="outlined-basic"
                                                                            label="Others" variant="outlined"
                                                                            fullWidth={true} type={"others"}/>

                                                                        {/*{this.state.errorsSite["others"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsSite["others"]}</span>}*/}

                                                                    </div>

                                                                    <div className="col-12 mt-4">

                                                                        <button type={"submit"}
                                                                                className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Add
                                                                            Site
                                                                        </button>
                                                                    </div>


                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>


                                                </div>


                                            </div>}


                                        </div>

                                    </div>
                                </div>


                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Add Photos</div>

                                    <div className="container-fluid  pb-5 ">

                                        <div className="row camera-grids   no-gutters   ">

                                            <div className="col-12  text-left ">

                                                <div className="">
                                                    <div className={""}>
                                                        {/*<img src={CameraGray} className={"camera-icon-preview"}/>*/}

                                                        <div className={"file-uploader-box"}>

                                                            <div className={"file-uploader-thumbnail-container"}>

                                                                <div className={"file-uploader-thumbnail-container"}>
                                                                    <label className={"label-file-input"}
                                                                           htmlFor="fileInput">
                                                                        <AddPhotoIcon style={{
                                                                            fontSize: 32,
                                                                            color: "#a8a8a8",
                                                                            margin: "auto"
                                                                        }}/>
                                                                    </label>
                                                                    <input accept={"image/jpeg,image/jpg,image/png"}
                                                                           style={{ display: "none" }} id="fileInput"
                                                                           className={""} multiple type="file"
                                                                           onChange={this.handleChangeFile.bind(this)}/>


                                                                </div>


                                                                {this.state.files && this.state.files.map((item, index) =>

                                                                    <div
                                                                        className={"file-uploader-thumbnail-container"}>

                                                                        {/*<img src={URL.createObjectURL(item)}/>*/}
                                                                        <div data-index={index}
                                                                             // data-url={URL.createObjectURL(item.file)}

                                                                             className={"file-uploader-thumbnail"}
                                                                             style={{ backgroundImage: "url(" + item.url?item.url:URL.createObjectURL(item.file) + ")" }}>

                                                                            {item.status === 0 && <Spinner
                                                                                as="span"
                                                                                animation="border"
                                                                                size="sm"
                                                                                role="status"
                                                                                aria-hidden="true"
                                                                                style={{ color: "#cccccc" }}
                                                                                className={"center-spinner"}

                                                                            />}

                                                                            {item.status === 1 &&
                                                                            <Check style={{ color: "#cccccc" }}
                                                                                   className={" file-upload-img-thumbnail-check"}/>}
                                                                            {item.status === 2 && <span
                                                                                className={"file-upload-img-thumbnail-error"}><Error
                                                                                style={{ color: "red" }}
                                                                                className={" "}/>
                                                                            <p>Error!</p>
                                                                            </span>}
                                                                            <Cancel data-name={item.file&&item.file.name?item.file.name:""}
                                                                                    data-index={item.id}
                                                                                    onClick={this.handleCancel.bind(this)}
                                                                                    className={"file-upload-img-thumbnail-cancel"}/>

                                                                        </div>
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


                                <div className="col-12 mt-4 mb-5">

                                    {this.state.files.length > 0 ?
                                        (this.state.files.filter((item) => item.status === 0).length > 0 ? <button
                                                className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-gray login-btn"}>Upload
                                                in progress ....</button> :
                                            <button type={"submit"}
                                                    className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Finish</button>) :

                                        <button type={"submit"}
                                                className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Finish</button>

                                    }


                                </div>


                            </div>
                        </form>
                    </div>
                </div>
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

    const handleChangeProduct = (event) => {
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
                    onChange={handleChangeProduct}
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

    const handleChangeProduct = (event) => {
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
                    onChange={handleChangeProduct}
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
        parentProduct:state.parentProduct,
        product:state.product,
        showProductPopUp:state.showProductPopUp,
        siteList: state.siteList,



    };
};

const mapDispachToProps = dispatch => {
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



    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductEditForm);
