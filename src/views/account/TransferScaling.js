import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import {baseUrl, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import axios from "axios/index";
import TextField from "@material-ui/core/TextField";
import {Modal, ModalBody, Spinner} from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";
import AutocompleteCustom from "../../components/AutocompleteCustom";
import { Alert } from "react-bootstrap";
import PageHeader from "../../components/PageHeader";
import PlaceholderImg from "../../../src/img/place-holder-lc.png";
import EditIcon from "@material-ui/icons/Edit";
import {Publish} from "@material-ui/icons";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import _ from "lodash";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import ConversionItem from "../../components/Products/ConversionItem";
import TransferScalingItem from "./TransferScalingItem";
import Close from "@material-ui/icons/Close";

class TransferScaling extends Component {
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
            errorCompany:null,
            categories: [],
            subCategories: [],
            catSelected: {},
            subCatSelected: {},
            stateSelected: null,
            states: [],
            sites: [],
            page: 1,
            units: [],
            transferScaling:[],
            selectedItem:null,
            org_id:null,
            org_name:null,
            type:null


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
        if (detail.org) {
            this.setState({
                org_id: detail.org,
                org_name: detail.name,
            });
        } else {
            axios.get(baseUrl + "org/company/" + detail.company).then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        org_id: responseAll._key,
                    });
                }
            ).catch(error => {});
        }
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
                        errorCompany:null
                    });

                    let responseAll = response.data.data;

                    this.companyInfo();

                },
                (error) => {

                    this.setState({
                        loading: false,
                        errorCompany:error.response.data.errors[0].message
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
                    industry: responseOrg.data.details&&responseOrg.data.details.industry?responseOrg.data.details.industry:null,
                    sector: responseOrg.data.details&&responseOrg.data.details.sector?responseOrg.data.details.sector:null,
                    no_of_staff:  responseOrg.data.details&&responseOrg.data.details.no_of_staff?responseOrg.data.details.no_of_staff:null,
                    transferScaling:responseOrg.data.transfer_scaling

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

    handleValidation() {


        let fields = this.state.fields;


        let validations=[

            validateFormatCreate("companyName", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("description", [{check: Validators.requiredCheck, message: 'Required'}],fields),
        ]



        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
        return formIsValid;
    }
    getFiltersCategories() {
        axios
            .get(baseUrl + "category", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    let   responseAll=[]
                    responseAll = _.sortBy(response.data.data, ["name"]);

                    this.setState({
                        categories: responseAll,
                    });

                    // if (responseAll.length>0&&this.state.selectedItem){
                    //
                    //     this.setState({
                    //         subCategories:responseAll.filter((item) => item.name === this.state.selectedItem.category)[0].types,
                    //         states : responseAll.filter((item) => item.name === this.state.selectedItem.category)[0].types.filter((item) => item.name === this.state.selectedItem.type)[0].state,
                    //         units : responseAll.filter((item) => item.name === this.state.selectedItem.category)[0].types.filter((item) => item.name === this.state.selectedItem.type)[0].units
                    //     })
                    //
                    // }

                },
                (error) => {}
            );
    }


    handleValidationScaling() {


        let fields = this.state.fields;


        let validations=[

            validateFormatCreate("category", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("type", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("state", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("units", [{check: Validators.required, message: 'Required'}],fields),

        ]

        if (!this.state.disableVolume){
            validations.push( validateFormatCreate("factor", [{check: Validators.required, message: 'Required'},{check: Validators.decimal, message: 'All transfer scaling factors have to be greater than 0 and less than or equal to 1',min:0.0000001,max:1}],fields),
            )
        }



        let {formIsValid,errors}= validateInputs(validations)
        console.log(errors)
        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(value,field ) {

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

        this.setState({
            loading: true,
        });

        if (this.handleValidation()) {
            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);
            const name =data.get("companyName");
            const description = data.get("description")

            axios
                .post(`${baseUrl}org`,
                    {
                        id: this.state.org._key,
                        update: {
                            name: name,
                            description: description,
                            details:{

                                "industry": data.get("industry"),
                                "sector": data.get("businessField"),
                                "no_of_staff": data.get("no_of_staff")
                            }
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
        this.getFiltersCategories()
    }

    handleChangeProduct(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

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

    updateUnitConversions=(item,type)=>{



        if (item)
        this.setState({
            subCategories:this.state.categories.filter((filterItem) => filterItem.name === item.category)[0].types,
            states : this.state.categories.filter((filterItem) => filterItem.name === item.category)[0].types.filter((filterItem) => filterItem.name === item.type)[0].state,
            units : this.state.categories.filter((filterItem) => filterItem.name === item.category)[0].types.filter((filterItem) => filterItem.name === item.type)[0].units
        })


        // if (this.state.type=="edit")
        // this.setState({
        //     subCategories:[],
        //     catSelected:null,
        //     units:[],
        //     states:[],
        // })


        this.setState({
            selectedItem:item,
            conversionPopUp:!this.state.conversionPopUp,
            type:type,

        })


    }

    addTransferScaling = (event) => {

        event.preventDefault();


        console.log("submit called")

        if (this.state.type!="delete"&&!this.handleValidationScaling()){

            return

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
        const orgId =  this.state.org_id.replace("Org/","");
        const orgName =  this.state.org_name;

        let transferScaling = []

        let transferScalingObject= {

            org_id: "Org/"+orgId,
            org_name: orgName,
            category: category,
            type: type,
            state: state,
            units: units,
            factor: factor
        }
        console.log("transferScalingObject")
        console.log(transferScalingObject)



        if (!this.state.transferScaling||this.state.transferScaling.length==0) {

            transferScaling.push(transferScalingObject)

        }else {



            let exists = false

            console.log( this.state.transferScaling.length)
            for (let i = 0; i < this.state.transferScaling.length; i++) {
                console.log(this.state.transferScaling[i])
                console.log(this.state.transferScaling[i].units,units)
                console.log(this.state.transferScaling[i].state,state)
                console.log(this.state.transferScaling[i].type,type)
                console.log(this.state.transferScaling[i].category,category)
                console.log(this.state.transferScaling[i].org_id&&this.state.transferScaling[i].org_id.includes(orgId))

                if (this.state.transferScaling[i].org_id&&this.state.transferScaling[i].org_id.includes(orgId)&&this.state.transferScaling[i].units == units &&
                    this.state.transferScaling[i].state == state &&
                    this.state.transferScaling[i].type == type &&
                    this.state.transferScaling[i].category === category
                    ) {


                    exists = true


                }else{


                    transferScaling.push(this.state.transferScaling[i])
                }
            }



            if (this.state.type!="delete")
                transferScaling.push(transferScalingObject)


        }


        console.log("final data")
        console.log(transferScaling)

        axios
            .post(`${baseUrl}org`,
                {
                    id: "Org/" + this.state.org._key,
                    update: {
                        transfer_scaling: transferScaling
                    },
                }
            )
            .then((res) => {


                if (res.status === 200) {
                    this.setState({
                        loading: false,
                        submitSuccess: true,
                    });
                    console.log(res)
                }

                this.updateUnitConversions(null,null)
                this.companyInfo()
            })
            .catch((error) => {

                this.setState({
                    loading: false,

                });
            });


    }


    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper  ">
                    <HeaderDark />

                    <div className="container pb-4 pt-4">
                        <div>
                            <Link to={"/account"}>Account </Link> > Transfer Scaling
                        </div>

                        <PageHeader
                            pageTitle="Transfer Scaling"
                            subTitle="Add transfer scaling information on this page"
                            bottomLine={<hr />}
                        />

                        {this.state.submitSuccess && (
                            <Alert key={"alert"} variant={"success"}>
                                {"Information updated successfully"}
                            </Alert>
                        )}

                        <div className={"row"}>

                            <div className={"col-12  mt-0 text-left"}>
                                <h5> <button onClick={()=> {

                                this.updateUnitConversions(null,"add")}}
                                           style={{float:"right"}} className={"mr-2  blue-btn-border  mb-2"}>Add</button></h5>

                                {this.state.transferScaling&&this.state.transferScaling.length > 0 && (
                                    <>
                                        <table className={"table-scaling"} >

                                            <tr className=" text-bold">
                                                <th>Org</th>
                                                <th>Category</th>
                                                <th>Type</th>
                                                <th>State</th>

                                                <th>Unit</th>
                                                <th>Factor</th>
                                                <th>Edit/Delete</th>
                                            </tr>

                                        {this.state.transferScaling&&this.state.transferScaling.map(
                                            (item, index) => (

                                                <>
                                                <TransferScalingItem
                                                    key={index}
                                                    item={item}
                                                    // parentId={this.state.selectedItem._key}
                                                    remove={true}
                                                    onEdit={(type)=>this.updateUnitConversions(item,type)}
                                                />

                                                </>
                                            )
                                        )}

                                        </table>

                                    </>
                                )}



                                <Modal
                                    className={"loop-popup"}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    show={this.state.conversionPopUp}
                                    centered
                                    onHide={this.updateUnitConversions}
                                    animation={false}>
                                    <ModalBody>
                                        <div style={{position: "absolute",
                                            right: "20px"}} className=" text-right web-only">
                                            <Close
                                                onClick={()=>{this.updateUnitConversions(null,null)}}
                                                className="blue-text click-item"
                                                style={{ fontSize: 32 }}
                                            />
                                        </div>

                                        <div className={"row justify-content-center"}>
                                            <div className={"col-10 text-center"}>
                                                <p
                                                    style={{ textTransform: "Capitalize" }}
                                                    className={"text-bold text-blue"}>
                                                    {this.state.type=="edit"?"Edit Transfer Scaling ":this.state.type=="add"?"Add Transfer Scaling":"Delete Transfer Scaling"}
                                                </p>
                                            </div>
                                        </div>


                                    <div className="row py-3 justify-content-center mobile-menu-row pt-3 p-2">
                                        <div className="col mobile-menu">
                                            <div className="form-col-left ">

                                                <form onSubmit={this.addTransferScaling}>

                                                      <div className={this.state.type!="delete"?"row":"d-none"}>
                                                        <div className={"col-12"}>

                                                                <div className="row ">
                                                                    <div className="col-12 mb-2 ">
                                                                        <AutocompleteCustom
                                                                            initialOrgId={this.state.selectedItem&&this.state.selectedItem.org_id.replace("Org/","")}
                                                                            initialOrgName={this.state.selectedItem&&this.state.selectedItem.org_name}
                                                                            orgs={true}
                                                                            companies={false}
                                                                            suggestions={this.state.orgNames}
                                                                            selectedCompany={(action) =>
                                                                                this.companyDetails(action)
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className={"col-md-4 col-sm-12 col-xs-12 mb-2"}>
                                                                        <SelectArrayWrapper
                                                                            initialValue={this.state.selectedItem&&this.state.selectedItem.category}
                                                                            option={"name"}
                                                                            valueKey={"name"}
                                                                            select={"Select"}
                                                                            error={this.state.errors["category"]}
                                                                            onChange={(value)=> {

                                                                                this.handleChangeProduct(value,"category")
                                                                                this.setState({
                                                                                    catSelected:  this.state.categories.length>0? this.state.categories.filter(
                                                                                        (item) => item.name === value
                                                                                    )[0]:null,

                                                                                    subCategories:this.state.categories.length>0?this.state.categories.filter(
                                                                                        (item) => item.name === value
                                                                                    )[0]&&this.state.categories.filter(
                                                                                        (item) => item.name === value
                                                                                    )[0].types:[],
                                                                                    states: [],
                                                                                    units: [],

                                                                                })

                                                                            }}
                                                                            options={this.state.categories} name={"category"} title="Category"/>

                                                                    </div>

                                                                    <div className={"col-md-4 col-sm-12 col-xs-12 mb-2"}>
                                                                        <SelectArrayWrapper
                                                                            initialValue={this.state.selectedItem&&this.state.selectedItem.type}
                                                                            option={"name"}
                                                                            valueKey={"name"}
                                                                            select={"Select"}
                                                                            error={this.state.errors["type"]}
                                                                            onChange={(value)=> {
                                                                                this.handleChangeProduct(value,"type")

                                                                               let subCatSelected = this.state.subCategories&& this.state.subCategories.length>0?this.state.subCategories.filter((item) => item.name === value)[0]:null

                                                                               let states= subCatSelected?subCatSelected.state:[]

                                                                              let  units=subCatSelected?subCatSelected.units:[]

                                                                                this.setState({
                                                                                    subCatSelected:subCatSelected,
                                                                                    states:states,
                                                                                    units:units
                                                                                })


                                                                            }}

                                                                            disabled={
                                                                                ((this.state.subCategories&&this.state.subCategories.length > 0)) ? false : true
                                                                            } options={this.state.subCategories?this.state.subCategories:[]} name={"type"} title="Type"/>

                                                                    </div>

                                                                    <div className={"col-md-4 col-sm-12 col-xs-12 mb-2"}>
                                                                        <SelectArrayWrapper
                                                                            initialValue={this.state.selectedItem&&this.state.selectedItem.state}

                                                                            onChange={(value)=>this.handleChangeProduct(value,"state")}
                                                                            error={this.state.errors["state"]}

                                                                            select={"Select"}
                                                                            disabled={ (this.state.states.length > 0 )? false : true}
                                                                            options={this.state.states?this.state.states:[]} name={"state"} title="State"/>

                                                                    </div>
                                                                </div>
                                                                <div className="row mb-2">
                                                                    <div className="col-6 pr-2">
                                                                        <SelectArrayWrapper
                                                                            select={"Select"}
                                                                            initialValue={this.state.selectedItem&&this.state.selectedItem.units}
                                                                            onChange={(value)=>this.handleChangeProduct(value,"units")}
                                                                            error={this.state.errors["units"]}

                                                                            disabled={ (this.state.units.length > 0) ? false : true}
                                                                            options={this.state.units} name={"units"} title="Units"/>
                                                                    </div>

                                                                    <div className="col-6 pl-2">

                                                                        <TextFieldWrapper
                                                                            // readonly ={this.state.disableVolume}
                                                                            initialValue={this.state.selectedItem&&this.state.selectedItem.factor+""}
                                                                            // value={this.state.disableVolume?"0":""}
                                                                            onChange={(value)=>this.handleChangeProduct(value,"factor")}
                                                                            error={this.state.errors["factor"]}
                                                                            name="factor" title="Factor" />

                                                                    </div>



                                                                </div>


                                                        </div>
                                                    </div>

                                                    <div className={"row"}>
                                                    <div className="col-12 mt-4">
                                                        <button
                                                            type={"submit"}
                                                            className={
                                                                "btn btn-default btn-lg btn-rounded shadow  btn-green login-btn"
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
                                    </div>
                                    </ModalBody>

                                </Modal>


                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TransferScaling);
