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
            showDeletePopUp:false
        }

        this.triggerCallback=this.triggerCallback.bind(this)
        this.setOpen=this.setOpen.bind(this)
        this.deleteAction=this.deleteAction.bind(this)
        this.showDeletePopUp=this.showDeletePopUp.bind(this)


    }

    showDeletePopUp(event){


        // event.stopPropagation();
        // event.preventDefault();

        this.setState({

            showDeletePopUp: !this.state.showDeletePopUp
        })

    }

    deleteAction(event){


        // event.stopPropagation();
        // event.preventDefault();

        this.setState({

            showDeletePopUp: !this.state.showDeletePopUp
        })
            this.props.triggerCallback("delete")

    }



     setOpen(event){
         event.stopPropagation();
         event.preventDefault();


        this.setState({
            open: !this.state.open
        })
     }


    triggerCallback(action) {



        if (action!=="delete") {
            this.props.triggerCallback(action)
        }else{

            this.showDeletePopUp()
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
                        <MoreIcon style={{color:"#7a8896",opacity: "0.5!important"}}/>
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
                        </Menu>
                    </Button>

                </div>


                    <Modal className={"loop-popup"}
                           aria-labelledby="contained-modal-title-vcenter"
                           centered show={this.state.showDeletePopUp} onHide={this.showDeletePopUp} animation={false}>

                        <ModalBody>



                            <div className={"row justify-content-center"}>
                                <div className={"col-10 text-center"}>
                                    <p className={"text-bold"}>Delete</p>
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


                </>


            );
        }
}



export default MoreMenu;