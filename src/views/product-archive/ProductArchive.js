import React, { Component } from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import ProductRecordItem from "../../components/ProductRecordItem";
import FindResourceListingItem from "../../components/FindResourceListingItem";
import {Link} from "react-router-dom";

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

                this.setState({allArchivedProducts: response.data.data})
            })
            .catch((error) => {

            });
    };

    displayArchivedProducts = () => {
        if(this.state.allArchivedProducts.length > 0) {
            return (
                this.state.allArchivedProducts.map(item => {
                    return (
                        <Link to={`/p/${item.product._key}`} key={item.product._id}>
                            <ProductRecordItem   item={item} />
                        </Link>
                    )
                })
            )
        } else {
            return (
                <div>No previously owned products...</div>
            )
        }
    }

    componentDidMount() {
        this.getAllPreviouslyOwnedProducts()
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
                            bottomLine={<hr/>}
                        />

                        <div className="row mt-3 mb-5">
                            <div className="col-12 d-flex justify-content-end">
                                <Link to="/my-products" className="btn btn-sm blue-btn">My Products</Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                {this.displayArchivedProducts()}
                            </div>
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
