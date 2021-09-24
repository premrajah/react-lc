import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SubproductItem from "../Products/Item/SubproductItem";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";

class SubProductsTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state={
            products:[]
        }

    }
    showProductSelection=(event)=> {


        this.props.setSiteForm({show:true,
            item:this.props.item,type:"link-product", heading:"Link Products",subProducts:this.state.products});

    }




    getProducts=()=>{

        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(baseUrl + "site/" + this.props.item._key+"/product")
            .then(
                (response) => {

                    var responseAll = response.data;

                    // console.log(responseAll)

                    this.setState({
                        products:responseAll.data
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        console.log("udpate")
        if (prevProps!=this.props) {
            console.log("props changed")
            this.getProducts()
        }
    }



    componentDidMount() {

        this.getProducts()

    }

    render() {


        return (
            <>

                <p
                    style={{ margin: "10px 0px" }}
                    className={
                        "green-text forgot-password-link text-mute small"
                    }>
                                 <span  data-parent={this.props.item._key}
                                                        onClick={this.showProductSelection}
                                                    >
                                                        Link Products
                                                    </span>
                </p>

                {this.state.products&&this.state.products.length > 0 && (
                    <>
                        {this.state.products.map(
                            (item, index) => (
                                <SubproductItem
                                    noLinking={this.props.noLinking}
                                    hideMoreMenu={true}
                                    key={index}
                                    item={item}
                                    remove={true}
                                />
                            )
                        )}
                    </>
                )}
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
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),

        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SubProductsTab);
