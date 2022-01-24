import React, { Component } from "react";
import { connect } from "react-redux";
import SettingsWhite from "../../img/icons/settings-blue.png";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

class Help extends Component {
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
                {console.log(this.props.userDetail)}
                <div className="container  pb-4 pt-4">
                    <PageHeader
                        pageIcon={SettingsWhite}
                        pageTitle="Help"
                        subTitle={`Hi, ${this.props.userDetail.firstName ? this.props.userDetail.firstName : this.props.userDetail.orgId }. What can we help you with?`}
                        bottomLine={""}
                    />

                    <div className="row">
                        <div className="col-md-12">
                            <div className="list-group main-menu accountpage-list">
                                <Link to="/#" className="list-group-item list-group-item-action ">
                                    FAQ's & Help <NavigateNextIcon />
                                </Link>

                                <Link to="/#" className="list-group-item list-group-item-action ">
                                    User Manual <NavigateNextIcon />
                                </Link>
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
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Help);
