import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import {Close, Edit} from "@mui/icons-material";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import RightSidebar from "../RightBar/RightSidebar";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import IconBtn from "../FormsUI/Buttons/IconBtn";
import * as actionCreator from "../../store/actions/actions";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import PhoneInput from "react-phone-input-2";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeAlphabatically, fetchErrorMessage} from "../../Util/GlobalFunctions";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import ManageUserItem from "./ManageUserItem";
import GlobalDialog from "../RightBar/GlobalDialog";
import Add from "@mui/icons-material/Add";
import CustomPopover from "../FormsUI/CustomPopover";
import MenuDropdown from "../FormsUI/MenuDropdown";
import {getKey, removeKey, saveKey, saveUserToken} from "../../LocalStorage/user-session";

class AssumeRoles extends Component {
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
            assumeRoles:[]

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
                console.log("user",getKey("user"))

                console.log("token",getKey("token"))
                removeKey("token")
                // removeKey("user")
                saveKey("assumedRole",true)
                saveKey("roleName",this.state.fields["value"])

                let usrObject=res.data.data

                // delete usrObject["token"]

                saveKey("token",JSON.stringify(res.data.data.token)+"")

                // saveKey("user",usrObject)
                // console.log("token",getKey("token"))
                // console.log("user",getKey("user"))

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
                    pageTitle="Assume Roles"
                    subTitle="Assume roles of users from different companies"
                />

                {this.state.assumeRoles&&this.state.assumeRoles.length > 0 &&
                <div className="row d-flex align-items-center">

                    <div className="col-3 mt-4">

                        <MenuDropdown heigt={"60px"} setSelection={(value) => this.setState({
                            roleBy: value
                        })} options={this.state.assumeRoles}
                        />

                    </div>
                    <div className="col-4 mt-4">

                        <TextFieldWrapper
                            onChange={(value) => this.handleChange(value, "value")}
                            error={this.state.errors["value"]}
                            name="value"

                        />

                    </div>
                    <div className="col-3 mt-4">

                        <BlueButton
                            onClick={this.assumeRole}
                            fullWidth
                            title={"Submit"}
                            type={"button"}>

                        </BlueButton>


                    </div>
                </div>

                }


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
export default connect(mapStateToProps, mapDispatchToProps)(AssumeRoles);
