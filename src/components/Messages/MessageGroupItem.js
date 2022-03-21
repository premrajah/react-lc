import React, { Component } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import MessageNameThumbnail from "./MessageNameThumbnail";

class MessageGroupItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allOrgs: [],
        };
    }

    componentDidMount() {
        // this.getOrgs();

        // if (this.props.allGroupsDetails.length>0){
        //
        //     let allOrgs=this.props.allGroupsDetails.filter((item)=>item.key===this.props.item._key)
        //
        //     if (allOrgs.length>0){

        // if (this.props.allOrgs) {
        //     this.setState({
        //
        //         allOrgs: this.props.allOrgs
        //     })
        // }

        // }

        // if (this.props.item.group){
        //
        //     this.setState({
        //                 allOrgs: this.props.item.group
        //             })
        // }


    }
    componentDidUpdate(prevProps, prevState, snapshot) {


        if (prevProps !== this.props) {

            // if (this.props.allGroupsDetails.length>0){
            //
            //     let allOrgs=this.props.allGroupsDetails.filter((item)=>item.key===this.props.item._key)
            //
            //     if (allOrgs.length>0){
            //
            //         this.setState({
            //
            //             allOrgs: allOrgs[0]
            //         })
            //
            //     }
            // }

            if (this.props.allOrgs) {
                // this.setState({
                //
                //     allOrgs: this.props.allOrgs.value
                // })

                console.log(this.props.allOrgs)

            }

        }
    }

    getOrgs = () => {

        // axios
        //     .get(`${baseUrl}message-group/${this.props.item._key}/org`)
        //     .then((response) => {
        //         const data = response.data.data;
        //
        //         this.setState({
        //             allOrgs: data,
        //         });
        //
        //
        //
        //         if (this.props.index === 0) {
        //             this.props.handleGroupClick(this.props.item, this.props.index, data);
        //         }
        //     })
        //     .catch((error) => {
        //         console.log("message-group-error ", error.message);
        //     });


    };

    handleClick = () => {
        this.props.handleGroupClick(this.props.item, this.props.index, this.props.item.group);
    };

    render() {
        return (
            <div
                className={`${
                    this.props.selectedItem === this.props.index
                        ? "click-item p-3 message-group-item selected"
                        : "click-item p-3 message-group-item"
                } border-bottom  ${this.props.showAll?"": "ellipsis-end"}`}
                onClick={this.handleClick}>
                <span id={this.props.item._key + "_thumbnails"} className={"thumbnail-box"}>
                    {this.props.item.group&&this.props.item.group.map((item, index) => (
                        <MessageNameThumbnail
                            showCount={3}
                            key={index}
                            index={index}
                            item={item}
                            allOrgs={this.props.item.group}
                        />
                    ))}
                </span>
                <span
                    id={this.props.item._key + "_thumbnails_name"}
                    className={`ml-2 group-names text-capitlize `}
                    // style={{ fontSize: "0.7em" }}
                >
                    {this.props.item.group&&this.props.item.group.map((item, index) => (
                        <React.Fragment key={index}>
                            <span>
                                {index > 0 && ","} {item.name}
                            </span>
                        </React.Fragment>
                    ))}
                </span>
            </div>
        );
    }
}

export default MessageGroupItem;
