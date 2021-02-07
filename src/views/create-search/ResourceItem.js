import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import PlaceholderImg from '../../img/place-holder-lc.png';
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import moment from "moment";
import MoreMenu from '../../components/MoreMenu'


class ResourceItem extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            image:null
        }


        this.callBackResult=this.callBackResult.bind(this)
        this.showEdit=this.showEdit.bind(this)
        this.deleteItem=this.deleteItem.bind(this)
        this.goToPage=this.goToPage.bind(this)


    }

    componentWillMount() {

    }

    componentDidMount() {





    }




    goToPage(event){

        event.stopPropagation();
        event.preventDefault();
        this.props.history.push(this.props.link)

    }

    callBackResult(action){


        if (action==="edit"){

            this.showEdit()
        }
        else if (action==="delete"){

            this.deleteItem()
        }


    }

    triggerCallback() {

        this.props.triggerCallback()


    }

    deleteItem() {

        axios.delete(baseUrl + "listing/"+this.props.item.listing._key,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    // var responseAll = response.data.data;


                    // this.props.history.push("/my-listings")
                    // this.props.loadProducts()
                    this.triggerCallback()



                },
                (error) => {




                }
            );

    }


    showEdit(){

        this.setState({

            showEdit:!this.state.showEdit,

        })
    }



    render() {

        return (

<>


    {this.props.item.listing.listing?

        <>
        {/*<Link to={"/"+ this.props.item.listing.listing._key }>*/}
        <div onClick={this.goToPage} className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4 click-item">


                    <div className={"col-2"}>

                        {this.props.item.artifacts&&this.props.item.artifacts.length>0? <img className={"img-fluid"} src={this.props.item.artifacts[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}

                    </div>
                    <div className={"col-4 pl-3 content-box-listing"}>

                        <p style={{ fontSize: "18px" }} className=" mb-1 list-title">{this.props.item.listing.listing.name}</p>
                        <p style={{ fontSize: "16px" }} className=" mb-1 ">{this.props.item.product&& <>Product: {this.props.item.listing.product.name} </>}</p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.listing.listing.category}, {this.props.item.listing.listing.type}, {this.props.item.listing.listing.state} </p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">  {this.props.item.listing.listing.volume} {this.props.item.listing.listing.units}</p>


                    </div>


                    <div className={"col-2 text-right"}>
                        <p className={"green-text text-caps"}>

                            {this.props.item.listing.listing.price&&this.props.item.listing.listing.price.value ? <> GBP {this.props.item.listing.listing.price.value}</> : "Free"}

                            {/*{this.props.item.listing.listing.price.value ? <> {this.props.item.listing.listing.price.value}</> : "Free"}*/}
                        </p>
                    </div>

                    <div className={"col-2 text-right"}>
                        <p className={"green-text text-caps"}>
                            {this.props.item.listing.listing.stage}
                        </p>
                    </div>

                    <div className={"col-2 text-right"}>
                        <p className={" text-caps"}>

                            {moment(this.props.item.listing.listing._ts_epoch_ms).format("DD MMM YYYY")}

                        </p>
                    </div>



                </div>

        {/*</Link>*/}
        </>

        :
        <>
        {/*<Link to={"/"+ this.props.item.listing._key }>*/}

                <div onClick={this.goToPage} className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4 click-item">


                <div className={"col-2"}>

                    {this.props.item.artifacts&&this.props.item.artifacts.length>0? <img className={"img-fluid img-list"} src={this.props.item.artifacts[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}

                </div>
                <div className={"col-4 pl-3 content-box-listing"}>

                    <p style={{ fontSize: "18px" }} className=" mb-1 list-title">{this.props.item.listing.name}</p>
                    <p style={{ fontSize: "16px" }} className=" mb-1 ">{this.props.item.product&& <>Product: {this.props.item.product.name} </>}</p>

                    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-cabs">{this.props.item.listing.category}, {this.props.item.listing.type}, {this.props.item.listing.state}  </p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-cabs">{this.props.item.listing.volume} {this.props.item.listing.units}</p>



                </div>
                <div className={"col-2 text-right"}>
                    <p className={"green-text "}>
                        {this.props.item.listing.price&&this.props.item.listing.price.value ? <>GBP {this.props.item.listing.price.value}</> : "Free"}
                    </p>
                </div>

                  <div className={"col-2 text-right"}>
                        <p className={"green-text text-caps"}>
                            {this.props.item.listing.stage}
                        </p>
                    </div>
                    <div className={"col-2 text-right"}>
                        <p className={" text-caps"}>
                            {moment(this.props.item.listing._ts_epoch_ms).format("DD MMM YYYY")}

                        </p>
                        <MoreMenu  triggerCallback={(action)=>this.callBackResult(action)} delete={true} edit={false} remove={false} duplicate={false}   />

                    </div>

            </div>
         {/*</Link>*/}

        </>
            }



            </>

        );
    }
}








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
)(ResourceItem);