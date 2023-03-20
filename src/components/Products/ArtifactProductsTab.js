import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import AddImagesToProduct from "../UploadImages/AddImagesToProduct";
import AddedDocumentsDisplay from "../UploadImages/AddedDocumentsDisplay";
import AddArtifactToEntity from "../UploadImages/AddArtifactToEntity";
import {baseUrl, ENTITY_TYPES} from "../../Util/Constants";
import axios from "axios";

class ArtifactProductsTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);
        this.state = {
            artifacts:[]
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps!=this.props){
            if (this.props.item&&this.props.entityType=="product"){
                this.getArtifactsForProduct()
            }
            else if (!this.props.item&&this.props.type==="add"&&this.props.entityType=="product"){
                // this.getArtifactsForProduct()
            }
        }
    }

    componentDidMount() {


        if (this.props.item&&this.props.entityType=="product"){
            this.getArtifactsForProduct()
        }
    }

    getArtifactsForProduct = () => {

        axios.get(`${baseUrl}product/${this.props.item.product._key}/artifact`)
            .then(res => {
                const data = res.data.data;
                this.setState({
                    artifacts:data
                });
            })
            .catch(error => {
            })
    }

    render() {

        return (
            <>

                <AddArtifactToEntity
                    refresh={this.getArtifactsForProduct}
                    setArtifacts={(artifacts)=>{
                        this.setState({artifacts:artifacts});
                        if (this.props.setArtifacts){
                            this.props.setArtifacts(artifacts)
                        }

                    }}
                    entityId={this.props.item?this.props.item.product._key:null}
                    entityType={this.props.entityType}
                    type={this.props.type}
                    hideMenu={this.props.hideMenu}
                    showCancel={this.props.showCancel}

                />
                <AddedDocumentsDisplay
                    hideAdd={this.props.hideAdd?this.props.hideAdd:false}
                    artifacts={this.state.artifacts}
                    hideMenu={this.props.hideMenu}
                    showCancel={this.props.showCancel}


                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
        showSubProductView: state.showSubProductView,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ArtifactProductsTab);
