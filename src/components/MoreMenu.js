import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from "@material-ui/icons/MoreHoriz";
import { connect } from "react-redux";


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
            anchorEl:null
        }

        this.triggerCallback=this.triggerCallback.bind(this)
        this.setOpen=this.setOpen.bind(this)


    }




     setOpen(){


        this.setState({
            open: !this.state.open
        })
     }


    triggerCallback(action) {


        this.props.triggerCallback(action)

    }

     handleClick = (event) => {
        
        
        

        event.stopPropagation();
        event.preventDefault();

        this.setState({
            anchorEl:event.currentTarget
        });

         this.setOpen()
    };

     handleClose = (event) => {

         
         if (event.currentTarget.dataset.action) {

             var action = event.currentTarget.dataset.action

             this.triggerCallback(action)
         }
        event.stopPropagation();
        event.preventDefault();

         this.setState({
             anchorEl:null
         });

         this.setOpen()
    };

        render() {
            return (
                <div className={"more-menu-container"}>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                        <MoreIcon/>
                        <Menu
                            className={"more-menu-box"}
                            id={this.props.id}
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={this.state.open}
                            onClose={this.setOpen}
                        >
                            <MenuItem  data-action={"edit"} onClick={this.handleClose}>Edit</MenuItem>
                            <MenuItem data-action={"delete"} onClick={this.handleClose}>Delete</MenuItem>
                            <MenuItem data-action={"duplicate"} onClick={this.handleClose}>Duplicate</MenuItem>
                        </Menu>
                    </Button>

                </div>
            );
        }
}



export default MoreMenu;