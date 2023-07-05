import React, {useEffect} from "react";
import {connect} from "react-redux";
import SettingsWhite from "../../img/icons/settings-blue.png";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout/Layout";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import EditAccount from "./EditAccount";
import CompanyInfo from "./CompanyInfo";
import Statistics from "../../views/loop-cycle/Statistics";
import ManageRole from "../../components/Account/ManageRole";
import SystemManageUser from "../../components/Account/SystemManageUser";
import ManageOrgUsers from "../../components/Account/ManageOrgUsers";
import AssumeRoles from "../../components/Account/AssumeRoles";
import ManageOrgSettings from "../../components/Account/ManageOrgSettings";
import UploadCarbonCSV from "../../components/Account/UploadCarbonCSV";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="div">{children}</Typography>
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
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

function MyAccount(props) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (props.location.search.includes("approvals")) {
            setValue(5);
        } else if (props.location.search.includes("system-users")) {
            setValue(7);
        } else {
        }
    }, []);

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
                        {props.isLoggedIn
                        // && props.userContext
                        && (
                            <div className="row">
                                <div className="col-md-3">
                                    <Tabs
                                        className={"custom-vertical-tabs"}
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        sx={{ borderRight: 1, borderColor: "divider" }}>
                                        <Tab key={0} label="Personal Information" value={0} />
                                        <Tab key={1} label="Company Information" value={1} />
                                        {/*<Tab key={2} label="Change Password" value={2} />*/}
                                        {/*<Tab key={3} label="Product Lines" value={3} />*/}
                                        {/*<Tab key={4} label="Statistics" value={4} />*/}
                                        {props.userContext&&props.userContext.perms.includes("OrgAdminWrite") && (
                                            <Tab key={5} label="Manage Users" value={5} />
                                        )}
                                        {props.userContext&&props.userContext.perms.includes("OrgAdminWrite") && (
                                            <Tab key={6} label="Manage Roles" value={6} />
                                        )}
                                        {props.userContext&&props.userContext.perms.includes("AdminWrite") && (
                                            <Tab key={7} label="System Users" value={7} />
                                        )}
                                        {props.userContext&&props.userContext.perms.includes("AdminWrite") &&
                                            (props.userContext.perms.includes("LcAssumeUserRole") ||
                                                props.userContext.perms.includes(
                                                    "LcAssumeOrgRole"
                                                )) && (
                                                <Tab key={8} label="Assume Users" value={8} />
                                            )}
                                        {props.userContext&&props.userContext.perms.includes("AdminWrite") && (
                                            <Tab key={9} label="Manage Orgs" value={9} />
                                        )}

                                        {props.userContext&&props.userContext.perms.includes("AdminWrite") && (
                                            <Tab key={10} label="Embodied Carbon" value={10} />
                                        )}
                                    </Tabs>
                                </div>
                                <div className="col-md-9  p-0 rad-8 bg-white">
                                    <TabPanel value={value} index={0}>
                                        <EditAccount />
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <CompanyInfo />
                                    </TabPanel>

                                    {/*<TabPanel value={value} index={3}>*/}
                                    {/*   */}
                                    {/*</TabPanel>*/}
                                    <TabPanel value={value} index={4}>
                                        <Statistics />
                                    </TabPanel>

                                    {props.userContext&&props.userContext.perms.includes("OrgAdminWrite") && (
                                        <TabPanel value={value} index={5}>
                                            <ManageOrgUsers />
                                        </TabPanel>
                                    )}
                                    {props.userContext&&props.userContext.perms.includes("OrgAdminWrite") && (
                                        <TabPanel value={value} index={6}>
                                            <ManageRole />
                                        </TabPanel>
                                    )}
                                    {props.userContext&&props.userContext.perms.includes("AdminWrite") && (
                                        <TabPanel value={value} index={7}>
                                            <SystemManageUser />
                                        </TabPanel>
                                    )}
                                    {props.userContext&&props.userContext.perms.includes("AdminWrite") &&
                                        (props.userContext.perms.includes("LcAssumeUserRole") ||
                                            props.userContext.perms.includes(
                                                "LcAssumeOrgRole"
                                            )) && (
                                            <TabPanel value={value} index={8}>
                                                <AssumeRoles />
                                            </TabPanel>
                                        )}

                                    {props.userContext&&props.userContext.perms.includes("AdminWrite") && (
                                        <TabPanel value={value} index={9}>
                                            <ManageOrgSettings />
                                        </TabPanel>
                                    )}
                                    {props.userContext&&props.userContext.perms.includes("AdminWrite") && (
                                        <TabPanel value={value} index={10}>
                                            <UploadCarbonCSV />
                                        </TabPanel>
                                    )}

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        userContext: state.userContext,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
