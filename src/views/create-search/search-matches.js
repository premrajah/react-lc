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


                    // var matches = this.state.matches
                    //
                    //
                    // for (var i =0 ; i<responseAll.length;i++ ){
                    //
                    //
                    //     matches.push({listing:responseAll[i]})
                    // }


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
                </div>

                <HeaderWhiteBack history={this.props.history} heading={"View Matches"} />


                {this.state.matches && <>

                        <div className="container   pb-4 ">


                        {this.state.matches.map((item) =>


                            <MatchItem item={item}  />



                        )}


                    </div>

                </>
                }


                {this.state.listingsForSearch && <>

                        <div className="container   pb-4 ">


                            {this.state.listingsForSearch.map((item) =>


                                <Link to={"/"+ item.listing._key+"/"+this.slug }>

                                <ResourceItem  searchId={this.slug} item={item}  />

                                </Link>


                            )}


                        </div>


                </>
                }



                { this.state.matches.length === 0 && this.state.listingsForSearch.length === 0 &&
                <div className={" column-empty-message"}>
                    <p>This search currently has no matches</p>
                </div>}



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
)(SearchMatches);