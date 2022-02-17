import React from "react";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import IndexNavbar from "../Navbars/IndexNavbar";
import history from "../../History/history";
import Sidebar from "../Sidebar/Sidebar";
import {baseUrl} from "../../Util/Constants";
import axios from "axios";
import GlobalDialog from "../RightBar/GlobalDialog";
import CompanyInfo from "../../pages/account/CompanyInfo";
import CompanyDetails from "../Account/CompanyDetails";

class Header extends React.Component {
    constructor(props) {
        super(props);



        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            image:null,
            firstLogin:false,
            showDetails:false
        };
        this.goToInbox = this.goToInbox.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);

    }

    goToInbox() {
        history.push("/inbox");
    }

    toggleMenu = (event) => {
        document.body.classList.add("sidemenu-open");
    };



    showLoginPopUp() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        }
    }

    getArtifactForOrg = () => {
        let url = `${baseUrl}org/${encodeURIComponent(this.props.userDetail.orgId)}/artifact`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {

                    this.setState({
                        image:response.data.data[0].blob_url
                    })
                }
            })
            .catch((error) => {});
    };


    getOrgCache = () => {

        let url = `${baseUrl}org/cache`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {


                    let orgCache=response.data.data
                    if (!(orgCache&&orgCache.first_login)){
                        this.showDetailsPopUp()
                    }

                   console.log(response)
                }
            })
            .catch((error) => {});
    };




    componentDidMount() {
        if (this.props.isLoggedIn) {
            this.getOrgCache()
            this.getArtifactForOrg()

        }
    }


    showDetailsPopUp=()=>{

        this.setState({
            showDetails:!this.state.showDetails
        })
    }

    render() {
        return (

            <>
                <div id="back-to-top-anchor">
                    <Sidebar image={this.state.image} />
                    <IndexNavbar image={this.state.image} />

                </div>



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
        // age: state.age,
        // cartItems: state.cartItems,
        // loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Header);
