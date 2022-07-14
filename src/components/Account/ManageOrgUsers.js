import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import * as actionCreator from "../../store/actions/actions";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeAlphabatically, fetchErrorMessage} from "../../Util/GlobalFunctions";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import ManageApproval from "./ManageApproval";
import ManageUser from "./ManageUser";

class ManageOrgUsers extends Component {
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
            activeKey:"1",
        };

    }


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


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
        this.setActiveKey(null,"1")

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

    handleDelete = () => {

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
                        pageTitle="Manage Users"
                        subTitle="Assign roles to your team"
                    />
                    <div className="row">
                                                <div className="col-12 text-right text-blue">
                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <TabContext value={this.state.activeKey}>
                                        <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                            <TabList

                                                allowScrollButtonsMobile
                                                variant="centered"

                                                scrollButtons="auto"
                                                textColor={"#27245C"}
                                                TabIndicatorProps={{
                                                    style: {
                                                        backgroundColor: "#27245C",
                                                        padding: '2px',
                                                    }
                                                }}
                                                onChange={this.setActiveKey}


                                                aria-label="lab API tabs example">

                                                <Tab label="Manage Users" value="1" />

                                                <Tab label="Manage Approvals" value="2"/>

                                            </TabList>
                                        </Box>

                                        <TabPanel value="1">
                                            <ManageUser/>

                                        </TabPanel>

                                        <TabPanel value="2">
                                            <ManageApproval/>

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

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageOrgUsers);
