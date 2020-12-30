import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from "@material-ui/core/styles/index";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import HeaderWhiteBack from '../header/HeaderWhiteBack'
import ResourceItem from './ResourceItem'
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import { Link } from "react-router-dom";
import MatchItem from '../../components/MatchItem'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import LangIcon from '../../img/icons/lang.png';
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import HandGreyIcon from '../../img/icons/hand-gray.png';
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';
import SearchGray from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '../../img/paper.png';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import FilterImg from '../../img/icons/filter-icon.png';



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


class SearchMatches extends Component {



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
            page: 1,
            fields: {},
            errors: {},
            units: [],
            progressBar: 33,
            products: [],
            productSelected: null,
            nextBlue: false,
            nextBlueAddDetail: false,
            nextBlueViewSearch: false,
            unitSelected: null,
            volumeSelected: null,
            title: null,
            description: null,
            volume: null,
            createSearchData: null,
            matches: [],
            listingsForSearch: [],

        }

        this.slug = props.match.params.slug

        this.loadMatches = this.loadMatches.bind(this)

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
                    console.log("listings for search response")
                    console.log(responseAll)


                    var matches = this.state.listingsForSearch


                    for (var i =0 ; i<responseAll.length;i++ ){


                        matches.push({listing:responseAll[i]})
                    }

                    this.setState({

                        listingsForSearch: matches

                    })

                },
                (error) => {

                    console.log("listings for search error")
                    console.log(error)

                }
            );

    }

    interval

    componentWillMount() {

    }

    componentDidMount() {

        this.loadMatches()
        this.getListingForSearch()
    }






    goToSignIn() {


        this.setState({

            active: 0
        })
    }

    goToSignUp() {


        this.setState({

            active: 1
        })
    }

    classes = useStylesSelect;



    render() {

        const classes = withStyles();
        const classesBottom = withStyles();


        return (

            <>


                <Sidebar />

                <HeaderDark />



                <div className="container  p-2">

                    <div className="row  pb-2 pt-5 ">

                        {/*<div className="col-auto">*/}
                            {/*<h3 className={"blue-text text-heading"}>Matches*/}
                            {/*</h3>*/}

                        {/*</div>*/}
                    </div>

                </div>
                <div className="container  p-2">

                    <div className="row  pb-2 pt-2 ">

                        <div className="col-12 text-center">
                            <h3  className={"blue-text text-heading text-center"}>Matches
                            </h3>

                        </div>
                    </div>

                </div>
                <div className="container  p-2">

                    <div className="row  pb-2 pt-2 ">


                <div className={"tab-content-listing col-12"}>

                    <NavTabs matches={this.state.matches} slug={this.slug}  suggesstions={this.state.listingsForSearch} />
                </div>
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




function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    };
}

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}



function NavTabs(props) {
    const classes = useStylesTabs();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{boxShadhow:"none"}} elevation={0}>
                <Tabs
                    style={{ backgroundColor: "#ffffff", color: "#07AD88!important" ,boxShadhow:"none"}}
                    indicatorColor="secondary"
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    e
                >

                    <LinkTab label={"Suggested("+props.suggesstions.length+")"} href="/drafts" {...a11yProps(0)} />

                    <LinkTab label={"Confirmed("+props.matches.length+")"} href="/drafts" {...a11yProps(1)} />

                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
                <div className={"container"}>

                    {props.suggesstions.map((item) =>

                        <Link to={"/"+ item.listing._key+"/"+props.slug }>

                            <ResourceItem  searchId={props.slug} item={item}  />

                        </Link>


                    )}


                    { props.suggesstions.length === 0 &&
                    <div className={" column-empty-message"}>
                        <p>This search currently has no suggesstions</p>
                    </div>}


                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>

                <div className={"container"}>

                    {props.matches.map((item) =>

                        <>
                        {/*<Link to={"/"+ item.listing.listing._key }>*/}

                            <MatchItem item={item}  />

                        {/*// </Link>*/}

                        </>

                    )}



                    { props.matches.length === 0 &&
                    <div className={" column-empty-message"}>
                        <p>This search currently has no matches</p>
                    </div>}



                </div>




            </TabPanel>


        </div>
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
)(SearchMatches);