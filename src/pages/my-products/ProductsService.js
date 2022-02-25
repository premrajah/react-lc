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
import {baseUrl, PRODUCTS_FILTER_VALUES, PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import axios from "axios/index";
import {withStyles} from "@mui/styles/index";
// import ProductItem from "../../components/ProductItemNew";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import ProductItem from "../../components/Products/Item/ProductItem";
import Layout from "../../components/Layout/Layout";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {createSeekURL, seekAxiosGet} from "../../Util/GlobalFunctions";

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
            offset:0,
            pageSize:50,
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
    }

    clearList=()=>{

        this.setState({
            offset:0,
            items:[],
            lastPageReached:false,
            loadingResults: false,
        })
    }

    setFilters=(data)=>{

        let filters= []
        let subFilter=[]

        let searchValue= data.searchValue
        let activeFilter= data.filterValue

        if (searchValue){

            if (activeFilter){

                subFilter.push({key:activeFilter, value:"%" + searchValue + "%", operator:"~"})

            }else{

                PRODUCTS_FILTER_VALUES_KEY.forEach((item)=>
                    subFilter.push({key:item.key, value:"%" + searchValue + "%", operator:"~"})
                )


            }
        }


        filters.push({filters:subFilter,operator:"||"})


        this.filters= filters

    }



    seekCount=async () => {

        let url = createSeekURL("product&relation=service_agent_for", true, true, null, null,
            this.filters, "AND")


        let result = await seekAxiosGet(url)



        this.setState({
            count: result.data.data,

        })



    }

    loadProductsWithoutParentPageWise= async (data) => {


        if (data.reset){

            this.clearList()
        }
        this.setFilters(data)

        this.seekCount()

        this.setState({

            loadingResults: true
        })

        let newOffset = this.state.offset


        let url = createSeekURL("product&relation=service_agent_for", true, false, data.reset?0:this.state.offset, this.state.pageSize, this.filters, "AND","")

        let result = await seekAxiosGet(url)


        if (result && result.data && result.data.data) {

            this.state.offset= newOffset + this.state.pageSize

            this.setState({
                items: this.state.items.concat(result.data.data),
                loadingResults: false,
                lastPageReached: (result.data.data.length === 0 ? true : false),
                offset: newOffset + this.state.pageSize

            })
        }else{

            if (result) {
                this.props.showSnackbar({show: true, severity: "warning", message: "Error: " + result})

                this.setState({

                    loadingResults: false,

                })

            }
        }



    }

    handleChange(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }



    componentWillUnmount() {

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

                                <Link to="/product-tracked" className="btn btn-sm btn-gray-border mr-2">
                                    Tracked
                                </Link>
                                <Link to="/issues" className=" btn-sm btn-gray-border ml-2-desktop ">
                                    {/*<CustomPopover*/}
                                    {/*    // text={"Products that have entered the platform from another user that have your Brand attached to them. You have therefore wanted to know the provenance of these products and have now tracked these"}*/}
                                    {/*>*/}
                                    Issues
                                    {/*</CustomPopover>*/}
                                </Link>
                            </div>
                        </div>


                        <PaginationLayout
                            onSearch={(sv) => this.handleSearch(sv)}
                            onSearchFilter={(fv) => this.handleSearchFilter(fv)}
                            dropDownValues={PRODUCTS_FILTER_VALUES_KEY}
                            count={this.state.count}
                            visibleCount={this.state.items.length}
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={this.loadProductsWithoutParentPageWise} >

                        {this.state.items.map((item) => (
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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductsService);
