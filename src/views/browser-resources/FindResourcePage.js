import React, { Component } from "react";
import { connect } from "react-redux";
import { Image } from "react-bootstrap";
import styles from "./FindResourcePage.module.css";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";

import SearchIcon from "../../img/resource_icons/icon_search_bottle.png";
import BottleDollarIcon from "../../img/resource_icons/icon_bottle_dollar.png";
import PaperIcon from "../../img/resource_icons/Icon_Paper.png";
import GlassIcon from "../../img/resource_icons/Icon_Glass2.png";
import MetalIcon from "../../img/resource_icons/Icon_Metal2.png";
import PlasticIcon from "../../img/resource_icons/Icon_Plastic.png";
import CardBoardIcon from "../../img/resource_icons/Icon_Cardboard.png";
import OtherIcon from "../../img/resource_icons/Icon_Other.png";
import WoodIcon from "../../img/resource_icons/Icon_Wood2.png";
import RubberIcon from "../../img/resource_icons/Icon_Rubber.png";
import TextileIcon from "../../img/resource_icons/Icon_Textiles2.png";
import FindResourceIconHolder from "../../components/FindResourceIconHolder";
import FindResourceListingItem from "../../components/FindResourceListingItem";
import SearchBar from "../../components/SearchBar";

class FindResourcePage extends Component {
    state = {
        allListings: [],
        search: ''
    };

    componentDidMount() {
        this.getAllListings();
    }

    getAllListings = () => {
        axios
            .get(`${baseUrl}listing?m=a`, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ allListings: response.data.data });
                }
            })
            .catch((error) => {
                console.log("find all listing error ", error);
            });
    };

    handleSearch = (searchValue) => {
        this.setState({search: searchValue})
    }

    render() {
        return (
            <>
                <HeaderDark />

                <div className="container">

                    <div className="row mt-5" style={{ marginTop: "80px" }}>
                        <div className="col-md-6 col-sm-12 mt-3 mb-3" align="center">
                            <div className="icon-holder">
                                <Image className="p-4" src={SearchIcon} rounded height="240px" />
                            </div>
                            <h1 className="mt-3 blue-text">Find Products</h1>
                            <p>
                                Have specific requirements? Create a search. We’ll notify you when
                                you receive a match.
                            </p>
                            <Link to="/search-form" className="btn btn-green">
                                Create a search
                            </Link>
                        </div>
                        <div className="col-md-6 col-sm-12 mt-3 mb-3" align="center">
                            <Image className="p-4" src={BottleDollarIcon} rounded height="240px" />
                            <h1 className="mt-3 blue-text">Sell Products</h1>
                            <p>
                                Have a resource to sell? Create a new listing and we’ll notify you
                                when you receive a match.
                            </p>
                            <Link to="/list-form" className="btn btn-green">
                                New Listing
                            </Link>
                        </div>
                    </div>

                    <hr />

                    <div className="row mt-5">
                        <h1 className="text-md-center blue-text">Categories</h1>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <div className="row mt-2 mb-2">
                                <div className="col d-flex justify-content-around" align="center">
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={PaperIcon}
                                        text="Paper"
                                    />
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={GlassIcon}
                                        text="Glass"
                                    />
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={MetalIcon}
                                        text="Metal"
                                    />
                                </div>
                            </div>

                            <div className="row mt-2 mb-2">
                                <div className="col d-flex justify-content-around" align="center">
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={PlasticIcon}
                                        text="Plastic"
                                    />
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={CardBoardIcon}
                                        text="Cardboard"
                                    />
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={OtherIcon}
                                        text="Other"
                                    />
                                </div>
                            </div>

                            <div className="row mt-2 mb-2">
                                <div className="col d-flex justify-content-around" align="center">
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={WoodIcon}
                                        text="Wood"
                                    />
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={RubberIcon}
                                        text="Rubber"
                                    />
                                    <FindResourceIconHolder
                                        iconClass={styles.resourceIcon}
                                        icon={TextileIcon}
                                        text="Textiles"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5 mb-2">
                        <div className="col">
                            <h1 className="text-md-center blue-text">All Products</h1>
                        </div>
                    </div>

                    <div className="row mt-3 mb-5">
                        <div className="col">
                            <SearchBar title="Search Listings" onSearch={(e) => this.handleSearch(e)} />
                            <p className="mt-2">Available listings ({this.state.allListings.length > 0 ? this.state.allListings.length : '...' })</p>
                        </div>
                    </div>

                    <div className="row mb-5">
                        <div className="col-12">
                                {this.state.allListings.length > 0
                                    ? this.state.allListings.filter(item => {
                                        if(this.state.search.length === 0) {
                                            return item;
                                        } else if (item.listing.name.toLowerCase().includes(this.state.search.toLowerCase()) || item.org._key.toLowerCase().includes(this.state.search.toLowerCase())) {
                                            return item
                                        }
                                    }).map((item) => (
                                        <FindResourceListingItem key={item.listing._id} item={item} />
                                      ))
                                    : "Loading..."}


                        </div>
                    </div>
                </div>

                <Footer />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

export default connect(mapStateToProps)(FindResourcePage);
