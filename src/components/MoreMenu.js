import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from "@material-ui/icons/MoreHoriz";
import { connect } from "react-redux";
import { Modal, ModalBody, Alert } from 'react-bootstrap';


class MoreMenu extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            items: [],
            previewImage:null,
            open:false,
            anchorEl:null,
            showDeletePopUp:false,
            showDuplicatePopUp:false,
            removePopUp:false
        }

        this.triggerCallback=this.triggerCallback.bind(this)
        this.setOpen=this.setOpen.bind(this)
        this.deleteAction=this.deleteAction.bind(this)
        this.duplicateAction=this.duplicateAction.bind(this)

        this.showDeletePopUp=this.showDeletePopUp.bind(this)
        this.showDuplicatePopUp=this.showDuplicatePopUp.bind(this)
        this.removePopUp=this.removePopUp.bind(this)
        this.removeAction=this.removeAction.bind(this)



    }


    removePopUp(event){

        this.setState({

            removePopUp: !this.state.removePopUp
        })

    }

    showDuplicatePopUp(event){

        this.setState({

            showDuplicatePopUp: !this.state.showDuplicatePopUp
        })

    }

    showDeletePopUp(event){


        // event.stopPropagation();
        // event.preventDefault();

        this.setState({

            showDeletePopUp: !this.state.showDeletePopUp
        })

    }


    removeAction(event){


        // event.stopPropagation();
        // event.preventDefault();

        this.setState({

            removePopUp: !this.state.removePopUp
        })
        this.props.triggerCallback("remove")

    }

    deleteAction(event){


        // event.stopPropagation();
        // event.preventDefault();

        this.setState({

            showDeletePopUp: !this.state.showDeletePopUp
        })
            this.props.triggerCallback("delete")

    }

    duplicateAction(event){


        // event.stopPropagation();
        // event.preventDefault();

        this.setState({

            showDuplicatePopUp: !this.state.showDuplicatePopUp
        })
        this.props.triggerCallback("duplicate")

    }



     setOpen(event){
         event.stopPropagation();
         event.preventDefault();


        this.setState({
            open: !this.state.open
        })
     }


    triggerCallback(action) {



        if (action==="delete") {
            // this.props.triggerCallback(action)
            this.showDeletePopUp()

        }


       else if (action==="remove") {
            // this.props.triggerCallback(action)
            this.removePopUp()

        }

       else if (action==="duplicate") {
            // this.props.triggerCallback(action)

            this.showDuplicatePopUp()

        }

        else{

            this.props.triggerCallback(action)

        }
    }

     handleClick = (event) => {
        

        event.stopPropagation();
        event.preventDefault();

        this.setState({
            anchorEl:event.currentTarget
        });

         this.setOpen(event)


    };


     handleClose = (event) => {
         event.stopPropagation();
         event.preventDefault();
         event.nativeEvent.stopImmediatePropagation();


         if (event.currentTarget.dataset.action) {

             var action = event.currentTarget.dataset.action

             this.triggerCallback(action)
         }


         this.setState({
             anchorEl:null
         });

         this.setOpen(event)
    };

        render() {
            return (

                <>

                <div className={"more-menu-container"}>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                        <MoreIcon style={{color:"#7a8896"}}/>
                        <Menu
                            className={"more-menu-box"}
                            id={this.props.id}
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={this.state.open}
                            onClose={this.setOpen}
                        >
                            {this.props.edit &&<MenuItem  data-action={"edit"} onClick={this.handleClose}>Edit</MenuItem>}
                            {this.props.delete && <MenuItem data-action={"delete"} onClick={this.handleClose}>Delete</MenuItem>}
                            {this.props.duplicate &&     <MenuItem data-action={"duplicate"} onClick={this.handleClose}>Duplicate</MenuItem>}
                            {this.props.remove &&     <MenuItem data-action={"remove"} onClick={this.handleClose}>Remove</MenuItem>}
                            {this.props.release &&     <MenuItem data-action={"release"} onClick={this.handleClose}>Release</MenuItem>}
                            {this.props.register &&     <MenuItem data-action={"register"} onClick={this.handleClose}>Register</MenuItem>}
                            {this.props.report &&     <MenuItem data-action={"report"} onClick={this.handleClose}>Report</MenuItem>}

                            {this.props.serviceAgent &&     <MenuItem data-action={"serviceAgent"} onClick={this.handleClose}>Change Service Agent</MenuItem>}

                            {this.props.stage &&     <MenuItem data-action={"stage"} onClick={this.handleClose}>Set Stage</MenuItem>}



                        </Menu>
                    </Button>




                    <div onClick={e => e.stopPropagation() }>
                    <Modal className={"loop-popup"}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered show={this.state.showDeletePopUp} onHide={this.showDeletePopUp} animation={false}>

                        <ModalBody>



                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <p className={"text-bold text-caps"}>Delete</p>
                                    <p>Are you sure you want to delete ?</p>
                                </div>
                            </div>



                            <div className={"row justify-content-center"}>


                                <div className={"col-12 text-center mt-2"}>


                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{textAlign:"center"}}>

                                            <button onClick={this.deleteAction}  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Submit </button>


                                        </div>
                                        <div className={"col-6"} style={{textAlign:"center"}}>
                                            <button onClick={this.showDeletePopUp} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</button>
                                        </div>
                                    </div>

                                </div>

                            </div>


                        </ModalBody>

                    </Modal>

                    </div>

                    <div onClick={e => e.stopPropagation() }>

                    <Modal className={"loop-popup"}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered show={this.state.showDuplicatePopUp} onHide={this.showDuplicatePopUp} animation={false}>

                        <ModalBody>



                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <p className={"text-bold text-caps"}>Duplicate</p>
                                    <p>Are you sure you want to create duplicate of this item ?</p>
                                </div>
                            </div>



                            <div className={"row justify-content-center"}>


                                <div className={"col-12 text-center mt-2"}>


                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{textAlign:"center"}}>

                                            <button onClick={this.duplicateAction}  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Submit </button>


                                        </div>
                                        <div className={"col-6"} style={{textAlign:"center"}}>
                                            <button onClick={this.showDuplicatePopUp} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</button>
                                        </div>
                                    </div>

                                </div>

                            </div>


                        </ModalBody>

                    </Modal>
                    </div>

                    <div onClick={e => e.stopPropagation() }>

                    <Modal className={"loop-popup"}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered show={this.state.removePopUp} onHide={this.removePopUp} animation={false}>

                        <ModalBody>



                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <p className={"text-bold text-caps"}>Remove</p>
                                    <p>Are you sure you want to remove this as sub-product?</p>
                                </div>
                            </div>



                            <div className={"row justify-content-center"}>


                                <div className={"col-12 text-center mt-2"}>


                                    <div className={"row justify-content-center"}>
                                        <div className={"col-6"} style={{textAlign:"center"}}>

                                            <button onClick={this.removeAction}  className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"} type={"submit"}  >Submit </button>


                                        </div>
                                        <div className={"col-6"} style={{textAlign:"center"}}>
                                            <button onClick={this.removePopUp} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</button>
                                        </div>
                                    </div>

                                </div>

                            </div>


                        </ModalBody>

                    </Modal>
                    </div>
                </div>





                </>


            );
        }
}



export default MoreMenu;