import React, {Component} from 'react';
import {FormControl, MenuItem, Select, TextField} from "@material-ui/core";

class IssueSubmitForm extends Component {

    state = {
        issue: this.props.issue,
        edit: this.props.edit,
        productId: this.props.productId,
        editForm: {
            title: this.props.edit ? this.props.issue.title : '',
            description: this.props.edit ? this.props.issue.description : '',
            priority: this.props.edit ? this.props.issue.priority : 'low',
            stage: this.props.edit? this.props.issue.stage : 'open'
        },
        titleSelectedValue: '',
        descriptionSelectedValue: '',
        prioritySelectedValue: '',
        stageSelectedValue: '',

    }

    handlePrioritySelect = (e) => {
        if(!e) return;
        this.setState({prioritySelectedValue: e.target.value});
    }

    handleStageSelect = (e) => {
        if(!e) return;
        this.setState({stageSelectedValue: e.target.value});
    }

    handleTitleValue = (e) => {
        if(!e) return;
        this.setState({titleSelectedValue: e.target.value});
    }

    handleDescriptionValue = (e) => {
        if(!e) return;
        this.setState({descriptionSelectedValue: e.target.value});
    }

    handleIssueFormSubmit = (e) => {
        if(!e) return;
        e.preventDefault();

        if(this.state.edit && this.state.editForm) {
            const payload = {
                id: this.state.issue._id,
                update : {
                    title: this.state.titleSelectedValue,
                    description: this.state.descriptionSelectedValue,
                    priority: this.state.prioritySelectedValue
                }
            }

            console.log(payload);
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col">
                    <form noValidate autoComplete="off" onSubmit={this.handleIssueFormSubmit}>
                        <FormControl>
                            <TextField
                                className="mb-3"
                                variant="outlined"
                                label="Title"
                                defaultValue={this.state.editForm.title}
                                onChange={(e) => this.handleTitleValue(e)}
                                    />
                        </FormControl>

                        <FormControl>
                            <TextField
                                className="mb-3"
                                variant="outlined"
                                label="Description"
                                defaultValue={this.state.editForm.description}
                                onChange={(e) => this.handleDescriptionValue(e)}
                                />
                        </FormControl>

                        <FormControl>
                            <Select
                                defaultValue={this.state.editForm.priority ? this.state.editForm.priority : 'low'}
                                onChange={this.handlePrioritySelect}
                            >
                                <MenuItem value="low">low</MenuItem>
                                <MenuItem value="medium">medium</MenuItem>
                                <MenuItem value="high">high</MenuItem>
                            </Select>
                        </FormControl>

                        {
                            !this.props.edit && <FormControl>
                            <Select
                                defaultValue={this.state.editForm.stage ? this.state.editForm.stage : 'open'}
                                onChange={this.handleStageSelect}
                            >
                                <MenuItem value="open">open</MenuItem>
                                <MenuItem value="progress">progress</MenuItem>
                                <MenuItem value="closed">closed</MenuItem>
                            </Select>
                        </FormControl>
                        }


                        <div className="mt-3 d-flex justify-content-center">
                            <button className="btn btn-green">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default IssueSubmitForm;