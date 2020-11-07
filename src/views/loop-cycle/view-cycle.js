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
            showPopUpTrackingNumber: false
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
        // this.enterTracking=this.enterTracking.bind(this)

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

        // alert("called")
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



            // alert("username"+ username)


            axios.post(baseUrl + "loop/" + this.slug + "/assign_logistics/" + username,
                {}, {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
            )
                .then(res => {

                    console.log(res.data.content)

                    this.setState({

                        showPopUpLogistics: !this.state.showPopUpLogistics
                    })

                    this.getResources()




                }).catch(error => {



                    console.log("loop confirm error found ")
                    console.log(error.response.data)


                    this.setState({

                        showPopUpLogistics: false,
                        loopError: error.response.data.content.message
                    })

                });






        } else {


            // alert("invalid")
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



        // alert("username"+ username)


        axios.post(baseUrl + "loop/" + this.slug + "/update_tracking/" + username,
            {}, {
            headers: {
                "Authorization": "Bearer " + this.props.userDetail.token
            }
        }
        )
            .then(res => {

                console.log(res.data.content)

                this.setState({

                    showPopUpTrackingNumber: !this.state.showPopUpTrackingNumber
                })

                this.getResources()




            }).catch(error => {



                console.log("loop confirm error found ")
                console.log(error.response.data)


                this.setState({

                    showPopUpTrackingNumber: false,
                    loopError: error.response.data.content.message
                })

            });



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

                console.log(res.data.content)

                this.setState({

                    showPopUp: true
                })

                this.getResources()




            }).catch(error => {



                console.log("loop confirm error found ")
                console.log(error.response.data)


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

                console.log(res.data.content)

                this.setState({

                    showPopUp: true
                })

                this.getResources()




            }).catch(error => {



                console.log("loop confirm error found ")
                console.log(error.response.data)


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

                console.log(res.data.content)

                this.setState({

                    showPopUp: true
                })

                this.getResources()


            }).catch(error => {



                console.log("loop confirm error found ")
                console.log(error.response.data)


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

                console.log(res.data.content)

                this.setState({

                    showPopUp: true
                })

                this.getResources()

            }).catch(error => {

                console.log("loop confirm error found ")
                console.log(error.response.data)


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

                console.log(res.data.content)

                this.setState({

                    showPopUp: true
                })

                this.getResources()

            }).catch(error => {

                console.log("loop confirm error found ")
                console.log(error.response.data)


                this.setState({

                    showPopUp: true,
                    loopError: error.response.data.content.message
                })

            });


    }


    declineOffer() {




        axios.post(baseUrl + "loop/" + this.slug + "/cancel",
            {}, {
            headers: {
                "Authorization": "Bearer " + this.props.userDetail.token
            }
        }
        )
            .then(res => {

                console.log(res.data.content)

                this.setState({

                    showPopUp: true
                })

                this.getResources()




            }).catch(error => {



                console.log("loop confirm error found ")
                console.log(error.response.data)


                this.setState({

                    showPopUp: true,
                    loopError: error.response.data.content.message
                })

            });

    }


    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
    }



    getResources() {

        axios.get(baseUrl + "loop/" + this.slug,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

            var response = response.data;
            console.log("loop detail response")
            console.log(response)


            // alert(response.content.producer.org.id+ response.content.state )

            this.setState({

                item: response.content
            })

        },
            (error) => {

                var status = error.response.status

                console.log("lop error")

                console.log(error)


            }
        );

    }



    componentWillMount() {

    }

    componentDidMount() {

        this.getResources()

    }

    intervalJasmineAnim



    render() {

        const classes = withStyles();
        const classesBottom = withStyles();


        return (
            <div>

                <Sidebar />

                <div className="accountpage">
                    <HeaderDark />

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
                                                <p className={"green-text text-heading"}>@{this.state.item.tags}
                                                </p>

                                            </div>
                                            <div className="col-12 mt-2">
                                                <h5 className={"blue-text text-heading"}>{this.state.item.name}
                                                </h5>
                                            </div>
                                        </div>


                                        <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                                            <div className="col-auto">
                                                <p style={{ fontSize: "16px" }} className={"text-gray-light "}>{this.state.item.description}
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
                                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.category} ></p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.type}</p>
                                            </div>
                                        </div>
                                        <div className="row  justify-content-start search-container  pb-4">
                                            <div className={"col-1"}>
                                                <img className={"icon-about"} src={AmountIcon} alt="" />
                                            </div>
                                            <div className={"col-auto"}>

                                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Amount</p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1"> {this.state.item.volume} {this.state.item.units}</p>
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

                                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Required by </p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">
                                                    <Moment unix  >
                                                        {this.state.item.availableFrom}
                                                    </Moment>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row  justify-content-start search-container  pb-4">
                                            <div className={"col-1"}>
                                                <img className={"icon-about"} src={MarkerIcon} alt="" />
                                            </div>
                                            <div className={"col-auto"}>

                                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Delivery From</p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">Mapledown, Which Hill Lane,</p>
                                                <p style={{ fontSize: "18px" }} className="  mb-1">Woking, Surrey, GU22 0AH</p>
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
                                                        {/*<img src={TescoImg} alt="" />*/}

                                                        <span className={"word-user-sellor"}>
                                                            M


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
                                                                        className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                                                        Accept Offer

                                            </button>
                                                                </div>

                                                                <div className="col-auto">

                                                                    <button onClick={this.declineOffer} type="button"
                                                                        className="shadow-sm mr-2 blue-btn-border btn btn-link  mt-2 mb-2 btn-blue">

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

                    {this.state.item.id && (this.props.userDetail.orgId === this.state.item.consumer.org.id) && this.state.item.state === "accepted" &&
                        <>

                            <CssBaseline />

                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                <Toolbar>

                                    <div className="row  justify-content-center search-container "
                                        style={{ margin: "auto" }}>

                                        <div className="col-auto">
                                            <button onClick={this.consumerConfirmOffer} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                Confirm Offer

                                        </button>
                                        </div>

                                        <div className="col-auto">

                                            <button onClick={this.declineOffer} type="button"
                                                className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-green">

                                                Reject Offer

                                        </button>
                                        </div>
                                    </div>


                                </Toolbar>
                            </AppBar>

                        </>

                    }


                </React.Fragment>


                <React.Fragment>


                    {this.state.item && this.state.item.state === "confirmed" &&

                        <>
                            <CssBaseline />

                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                <Toolbar>
                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                        <div className="col-auto">
                                            <button onClick={this.showPopUpLogistics} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                Assign Logistics

                                        </button>
                                        </div>


                                        <div className="col-auto">
                                            <button onClick={this.declineOffer} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                Cancel Cycle

                                        </button>
                                        </div>


                                    </div>





                                </Toolbar>
                            </AppBar>



                            <Modal className={"loop-popup"} size="lg"
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
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a email address of logistics provider :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChange.bind(this, "email")} />

                                                    {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}
                                                </div>
                                                <div className={"col-12 mt-2"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>


                                                        Submit
                                                    </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>



                            <Modal className={"loop-popup"} size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered show={this.state.showPopUpTrackingNumber} onHide={this.showPopUpTrackingNumber} animation={false}>

                                <ModalBody>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-4"}>
                                            <img className={"ring-pop-pup"} src={GrayLoop} alt="" />
                                        </div>
                                    </div>


                                    <>
                                        <div className={"row"}>
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a tracking :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Tracking Number" variant="outlined" fullWidth={true} name={"tracking"} type={"tracking"} />

                                                </div>
                                                <div className={"col-12"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>

                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>

                        </>}



                </React.Fragment>




                <React.Fragment>


                    {this.state.item && this.state.item.state === "agreed" &&

                        <>
                            <CssBaseline />

                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                <Toolbar>
                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                        {this.state.item.id && (this.props.userDetail.orgId === this.state.item.logistics.org.id) && this.state.item.state === "agreed" &&

                                            <div className="col-auto">
                                                <button onClick={this.showPopUpTrackingNumber} type="button"
                                                    className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                    Enter Tracking Number

                                        </button>
                                            </div>

                                        }


                                        <div className="col-auto">
                                            <button onClick={this.declineOffer} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                Cancel Cycle

                                        </button>
                                        </div>


                                    </div>





                                </Toolbar>
                            </AppBar>



                            <Modal className={"loop-popup"} size="lg"
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
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a email address of logistics provider :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChange.bind(this, "email")} />

                                                    {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}
                                                </div>
                                                <div className={"col-12 mt-2"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>


                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>



                            <Modal className={"loop-popup"} size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered show={this.state.showPopUpTrackingNumber} onHide={this.showPopUpTrackingNumber} animation={false}>

                                <ModalBody>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-4"}>
                                            <img className={"ring-pop-pup"} src={GrayLoop} alt="" />
                                        </div>
                                    </div>


                                    <>
                                        <div className={"row"}>
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a tracking :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmitTracking}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Tracking Number" variant="outlined" fullWidth={true} name={"tracking"} type={"tracking"} />

                                                </div>
                                                <div className={"col-12"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>

                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>

                        </>}



                    {this.state.item && this.state.item.state === "progress" &&

                        <>
                            <CssBaseline />

                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                <Toolbar>
                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                        {this.state.item.id && (this.props.userDetail.orgId === this.state.item.logistics.org.id) && this.state.item.state === "progress" &&

                                            <div className="col-auto">
                                                <button onClick={this.orderDelivered} type="button"
                                                    className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                    Delivered

                                        </button>
                                            </div>

                                        }


                                        <div className="col-auto">
                                            <button onClick={this.declineOffer} type="button"
                                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                Cancel Cycle

                                        </button>
                                        </div>


                                    </div>





                                </Toolbar>
                            </AppBar>



                            <Modal className={"loop-popup"} size="lg"
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
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a email address of logistics provider :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChange.bind(this, "email")} />

                                                    {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}
                                                </div>
                                                <div className={"col-12 mt-2"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>


                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>



                            <Modal className={"loop-popup"} size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered show={this.state.showPopUpTrackingNumber} onHide={this.showPopUpTrackingNumber} animation={false}>

                                <ModalBody>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-4"}>
                                            <img className={"ring-pop-pup"} src={GrayLoop} alt="" />
                                        </div>
                                    </div>


                                    <>
                                        <div className={"row"}>
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a tracking :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmitTracking}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Tracking Number" variant="outlined" fullWidth={true} name={"tracking"} type={"tracking"} />

                                                </div>
                                                <div className={"col-12"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>

                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>

                        </>}




                    {this.state.item && this.state.item.state === "delivered" &&

                        <>
                            <CssBaseline />

                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                <Toolbar>
                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                        {this.state.item.id && (this.props.userDetail.orgId === this.state.item.consumer.org.id) && this.state.item.state === "delivered" &&

                                            <div className="col-auto">
                                                <button onClick={this.orderReceived} type="button"
                                                    className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                    Received

                                        </button>
                                            </div>

                                        }


                                        {/*<div className="col-auto">*/}
                                        {/*<button onClick={this.declineOffer} type="button"*/}
                                        {/*className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">*/}
                                        {/*Cancel Cycle*/}

                                        {/*</button>*/}
                                        {/*</div>*/}


                                    </div>





                                </Toolbar>
                            </AppBar>



                            <Modal className={"loop-popup"} size="lg"
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
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a email address of logistics provider :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChange.bind(this, "email")} />

                                                    {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}
                                                </div>
                                                <div className={"col-12 mt-2"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>


                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>



                            <Modal className={"loop-popup"} size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered show={this.state.showPopUpTrackingNumber} onHide={this.showPopUpTrackingNumber} animation={false}>

                                <ModalBody>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-4"}>
                                            <img className={"ring-pop-pup"} src={GrayLoop} alt="" />
                                        </div>
                                    </div>


                                    <>
                                        <div className={"row"}>
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a tracking :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmitTracking}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Tracking Number" variant="outlined" fullWidth={true} name={"tracking"} type={"tracking"} />

                                                </div>
                                                <div className={"col-12"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>

                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>

                        </>}




                    {this.state.item && this.state.item.state === "received" &&

                        <>
                            <CssBaseline />

                            <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                <Toolbar>
                                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                        {this.state.item.id && (this.props.userDetail.orgId === this.state.item.producer.org.id) && this.state.item.state === "received" &&

                                            <div className="col-auto">
                                                <button onClick={this.orderClose} type="button"
                                                    className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">
                                                    Close Cycle

                                        </button>
                                            </div>

                                        }


                                        {/*<div className="col-auto">*/}
                                        {/*<button onClick={this.declineOffer} type="button"*/}
                                        {/*className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">*/}
                                        {/*Cancel Cycle*/}

                                        {/*</button>*/}
                                        {/*</div>*/}


                                    </div>





                                </Toolbar>
                            </AppBar>



                            <Modal className={"loop-popup"} size="lg"
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
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a email address of logistics provider :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmit}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChange.bind(this, "email")} />

                                                    {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}
                                                </div>
                                                <div className={"col-12 mt-2"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>


                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>



                            <Modal className={"loop-popup"} size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered show={this.state.showPopUpTrackingNumber} onHide={this.showPopUpTrackingNumber} animation={false}>

                                <ModalBody>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-4"}>
                                            <img className={"ring-pop-pup"} src={GrayLoop} alt="" />
                                        </div>
                                    </div>


                                    <>
                                        <div className={"row"}>
                                            <div className={"col-12"}>
                                                <p className={"text-bold"}>Please provide a tracking :</p>
                                                {/*A cycle has been created. Send a message to the seller to arrange a delivery time.*/}
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <form onSubmit={this.handleSubmitTracking}>
                                                <div className={"col-12"}>
                                                    <TextField id="outlined-basic" label="Tracking Number" variant="outlined" fullWidth={true} name={"tracking"} type={"tracking"} />

                                                </div>
                                                <div className={"col-12"}>


                                                    <button type={"submit"} className={"btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn"}>

                                                        Submit
                                                </button>

                                                </div>
                                            </form>
                                        </div>
                                    </>



                                </ModalBody>

                            </Modal>

                        </>}

                </React.Fragment>


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
