import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "../../img/icons/search-icon.png";
import {Link} from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import {makeStyles} from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import moment from "moment";
import NotFound from "../../views/NotFound";
import ProductExpandItem from "../../components/Products/ProductExpandItem";
import SearchEditForm from "../../components/Searches/SearchEditForm";
import {Modal} from "react-bootstrap";
import MoreMenu from "../../components/MoreMenu";
import Layout from "../../components/Layout/Layout";
import OrgComponent from "../../components/Org/OrgComponent";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AggregatesTab from "../../components/Products/AggregatesTab";
import SubProductsTab from "../../components/Products/SubProductsTab";
import {GoogleMap} from "../../components/Map/MapsContainer";
import SearchItem from "../../components/Searches/search-item";
import ResourceItem from "./ResourceItem";
import ArtifactProductsTab from "../../components/Products/ArtifactProductsTab";
import InfoTabContent from "../../components/Searches/InfoTabContent";

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

class ViewSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
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
            dateRequiredFrom: null,
            matchesCount: 0,
            notFound: false,
            previewImage: null,
            showEdit: false,
        };

        this.getPreviewImage = this.getPreviewImage.bind(this);

        this.slug = props.match.params.slug;

        this.nextClick = this.nextClick.bind(this);
        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);

        // this.handleDateChange = this.handleDateChange.bind(this)
        this.createSearch = this.createSearch.bind(this);
        this.getSearch = this.getSearch.bind(this);
        this.loadMatches = this.loadMatches.bind(this);
        this.getSite = this.getSite.bind(this);
        this.toggleSite = this.toggleSite.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
        this.toggleDateOpen = this.toggleDateOpen.bind(this);
        this.makeActive = this.makeActive.bind(this);
        this.selectCreateSearch = this.selectCreateSearch.bind(this);
        this.callBackResult = this.callBackResult.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }
    callBackResult(action) {
        if (action === "edit") {
            this.showEdit();
        } else if (action === "delete") {
            this.deleteItem();
        }
    }

    deleteItem() {
        axios
            .delete(baseUrl + "search/" + this.state.createSearchData.search._key, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    // var responseAll = response.data.data;

                    this.props.history.push("/my-search");
                    // this.props.loadProducts()
                },
                (error) => {}
            );
    }

    showEdit() {
        this.setState({
            showEdit: !this.state.showEdit,
        });
        this.getSearch();

    }

    getPreviewImage(productSelectedKey) {
        axios
            .get(baseUrl + "product/" + productSelectedKey.replace("Product/", "") + "/artifact", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    if (responseAll.length > 0) {
                        this.setState({
                            previewImage: responseAll[0].blob_url,
                        });
                    }
                },
                (error) => {}
            );
    }

    selectCreateSearch() {
        this.props.history.push("/search-form");
    }

    showProductSelection() {
        this.setState({
            productSelection: !this.state.productSelection,
        });
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

    getSearch() {
        axios
            .get(baseUrl + "search/" + this.slug + "/expand", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data.data;

                    this.setState({
                        createSearchData: responseData,
                    });

                    if (responseData.product) {
                        this.getPreviewImage(responseData.product._id);
                    }
                },
                (error) => {
                    this.setState({
                        notFound: true,
                    });
                }
            );
    }

    getSite() {
        if (this.state.createSearchData)
            axios
                .get(baseUrl + "site/" + this.state.createSearchData.site._key, {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                })
                .then(
                    (response) => {
                        var responseAll = response.data.data;

                        this.setState({
                            site: responseAll,
                        });
                    },
                    (error) => {
                        var status = error.response.status;
                    }
                );
    }

    getListingForSearch() {
        axios
            .get(baseUrl + "search/" + this.slug + "/listing", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        matchesCount: responseAll.length,
                    });
                },
                (error) => {}
            );
    }

    toggleSite() {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
    }

    createSearch() {
        var data = {
            name: this.state.title,
            description: this.state.description,
            category: this.state.catSelected.name,
            type: this.state.subCatSelected.name,
            units: this.state.unitSelected,
            volume: this.state.volumeSelected,
            state: this.state.stateSelected,
            site_id: this.state.siteSelected,
            require_after: {
                unit: "MILLISECOND",
                value: new Date(this.state.dateRequiredFrom).getTime(),
            },
            expiry: {
                unit: "MILLISECOND",
                value: new Date(this.state.dateRequiredBy).getTime(),
            },
        };

        axios
            .post(baseUrl + "search/" + this.state.productSelected.id, data, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {
                this.setState({
                    createSearchData: res.data.content,
                });

                this.getSite();
            })
            .catch((error) => {});
    }

    loadMatches() {
        axios
            .get(baseUrl + "match/search/" + this.slug, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        matches: responseAll,
                    });
                },
                (error) => {}
            );
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

                this.createSearch();
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

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        this.getSearch();
        this.getListingForSearch();
        this.loadMatches();
        this.setState({
            activeKey:"0"
        })
    }

    classes = useStylesSelect;

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>

                {this.state.notFound ? (
                    <NotFound />
                ) : (
                    <>
                        {this.state.createSearchData && (
                            <>
                                <div className="container ">
                                    <div className="row  pt-4 pb-4  justify-content-start">
                                        <div className="text-left    col-sm-12 col-xs-12 breadcrumb-row">
                                            <Link to={"/my-search"}>My Searches</Link><span className={"divider-breadcrumb pl-2 pr-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.state
                                            .createSearchData
                                            .search.name}</span>

                                        </div>
                                    </div>
                                    <div className="row  justify-content-center  ">
                                        <div className="col-md-4 col-sm-12 col-xs-12 ">
                                            <div className="row stick-left-box  justify-content-center p-2 gray-border rad-8 bg-white ">
                                                {this.state.previewImage ? (
                                                    <img
                                                        className={"img-fluid"}
                                                        src={this.state.previewImage}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div style={{background:"#eeeeee"}} className="col-12 text-center p-5  rad-8 ">
                                                        <img

                                                            className={"my-search-icon-middle "}
                                                            src={SearchIcon}
                                                            alt=""
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-8 col-sm-12 col-xs-12 ">
                                            <div className="row ">
                                                <div className="col-12 ">
                                                    <div className="row justify-content-start ">
                                                        <div className="col-12 ">
                                                            <div className="row">
                                                                <div className="col-8 text-left">
                                                                    <h4
                                                                        className={
                                                                            "text-capitalize product-title"
                                                                        }>
                                                                        {
                                                                            this.state
                                                                                .createSearchData
                                                                                .search.name
                                                                        }
                                                                    </h4>
                                                                </div>
                                                                <div className="col-4 text-right">
                                                                    <MoreMenu
                                                                        triggerCallback={(action) =>
                                                                            this.callBackResult(
                                                                                action
                                                                            )
                                                                        }
                                                                        delete={true}
                                                                        duplicate={false}
                                                                        edit={true}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12">
                                                            <OrgComponent
                                                                org={
                                                                    this.state.createSearchData.org

                                                                }

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row justify-content-start pb-3 pt-3 ">
                                                        <div className="col-auto">
                                                            <p

                                                                className={"text-gray-light "}>
                                                                {
                                                                    this.state.createSearchData
                                                                        .search.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className={"listing-row-border "}></div>
                                                    {this.state.createSearchData &&
                                                    <div className="row justify-content-start pb-3  tabs-detail">
                                                        <div className="col-12 ">

                                                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                                                <TabContext value={this.state.activeKey}>
                                                                    <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                                                        <TabList
                                                                            variant="scrollable"
                                                                            scrollButtons="auto"
                                                                            textColor={"#27245C"}
                                                                            TabIndicatorProps={{
                                                                                style: {
                                                                                    backgroundColor: "#27245C",
                                                                                    padding: '2px',
                                                                                }
                                                                            }}
                                                                            onChange={this.setActiveKey}

                                                                            aria-label="lab API tabs example">


                                                                            <Tab label="Info" value="0"/>

                                                                            <Tab label="Linked Product" value="1" />

                                                                            <Tab label="Site" value="2" />
                                                                        </TabList>
                                                                    </Box>

                                                                    <TabPanel value="0">

                                                                        <InfoTabContent item={this.state.createSearchData.search}/>
                                                                    </TabPanel>

                                                                    {this.state.createSearchData.product &&  <TabPanel value="1">

                                                                        <>

                                                                            <div className={"mt-4"}></div>


                                                                                {this.state.createSearchData && (
                                                                                    <ProductExpandItem
                                                                                        hideMoreMenu={true}
                                                                                        hideAddAll={true}
                                                                                        productId={this.state.createSearchData.product._id.replace(
                                                                                            "Product/",
                                                                                            ""
                                                                                        )}
                                                                                    />
                                                                                )}
                                                                            </>

                                                                    </TabPanel>}


                                                                    {this.state.createSearchData.site &&
                                                                    <TabPanel value="2">
                                                                        <>

                                                                            <p className={"mt-4 mb-4"}>Linked Site:<span className={"text-bold"}> <Link to={"/ps/"+this.state.createSearchData.site._key}>{this.state.createSearchData.site.name}</Link></span></p>
                                                                            {this.state.createSearchData.site.geo_codes && this.state.createSearchData.site.geo_codes[0] &&

                                                                            <div className={"bg-white rad-8 p-2"}>
                                                                                <GoogleMap siteId={this.state.createSearchData.site._key} width={"100%"}
                                                                                           height={"300px"} locations={[{
                                                                                    name: this.state.createSearchData.site.name,
                                                                                    location: this.state.createSearchData.site.geo_codes[0].address_info.geometry.location,
                                                                                    isCenter: true
                                                                                }]}/>
                                                                            </div>

                                                                            }

                                                                        </>

                                                                    </TabPanel>}


                                                                </TabContext>
                                                            </Box>

                                                        </div>
                                                    </div>}



                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Modal
                                    size="lg"
                                    show={this.state.showEdit}
                                    onHide={this.showEdit}
                                    className={"custom-modal-popup popup-form mb-5"}>
                                    <div className="">
                                        <button
                                            onClick={this.showEdit}
                                            className="btn-close close"
                                            data-dismiss="modal"
                                            aria-label="Close">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>

                                    <SearchEditForm
                                        triggerCallback={this.showEdit}
                                        searchId={this.state.createSearchData.search._key}
                                        item={this.state.createSearchData}
                                    />
                                </Modal>
                            </>
                        )}

                        {this.state.createSearchData && (
                            <React.Fragment>
                                <CssBaseline />

                                <div
                                    position="fixed"
                                    color="#ffffff"
                                    className={ "custom-bottom-fixed-appbar  custom-bottom-appbar"}>
                                    <Toolbar>
                                        <div
                                            className="row  justify-content-center search-container "
                                            style={{ margin: "auto" }}>
                                            <div className="col-auto">
                                                <button
                                                    type="button"
                                                    onClick={this.selectCreateSearch}
                                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                    Create New
                                                </button>
                                            </div>
                                            <div className="col-auto">
                                                <Link
                                                    to={"/matches/" + this.slug}
                                                    type="button"
                                                    // onClick={this.handleNext}
                                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                    View (
                                                    {this.state.matchesCount +
                                                        this.state.matches.length}
                                                    ) Matches
                                                </Link>
                                            </div>
                                        </div>
                                    </Toolbar>
                                </div>
                            </React.Fragment>
                        )}
                    </>
                )}
            </Layout>
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


function UnitSelect(props) {
    const classes = useStylesSelect();
    const [state, setState] = React.useState({
        unit: "",
        name: "hai",
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
                        name: "unit",
                        id: "outlined-age-native-simple",
                    }}>
                    {props.units.map((item) => (
                        <option value={"Kg"}>{item}</option>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

function SiteSelect(props) {
    const classes = useStylesSelect();
    const [state, setState] = React.useState({
        unit: "",
        name: "hai",
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
                        name: "unit",
                        id: "outlined-age-native-simple",
                    }}>
                    <option value={null}>Select</option>

                    {props.sites.map((item) => (
                        <option value={item.id}>{item.name + "(" + item.address + ")"}</option>
                    ))}
                </Select>
            </FormControl>
        </div>
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
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ViewSearch);
