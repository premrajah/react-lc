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

import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import PaperImg from '../../img/paper.png';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AppBar from '@material-ui/core/AppBar';

import TextField from '@material-ui/core/TextField';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar,ProgressBar} from 'react-bootstrap';

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
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import LinearProgress from '@material-ui/core/LinearProgress';


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


class  SearchForm extends Component {


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
            page:1,
            fields: {},
            errors: {},
            units:[],
            progressBar: 33,
            products:[],
            productSelected: null
        }

        this.selectCreateSearch=this.selectCreateSearch.bind(this)
        this.selectCategory=this.selectCategory.bind(this)
        this.selectType=this.selectType.bind(this)
        this.selectState=this.selectState.bind(this)
        this.addDetails=this.addDetails.bind(this)
        this.nextClick=this.nextClick.bind(this)
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

    nextClick(){


        if (this.state.active<4){

            this.setState({

                active:4
            })

        }


        else  if (this.state.active==4){


            this.setState({

                active:7
            })

        }

        else  if (this.state.active==7){


            this.setState({

                active:8
            })

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

            // alert("page 1")

            if (this.handleValidation()){

                // alert("all valid")

                this.setState({

                    active:4,
                    page: 2,
                    progressBar: 66
                })


            }

        }
       else if (this.state.page==2){



            if (this.handleValidation()){

                // alert("all valid")

                this.setState({

                    active:8,
                    page: 4,
                    progressBar: 100
                })


            }



        }

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

            active:0
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



        this.setState({

            active: 4
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
            units:this.state.subCatSelected.units

        })

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
        if(!fields["endDate"]){
            formIsValid = false;
            errors["endDate"] = "Required";
        }

        if(!fields["startDate"]){
            formIsValid = false;
            errors["startDate"] = "Required";
        }



        if(!this.state.productSelected){
            formIsValid = false;
            errors["product"] = "Required";
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



    handleChange(field, e){
        let fields = this.state.fields;
        fields[field] = e.target.value;

        // alert(e.target.value)
        this.setState({fields});
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

            active:5

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



    render() {

        const    classes = withStyles();
        const classesBottom = withStyles();


        return (

            <>


                <div className="container  p-2">
                </div>



                <div className={this.state.active == 0?"":"d-none"}>

                <div className="container  pt-2 pb-3">

                    <div className="row no-gutters">
                        <div className="col-10">

                            <h6>Create a Search </h6>
                        </div>


                        <div className="col-auto">


                            <Link to={"/create-search"}><Close  className="blue-text" style={{ fontSize: 32 }} /></Link>

                        </div>


                    </div>
                </div>

                <div className="container   pb-5 pt-5">
                    <div className="row no-gutters">
                        <div className="col-auto">
                            <h3 className={"blue-text text-heading"}>The Basics
                            </h3>

                        </div>
                    </div>


                    <form onSubmit={this.handleSubmit}>
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
                    </div>
                    <div className="row no-gutters justify-content-center mt-4">

                    <div className="col-6 pr-2">

                        <UnitSelect units={this.state.units} />

                        {/*<FormControl variant="outlined" className={classes.formControl}>*/}
                            {/*<InputLabel htmlFor="outlined-age-native-simple">Unit</InputLabel>*/}
                            {/*<Select*/}
                                {/*// onChange={this.handleChange.bind(this, "unit")}*/}
                                {/*name={"unit"}*/}
                                {/*native*/}

                                {/*inputProps={{*/}
                                    {/*name: 'unit',*/}
                                    {/*id: 'outlined-age-native-simple',*/}
                                {/*}}*/}
                            {/*>*/}

                                {/*{this.state.units.map((item)=>*/}

                                    {/*<option value={"Kg"}>{item}</option>*/}

                                {/*)}*/}

                            {/*</Select>*/}
                        {/*</FormControl>*/}

                        {/*{this.state.errors["unit"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["unit"]}</span>}*/}


                    </div>
                        <div className="col-6 pl-2">

                            <TextField onChange={this.handleChange.bind(this, "volume")} name={"volume"} id="outlined-basic" label="Volume" variant="outlined" fullWidth={true} />
                            {this.state.errors["volume"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["volume"]}</span>}


                        </div>
                    </div>
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

                    <div className="container   pb-3 pt-3">

                    {this.state.categories.map((item)=>

                        <div data-name={item.name} className="row mr-2 ml-2 selection-row selected-row p-3 mb-3" onClick={this.selectType.bind(this)}>
                            <div className="col-2">
                                <img className={"icon-left-select"} src={SendIcon} />
                            </div>
                            <div className="col-8">

                                <p className={"blue-text "} style={{fontSize:"16px"}}>{item.name}</p>
                                <p className={"text-mute small"}  style={{fontSize:"16px"}}>{item.name.types}</p>

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

                    <div className="container   pb-3 pt-3">

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
                            <div onClick={this.linkProduct}  className="col-12 mb-3">


                                <div  className={"dummy-text-field"}>
                                    {this.state.productSelected?this.state.productSelected.title:"Link new a product"}
                                    <img  className={"input-field-icon"} src={LinkGray} style={{ fontSize: 24, color: "#B2B2B2" }}/>
                                </div>
                                {this.state.errors["linkProduct"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["linkProduct"]}</span>}


                            </div>
                            <div className="col-12 mb-3">

                                <TextField
                                    name={"deliver"}
                                    onChange={this.handleChange.bind(this, "deliver")}
                                    label={"Deliver to "}
                                    variant="outlined"
                                    className={clsx(classes.margin, classes.textField)+" full-width-field" }
                                    id="input-with-icon-textfield"

                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <img  className={"input-field-icon"} src={MarkerGrey} style={{ fontSize: 24, color: "#B2B2B2" }}/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {this.state.errors["deliver"] && <span className={"text-mute small"}><span  style={{color: "red"}}>* </span>{this.state.errors["deliver"]}</span>}


                            </div>
                            <div className="col-12 mb-3">

                                <TextField

                                    onChange={this.handleChange.bind(this, "startDate")}

                                    name={"startDate"}
                                    id="input-with-icon-textfield"

                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    label="Start Date"
                                    type={"date"}
                                    variant="outlined"
                                    className={clsx(classes.margin, classes.textField)+" full-width-field" }
                                    id="input-with-icon-textfield"

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
                                    name={"endDate"}
                                    onChange={this.handleChange.bind(this, "endDate")}
                                    id="input-with-icon-textfield"

                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    label="End Date"
                                    type={"date"}
                                    variant="outlined"
                                    className={clsx(classes.margin, classes.textField)+" full-width-field" }
                                    id="input-with-icon-textfield"

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

                        </div>
                    </div>
                </div>




                <div className={this.state.active == 5?"":"d-none"}>


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
                                    <p className={"text-mute small"}  style={{fontSize:"16px"}}>2 Searches</p>

                                </div>
                                <div className="col-2">
                                    <NavigateNextIcon/>
                                </div>
                            </div>

                        )}


                            {/*<div className="row mr-2 ml-2 selection-row unselected-row p-3  mb-3 " onClick={this.selectType}>*/}
                                {/*<div className="col-2">*/}
                                    {/*<img className={"icon-left-select"} src={SendIcon} />*/}
                                {/*</div>*/}
                                {/*<div className="col-8">*/}
                                    {/*<p className={"blue-text "} style={{fontSize:"16px"}}>Prototype 01</p>*/}
                                    {/*<p className={"text-mute small"}  style={{fontSize:"16px"}}>5 Searches</p>*/}

                                {/*</div>*/}
                                {/*<div className="col-2">*/}
                                    {/*<NavigateNextIcon/>*/}
                                {/*</div>*/}
                            {/*</div>*/}


                        </div>

                </div>




                <div className={this.state.active == 7?"":"d-none"}>

                        <div className="container  pt-3 pb-3">

                            <div className="row no-gutters">
                                <div className="col-auto" style={{margin:"auto"}}>

                                    <NavigateBefore  style={{ fontSize: 32 }}/>
                                </div>

                                <div className="col text-center blue-text"  style={{margin:"auto"}}>
                                    <p>Preview Search </p>
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
                                    <h5 className={"blue-text text-heading"}>Food boxes needed
                                    </h5>

                                </div>
                            </div>


                            <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                                <div className="col-auto">
                                    <p  style={{fontSize:"16px"}} className={"text-gray-light "}>Looking for disposable food boxes. Any sizes are suitable. Please message me if you have any available.
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
                                    <p style={{fontSize:"18px"}} className="  mb-1">Paper and Card ></p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">Disposable Food Boxes</p>

                                </div>
                            </div>
                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={AmountIcon} />
                                </div>
                                <div className={"col-auto"}>

                                    <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Amount</p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">10 Kgs</p>
                                </div>
                            </div>


                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={StateIcon} />
                                </div>
                                <div className={"col-auto"}>

                                    <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">State</p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">Bailed</p>
                                </div>
                            </div>

                            <div className="row  justify-content-start search-container  pb-4">
                                <div className={"col-1"}>
                                    <img className={"icon-about"} src={CalenderIcon} />
                                </div>
                                <div className={"col-auto"}>

                                    <p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Required by </p>
                                    <p style={{fontSize:"18px"}} className="  mb-1">June 1, 2020 </p>
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


                            <BottomAppBar />


                        </div>


                </div>




                <div className={this.state.active == 8?"":"d-none"}>

                    <div className="container  listing-row-border">

                        <div className="row no-gutters">
                            <div className="col-auto" style={{margin:"auto"}}>

                                <NavigateBefore  style={{ fontSize: 32 }}/>
                            </div>

                            <div className="col text-left blue-text"  style={{margin:"auto"}}>
                                <p>View Matches </p>
                            </div>

                            <div className="col-auto">

                                <button className="btn   btn-link text-dark menu-btn">
                                    <Close onClick={this.selectCreateSearch} className="" style={{ fontSize: 32 }} />

                                </button>
                            </div>


                        </div>
                    </div>

                    <div className="container   pb-4 ">
                        <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">

                            <div className={"col-4"}>

                                <img className={"img-fluid"} src={PaperImg}/>
                            </div>
                            <div className={"col-6 pl-3 content-box-listing"}>
                                <p style={{fontSize:"18px"}} className=" mb-1">Metal</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">Loose / 14 kg</p>
                                <p style={{fontSize:"16px"}} className="text-mute mb-1">@Tescos</p>
                            </div>
                            <div style={{textAlign:"right"}} className={"col-2"}>
                                <p className={"orange-text small"}>Matched</p>
                            </div>
                        </div>



                        <div className="row justify-content-center pb-2 pt-5 mt-5 ">

                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Almost there?
                                </h3>

                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 pd-5 ">

                            <div className="col-auto">
                                <p className={"text-gray-light small text-center"}>Please log in or sign up to complete your search.
                                </p>

                            </div>
                        </div>



                        <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                            <div className="col-auto">

                                <button type="button"
                                        className="shadow-sm mr-2 btn btn-link blue-btn mt-5 mb-2 btn-blue">
                                    Create a Search

                                </button>
                            </div>
                        </div>




                    </div>

                </div>

                <React.Fragment>



                    <CssBaseline/>

                    <AppBar  position="fixed" color="#ffffff" className={classesBottom.appBar+"  custom-bottom-appbar"}>
                        {/*<ProgressBar now={this.state.progressBar}  />*/}
                        <LinearProgress variant="determinate" value={this.state.progressBar} />
                        <Toolbar>

                            {this.state.active<8 ?

                                <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                                  <div className="col-auto">
                                      {this.state.page>1&&    <button type="button" onClick={this.handleBack}
                                            className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                        Back

                                    </button>}
                                </div>
                                <div className="col-auto" style={{margin:"auto"}}>

                                    <p  className={"blue-text"}> Page {this.state.page}/3</p>
                                </div>
                                <div className="col-auto">

                                    <button onClick={this.handleNext} type="button"
                                            className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                        {this.state.active!=7?"Next":"Post Search"}

                                    </button>
                                </div>
                            </div>:

                                <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                                    <div className="col-auto">
                                        <button type="button"
                                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                            Log in

                                        </button>
                                    </div>

                                    <div className="col-auto">

                                        <button onClick={this.handleNext} type="button"
                                                className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                            Sign Up

                                        </button>
                                    </div>
                                </div>


                            }

                        </Toolbar>
                    </AppBar>



                </React.Fragment>

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
)(SearchForm);