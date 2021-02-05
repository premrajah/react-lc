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
import PlaceholderImg from '../../img/place-holder-lc.png';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from "@material-ui/core/styles/index";
import moment from "moment/moment";
import ProductItem from '../../components/ProductItemNew'
import PageHeader from "../../components/PageHeader";


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

        this.showProductSelection=this.showProductSelection.bind(this)

    }


    showProductSelection() {

        this.props.showProductPopUp({type:"create_product",show:true})

    }
    getProducts() {



        this.props.showLoading(true)
        axios.get(baseUrl + "product",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {


                    this.props.showLoading(false)

                var responseAll = response.data.data;
                console.log("resource response")
                console.log(responseAll)

                this.setState({

                    products: responseAll

                })

            },
                (error) => {

                    // var status = error.response.status
                    console.log("prouduct  error")
                    console.log(error)

                    this.props.showLoading(false)

                }
            );

    }










    interval


    componentWillMount() {

    }

    componentDidMount() {

        // this.getProducts()


        this.props.loadProductsWithoutParent(this.props.userDetail.token)

    }






    render() {


        const classes = withStyles();
        const classesBottom = withStyles();



        return (
            <div>

                <Sidebar />
                <div className="wrapper">

                    <HeaderDark />

                    <div className="container  pb-4 pt-4">

                        <PageHeader pageIcon={CubeBlue} pageTitle="My Products" subTitle="Products created can be assigned to resource searches" />

                        <div className="row  justify-content-center search-container listing-row-border pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchField />


                            </div>
                        </div>


                        <div className="row  justify-content-center filter-row listing-row-border   pt-3 pb-3">

                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">{this.props.productWithoutParentList.length} Products </p>

                            </div>
                            <div className="text-mute col-auto pl-0">

                                <span style={{ fontSize: "18px" }}>Created</span>

                            </div>

                        </div>


                        {this.props.productWithoutParentList.map((item) =>

                            <>


                            {/*<Link to={"/product/" + item.product._key}>*/}

                               <ProductItem delete={false} edit={true} remove={false} duplicate={true}   item={item} />


                            </>

                            // </Link>

                        )}


                    </div>




                    <React.Fragment>

                        <CssBaseline />

                        <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                            <Toolbar>


                                <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                    <div className="col-auto">

                                        <a onClick={this.showProductSelection}>
                                            <p className={"green-text bottom-bar-text"}> Create New Product </p>
                                        </a>


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
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,

        productWithoutParentList: state.productWithoutParentList,
        


    };
};

const mapDispachToProps = dispatch => {
    return {

        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        showLoading: (data) => dispatch(actionCreator.showLoading(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadProductsWithoutParent: (data) => dispatch(actionCreator.loadProductsWithoutParent(data)),



    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Products);
