import React, { useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import PropTypes from 'prop-types';
import PageHeader from '../PageHeader';
import { Box, Card, CardContent, CardHeader, Tab, Tabs } from '@mui/material';
import { Download } from '@mui/icons-material';
import Layout from '../Layout/Layout';
import {TabContext, TabList, TabPanel} from "@mui/lab";



function DocumentPortal() {

    const [activeKey,setActiveKey]=useState("1"   )

    return (
        <>
            <Layout>
                <div className="container mt-3">
                    <PageHeader
                        pageTitle="Documents Portal"
                        subTitle=""
                    />

                    <div className="row   justify-content-center">
                    <div className={"col-12 "}>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={activeKey}>
                                <Box >
                                    <TabList
                                        centered
                                        allowScrollButtonsMobile
                                        variant="centered"

                                        scrollButtons="auto"

                                        TabIndicatorProps={{
                                            style: {
                                                backgroundColor: "#27245C",
                                                padding: '2px',
                                                color:"#27245C"
                                            }
                                        }}
                                        onChange={(event,key)=>setActiveKey(key)}

                                        aria-label="lab API tabs example">

                                        <Tab label="Upload Documents" value="1" />

                                        <Tab label="Download Documents" value="2"/>
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
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
                                </TabPanel>
                                <TabPanel value="2">
                                    <Card variant='outlined' >
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
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </div>
                    </div>



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