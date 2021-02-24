import React, {Component} from 'react';
import {FormControl, FormHelperText, MenuItem, Select, TextField} from "@material-ui/core";
import {Form} from "react-bootstrap";

class IssueSubmitForm extends Component {

    state = {
        issue: this.props.issue,
        edit: this.props.edit,
        productId: this.props.productId,
        editForm: {
            title: this.props.edit ? this.props.issue.title : '',
            description: this.props.edit ? this.props.issue.description : '',
            priority: this.props.edit ? this.props.issue.priority : '',
            stage: this.props.edit? this.props.issue.stage : ''
        },
        priorityValues: ['low', 'medium', 'high'],
        stageValues: ['open', 'progress', 'closed']

    }

    componentDidMount() {
        console.log('ISF> ', this.state.issue)
    }

    handlePrioritySelect = (e) => {
        this.setState({editForm: {priority: e}})
    }

    handleIssueFormSubmit = (e) => {
        if(!e) return;
        e.preventDefault();
        console.log(this.state.editForm)
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
                                name="title"
                                value={this.state.editForm.title}
                                onChange={(e) => this.setState({editForm: {title: e.target.value}}) }
                                    />
                        </FormControl>

                        <FormControl>
                            <TextField
                                className="mb-3"
                                variant="outlined"
                                label="Description"
                                name="description"
                                value={this.state.editForm.description}
                                onChange={(e) => this.setState({editForm: {title: e.target.value}})}
                                />
                        </FormControl>


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