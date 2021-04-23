import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import clsx from "clsx";
import SearchHeaderImg from "../../img/search-header.png";
import SearchBottleImg from "../../img/search-bottle.png";
import HeaderDark from "../header/HeaderDark";
import Footer from "../Footer/Footer";
import Sidebar from "../menu/Sidebar";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import { baseUrl } from "../../Util/Constants";
import DummyItem from "../item/DummyListItem";
import axios from "axios/index";
import Slider from "@material-ui/core/Slider/index";
import Checkbox from "@material-ui/core/Checkbox";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import CalGrey from "../../img/icons/calender-dgray.png";
import DummyIcon from "../../img/icons/product-blue.png";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link } from "react-router-dom";

class FindResources extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            items: [],
            categories: [],
            showFilter: false,
            activeFilters: {},
            states: ["Bailed", "Loose", "Chips"],
            page: 1,
            pageSize: 2,
            pages: [1, 2, 3, 4, 5],
        };

        this.getResources = this.getResources.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.getFiltersCategories = this.getFiltersCategories.bind(this);
    }

    changePage(e) {
        this.setState({
            page: e.currentTarget.dataset.page,
        });

        this.getResources();
    }

    getResources() {
        const filters = this.state.activeFilters;

        var url = baseUrl + "resource?m=a&f=" + this.state.page + "&s=" + this.state.pageSize;

        if (filters.category) {
            url = url + "&t=category.keyword:" + filters.category[0];
        }

        // if (filters.category>0&&filters.category.length>0){
        //
        //
        //     url =url +"category.keyword:"+filters.category[0]
        // }

        axios
            .get(url, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data.content;

                    this.setState({
                        items: response,
                    });
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    getFiltersCategories() {
        axios
            .get(baseUrl + "category", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data.content;

                    this.setState({
                        categories: response,
                    });
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    toggleFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        });
    }

    setFilters(filter) {
        var filtersObj = this.state.activeFilters;
        filtersObj[filter.name] = filter.value;

        this.setState({
            activeFilters: filtersObj,
        });

        this.getResources();
    }

    resetFilters() {
        this.setState({
            activeFilters: [],
        });

        this.toggleFilter();
    }


    componentDidMount() {
        this.getResources();
        this.getFiltersCategories();
    }

    render() {
        const classes = withStyles();
        return (
            <div>
                <Sidebar />
                <div className="container-main">
                    <HeaderDark />

                    <div className={"container-fluid "}>
                        <div className="row  justify-content-center search-container     pt-4 pb-4">
                            <div className={"col-12"} style={{ textAlign: "center" }}>
                                <img
                                    src={SearchHeaderImg}
                                    className={"search-header-img img-fluid"}
                                    alt=""
                                />
                            </div>
                        </div>

                        <div className="row justify-content-center pb-2 pt-4 ">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Find Products</h3>
                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">
                            <div className="col-12">
                                <p className={"text-gray-light  text-center"}>
                                    Have specific requirements? Create a search. We’ll notify you
                                    when you receive a match.
                                </p>
                            </div>
                            <div className="col-auto mt-4">
                                <Link
                                    to={"/search-form"}
                                    className="nav-link  d-lg-block green-link "
                                    color="default">
                                    Create a search
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div id="container-fluid wave-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path
                                fill="#fafafa"
                                fill-opacity="1"
                                d="M0,224L80,208C160,192,320,160,480,165.3C640,171,800,213,960,234.7C1120,256,1280,256,1360,256L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                        </svg>
                    </div>

                    <div className={"container bg-grey  "}>
                        <div className="row  justify-content-center search-container      pt-4 pb-4">
                            <div className={"col-12"} style={{ textAlign: "center" }}>
                                <img
                                    src={SearchBottleImg}
                                    className={"search-header-img img-fluid"}
                                    alt=""
                                />
                            </div>
                        </div>

                        <div className="row justify-content-center pb-2 pt-4 ">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Sell Products</h3>
                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">
                            <div className="col-12">
                                <p className={"text-gray-light  text-center"}>
                                    Have a resource to sell? Create a new listing and we’ll notify
                                    you when you receive a match.
                                </p>
                            </div>
                            <div className="col-auto mt-4">
                                <Link
                                    to={"/list-form"}
                                    className="nav-link  d-lg-block green-link "
                                    color="default">
                                    New Listing
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className={"container-fluid "}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path
                                fill="#fafafa"
                                fill-opacity="1"
                                d="M0,224L80,208C160,192,320,160,480,165.3C640,171,800,213,960,234.7C1120,256,1280,256,1360,256L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
                        </svg>
                    </div>

                    <div className={"container "}>
                        <div className="row  pb-2 pt-4 ">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Explore by category</h3>
                            </div>
                        </div>

                        <div className="row justify-content-center pb-2 pt-4 cat-box-container ">
                            {this.state.categories.map((item) => (
                                <div className="col-md-2 col-sm-3 col-xs-4">
                                    <div className={"cat-box"}>
                                        <img src={DummyIcon} />

                                        <p className={"blue-text"}>{item.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={"container "}>
                        <div className="row justify-content-center pb-2 pt-4 ">
                            <div className="col-12">
                                <h3 className={"blue-text text-heading"}>All Products</h3>
                            </div>

                            <div className="col-12">
                                <p className={""}>
                                    Simply want to browse products?
                                    <span className={"forgot-password-link"}>Browse All</span>
                                </p>
                            </div>
                        </div>

                        <div className="row justify-content-center pb-2 pt-4 cat-box-container ">
                            <DummyItem />
                        </div>

                        <div className="row  justify-content-center filter-row listing-row-border  mb-4 pt-4 pb-4">
                            <div className={"col-auto"}>
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {this.state.page > 1 && (
                                            <li className="page-item page-next">
                                                <a
                                                    data-page={this.state.page - 1}
                                                    className="page-link"
                                                    onClick={this.changePage.bind(this)}>
                                                    <NavigateBeforeIcon
                                                        style={{ color: "white" }}
                                                    />
                                                </a>
                                            </li>
                                        )}

                                        {this.state.pages.map((item) => (
                                            <li
                                                className={
                                                    this.state.page === item
                                                        ? "page-item active-page"
                                                        : "page-item "
                                                }>
                                                <a
                                                    data-page={item}
                                                    className="page-link"
                                                    onClick={this.changePage.bind(this)}>
                                                    {item}
                                                </a>
                                            </li>
                                        ))}

                                        {this.state.pages.length > this.state.page && (
                                            <li className="page-item page-next">
                                                <a
                                                    data-page={this.state.page + 1}
                                                    className="page-link "
                                                    onClick={this.changePage.bind(this)}>
                                                    <NavigateNextIcon style={{ color: "white" }} />
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        );
    }
}

function FiltersCat(props) {
    const classes = withStyles();

    const [catVisible, setCatVisible] = React.useState(null);

    const [items, setItems] = React.useState([]);

    var subCats = [];

    for (var i = 0; i < props.items.length; i++) {
        for (var k = 0; k < props.items[i].types.length; k++) {
            subCats.push(props.items[i].types[k]);
        }
    }

    const handleChange = (event) => {
        var values = items;

        var checkExists = false;

        for (var i = 0; i < items.length; i++) {
            if (items.indexOf(event.target.value) > -1) {
                checkExists = true;
            }
        }

        if (!checkExists) {
            values.push(event.target.value);
        } else {
            // values.pop(event.revmoe.value)

            values = values.filter((item) => item !== event.target.value);
        }

        setItems(values);

        // for(var i=0; i<props.items.length;i++){
        //
        //     if (event.target.value.indexOf(props.items[i].name)>-1){
        //
        //         values.push(props.items[i].id)
        //     }
        //
        // }

        // if (props.type==="category") {

        props.setFilters({ name: props.type, value: values });

        // }
        //
        //
    };

    return (
        <>
            <div className="row no-gutters   pb-4 pt-3  listing-row-border-top mb-3">
                <div className="col text-left blue-text" style={{ margin: "auto" }}>
                    <h6 className={" text-heading"}>Resource Category </h6>
                </div>
            </div>
            <div className="row no-gutters  pb-2">
                {props.items &&
                    props.items.map((item, index) => (
                        <div className="col-6">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={item.name}
                                        value={item.name}
                                        checked={items.indexOf(item.name) > -1}
                                        onChange={handleChange}
                                        style={{ color: "#07AD88" }}
                                        inputProps={{ "aria-label": "secondary checkbox" }}
                                    />
                                }
                                label={item.name}
                            />
                        </div>
                    ))}
            </div>

            <div className="row no-gutters   pb-4 pt-3  listing-row-border-top mb-3">
                <div className="col text-left blue-text" style={{ margin: "auto" }}>
                    <h6 className={" text-heading"}>Subcategory</h6>
                </div>
            </div>
            <div className="row no-gutters  pb-2">
                {subCats &&
                    subCats.map((item, index) => (
                        <div className="col-6">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={item.name}
                                        value={item.name}
                                        checked={items.indexOf(item.name) > -1}
                                        onChange={handleChange}
                                        defaultChecked
                                        // color="#07AD88"
                                        style={{ color: "#07AD88" }}
                                        inputProps={{ "aria-label": "secondary checkbox" }}
                                    />
                                }
                                label={item.name}
                            />
                        </div>
                    ))}
            </div>
        </>
    );
}

function FiltersState(props) {
    const classes = withStyles();

    const [catVisible, setCatVisible] = React.useState(null);

    const [items, setItems] = React.useState([]);

    const handleChange = (event) => {
        var values = items;

        var checkExists = false;

        for (var i = 0; i < items.length; i++) {
            if (items.indexOf(event.target.value) > -1) {
                checkExists = true;
            }
        }

        if (!checkExists) {
            values.push(event.target.value);
        } else {
            // values.pop(event.revmoe.value)

            values = values.filter((item) => item !== event.target.value);
        }

        setItems(values);

        props.setFilters({ name: props.type, value: values });

        // }
    };

    return (
        <>
            <div className="row no-gutters   pb-4 pt-3  listing-row-border-top mb-3">
                <div className="col text-left blue-text" style={{ margin: "auto" }}>
                    <h6 className={" text-heading"}>State </h6>
                </div>
            </div>
            <div className="row no-gutters  pb-2">
                {props.items &&
                    props.items.map((item, index) => (
                        <div className="col-6">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={item}
                                        value={item}
                                        checked={items.indexOf(item) > -1}
                                        onChange={handleChange}
                                        style={{ color: "#07AD88" }}
                                        inputProps={{ "aria-label": "secondary checkbox" }}
                                    />
                                }
                                label={item}
                            />
                        </div>
                    ))}
            </div>
        </>
    );
}

function Filters(props) {
    const classes = withStyles();

    return (
        <div>
            <div className="container listing-row-border   pt-3">
                <div className="row no-gutters   pb-4">
                    <div className="col text-left blue-text" style={{ margin: "auto" }}>
                        <h6 className={" text-heading"}>Resource Category </h6>
                    </div>
                </div>
                <div className="row no-gutters  pb-2">
                    <div className="col-6">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked
                                    // color="#07AD88"
                                    style={{ color: "#07AD88" }}
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>

                    <div className="col-6">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    // color="#07AD88"
                                    style={{ color: "#cccccc" }}
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>
                </div>
                <div className="row no-gutters  pb-2">
                    <div className="col-6">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked
                                    // color="#07AD88"
                                    style={{ color: "#07AD88" }}
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>

                    <div className="col-6">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    // color="#07AD88"
                                    style={{ color: "#cccccc" }}
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>
                </div>
            </div>

            <div className="container   listing-row-border pt-3">
                <div className="row no-gutters  pb-4">
                    <div className="col text-left blue-text" style={{ margin: "auto" }}>
                        <h6 className={" text-heading"}>Subcategory</h6>
                    </div>
                </div>
                <div className="row no-gutters  pb-2">
                    <div className="col-12">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked
                                    // color="#07AD88"
                                    style={{ color: "#07AD88" }}
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>

                    <div className="col-12">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    // color="#07AD88"
                                    style={{ color: "#cccccc" }}
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>
                </div>
                <div className="row no-gutters  pb-2">
                    <div className="col-12">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked
                                    // color="#07AD88"
                                    style={{ color: "#07AD88" }}
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>

                    <div className="col-6">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    // color="#07AD88"
                                    style={{ color: "#cccccc" }}
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>
                </div>
            </div>

            <div className="container   search-container pt-3">
                <div className="row no-gutters  pb-4">
                    <div className="col text-left blue-text" style={{ margin: "auto" }}>
                        <h6 className={" text-heading"}>Availability</h6>
                    </div>
                </div>
                <div className="row no-gutters  pb-2">
                    <div className="col-12 mb-3">
                        <TextField
                            type="date"
                            variant="outlined"
                            className={
                                clsx(classes.margin, classes.textField) + " full-width-field"
                            }
                            id="input-with-icon-textfield"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <img
                                            className={"input-field-icon"}
                                            src={CalGrey}
                                            style={{ fontSize: 24, color: "#B2B2B2" }}
                                            alt=""
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <TextField
                            type={"date"}
                            variant="outlined"
                            className={
                                clsx(classes.margin, classes.textField) + " full-width-field"
                            }
                            id="input-with-icon-textfield"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <img
                                            className={"input-field-icon"}
                                            src={CalGrey}
                                            style={{ fontSize: 24, color: "#B2B2B2" }}
                                            alt=""
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="container price-container pb-3  search-container pt-3">
                <div className="row no-gutters  pb-4">
                    <div className="col text-left blue-text" style={{ margin: "auto" }}>
                        <h6 className={" text-heading"}>Price Range</h6>
                    </div>
                </div>
                <div className="row  justify-content-center  pb-2">
                    <div className="col-auto" style={{ margin: "auto" }}>
                        <PriceRange />
                    </div>
                </div>
            </div>
        </div>
    );
}

function AirbnbThumbComponent(props) {
    return (
        <span {...props}>
            {/*<span className="bar" />*/}
            {/*<span className="bar" />*/}
            {/*<span className="bar" />*/}
        </span>
    );
}

const AirbnbSlider = withStyles({
    root: {
        color: "#07AD88",
        height: 3,
        padding: "13px 0",
        width: 220 + 5 * 2,
    },
    thumb: {
        height: 27,
        width: 27,
        backgroundColor: "#fff",
        border: "1px solid #eeeeee",
        marginTop: -12,
        marginLeft: -13,
        boxShadow: "#ebebeb 0px 2px 2px",
        "&:focus,&:hover,&$active": {
            boxShadow: "#ccc 0px 2px 3px 1px",
        },
        "& .bar": {
            // display: inline-block !important;
            height: 9,
            width: 1,
            backgroundColor: "#07AD88",
            marginLeft: 1,
            marginRight: 1,
        },
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)",
    },
    track: {
        height: 3,
    },
    rail: {
        color: "#d8d8d8",
        opacity: 1,
        height: 3,
    },
})(Slider);

function PriceRange(props) {
    const [show, setShow] = React.useState(false);

    const [value, setValue] = React.useState([0, 1000]);
    const [active, setActive] = React.useState(false);

    const useMyStyles = makeStyles((theme) => ({
        typography: {
            padding: theme.spacing(2),
        },
    }));
    const classes = useMyStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChange = (event, newValue) => {
        setShow(true);
        setValue(newValue);

        setActive(true);

        props.setFilters({ name: props.type, value: newValue });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <AirbnbSlider
            onChange={handleChange}
            ThumbComponent={AirbnbThumbComponent}
            getAriaLabel={(index) => (index === 0 ? "Minimum price" : "Maximum price")}
            defaultValue={[value[0], value[1]]}
            min={0}
            max={1000}
        />
    );
}

const useStyles = makeStyles((theme) => ({
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

function BottomAppBar(props) {
    const classes = useStyles();

    const resetClick = (event) => {
        props.resetFilters();
    };

    const hideClick = (event) => {
        props.hideFilters();
    };

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div
                        className="row  justify-content-center search-container "
                        style={{ margin: "auto" }}>
                        <div className="col-auto">
                            <button
                                onClick={hideClick}
                                type="button"
                                className=" mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                Apply Filter
                            </button>
                        </div>
                        <div className="col-auto">
                            <button
                                onClick={resetClick}
                                type="button"
                                className="shadow-sm mr-2 btn btn-link green-btn-min mt-2 mb-2 btn-blue">
                                Reset
                            </button>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

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
export default connect(mapStateToProps, mapDispachToProps)(FindResources);
