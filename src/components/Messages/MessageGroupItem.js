import React, { Component } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import MessageNameThumbnail from "./MessageNameThumbnail";
import {BorderBottom} from "@mui/icons-material";

class MessageGroupItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allOrgs: [],
        };
    }

    componentDidMount() {
        this.getOrgs();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
        }
    }

    getOrgs = () => {
        axios
            .get(`${baseUrl}message-group/${this.props.item._key}/org`)
            .then((response) => {
                const data = response.data.data;

                this.setState({
                    allOrgs: data,
                });

                if (this.props.index === 0) {
                    this.props.handleGroupClick(this.props.item, this.props.index, data);
                }
            })
            .catch((error) => {
                console.log("message-group-error ", error.message);
            });
    };

    handleClick = () => {
        this.props.handleGroupClick(this.props.item, this.props.index, this.state.allOrgs);
    };

    render() {
        return (
            <div
                className={`${
                    this.props.selectedItem === this.props.index
                        ? "click-item p-3 message-group-item selected"
                        : "click-item p-3 message-group-item"
                } border-bottom`}
                onClick={this.handleClick}>
                <span id={this.props.item._key + "_thumbnails"} className={"thumbnail-box"}>
                    {this.state.allOrgs.map((item, index) => (
                        <MessageNameThumbnail
                            key={index}
                            index={index}
                            item={item}
                            allOrgs={this.state.allOrgs}
                        />
                    ))}
                </span>
                <span
                    id={this.props.item._key + "_thumbnails_name"}
                    className={"ml-2 group-names text-capitlize "}
                    style={{ fontSize: "0.7em" }}>
                    {this.state.allOrgs.map((item, index) => (
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
