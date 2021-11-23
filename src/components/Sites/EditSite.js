import React, {useCallback, useEffect, useState} from 'react'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup';
import TextFieldWrapper from "../FormsUI/TextField";
import ButtonWrapper from "../FormsUI/Button";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import {Checkbox, FormLabel} from '@mui/material';


const EditSite = ({editable, loadSites, site, submitCallback}) => {
    const { key, name, address, email, contact, phone, others, is_head_office } = site;
    const[isDisabled, setIsDisabled] = useState(false);

    const INITIAL_VALUES = {
        name: editable ? name : '',
        contact: editable ? contact : '',
        address: editable ? address : '',
        phone: editable ? phone : '',
        email: editable ? email : '',
        others: editable ? others : '',
        is_head_office: editable ? is_head_office ? is_head_office : false : false
    }

    const VALIDATION_SCHEMA = Yup.object().shape({
        name: Yup.string().required('Required'),
        contact: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
        phone: Yup.number().integer().typeError('Please enter a valid phone number').required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        others: Yup.string(),
        is_head_office: Yup.boolean()
    })

    const handleSubmitForm = (values) => {
        if(!values) return;
        setIsDisabled(true);

        let payload;
        if(editable) {
            payload = {
                id: site._key,
                update: values
            }
        } else {
            payload = {
                site: values
            }
        }

        handleAxiosPostSite(payload);

    }

    const handleAxiosPostSite = (payload) => {
        editable
            ? axios.post(`${baseUrl}site`, payload)
            .then(res => {
                if(res.status === 200) {
                    handleCallback(<span className="text-success">Updated successfully.</span>);
                    loadSites();
                    setIsDisabled(false);
                }
            })
            .catch(error => {
                handleCallback(<span className="text-warning">Sorry. Unable to update at this time, {error.message}</span>);
                setIsDisabled(false);
            })

            : axios.put(`${baseUrl}site`, payload)
                .then(res => {
                    if(res.status === 200) {
                        handleCallback(<span className="text-success">Added successfully.</span>);
                        loadSites();
                        setIsDisabled(false);
                    }
                })
                .catch(error => {
                    handleCallback(<span className="text-warning">Sorry. Unable to add at this time, {error.message}</span>);
                    setIsDisabled(false);
                })
    }

    const handleCallback = useCallback((errMsg) => {
        submitCallback(errMsg)
    },[])

    return  <div>
        <div className="row mb-3">
            <div className="col">
                <h4 className="text-center green-text">{editable ? 'Edit Site' : 'Add New Site'}</h4>
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
                                <FormLabel>Is head Office</FormLabel>
                                <Field name="is_head_office" type="checkbox" as={Checkbox}  />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button className="btn btn-block btn-green" type="submit" disabled={isDisabled} style={{backgroundColor: '#07AD88'}} >Submit</button>
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

