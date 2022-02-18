import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import {Edit} from "@mui/icons-material";
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
import {arrangeAlphabatically} from "../../Util/GlobalFunctions";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import ManageUserItem from "./ManageUserItem";

class ManageUser extends Component {
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
            showEdit:false,
            selectedKey:null,
            editMode:false,
            allPerms:[],
            selectedEditItem:null
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

    toggleEdit=async (edit, key, item) => {


        await this.fetchAllPermissions()

        this.props.toggleRightBar()
        this.setState({
            editMode: edit,
            selectedKey: key,
            selectedEditItem: item,
            showEdit: !this.state.showEdit,
        })
    }


    handleValidation() {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("name", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),
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



        let fields= this.state.fields

        fields.type="org_other"

        // return false
        axios
            .put(
                baseUrl + "role",

                fields

            )
            .then((res) => {

                this.fetchRoles()
                this.props.toggleRightBar()
                this.props.showSnackbar({show: true, severity: "success", message: "Role created successfully. Thanks"})


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            });


    };


    componentDidMount() {
        window.scrollTo(0, 0);
        this.fetchUsers();
    }

    fetchUsers=()=> {
        axios
            .get(baseUrl + "org/user")
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

    render() {
        return (


            <div className="container ">

                <PageHeader
                    pageTitle="Manage Users"
                    subTitle="Assign roles to your team"
                />

                <div className="row">
                    <div className="col-12">


                        {this.state.items.map((item,index)=>
                            <>  <hr/>
                               <ManageUserItem item={item} index={index}/>

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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
