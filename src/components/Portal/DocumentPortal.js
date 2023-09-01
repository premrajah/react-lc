import React, { useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import PropTypes from 'prop-types';
import PageHeader from '../PageHeader';
import { Box, Card, CardContent, CardHeader, Tab, Tabs } from '@mui/material';
import { Download } from '@mui/icons-material';
import Layout from '../Layout/Layout';



function DocumentPortal() {

    return (
        <>
            <Layout>
                <div className="container mt-3">
                    <PageHeader
                        pageTitle="Documents Portal"
                        subTitle=""
                    />

                    <Card variant='outlined'>
                        <CardHeader title="Please download and fill out these documents">

                        </CardHeader>
                        <CardContent>
                            <section className="row">
                                <div className="col">
                                    <div>
                                        <Download style={{ fontSize: "16px" }} />
                                        <span>
                                            <a href="..." download='...'>
                                                Manufacturer Documents
                                            </a>
                                        </span>
                                    </div>
                                </div>
                            </section>
                            <section className="row mt-3">
                                <div className="col">
                                    <p>Once completed please upload the documents below.</p>
                                </div>
                            </section>

                            <section className="row">
                                <div className="col">
                                    <p>If you require any help, Please get in touch <a className='text-pink click-item' href="mailto:hello@loopcycle.io">hello@loopcycle.io</a></p>
                                </div>
                            </section>
                        </CardContent>
                    </Card>

                    <Card variant='outlined' className='mt-3'>
                        <CardContent>

                            <section className='row'>
                                <div className="col">
                                    <h3>Upload</h3>
                                </div>
                            </section>

                            <section className="row">
                                <div className="col">
                                    <p>Waiver</p>
                                </div>
                            </section>

                            <section className="row">
                                <div className="col">

                                    <p>
                                        By signing this declaration, you declare that the information provided is accurate, and that you have read and understand the contents defined.
                                        You agree and acknowledge that you shall be responsible for any misinformation provided in this submission. Further, you unconditionally release, waive, discharge, and agree to hold harmless Loop Infinity Ltd ('Loopcycle’) and/or affiliated companies, their officers, directors, shareholders, agents, servants, associates and/or their representatives from any and all liability, claims, demands, actions and causes of actions arising out of the information that you have provided in this submission.
                                    </p>
                                </div>
                            </section>

                            <section className="row mt-3">
                                <div className="col">
                                    <p>[BOX] I expressly acknowledge that I have carefully read, understand and accept the contents of this declaration.</p>
                                </div>
                            </section>
                        </CardContent>
                    </Card>
                </div >
            </Layout>
        </>
    )
}



const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DocumentPortal);