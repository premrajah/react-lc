import React, { useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import PropTypes from 'prop-types';
import PageHeader from '../PageHeader';
import { Box, Tab, Tabs } from '@mui/material';
import { Download } from '@mui/icons-material';



function DocumentPortal() {

    const [activeTab, setActiveTab] = useState(0);


    const handleTabChange = (e, newTabState) => {
        setActiveTab(newTabState);
    }

    return (
        <>
            <div className="container">
                <PageHeader
                    pageTitle="Documents Portal"
                    subTitle=""
                />

                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                        <Tabs
                            value={activeTab}
                            TabIndicatorProps={{
                                style: {
                                    backgroundColor: "#27245C",
                                    padding: '2px',
                                    color: "#27245C"
                                }
                            }}
                            onChange={handleTabChange}
                            aria-label="lab API tabs example">
                            <Tab label="Upload to Loopcycle" {...a11yProps(0)} />
                            <Tab label="Uploaded Documents" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    <CustomTabPanel value={activeTab} index={0}>
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

                        <section className="row mt-2">
                            <div className="col">
                                <p>Fill out these documents and once completed please upload the documents below.</p>
                                <p>If you require any help, Please get in touch <a className='text-pink click-item' href = "mailto:hello@loopcycle.io">hello@loopcycle.io</a></p>
                            </div>
                        </section>
                    </CustomTabPanel>

                    <CustomTabPanel value={activeTab} index={0}>
                        <section className="row">
                            <div className="col">
                                Upload
                            </div>
                        </section>
                    </CustomTabPanel>

                </Box>
            </div >
        </>
    )
}


CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <>{children}</>
                </Box>
            )}
        </div>
    );
}


const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DocumentPortal);