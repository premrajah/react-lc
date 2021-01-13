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
import CycleDetail from './CycleDetail'
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
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';





class ViewCycle extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            fields: {},
            errors: {},
            showPopUpLogistics: false,
            showPopUpTrackingNumber: false,
            showPrompt:false,
            logisticsError:false,
            logisticsErrorMsg:"",
            showPopUpStep:false,
            orgs:[],
            stepStages: ["created" , "accepted" ,"progress",  "completed", "confirmed"],
            steps: ["transport" , "processing" ,"cleaning"],
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
        this.showStep = this.showStep.bind(this)
        this.showPopUpTrackingNumber = this.showPopUpTrackingNumber.bind(this)
        this.proceedCancel = this.proceedCancel.bind(this)
        this.updateStep=this.updateStep.bind(this)
        this.deliverCycle=this.deliverCycle.bind(this)


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


    showStep() {

        this.setState({
            showPopUpStep: !this.state.showPopUpStep
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

                    console.log(res.data.content)

                    this.setState({

                        showPopUpLogistics: !this.state.showPopUpLogistics
                    })

                    this.getResources()


                }).catch(error => {


                console.log("loop confirm error found ")
                console.log(error.response.data)

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
    
    
    getOrgIdOfOtherCompany(){
        
        
        
        if (this.state.item.sender._id!=this.props.userDetail.orgid){


            return this.state.item.sender._id
        }else{

            return this.state.item.receiver._id

        }
        
}
    
    handleSubmitStep = event => {

        event.preventDefault();


        const form = event.currentTarget;
       
        const data = new FormData(event.target);

        const name = data.get("name")
        const description = data.get("description")
        const type = data.get("type")
        const notes = [data.get("note")]






        var dataStep= {
            "step": {
                "name": name,
                "description": description,
                "type":  type,
                // "predecessor": null,
                "notes": notes
            },
            "cycle_id": this.slug,
            "org_id": data.get("org")

        }



        console.log(dataStep)
        axios.put(baseUrl + "step",dataStep

       , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {

                console.log(res.data.data)

                this.setState({

                    showPopUpStep: !this.state.showPopUpStep
                })

                this.getResources()




            }).catch(error => {


            console.log("cycle step error")
            console.log(error)



        });


    }




    updateStep(event) {



        var action=event.currentTarget.dataset.action

        var stepId=event.currentTarget.dataset.id


        var data={
            "step_id": stepId,
            "new_stage": action,
        }

        console.log("update step error")
        console.log(data)

        axios.post(baseUrl + "step/stage",data
            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {

                console.log(res.data.data)

                // this.setState({
                //
                //     showPopUp: true
                // })

                this.getResources()


            }).catch(error => {

            console.log("step update error found ")
            console.log(error)

            //
            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

        });


    }


    deliverCycle(event) {




        var action=event.currentTarget.dataset.action

        // if (this.state.item&&this.state.item.steps[0].step.stage==="created"){
        //
        //     action="accepted"
        //
        // }
        // else if (this.state.item&&this.state.item.steps[0].step.stage==="accepted"){
        //
        //     action="progress"
        //
        // }
        // else if (this.state.item&&this.state.item.steps[0].step.stage==="progress"){
        //
        //     action="completed"
        //
        // }
        //
        // else if (this.state.item&&this.state.item.steps[0].step.stage==="completed"){
        //
        //     action="confirmed"
        //
        // }



        var data={
            "cycle_id": this.slug,
            "new_stage": action,
        }

        console.log("update cycle ")
        console.log(data)

        axios.post(baseUrl + "cycle/stage",data
            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {

                console.log(res.data.data)

                // this.setState({
                //
                //     showPopUp: true
                // })

                this.getResources()


            }).catch(error => {

            console.log("cycle update error found ")
            console.log(error)

            //
            // this.setState({
            //
            //     showPopUp: true,
            //     loopError: error.response.data.content.message
            // })

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




    proceedCancel(){

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



    declineOffer() {


        this.setState({
            showPrompt: !this.state.showPrompt
        })



    }


    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
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
                console.log("cycle detail response")
                console.log(response)




                this.setState({

                    item: response.data
                })

            },
            (error) => {

                console.log("cycle error")

                console.log(error)


            }
        );

    }


    getOrgs() {


        axios.get(baseUrl + "org/all",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

                var response = response.data;
                console.log("cycle detail response")
                console.log(response)




                this.setState({

                    orgs: response.data
                })

            },
            (error) => {

                console.log("cycle error")

                console.log(error)


            }
        );

    }



    componentWillMount() {



    }

    interval

    componentDidMount() {
        this.getResources()
        this.getOrgs()
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
                {this.state.item &&
                <>
                <div className=" ">




                        <CycleDetail loop={this.state.item} />



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


                                    {this.state.item.cycle.stage==="progress"&&
                                    <div className="col-auto">

                                        <button onClick={this.showStep} type="button"
                                                className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-green">

                                            Add Step

                                        </button>
                                    </div>}

                                        <>
                                        {this.state.item.steps.length>0&&this.state.item.steps[0].nextAction.is_mine &&

                                        // {true &&

                                        <div className="col-auto">

                                    <button onClick={this.updateStep} type="button"
                                    className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-green">

                                        {this.state.item.steps[0].step.stage==="created"&&"Accept"}
                                        {this.state.item.steps[0].step.stage==="accepted"&&"Mark as work in progress"}
                                        {this.state.item.steps[0].step.stage==="progress"&&"Mark As Completed"}
                                        {this.state.item.steps[0].step.stage==="completed"&&"Confirm as completed"}

                                    </button>
                                    </div>}
                                        </>



                                    {this.state.item.next_action.is_mine &&


                                    <div className="col-auto">


                                        {this.state.item.next_action.possible_actions.map((item) =>
<>
                                            <button data-action={item} onClick={this.deliverCycle.bind(this)}
                                                    type="button"
                                                    className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-green">

                                                {item}
                                            </button>

</>
                                        )}
                                    </div>

                                    }




                                    {this.state.item.steps.map((item)=>

                                        <>
                                        <div className="row justify-content-center">
                                        <div className="col-2">
                                            {item.step.name}

                                        </div>
                                            <div className="col-10">

                                           {item.nextAction.is_mine&&item.nextAction.possible_actions.map((item) =>
                                            <>
                                                <button data-id={item._key} data-action={item} onClick={this.updateStep.bind(this)}
                                                        type="button"
                                                        className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-green">

                                                    {item}
                                                </button>

                                            </>
                                            )}
                                         </div>
                                        </div>

                                        </>

                                    )}




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


                {this.state.showPopUpStep &&


                <div className={"row"}>

                    <div className="col-auto">

                        <button  onClick={this.showPopUpStep} type="button" className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                            Add Step
                        </button>
                    </div>
                </div>

                }

                    <Modal className={"loop-popup"}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered show={this.state.showPopUpStep} onHide={this.showPopUpStep} animation={false}>

                        <ModalBody>
                            <div className={"row justify-content-center"}>
                                <div className={"col-4 text-center"}>
                                    <img className={"ring-pop-pup"} src={GrayLoop} alt=""/>
                                </div>
                            </div>

                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <p className={"text-bold"}>Create Step</p>
                                    <p>   Enter Details</p>
                                </div>
                            </div>




                            <form onSubmit={this.handleSubmitStep}>
                                <div className={"row justify-content-center"}>

                                    <div className={"col-12 text-center mb-4"}>

                                        <TextField id="outlined-basic" label="Name" variant="outlined" fullWidth={true} name={"name"} type={"text"} />

                                    </div>

                                    <div className={"col-12 text-center mb-4"}>

                                        <TextField id="outlined-basic" label="Description" variant="outlined" fullWidth={true} name={"description"} type={"text"} />

                                    </div>

                                    <div className={"col-12 text-center mb-4"}>

                                        <TextField id="outlined-basic" label="Note" variant="outlined" fullWidth={true} name={"note"} type={"text"} />

                                    </div>

                                    <div className={"col-12 text-center mb-4"}>

                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor="outlined-age-native-simple">Type</InputLabel>
                                            <Select
                                                native
                                                label={"Type"}
                                                inputProps={{
                                                    name: 'type',
                                                    id: 'outlined-age-native-simple',
                                                }}
                                            >

                                                <option value={null}>Select</option>

                                                {this.state.steps.map((item) =>

                                                    <option value={item}>{item}</option>

                                                )}

                                            </Select>
                                        </FormControl>


                                    </div>

                                    <div className={"col-12 text-center mb-4"}>

                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor="outlined-age-native-simple">Select Organisation</InputLabel>
                                            <Select
                                                native
                                                label={"Select Organisation"}
                                                inputProps={{
                                                    name: 'org',
                                                    id: 'outlined-age-native-simple',
                                                }}
                                            >

                                                <option value={null}>Select</option>

                                                {this.state.orgs.map((item) =>

                                                    <option value={item._key}>{item.name}</option>

                                                )}

                                            </Select>
                                        </FormControl>


                                    </div>


                                    <div className={"col-12 text-center mb-4"}>


                                        <div className={"row justify-content-center"}>
                                            <div className={"col-6"} style={{textAlign:"center"}}>

                                                <button  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Submit </button>

                                            </div>
                                            <div className={"col-6"} style={{textAlign:"center"}}>
                                                <p onClick={this.showStep} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</p>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </form>

                        </ModalBody>

                    </Modal>

                </>
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
