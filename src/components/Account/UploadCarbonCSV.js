import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import * as actionCreator from "../../store/actions/actions";
import {Download, UploadFile} from "@mui/icons-material";
import {fetchErrorMessage} from "../../Util/GlobalFunctions";

class UploadCarbonCSV extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            fields: {},
            errors: {},
            loading: false,
            items: [],
            roles: [],
            showEdit: false,
            selectedKey: null,
            editMode: false,
            allPerms: [],
            selectedEditItem: null,
            showDeletePopUp: false,
            showAddPopUp: false,
            roleBy: "Email",
            assumeRoles: [],
            orgId: null,
            activeKey: "1"

        };

    }


    handleUpload = (e) => {

        try {

            console.log(e.target.files[0])
            let file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            const config = {
                headers: {'content-type': 'multipart/form-data'}
            }

            axios.post(`${baseUrl}carbon/upload/csv`, formData, config).then(res => {
                const a = document.createElement("a");
                const date = new Date().toISOString()
                document.body.appendChild(a);
                a.style = "display: none";

                const blob = new Blob([res.data], {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = `${date}_${file.name}`;
                a.click();
                window.URL.revokeObjectURL(url);

                this.props.showSnackbar({
                    show: true,
                    severity: "success",
                    message:  "File downloaded successfully. Thanks"
                })
            }).catch(error => {
                console.log(error)
                this.props.showSnackbar({
                    show: true,
                    severity: "error",
                    message: fetchErrorMessage(e)
                })
            })

        } catch (e) {
            console.log(e)
            this.props.showSnackbar({
                show: true,
                severity: "error",
                message: e.toString()
            })
        }
    }

    render() {
        return (
            <>

                <div className="container ">
                    <PageHeader
                        pageTitle="Upload CSV"
                        subTitle="Search orgs and manage their settings"
                    />
                    <div className="row  mb-4 d-flex align-items-center justify-content-end   ">
                        <div className="col-md-12 d-flex  flex-row align-items-center   ">
                            <span className="text-underline">
                            <Download  style={{fontSize: "16px"}}/><a href={"/downloads/embodied_carbon_sample.csv"}
                                                                     download={'embodied_carbon_sample.csv'}>Download
                            CSV template</a></span>
                        </div>
                        <div className="col-md-12 d-flex  flex-row align-items-center   ">

                            <div style={{margin: "10px"}}>
                                <input
                                    name={"c-csv-upload"}
                                    style={{display: "none"}}
                                    id={"image-c-csv-upload"}
                                    className={"c-csv-upload"}
                                    type="hidden"
                                    // value={this.state.image}
                                />
                                <div className={"img-box"} style={{position: "relative"}}>
                                    <label
                                        style={{width: "auto", height: "auto", display: "block", position: "relative"}}
                                        className=""
                                        htmlFor={"fileInput-c-csv-upload"}>

                                        <UploadFile className="border-box text-pink" style={{fontSize: "72px"}}/>


                                    </label>

                                    <input
                                        name={"fileInput-c-csv-upload"}
                                        style={{display: "none"}}
                                        accept=".csv"
                                        id={"fileInput-c-csv-upload"}
                                        className={""}
                                        type="file"
                                        onChange={(e) => {
                                            this.handleUpload(e)
                                        }
                                        }
                                    />
                                    <span className="text-12">Click to upload</span>


                                </div>

                            </div>


                        </div>

                    </div>


                </div>


            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(UploadCarbonCSV);
