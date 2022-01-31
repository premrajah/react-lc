import React, {Component} from "react";
import {connect} from "react-redux";
import PhoneHome from "../../img/phone-home.png";
import {Link} from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import * as actionCreator from "../../store/actions/actions";
import FindProduct from "../../img/icons/Find-Product.svg";
import AddProduct from "../../img/icons/add-product-icon.svg";
import SellProduct from "../../img/icons/Sell-Products.svg";
import NewListing from "../../img/icons/add-listing-icon.svg";
import NewSearch from "../../img/icons/search-icon.svg";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };

        this.goToResources = this.goToResources.bind(this);
        this.goToList = this.goToList.bind(this);
        this.goToSearch = this.goToSearch.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);
    }

    interval;


    goToResources() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        } else {
            this.props.history.push("/find-resources");
        }
    }

    goToSearch() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        } else {
            this.props.history.push("/search-form");
        }
    }

    goToList() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        } else {
            this.props.history.push("/list-form");
        }
    }

    showLoginPopUp() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        }
    }


    showProductSelection=()=> {
        this.props.showProductPopUp({ type: "create_product", show: true });
    }

    render() {
        return (
            <Layout>

                <div className="wrapper ">


                        <div className="container   ">

                            <div className="row d-flex pt-5 pb-5 no-gutters align-items-center justify-content-center">
                                <div className="col-md-6 col-sm-12 col-xs-12  ">
                                    <div className="row no-gutters">
                                        <div className="col-12">
                                            <h1 className="blue-text primary-heading primary-heading-font-size"
                                            >
                                                Trace and trust products <br/>wherever they go
                                            </h1>
                                        </div>

                                        <div className="col-12">
                                            <div className="row no-gutters">
                                                <p className="blue-text body-description-text body-description-text-font-size" >
                                                    We help commercial equipment manufacturers and operators trace, manage and recover physical assets throughout their lifecycle.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row no-gutters mt-4 ">
                                        <div className="col-auto">
                                            <a
                                                href="https://loopcycle.io/"
                                                target="_blank"
                                                rel="noopener noreferrer"

                                                style={{ textDecoration: "none" }}
                                                className="mr-2  blue-btn-border mt-2 mb-2">
                                                Learn more <NavigateNextIcon />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-sm-12 col-xs-12 ">
                                    <img className="img-fluid" src={PhoneHome} alt="" />
                                </div>


                            </div>


                    </div>
                    <div className="container-fluid home-section-icons container-light-gray pt-5 pb-5  ">

                        <div className="container">

                        <div className="row no-gutters justify-content-center  row no-gutters justify-content-center    pt-5 pb-2">
                            <div className="col-auto">
                                <h2 className={"text-pink-heading text-center primary-heading"}>
                                    <b>
                                        View all products on the platform
                                    </b>
                                </h2>
                            </div>
                        </div>

                        <div className="row no-gutters justify-content-center mt-2">
                            <div className="col-auto">
                                <button
                                    onClick={this.goToResources}
                                    type="button"
                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue ">
                                    Browse all listings <NavigateNextIcon />
                                </button>
                            </div>
                        </div>




                        <div className="row no-gutters mb-5 mt-5 justify-content-center text-center">
                            <div className="col-12 col-md-4 mb-2">
                                <img className={"home-icon"} src={AddProduct} alt="search" />
                                <p className={"blue-text mt-4"}>
                                    Start building your digital inventory to list the products for sale or manage your assets effectively across multiple sites.
                                </p>
                                <Link
                                    onClick={this.showProductSelection}
                                    to={this.props.isLoggedIn && "/my-products"}
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                   Add Product
                                </Link>
                            </div>
                            <div className="col-12 col-md-4 mb-2">
                                <img className={"home-icon"} src={NewListing} alt="search" />
                                <p className={"blue-text mt-4"}>
                                    List a new product for sale and we’ll notify you when you receive a match.
                                </p>
                                <Link
                                    onClick={this.showLoginPopUp}
                                    to={this.props.isLoggedIn && "/list-form"}
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    New Listing
                                </Link>
                            </div>

                            <div className="col-12 col-md-4 mb-2">
                                <img className={"home-icon"} src={NewSearch} alt="listing" />
                                <p className={"blue-text mt-4"}>
                                    Search for a specific product and we’ll notify you when you receive a match.
                                </p>
                                <Link
                                    onClick={this.showLoginPopUp}
                                    to={this.props.isLoggedIn && "/search-form"}
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    New Search
                                </Link>
                            </div>
                            <div className="col-12 col-md-4 mb-2 d-none">
                                <img className={"home-icon"} src={FindProduct} alt="listing" />
                                <p className={"blue-text mt-4"}>
                                    Do you have used resources to offer? Start listing any used
                                    resources.
                                </p>
                                <Link
                                    onClick={this.showLoginPopUp}
                                    to={this.props.isLoggedIn && "/list-form"}
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                   Find Product
                                </Link>
                            </div>

                            <div className="col-12 col-md-4 mb-2 d-none">
                                <img className={"home-icon"} src={SellProduct} alt="resources" />
                                <p className={"blue-text mt-4"}>
                                    Able to collect and deliver resources? Register your company on
                                    the platform.
                                </p>
                                <Link
                                    onClick={this.showLoginPopUp}
                                    to={this.props.isLoggedIn && "/"}
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Sell Product
                                </Link>
                            </div>
                        </div>



</div>
                    </div>
                </div>

            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,

    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(Home);
