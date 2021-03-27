import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import TextField from "@material-ui/core/TextField";
import {Spinner} from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";
import AutocompleteCustom from "../../components/AutocompleteCustom";
import {Alert} from 'react-bootstrap';


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
            companyNumber:null,
            submitSuccess:false

        };

        this.companyInfo = this.companyInfo.bind(this);
    }

    getArtifactForOrg = () => {
        let url = `${baseUrl}org/${encodeURIComponent(this.state.org._id)}/artifact`;
        axios
            .get(url, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                if (response.status === 200) {
                    if(response.data.data.length > 0) {
                        this.setState({orgImage: `${response.data.data[response.data.data.length -1].blob_url}&v=${Date.now()}`})
                        this.props.setOrgImage(response.data.data[response.data.data.length -1].blob_url)

                    }

                }
            })
            .catch((error) => {

            });
    };


    companyDetails=(detail)=>{


        // alert(detail)
        // console.log(detail)


        this.setState({

            companyNumber:detail.company
        })




    }


    submitCompanyNumber=()=>{


        this.setState({
            loading: true,
        });

        axios.post(baseUrl + "org/company",{

            company_number:this.state.companyNumber
        })
            .then((response) => {



                    this.setState({
                        loading: false,
                        submitSuccess:true

                    });

                    var responseAll = response.data.data;


                    this.companyInfo()


                },
                (error) => {



                    this.setState({
                        loading: false,
                    });

                }
            );




    }


    companyInfo() {
        axios
            .get(baseUrl + "org", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((response) => {
                var responseOrg = response.data;


                this.setState({
                    org: responseOrg.data,
                    companyName: responseOrg.data.name,
                    description: responseOrg.data.description,
                });

                this.getArtifactForOrg();
            })
            .catch((error) => {

            });
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

    handleChangeSite(field, e) {
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
        } else if (field === "orgImg") {
            let file = e.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = this._handleReaderLoaded.bind(this);
                reader.readAsBinaryString(file);
                this.setState({
                    uploadedImgName: file.name,
                    uploadedImgType: file.type,
                });
            }
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
                .post(
                    baseUrl + "org",
                    {
                        id: this.state.org._key,
                        update: {
                            name: name,
                            description: description,
                        },
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
                    }
                )
                .then((res) => {
                    this.setState({
                        loading: false,
                        submitSuccess:true

                    });
                })
                .catch((error) => {

                    this.setState({
                        loading: false,
                    });
                });



            if (this.state.base64Data) {
                const imageData = {
                    metadata: {
                        name: this.state.uploadedImgName,
                        mime_type: this.state.uploadedImgType,
                        context: this.state.org._key,
                    },
                    data_as_base64_string: this.state.base64Data,
                };

                axios
                    .post(`${baseUrl}artifact`, imageData, {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            const artifiactData = {
                                org_id: this.state.org._id,
                                artifact_ids: [response.data.data._key],
                            };
                            axios
                                .post(`${baseUrl}org/artifact`, artifiactData, {
                                    headers: {
                                        Authorization: "Bearer " + this.props.userDetail.token,
                                    },
                                })
                                .then((resposne) => {
                                    this.companyInfo(); // get company info



                                })
                                .catch((error) => {

                                });

                            this.setState({
                                loading: false,
                            });
                        }
                    })
                    .catch((error) => {

                        this.setState({ loading: false });
                    });
            }
        }
    };

    componentDidMount() {

        window.scrollTo(0, 0)
        this.companyInfo();
    }

    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper  ">
                    <HeaderDark />

                    <div className="container  pt-3">
                        <div className="row mb-3 justify-content-center ">
                            <div className="col-12  justify-content-center">
                                <p className={"blue-text"}>
                                    <Link to={"/account"}>Account </Link> > Company Info{" "}
                                </p>
                                <h4 className={"text-blue text-bold"}>Company Info</h4>
                            </div>
                        </div>


                        {this.state.submitSuccess &&  <Alert key={"alert"} variant={"success"}>
                            {"Company information updated successfully"}
                        </Alert>}

                        <div className="row">
                            <div className="col-3">
                                {this.state.orgImage ? (
                                    <img
                                        src={this.state.orgImage}
                                        alt="logo"
                                        style={{ maxHeight: "150px", objectFit: "contain" }}
                                    />
                                ) : null}
                            </div>

                            <div className="col-9">
                                {this.state.org && this.state.org.company &&

                                <>
                                    <h5 className={"text-bold"}>Company Registration Details</h5>
                                    <p className={""}>
                                        <span className={"text-bold text-blue"}>Name: {this.state.org.company.company_name}</span>
                                        <br/>
                                        <span className={""}>Company Number: {this.state.org.company.company_number}</span>

                                        <br/>
                                        <span className={""}>Registered Address: {this.state.org.company.registered_office_address.address_line_1},
                                            {this.state.org.company.registered_office_address.address_line_2}</span>

                                        <br/>
                                        <span className={""}>Locality: {this.state.org.company.registered_office_address.locality},
                                            {this.state.org.company.registered_office_address.country}</span>

                                    </p>



                                </>

                                }



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
                                                    onChange={this.handleChangeSite.bind(
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
                                                    onChange={this.handleChangeSite.bind(
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

                                            <div className="col-12 mt-4">
                                                <input
                                                    type="file"
                                                    name="orgImg"
                                                    id="orgImg"
                                                    accept=".jpeg, .jpg, .png"
                                                    onChange={this.handleChangeSite.bind(
                                                        this,
                                                        "orgImg"
                                                    )}
                                                />
                                            </div>




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




                        {this.state.org && !this.state.org.company &&

                        <>
                        <div className="row mb-5 pb-5">

                            <div className="col-12 mt-4">



                                <AutocompleteCustom

                                    companies={true}
                                    suggestions={this.state.orgNames}
                                    selectedCompany={(action) => this.companyDetails(action)}
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

                        </>}




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

const mapDispachToProps = (dispatch) => {
    return {


        setOrgImage: (data) => dispatch(actionCreator.setOrgImage(data)),

    };
};

export default connect(mapStateToProps, mapDispachToProps)(CompanyInfo);
