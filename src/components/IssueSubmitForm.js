import React, {Component} from "react";
import {FormControl, MenuItem} from "@mui/material";
import axios from "axios/index";
import {baseUrl, ISSUES_PRIORITY} from "../Util/Constants";
import {connect} from "react-redux";
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup';
import TextFieldWrapper from "./FormsUI/TextField";
// import {Select} from "formik-material-ui";

class IssueSubmitForm extends Component {
    state = {
        status: "",
    };

    formikRef = React.createRef();

    INITIAL_VALUES = {
        title: this.props.edit ? this.props.issue.title : "",
        description: this.props.edit ? this.props.issue.description : "",
        priority:this.props.edit ? this.props.issue.priority : ISSUES_PRIORITY[0]
    }

    VALIDATION_SCHEMA = Yup.object().shape({
        title: Yup.string().required("Required")
    })


    postCreateIssue = (payload) => {
        axios
            .post(`${baseUrl}issue`, payload)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        status: <p className="text-success">Successfully submitted data</p>,
                    });
                    this.formikRef.current.setSubmitting(false);
                }
            })
            .catch((error) => {
                this.setState({
                    status: <p className="text-warning">Unable to submit at this time. {error.message && error.message}</p>,
                });
                this.formikRef.current.setSubmitting(false);
            });
    }

    postEditIssue = (payload) => {
        axios
            .post(`${baseUrl}issue/update`, payload)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        status: <p className="text-success">Successfully updated data</p>,
                    });
                    this.props.onSubmitted();
                    this.formikRef.current.setSubmitting(false);
                }
            })
            .catch((error) => {
                this.setState({
                    status: <p className="text-warning">Unable to submit at this time. {error.message && error.message}</p>,
                });
                this.formikRef.current.setSubmitting(false);
            });
    }

    render() {
        return (
            <div className="row">
                <div className="col">

                    <Formik
                        initialValues={this.INITIAL_VALUES}
                        validationSchema={this.VALIDATION_SCHEMA}
                        enableReinitialize
                        innerRef={this.formikRef}
                        onSubmit={(values, { setSubmitting }) => {

                            this.setState({errors: ""})
                            let payload;

                            if(this.props.edit) {
                                payload = {
                                    id: this.props.issue._key,
                                    update: {
                                        title: values.title,
                                        description: values.description,
                                        priority: values.priority,
                                    },
                                }

                                this.postEditIssue(payload);

                            } else {
                                payload = {
                                    issue: {
                                        product_id: this.props.productId,
                                        title: values.title,
                                        description: values.description,
                                        priority: values.priority,
                                    },
                                }

                                this.postCreateIssue(payload);
                            }
                    }}>
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              dirty,
                              isSubmitting,}) => (<Form>
                            <div className="row mb-3">
                                <div className="col">
                                    <TextFieldWrapper name="title" label="Title"/>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <TextFieldWrapper name="description" label="Description" />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <FormControl>
                                        <Field
                                            // component={Select}
                                            name="priority"
                                            variant="outlined"
                                            label="Priority"
                                        >
                                            {ISSUES_PRIORITY.map(issue => (<MenuItem key={issue} value={issue}>{issue}</MenuItem>))}
                                        </Field>
                                    </FormControl>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <button type="submit" disabled={isSubmitting} className="btn btn-green btn-block">Submit</button>
                                </div>
                            </div>
                        </Form>)}
                    </Formik>
                    <div className="mt-2">{this.state.status}</div>
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
