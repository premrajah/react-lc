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
import * as actionCreator from "../../store/actions/actions";


class MyAccount extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }


        this.getResources = this.getResources.bind(this)
        this.logOut = this.logOut.bind(this)

    }



    logOut = (event) => {

        document.body.classList.remove('sidemenu-open');
        this.props.logOut()

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
                                <h4 className={"text-blue text-bold"}>  <img src={SettingsWhite} className={"account-icons truck-icon "} alt="" /> Account</h4>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu accountpage-list">
                                    <Link to={"/company-info"} className="list-group-item list-group-item-action ">
                                     Company Info  <NavigateNextIcon />
                                    </Link>

                                    <Link to={"edit-account"} className="list-group-item list-group-item-action ">
                                    Personal Info  <NavigateNextIcon /></Link>

                                    <Link to={"/payment"} className="list-group-item list-group-item-action ">
                                    Payment Methods <NavigateNextIcon /></Link>

                                    <Link to={"/addresses"} className="list-group-item list-group-item-action ">
                                    Address/Sites <NavigateNextIcon />
                                    </Link>



                                </div>
                            </div>
                        </div>



                    </div>


                    <div className="container ">
                        <div className="row">
                            <div className="col-12">
                            <button style={{width:"100%"}} onClick={this.logOut}
                                  className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">Logout
                            </button>
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

        logOut: (data) => dispatch(actionCreator.logOut(data)),

    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(MyAccount);
