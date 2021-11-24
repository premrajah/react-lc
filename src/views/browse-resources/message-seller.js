import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import HeaderWhiteBack from "../header/HeaderWhiteBack";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import ResourceItem from "../item/ResourceItem";

// import { ChatController, MuiChat } from "chat-ui-react";

class MessageSeller extends Component {
    slug;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
        };

        this.slug = props.match.params.slug;
        this.getResource = this.getResource.bind(this);
    }

    getResource() {
        axios
            .get(baseUrl + "resource/" + this.slug, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data;

                    this.setState({
                        item: response.content,
                    });
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };


    componentDidMount() {
        this.getResource();
    }

    render() {
        return (
            <div>
                <HeaderWhiteBack
                    history={this.props.history}
                    heading={this.state.item && this.state.item.name}
                />

                <div className="container   pb-4 ">
                    {this.state.item && <ResourceItem item={this.state.item} />}
                    <div className="row   ">
                        <div className={"message-container col-12"}>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessageSeller;
