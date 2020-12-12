import React, { Component } from 'react';
import { connect } from "react-redux";
import ShippingWhite from '../../img/icons/delivery-blue.png';
import SettingsWhite from '../../img/icons/settings-blue.png';
import SearchWhite from '../../img/icons/search-blue.png';
import VisaIcon from '../../img/visa.png';
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
                                <p className={"blue-text"}><Link to={"/account"}> Account </Link> > Payment Method </p>

                                <h4 className={"text-blue text-bold"}>Payment Method</h4>

                            </div>
                        </div>




                        <div className="row">
                            <div className="col-12">
                                <div className="list-group main-menu accountpage-list">


                                  <p className="list-group-item list-group-item-action ">
                                        <img src={VisaIcon} className={"account-icons truck-icon "} alt="" />
                                        VISA 8120


                                    <Link style={{float:"right"}} className="">

                                         <span  className={"green-link-url text-right"}>REMOVE</span>
                                    </Link>
                                  </p>

                                </div>
                            </div>


                            <div className="col-12">
                                <div className="list-group main-menu accountpage-list">


                                    <p className="list-group-item list-group-item-action ">
                                        <img src={VisaIcon} className={"account-icons truck-icon "} alt="" />
                                        VISA 8220


                                        <Link style={{float:"right"}} className="">

                                            <span  className={"green-link-url text-right"}>REMOVE</span>
                                        </Link>
                                    </p>

                                </div>
                            </div>

                            <div className="col-12">
                                <div className="list-group main-menu accountpage-list">


                                    <p className="">
                                            <span className={"green-link-url text-right"}>Add Payment Method</span>
                                    </p>

                                </div>
                            </div>


                        </div>
                    </div>


                    <div className="container ">
                        <div className="row">
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
