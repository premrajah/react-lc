import React, {Component} from "react";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import axios from "axios/index";
import {baseUrl, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
import {connect} from "react-redux";
// import ProductRecordItem from "../../components/ProductRecordItem";
import {Link} from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundary";
import ProductItem from "../../components/Products/Item/ProductItem";
import SearchBar from "../../components/SearchBar";
import Layout from "../../components/Layout/Layout";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";

class ProductArchive extends Component {

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
            currentOffset:0,
            productPageSize:50,
            loadingResults:false,
            count:0
        };


    }

    getAllPreviouslyOwnedProducts = () => {
        axios
            .get(`${baseUrl}product/past-owner/no-links`, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                this.setState({ products: response.data.data });
            })
            .catch((error) => {});
    };

    displayArchivedProducts = () => {
        if (this.state.items !== null && this.state.items.length > 0) {
            return this.state.items.map((item, index) => {
                return (
                    <Link to={`/p/${item._key}`} key={index}>
                        <ErrorBoundary>
                            {/*<ProductRecordItem item={item.product} />*/}
                            <ProductItem
                                goToLink={true}
                                delete={false}
                                hideMore={true}
                                edit={true}
                                remove={false}
                                duplicate={true}
                                item={item}
                            />
                        </ErrorBoundary>
                    </Link>
                );
            });
        } else {
            return <div>No previously owned products...</div>;
        }
    };


    componentDidMount() {


        this.setState({
            items:[]
        })

        this.getTotalCount()



    }



    getTotalCount=()=>{



        axios
            // .get(`${baseUrl}product/no-parent/no-links`)
            .get(`${baseUrl}past-owner/count`)
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
            .get(`${baseUrl}product/past-owner/no-links?offset=${this.state.currentOffset}&size=${this.state.productPageSize}`)
            .then(
                (response) => {
                    if(response.status === 200) {

                        this.setState({
                            items:this.state.items.concat(response.data.data),
                            loadingResults:false,
                            lastPageReached:(response.data.data.length===0?true:false)
                        })
                    }

                },
                (error) => {
                }
            )
            .catch(error => {}).finally(()=>{

        });

        this.setState({

            currentOffset:newOffset+this.state.productPageSize
        })

    }


    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }


    render() {
        return (
            <Layout>

                <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={ArchiveIcon}
                            pageTitle="Product Record"
                            subTitle="Your previously owned products"
                            // bottomLine={<hr />}
                        />

                        <div className="row ">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/products-service" className="btn btn-sm btn-gray-border mr-2">
                                    Product Service
                                </Link>

                                <Link to="/my-products" className="btn btn-sm btn-gray-border mr-2">
                                    Products
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
                        <div className="row  justify-content-center filter-row   pb-3">
                            <div className="col">
                                <p  className="text-gray-light ml-2"> Showing{this.state.items.filter((item)=> {

                                        let site = item

                                        return this.state.filterValue ? (this.state.filterValue === "name" ?
                                            site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue === "condition" ? site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue === "brand" ?site.sku.brand&& site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue === "category" ? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue === "type" ? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue === "state" ? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                this.state.filterValue === "year of manufacture" ? site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                                    this.state.filterValue === "model" ? site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                        this.state.filterValue === "serial no." ? site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                            null) :
                                            (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.brand&& site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
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

                        } ).map((item) => (
                            <>

                                <ErrorBoundary>
                                <ProductItem
                                    toProvenance={true}
                                    goToLink={true}
                                    delete={false}
                                    edit={true}
                                    remove={false}
                                    duplicate={true}
                                    item={item}
                                    hideMore={true}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductArchive);
