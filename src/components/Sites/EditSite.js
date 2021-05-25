import React, {useState, useCallback} from 'react'
import {Formik, Form} from 'formik'
import * as Yup from 'yup';
import TextFieldWrapper from "../FormsUI/TextField";
import ButtonWrapper from "../FormsUI/Button";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";


const EditSite = ({loadSites, site, submitCallback}) => {
    const { key, name, address, email, contact, phone, others } = site;

    const INITIAL_VALUES = {
        name,
        contact,
        address,
        phone,
        email,
        others
    }

    const VALIDATION_SCHEMA = Yup.object().shape({
        name: Yup.string().required('Required'),
        contact: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
        phone: Yup.number().integer().typeError('Please enter a valid phone number').required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        others: Yup.string()
    })

    const handleSubmitForm = (values) => {
        if(!values) return;

        const payload = {
            id: site._key,
            update: values
        }

        handleAxiosPostSite(payload);
    }

    const handleAxiosPostSite = (payload) => {
        axios.post(`${baseUrl}site`, payload)
            .then(res => {
                if(res.status === 200) {
                    handleCallback(<span className="text-success">Updated successfully.</span>);
                    loadSites();
                }
            })
            .catch(error => {
                handleCallback(<span className="text-warning">Sorry. Unable to update at this time</span>);
            })
    }

    const handleCallback = useCallback((errMsg) => {
        submitCallback(errMsg)
    },[])

    return  <div>
        <div className="row mb-3">
            <div className="col">
                <h4 className="text-center green-text">Edit Site</h4>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <Formik
                    initialValues={{...INITIAL_VALUES}}
                    validationSchema={VALIDATION_SCHEMA}
                    onSubmit={(values) => handleSubmitForm(values) }>
                    <Form>
                        <div className="row mb-3">
                            <div className="col">
                                <TextFieldWrapper name="name" label="Name" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <TextFieldWrapper name="contact" label="Contact" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <TextFieldWrapper name="address" label="Address" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <TextFieldWrapper name="phone" label="Phone" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <TextFieldWrapper name="email" label="Email address" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <TextFieldWrapper name="others" label="Other" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button type="submit" className="btn btn-block btn-green">Submit</button>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    </div>
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(EditSite);

