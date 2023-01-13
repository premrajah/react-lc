import React, { Component } from "react";
import { connect } from "react-redux";
import SettingsWhite from "../../img/icons/settings-blue.png";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CalenderEvents from "../../components/Event/CalenderEvents";
import BigCalenderEvents from "../../components/Event/BigCalenderEvents";

class MyDiary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <Layout>
                <div className="container  pb-4 pt-4">
                    <PageHeader
                        // pageIcon={SettingsWhite}
                        pageTitle="Calendar"
                        // subTitle={`Hi, ${this.props.userDetail.firstName ? this.props.userDetail.firstName : this.props.userDetail.orgId }. What can we help you with?`}
                        bottomLine={""}
                    />


                    <BigCalenderEvents/>

                </div>
            </Layout>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDiary);
