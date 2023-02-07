import React, {useEffect, useState,Component} from 'react'
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import {Link} from "react-router-dom";
import axios from "axios/index";
import TrackedProductItem from "../../components/Products/TrackedProductItem";

import ArchiveIcon from "../../img/icons/archive-128px.svg";
import {baseUrl, PRODUCTS_FILTER_VALUES, PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import { connect } from "react-redux";
// import ProductRecordItem from "../../components/ProductRecordItem";
import ErrorBoundary from "../../components/ErrorBoundary";
import ProductItem from "../../components/Products/Item/ProductItem";
import SearchBar from "../../components/SearchBar";
import Layout from "../../components/Layout/Layout";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {createSeekURL, seekAxiosGet} from "../../Util/GlobalFunctions";
import * as actionCreator from "../../store/actions/actions";




class TrackedProducts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            nextIntervalFlag: false,

            searchValue: '',
            filterValue: '',
            products: [],
            items:[],
            lastPageReached:false,
            offset:0,
            pageSize:50,
            loadingResults:false,
            count:0
        };


    }

    getTrackedProducts = () => {

        axios.get(`${baseUrl}product/track/no-links`)

            .then((response) => {
                this.setState({ products: response.data.data });
            })
            .catch((error) => {});
    };



    componentDidMount() {


        // this.props.loadParentSites();
        this.setState({
            items:[]
        })


    }



    clearList=()=>{
        setTimeout(() => {
        this.setState({
            offset:0,
            items:[],
            lastPageReached:false,
            loadingResults: false,
        })
    },250)
    }

    setFilters = (data) => {
        let subFilter = [];

        let searchValue = data.searchValue;
        let activeFilter = data.searchFilter;

        if (searchValue) {
            if (activeFilter) {
                subFilter.push({ key: activeFilter, value: searchValue });
            } else {
                PRODUCTS_FILTER_VALUES_KEY.forEach((item) =>
                    subFilter.push({ key: item.key, value: searchValue })
                );
            }
        }

        this.filters = subFilter;
    };


    // seekCount=async () => {
    //
    //     let url = createSeekURL("product&relation=tracked_by", true, true, null, null,
    //         this.filters, "AND")
    //
    //
    //     let result = await seekAxiosGet(url)
    //
    //
    //
    //     this.setState({
    //         count: result.data.data,
    //
    //     })
    //
    //
    //
    // }
    //
    //
    // loadProductsWithoutParentPageWise= async (data) => {
    //
    //
    //     if (data.reset){
    //
    //         this.clearList()
    //     }
    //     this.setFilters(data)
    //
    //     this.seekCount()
    //
    //     this.setState({
    //
    //         loadingResults: true
    //     })
    //
    //     let newOffset = this.state.offset
    //
    //
    //     let url = createSeekURL("product&relation=tracked_by", true, false, data.reset?0:this.state.offset, this.state.pageSize, this.filters, "AND","")
    //
    //     let result = await seekAxiosGet(url)
    //
    //
    //     if (result && result.data && result.data.data) {
    //
    //         this.state.offset= newOffset + this.state.pageSize
    //
    //         this.setState({
    //             items: this.state.items.concat(result.data.data),
    //             loadingResults: false,
    //             lastPageReached: (result.data.data.length === 0 ? true : false),
    //             offset: newOffset + this.state.pageSize
    //
    //         })
    //     }else{
    //
    //         if (result) {
    //             this.props.showSnackbar({show: true, severity: "warning", message: "Error: " + result})
    //
    //             this.setState({
    //
    //                 loadingResults: false,
    //
    //             })
    //
    //         }
    //     }
    //
    //
    //
    // }


    seekCount = async () => {
        // this.controllerSeek.abort()
        let url = `${baseUrl}seek?name=Product&relation=tracked_by&no_parent=true&relation=belongs_to&count=true&include-to=Site:located_at`;

        this.filters.forEach((item) => {
            url = url + `&or=${item.key}~%${item.value}%`;
        });

        let result = await seekAxiosGet(url);

        this.setState({
            count: result.data ? result.data.data : 0,
        });
    };
    loadProductsWithoutParentPageWise = async (data) => {
        if (data && data.reset) {

            this.clearList();
        }



        // this.controller.abort()

        if (data) this.setFilters(data);

        this.seekCount();

        this.setState({
            loadingResults: true,
        });

        let newOffset = this.state.offset;

        // let url = `${baseUrl}seek?name=Product&relation=belongs_to&no_parent=true&count=false&offset=${this.state.offset}&size=${this.state.pageSize}`;

        let url = `${baseUrl}seek?name=Product&relation=tracked_by&no_parent=true&count=false&include-to=Site:located_at`;

        this.filters.forEach((item) => {
            url = url + `&or=${item.key}~%${item.value}%`;
        });

        this.setState({
            activeQueryUrl:url
        })

        url = `${url}&offset=${this.state.offset}&size=${this.state.pageSize}`;


        let result = await seekAxiosGet(url);

        if (result && result.data && result.data.data) {
            this.state.offset = newOffset + this.state.pageSize;

            this.setState({
                items: this.state.items.concat(result.data ? result.data.data : []),
                loadingResults: false,
                lastPageReached: result.data
                    ? result.data.data.length === 0
                        ? true
                        : false
                    : true,
                offset: newOffset + this.state.pageSize,
            });
        } else {
            if (result) {
                this.props.showSnackbar({
                    show: true,
                    severity: "warning",
                    message: "Error: " + result,
                });

                this.setState({
                    loadingResults: false,
                    lastPageReached: true,
                });
            }
        }
    };


    render() {
        return (
            <Layout>
                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={ArchiveIcon}
                            pageTitle="Tracked Products"
                            subTitle="Your Tracked Products"
                            // bottomLine={<hr />}
                        />

                        <div className="row ">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/products-service" className="btn btn-sm btn-gray-border me-2">
                                    Service
                                </Link>

                                <Link to="/my-products" className="btn btn-sm btn-gray-border me-2">
                                    Products
                                </Link>

                                <Link to="/product-archive" className="btn btn-sm btn-gray-border me-2">
                                    Records
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
                            // onSearch={(sv) => this.handleSearch(sv)}
                            // onSearchFilter={(fv) => this.handleSearchFilter(fv)}
                            // dropDownValues={PRODUCTS_FILTER_VALUES_KEY}
                            // count={this.state.count}
                            // visibleCount={this.state.items.length}
                            // loadingResults={this.state.loadingResults}
                            // lastPageReached={this.state.lastPageReached}
                            // loadMore={this.loadProductsWithoutParentPageWise}

                            dropDownValues={PRODUCTS_FILTER_VALUES_KEY}
                            count={this.state.count}
                            visibleCount={this.state.items.length}
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={(data) => this.loadProductsWithoutParentPageWise(data)}
                        >

                        {this.state.items.map((item) => (
                            <>
                                <ErrorBoundary>
                                    <ProductItem
                                        toProvenance={true}
                                        goToLink={true}
                                        delete={false}
                                        edit={false}
                                        remove={false}
                                        duplicate={false}
                                        item={item.Product}
                                        untrack={true}
                                        reload={()=>{this.getTrackedProducts()}}
                                    />
                                </ErrorBoundary>

                            </>
                        ))}

                        </PaginationLayout>


                    </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        test: null,
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackedProducts);

// export default TrackedProducts;
