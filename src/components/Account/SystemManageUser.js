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

class SystemManageUser extends Component {
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
    handleChangeCheck(value,field ) {

        let fields = this.state.fields;

        if (value){


            if (fields.perms){
                fields.perms.push(field);
            }

            else{
                fields.perms=[field];
            }


        }else{

            if (fields.perms){
                let perms = fields.perms.filter((item)=> item!==field)
                fields.perms=perms;
            }


        }


        this.setState({fields});


    }


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
                baseUrl + "org/email/add",
                {
                    email:data.get("email"),
                    role_id:data.get("role"),

                }

            )
            .then((res) => {

                this.fetchUsers()
                this.props.showSnackbar({show: true, severity: "success", message: "New user added successfully. Thanks"})


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

            }).finally(()=>{

            this.toggleAddUser(false)
        });


    };
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
                        roles: response.data.data,

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.fetchUsers();
    }

    fetchUsers=()=> {
        axios
            .get(baseUrl + "org/approval/all")
            .then(
                (response) => {

                    this.setState({
                        items: response.data.data,

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    handleDelete = () => {


        // return false

        if (this.state.selectedEditItem) {
            axios
                .delete(
                    baseUrl + "org/user/"+this.state.selectedEditItem._key

                )
                .then((res) => {
                    this.toggleDeletePopUp()
                    this.fetchUsers()
                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: `User  removed successfully. Thanks`
                    })


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                });

        }





    };

    toggleDeletePopUp= (key, item) => {

     console.log(key,item)
        this.setState({
            selectedEditItem: item,
            showDeletePopUp: !this.state.showDeletePopUp,

        })
    }



    render() {
        return (
<>

            <div className="container ">

                <PageHeader
                    pageTitle="Approve Users"
                    subTitle="Approve users registering on the platform"
                />

                <div className="row">

                    <div className="col-12 mt-4">


                        {this.state.items.map((item,index)=>
                            <div key={index}>

                               <ManageUserItem systemUser approveType toggleDeletePopUp={(key,selection)=>this.toggleDeletePopUp(key,selection)}
                                               refreshList={this.fetchUsers} item={item} index={index}/>

                            </div>

                        )}

                    </div>
                </div>




            </div>

    <GlobalDialog size={"xs"} hide={this.toggleDeletePopUp} show={this.state.showDeletePopUp} heading={"Remove User"} >
        <div
            className={"col-12 mb-3 text-left"}>
            Are you sure you want to remove this user ?
        </div>

        <div
            className={"col-6"}
            style={{
                textAlign: "center",
            }}>
            <GreenButton

                onClick={
                    this.handleDelete
                }
                title={"Submit"}
                type={"button"}>

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

                onClick={
                    this
                        .toggleDeletePopUp
                }
            >

            </BlueBorderButton>
        </div>

    </GlobalDialog>

    <GlobalDialog size={"xs"} hide={()=>this.toggleAddUser(false)} show={this.state.showAddPopUp} heading={"Add User"} >
        <>
            <form className={"full-width-field"} onSubmit={this.handleSubmit}>


            <div className="col-12 ">

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

        </div>
                <div className="col-12 ">

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
                </div>
            </form>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SystemManageUser);
