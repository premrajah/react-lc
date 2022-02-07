import React, {Component} from "react";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";

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
            <>
                <div
                    key={this.props.item._key}
                    id={this.props.item._key}
                    className={
                        this.props.selectedItem === this.props.index
                            ? `click-item p-3 message-group-item selected`
                            : `click-item p-3 message-group-item`
                    }
                    onClick={this.handleClick}>
                    <span
                        key={this.props.item._key + "_thumbnails"}
                        id={this.props.item._key + "_thumbnails"}
                        className={"thumbnail-box"}>
                        {this.state.allOrgs.map((item, index) => (
                            <>
                                {index < 3 && (
                                    <span
                                        className={`text-caps company-thumbnails ${
                                            index > 0 && " thumbnail-margin-left"
                                        } `}>
                                        {item.name.substr(0, 2)}
                                    </span>
                                )}

                                {index == 3 && this.state.allOrgs.length - 3 !== 0 && (
                                    <span className={"more-items-thumbnail "}>
                                        +{this.state.allOrgs.length - 3}
                                    </span>
                                )}
                            </>
                        ))}
                    </span>
                    <span
                        key={this.props.item._key + "_thumbnails_name"}
                        id={this.props.item._key + "_thumbnails_name"}
                        className={"ml-2 group-names text-capitlize "}>
                        {this.state.allOrgs.map((item, index) => (
                            <>
                                {index > 0 && ","} {item.name}
                            </>
                        ))}
                    </span>
                </div>
            </>
        );
    }
}

export default MessageGroupItem;