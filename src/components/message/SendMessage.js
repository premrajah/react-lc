import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import _ from "lodash";
import {
    Card,
    CardContent,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { Form } from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";

class SendMessage extends Component {
    state = {
        allOrgs: [],
        selectedOrgs: [],
        message: "",
        messageStatus: "",
    };

    getALlOrgs = () => {
        axios
            .get(`${baseUrl}org/all`)
            .then((response) => {
                this.setState({ allOrgs: _.orderBy(response.data.data, ["name"], ["desc"]) });
            })
            .catch((error) => {});
    };

    sendChatMessage = (payload) => {
        if (!payload) return;

        axios
            .post(`${baseUrl}message/${this.props.apiPath ? this.props.apiPath : "chat"}`, payload)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        messageStatus: <p className="text-success">Message sent successfully!</p>,
                    });
                    this.getALlOrgs();
                    this.props.getMessages();
                }
            })
            .catch((error) => {
                this.setState({
                    messageStatus: (
                        <p className="text-warning">Unable to send message at this time.</p>
                    ),
                });
                this.getALlOrgs();
            });
    };

    handleMultiSelect = (e) => {
        this.setState({ selectedOrgs: e.target.value, messageStatus: "" });
    };

    handleClearMultiSelect = () => {
        this.setState({ selectedOrgs: [], messageStatus: "" });
    };

    handleMessageSubmission = (e) => {
        e.preventDefault();

        if (this.state.selectedOrgs.length > 0 && this.state.message) {
            const payload = {
                message: {
                    type: "message",
                    text: this.state.message,
                },
                to_org_ids: this.state.selectedOrgs,
            };

            this.sendChatMessage(payload);
            this.setState({ selectedOrgs: [], message: "" }); //reset fields
        } else {
            return;
        }
    };

    componentDidMount() {
        this.getALlOrgs();
        this.props.getMessages()
    }

    render() {
        return (
            <>
                {this.state.allOrgs.length > 0 ? (
                    <div className="row">
                        <div className="col">
                            <Card variant="outlined" style={{ border: "1px solid #27245C" }}>
                                <CardContent>
                                    <Form onSubmit={this.handleMessageSubmission}>
                                        <Form.Group>
                                            <FormControl>
                                                <InputLabel id="multi-select">
                                                    Select organisations to message
                                                </InputLabel>
                                                <Select
                                                    labelId="multi-select"
                                                    multiple
                                                    value={this.state.selectedOrgs}
                                                    onChange={this.handleMultiSelect}
                                                    input={<Input />}>
                                                    {this.state.allOrgs.map((org) => {
                                                        return (
                                                            <MenuItem key={org._id} value={org._id}>
                                                                {org.name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </FormControl>
                                            <Form.Text className="text-muted">
                                                {this.state.selectedOrgs.length > 0 ? (
                                                    <button
                                                        className="btn btn-link float-right"
                                                        onClick={this.handleClearMultiSelect}>
                                                        clear
                                                    </button>
                                                ) : null}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Message</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                style={{ borderRadius: 5 }}
                                                value={this.state.message}
                                                onChange={(e) =>
                                                    this.setState({ message: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <div className="d-flex justify-content-end">
                                            <div className="mr-3 d-flex align-items-center">
                                                {this.state.messageStatus}
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-green"
                                                disabled={
                                                    this.state.selectedOrgs.length > 0 &&
                                                    this.state.message
                                                        ? false
                                                        : true
                                                }>
                                                SEND
                                            </button>
                                        </div>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : null}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMessages: (data) => dispatch(actionCreator.getMessages(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendMessage);
