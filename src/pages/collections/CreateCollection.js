import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import encodeUrl from "encodeurl";
import NotFound from "../../components/NotFound/index";
import Layout from "../../components/Layout/Layout";
import ProductDetailContent from "../../components/Products/ProductDetailContent";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import CollectionForm from "../../components/Collection/CollectionForm";

class CreateCollection extends Component {
    slug;
    search;
    constructor(props) {
        super(props);
        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp: false,
            subProducts: [],
            currentProduct:null,
            loading:false,
            notFound: false,
            paramsString:null
        };

        this.slug = props.match.params.slug;
        this.search = props.match.params.search;
    }

    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.match.params.slug !== this.props.match.params.slug) {
            this.slug = newProps.match.params.slug;
            window.scrollTo(0, 0);
            this.props.loadCurrentProduct(encodeUrl(this.slug));

        }
    }



    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };



     loadCurrentProduct = (data) =>  {

         this.props.loading(true)
         this.setState({
             loading:true
         })
        try{
            axios
                .get(baseUrl + "product/" + encodeUrl(data) + "/expand?agg"
                )
                .then(
                    (response) => {
                        let responseAll = response.data;


                        this.props.setCurrentProduct(responseAll.data)
                        this.props.loading(false)
                        this.setState({
                            loading:false
                        })

                    },
                    (error) => {


                        this.setState({
                            loading:false
                        })

                        this.props.loading(false)
                    }
                );

        } catch(e) {
            console.log(e)

        }
    };


    componentDidMount() {


    }

    setParams=(params)=>{

        this.setState({
            paramsString:params
        })

    }

    render() {


        return (

            <>

                <Layout hideFooter={true}>
                        <CollectionForm/>
                </Layout>

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
        currentProduct:state.currentProduct,
        productNotFound:state.productNotFound,

    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loading: (data) => dispatch(actionCreator.loading(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadCurrentProduct: (data) => dispatch(actionCreator.loadCurrentProduct(data)),
        setCurrentProduct: (data) => dispatch(actionCreator.setCurrentProduct(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(CreateCollection);
