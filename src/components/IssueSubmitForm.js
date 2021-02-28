import React, { Component } from "react";
import { FormControl, FormHelperText, MenuItem, Select, TextField } from "@material-ui/core";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import {connect} from "react-redux";

class IssueSubmitForm extends Component {
    state = {
        issue: this.props.issue,
        edit: this.props.edit,
        productId: this.props.productId,
        editForm: {
            title: this.props.edit ? this.props.issue.title : "",
            description: this.props.edit ? this.props.issue.description : "",
            priority: this.props.edit ? this.props.issue.priority : "low",
            stage: this.props.edit ? this.props.issue.stage : "open",
        },
        titleSelectedValue: "",
        descriptionSelectedValue: "",
        prioritySelectedValue: "",
        status: "",
    };

    componentDidMount() {
        if(this.props.edit) {
            this.setState({titleSelectedValue: this.state.editForm.title, descriptionSelectedValue: this.state.editForm.description, prioritySelectedValue: this.state.editForm.priority})
        }
    }

    handlePrioritySelect = (e) => {
        if (!e) return;
        this.setState({ prioritySelectedValue: e.target.value, status: "" });
    };


    handleTitleValue = (e) => {
        if (!e) return;
        this.setState({ titleSelectedValue: e.target.value.trim(), status: "" });
    };

    handleDescriptionValue = (e) => {
        if (!e) return;
        this.setState({ descriptionSelectedValue: e.target.value, status: "" });
    };

    handleValidation = (value) => {

    }

    handleIssueFormSubmit = (e) => {
        if (!e) return;
        e.preventDefault();

        if (this.state.edit) {
            // update
            let payload = {
                id: this.state.issue._key,
                update: {
                    title: this.state.titleSelectedValue,
                    description: this.state.descriptionSelectedValue,
                    priority: this.state.prioritySelectedValue,
                },
            };

            this.handleUpdateOrCreateIssue(payload);

        } else if(!this.state.edit && this.state.productId) {
            let payload = {
                // new
                issue: {
                    product_id: this.state.productId,
                    title: this.state.titleSelectedValue,
                    description: this.state.descriptionSelectedValue,
                    priority: this.state.prioritySelectedValue,
                },
            };

            this.handleUpdateOrCreateIssue(payload);
        } else {
            return;
        }
    };

    handleUpdateOrCreateIssue = (payload) => {
        if (!payload) return;
        console.log(payload)
        if (this.state.edit) {
            axios
                .post(`${baseUrl}issue/update`, payload, {
                    headers: { Authorization: `Bearer ${this.props.userDetail.token}` },
                })
                .then((response) => {
                    if (response.status === 200) {
                        console.log('edit ', response.data)
                        this.setState({
                            status: <p className="text-success">Successfully updated data</p>,
                        });
                        this.props.onSubmitted();
                    }
                })
                .catch((error) => {
                    this.setState({
                        status: <p className="text-warning">Unable to submit at this time.</p>,
                    });
                });
        } else {
            axios
                .post(`${baseUrl}issue`, payload, {
                    headers: { Authorization: `Bearer ${this.props.userDetail.token}` },
                })
                .then((response) => {
                    if (response.status === 200) {
                        console.log('new issue ', response.data)
                        this.setState({
                            status: <p className="text-success">Successfully submitted data</p>,
                        });
                    }
                })
                .catch((error) => {
                    this.setState({
                        status: <p className="text-warning">Unable to submit at this time.</p>,
                    });
                });
        }
    };

    render() {
        return (
            <div className="row">
                <div className="col">
                    <form noValidate autoComplete="off" onSubmit={this.handleIssueFormSubmit}>
                        <FormControl>
                            <TextField
                                helperText="Can't be empty"
                                className="mb-3"
                                variant="outlined"
                                required
                                name="title"
                                label="Title"
                                defaultValue={this.state.editForm.title}
                                onChange={(e) => this.handleTitleValue(e)}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                className="mb-3"
                                variant="outlined"
                                name="description"
                                label="Description"
                                defaultValue={this.state.editForm.description}
                                onChange={(e) => this.handleDescriptionValue(e)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormHelperText>Select Priority</FormHelperText>
                            <Select
                                className="mb-3"
                                name="priority"
                                required
                                defaultValue={
                                    this.state.editForm.priority
                                        ? this.state.editForm.priority
                                        : "low"
                                }
                                onChange={this.handlePrioritySelect}>
                                <MenuItem value="low">low</MenuItem>
                                <MenuItem value="medium">medium</MenuItem>
                                <MenuItem value="high">high</MenuItem>
                            </Select>
                        </FormControl>

                        <div className="mt-3 mb-3 d-flex justify-content-center">
                            <button className="btn btn-green" disabled={this.state.titleSelectedValue ? false : true}>Submit</button>
                        </div>

                    </form>
                        <div>
                            {this.state.status}
                        </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

export default connect(mapStateToProps)(IssueSubmitForm);
