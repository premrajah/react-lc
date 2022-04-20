import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import * as actionCreator from "../../store/actions/actions";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeAlphabatically, fetchErrorMessage} from "../../Util/GlobalFunctions";
import MenuDropdown from "../FormsUI/MenuDropdown";
import {getKey, removeKey, saveKey} from "../../LocalStorage/user-session";
import AutocompleteCustom from "../AutocompleteCustom";
import OrgSettings from "./OrgSettings";

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
            orgId:null

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

    }


    render() {
        return (
<>

            <div className="container ">

                <PageHeader
                    pageTitle="Configure Org Settings"
                    subTitle="Search orgs and manage their settings"
                />


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

                    <OrgSettings
                        orgId={this.state.orgId}

                    />
                    </div>
                    }



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
