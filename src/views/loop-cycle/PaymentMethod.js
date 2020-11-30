import React, { Component } from 'react';
import { connect } from "react-redux";
import ShippingWhite from '../../img/icons/delivery-blue.png';
import SettingsWhite from '../../img/icons/settings-blue.png';
import SearchWhite from '../../img/icons/search-blue.png';
import VerticalLines from '../../img/icons/stat-blue-2.png';
import Rings from '../../img/icons/ring-blue.png';
import BuildingIcon from '../../img/icons/building-icon.png';
import ProductBlue from '../../img/icons/product-blue.png';
import ListingBlue from '../../img/icons/listing-blue.png';
import { Link } from "react-router-dom";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


class PaymentMethod extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }


        this.getResources = this.getResources.bind(this)

    }


    getResources() {


        axios.get(baseUrl + "resource",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {
                var response = response.data;

                console.log("resource response")
                console.log(response)

            },
                (error) => {
                    var status = error.response.status


                    console.log("resource error")
                    console.log(error)




                }
            );

    }




    interval


    componentWillMount() {

    }

    componentDidMount() {



    }



    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper  accountpage">

                    <HeaderDark />


                    <div className="container  pt-3">

                        <div className="row mb-3 justify-content-center ">

                            <div className="col-12  justify-content-center">
                                <h4 className={"text-blue text-bold"}>Payment Method</h4>
                            </div>
                        </div>




                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu accountpage-list">
                                    <Link className="list-group-item list-group-item-action ">
                                        <img src={SettingsWhite} className={"account-icons truck-icon "} alt="" />
                                     Account  <NavigateNextIcon /> </Link>
                                    <Link to={"my-search"} className="list-group-item list-group-item-action ">
                                        <img src={SearchWhite} className={"account-icons truck-icon "} alt="" />
                                    My Searches  <NavigateNextIcon /></Link>

                                    <Link to={"/my-listings"} className="list-group-item list-group-item-action ">
                                        <img src={ListingBlue} className={"account-icons truck-icon "} alt="" />
                                    My Listings <NavigateNextIcon /></Link>

                                    <Link to={"/loops"} className="list-group-item list-group-item-action ">
                                        <img src={Rings} className={"account-icons truck-icon "} alt="" />
                                    My Cycles <NavigateNextIcon /></Link>



                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="container ">
                        <div className="row">
                        </div>
                    </div>

                    <div className="container   pt-4">

                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu accountpage-list">

                                    <Link to={"/my-products"} className="list-group-item list-group-item-action ">
                                        <img src={ProductBlue} className={"account-icons truck-icon "} alt="" />
                                        Products <NavigateNextIcon /></Link>

                                    <Link to={"/my-deliveries"} className="list-group-item list-group-item-action ">
                                        <img src={ShippingWhite} className={"account-icons truck-icon "} alt="" />
                                        Deliveries <NavigateNextIcon /></Link>

                                    <Link to={"/statistics"} className="list-group-item list-group-item-action ">
                                        <img src={VerticalLines} className={"account-icons truck-icon "} alt="" />
                                        Statistics <NavigateNextIcon /></Link>

                                </div>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        );
    }
}





const mapStateToProps = state => {
    return {

        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,





    };
};

const mapDispachToProps = dispatch => {
    return {





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(PaymentMethod);
