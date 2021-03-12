import React, {Component} from 'react';
import {connect} from "react-redux";
import SettingsWhite from '../../img/icons/settings-blue.png';
import {Link} from "react-router-dom";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import * as actionCreator from "../../store/actions/actions";
import PageHeader from "../../components/PageHeader";


class MyAccount extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            activePage:1
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
                <div className="wrapper">

                    <HeaderDark />

                    <div className="container  pb-4 pt-4">

                        <PageHeader pageIcon={SettingsWhite} pageTitle="Account" subTitle="User account settings" bottomLine={<hr/>} />


                        <div className="row">
                            <div className="col-md-12">
                                <div className="list-group main-menu accountpage-list">

                                    <Link to={"/edit-account"} className="list-group-item list-group-item-action ">
                                    Personal Info  <NavigateNextIcon /></Link>

                                    <Link to={"/company-info"} className="list-group-item list-group-item-action ">
                                        Company Info  <NavigateNextIcon />
                                    </Link>

                                    {/*<Link to={"/payment"} className="list-group-item list-group-item-action ">*/}
                                    {/*Payment Methods <NavigateNextIcon /></Link>*/}

                                    <Link to={"/addresses"} className="list-group-item list-group-item-action ">
                                    Address/Sites <NavigateNextIcon />
                                    </Link>

                                </div>


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

export default connect(mapStateToProps, mapDispachToProps)(MyAccount);
