import React, {Component} from 'react';
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import {makeStyles} from '@material-ui/core/styles';
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl"
import {withStyles} from "@material-ui/core/styles/index";
import ProductDetail from '../../components/ProductDetail'
import NotFound from "../NotFound/index"


class ProductView extends Component {

    slug;
    search;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp:false,
            subProducts:[],

            notFound:false


        }


        this.slug = props.match.params.slug
        this.search = props.match.params.search

        this.getResources = this.getResources.bind(this)
        this.callBackReload=this.callBackReload.bind(this)


    }

    componentWillMount() {
        window.scrollTo(0, 0)
    }





    componentWillReceiveProps(newProps){


        if (newProps.match.params.slug !== this.props.match.params.slug) {


            this.slug= newProps.match.params.slug

            this.getResources()



        }

    }


    callBackReload(){

        this.getResources()


    }


    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {

        this.props.history.go(+1)
    }


    getResources() {


        axios.get(baseUrl + "product/" + encodeUrl(this.slug)+"/expand",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data;



                    this.setState({

                        item: responseAll.data
                    })

                },
                (error) => {


                    this.setState({

                        notFound: true
                    })
                }
            );

    }










    componentDidMount() {


        this.getResources()

    }




    render() {

        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <div>

                <Sidebar />
                <div className="accountpage">

                    <HeaderDark />


                    {this.state.notFound ? <NotFound/> :

                        <div className={"container pb-5 mb-5"}>



                        {this.state.item &&
                            <>

                                <ProductDetail  triggerCallback={()=>this.callBackReload()} history={this.props.history} hideRegister={true} item={this.state.item}/>

                            </>
                            }



                        </div>
                    }



                </div>



            </div>
        );
    }
}






const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}));







const mapStateToProps = state => {
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


    };
};

const mapDispachToProps = dispatch => {
    return {

        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductView);
