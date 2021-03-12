import React, {Component} from 'react';

import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import clsx from 'clsx';
import FilterImg from '../../img/icons/filter-icon.png';
import HeaderDark from '../header/HeaderDark'
import Footer from '../Footer/Footer'
import Sidebar from '../menu/Sidebar'
import AppBar from '@material-ui/core/AppBar';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchGray from '@material-ui/icons/Search';
import {baseUrl} from '../../Util/Constants'
import ResourceItem from '../item/ResourceItem'
import axios from "axios/index";
import Slider from "@material-ui/core/Slider/index";
import Checkbox from '@material-ui/core/Checkbox';
import Close from '@material-ui/icons/Close';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import CalGrey from '../../img/icons/calender-dgray.png';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Message extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            items: [],
            categories: [],
            showFilter: false,
            activeFilters: {},
            states: ["Bailed", "Loose", "Chips"]

        }


        this.getResources = this.getResources.bind(this)
        this.toggleFilter = this.toggleFilter.bind(this)
        this.getFiltersCategories = this.getFiltersCategories.bind(this)
    }


    getResources() {

        axios.get(baseUrl + "resource",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                var response = response.data.content;



                this.setState({

                    items: response
                })

            },
                (error) => {

                    var status = error.response.status



                }
            );

    }
    getFiltersCategories() {

        axios.get(baseUrl + "category",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                var response = response.data.content;



                this.setState({

                    categories: response
                })

            },
                (error) => {

                    var status = error.response.status



                }
            );

    }



    toggleFilter() {

        this.setState({
            showFilter: !this.state.showFilter

        })
    }



    setFilters(filter) {


        var filtersObj = this.state.activeFilters
        filtersObj[filter.name] = filter.value

        this.setState({

            activeFilters: filtersObj

        })






    }



    resetFilters() {

        this.setState({

            activeFilters: []

        })


        this.toggleFilter()




    }



    componentWillMount() {

    }

    componentDidMount() {

        this.getResources()
        this.getFiltersCategories()

    }



    render() {

        const classes = withStyles();
        return (
            <div>

                <Sidebar />
                <div className="wrapper accountpage">

                    <HeaderDark />


                    <div className={"container"}>

                        <div className="row  justify-content-center search-container listing-row-border pt-4 pb-4">
                            <div className={"col-12"}>

                                <TextField
                                    label={"Search this seller’s listings"}
                                    variant="outlined"
                                    className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                    id="input-with-icon-textfield"

                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchGray style={{ fontSize: 24, color: "#B2B2B2" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>

                        <div className="row  justify-content-center filter-row listing-row-border  mb-4 pt-4 pb-4">

                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">5 out of 76 Listings</p>

                            </div>
                            <div className="text-mute col-auto pl-0">

                                <span style={{ fontSize: "18px" }}>Filter</span>   <img onClick={this.toggleFilter} src={FilterImg} className={"filter-icon"} alt="" />

                            </div>

                        </div>

                        {
                            this.state.items && this.state.items.map((item, index) =>

                                <ResourceItem item={item} />

                            )
                        }



                    </div>




                    <Footer />



                </div>


                <>

                    <div className={this.state.showFilter ? "wrapper  filter-page" : "d-none"} >

                        <div className="container    pt-3 " >

                            <div className="row no-gutters  pb-4">
                                <div className="col text-left blue-text" style={{ margin: "auto" }}>
                                    <h6 className={" text-heading"}>Filters</h6>
                                </div>

                                <div className="col-auto">

                                    <button className="btn   btn-link text-dark menu-btn">
                                        <Close onClick={this.toggleFilter} className="" style={{ fontSize: 32 }} />

                                    </button>
                                </div>


                            </div>


                            <FiltersCat type={"category"} setFilters={(filter) => this.setFilters(filter)} items={this.state.categories} />
                            <FiltersState type={"state"} setFilters={(filter) => this.setFilters(filter)} items={this.state.states} />

                            <div className="container   search-container pt-3" >

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
                                            className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                            id="input-with-icon-textfield"

                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <img className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                    </div>
                                    <div className="col-12 mb-3">

                                        <TextField
                                            type={"date"}
                                            variant="outlined"
                                            className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                            id="input-with-icon-textfield"

                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <img className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                    </div>


                                </div>

                            </div>

                            <div className="container   search-container pt-3" >

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
                        <BottomAppBar resetFilters={() => this.resetFilters()} hideFilters={() => this.toggleFilter()} />

                    </div>

                </>




            </div>
        );
    }
}




function FiltersCat(props) {

    const classes = withStyles();


    const [catVisible, setCatVisible] = React.useState(null);

    const [items, setItems] = React.useState([]);




    var subCats = []

    for (var i = 0; i < props.items.length; i++) {

        for (var k = 0; k < props.items[i].types.length; k++) {


            subCats.push(props.items[i].types[k])

        }


    }


    const handleChange = event => {





        var values = items

        var checkExists = false

        for (var i = 0; i < items.length; i++) {

            if (items.indexOf(event.target.value) > -1) {

                checkExists = true

            }

        }

        if (!checkExists) {



            values.push(event.target.value)

        } else {

            // values.pop(event.revmoe.value)

            values = values.filter((item) => item != event.target.value)


        }



        setItems(values)


        // for(var i=0; i<props.items.length;i++){
        //
        //     if (event.target.value.indexOf(props.items[i].name)>-1){
        //
        //         values.push(props.items[i].id)
        //     }
        //
        // }

        // if (props.type==="category") {

        props.setFilters({ "name": props.type, "value": values })


        // }




    }


    return (
        <>

            <div className="row no-gutters   pb-4 pt-3  listing-row-border-top mb-3">

                <div className="col text-left blue-text" style={{ margin: "auto" }}>
                    <h6 className={" text-heading"}>Resource Category </h6>
                </div>


            </div>
            <div className="row no-gutters  pb-2">

                {
                    props.items && props.items.map((item, index) =>


                        <div className="col-6">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={item.name}
                                        value={item.name}
                                        checked={items.indexOf(item.name) > -1}
                                        onChange={handleChange}
                                        style={{ color: "#07AD88" }}
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                }
                                label={item.name}
                            />
                        </div>

                    )
                }



            </div>



            <div className="row no-gutters   pb-4 pt-3  listing-row-border-top mb-3">

                <div className="col text-left blue-text" style={{ margin: "auto" }}>
                    <h6 className={" text-heading"}>Subcategory</h6>
                </div>


            </div>
            <div className="row no-gutters  pb-2">


                {subCats && subCats.map((item, index) =>

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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            }
                            label={item.name}
                        />
                    </div>


                )}


            </div>




        </>

    );

}

function FiltersState(props) {

    const classes = withStyles();


    const [catVisible, setCatVisible] = React.useState(null);

    const [items, setItems] = React.useState([]);




    const handleChange = event => {





        var values = items

        var checkExists = false

        for (var i = 0; i < items.length; i++) {

            if (items.indexOf(event.target.value) > -1) {

                checkExists = true

            }

        }

        if (!checkExists) {



            values.push(event.target.value)

        } else {

            // values.pop(event.revmoe.value)

            values = values.filter((item) => item != event.target.value)


        }


        setItems(values)

        props.setFilters({ "name": props.type, "value": values })


        // }




    }


    return (
        <>

            <div className="row no-gutters   pb-4 pt-3  listing-row-border-top mb-3">

                <div className="col text-left blue-text" style={{ margin: "auto" }}>
                    <h6 className={" text-heading"}>State </h6>
                </div>

            </div>
            <div className="row no-gutters  pb-2">

                {
                    props.items && props.items.map((item, index) =>


                        <div className="col-6">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={item}
                                        value={item}
                                        checked={items.indexOf(item) > -1}
                                        onChange={handleChange}
                                        style={{ color: "#07AD88" }}
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                }
                                label={item}
                            />
                        </div>

                    )
                }



            </div>


        </>

    );

}



function Filters(props) {

    const classes = withStyles();


    return (
        <div>





            <div className="container listing-row-border   pt-3" >

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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>


                </div>
            </div>


            <div className="container   listing-row-border pt-3" >

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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            }
                            label="Plastics"
                        />
                    </div>


                </div>
            </div>


            <div className="container   search-container pt-3" >

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
                            className={clsx(classes.margin, classes.textField) + " full-width-field"}
                            id="input-with-icon-textfield"

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <img className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </div>
                    <div className="col-12 mb-3">

                        <TextField
                            type={"date"}
                            variant="outlined"
                            className={clsx(classes.margin, classes.textField) + " full-width-field"}
                            id="input-with-icon-textfield"

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <img className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </div>


                </div>

            </div>

            <div className="container   search-container pt-3" >

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
        color: '#07AD88',
        height: 3,
        padding: '13px 0',
        width: 220 + 5 * 2,

    },
    thumb: {
        height: 27,
        width: 27,
        backgroundColor: '#fff',
        border: '1px solid #eeeeee',
        marginTop: -12,
        marginLeft: -13,
        boxShadow: '#ebebeb 0px 2px 2px',
        '&:focus,&:hover,&$active': {
            boxShadow: '#ccc 0px 2px 3px 1px',
        },
        '& .bar': {
            // display: inline-block !important;
            height: 9,
            width: 1,
            backgroundColor: '#07AD88',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 3,
    },
    rail: {
        color: '#d8d8d8',
        opacity: 1,
        height: 3,
    },

})(Slider);
function PriceRange(props) {

    const [show, setShow] = React.useState(false);

    const [value, setValue] = React.useState([0, 1000]);
    const [active, setActive] = React.useState(false);


    const useMyStyles = makeStyles(theme => ({
        typography: {
            padding: theme.spacing(2),
        },
    }));
    const classes = useMyStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);

    };

    const handleChange = (event, newValue) => {

        setShow(true)
        setValue(newValue)

        setActive(true);

        props.setFilters({ "name": props.type, "value": newValue })



    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (

        <AirbnbSlider
            onChange={handleChange}
            ThumbComponent={AirbnbThumbComponent}
            getAriaLabel={index => (index === 0 ? 'Minimum price' : 'Maximum price')}
            defaultValue={

                [value[0], value[1]]
            }
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

function BottomAppBar(props) {
    const classes = useStyles();


    const resetClick = event => {


        props.resetFilters()
    }


    const hideClick = event => {


        props.hideFilters()
    }

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>
                        <div className="col-auto">

                            <button onClick={hideClick} type="button" className=" mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                Apply Filter
                            </button>

                        </div>
                        <div className="col-auto">

                            <button onClick={resetClick} type="button"
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
)(Message);