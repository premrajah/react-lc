import React, {Component} from "react";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import GlobalDialog from "../RightBar/GlobalDialog";
import CompanyDetails from "./CompanyDetails";

class CompanyDetailsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails:false

        };

    }




    componentDidMount() {
        window.scrollTo(0, 0);

        this.showDetailsPopUp()
    }

    showDetailsPopUp=()=>{

        this.setState({
            showDetails:!this.state.showDetails
        })
    }
    render() {
        return (

<>
    <GlobalDialog
        hideClose
        disableBackdropClick
        heading={"Organisation Details"}
        show={this.state.showDetails}
        hide={this.showDetailsPopUp}
        size="md"
    >
        <>
            <div className={"col-12 "}>

                <CompanyDetails  hide={this.showDetailsPopUp} trackFirstLogin showSkip showImage />
            </div>
        </>
    </GlobalDialog>
    </>



        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        orgImage: state.orgImage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setOrgImage: (data) => dispatch(actionCreator.setOrgImage(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetailsPopUp);
