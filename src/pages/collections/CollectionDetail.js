import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import encodeUrl from "encodeurl";
import NotFound from "../../components/NotFound/index";
import Layout from "../../components/Layout/Layout";
import ProductDetailContent from "../../components/Products/ProductDetailContent";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import CollectionDetailContent from "../../components/Collection/CollectionDetailContent";

class CollectionDetail extends Component {
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
        // if (newProps.match.params.slug !== this.props.match.params.slug) {
        //     this.slug = newProps.match.params.slug;
        //     window.scrollTo(0, 0);
        //     this.props.loadCurrentCollection(encodeUrl(this.slug));
        //
        // }
    }



    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };



    loadCurrentCollection = (data) =>  {

        this.props.loading(true)
        this.setState({
            loading:true
        })
        try{
            axios
                .get(baseUrl + "collection/" + encodeUrl(data))
                .then(
                    (response) => {
                        let responseAll = response.data;
                        this.props.setCurrentCollection(responseAll.data)
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

        if (this.props.location.search.includes("r=true")&&this.props.userDetail.is_org_admin ){

            axios.get(baseUrl + "product/" + this.slug + "/code-artifact?r=true").then(
                (response) => {
                    let responseAll = response.data;

                    this.loadCurrentCollection(encodeUrl(this.slug),true);
                },
                (error) => {}
            );
        }else {
            this.loadCurrentCollection(encodeUrl(this.slug),true);
        }
    }

    setParams=(params)=>{

        this.setState({
            paramsString:params
        })

    }

    render() {

        return (
            <>
                {!this.state.loading &&
                !this.props.currentCollection ? (
                        <NotFound />
                    ) :
                    <>
                        {!this.props.location.pathname.includes("preview")?
                            <Layout hideFooter={true} sendParams={this.setParams}>
                                <div className={"container pb-5 mb-5"}>
                                    {!this.state.loading&&this.props.currentCollection &&
                                        <CollectionDetailContent
                                            history={this.props.history}
                                            hideRegister={true}
                                            paramsString={this.state.paramsString}
                                            item={this.props.currentCollection}
                                        />}
                                </div>
                            </Layout>:
                            <div className={"container pb-5 mb-5"}>
                                {!this.state.loading&&this.props.currentCollection &&
                                    <CollectionDetailContent
                                        paramsString={this.state.paramsString}
                                        history={this.props.history}
                                        hideRegister={true}
                                        item={this.props.currentCollection}
                                    />}
                            </div>}
                    </>
                }
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
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,
        currentCollection:state.currentCollection,
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
        setCurrentCollection: (data) => dispatch(actionCreator.setCurrentCollection(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(CollectionDetail);
