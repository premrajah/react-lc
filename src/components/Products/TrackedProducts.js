import React, {useEffect, useState,Component} from 'react'
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import {Link} from "react-router-dom";
import axios from "axios/index";
import TrackedProductItem from "./TrackedProductItem";

import ArchiveIcon from "../../img/icons/archive-128px.svg";
import {baseUrl, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
import { connect } from "react-redux";
// import ProductRecordItem from "../../components/ProductRecordItem";
import ErrorBoundary from "../../components/ErrorBoundary";
import ProductItem from "../../components/Products/Item/ProductItem";
import SearchBar from "../../components/SearchBar";

const TrackedProductsOld = () => {

    const [tracked, setTracked] = useState(null);
    const [trackStatus, setTrackStatus] = useState('');

    useEffect(() => {
        setTrackStatus('');
        getTrackedProducts();
    }, [])

    const getTrackedProducts = () => {
        axios.get(`${baseUrl}product/track`)
            .then(res => {
                const data = res.data.data;
                setTracked(data);
            })
            .catch(error => {
                console.log('track error ', error)
            })
    }

    const handleSubmitStatus = (status) => {
        setTrackStatus(status);
        getTrackedProducts();
    }


    return (
        <div>
            <Sidebar />
            <div className="wrapper">
                <HeaderDark />

                <div className="container  pb-4 pt-4">
                    <PageHeader
                        pageIcon={ArchiveIcon}
                        pageTitle="Tracked Products"
                        subTitle="Your tracked products"
                        bottomLine={<hr />}
                    />

                    <div className="row mt-3 mb-5">
                        <div className="col-12 d-flex justify-content-start">
                            <Link to="/products-service" className="btn btn-sm blue-btn mr-2">
                                Product Service
                            </Link>

                            <Link to="/my-products" className="btn btn-sm blue-btn mr-2">
                                My Products
                            </Link>

                            <Link to="/product-archive" className="btn btn-sm blue-btn mr-2">
                                Records
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            {trackStatus}
                            {(tracked !== null && tracked.length === 0) && <div>No products yet.</div>}
                            {tracked ? tracked.map((item, index) => {
                                return <TrackedProductItem key={index} item={item}  handleStatus={(status) => handleSubmitStatus(status) } />
                            }) : <div>loading...</div>}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}




class TrackedProducts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,

            searchValue: '',
            filterValue: '',
            products: [],
        };


    }

    getTrackedProducts = () => {

        axios.get(`${baseUrl}product/track`)

            .then((response) => {
                this.setState({ products: response.data.data });
            })
            .catch((error) => {});
    };


    componentDidMount() {
        this.getTrackedProducts();
    }


    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }


    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={ArchiveIcon}
                            pageTitle="Tracked Products"
                            subTitle="Your Tracked Products"
                            bottomLine={<hr />}
                        />

                        <div className="row mt-3 mb-5">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/products-service" className="btn btn-sm blue-btn mr-2">
                                    Product Service
                                </Link>

                                <Link to="/my-products" className="btn btn-sm blue-btn mr-2">
                                    My Products
                                </Link>

                                <Link to="/product-archive" className="btn btn-sm blue-btn mr-2">
                                    Records
                                </Link>
                            </div>
                        </div>
                        <div className="row  justify-content-center search-container  pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={PRODUCTS_FILTER_VALUES} />

                            </div>
                        </div>

                        <div className={"listing-row-border "}></div>

                        <div className="row  justify-content-center filter-row    pt-3 pb-3">
                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    {this.state.products.filter((item)=> {

                                        let site = item.product

                                        return this.state.filterValue ? (this.state.filterValue === "name" ?
                                            site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue === "condition" ? site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue === "brand" ? site.sku.brand&&site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue === "category" ? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue === "type" ? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue === "state" ? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                this.state.filterValue === "year of manufacture" ? site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                                    this.state.filterValue === "model" ? site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                        this.state.filterValue === "serial no." ? site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                            null) :
                                            (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.brand&&  site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                                    }).length} Products
                                </p>
                            </div>
                            <div className="text-mute col-auto pl-0">
                                <span style={{ fontSize: "18px" }}>Created</span>
                            </div>
                        </div>
                        <div className={"listing-row-border mb-3"}></div>

                        {this.state.products.filter((item)=> {

                            let site=item.product


                            return    this.state.filterValue ? (this.state.filterValue === "name" ?
                                site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                this.state.filterValue === "condition" ? site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                    this.state.filterValue === "brand" ? site.sku.brand&&site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                        this.state.filterValue === "category" ? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue === "type" ? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue === "state" ? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue === "year of manufacture" ? site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue === "model" ? site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue === "serial no." ? site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                null) :
                                (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.brand&&site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                        } ).map((item) => (
                            <>
                                <ErrorBoundary>
                                    <ProductItem
                                        toProvenance={true}
                                        goToLink={true}
                                        delete={false}
                                        edit={false}
                                        remove={false}
                                        duplicate={false}
                                        item={item.product}
                                        untrack={true}
                                        reload={()=>{this.getTrackedProducts()}}
                                    />
                                </ErrorBoundary>

                            </>
                        ))}


                    </div>
                </div>
            </div>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackedProducts);

// export default TrackedProducts;
