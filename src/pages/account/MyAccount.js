import React, {Component} from "react";
import {connect} from "react-redux";
import SettingsWhite from "../../img/icons/settings-blue.png";
import {Link} from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import * as actionCreator from "../../store/actions/actions";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout/Layout";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EditAccount from "./EditAccount";
import CompanyInfo from "./CompanyInfo";
import TransferScaling from "./TransferScaling";
import Statistics from "../../views/loop-cycle/Statistics";
import ChangePassword from "../../components/Account/ChangePassword";
import ManageUser from "../../components/Account/ManageUser";
import ManageRole from "../../components/Account/ManageRole";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function MyAccount() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



        return (
            <Layout>

                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={SettingsWhite}
                            pageTitle="Account"
                            subTitle="Finish setting up your account here"
                            bottomLine={""}
                        />

                        <div className="row">
                            <div className="col-md-12">

                                    <div className="row">
                                        <div className="col-md-3">
                                            <Tabs
                                                className={"custom-vertical-tabs"}
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        sx={{ borderRight: 1, borderColor: 'divider' }}
                                    >
                                        <Tab label="Personal Info" {...a11yProps(0)} />
                                        <Tab label="Company Info" {...a11yProps(1)} />
                                                <Tab label="Change Password" {...a11yProps(2)} />
                                        <Tab label="Transfer Scaling" {...a11yProps(4)} />
                                        <Tab label="Statistics" {...a11yProps(4)} />
                                        <Tab label="Manage Users" {...a11yProps(5)} />
                                        <Tab label="Manage Roles" {...a11yProps(6)} />

                                    </Tabs>
                                        </div>
                                        <div className="col-md-9  p-0 rad-8 bg-white">
                                        <TabPanel value={value} index={0}>
                                        <EditAccount />
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                       <CompanyInfo/>
                                    </TabPanel>
                                            <TabPanel value={value} index={2}>
                                                <ChangePassword />
                                            </TabPanel>
                                    <TabPanel value={value} index={3}>
                                        <TransferScaling />
                                    </TabPanel>
                                    <TabPanel value={value} index={4}>
                                        <Statistics />
                                    </TabPanel>
                                    <TabPanel value={value} index={5}>
                                       <ManageUser/>
                                    </TabPanel>
                                    <TabPanel value={value} index={6}>
                                        <ManageRole/>
                                    </TabPanel>
                                        </div>
                                    </div>


                            </div>
                        </div>

                    </div>

            </Layout>
        );

}

