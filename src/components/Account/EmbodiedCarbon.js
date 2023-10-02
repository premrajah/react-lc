import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import * as actionCreator from "../../store/actions/actions";
import { Download, UploadFile } from "@mui/icons-material";
import { cleanFilename, fetchErrorMessage } from "../../Util/GlobalFunctions";
import { Box, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CalculateCarbon from "./CalculateCarbon";
import {Spinner} from "react-bootstrap";
import TextFieldWrapper from '../FormsUI/ProductForm/TextField';

const EmbodiedCarbon = (props) => {

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(0);
    const [exportFileName, setExportFileName] = useState(null);

    const handleTabChange = (e, newTabState) => {
        setActiveTab(newTabState);
    }

    const handleExportFileName = (value) => {
        if(!value) return;
        setExportFileName(cleanFilename(value.trim()));
    }


    const handleUpload =   (e) => {

        try {

            setLoading(true)
            let file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            const config = {
                responseType: 'blob', 
                headers: { 'content-type': 'multipart/form-data' }
            }

            axios.post(`${baseUrl}carbon/upload/csv`, formData, config).then(async (res) =>   {
                const a = document.createElement("a");
                const date =  Date.now()
                document.body.appendChild(a);
                a.style = "display: none";

                // const blob = new Blob([res.data], { type: "octet/stream" })
                //const blob = res; //new Blob([res], { type: "application/vnd.ms-excel" })
                // const blob = new Blob([res.data], { type: "application/zip" })
                // const url = URL.createObjectURL(blob);

                // const blob=await res.blob()

                let output_filename = exportFileName ? `${exportFileName}.zip` : `${date}_embodied_carbon_result.zip`;

                if(res.headers['x-filename'] !== null && res.headers['x-filename'] !== undefined) {
                    output_filename = res.headers['x-filename'];
                }

                const url = URL.createObjectURL(res.data);
                // const url = URL.createObjectURL(new Blob([res.data]));

                a.href = url;
                a.download = output_filename;
                a.click();
                window.URL.revokeObjectURL(url);

                props.showSnackbar({
                    show: true,
                    severity: "success",
                    message: "File downloaded successfully. Thanks"
                })

                setExportFileName(null); // reset filename
            }).catch(error => {
                console.log(error)
                props.showSnackbar({
                    show: true,
                    severity: "error",
                    message: fetchErrorMessage(error)
                })
            }).finally(()=>[

                setLoading(false)
            ])

        } catch (e) {
            console.log(e)
            setLoading(false)
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

                                            {loading ? (
                                                <Spinner
                                                    className="position-absolute "
                                                    style={{margin:"auto",right:0,left:0,top:0,bottom:0}}
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            ):<></>}
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

                        <div className="row">
                            <div className="col">
                            <TextFieldWrapper 
                                name="exportFileName" 
                                title="Enter filename (optional)"
                                initialValue={exportFileName}
                                onChange={(value) => handleExportFileName(value)}
                                />
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
