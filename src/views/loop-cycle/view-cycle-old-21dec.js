import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Link } from "react-router-dom";
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import ListIcon from '../../img/icons/list.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import PaperImg from '../../img/paper-big.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import LoopDetail from './LoopDetail'
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import { Modal, ModalBody } from 'react-bootstrap';
import GrayLoop from '../../img/icons/gray-loop.png';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import Moment from 'react-moment';
import { withStyles } from "@material-ui/core/styles/index";
import moment from "moment/moment";





class ViewCycle extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: {},
            fields: {},
            errors: {},
            showPopUpLogistics: false,
            showPopUpTrackingNumber: false,
            showPrompt:false,
            logisticsError:false,
            logisticsErrorMsg:"",
        }

        this.slug = props.match.params.slug

        this.getResources = this.getResources.bind(this)
        this.confirmOffer = this.confirmOffer.bind(this)
        this.consumerConfirmOffer = this.consumerConfirmOffer.bind(this)
        this.declineOffer = this.declineOffer.bind(this)
        this.orderDelivered = this.orderDelivered.bind(this)
        this.orderReceived = this.orderReceived.bind(this)
        this.orderClose = this.orderClose.bind(this)
        this.showPopUpLogistics = this.showPopUpLogistics.bind(this)
        this.showPopUpTrackingNumber = this.showPopUpTrackingNumber.bind(this)
        this.proceedCancel = this.proceedCancel.bind(this)


    }



    showPopUpTrackingNumber() {



        this.setState({
            showPopUpTrackingNumber: !this.state.showPopUpTrackingNumber
        })

    }


    showPopUpLogistics() {

        this.setState({
            showPopUpLogistics: !this.state.showPopUpLogistics
        })

    }

    handleValidation() {


        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        // //Name
        // if(!fields["password"]){
        //     formIsValid = false;
        //     errors["password"] = "Required";
        // }


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

        this.setState({ errors: errors });
        return formIsValid;
    }



    handleChange(field, e) {

        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        // this.handleValidationSubmitGreen()
    }


    handleSubmit = event => {

        event.preventDefault();


        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const username = data.get("email")



            axios.post(baseUrl + "loop/" + this.slug + "/assign_logistics/" + username,
                {}, {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then(res => {



                    this.setState({

                        showPopUpLogistics: !this.state.showPopUpLogistics
                    })

                    this.getResources()


                }).catch(error => {





                this.setState({

                    logisticsError: true,
                    logisticsErrorMsg: error.response.data.content.message
                })

            });


        } else {



        }


    }



    handleSubmitTracking = event => {

        event.preventDefault();


        const form = event.currentTarget;
        //
        // if (this.handleValidation()){
        //     this.setState({
        //         btnLoading: true
        //     })

        const data = new FormData(event.target);

        const username = data.get("tracking")






        axios.post(baseUrl + "loop/" + this.slug + "/update_tracking/" + username,
            {}, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUpTrackingNumber: !this.state.showPopUpTrackingNumber
                })

                this.getResources()




            }).catch(error => {







            this.setState({

                showPopUpTrackingNumber: false,
                loopError: error.response.data.content.message
            })

        });




        //
        // }else {
        //
        //
        //
        // }


    }


    confirmOffer() {





        axios.post(baseUrl + "loop/" + this.slug + "/producer_accept",
            {}, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })

                this.getResources()




            }).catch(error => {







            this.setState({

                showPopUp: true,
                loopError: error.response.data.content.message
            })

        });


    }


    consumerConfirmOffer() {



        axios.post(baseUrl + "loop/" + this.state.item.id + "/consumer_accept",
            {}, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })

                this.getResources()




            }).catch(error => {







            this.setState({

                showPopUp: true,
                loopError: error.response.data.content.message
            })

        });


    }




    orderDelivered() {



        axios.post(baseUrl + "loop/" + this.state.item.id + "/delivered",
            {}, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })

                this.getResources()


            }).catch(error => {







            this.setState({

                showPopUp: true,
                loopError: error.response.data.content.message
            })

        });


    }



    orderReceived() {

        axios.post(baseUrl + "loop/" + this.state.item.id + "/received",
            {}, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })

                this.getResources()

            }).catch(error => {





            this.setState({

                showPopUp: true,
                loopError: error.response.data.content.message
            })

        });


    }



    orderClose() {

        axios.post(baseUrl + "loop/" + this.state.item.id + "/close",
            {}, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })

                this.getResources()

            }).catch(error => {





            this.setState({

                showPopUp: true,
                loopError: error.response.data.content.message
            })

        });


    }




    proceedCancel(){

        axios.post(baseUrl + "loop/" + this.slug + "/cancel",
            {}, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {



                this.setState({

                    showPopUp: true
                })

                this.getResources()




            }).catch(error => {







            this.setState({

                showPopUp: true,
                loopError: error.response.data.content.message
            })

        });



    }



    declineOffer() {


        this.setState({
            showPrompt: !this.state.showPrompt
        })



    }


    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {

        this.props.history.go(+1)
    }



    getResources() {


        axios.get(baseUrl + "cycle/" + this.slug+"/expand",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

                var response = response.data;






                this.setState({

                    item: response.data
                })

            },
            (error) => {






            }
        );

    }



    componentWillMount() {



    }

    interval

    componentDidMount() {
        this.getResources()
        this.interval = setInterval(() => {

            this.getResources()


        }, 10000);

    }

    componentWillUnmount() {

        clearInterval(this.interval)
    }




    render() {

        const classes = withStyles();
        const classesBottom = withStyles();


        return (
            <div className={"pb-5 mb-5"}>

                <Sidebar />
                <HeaderDark />

                <div className=" ">


                    {this.state.item && this.state.item.id &&
                    <>
                        {this.state.item.state === "created" ?
                            <>
                                <div className="container-fluid " style={{ padding: "0" }}>


                                    <div className="row no-gutters  justify-content-center">

                                        <div className="floating-back-icon" style={{ margin: "auto" }}>

                                            <NavigateBefore onClick={this.handleBack} style={{ fontSize: 32, color: "white" }} />
                                        </div>


                                        <div className="col-auto ">
                                            <img className={"img-fluid"} src={PaperImg} alt="" />

                                        </div>
                                    </div>
                                </div>
                                <div className="container ">
                                    <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                                        <div className="col-12">
                                            <p className={"green-text text-heading"}>@{this.state.item.resource.tags}
                                            </p>

                                        </div>
                                        <div className="col-12 mt-2">
                                            <h5 className={"blue-text text-heading"}>{this.state.item.resource.name}
                                            </h5>
                                        </div>
                                    </div>


                                    <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                                        <div className="col-auto">
                                            <p style={{ fontSize: "16px" }} className={"text-gray-light "}>{this.state.item.resource.description}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="row justify-content-start pb-4 pt-3 ">
                                        <div className="col-auto">
                                            <h6 className={""}>
                                                Item Details
                                            </h6>

                                        </div>
                                    </div>

                                    <div className="row no-gutters justify-content-start mt-4 mb-4 listing-row-border pb-4">

                                        {this.state.item && this.state.item.id && <div className={"col-8 content-box-listing"}>
                                            <>
                                                <h5 style={{ fontSize: "18px" }} className=" mb-1">{this.state.item.resource.name}</h5>
                                                <p style={{ fontSize: "18px" }} className=" mb-1">{this.state.item.from.org_id}  →  {this.state.item.to.org_id}</p>
                                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.state.item.resource.category}</p>
                                                <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.state.item.resource.state} / {this.state.item.resource.volume} {this.state.item.resource.units}</p>
                                            </>

                                        </div>}
                                        <div style={{ textAlign: "right" }} className={"col-4"}>
                                            <p className={"green-text text-mute small"} >
                                                {this.state.item.state}</p>
                                        </div>
                                    </div>



                                </div>
                                <div className={"container"}>

                                    <div className="row  justify-content-start search-container  pb-4">
                                        <div className={"col-1"}>
                                            <img className={"icon-about"} src={ListIcon} alt="" />
                                        </div>
                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Category</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.resource.category} ></p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.resource.type}</p>
                                        </div>
                                    </div>
                                    <div className="row  justify-content-start search-container  pb-4">
                                        <div className={"col-1"}>
                                            <img className={"icon-about"} src={AmountIcon} alt="" />
                                        </div>
                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Amount</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1"> {this.state.item.search.volume} {this.state.item.search.units}</p>
                                        </div>
                                    </div>


                                    <div className="row  justify-content-start search-container  pb-4">
                                        <div className={"col-1"}>
                                            <img className={"icon-about"} src={StateIcon} alt="" />
                                        </div>
                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">State</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.state} </p>
                                        </div>
                                    </div>

                                    <div className="row  justify-content-start search-container  pb-4">
                                        <div className={"col-1"}>
                                            <img className={"icon-about"} src={CalenderIcon} alt="" />
                                        </div>
                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Required From </p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">



                                                {moment(this.state.item.resource.availableFrom.value).format("DD MMM YYYY")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row  justify-content-start search-container  pb-4">
                                        <div className={"col-1"}>
                                            <img className={"icon-about"} src={CalenderIcon} alt="" />
                                        </div>
                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Required by </p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">



                                                {moment(this.state.item.resource.expiry.value).format("DD MMM YYYY")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row  justify-content-start search-container  pb-4">
                                        <div className={"col-1"}>
                                            <img className={"icon-about"} src={MarkerIcon} alt="" />
                                        </div>
                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Delivery From</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.resource.site && this.state.item.resource.site.name}</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.resource.site && this.state.item.resource.site.address}</p>
                                        </div>
                                    </div>

                                    <div className="container container-divider">
                                        <div className="row">
                                        </div>
                                    </div>
                                    <div className="container mt-4 mb-5 pb-5 ">

                                        <div className="row no-gutters mb-5">
                                            <div className="col-12 mb-4">
                                                <h5 className="mb-1">About the seller  </h5>
                                            </div>
                                            <div className="col-auto ">
                                                <figure className="avatar avatar-60 border-0">

                                                        <span className={"word-user-sellor"}>

                                                   {this.state.item.producer.org.name.substr(0,2)}

                                                        </span>

                                                </figure>
                                            </div>
                                            <div className="col pl-2 align-self-center">
                                                <div className="row no-gutters">
                                                    <div className="col-12">


                                                        <p style={{ fontSize: "18px" }} className=" ">Seller Company</p>
                                                        <p style={{ fontSize: "18px" }} className="">48 items listed | 4 cycles</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <React.Fragment>

                                        {this.state.item.id && (this.props.userDetail.orgId === this.state.item.producer.org.id) && this.state.item.state === "created" &&
                                        <>

                                            <CssBaseline />

                                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                                <Toolbar>

                                                    <div className="row  justify-content-center search-container "
                                                         style={{ margin: "auto" }}>

                                                        <div className="col-auto">
                                                            <button onClick={this.confirmOffer} type="button"
                                                                    className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                                                Accept Offer

                                                            </button>
                                                        </div>

                                                        <div className="col-auto">

                                                            <button onClick={this.declineOffer} type="button"
                                                                    className="shadow-sm mr-2 green-btn-border btn btn-link  mt-2 mb-2 ">

                                                                Reject Offer

                                                            </button>
                                                        </div>
                                                    </div>


                                                </Toolbar>
                                            </AppBar>

                                        </>

                                        }


                                    </React.Fragment>



                                </div></>

                            : <LoopDetail loop={this.state.item} />

                        }

                    </>}

                </div>



                        <React.Fragment>



                        <CssBaseline />

                        <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                            <Toolbar>

                                <div className="row  justify-content-center search-container "
                                     style={{ margin: "auto" }}>

                                    <div className="col-auto">


                                        {this.state.item.id && this.state.item.show && this.state.item.state === "created" &&

                                        <button onClick={this.confirmOffer} type="button"
                                                className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                            Accept Offer

                                        </button>

                                        }
                                        {this.state.item.id && this.state.item.show && this.state.item.state === "accepted" &&

                                        <button onClick={this.consumerConfirmOffer} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                            Confirm Offer

                                        </button>

                                        }

                                        {this.state.item && this.state.item.state === "confirmed" && this.state.item.show &&


                                        <button onClick={this.showPopUpLogistics} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                            Assign Logistics

                                        </button>

                                        }

                                        {this.state.item.id &&  this.state.item.state === "agreed" && this.state.item.show &&


                                            <button onClick={this.showPopUpTrackingNumber} type="button"
                                                    className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                Enter Tracking Number

                                            </button>


                                        }


                                        {this.state.item && this.state.item.state === "progress" && this.state.item.show &&


                                        <button onClick={this.orderDelivered} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                            Delivered

                                        </button>
                                        }


                                        {this.state.item && this.state.item.state === "delivered" && this.state.item.show &&

                                        <button onClick={this.orderReceived} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                            Received

                                        </button>}


                                        {this.state.item && this.state.item.state == "received" && this.state.item.show &&

                                        <button onClick={this.orderClose} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                            Close Cycle

                                        </button>


                                        }

                                            </div>

                                    {this.state.item.state != "received"  && this.state.item.state != "closed"
                                    && (this.state.item.producer&&this.state.item.producer.org.id == this.props.userDetail.orgId ||this.state.item.consumer&&this.state.item.consumer.org.id == this.props.userDetail.orgId )&&

                                    <div className="col-auto">

                                        <button onClick={this.declineOffer} type="button"
                                                className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-green">

                                            Reject Offer

                                        </button>
                                    </div>
                                    }
                                </div>


                            </Toolbar>
                        </AppBar>


                </React.Fragment>



                <Modal className={"loop-popup"}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered show={this.state.showPopUpLogistics} onHide={this.showPopUpLogistics} animation={false}>

                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-4"}>
                                <img className={"ring-pop-pup"} src={GrayLoop} alt="" />
                            </div>
                        </div>


                        <>
                            <div className={"row"}>
                                <div className={"col-12 text-center"}>
                                    <h5 className={"text-bold text-center"}>Please provide a email address of logistics provider :</h5>
                                    {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                </div>
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div className={"row justify-content-center"}>

                                    <div className={"col-12"}>

                                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChange.bind(this, "email")} />
                                        {this.state.logisticsError && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.logisticsErrorMsg}</span>}

                                    </div>
                                    <div className={"col-12 mt-2"}>


                                        <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>


                                            Submit
                                        </button>

                                    </div>

                                </div>
                            </form>
                        </>



                    </ModalBody>

                </Modal>

                <Modal className={"loop-popup"}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered show={this.state.showPopUpTrackingNumber} onHide={this.showPopUpTrackingNumber} animation={false}>

                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-4"}>
                                <img className={"ring-pop-pup"} src={GrayLoop} />
                            </div>
                        </div>


                        <>
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <h5 className={"text-bold text-center"}>Please provide a tracking number:</h5>
                                    {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                </div>
                            </div>
                            <form onSubmit={this.handleSubmitTracking}>
                                <div className={"row justify-content-center"}>

                                    <div className={"col-12 text-center"}>
                                        <TextField id="outlined-basic" label="Tracking Number" variant="outlined" fullWidth={true} name={"tracking"} type={"tracking"} />

                                    </div>
                                    <div className={"col-12 text-center mt-2"}>


                                        <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>

                                            Submit
                                        </button>

                                    </div>

                                </div>
                            </form>
                        </>



                    </ModalBody>

                </Modal>

                <Modal className={"loop-popup"}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered show={this.state.showPrompt} onHide={this.declineOffer} animation={true}>

                        <ModalBody>

                            <>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-12"} style={{textAlign:"center"}}>
                                        <h5 className={"text-bold"}>Are you sure you want to proceed?</h5>
                                        {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                    </div>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className={"row justify-content-center"}>


                                        <div className={"row"}>
                                            <div className={"col-6 mt-2"}>


                                                <button onClick={this.declineOffer} type={"submit"} className={"green-btn-border btn btn-default btn-lg btn-rounded shadow btn-block "}>


                                                    Cancel
                                                </button>

                                            </div>
                                            <div className={"col-6 mt-2"}>


                                                <button onClick={this.proceedCancel} type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block "}>

                                                    Yes
                                                </button>

                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </>



                        </ModalBody>

                    </Modal>






                {false &&



                <div className={"row"}>

                    <div className="col-auto">

                        <button  onClick={this.showPopUp} type="button" className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                            Add Step
                        </button>

                    </div>




                    <Modal className={"loop-popup"}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered show={this.state.showPopUp} onHide={this.showPopUp} animation={false}>

                        <ModalBody>
                            <div className={"row justify-content-center"}>
                                <div className={"col-4 text-center"}>
                                    <img className={"ring-pop-pup"} src={GrayLoop} alt=""/>
                                </div>
                            </div>

                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <p className={"text-bold"}>Make an offer</p>
                                    <p>   Make an offer</p>
                                </div>
                            </div>




                            <form onSubmit>
                                <div className={"row justify-content-center"}>

                                    <div className={"col-12 text-center"}>
                                        <TextField id="outlined-basic" label="Offer Price" variant="outlined" fullWidth={true} name={"price"} type={"number"} />

                                    </div>

                                    <div className={"col-12 text-center"}>
                                        <TextField id="outlined-basic" label="Offer Price" variant="outlined" fullWidth={true} name={"price"} type={"number"} />

                                    </div>

                                    <div className={"col-12 text-center"}>
                                        <TextField id="outlined-basic" label="Offer Price" variant="outlined" fullWidth={true} name={"price"} type={"number"} />

                                    </div>


                                    <div className={"col-12 text-center mt-2"}>


                                        <div className={"row justify-content-center"}>
                                            <div className={"col-6"} style={{textAlign:"center"}}>

                                                <button  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Submit </button>


                                            </div>
                                            <div className={"col-6"} style={{textAlign:"center"}}>
                                                <p onClick={this.showPopUp} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</p>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </form>

                        </ModalBody>

                    </Modal>






                </div>



                }





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

function BottomAppBar(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>
                        <div className="col-auto">

                            <Link to={"/message-seller/" + props.slug} type="button" className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                Accept
                            </Link>

                        </div>
                        <div className="col-auto">

                            <Link to={"/make-offer/" + props.slug} type="button"
                                  className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                Reject

                            </Link>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


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
)(ViewCycle);
