import React, { Component } from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import ProductRecordItem from "../../components/ProductRecordItem";
import { Link } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundary";

class ProductArchive extends Component {
    state = {
        allArchivedProducts: [],
    };

    getAllPreviouslyOwnedProducts = () => {
        axios
            .get(`${baseUrl}product/past-owner`, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                this.setState({ allArchivedProducts: response.data.data });
            })
            .catch((error) => {});
    };

    displayArchivedProducts = () => {
        if (this.state.allArchivedProducts !== null && this.state.allArchivedProducts.length > 0) {
            return this.state.allArchivedProducts.map((item, index) => {
                return (
                    <Link to={`/p/${item.product._key}`} key={index}>
                        <ErrorBoundary>
                            <ProductRecordItem item={item} />
                        </ErrorBoundary>
                    </Link>
                );
            });
        } else {
            return <div>No previously owned products...</div>;
        }
    };

    componentDidMount() {
        this.getAllPreviouslyOwnedProducts();
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
                            pageTitle="Product Record"
                            subTitle="Your previously owned products"
                            bottomLine={<hr />}
                        />

                        <div className="row mt-3 mb-5">
                            <div className="col-12 d-flex justify-content-end">
                                <Link to="/products-service" className="btn btn-sm blue-btn mr-2">
                                    Product Service
                                </Link>

                                <Link to="/my-products" className="btn btn-sm blue-btn mr-2">
                                    My Products
                                </Link>

                                <Link to="/product-tracked" className="btn btn-sm blue-btn">
                                    Tracked
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">{this.displayArchivedProducts()}</div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductArchive);
