import React, { Component } from 'react';
import { connect } from "react-redux";
import VisaIcon from '../../img/visa.png';
import { Link } from "react-router-dom";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";


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

            },
                (error) => {
                    var status = error.response.status

                }
            );

    }




    interval


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

export default connect(mapStateToProps, mapDispachToProps)(PaymentMethod);
