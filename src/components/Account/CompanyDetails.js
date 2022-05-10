import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import axios from "axios/index";
import {Alert, Modal, ModalBody} from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";
import AutocompleteCustom from "../../components/AutocompleteCustom";
import PlaceholderImg from "../../img/sq_placeholder.png";
import EditIcon from "@mui/icons-material/Edit";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import _ from "lodash";
import ImageCropper from "../../components/Cropper/ImageCropper";
import Close from "@mui/icons-material/Close";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import GreenBorderButton from "../FormsUI/Buttons/GreenBorderButton";
import AutoCompleteComboBox from "../FormsUI/ProductForm/AutoCompleteComboBox";
import MenuDropdown from "../FormsUI/MenuDropdown";
import Add from "@mui/icons-material/Add";
import Minus from "@mui/icons-material/Remove";
import GlobalDialog from "../RightBar/GlobalDialog";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import {getTimeFormat} from "../../Util/GlobalFunctions";
import OrgSettings from "./OrgSettings";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import CloseButtonPopUp from "../FormsUI/Buttons/CloseButtonPopUp";
import OrgComponent from "../Org/OrgComponent";


class CompanyDetails extends Component {
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
            approvals:[],
            activeKey:1,
            orgImageKey: "",
            loading: false,
            base64Data: null,
            uploadedImgName: "",
            uploadedImgType: "",
            companyNumber: null,
            submitSuccess: false,
            file: null,
            errorCompany: null,
            categories: [],
            subCategories: [],
            catSelected: {},
            subCatSelected: {},
            stateSelected: null,
            states: [],
            sites: [],
            orgs: [],
            removeCompanyPopUpType:0,
            page: 1,
            units: [],
            croppedImageData: null,
            showCropper: false,
            files: [],
            orgsApproval:[],
            showAddCompany: false,
            showRemoveCompany: false,
            isLoopCycleCompany:false,
            industries: [
                "Commercial kitchen equipment",
                "Commercial laundry equipment",
                "Hospitality",
                "Healthcare",
            ],
            reasons: ["Register new products", "Access Marketplace"],
            businessFields: ["Manufacturer", "Dealer", "Operator"],
            orgId: null,

        };

        this.companyInfo = this.companyInfo.bind(this);
    }

    setArtifactOrg = (org_id, artifact_id) => {
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
    };


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }


    companyDetails = (detail) => {

        if (detail.org) {
            this.setState({
                orgId: detail.org,
            });

            this.setState({
                isLoopCycleCompany:true
            })
        } else {

            this.setState({
                isLoopCycleCompany:false,
                companyNumber:detail.company
            })
        }
    };


    createCompanyWithDetails = (data) => {

        return       axios.post(baseUrl + "org/company/",{


            "company_number":this.state.companyNumber,
            "email":this.props.userDetail.email,
            // "details": {
            //
            //     "industry": data.get("industry")!=="Other"?data.get("industry"):data.get("industry-other"),
            //     "sector": data.get("businessField")!=="Other"?data.get("businessField"):data.get("businessField-other"),
            //     "no_of_staff": data.get("no_of_staff")?data.get("no_of_staff"):0
            // }

        }).then(
            (response) => {
                var responseAll = response.data.data;

                this.setState({
                    orgId: responseAll._key,
                });
            },
            (error) => {}
        );

    };

    addCompany = () => {
        this.setState({
            showAddCompany: !this.state.showAddCompany,
        });
    };




    removeCompany = (type,orgId) => {
        this.setState({
            showRemoveCompany: !this.state.showRemoveCompany,
            removeCompanyPopUpType:type,
            orgId:orgId
        });
    };

    switchOrg = (value) => {
        axios
            .get(`${baseUrl}user/context?org_id=${value}`)
            .then((res) => {
                this.props.showSnackbar({
                    show: true,
                    severity: "success",
                    message: "Org changed successfully. Thanks",
                });

                setTimeout(function () {
                    window.location.href = "/account";
                }, 1000);
            })
            .catch((error) => {})
            .finally(() => {});
    };

    setCropData = (data, name) => {
        this.setState({
            croppedImageData: data,
        });

        this.toggleCropper();

        this.uploadCroppedImage(data, name);
    };
    getArtifactForOrg = () => {
        let url = `${baseUrl}org/${encodeURIComponent(this.state.org._id)}/artifact`;
        axios
            .get(url)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.data.length > 0) {
                        this.setState({
                            orgImage: `${response.data.data[0].blob_url}&v=${Date.now()}`,
                        });
                        this.props.setOrgImage(response.data.data[0].blob_url);
                    }
                }
            })
            .catch((error) => {});
    };
    getOrgsForUser = () => {
        let url = `${baseUrl}user/org`;
        axios
            .get(url)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        orgs: response.data.data,
                    });
                }
            })
            .catch((error) => {});
    };


    getOrgsApprovalForUser = () => {
        let url = `${baseUrl}user/org/approval/ids`;
        axios
            .get(url)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        orgsApproval: response.data.data,
                    });
                }
            })
            .catch((error) => {});
    };

    // companyDetails = (detail) => {
    //     this.setState({
    //         companyNumber: detail.company,
    //     });
    // };

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
                        errorCompany: null,
                    });

                    let responseAll = response.data.data;

                    this.companyInfo();
                },
                (error) => {
                    this.setState({
                        loading: false,
                        errorCompany: error.response.data.errors[0].message,
                    });
                }
            );
    };

    submitFirstLogin = () => {
        axios
            .post(`${baseUrl}org/cache`, {
                key: "not_first_login",
                value: "true",
            })
            .then(
                (response) => {
                    if (this.props.hide) this.props.hide();
                },
                (error) => {}
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
                    industry:
                        responseOrg.data.details && responseOrg.data.details.industry
                            ? responseOrg.data.details.industry
                            : null,
                    sector:
                        responseOrg.data.details && responseOrg.data.details.sector
                            ? responseOrg.data.details.sector
                            : null,
                    no_of_staff:
                        responseOrg.data.details && responseOrg.data.details.no_of_staff
                            ? responseOrg.data.details.no_of_staff
                            : null,
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

        // if (!this.state.description && !fields["description"]) {
        //     formIsValid = false;
        //     errors["description"] = "Required";
        // }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleValidation() {
        let fields = this.state.fields;

        let validations = [
            validateFormatCreate(
                "companyName",
                [{ check: Validators.required, message: "Required" }],
                fields
            ),
            validateFormatCreate(
                "no_of_staff",
                [{ check: Validators.number, message: "Invalid Input" }],
                fields
            ),
        ];

        let { formIsValid, errors } = validateInputs(validations);

        this.setState({ errors: errors });
        return formIsValid;
    }
    getFiltersCategories() {
        axios.get(baseUrl + "category").then(
            (response) => {
                let responseAll = [];
                responseAll = _.sortBy(response.data.data, ["name"]);

                this.setState({
                    categories: responseAll,
                });

                if (responseAll.length > 0 && this.props.item) {
                    this.setState({
                        subCategories: responseAll.filter(
                            (item) => item.name === this.props.item.product.category
                        )[0].types,
                        states: responseAll
                            .filter((item) => item.name === this.props.item.product.category)[0]
                            .types.filter((item) => item.name === this.props.item.product.type)[0]
                            .state,
                        units: responseAll
                            .filter((item) => item.name === this.props.item.product.category)[0]
                            .types.filter((item) => item.name === this.props.item.product.type)[0]
                            .units,
                    });
                }
            },
            (error) => {}
        );
    }

    handleValidationScaling() {
        let fields = this.state.fields;

        let validations = [
            validateFormatCreate(
                "category",
                [{ check: Validators.required, message: "Required" }],
                fields
            ),
            validateFormatCreate(
                "type",
                [{ check: Validators.required, message: "Required" }],
                fields
            ),
            validateFormatCreate(
                "state",
                [{ check: Validators.required, message: "Required" }],
                fields
            ),
            validateFormatCreate(
                "units",
                [{ check: Validators.required, message: "Required" }],
                fields
            ),
        ];

        if (!this.state.disableVolume) {
            validations.push(
                validateFormatCreate(
                    "factor",
                    [
                        { check: Validators.required, message: "Required" },
                        { check: Validators.decimal, message: "This field should be a number." },
                    ],
                    fields
                )
            );
        }

        let { formIsValid, errors } = validateInputs(validations);
        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(value, field) {


        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });
    }

    _handleReaderLoaded = (readerEvent) => {
        let binaryString = readerEvent.target.result;
        this.setState({ base64Data: btoa(binaryString) });
    };

    handleSubmitSite = (event) => {
        event.preventDefault();

        if (this.handleValidation()) {
            this.setState({
                loading: true,
            });

            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);
            const name = data.get("companyName");
            const description = data.get("description");

            axios
                .post(`${baseUrl}org`, {
                    // id: this.state.org._key,
                    // update: {
                    name: name,
                    description: description,
                    details: {
                        industry: data.get("industry"),
                        sector: data.get("businessField"),
                        no_of_staff: data.get("no_of_staff") ? data.get("no_of_staff") : 0,
                    },
                    // },
                })
                .then((res) => {
                    if (res.status === 200) {
                        this.setState({
                            loading: false,
                            submitSuccess: true,
                        });
                        this.getArtifactForOrg();

                        if (this.props.trackFirstLogin) {
                            this.submitFirstLogin();
                        }
                    }
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                    });
                });
        }
    };

    addTransferScaling = (event) => {
        event.preventDefault();

        event.preventDefault();
        if (!this.handleValidationScaling()) {
            return;
        }

        this.setState({
            loading: true,
        });

        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);
        const category = data.get("category");
        const type = data.get("type");
        const units = data.get("units");
        const factor = data.get("factor");
        const state = data.get("state");

        axios
            .post(`${baseUrl}org`, {
                id: "Org/" + this.state.org._key,
                update: {
                    transfer_scaling: [
                        {
                            org_id: "Org/" + this.state.org._key,
                            category: category,
                            type: type,
                            state: state,
                            units: units,
                            factor: factor,
                        },
                    ],
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        loading: false,
                        submitSuccess: true,
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                });
            });
    };

    componentDidMount() {

        this.getOrgsForUser();
        this.getOrgsApprovalForUser()
        this.companyInfo();
        this.getFiltersCategories();
        this.setActiveKey(null,"1")
    }

    handleChangeProduct(value, field) {
        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });
    }
    handleChangeFile(event) {
        let file = this.state.file;
        // var filesUrl = this.state.filesUrl

        let newFile = null;

        for (var i = 0; i < event.target.files.length; i++) {
            file = { file: event.target.files[i], status: 0, id: null };
            newFile = { file: event.target.files[i], status: 0, id: null };
        }

        this.setState({
            file: file,
            files: event.target.files,
        });

        // this.uploadImage(file);

        this.toggleCropper();
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
                .then((data) => {
                    const payload = data;

                    try {
                        axios
                            .post(`${baseUrl}artifact/load?name=${imgFile.file.name}`, payload)
                            .then((res) => {
                                this.setArtifactOrg(this.state.org._id, res.data.data._key);
                                this.setState({
                                    orgImage: res.data.data.blob_url,
                                });
                            })
                            .catch((error) => {});
                    } catch (e) {
                        console.log("catch Error ", e);
                    }
                })
                .catch((error) => {
                    console.log("image upload error ", error);
                });
        }
    }

    _base64ToArrayBuffer = (base64) => {
        let binary_string = window.atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    };

    getJpegBytes(base64Data) {
        base64Data = base64Data.replace("data:image/png;base64,", "");

        return this._base64ToArrayBuffer(base64Data);
    }

    uploadCroppedImage(base64Data, name) {
        try {
            axios
                .post(
                    `${baseUrl}artifact/load?name=${name.toLowerCase()}`,
                    this.getJpegBytes(base64Data)
                )
                .then((res) => {
                    this.setArtifactOrg(this.state.org._id, res.data.data._key);
                    this.setState({
                        orgImage: res.data.data.blob_url,
                    });
                })
                .catch((error) => {});
        } catch (e) {
            console.log("catch Error ", e);
        }
    }

    toggleCropper = () => {
        this.setState({
            showCropper: !this.state.showCropper,
        });
    };

    handleAddCompany = async (event) => {


        if (this.state.companyNumber && !this.state.isLoopCycleCompany) {

            await this.createCompanyWithDetails(this.state.companyNumber)
        }


        if (!this.state.orgId) {
            this.setState({
                errorCompany: true,
            });

            return;
        } else {
            this.setState({
                errorCompany: false,
            });
        }

        // return false
        axios
            .post(
                baseUrl + "user/org",

                {
                    org_id: this.state.orgId,
                }
            )
            .then((res) => {

                this.addCompany();

                this.getOrgsApprovalForUser()

                this.props.showSnackbar({
                    show: true,
                    severity: "success",
                    message: "Join request sent to the company successfully. Thanks",
                });
            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false});
            })
            .finally(() => {
                this.setState({
                    btnLoading: false,
                });
            });
    };

    handleRemoveCompany = async (event) => {

        axios
            .delete(baseUrl + "user/org",{
                data:{org_id:this.state.removeCompanyPopUpType==1?this.state.org._key:this.state.orgId}
            })
            .then((res) => {


                this.getOrgsApprovalForUser()

                this.props.showSnackbar({
                    show: true,
                    severity: "success",
                    message: "Un-join request sent to the company successfully. Thanks",
                });




                this.removeCompany(0);

                if (this.props.removeCompanyPopUpType==1) {
                    setTimeout(function () {
                        window.location.href = "/account";
                    }, 1000);

                }else  if (this.props.removeCompanyPopUpType==2) {
                    this.getOrgsApprovalForUser()
                }

            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false});
            })
            .finally(() => {
                this.setState({
                    btnLoading: false,
                });
            });
    };





    render() {
        return (
            <>
                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    show={this.state.showCropper}
                    centered
                    onHide={this.toggleCropper}
                    animation={false}>
                    <ModalBody>
                        <div
                            style={{
                                position: "absolute",
                                background: "white",
                                zIndex: 1,
                                borderRadius: "50%",
                                padding: "1px",
                                marginTop: "15px",
                                marginLeft: "5px",
                            }}
                            className=" text-right web-only">
                            <Close
                                onClick={this.toggleCropper}
                                className="blue-text click-item"
                                style={{ fontSize: 32 }}
                            />
                        </div>
                        <div className="row no-gutters">
                            <div
                                style={{ display: "flex", position: "relative" }}
                                className="col-12 ">
                                <ImageCropper
                                    files={this.state.files}
                                    setCropData={(data, name) => this.setCropData(data, name)}
                                />
                            </div>
                        </div>
                    </ModalBody>
                </Modal>


                <div className="row mt-4 mb-4 d-flex align-items-center no-gutters   ">

                        <>
                            {this.state.orgs.length > 1 && <>
                            <div className="col-md-3 ">Switch Company:</div>
                            <div className="col-md-6 ">
                                <MenuDropdown
                                    setSelection={this.switchOrg}
                                    initialValue={this.props.userContext.orgId}
                                    options={this.state.orgs}
                                    option={"name"}
                                    valueKey={"_key"}
                                />
                            </div>
                                </>}
                            <div className="col-md-3 ">

                                    <button
                                        // style={{ minWidth: "180px" }}
                                        onClick={this.addCompany}
                                        className="  btn-gray-border  ">
                                        <Add style={{ fontSize: "20px" }} />
                                        Join New Company
                                    </button>
                                </div>

                        </>
                </div>

                {this.state.orgsApproval.map((item,index)=>

                    <div id={`${item._key}-${index}`} key={`${item._key}-${index}`}
                         className=" row d-flex align-items-start mt-2 mb-4 no-gutters bg-light border-box rad-8 align-items-center">
                            <div className={"col-7 text-blue "}>
                            <OrgComponent orgId={item._to.replace("Org/",'')} /> <br/> <small className={"text-gray-light"}>{getTimeFormat(item._ts_epoch_ms)}</small>
                        </div>
                        <div className={"col-3  "}>
                            Status: <span className={"text-pink"}>Pending Approval</span>
                        </div>
                        <div className={"col-2 text-right "}>
                           <CloseButtonPopUp onClick={()=>this.removeCompany(2,item._to.replace("Org/",''))}/>
                        </div>
                    </div>
                )}


                {this.state.submitSuccess && (
                    <Alert key={"alert"} variant={"success"}>
                        {"Company information updated successfully"}
                    </Alert>
                )}


                <div className="row company-box no-gutters bg-light border-box rad-8 align-items-center">
                    <div style={{ display: "flex", position: "relative" }} className="col-md-12 align-items-center  ">
                        <div className={"img-box"} style={{ position: "relative" }}>
                            {this.state.orgImage || this.state.file ? (
                                <img
                                    className={"rad-8"}
                                    // src={this.state.orgImage}
                                    src={
                                        this.state.orgImage
                                            ? this.state.orgImage
                                            : URL.createObjectURL(this.state.file.file)
                                    }
                                    // src={this.state.orgImage? this.state.orgImage:this.state.croppedImageData}
                                    // src={this.state.croppedImageData? this.state.croppedImageData:this.state.orgImage}
                                    alt="logo"
                                    style={{ maxHeight: "150px", objectFit: "contain" }}
                                />
                            ) : (
                                <img
                                    className={"rad-8"}
                                    src={PlaceholderImg}
                                    alt="logo"
                                    style={{ maxHeight: "150px", objectFit: "contain" }}
                                />
                            )}

                            <label className={"edit-icon d-flex"} htmlFor="fileInput-2">
                                <EditIcon
                                    className={""}
                                    style={{
                                        fontSize: 22,
                                        color: "#07ad88",
                                        margin: "auto",
                                    }}
                                />
                            </label>
                            <input
                                accept={MIME_TYPES_ACCEPT}
                                style={{ display: "none" }}
                                id="fileInput-2"
                                className={""}
                                type="file"
                                onChange={this.handleChangeFile.bind(this)}
                            />
                        </div>

                        <div className={"pl-3 info-box"}>
                            {this.state.org && this.state.org.company && (
                                <>
                                    <div className={"p-1"}>
                                        <div className=" text-blue">
                                            <span className="   text-blue mb-1 mr-1">Name:</span>
                                            <span className={"text-gray-light"}>
                                                {this.state.org.company.company_name}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="   text-blue mb-1 mr-1">
                                                Company Number:
                                            </span>
                                            <span className={"text-gray-light"}>
                                                {this.state.org.company.company_number}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="   text-blue mb-1 mr-1">
                                                Registered Address:
                                            </span>
                                            <span className="mr-1 text-gray-light">
                                                {
                                                    this.state.org.company.registered_office_address
                                                        .address_line_1
                                                }
                                                ,
                                            </span>
                                            <span className={"text-gray-light"}>
                                                {
                                                    this.state.org.company.registered_office_address
                                                        .address_line_2
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <span className="   text-blue mb-1 mr-1">
                                                Locality:
                                            </span>
                                            <span className="mr-1 text-gray-light">
                                                {
                                                    this.state.org.company.registered_office_address
                                                        .locality
                                                }
                                                ,
                                            </span>
                                            <span className={"text-gray-light"}>
                                                {
                                                    this.state.org.company.registered_office_address
                                                        .country
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>



                    </div>

                </div>



               <div className="row mt-4 mb-4 d-flex align-items-center justify-content-end   ">

                   <div className="col-md-12 d-flex flex-row align-items-center justify-content-end  ">
                        {this.state.org &&  (
                            <button
                            // style={{ minWidth: "180px" }}
                            onClick={()=>this.removeCompany(1)}
                            className="  btn-gray-border mr-2 ">
                            <Minus style={{ fontSize: "20px" }} /> Un-join {this.state.org.name}
                        </button>)}


                   </div>
               </div>
                   <div className="row  mb-4 d-flex align-items-center justify-content-end   ">

                   <div className="col-md-12 d-flex  flex-row align-items-center   ">

                       <Box sx={{ width: '100%', typography: 'body1' }}>
                           <TabContext value={this.state.activeKey}>
                               <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                   <TabList
                                       allowScrollButtonsMobile
                                       variant="scrollable"
                                       scrollButtons="auto"
                                       textColor={"#27245C"}
                                       TabIndicatorProps={{
                                           style: {
                                               backgroundColor: "#27245C",
                                               padding: '2px',
                                               borderRadius:"2px"
                                           }
                                       }}
                                       onChange={this.setActiveKey}

                                   >

                                       <Tab label="General" value="1" />

                                       {this.props.userContext.perms.includes("OrgAdminWrite") &&        <Tab label="Settings" value="2"/>}

                                   </TabList>
                               </Box>

                               <TabPanel value="1">
                                   <div className={"row mt-4"}>
                                       <div className={"col-12 text-left"}>
                                           {this.state.org && (
                                               <div className={"row"}>
                                                   <div className={"col-12"}>
                                                       <form onSubmit={this.handleSubmitSite}>
                                                           <div className="row  justify-content-start ">
                                                               <div className="col-6  mt-3">
                                                                   <TextFieldWrapper
                                                                       disabled={true}
                                                                       initialValue={this.state.companyName}
                                                                       onChange={(value) =>
                                                                           this.handleChange(value, "companyName")
                                                                       }
                                                                       error={this.state.errors["companyName"]}
                                                                       name="companyName"
                                                                       title="Company Name"
                                                                   />
                                                               </div>

                                                               <div className="col-6 mt-3">
                                                                   <TextFieldWrapper
                                                                       initialValue={this.state.description}
                                                                       onChange={(value) =>
                                                                           this.handleChange(value, "description")
                                                                       }
                                                                       error={this.state.errors["description"]}
                                                                       name="description"
                                                                       title="Description"
                                                                   />
                                                               </div>

                                                               <div className="col-6 mt-3">
                                                                   <AutoCompleteComboBox
                                                                       initialValue={this.state.industry}
                                                                       name="industry"
                                                                       onChange={(value) =>
                                                                           this.handleChange(value, "industry")
                                                                       }
                                                                       options={this.state.industries}
                                                                       title="Industry"
                                                                   />
                                                               </div>
                                                               <div className="col-6 mt-3">
                                                                   <AutoCompleteComboBox
                                                                       initialValue={this.state.sector}
                                                                       name="businessField"
                                                                       onChange={(value) =>
                                                                           this.handleChange(value, "businessField")
                                                                       }
                                                                       options={this.state.businessFields}
                                                                       title="Field of Business"
                                                                   />

                                                                   {/*<TextFieldWrapper*/}
                                                                   {/*    initialValue={this.state.sector}*/}
                                                                   {/*    onChange={(value)=>this.handleChange(value,"businessField")}*/}
                                                                   {/*    error={this.state.errors["businessField"]}*/}
                                                                   {/*    name="businessField" title="Field of Business" />*/}
                                                               </div>
                                                               <div className="col-6 mt-3">
                                                                   <TextFieldWrapper
                                                                       initialValue={this.state.no_of_staff}
                                                                       onChange={(value) =>
                                                                           this.handleChange(value, "no_of_staff")
                                                                       }
                                                                       error={this.state.errors["no_of_staff"]}
                                                                       name="no_of_staff"
                                                                       title="No of staff"
                                                                   />
                                                               </div>
                                                           </div>

                                                           <div className="row  justify-content-start ">
                                                               <div className="col-4 mt-3">
                                                                   <GreenButton
                                                                       title={this.state.loading ? "Wait.." : "Update"}
                                                                       type={"submit"}
                                                                       loading={this.state.loading}
                                                                       fullWidth></GreenButton>
                                                               </div>
                                                               {this.props.showSkip && (
                                                                   <div className="col-8 justify-content-end mt-3 text-right">
                                                                       <GreenBorderButton
                                                                           type={"button"}
                                                                           title={"Skip"}
                                                                           onClick={
                                                                               this.submitFirstLogin
                                                                           }></GreenBorderButton>
                                                                   </div>
                                                               )}
                                                           </div>
                                                       </form>
                                                   </div>
                                               </div>
                                           )}


                                       </div>
                                   </div>
                               </TabPanel>
                               <TabPanel value="2">
                                   <div className={"row mt-4"}>
                                       <div className={"col-12 text-left"}>
                                           <OrgSettings fromSettings orgId={this.state.org._key} isVisible={false} />
                                       </div>
                                   </div>

                               </TabPanel>


                           </TabContext>
                       </Box>


                   </div>

                </div>











                <GlobalDialog
                    allowOverflow
                    size={"xs"}
                    hide={this.addCompany}
                    show={this.state.showAddCompany}
                    heading={"Add Company"}>
                    <>
                        {this.state.showAddCompany &&
                            <>
                        <div className="col-12 ">
                            <div className="row no-gutters">
                                <div className="col-12 pt-4 pb-4">
                                    <AutocompleteCustom
                                        allowOverflow
                                        hideAddNew
                                        orgs={true}
                                        companies={true}
                                        suggestions={this.state.orgNames}

                                        selectedCompany={(action) => this.companyDetails(action)}

                                        // selectedCompany={(action) =>{
                                        //
                                        //
                                        //     // this.setState({
                                        //     //     orgId: action.org,
                                        //     // })
                                        // }}
                                    />
                                    {this.state.errorCompany && (
                                        <span
                                            style={{color: "rgb(244, 67, 54)"}}
                                            className="text-danger">
                                            Required
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                            <div className="col-12 ">
                            <div className="row mt-4 no-gutters">
                            <div
                            className={"col-6 pr-1"}
                            style={{
                            textAlign: "center",
                        }}>
                            <GreenButton
                            onClick={() => this.handleAddCompany()}
                            title={"Submit"}
                            type={"submit"}></GreenButton>
                            </div>
                            <div
                            className={"col-6 pl-1"}
                            style={{
                            textAlign: "center",
                        }}>
                            <BlueBorderButton
                            type="button"
                            title={"Cancel"}
                            onClick={() => this.addCompany()}></BlueBorderButton>
                            </div>
                            </div>
                            </div>
</>
                        }
                    </>
                </GlobalDialog>



                <GlobalDialog
                    allowOverflow
                    size={"xs"}
                    hide={this.removeCompany}
                    show={this.state.showRemoveCompany}
                    heading={this.state.removeCompanyPopUpType==1?"Un-join "+this.state.org.name:"Cancel Join Request"}>
                    <>
                        <div className="col-12 ">
                            {this.state.errorCompany && (      <div className="row no-gutters">
                                <div className="col-12 pt-4 pb-4">
                                        <span
                                            style={{ color: "rgb(244, 67, 54)" }}
                                            className="text-danger">
                                            Required
                                        </span>

                                </div>
                            </div> )}

                            <div className="row no-gutters">
                                <div className="col-12 ">
                                    {this.state.removeCompanyPopUpType==1?"Are you sure you want to un-join the company ?":
                                        "Are you sure you want to cancel join request ?"}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 ">
                            <div className="row mt-4 no-gutters">
                                <div
                                    className={"col-6 pr-1"}
                                    style={{
                                        textAlign: "center",
                                    }}>
                                    <GreenButton
                                        onClick={() => this.handleRemoveCompany()}
                                        title={"Remove"}
                                        type={"submit"}></GreenButton>
                                </div>
                                <div
                                    className={"col-6 pl-1"}
                                    style={{
                                        textAlign: "center",
                                    }}>
                                    <BlueBorderButton
                                        type="button"
                                        title={"Cancel"}
                                        onClick={() => this.removeCompany()}></BlueBorderButton>
                                </div>
                            </div>
                        </div>
                    </>
                </GlobalDialog>
            </>
        );
    }
}




const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        orgImage: state.orgImage,
        userContext: state.userContext,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setOrgImage: (data) => dispatch(actionCreator.setOrgImage(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetails);
