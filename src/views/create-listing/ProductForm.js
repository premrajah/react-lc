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



class ProductForm extends Component {



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


        }

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





    handleChangeFile(event) {

        console.log("change event files")
        console.log(event.target.files)

        var files = this.state.files
        var filesUrl = this.state.filesUrl

        this.uploadImage(event.target.files)

        for (var i = 0; i < event.target.files.length; i++) {


            files.push(event.target.files[i])
            filesUrl.push(URL.createObjectURL(event.target.files[i]))

        }


        console.log(files)
        console.log(filesUrl)

        this.setState({
            files: files,
            filesUrl: filesUrl
        })



    }



    handleCancel(e) {


        e.preventDefault()

        var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name;
        var url = e.currentTarget.dataset.url;

        console.log("image selected " + index)


        var files = this.state.files.filter((item) => item.name !== name)
        var filesUrl = this.state.filesUrl.filter((item) => item.url !== url)


        var images = this.state.images

        images.splice(index,1)


        this.setState({
            images: images
        })


        console.log(images)

        this.setState({

            files: files,
            filesUrl: filesUrl
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



    uploadImage(files) {


        if (files && files.length > 0) {


            for (var i = 0; i < files.length; i++) {


                this.getBase64(files[i]).then(

                    data => {

                        console.log("uploading "+i)
                        console.log(files[i])

                        axios.post(baseUrl + "artifact",
                            {
                                "metadata": {
                                    "name": "awestem.png",
                                    "mime_type": "image/png",
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

                                images.push(res.data.data.blob_url)


                                this.setState({
                                    images: images
                                })
                            console.log("images urls")
                            console.log(images)

                            }).catch(error => {

                                console.log("image upload error ")
                                // console.log(error.response.data)

                            })

                    }
                );

            }





        }


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


    handleValidationProduct() {

        // alert("called")
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





    loadType(field, event) {


        console.log(field,event.currentTarget.value)

        this.setState({

            catSelected: this.state.categories.filter((item) => item.name === event.currentTarget.value)[0]
        })

        this.setState({

            subCategories: this.state.categories.filter((item) => item.name === event.currentTarget.value)[0].types

        })



    }



    handleSubmitProduct = event => {

        event.preventDefault();


        const form = event.currentTarget;

        // if (this.handleValidationProduct()) {



            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            console.log("form data")

            // console.log(data.getAll())

            const title = data.get("title")
            const purpose = data.get("purpose")
            const   description = data.get("description")
            const   category= data.get("category")
            const    type= data.get("type")
            const     units=  data.get("units")

            const   serial= data.get("serial")
            const    model= data.get("model")
            const   brand= data.get("brand")

            const volume=data.get("volume")




            var productData=   {

                "purpose": purpose,
                "name": title,
                "description": description,
                "category": category,
                "type": type,
                "units": units,
                "serial": serial,
                "model": model,
                "brand": brand,
                "volume": volume,

                "year_of_making": data.get("manufacturedDate")



            }



        // var productData= {
        //     "name": "Product Prem 726",
        //     "description": "",
        //     "purpose": "prototype",
        //     "year_of_making": 2020,
        //     "stage": "certified",
        //     "category": "other",
        //     "type": "Other",
        //     "state": "Other",
        //     "units": "other",
        //     "volume": 0.0,
        //     "sku": {
        //         "brand": "",
        //         "model": "",
        //         "serial": null,
        //         "sku": null,
        //         "upc": null,
        //         "part_no": null
        //     }
        // }


            console.log("product data")

            console.log(productData)
        console.log(this.state.images)


            axios.put(baseUrl + "product",

                {
                    product : productData,
                    "child_product_ids": [],
                    "artifact_ids": [],
                }
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {


                    console.log(res.data)


                    console.log("product added succesfully")


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
        //     // alert("invalid")
        // }



    }

    getFiltersCategories() {

        axios.get(baseUrl + "category",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

            var responseAll = response.data.data;
            console.log("category response")
            console.log(responseAll)

            this.setState({

                categories: responseAll
            })

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


    }




    classes = useStylesSelect;






    render() {

        const classes = withStyles();
        const classesBottom = withStyles();


        return (

            <>




                    <HeaderWhiteBack history={this.props.history} heading={this.state.item && this.state.item.name} />

                    <div className="container   pb-4 pt-4">
                        
                        
                        <div className="row  pb-2 pt-4 ">

                            <div className="col-10">
                                <h3 className={"blue-text text-heading"}>Create A Product
                                </h3>

                            </div>
                            <div className="col-2 text-right">
                                <Close onClick={this.showProductSelection} className="blue-text" style={{ fontSize: 32 }} />
                            </div>
                        </div>
                        
                    </div>

                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-11"}>
                        <form onSubmit={this.handleSubmitProduct}>
                            <div className="row no-gutters justify-content-center ">


                                <div className="col-12 mb-3">
                                    <div className={"custom-label text-bold text-blue mb-3"}>What is the purpose of your new product?</div>
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

                                            {this.state.purpose.map((item) =>

                                                <option value={item}>{item}</option>

                                            )}

                                        </Select>
                                    </FormControl>
                                    {this.state.errorsProduct["purpose"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsProduct["purpose"]}</span>}


                                </div>


                                <div className="col-12 mb-3">
                                    <div className={"custom-label text-bold text-blue mb-3"}>What resources do you need to make this product?</div>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                        <Select
                                            native
                                            onChange={this.loadType.bind(this, "category")}
                                            inputProps={{
                                                name: 'category',
                                                id: 'outlined-age-native-simple',
                                           }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.categories.map((item) =>

                                                <option value={item._key}>{item.name}</option>

                                            )}

                                        </Select>
                                    </FormControl>
                                    {this.state.errorsProduct["category"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsProduct["category"]}</span>}


                                </div>

                                <div className="col-12 mb-3">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Select Type</div>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                        <Select
                                            native
                                            onChange={this.handleChangeProduct.bind(this, "type")}
                                            inputProps={{
                                                name: 'type',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.categories.map((item) =>

                                                <option value={item._key}>{item.name}</option>

                                            )}

                                        </Select>
                                    </FormControl>
                                    {this.state.errorsProduct["type"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsProduct["type"]}</span>}


                                </div>



                                <div className="col-12 mb-3">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Select State</div>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                        <Select
                                            native
                                            onChange={this.handleChangeProduct.bind(this, "type")}
                                            inputProps={{
                                                name: 'type',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.categories.map((item) =>

                                                <option value={item._key}>{item.name}</option>

                                            )}

                                        </Select>
                                    </FormControl>
                                    {this.state.errorsProduct["type"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsProduct["type"]}</span>}


                                </div>

                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Give your product a title </div>

                                    <TextField id="outlined-basic" type={"text"} label="Title" variant="outlined"
                                               fullWidth={true} name={"title"} onChange={this.handleChangeProduct.bind(this, "title")} />

                                    {this.state.errorsProduct["title"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsProduct["title"]}</span>}

                                </div>

                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Give it a description</div>

                                    <TextField multiline
                                               rows={4} type={"text"} id="outlined-basic" label="Description" variant="outlined" fullWidth={true} name={"description"} onChange={this.handleChangeProduct.bind(this, "description")} />

                                    {this.state.errorsProduct["description"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errorsProduct["description"]}</span>}

                                </div>









                                <div className="col-12 mt-4">

                                    <TextField onChange={this.handleChangeProduct.bind(this, "brand")} name={"brand"} id="outlined-basic" label="Brand" variant="outlined" fullWidth={true} />
                                    {this.state.errors["brand"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["brand"]}</span>}

                                </div>


                                <div className="col-12 mt-4">

                                    <TextField onChange={this.handleChangeProduct.bind(this, "model")} name={"model"} id="outlined-basic" label="Model Number" variant="outlined" fullWidth={true} />
                                    {this.state.errors["model"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["model"]}</span>}

                                </div>

                                <div className="col-12 mt-4">

                                    <TextField onChange={this.handleChangeProduct.bind(this, "serial")} name={"serial"} id="outlined-basic" label="Serial Number" variant="outlined" fullWidth={true} />
                                    {this.state.errors["serial"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["serial"]}</span>}

                                </div>


                                <div className="col-12  mt-4">



                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple">Year Of Manufacture</InputLabel>
                                        <Select
                                            native
                                            name={"manufacturedDate"}
                                            onChange={this.handleChangeProduct.bind(this, "manufacturedDate")}
                                            label="Year Of Manufacture"
                                            inputProps={{
                                                name: 'manufacturedDate',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.yearsList.map((item) =>

                                                <option value={item}>{item}</option>

                                            )}

                                        </Select>
                                    </FormControl>


                                    {this.state.errors["manufacturedDate"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["manufacturedDate"]}</span>}

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
                                                                    <label className={"label-file-input"} htmlFor="fileInput">
                                                                        <AddPhotoIcon  style={{ fontSize: 32, color: "#a8a8a8",margin:"auto" }} />
                                                                    </label>
                                                                    <input style={{display:"none"}} id="fileInput" className={""} multiple type="file" onChange={this.handleChangeFile} />


                                                                </div>




                                                                {/*<div className={"file-uploader-img-container"}>*/}

                                                                {this.state.files && this.state.files.map((item, index) =>

                                                                    <div className={"file-uploader-thumbnail-container"}>

                                                                        {/*<img src={URL.createObjectURL(item)}/>*/}
                                                                        <div data-index={index} data-url={URL.createObjectURL(item)}

                                                                             className={"file-uploader-thumbnail"} style={{ backgroundImage: "url(" + URL.createObjectURL(item) + ")" }}>
                                                                            <Cancel data-name={item.name} data-index={index} data-index={index} onClick={this.handleCancel.bind(this)} className={"file-upload-img-thumbnail-cancel"} />
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

                                    <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Finish</button>
                                </div>


                            </div>
                        </form>
                    </div>
                </div>



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
)(ProductForm);