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
import ProductDetail from "./ProductDetail";


class RequestReleaseItem extends Component {


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
            showProductHide:false
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
        this.showProductHide=this.showProductHide.bind(this)
        this.goToProduct=this.goToProduct.bind(this)


    }


    callBackSubmit(){
        
        this.setState({

            showProductEdit:!this.state.showProductEdit,

        })

        this.props.loadProductsWithoutParent(this.props.userDetail.token)


    }

    callBackHide(){
        this.showProductHide()

    }

    showProductHide(){

        this.setState({

            showProductHide:!this.state.showProductHide,

        })
    }
    
    
    goToProduct(event){

        if (this.props.goToLink){
        //
        //     this.props.history.push(this.props.item&&this.props.item.product.product?"/product/"+this.props.item.product.product._key:"/product/"+this.props.item._key)
        }else{

            event.preventDefault()
            this.showProductHide()
        }

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



                    this.setState({

                        sites: responseAll

                    })

                },
                (error) => {




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


        axios.post(baseUrl + "product/"+this.props.item.product.product._key+"/duplicate",
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
            sub_products_ids:[this.props.item&&this.props.item.product.product?this.props.item.product.product._key:this.props.item._key]
        }



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





                },
                (error) => {




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



        console.log(this.props.item)


    }


    fetchImage(){



        if (this.props.item.artifacts){

            this.setState({

                images: this.props.item.artifacts
            })



        }else {


            var url =  this.props.item&&this.props.item.product.product?baseUrl + "product/" +this.props.item.product.product._key + "/artifact":baseUrl + "product/" +this.props.item._key + "/artifact"


            axios.get(url,
                {
                    headers: {
                        "Authorization": "Bearer " +  this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data.data;



                        this.setState({

                            images: responseAll
                        })

                    },
                    (error) => {

                        // var status = error.response.status



                    }
                );

        }


    }





    render() {


        return (
       <>




    <>
    <Link onClick={ this.goToProduct } to={"/product/"+this.props.item.product.product._key}>
        <div   className="row no-gutters justify-content-center mt-4 mb-4 ">


                <div className={"col-2 "}>

                    {this.state.images.length>0? <img className={"img-fluid img-list"} src={this.state.images[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}

                </div>
                <div className={"col-5 pl-2  content-box-listing"}>
                    <p style={{ fontSize: "18px" }} className=" mb-1">{this.props.item.product.product.name}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.product.product.purpose}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.product.product.category}, {this.props.item.product.product.type}, {this.props.item.product.product.state} </p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1"> {this.props.item.product.product.volume} {this.props.item.product.product.units}</p>


                    {this.props.item.search_ids && <p style={{ fontSize: "16px" }} className="text-mute mb-1 bottom-tag-p">{this.props.item.search_ids.length} Searches</p>}
                    {this.props.item.sub_product_ids&&this.props.item.sub_product_ids.length>0 && <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.sub_product_ids.length} Sub Products</p>}




                </div>
                <div style={{ textAlign: "right" }} className={"col-5"}>

                    <p className={"text-gray-light small"}>  {moment(this.props.item.product.product._ts_epoch_ms).format("DD MMM YYYY")} </p>


                    <div className="row  pb-4 pb-4 mb-4">
                        <div className="col-12 text-right pb-2 pt-2">
                            {this.props.item.next_action.is_mine &&
                            this.props.item.next_action.possible_actions.map((actionName,index)=>


                                <>




                                    {/*<div className="col-1">*/}
                                    {/*<p className={"text-bold text-left text-blue"}>{index+1}.</p>*/}

                                    {/*</div>*/}
                                    {/*<div className="col-6 pb-2 pt-2">*/}
                                    {/*<span className={"text-mute text-left "}>{item.step.stage}</span><br/>*/}
                                    {/*<span style={{fontSize:"18px"}} className={"text-bold text-left text-blue"}>{item.step.name}, {item.step.description}</span><br/>*/}
                                    {/*<span className={" text-left "}>Type: {item.step.type}</span><br/>*/}
                                    {/*<span className={" text-left "}>Creator: {item.creator_org_id}</span><br/>*/}
                                    {/*<span className={" text-left "}> Owner: {item.owner_org_id}</span>*/}

                                    {/*</div>*/}





                                    {/*{((actionName==="cancelled"&& item.creator_org_id === this.props.userDetail.orgId) || (actionName!=="cancelled")) &&*/}

                                    <button data-id={this.props.item._key} data-action={actionName}
                                            onClick={""}
                                            type="button"
                                            className={actionName==="accepted"?"shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border":
                                                actionName==="cancelled"?"shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border":
                                                    actionName==="rejected"?"shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border":
                                                        actionName==="declined"?"shadow-sm mr-2 btn btn-link  mt-2 mb-2 orange-btn-border":
                                                            actionName==="progress"?"shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border":
                                                                actionName==="complete"?"shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border":

                                                                    "shadow-sm mr-2 btn btn-link  mt-2 mb-2 green-btn-border"}

                                    >

                                        {actionName==="accepted" && "Accept"}
                                        {actionName==="cancelled" && "Cancel"}
                                        {actionName==="rejected" && "Reject"}
                                        {actionName==="declined" && "Decline"}
                                        {actionName==="confirmed" && "Confirm"}
                                        {actionName==="progress" && "Progress"}
                                        {actionName==="complete" && "Complete"}
                                    </button>
                                    {/*}*/}


                                </>)}



                        </div>

                    </div>

                </div>
            </div>




        </Link>
    </>





           <Modal
               size="lg"
               show={this.state.showProductEdit}
               onHide={this.showProductEdit}
               className={"custom-modal-popup popup-form"}
           >

               <div className="">
                   <button onClick={this.showProductEdit} className="btn-close close" data-dismiss="modal" aria-label="Close"><i className="fas fa-times"></i></button>
               </div>


               <ProductEditForm triggerCallback={(action)=>this.callBackSubmit(action)} isDuplicate={this.state.productDuplicate} productId={this.props.item&&this.props.item.product.product?this.props.item.product.product._key:this.props.item._key}/>


           </Modal>


{this.state.showProductHide  &&

         <div className={"container pl-5 mb-5 full-width-product-popup"}>

               <div className="row">
                   <div className="col-12">
                   <button onClick={this.showProductHide} className="btn-close close" data-dismiss="modal" aria-label="Close"><i className="fas fa-times"></i></button>
                   </div>
               </div>
             <div className="row">
                 <div className="col-12">

               <ProductDetail productId={this.props.item&&this.props.item.product.product?this.props.item.product.product._key:this.props.item._key}  history={this.props.history} hideRegister={true} />

                 </div>
             </div>

           </div>}



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
)(RequestReleaseItem);

