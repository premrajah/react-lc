import React, { Component } from 'react';
import Paper from '../img/place-holder-lc.png';
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";

import { Modal, ModalBody } from 'react-bootstrap';
import GrayLoop from '../img/icons/gray-loop.png';
import TextField from '@material-ui/core/TextField';
import moment from "moment/moment";
import PlaceholderImg from '../img/place-holder-lc.png';
import { Link } from "react-router-dom";
import MoreMenu from './MoreMenu'
import ProductEditForm from "./ProductEditForm";


class ProductItemNew extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers:[],
            images:[],
            showSubmitSite:false,
            errorRegister:false,
            siteSelected:null,
            showProductEdit:false,
            productDuplicate:false,
        }

        this.showPopUp=this.showPopUp.bind(this)
        this.fetchImage=this.fetchImage.bind(this)
        this.getSites=this.getSites.bind(this)
        this.showSubmitSite=this.showSubmitSite.bind(this)
        this.showProductEdit=this.showProductEdit.bind(this)
        this.showProductDuplicate=this.showProductDuplicate.bind(this)

        this.callBackResult=this.callBackResult.bind(this)
        this.deleteItem=this.deleteItem.bind(this)
        this.removeItem=this.removeItem.bind(this)

        this.callBackSubmit=this.callBackSubmit.bind(this)



    }


    callBackSubmit(){

        // alert("submit ")


        this.setState({

            showProductEdit:!this.state.showProductEdit,

        })

        this.props.loadProductsWithoutParent(this.props.userDetail.token)


    }


    getSites() {

        axios.get(baseUrl + "site",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;
                    console.log("sites  response")
                    console.log(responseAll)

                    this.setState({

                        sites: responseAll

                    })

                },
                (error) => {

                    console.log("sites response error")
                    console.log(error)

                }
            );

    }

    callBackResult(action){

        if (action==="edit"){

            this.showProductEdit()
        }
        else if (action==="delete"){

            this.deleteItem()
        }
        else if (action==="duplicate"){

            // this.showProductDuplicate()

            this.submitDuplicateProduct()
        }


        else if (action==="remove"){

            this.removeItem()
        }
    }




    submitDuplicateProduct = event => {


        axios.post(baseUrl + "product/"+this.props.item.product._key+"/duplicate",
            {
            }
            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            })
            .then(res => {


                this.props.loadProductsWithoutParent(this.props.userDetail.token)



            }).catch(error => {

            console.log(error)

            // this.setState({
            //
            //     errorRegister:error.response.data.errors[0].message
            // })

        });

    }


    triggerCallback() {



        this.props.triggerCallback()


    }

    removeItem() {

        

        var data={

            product_id:this.props.parentId,
            sub_product_ids:[this.props.item.product._key]
        }

        console.log("remove data",data)

        axios.post(baseUrl + "product/sub-product/remove", data,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    // var responseAll = response.data.data;


                    // this.props.history.push("/my-products")
                    // this.props.loadProducts()


                console.log("sub product removed succcessfully")


                },
                (error) => {

                    console.log("remove response error")
                    console.log(error)

                }
            );

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


                    // this.props.history.push("/my-products")
                    // this.props.loadProducts()


                },
                (error) => {

                    console.log("delete response error")
                    console.log(error)

                }
            );

    }



    showProductEdit(){


        this.setState({

            showProductEdit:!this.state.showProductEdit,
            productDuplicate:false

        })
    }

    showProductDuplicate(){


        this.setState({

            showProductEdit:!this.state.showProductEdit,
            productDuplicate:true

        })
    }



    showSubmitSite(){


        this.setState({

            errorRegister:null
        })


        this.setState({

            showSubmitSite:!this.state.showSubmitSite
        })
    }

    showPopUp() {

        this.setState({
            showPopUp: !this.state.showPopUp
        })

    }



    componentWillMount() {

    }

    componentDidMount() {

            this.fetchImage()

    }


    fetchImage(){



        if (this.props.item.artifacts){

            this.setState({

                images: this.props.item.artifacts
            })



        }else {


            var url = baseUrl + "product/" + this.props.item.product._key + "/artifact"


            axios.get(url,
                {
                    headers: {
                        "Authorization": "Bearer " +  this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data.data;
                        console.log("img product response")
                        console.log(responseAll)

                        this.setState({

                            images: responseAll
                        })

                    },
                    (error) => {

                        // var status = error.response.status
                        console.log("listing error")
                        console.log(error)

                    }
                );

        }


    }





    render() {


        return (
       <>

            <Link to={"/product/"+this.props.item.product._key}>
        <div className="row no-gutters justify-content-center mt-4 mb-4  pb-4">


                <div className={"col-2 "}>


                    {this.state.images.length>0? <img className={"img-fluid img-list"} src={this.state.images[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}



                </div>
                <div className={"col-7 pl-2  content-box-listing"}>

                    <p style={{ fontSize: "18px" }} className=" mb-1">{this.props.item.product.name}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.product.purpose}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.product.category}, {this.props.item.product.type}, {this.props.item.product.state} {this.props.item.product.volume} {this.props.item.product.units}</p>
                    {this.props.item.search_ids && <p style={{ fontSize: "16px" }} className="text-mute mb-1 bottom-tag-p">{this.props.item.search_ids.length} Searches</p>}
                    {this.props.item.sub_product_ids&&this.props.item.sub_product_ids.length>0 && <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.sub_product_ids.length} Sub Products</p>}

                </div>
                <div style={{ textAlign: "right" }} className={"col-3"}>

                    <p className={"text-gray-light small"}>  {moment(this.props.item.product._ts_epoch_ms).format("DD MMM YYYY")} </p>
                    <MoreMenu  triggerCallback={(action)=>this.callBackResult(action)} delete={this.props.delete} edit={this.props.edit} remove={this.props.remove} duplicate={this.props.duplicate}   />


                </div>
            </div>

        </Link>



           <Modal
               size="lg"
               show={this.state.showProductEdit}
               onHide={this.showProductEdit}
               className={"custom-modal-popup popup-form"}
           >

               <div className="">
                   <button onClick={this.showProductEdit} className="btn-close close" data-dismiss="modal" aria-label="Close"><i className="fas fa-times"></i></button>
               </div>


               <ProductEditForm triggerCallback={(action)=>this.callBackSubmit(action)} isDuplicate={this.state.productDuplicate} productId={this.props.item.product._key}/>


           </Modal>

            </>

        );
    }
}



const mapStateToProps = state => {
    return {
        loginError: state.loginError,
        // cartthis.props.items: state.cartthis.props.items,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartthis.props.item : state.abondonCartthis.props.item,
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
        loadProductsWithoutParent: (data) => dispatch(actionCreator.loadProductsWithoutParent(data)),






    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductItemNew);

