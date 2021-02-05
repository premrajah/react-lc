import React, { Component } from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";

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
                console.log(response.data.data);
                this.setState({allArchivedProducts: response.data.data})
            })
            .catch((error) => {
                console.log("archived products error ", error);
            });
    };

    displayArchivedProducts = () => {
        if(this.state.allArchivedProducts.length > 0) {
            return (
                <div>
                    Products
                </div>
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
                            pageTitle="Product Archive"
                            subTitle="Your previously owned products"
                            bottomLine={<hr/>}
                        />

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
