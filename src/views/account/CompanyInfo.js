import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import {baseUrl, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import axios from "axios/index";
import TextField from "@material-ui/core/TextField";
import { Spinner } from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";
import AutocompleteCustom from "../../components/AutocompleteCustom";
import { Alert } from "react-bootstrap";
import PageHeader from "../../components/PageHeader";
import PlaceholderImg from "../../../src/img/place-holder-lc.png";
import EditIcon from "@material-ui/icons/Edit";
import {Publish} from "@material-ui/icons";

class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            fields: {},
            errors: {},
            org: "",
            companyName: "",
            description: "",
            orgImage: "",
            orgImageKey: "",
            loading: false,
            base64Data: null,
            uploadedImgName: "",
            uploadedImgType: "",
            companyNumber: null,
            submitSuccess: false,
            file:null,

        };

        this.companyInfo = this.companyInfo.bind(this);
    }



    setArtifactOrg=(org_id,artifact_id)=>{


        const artifactData = {
            org_id: this.state.org._id,
            artifact_ids: [artifact_id],
        };
        axios
            .post(`${baseUrl}org/artifact`, artifactData)
            .then((resposne) => {

                this.companyInfo(); // get company info

            })
            .catch((error) => {});

        this.setState({
            loading: false,
        });

    }
    getArtifactForOrg = () => {
        let url = `${baseUrl}org/${encodeURIComponent(this.state.org._id)}/artifact`;
        axios
            .get(url)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.data.length > 0) {
                        this.setState({
                            orgImage: `${
                                response.data.data[0].blob_url
                            }&v=${Date.now()}`,
                        });
                        this.props.setOrgImage(
                            response.data.data[0].blob_url
                        );
                    }
                }
            })
            .catch((error) => {});
    };

    companyDetails = (detail) => {
        this.setState({
            companyNumber: detail.company,
        });
    };

    submitCompanyNumber = () => {
        this.setState({
            loading: true,
        });

        axios
            .post(`${baseUrl}org/add-company`, {
                company_number: this.state.companyNumber,
            })
            .then(
                (response) => {
                    this.setState({
                        loading: false,
                        submitSuccess: true,
                    });

                    let responseAll = response.data.data;

                    this.companyInfo();
                },
                (error) => {
                    this.setState({
                        loading: false,
                    });
                }
            );
    };

    companyInfo() {
        axios
            .get(`${baseUrl}org`)
            .then((response) => {
                let responseOrg = response.data;

                this.setState({
                    org: responseOrg.data,
                    companyName: responseOrg.data.name,
                    description: responseOrg.data.description,
                });

                this.getArtifactForOrg();
            })
            .catch((error) => {});
    }

    handleValidationSite() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!this.state.companyName && !fields["companyName"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }

        if (!this.state.description && !fields["description"]) {
            formIsValid = false;
            errors["description"] = "Required";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields: fields });

        if (field === "companyName") {
            this.setState({
                companyName: e.target.value,
            });
        } else if (field === "description") {
            this.setState({
                description: e.target.value,
            });
        }

    }

    _handleReaderLoaded = (readerEvent) => {
        let binaryString = readerEvent.target.result;
        this.setState({ base64Data: btoa(binaryString) });
    };

    handleSubmitSite = (event) => {
        event.preventDefault();

        this.setState({
            loading: true,
        });

        if (this.handleValidationSite()) {
            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);
            const name = this.state.companyName;
            const description = this.state.description;

            axios
                .post(`${baseUrl}org`,
                    {
                        id: this.state.org._key,
                        update: {
                            name: name,
                            description: description,
                        },
                    }
                )
                .then((res) => {
                    if(res.status === 200) {
                        this.setState({
                            loading: false,
                            submitSuccess: true,
                        });
                        this.getArtifactForOrg();
                    }
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                    });
                });

        }
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        this.companyInfo();
    }


    handleChangeFile(event) {
        let file = this.state.file;
        // var filesUrl = this.state.filesUrl

        let newFile = null;

        for (var i = 0; i < event.target.files.length; i++) {
            file=({ file: event.target.files[i], status: 0, id: null });
            newFile =({ file: event.target.files[i], status: 0, id: null });
        }


        this.setState({
            file: file,
        });

        this.uploadImage(file);
    }

    handleCancel(e) {
        e.preventDefault();

        var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name;
        var url = e.currentTarget.dataset.url;

        var files = this.state.files.filter((item) => item.file.name !== name);
        // var filesUrl = this.state.filesUrl.filter((item) => item.url !== url)

        // var images = this.state.images.filter((item)=> item !==index )

        // var images = this.state.images

        // images.splice(index,1)

        var images = [];
        for (let k = 0; k < files.length; k++) {
            if (files[k].id) {
                images.push(files[k].id);
            }
        }

        this.setState({
            images: images,
        });

        this.setState({
            files: files,
        });
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    getImageAsBytes(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = () => {
                let arrayBuffer = reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            };
            reader.onerror = (error) => reject(error);
        });
    }

    uploadImage(file) {
        if (file) {

                let imgFile = file;

                this.getImageAsBytes(imgFile.file)
                    .then(data => {
                        const payload = data;

                        try {
                            axios.post(`${baseUrl}artifact/load?name=${imgFile.file.name}`, payload)
                                .then(res => {


                                    console.log(res.data.data.blob_url)


                                    this.setArtifactOrg(this.state.org._id, res.data.data._key)
                                    this.setState({
                                        orgImage: res.data.data.blob_url,
                                    });

                                })
                                .catch(error => {

                                })

                        } catch (e) {
                            console.log('catch Error ', e);
                        }

                    })
                    .catch(error => {
                        console.log('image upload error ', error);
                    })

            }

    }


    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper  ">
                    <HeaderDark />

                    <div className="container pb-4 pt-4">
                        <div>
                            <Link to={"/account"}>Account </Link> > Company Information
                        </div>

                        <PageHeader
                            pageTitle="Company Information"
                            subTitle="Add your company information on this page"
                            bottomLine={<hr />}
                        />

                        {this.state.submitSuccess && (
                            <Alert key={"alert"} variant={"success"}>
                                {"Company information updated successfully"}
                            </Alert>
                        )}

                        <div className="row no-gutters">

                            <div style={{display: "flex",position:"relative"}} className="col-12 ">
                                <div className={"img-box"}  style={{position:"relative"}}>
                                {this.state.orgImage||this.state.file ? (
                                    <img
                                        // src={this.state.orgImage}
                                        src={this.state.orgImage? this.state.orgImage:URL.createObjectURL(this.state.file.file)}
                                        alt="logo"
                                        style={{ maxHeight: "150px", objectFit:"contain" }}
                                    />
                                ) : <img
                                    src={PlaceholderImg}
                                    alt="logo"
                                    style={{ maxHeight: "150px" , objectFit:"contain"}}
                                />}

                                    <label
                                        className={"edit-icon"}
                                        htmlFor="fileInput-2">

                                        <EditIcon className={""} style={{
                                            fontSize: 22,
                                            color: "#07ad88",
                                            margin: "auto",
                                        }} />
                                    </label>
                                    <input
                                        accept={MIME_TYPES_ACCEPT}
                                        style={{ display: "none" }}
                                        id="fileInput-2"
                                        className={""}
                                        type="file"
                                        onChange={this.handleChangeFile.bind(
                                            this
                                        )}
                                    />
                                </div>
                                <div className={"pl-2"}>
                                {this.state.org && this.state.org.company && (
                                    <>
                                        <h5 className={"text-bold"}>
                                            Company Registration Details
                                        </h5>
                                        <div>
                                            <div className="text-bold text-blue">
                                                <span className="mr-1">Name:</span>
                                                <span>{this.state.org.company.company_name}</span>
                                            </div>

                                            <div>
                                                <span className="mr-1">Company Number:</span>
                                                <span>{this.state.org.company.company_number}</span>
                                            </div>


                                            <div>
                                                <span className="mr-1">Registered Address:</span>
                                                <span className="mr-1">{
                                                    this.state.org.company.registered_office_address
                                                        .address_line_1
                                                },</span>
                                                <span>{
                                                    this.state.org.company.registered_office_address
                                                        .address_line_2
                                                }</span>
                                            </div>


                                            <div>
                                                <span className="mr-1">Locality:</span>
                                                <span className="mr-1">{
                                                    this.state.org.company.registered_office_address
                                                        .locality
                                                },</span>
                                                <span>{
                                                    this.state.org.company.registered_office_address
                                                        .country
                                                }</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                                </div>
                            </div>
                        </div>

                        {this.state.org && (
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <form onSubmit={this.handleSubmitSite}>
                                        <div className="row no-gutters justify-content-center ">
                                            <div className="col-12 mt-4">
                                                <TextField
                                                    id="outlined-basic"
                                                    label="Company Name"
                                                    variant="outlined"
                                                    fullWidth={true}
                                                    name={"companyName"}
                                                    value={this.state.companyName}
                                                    onChange={this.handleChange.bind(
                                                        this,
                                                        "companyName"
                                                    )}
                                                />

                                                {this.state.errors["companyName"] && (
                                                    <span className={"text-mute small"}>
                                                        <span style={{ color: "red" }}>* </span>
                                                        {this.state.errors["companyName"]}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="col-12 mt-4">
                                                <TextField
                                                    id="outlined-basic"
                                                    label="Description"
                                                    variant="outlined"
                                                    value={this.state.description}
                                                    fullWidth={true}
                                                    name={"description"}
                                                    onChange={this.handleChange.bind(
                                                        this,
                                                        "description"
                                                    )}
                                                />

                                                {this.state.errors["description"] && (
                                                    <span className={"text-mute small"}>
                                                        <span style={{ color: "red" }}>* </span>
                                                        {this.state.errors["description"]}
                                                    </span>
                                                )}
                                            </div>

                                            {/*<div className="col-12 mt-4">*/}
                                            {/*    <input*/}
                                            {/*        type="file"*/}
                                            {/*        name="orgImg"*/}
                                            {/*        id="orgImg"*/}
                                            {/*        accept=".jpeg, .jpg, .png"*/}
                                            {/*        onChange={this.handleChange.bind(*/}
                                            {/*            this,*/}
                                            {/*            "orgImg"*/}
                                            {/*        )}*/}
                                            {/*    />*/}
                                            {/*</div>*/}

                                            <div className="col-12 mt-4">
                                                <button
                                                    type={"submit"}
                                                    className={
                                                        "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                    }>
                                                    {this.state.loading && (
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                    )}

                                                    {this.state.loading ? "Wait.." : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {this.state.org && !this.state.org.company && (
                            <>
                                <div className="row mb-5 pb-5">
                                    <div className="col-12 mt-4">
                                        <AutocompleteCustom
                                            companies={true}
                                            suggestions={this.state.orgNames}
                                            selectedCompany={(action) =>
                                                this.companyDetails(action)
                                            }
                                        />
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            onClick={this.submitCompanyNumber}
                                            className={
                                                "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                            }>
                                            {this.state.loading && (
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            )}

                                            {this.state.loading ? "Wait.." : "Submit Company"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        orgImage: state.orgImage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setOrgImage: (data) => dispatch(actionCreator.setOrgImage(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfo);
