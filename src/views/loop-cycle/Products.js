import React, { Component } from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Paper from '../../img/paper.png';
import clsx from 'clsx';
import CubeBlue from '../../img/icons/product-icon-big.png';
import { Link } from "react-router-dom";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchGray from '@material-ui/icons/Search';
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import CssBaseline from '@material-ui/core/CssBaseline';

import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from "@material-ui/core/styles/index";


class Products extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            products: []
        }


        this.getProducts = this.getProducts.bind(this)

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

                var response = response.data.content;
                console.log("resource response")
                console.log(response)

                this.setState({

                    products: response

                })

            },
                (error) => {

                    var status = error.response.status
                    console.log("resource error")
                    console.log(error)

                }
            );

    }










    interval


    componentWillMount() {

    }

    componentDidMount() {

        this.getProducts()


    }






    render() {


        const classes = withStyles();
        const classesBottom = withStyles();



        return (
            <div>

                <Sidebar />
                <div className="wrapper accountpage">

                    <HeaderDark />


                    <div className="container   pb-4 pt-4">


                        <div className="row ">

                            <div className="col-auto pb-4 pt-4">
                                <img className={"search-icon-middle"} src={CubeBlue} alt="" />

                            </div>
                        </div>
                        <div className="row  pb-2 pt-2 ">

                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Products
                                </h3>

                            </div>
                        </div>


                        <div className="row  pb-4 pt-2 ">

                            <div className="col-auto">
                                <p className={"text-gray-light "}>Products created can be assigned to resource searches</p>

                            </div>
                        </div>

                        <div className="row  justify-content-center search-container listing-row-border pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchField />


                            </div>
                        </div>


                        <div className="row  justify-content-center filter-row listing-row-border   pt-3 pb-3">

                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">{this.state.products.length} Products </p>

                            </div>
                            <div className="text-mute col-auto pl-0">

                                <span style={{ fontSize: "18px" }}>Created</span>

                            </div>

                        </div>


                        {this.state.products.map((item) =>

                            <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">
                                <div className={"col-10  content-box-listing"}>

                                    <Link to={"/product/" + item.id}>
                                        <p style={{ fontSize: "18px" }} className=" mb-1">{item.title}</p>
                                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">{item.purpose}</p>
                                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">{item.searches.length} Searches</p>
                                    </Link>
                                </div>
                                <div style={{ textAlign: "right" }} className={"col-2"}>
                                    <p className={"text-gray-light small"}>9/5/2020</p>

                                </div>
                            </div>

                        )}





                    </div>




                    <React.Fragment>

                        <CssBaseline />

                        <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                            <Toolbar>


                                <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                    <div className="col-auto">

                                        <Link to={"/create-product"}><p className={"green-text bottom-bar-text"}> Create New Product </p></Link>


                                    </div>

                                </div>


                            </Toolbar>
                        </AppBar>

                    </React.Fragment>


                </div>



            </div>
        );
    }
}

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,

    },
}));

function SearchField() {

    const classes = useStylesTabs();

    return (
        <TextField
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
)(Products);
