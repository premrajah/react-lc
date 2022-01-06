import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import clsx from "clsx";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {makeStyles} from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchGray from "@mui/icons-material/Search";
import {baseUrl, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
import axios from "axios/index";
import {withStyles} from "@mui/styles/index";
// import ProductItem from "../../components/ProductItemNew";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import ProductItem from "../../components/Products/Item/ProductItem";
import Layout from "../../components/Layout/Layout";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";

class ProductsService extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timerEnd: false,
            nextIntervalFlag: false,
            products: [],
            searchValue: '',
            filterValue: '',
            items:[],
            lastPageReached:false,
            currentOffset:0,
            productPageSize:50,
            loadingResults:false,
            count:0
        };

        this.getProducts = this.getProducts.bind(this);

        this.showProductSelection = this.showProductSelection.bind(this);
    }

    showProductSelection() {
        this.props.showProductPopUp({ type: "create_product", show: true });
    }

    getProducts() {
        this.props.showLoading(true);
        axios
            .get(baseUrl + "product/service-agent/no-links", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    this.props.showLoading(false);

                    var responseAll = response.data.data;

                    this.setState({
                        products: responseAll,
                    });
                },
                (error) => {
                    // var status = error.response.status

                    this.props.showLoading(false);
                }
            );
    }



    componentDidMount() {


        // this.props.loadParentSites();
        this.setState({
            items:[]
        })

        this.getTotalCount()


    }



    getTotalCount=()=>{

        axios
            .get(`${baseUrl}product/service-agent/count`)
            .then(
                (response) => {
                    if(response.status === 200) {

                        this.setState({
                            count:(response.data.data),

                        })
                    }

                },
                (error) => {
                }
            )
            .catch(error => {}).finally(()=>{

        });



    }


    loadProductsWithoutParentPageWise=()=>{


        let newOffset=this.state.currentOffset


        axios
            // .get(`${baseUrl}product/no-parent/no-links`)
                .get(`${baseUrl}product/service-agent/no-links?offset=${this.state.currentOffset}&size=${this.state.productPageSize}`)
            .then(
                (response) => {
                    if(response.status === 200) {

                        this.setState({
                            items:this.state.items.concat(response.data.data),
                            loadingResults:false,
                            lastPageReached:(response.data.data.length===0?true:false),
                            currentOffset:newOffset+this.state.productPageSize
                        })
                    }

                },
                (error) => {
                }
            )
            .catch(error => {}).finally(()=>{

        });



    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }


    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }




    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>


                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="Product Service"
                            subTitle="Products created can be assigned to resource searches"
                        />

                        <div className="row">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/my-products" className="btn btn-sm btn-gray-border mr-2">
                                    Products
                                </Link>

                                <Link to="/product-archive" className="btn btn-sm btn-gray-border mr-2">
                                    Records
                                </Link>

                                <Link to="/product-tracked" className="btn btn-sm btn-gray-border">
                                    Tracked
                                </Link>
                            </div>
                        </div>

                        <div className="row  justify-content-center search-container  pt-3 pb-3">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={PRODUCTS_FILTER_VALUES} />

                            </div>
                        </div>

                        <div className="row  justify-content-center filter-row  pb-3">
                            <div className="col">
                                <p  className="text-gray-light ml-2">
                                    {this.state.items.filter((item)=> {

                                        let site = item

                                        return this.state.filterValue ? (this.state.filterValue === "name" ?
                                            site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue === "condition" ? site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue === "brand" ? site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue === "category" ? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue === "type" ? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue === "state" ? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                this.state.filterValue === "year of manufacture" ? site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                                    this.state.filterValue === "model" ? site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                        this.state.filterValue === "serial no." ? site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                            null) :
                                            (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                                    }).length} of {this.state.count} Products
                                </p>
                            </div>

                        </div>
                        <PaginationLayout loadingResults={this.state.loadingResults} lastPageReached={this.state.lastPageReached} loadMore={this.loadProductsWithoutParentPageWise} >

                        {this.state.items.filter((item)=> {

                            let site=item


                        return    this.state.filterValue ? (this.state.filterValue === "name" ?
                                site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                this.state.filterValue === "condition" ? site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                    this.state.filterValue === "brand" ? site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                        this.state.filterValue === "category" ? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue === "type" ? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue === "state" ? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue === "year of manufacture" ? site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue === "model" ? site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue === "serial no." ? site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                null) :
                                (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                        } ).map((item) => (
                            <>
                                {/*<Link to={"/product/" + item.product._key}>*/}

                                <ProductItem
                                    goToLink={true}
                                    delete={false}
                                    edit={true}
                                    remove={false}
                                    duplicate={true}
                                    item={item}
                                    hideMore={true}
                                />

                                {/*</Link>*/}
                            </>
                        ))}
                        </PaginationLayout>



                    </div>

            </Layout>
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

const mapStateToProps = (state) => {
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

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        showLoading: (data) => dispatch(actionCreator.showLoading(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductsService);
