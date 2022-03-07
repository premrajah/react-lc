import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import {Cancel,CheckCircle, Close,Delete, Edit, Info, Done} from "@mui/icons-material";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import * as actionCreator from "../../store/actions/actions";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CustomPopover from "../FormsUI/CustomPopover";
import {Spinner} from "react-bootstrap";
import GlobalDialog from "../RightBar/GlobalDialog";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";

class ManageUserItem extends Component {
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
            selectedEditItem:null,
            role:null,
            btnLoading:false,
            user:null,
            status: {show:false,type:""},
            approveMode:false,
            roles:[]
        };

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
                        roles: response.data.data,

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    fetchRole=(id)=> {

        axios
            .get(baseUrl + "role/"+id.replace("Role/",""))
            .then(
                (response) => {

                    this.setState({
                        role: response.data.data,

                    });


                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }
    fetchUser=(id)=> {

        axios
            .get(baseUrl + "user/"+id)
            .then(
                (response) => {

                    this.setState({
                        user: response.data.data,

                    });


                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    toggleEdit=async (edit, key, item) => {


        if (item)
            await this.fetchRoles()

        this.setState({
            editMode: edit,
            selectedKey: key,
            selectedEditItem: item,
            showEdit: !this.state.showEdit,
        })
    }


    toggleApprove=async (edit, key, item) => {


        if (item)
            await this.fetchRoles()

        this.setState({
            approveMode: !this.state.approveMode,

        })
    }


    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({fields});

    }

    handleChangeRole(value, field) {


        if (value) {
            this.setState({
                btnLoading: true,

            });

            axios
                .post(
                    baseUrl + "org/email/add",
                    {
                        email: this.state.user.email,
                        role_id: value
                    }
                )
                .then((res) => {

                    this.toggleEdit()

                    this.fetchRole(value)
                    this.props.toggleRightBar()
                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: "User role updated successfully. Thanks"
                    })


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                }).finally(() => {

                    this.setState({
                        btnLoading: false,

                    });
                }
            );
        }

    }


    handleSubmitUser = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({
            btnLoading: true,

        });

        const data = new FormData(event.target);
        const role_id=data.get("role")


        // return false
        axios
            .post(
                baseUrl + "org/user/approve",

                {
                    user_id: this.state.user._key,
                    role_id:role_id.replace("Role/",""),
                    approve:true,
                    org_id: this.props.item.org_id?this.props.item.org_id.replace("Org/",""):null,
                }

            )
            .then((res) => {

                this.toggleApprove()

                this.setState({

                    status:{type:"Approved",show:true}

                })



            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            }).finally(()=>{

                this.setState({
                    btnLoading: false,

                });
            }

        );


    };


    approveUser=(role_id,approve)=>{


        axios
            .post(
                baseUrl + "org/user/approve",

                {
                    user_id: this.state.user._key,
                    org_id: this.props.item.org_id,
                    role_id: role_id,
                    approve:approve
                }
            )
            .then((res) => {

                this.setState({

                    status:approve?{type:"Approved",show:true}:{show:true,type:"Rejected"}

                })


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            }).finally(() => {

                this.setState({
                    btnLoading: false,

                });
            }
        );

    }


    componentDidMount() {
        window.scrollTo(0, 0);

        if (this.props.item.user){
            this.setState({
                user:this.props.item.user
            })

            if (this.props.item.role_id)
                this.fetchRole(this.props.item.role_id)

        }
        // else{
        //     this.fetchUser(this.props.item._key)
        // }

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

        const index=this.props.index
        return (
            <>

                <div className="row min-row-height-90 d-flex hover-bg flex-row pb-2 pt-2 border-top align-items-center justify-content-start">
                    <div className=" col-1 justify-content-start">
                        <span className={"text-blue"}>{index+1}. </span>

                    </div>
                    <div className=" col-5 ">
                        {this.state.user &&   <>
                            <span className={`text-blue text-capitalize`}> {this.state.user.firstName} {this.state.user.lastName}</span>
                            <span className={" text-blue"}>({this.state.user.email})</span></>}
                        {this.state.user &&   this.state.user.email===this.props.userDetail.email&&
                        <span  className={`text-pink ml-2 `}>Logged In User</span>}


                    </div>
                    {!this.props.approveType ?
                        <div className=" col-6 text-right ">


                            {this.state.btnLoading &&
                            <Spinner
                                className="mr-2"
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />}

                            {!this.state.showEdit &&
                            <>
                                            <span className={"text-gray-light text-right"}>
                                            {this.state.role?this.state.role.name:this.props.item.role_id?this.props.item.user.role_id:""}
                                                {this.state.role &&
                                                <CustomPopover heading={this.state.role.name}
                                                               text={this.state.role.perms.length>0?(this.state.role.perms.map((role)=> role+", ")):""}>
                                                    <Info
                                                        style={{ cursor: "pointer", color: "#EAEAEF" }}
                                                        fontSize={"small"}
                                                    />
                                                </CustomPopover>}

                                        </span>
                                <ActionIconBtn
                                    className="ml-4"
                                    onClick={()=>this.toggleEdit(true,this.state.user._key,this.props.item)}><Edit/></ActionIconBtn>

                                <ActionIconBtn onClick={()=>this.props.toggleDeletePopUp(this.state.user._key,this.state.user)}><Delete/></ActionIconBtn>
                            </>}
                            {this.state.showEdit && !this.state.btnLoading &&


                            <div className="row no-gutters">
                                <div
                                    className="col-12 d-flex align-items-center justify-content-end flex-row">

                                    <SelectArrayWrapper
                                        noBorder
                                        // initialValue={item.role_id}
                                        textAlignRight
                                        option={"name"}
                                        select={"Select"}
                                        valueKey={"_id"}
                                        error={this.state.errors["role_id"]}
                                        onChange={(value) => {
                                            this.handleChangeRole(value, "role_id")
                                        }}

                                        // options={this.state.items.filter((item)=> item._key)}
                                        options={this.state.roles}

                                        name={"role_id"}

                                    />

                                    <div className={"ml-4 "}>
                                        {/*<CustomPopover text={"Save Role"}> <ActionIconBtn*/}


                                        {/*    type={"submit"}*/}
                                        {/*    title={"Submit"}*/}
                                        {/*>*/}
                                        {/*    <Done/>*/}
                                        {/*</ActionIconBtn></CustomPopover>*/}
                                        <CustomPopover text={"Cancel"}> <ActionIconBtn className={"mb-2"}
                                                                                       onClick={this.toggleEdit}
                                                                                       type={"button"}
                                                                                       title={"Submit"}
                                        >
                                            <Close/>
                                        </ActionIconBtn></CustomPopover>
                                    </div>


                                </div>
                            </div>

                            }
                        </div>:



                        <div className=" col-6 text-right ">

                            {this.state.status.show &&  <p className={"  status text-right"}>
                                <span className={this.state.status.type=="Approved"?" active text-capitlize":"text-capitlize waiting "}>
                                    {this.state.status.type}
                                </span>
                            </p>}


                            {!this.state.showEdit &&!this.state.status.show &&
                            <>
                          <span className={"text-gray-light text-right"}>
                                            {this.state.role?this.state.role.name:this.props.item.role_id?this.props.item.user.role_id:""}
                              {this.state.role &&
                              <CustomPopover heading={this.state.role.name} text={this.state.role.perms.length>0?(this.state.role.perms.map((role)=> role+", ")):""}>
                                  <Info
                                      style={{ cursor: "pointer", color: "#EAEAEF" }}
                                      fontSize={"small"}
                                  />
                              </CustomPopover>}

                                        </span>

                                <CustomPopover text={"Approve"}>
                                    <ActionIconBtn
                                        className="ml-4"
                                        onClick={()=>this.toggleApprove(true,this.state.user._key,this.props.item)}>
                                        <CheckCircle style={{color:"#07AD89"}} />
                                    </ActionIconBtn>
                                </CustomPopover>
                                <CustomPopover text={"Reject"}>
                                    <ActionIconBtn onClick={()=>this.approveUser(null,false)}><Cancel style={{color:"#A4A4BC"}} /></ActionIconBtn>
                                </CustomPopover>
                            </>}
                            {this.state.showEdit && !this.state.btnLoading &&


                            <div className="row no-gutters">
                                <div
                                    className="col-12 d-flex align-items-center justify-content-end flex-row">

                                    <SelectArrayWrapper
                                        noBorder
                                        textAlignRight
                                        option={"name"}
                                        select={"Select"}
                                        valueKey={"_id"}
                                        error={this.state.errors["role_id"]}
                                        onChange={(value) => {
                                            this.handleChangeRole(value, "role_id")
                                        }}
                                        options={this.state.items}

                                        name={"role_id"}

                                    />

                                    <div className={"ml-4 "}>
                                        <CustomPopover text={"Assign Role"}>
                                            <ActionIconBtn
                                                type={"submit"}
                                                title={"Submit"}
                                            >
                                                <Done />
                                            </ActionIconBtn></CustomPopover>
                                        <CustomPopover text={"Cancel"}>
                                            <ActionIconBtn
                                                className={"mb-2"}
                                                onClick={this.toggleEdit}
                                                type={"button"}
                                                title={"Submit"}
                                            >
                                                <Close/>
                                            </ActionIconBtn></CustomPopover>
                                    </div>


                                </div>
                            </div>

                            }
                        </div>}
                </div>


                <GlobalDialog size={"xs"} hide={()=>this.toggleApprove(false)} show={this.state.approveMode} heading={"Add User"} >
                    <>
                        <form className={"full-width-field"} onSubmit={this.handleSubmitUser}>

                            <div className="col-12 ">


                                <div className="row no-gutters">
                                    <div
                                        className="col-12 ">

                                        {this.state.roles.length>0&&
                                        <SelectArrayWrapper
                                            option={"name"}
                                            select={"Select"}
                                            valueKey={"_id"}
                                            error={this.state.errors["role"]}
                                            onChange={(value) => {
                                                this.handleChange(value, "role")
                                            }}
                                            title={"Assign Role"}
                                            options={this.state.roles.filter((role)=> role.is_system_role)}
                                            name={"role"}
                                        />}

                                    </div>
                                </div>

                            </div>
                            <div className="col-12 ">

                                <div className="row mt-4 no-gutters">
                                    <div  className={"col-6 pr-1"}
                                          style={{
                                              textAlign: "center",
                                          }}>
                                        <GreenButton

                                            title={"Submit"}
                                            type={"submit"}>

                                        </GreenButton>
                                    </div>
                                    <div
                                        className={"col-6 pl-1"}
                                        style={{
                                            textAlign: "center",
                                        }}>
                                        <BlueBorderButton
                                            type="button"

                                            title={"Cancel"}

                                            onClick={()=>
                                                this
                                                    .toggleApprove(false,null)
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageUserItem);
