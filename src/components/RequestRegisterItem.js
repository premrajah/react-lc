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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from "@material-ui/core/styles/index";


class RequestRegisterItem extends Component {


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
            showProductEdit:false,
            productDuplicate:false,
            showProductHide:false,
            showPopUpInitiateAction:false,
            action:null,
            initiateAction:null,
            item:this.props.item,
            sites:[],
            site:null,
            siteSelected:null,
            fieldsSite: {},
            errorsSite: {},


        }


        this.actionSubmit=this.actionSubmit.bind(this)
        this.showPopUpInitiateAction=this.showPopUpInitiateAction.bind(this)
        this.getSites=this.getSites.bind(this)
        this.showSubmitSite=this.showSubmitSite.bind(this)
        this.getDetails=this.getDetails.bind(this)


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

    showPopUpInitiateAction(event) {

        this.setState({
            showPopUpInitiateAction: !this.state.showPopUpInitiateAction
        })


        this.setState({

            initiateAction:event.currentTarget.dataset.action
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


    handleValidationSite() {


        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }

        // if (!fields["others"]) {
        //     formIsValid = false;
        //     errors["others"] = "Required";
        // }


        if (!fields["address"]) {
            formIsValid = false;
            errors["address"] = "Required";
        }

        if (!fields["contact"]) {
            formIsValid = false;
            errors["contact"] = "Required";
        }



        if (!fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Required";
        }
        if ((fields["phone"])&&!this.phonenumber(fields["phone"])) {

            formIsValid = false;
            errors["phone"] = "Invalid Phone Number!";
        }



        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errorsSite: errors });
        return formIsValid;
    }


    handleChangeSite(field, e) {

        let fields = this.state.fieldsSite;
        fields[field] = e.target.value;
        this.setState({ fields: fields });

    }



    handleChange(field, e) {


        this.setState({ site:e.target.value });

    }

    handleSubmitSite = event => {


        this.setState({

            errorRegister:null
        })




        event.preventDefault();


        if(this.handleValidationSite()) {

            const form = event.currentTarget;





            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const email = data.get("email")
            const others = data.get("others")
            const name = data.get("name")
            const contact = data.get("contact")
            const address = data.get("address")
            const phone = data.get("phone")





            axios.put(baseUrl + "site",

                {site: {
                        "name": name,
                        "email": email,
                        "contact": contact,
                        "address": address,
                        "phone": phone,
                        "others": others
                    }

                }
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {

                    // this.toggleSite()
                    this.getSites()


                    this.showSubmitSite()


                    this.setState({

                        siteSelected:res.data.data
                    })


                }).catch(error => {






            });




        }
    }

    submitRegisterProduct = event => {



        this.setState({

            errorRegister:null
        })



        event.preventDefault();



        const form = event.currentTarget;





        this.setState({
            btnLoading: true
        })

        const data = new FormData(event.target);

        const site = data.get("site")





        axios.post(baseUrl + "register",

            {
                site_id: site,
                product_id: this.props.item.product._key,
            }
            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            })
            .then(res => {

                // this.toggleSite()
                // this.showRegister()

                this.setState({

                    showRegisterSuccess:true
                })



            }).catch(error => {


            this.setState({

                errorRegister:error.response.data.errors[0].message
            })

        });

    }

    actionSubmit(){



        var  data = {

            "id": this.state.item.registration._key,
            "new_stage": this.state.initiateAction,

        }



        axios.post(baseUrl + "register/stage",
            data

            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {

                this.getDetails()


                this.showPopUpInitiateAction()



            }).catch(error => {




            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });

    }



    componentWillMount() {

    }

    componentDidMount() {

        this.getSites()

    }


    getDetails() {


        axios.get(baseUrl + "register/"+this.state.item.registration._key,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

                var responseData = response.data;

                console.log(responseData)

                this.setState({
                    item:responseData.data
                })


            },
            (error) => {


            }
        );

    }





    render() {

        const classes = withStyles();


        return (
            <>
                {this.state.item && <>

                    <div   className="row no-gutters justify-content-center mt-4 mb-4 ">


                        <div className={"col-2 "}>

                            {this.state.images.length>0? <img className={"img-fluid img-list"} src={this.state.images[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}

                        </div>
                        <div className={"col-5 pl-2  content-box-listing"}>
                            <p style={{ fontSize: "18px" }} className=" mb-1">{this.state.item.product.product.name}</p>
                            <p style={{ fontSize: "16px" }} className=" mb-1 text-caps">{this.state.item.registration.stage}</p>

                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.state.item.product.product.purpose}</p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.state.item.product.product.category}, {this.state.item.product.product.type}, {this.state.item.product.product.state} </p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1"> {this.state.item.product.product.volume} {this.state.item.product.product.units}</p>

                            {this.state.item.search_ids && <p style={{ fontSize: "16px" }} className="text-mute mb-1 bottom-tag-p">{this.state.item.search_ids.length} Searches</p>}
                            {this.state.item.sub_product_ids&&this.state.item.sub_product_ids.length>0 && <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.state.item.sub_product_ids.length} Sub Products</p>}

                        </div>
                        <div style={{ textAlign: "right" }} className={"col-5"}>

                            <p className={"text-gray-light small"}>  {moment(this.state.item.product.product._ts_epoch_ms).format("DD MMM YYYY")} </p>


                            <div className="row  pb-4 pb-4 mb-4">
                                <div className="col-12 text-right pb-2 pt-2">
                                    {this.state.item.next_action.is_mine &&
                                    this.state.item.next_action.possible_actions.map((actionName,index)=>


                                        <>


                                            <button data-id={this.state.item.registration_key} data-action={actionName}
                                                    onClick={this.showPopUpInitiateAction}
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

                    <Modal className={"loop-popup"}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered show={this.state.showPopUpInitiateAction} onHide={this.showPopUpInitiateAction} animation={false}>
                        <ModalBody>

                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <p  style={{textTransform:"uppercase"}} className={"text-bold"}> {this.state.initiateAction}</p>
                                    <p>Are you sure you want to {this.state.initiateAction} ? </p>
                                </div>
                            </div>




                            <div className={"row justify-content-center"}>

                                <div className={"col-12 text-center mt-2"}>

                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{textAlign:"center"}}>

                                            <button onClick={this.actionSubmit} style={{minWidth:"120px"}}  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Yes</button>


                                        </div>
                                        <div className={"col-6"} style={{textAlign:"center"}}>
                                            <p onClick={this.showPopUpInitiateAction} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</p>
                                        </div>
                                    </div>

                                </div>

                            </div>



                        </ModalBody>

                    </Modal>

                </>}

            </>
        );
    }
}



const mapStateToProps = state => {
    return {
        loginError: state.loginError,
        // cartthis.state.items: state.cartthis.state.items,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartthis.state.item : state.abondonCartthis.state.item,
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
)(RequestRegisterItem);

