    import React, { Component } from 'react';
    import * as actionCreator from "../../store/actions/actions";
    import { connect } from "react-redux";
    import SendIcon from '../../img/send-icon.png';
    import Select from '@material-ui/core/Select';
    import FormControl from '@material-ui/core/FormControl';
    import SearchIcon from '../../img/icons/search-icon.png';
    import { Link } from "react-router-dom";
    import { Alert} from 'react-bootstrap';

    import InputLabel from '@material-ui/core/InputLabel';
    import Close from '@material-ui/icons/Close';
    import NavigateBefore from '@material-ui/icons/NavigateBefore';
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
    import LinkGray from '../../img/icons/link-icon.png';
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
    import HeaderDark from '../header/HeaderDark'
    import Sidebar from '../menu/Sidebar'
    import MomentUtils from '@date-io/moment';
    import moment from 'moment';

    import {
        MuiPickersUtilsProvider,
        KeyboardDatePicker,
        DatePicker
    } from '@material-ui/pickers';

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
                matchesCount:0


            }


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





                    },
                    (error) => {
                        console.log("search resource error", error)
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

                            var status = error.response.status
                            console.log("resource error")
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


            // for (var i = 0; i < this.state.createSearchData.search.resources.length; i++) {
            //
            //     axios.get(baseUrl + "resource/" + this.state.createSearchData.search.resources[i],
            //         {
            //             headers: {
            //                 "Authorization": "Bearer " + this.props.userDetail.token
            //             }
            //         }
            //     )
            //         .then((response) => {
            //
            //             var response = response.data.content;
            //             console.log("resource response")
            //             console.log(response)
            //
            //
            //
            //             var resources = this.state.resourcesMatched
            //
            //             resources.push(response)
            //
            //             this.setState({
            //
            //                 resourcesMatched: resources
            //             })
            //
            //         },
            //             (error) => {
            //
            //                 var status = error.response.status
            //                 console.log("resource error")
            //                 console.log(error)
            //
            //             }
            //         );
            //
            //
            // }


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


                // alert("on page 4")

                this.setState({

                    active: 7,
                    page: 4,
                    progressBar: 100
                })

            }


            else if (this.state.active === 7) {


                // alert("here ")

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

                    <div className="container pt-4 p-2 mt-5 ">
                    </div>

                        {this.state.createSearchData &&
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
                                                <Close onClick={this.selectCreateSearch} className="" style={{ fontSize: 32 }} />

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
                                            <p className={"green-text text-heading"}>@{this.state.createSearchData.org.name}
                                        </p>

                                        </div>
                                        <div className="col-12 mt-2">
                                            <h5 className={"blue-text text-heading"}>{this.state.createSearchData.search.name}
                                            </h5>

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

                                </div>

                                <div className={"container pb-5"}>

                                    <div className="row  justify-content-start search-container  pb-3 ">
                                        <div className={"col-1"}>
                                            <img className={"icon-about"} src={ListIcon} alt="" />
                                        </div>
                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Category</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.createSearchData.search.category} ></p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.createSearchData.search.type}</p>

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


                                    {/*<BottomAppBar />*/}


                                </div>



                            </>
                        }


                    {this.state.createSearchData && <React.Fragment>

                            <CssBaseline />

                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                {/*<ProgressBar now={this.state.progressBar}  />*/}
                                {this.state.page < 4 && <LinearProgress variant="determinate" value={this.state.progressBar} />}
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
                                                    View ({this.state.matchesCount}) Matches

                                            </Link>
                                            </div>
                                        </div>


                                </Toolbar>
                            </AppBar>

                        </React.Fragment>}



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