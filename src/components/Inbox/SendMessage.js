import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import _ from "lodash";
import { Card, CardContent } from "@material-ui/core";
import { Button, Form } from "react-bootstrap";

class SendMessage extends Component {
    state = {
        allOrgs: [],
        selectedOrgs: [],
        message: "",
        messageStatus: "",
    };

    getALlOrgs = () => {
        axios
            .get(`${baseUrl}org/all`, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                this.setState({ allOrgs: _.orderBy(response.data.data, ["name"], ["desc"]) });
            })
            .catch((error) => {});
    };

    sendChatMessage = (payload) => {
        if (!payload) return;

        axios
            .post(`${baseUrl}message/chat`, payload, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        messageStatus: <p className="text-success">Message sent successfully!</p>,
                    });
                    this.getALlOrgs();
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
        if (!e) return;

        const selectedOrgs = [];
        let selectedOption = e.target.selectedOptions;

        for (let i = 0; i < selectedOption.length; i++) {
            selectedOrgs.push(selectedOption.item(i).value);
        }

        this.setState({ selectedOrgs: selectedOrgs, messageStatus: "" });
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
                                            <Form.Label>Select Organisations to message</Form.Label>
                                            <Form.Control
                                                as="select"
                                                multiple
                                                style={{ borderRadius: 5 }}
                                                value={this.state.selectedOrgs}
                                                onChange={(e) => this.handleMultiSelect(e)}>
                                                {this.state.allOrgs.map((org) => {
                                                    return (
                                                        <option key={org._id} value={org._id}>
                                                            {org.name}
                                                        </option>
                                                    );
                                                })}
                                            </Form.Control>
                                            <Form.Text className="text-muted">
                                                use cmd + click or ctrl + click to select multiple
                                                organisations
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
        test: null,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendMessage);
