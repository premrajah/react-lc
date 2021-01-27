    import React, { Component } from 'react';
    import * as actionCreator from "../../store/actions/actions";
    import { connect } from "react-redux";
    import SendIcon from '../../img/send-icon.png';
    import Select from '@material-ui/core/Select';
    import FormControl from '@material-ui/core/FormControl';
    import SearchIcon from '../../img/icons/search-icon.png';
    import { Link } from "react-router-dom";
    import InputLabel from '@material-ui/core/InputLabel';
    import { makeStyles } from '@material-ui/core/styles';
    import CssBaseline from '@material-ui/core/CssBaseline';
    import Toolbar from '@material-ui/core/Toolbar';
    import AppBar from '@material-ui/core/AppBar';
    import { withStyles } from "@material-ui/core/styles/index";
    import MarkerIcon from '../../img/icons/marker.png';
    import CalenderIcon from '../../img/icons/calender.png';
    import ListIcon from '../../img/icons/list.png';
    import AmountIcon from '../../img/icons/amount.png';
    import StateIcon from '../../img/icons/state.png';
    import axios from "axios/index";
    import { baseUrl } from "../../Util/Constants";
    import HeaderDark from '../header/HeaderDark'
    import Sidebar from '../menu/Sidebar'
    import moment from 'moment';
    import NotFound from "../NotFound/index"
    import ProductExpandItem from '../../components/ProductExpandItem'
    import {Edit as EditIcon, Delete as DeleteIcon, FileCopy as FileCopyIcon} from '@material-ui/icons';
    import SearchEditForm from '../../components/SearchEditForm'
    import { Modal, ModalBody, Alert } from 'react-bootstrap';


    import {
        MuiPickersUtilsProvider,
        KeyboardDatePicker,
        DatePicker
    } from '@material-ui/pickers';
    import Org from "../../components/Org/Org";

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


    class ViewSearch extends Component {


        slug
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
                createSearchData: null,
                resourcesMatched: [],
                showCreateSite: false,
                siteSelected: null,
                productSelection: false,
                purpose: ["defined", "prototype", "aggregate"],
                site: {},
                dateRequiredBy: null,
                dateRequiredFrom:null,
                matchesCount:0,
                notFound:false,
                previewImage:null,
                showEdit:false,

            }

            this.getPreviewImage=this.getPreviewImage.bind(this)



            this.slug = props.match.params.slug


            this.nextClick = this.nextClick.bind(this)
            // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)

            this.handleNext = this.handleNext.bind(this)
            this.handleBack = this.handleBack.bind(this)

            // this.handleDateChange = this.handleDateChange.bind(this)
            this.createSearch = this.createSearch.bind(this)
            this.getSearch = this.getSearch.bind(this)
            this.loadMatches = this.loadMatches.bind(this)
            this.getSite = this.getSite.bind(this)
            this.toggleSite = this.toggleSite.bind(this)
            this.showProductSelection = this.showProductSelection.bind(this)
            this.toggleDateOpen = this.toggleDateOpen.bind(this)
            this.makeActive=this.makeActive.bind(this)
            this.selectCreateSearch=this.selectCreateSearch.bind(this)
            this.callBackResult=this.callBackResult.bind(this)
            this.showEdit=this.showEdit.bind(this)



        }



        callBackResult(){

            this.showEdit()
        }

        showEdit(){

            this.setState({

                showEdit:!this.state.showEdit,

            })
        }


        getPreviewImage(productSelectedKey){


            axios.get(baseUrl + "product/"+productSelectedKey.replace("Product/","")+"/artifact",
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




        selectCreateSearch() {

        this.props.history.push("/search-form")
        }

        showProductSelection() {

            this.setState({

                productSelection: !this.state.productSelection
            }
            )
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




        toggleDateOpen(){

            this.setState({

                requiredDateOpen: true
            })
        }



        toggleDateClose(){

            this.setState({

                requiredDateOpen: false
            })
        }


        makeActive(event){

            var active = event.currentTarget.dataset.active

            this.setState({

                active: parseInt(active)

            })


        }





        getSearch() {


            axios.get(baseUrl + "search/" + this.slug+"/expand",
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseData = response.data.data;

                        console.log("detail search response")

                        console.log(response)


                        this.setState({

                            createSearchData: responseData

                        })


                    if (responseData.product) {
                        this.getPreviewImage(responseData.product._id)
                    }



                    },
                    (error) => {
                        console.log("search resource error", error)

                        this.setState({

                            notFound: true
                        })
                    }
                );

        }

        getSite() {

         
         if (this.state.createSearchData)
         
            axios.get(baseUrl + "site/" + this.state.createSearchData.site._key,
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                    var responseAll = response.data.data;
                    console.log("site response")
                    console.log(responseAll)

                    this.setState({

                        site: responseAll

                    })

                },
                    (error) => {

                        var status = error.response.status
                        console.log("resource error")
                        console.log(error)

                    }
                );

        }




        getListingForSearch() {



                axios.get(baseUrl + "search/" + this.slug+"/listing",
                    {
                        headers: {
                            "Authorization": "Bearer " + this.props.userDetail.token
                        }
                    }
                )
                    .then((response) => {

                            var responseAll = response.data.data;
                            console.log("site response")
                            console.log(responseAll)

                            this.setState({

                                matchesCount: responseAll.length

                            })

                        },
                        (error) => {

                            console.log("search error")
                            console.log(error)

                        }
                    );

        }



        toggleSite() {

            this.setState({
                showCreateSite: !this.state.showCreateSite
            })
        }

        createSearch() {



            var data = {

                "name": this.state.title,
                "description": this.state.description,
                "category": this.state.catSelected.name,
                "type": this.state.subCatSelected.name,
                "units": this.state.unitSelected,
                "volume": this.state.volumeSelected,
                "state": this.state.stateSelected,
                "site_id": this.state.siteSelected,
                "require_after": {
                    "unit": "MILLISECOND",
                    "value": new Date(this.state.dateRequiredFrom).getTime()
                },
                "expiry": {
                    "unit": "MILLISECOND",
                    "value": new Date(this.state.dateRequiredBy).getTime()
                }
            }


            axios.post(baseUrl + "search/" + this.state.productSelected.id,
                data, {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then(res => {

                    console.log(res.data.content)

                    this.setState({
                        createSearchData: res.data.content
                    })

                    this.getSite()

                }).catch(error => {

                console.log("login error found ")
                console.log(error.response.data)

            });

        }



        loadMatches() {

            axios.get(baseUrl + "match/search/" + this.slug,
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data.data;
                        console.log("matches response")
                        console.log(responseAll)


                        this.setState({

                            matches: responseAll
                        })




                    },
                    (error) => {

                        console.log("match search error")
                        console.log(error)

                    }
                );


        }


        nextClick() {


            if (this.state.active < 4) {

                this.setState({

                    active: 4
                })

            }

            else if (this.state.active === 4) {


                this.setState({

                    active: 7
                })

            }

            else if (this.state.active === 7) {


                this.setState({

                    active: 8
                })

            }

        }



        handleBack() {

            if (this.state.page === 2) {

                if (this.handleValidation()) {

                    this.setState({

                        page: 1,
                        active: 0,
                        progressBar: 33
                    })

                }

            }

        }


        handleNext() {
            this.getSites()
            if (this.state.page === 1) {


                if (this.handleValidation()) {

                    this.setState({

                        active: 4,
                        page: 2,
                        progressBar: 66
                    })

                }

            }

            else if (this.state.page === 2) {


                if (this.handleValidationAddDetail()) {

                    this.setState({

                        active: 6,
                        page: 3,
                        progressBar: 100
                    })

                    this.createSearch()
                }

            }


            else if (this.state.page === 3) {




                this.setState({

                    active: 7,
                    page: 4,
                    progressBar: 100
                })

            }


            else if (this.state.active === 7) {




                this.setState({

                    active: 8,

                })

            }



        }



         isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }



        componentWillMount() {
            window.scrollTo(0, 0)


        }

        componentDidMount() {

            this.getSearch()
            this.getListingForSearch()
            this.loadMatches()

        }





        classes = useStylesSelect;





        render() {

            const classes = withStyles();
            const classesBottom = withStyles();


            return (

                <>


                    {/*<div className="container  p-2">*/}
                    {/*</div>*/}
                    <Sidebar />
                    <HeaderDark />


                    {this.state.notFound?<NotFound/>:

                        <>


                        {this.state.createSearchData &&
                            <>


                                <div className="container ">


                                    <div className="row  justify-content-center pb-5 ">

                                        <div className="col-md-4 col-sm-12 col-xs-12 pb-5 pt-5 ">

                                            <div className="row stick-left-box container-gray justify-content-center pb-5 pt-5">

                                                {this.state.previewImage?
                                                    <img className={"img-fluid"} src={this.state.previewImage} alt="" />:

                                                <div className="col-12 text-center m-5">
                                                    <img className={"my-search-icon-middle"} src={SearchIcon} alt="" />
                                                </div>}

                                            </div>

                                        </div>

                                        <div className="col-md-8 col-sm-12 col-xs-12 pb-5 pt-5 pl-4 mt-4">

                                            <div className="row ">
                                                <div className="col-12 ">


                                            <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                                                <div className="col-12 ">
                                                    <div className="row">
                                                    <div className="col-8 text-left">

                                                    <h5 className={"blue-text text-heading"}>{this.state.createSearchData.search.name}
                                                    </h5>
                                                    </div>
                                                        <div className="col-4 text-right">
                                                            {/*<EditItem item={this.props.item} history={this.props.history}  />*/}


                                                            <EditIcon className={"mr-2"} onClick={this.showEdit}  />

                                                            {/*<FileCopyIcon  className={"mr-2"} onClick={this.showProductDuplicate}  />*/}

                                                            <DeleteIcon className={""} onClick={this.showProductEdit}  />
                                                        </div>

                                                    </div>


                                                </div>

                                                <div className="col-12">
                                                    <Org orgId={this.state.createSearchData.org._id} orgDescription={this.state.createSearchData.org.description} />
                                                </div>

                                            </div>


                                            <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                                                <div className="col-auto">
                                                    <p style={{ fontSize: "16px" }} className={"text-gray-light "}>{this.state.createSearchData.search.description}
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="row justify-content-start pb-4 pt-3 ">
                                                <div className="col-auto">
                                                    <h6 className={""}>Item Details
                                                    </h6>

                                                </div>
                                            </div>

                                            <div className={"container pb-5"}>

                                                <div className="row  justify-content-start search-container  pb-3 ">
                                                    <div className={"col-1"}>
                                                        <img className={"icon-about"} src={ListIcon} alt="" />
                                                    </div>
                                                    <div className={"col-auto"}>

                                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Category</p>
                                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.createSearchData.search.category}, {this.state.createSearchData.search.type} </p>
                                                        {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.state.createSearchData.search.type}</p>*/}

                                                    </div>
                                                </div>
                                                <div className="row  justify-content-start search-container  pb-4">
                                                    <div className={"col-1"}>
                                                        <img className={"icon-about"} src={AmountIcon} alt="" />
                                                    </div>
                                                    <div className={"col-auto"}>

                                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Amount</p>
                                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.createSearchData.search.volume} {this.state.createSearchData.search.units}</p>
                                                    </div>
                                                </div>


                                                <div className="row  justify-content-start search-container  pb-4">
                                                    <div className={"col-1"}>
                                                        <img className={"icon-about"} src={StateIcon} alt="" />
                                                    </div>
                                                    <div className={"col-auto"}>

                                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">State</p>
                                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.createSearchData.search.state}</p>
                                                    </div>
                                                </div>


                                                <div className="row  justify-content-start search-container  pb-4">
                                                    <div className={"col-1"}>
                                                        <img className={"icon-about"} src={CalenderIcon} alt="" />
                                                    </div>
                                                    <div className={"col-auto"}>

                                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Required From </p>
                                                        <p style={{ fontSize: "18px" }} className="  mb-1">{moment(this.state.createSearchData.search.require_after_epoch_ms).format("DD MMM YYYY")}</p>



                                                    </div>
                                                </div>

                                                <div className="row  justify-content-start search-container  pb-4">
                                                    <div className={"col-1"}>
                                                        <img className={"icon-about"} src={CalenderIcon} alt="" />
                                                    </div>
                                                    <div className={"col-auto"}>

                                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Required by </p>
                                                        <p style={{ fontSize: "18px" }} className="  mb-1">{moment(this.state.createSearchData.search.expire_after_epoch_ms).format("DD MMM YYYY")}</p>



                                                    </div>
                                                </div>
                                                <div className="row  justify-content-start search-container  pb-4">
                                                    <div className={"col-1"}>
                                                        <img className={"icon-about"} src={MarkerIcon} alt="" />
                                                    </div>
                                                    <div className={"col-auto"}>

                                                        <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Location  </p>
                                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.createSearchData.site.name},{this.state.createSearchData.site.contact}</p>
                                                        <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.createSearchData.site.address}</p>
                                                    </div>
                                                </div>




                                                {this.state.createSearchData.product &&
                                                <>
                                                <div className="row  justify-content-start search-container pt-2  pb-2">

                                                    <div className={"col-auto"}>

                                                        <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Product Linked</p>

                                                    </div>
                                                </div>

                                                {this.state.createSearchData && <ProductExpandItem hideAddAll={true} productId={this.state.createSearchData.product._id.replace("Product/","")}/>}

                                                </>}



                                            </div>

                                            </div>
                                            </div>


                                        </div>
                                    </div>

                                </div>





                                <Modal
                                    size="lg"
                                    show={this.state.showEdit}
                                    onHide={this.showEdit}
                                    className={"custom-modal-popup popup-form"}
                                >

                                    <div className="">
                                        <button onClick={this.showEdit} className="btn-close close" data-dismiss="modal" aria-label="Close"><i className="fas fa-times"></i></button>
                                    </div>


                                    <SearchEditForm  triggerCallback={this.callBackResult} searchId={this.state.createSearchData.search._key}/>


                                </Modal>


                            </>






                        }


                    {this.state.createSearchData && <React.Fragment>

                            <CssBaseline />

                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                <Toolbar>




                                        <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                            <div className="col-auto">
                                                <button type="button" onClick={this.selectCreateSearch}
                                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                    Create New

                                        </button>
                                            </div>
                                            <div className="col-auto">
                                                <Link to={"/matches/" + this.slug} type="button"
                                                    // onClick={this.handleNext}
                                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                    View ({this.state.matchesCount+this.state.matches.length}) Matches

                                            </Link>
                                            </div>
                                        </div>


                                </Toolbar>
                            </AppBar>

                        </React.Fragment>}


                        </>}

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
                        inputVariant="outlined"
                        variant={"outlined"}
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
    )(ViewSearch);