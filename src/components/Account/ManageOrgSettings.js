import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import * as actionCreator from "../../store/actions/actions";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeAlphabatically, fetchErrorMessage} from "../../Util/GlobalFunctions";
import {removeKey, saveKey} from "../../LocalStorage/user-session";
import AutocompleteCustom from "../AutocompleteSearch/AutocompleteCustom";
import OrgSettings from "./OrgSettings";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";

class ManageOrgSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            fields: {},
            errors: {},
            loading: false,
            items:[],
            roles:[],
            showEdit:false,
            selectedKey:null,
            editMode:false,
            allPerms:[],
            selectedEditItem:null,
            showDeletePopUp: false,
            showAddPopUp: false,
            roleBy:"Email",
            assumeRoles:[],
            orgId:null,
            activeKey:"1"

        };

    }


    fetchAllPermissions=()=> {
        axios
            .get(baseUrl + "role/perm")
            .then(
                (response) => {

                    this.setState({
                        allPerms: arrangeAlphabatically(response.data.data),

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    toggleAddUser=async (loadRoles) => {

        if (loadRoles)
        this.fetchRoles()

        this.setState({
            showAddPopUp: !this.state.showAddPopUp,
        })


    }


    fetchRoles=()=> {

        this.setState({
            btnLoading: true,

        });
        axios
            .get(baseUrl + "role")
            .then(
                (response) => {

                    this.setState({
                        btnLoading: false,

                    });
                    this.setState({
                        roles: response.data.data.filter((item)=> item.type!=="loopcycle_admin"),

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }


    handleValidation() {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("email", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("role", [{check: Validators.required, message: 'Required'}], fields),
        ]


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});
        return formIsValid;
    }

    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({fields});

    }

    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }

    assumeRole = (event) => {


        if (!this.state.fields["value"]){

            let errors=this.state.errors
            errors.value={message:"Required."}

            this.setState({
                errors:errors
            })
        }

        // return false
        axios
            .post(
                `${baseUrl}user/assume/${this.state.roleBy?this.state.roleBy==="Email"?"email":
                    this.state.roleBy==="User Id"?"user":this.state.roleBy==="Org Id"?"org":"":null}`,
                {
                    assumed:this.state.fields["value"],
                }

            )
            .then((res) => {
                removeKey("token")
                saveKey("assumedRole",true)
                saveKey("roleName",this.state.fields["value"])

                let usrObject=res.data.data

                saveKey("token",JSON.stringify(res.data.data.token)+"")

                this.props.showSnackbar({show: true, severity: "success", message: "User assumed successfully. Thanks"})

                setTimeout(function() {

                    window.location.href=("/")

                }, 1000);


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

            }).finally(()=>{

            this.toggleAddUser(false)
        });


    };


    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        let parentId;

        if (!this.handleValidation()) {
            return
        }

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);





        // return false
        axios
            .post(
                baseUrl + "org/email/add/any",
                {
                    email:data.get("email"),
                    role_id:data.get("role"),
                    org_id:this.state.orgId

                }

            )
            .then((res) => {



                this.props.showSnackbar({show: true, severity: "success", message: "New user added successfully. Thanks"})


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

            }).finally(()=>{

            this.toggleAddUser(false)
        });


    };


    componentDidMount() {
        window.scrollTo(0, 0);

        let roles=[]

        if(this.props.userDetail.perms.includes("LcAssumeUserRole")){
            roles.push("Email")
        }
        if(this.props.userDetail.perms.includes("LcAssumeOrgRole")){
            roles.push("Org Id")
        }
        if(this.props.userDetail.perms.includes("LcAssumeUserRole")){
            roles.push("User Id")
        }

        this.setState({

            assumeRoles:roles

        })

        this.setActiveKey(null,"1")

        this.fetchRoles()
    }


    render() {
        return (
<>

            <div className="container ">

                <PageHeader
                    pageTitle="Manage Org"
                    subTitle="Search orgs and manage their settings"
                />


                <div className="row  mb-4 d-flex align-items-center justify-content-end   ">

                    <div className="col-md-12 d-flex  flex-row align-items-center   ">

                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={this.state.activeKey}>
                                <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                    <TabList
                                        allowScrollButtonsMobile
                                        variant="scrollable"
                                        scrollButtons="auto"

                                        TabIndicatorProps={{
                                            style: {
                                                color:"#27245C",
                                                backgroundColor: "#27245C",
                                                padding: '2px',
                                                borderRadius:"2px"
                                            }
                                        }}
                                        onChange={this.setActiveKey}

                                    >

                                        <Tab label="Configure Org Settings" value="1" />

                                        <Tab label="Add Users" value="2"/>

                                    </TabList>
                                </Box>

                                <TabPanel value="1">
                                    <div className="row d-flex align-items-center">


                                        <div className="col-12 mt-4">

                                            <p className={"title-bold"}>Search Org</p>

                                        </div>

                                        <div className="col-12    mt-4">

                                            <AutocompleteCustom
                                                hideAddNew
                                                orgs={true}
                                                suggestions={this.state.orgNames}
                                                selectedCompany={(action) => {

                                                    this.setState({
                                                        orgId:action.org
                                                    })

                                                }}
                                            />
                                        </div>



                                        {this.state.orgId &&
                                        <div className="col-12    mt-4">

                                            <OrgSettings isVisible={true}
                                                         orgId={this.state.orgId}

                                            />
                                        </div>
                                        }



                                    </div>

                                </TabPanel>
                                <TabPanel value="2">
                                    <div className="row d-flex align-items-center">


                                        <div className="col-12 mt-4">

                                            <p className={"title-bold"}>Search Org</p>

                                        </div>

                                        <div className="col-12    mt-4">

                                            <AutocompleteCustom
                                                hideAddNew
                                                orgs={true}
                                                suggestions={this.state.orgNames}
                                                selectedCompany={(action) => {

                                                    this.setState({
                                                        orgId:action.org
                                                    })

                                                }}
                                            />
                                        </div>



                                        {this.state.orgId &&
                                        <div className="col-12    mt-4">

                                            <form className={"full-width-field"} onSubmit={this.handleSubmit}>


                                                    <div className="row no-gutters">
                                                        <div className="col-12 ">

                                                            <TextFieldWrapper
                                                                onChange={(value)=>this.handleChange(value,"email")}
                                                                error={this.state.errors["email"]}
                                                                name="email" title="Email Address" />

                                                        </div>
                                                    </div>
                                                    <div className="row no-gutters">
                                                        <div
                                                            className="col-12 ">

                                                            <SelectArrayWrapper

                                                                option={"name"}
                                                                select={"Select"}
                                                                valueKey={"_id"}
                                                                error={this.state.errors["role"]}
                                                                onChange={(value) => {
                                                                    this.handleChange(value, "role")
                                                                }}
                                                                title={"Assign Role"}
                                                                options={this.state.roles}

                                                                name={"role"}

                                                            />




                                                        </div>
                                                    </div>


                                                    <div className="row mt-4 no-gutters">
                                                        <div  className={"col-6"}
                                                              style={{
                                                                  textAlign: "center",
                                                              }}>
                                                            <GreenButton

                                                                title={"Submit"}
                                                                type={"submit"}>

                                                            </GreenButton>
                                                        </div>
                                                        <div
                                                            className={"col-6"}
                                                            style={{
                                                                textAlign: "center",
                                                            }}>
                                                            <BlueBorderButton
                                                                type="button"

                                                                title={"Cancel"}

                                                                onClick={()=>
                                                                    this
                                                                        .toggleAddUser(false)
                                                                }
                                                            >

                                                            </BlueBorderButton>
                                                        </div>
                                                    </div>

                                            </form>

                                        </div>
                                        }



                                    </div>

                                </TabPanel>
                            </TabContext>
                        </Box>


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
        logOut:(data) => dispatch(actionCreator.logOut(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageOrgSettings);
