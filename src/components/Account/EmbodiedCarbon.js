import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import * as actionCreator from "../../store/actions/actions";
import { Download, UploadFile } from "@mui/icons-material";
import { fetchErrorMessage } from "../../Util/GlobalFunctions";
import { Box, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CalculateCarbon from "./CalculateCarbon";

const EmbodiedCarbon = (props) => {

    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (e, newTabState) => {
        setActiveTab(newTabState);
    }


    const handleUpload =   (e) => {

        try {

            let file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            }

            axios.post(`${baseUrl}carbon/upload/csv`, formData, config).then(async (res) =>   {
                const a = document.createElement("a");
                const date =  Date.now()
                document.body.appendChild(a);
                a.style = "display: none";

                const blob = new Blob([res.data], { type: "octet/stream" })
                // const blob = new Blob([res.data], { type: "application/zip" })
                // const url = URL.createObjectURL(blob);

                // const blob=await res.blob()
                const url = URL.createObjectURL(blob);

                a.href = url;
                a.download = `${date}_response.csv`;
                a.click();
                window.URL.revokeObjectURL(url);

                props.showSnackbar({
                    show: true,
                    severity: "success",
                    message: "File downloaded successfully. Thanks"
                })
            }).catch(error => {
                console.log(error)
                props.showSnackbar({
                    show: true,
                    severity: "error",
                    message: fetchErrorMessage(error)
                })
            })

        } catch (e) {
            console.log(e)
            props.showSnackbar({
                show: true,
                severity: "error",
                message: e.toString()
            })
        }
    }

    return (
        <>

            <div className="container ">
                <PageHeader
                    pageTitle="Embodied Carbon"
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
                            <Tab label="Upload CSV" {...a11yProps(0)} />
                            <Tab label="Embodied Carbon" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    <CustomTabPanel value={activeTab} index={0}>
                        <div className="row mt-4  mb-4 d-flex align-items-center justify-content-end   ">
                            <div className="col-md-12 d-flex  flex-row align-items-center   ">
                                <span className="text-underline">
                                    <Download style={{ fontSize: "16px" }} /><a href={"/downloads/embodied_carbon_sample.csv"}
                                                                                download={'embodied_carbon_sample.csv'}>Download
                                        CSV template</a></span>
                            </div>
                            <div className="col-md-12 d-flex  flex-row align-items-center   ">

                                <div style={{ margin: "10px" }}>
                                    <input
                                        name="c-csv-upload"
                                        style={{ display: "none" }}
                                        id="image-c-csv-upload"
                                        className="c-csv-upload"
                                        type="hidden"
                                        // value={this.state.image}
                                    />
                                    <div className={"img-box"} style={{ position: "relative" }}>
                                        <label
                                            style={{ width: "auto", height: "auto", display: "block", position: "relative" }}
                                            className=""
                                            htmlFor={"fileInput-c-csv-upload"}>

                                            <UploadFile className="click-item border-box text-pink" style={{ fontSize: "72px" }} />

                                        </label>

                                        <input
                                            name="fileInput-c-csv-upload"
                                            style={{ display: "none" }}
                                            accept=".csv"
                                            id="fileInput-c-csv-upload"
                                            type="file"
                                            onChange={(e) => handleUpload(e)}
                                        />
                                        <span className="text-12">Click to upload</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={1}>
                        <div className="row">
                            <div className="col">
                                <CalculateCarbon/>
                            </div>
                        </div>
                    </CustomTabPanel>
                </Box>
            </div>
        </>
    );

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

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EmbodiedCarbon);
