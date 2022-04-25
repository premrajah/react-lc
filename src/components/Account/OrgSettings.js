import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import * as actionCreator from "../../store/actions/actions";
import {fetchErrorMessage} from "../../Util/GlobalFunctions";
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {styled} from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import {Autocomplete, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Chip from "@mui/material/Chip";

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


class OrgSettings extends Component {
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
            expanded:false,
            allSettings:null,
            orgSettings:null,
            matching_brands: [],
            acceptable_domains:[],
            notification_settings:[],
            notifSettingsOptions:["entity_ownership_change", "tracked_entity_update", "delete_org_entity", "misc_class",
                "update_org_entity", "add_entity_to_org"],
            is_qr_mono:false,
            qr_format_name:null,
            allow_external_product_read:null,
            allow_external_site_read:false,
            allow_external_site_write:false,
            allow_external_org_read:false,


        };

    }


     handleExpandClick = () => {
        this.setState({expanded:!this.state.expanded});
    };


    fetchOrgSettings=(orgId)=> {
        axios
            .get(baseUrl + "org/"+orgId)
            .then(
                (response) => {




                    if (response.data.data.org.settings) {



                        let options=[]
                            let   notification_settings=response.data.data.org.settings&&response.data.data.org.settings.notification_settings?response.data.data.org.settings.notification_settings.value:[]


                        if (notification_settings.length>0)
                            options=this.state.notifSettingsOptions.filter((option,index)=>  notification_settings[option])



                        this.setState({
                            matching_brands:  response.data.data.org.settings.matching_brands?response.data.data.org.settings.matching_brands.value:[] ,
                            acceptable_domains: response.data.data.org.settings.acceptable_domains?response.data.data.org.settings.acceptable_domains.value:[] ,
                            is_qr_mono:  response.data.data.org.settings.is_qr_mono?response.data.data.org.settings.is_qr_mono.value:false ,
                            qr_format_name: response.data.data.org.settings.qr_format_name? response.data.data.org.settings.qr_format_name.value:"png" ,
                            allow_external_product_read: response.data.data.org.settings.allow_external_product_read? response.data.data.org.settings.allow_external_product_read.value :"open",
                            notification_settings: options,
                            allow_external_site_read: response.data.data.org.settings.allow_external_site_read? response.data.data.org.settings.allow_external_site_read.value:false,
                            allow_external_site_write:  response.data.data.org.settings.allow_external_site_write?response.data.data.org.settings.allow_external_site_write.value:false,
                            allow_external_org_read: response.data.data.org.settings.allow_external_org_read? response.data.data.org.settings.allow_external_org_read.value:false ,

                        })

                    }

                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }





    fetchAllSettings=()=> {
        axios
            .get(baseUrl + "org/setting")
            .then(
                (response) => {

                    this.setState({
                        allSettings:response.data.data
                    })



                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }




    handleChange(value, field) {


            let fields = this.state.fields




            if (field=="notification_settings"){

            let selectedValues={}
              value.forEach((item)=>{
                  selectedValues[item]=true
              })

                fields[field] = {value:selectedValues };
            }
        else  {
            fields[field] = {value:value};
        }

        this.setState({
            [field]:value
        })
            this.setState({fields});

    }


    addOption=(event,field,valueToRemove, remove)=>{


        let values=this.state[field]

        if (remove) {
            values=  values.filter((item)=> item!==valueToRemove)
        }
        else{

            const form = event.currentTarget;

            const data = new FormData(event.target);
            const option = data.get("option");
                values.push(option)
        }

        this.setState({
            [field]:values
        })


        let fields = this.state.fields


        // if (field==="matching_brands"){

            fields[field] = {value:values};
        // }


        this.setState({

            fields
        })


}


    submitSettings=()=>{

        axios
            .post(baseUrl + "org/"+this.props.orgId,{
                settings:this.state.fields
            })
            .then(
                (response) => {

                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: "Org settings saved successfully. Thanks",
                    });


                },
                (error) => {
                    // var status = error.response.status

                    this.props.showSnackbar({
                        show: true,
                        severity: "error",
                        message: fetchErrorMessage(error),
                    });


                }
            );

    }


    componentDidMount() {

        this.fetchOrgSettings(this.props.orgId)

        // this.fetchAllSettings()


    }


    render() {
        return (
<>


    <TableContainer component={Paper}>
        <Table className={"custom-table"} sx={{ minWidth: 650 }} aria-label="simple table">

            <TableBody>

                    <TableRow
                        className={"custom-table-row"}
                        key={1}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            Is Qr Code Mono
                        </TableCell>
                        <TableCell align="right">
                            <Switch checked={this.state.is_qr_mono} onChange={(event, checked)=>{this.handleChange(checked,"is_qr_mono")}} name={"is_qr_mono"}  />
                        </TableCell>

                    </TableRow>

                <TableRow
                    className={"custom-table-row"}
                    key={1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Qr Code Format
                    </TableCell>
                    <TableCell align="right">
                        <SelectArrayWrapper
                            initialValue={this.state.qr_format_name?this.state.qr_format_name:"png"}
                            onChange={(value) =>
                                this.handleChange(value, "qr_format_name")
                            }
                            name={"qr_format_name"}  options={["png","jpg","bmp"]} />
                    </TableCell>

                </TableRow>

                <TableRow
                    className={"custom-table-row"}
                    key={1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Allow External Site Read
                    </TableCell>
                    <TableCell align="right">
                        <Switch checked={this.state.allow_external_site_read}  onChange={(event, checked)=>{this.handleChange(checked,"allow_external_site_read")}} name={"allow_external_site_read"}  />
                    </TableCell>
                </TableRow>

                <TableRow
                    className={"custom-table-row"}
                    key={1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Allow External Site Write
                    </TableCell>
                    <TableCell align="right">
                        <Switch

                            checked={this.state.allow_external_site_write}
                            onChange={(event, checked)=>{this.handleChange(checked,"allow_external_site_write")}} name={"allow_external_site_write"}


                        />
                    </TableCell>
                </TableRow>

                <TableRow
                    className={"custom-table-row"}
                    key={1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Allow External Org Read
                    </TableCell>
                    <TableCell align="right">
                        <Switch checked={this.state.allow_external_org_read}
                                onChange={(event, checked)=>{this.handleChange(checked,"allow_external_org_read")}} name={"allow_external_org_read"}  />
                    </TableCell>
                </TableRow>

                <TableRow
                    className={"custom-table-row"}
                    key={1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Allow External Product Read
                    </TableCell>
                    <TableCell align="right">
                        <SelectArrayWrapper


                           initialValue={this.state.allow_external_product_read?this.state.allow_external_product_read:"open"}
                            onChange={(value) =>
                                this.handleChange(value, "allow_external_product_read")
                            }
                            name={"allow_external_product_read"}  options={["open","partial","restricted"]} />

                    </TableCell>
                </TableRow>

                {this.props.isVisible && <TableRow
                className={"custom-table-row"}
                key={1}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    Acceptable Domains
                </TableCell>

                    <TableCell align="right">

                        <div className="justify-content-end align-items-center d-flex flex-row">
                            <div className="row mt-2">
                                <div className="col-6">
                                    {this.state.acceptable_domains.map((item, index) =>
                                        <Chip
                                            className={"m-1"}
                                            key={index}

                                            onDelete={()=>this.addOption(null,"acceptable_domains",item,true)}
                                            label={item}

                                        />
                                    )}
                                </div>

                                <div
                                    className="col-6 text-center "
                                >
                                    <form className={"d-flex flex-row align-items-center "}
                                          onSubmit={(event)=>
                                          { event.preventDefault(); event.stopPropagation();
                                              this.addOption(event,"acceptable_domains",null,false)  }}>

                                        <TextFieldWrapper
                                            name={`option`}
                                            variant={"standard"}
                                            required={true}
                                            native
                                            onChange={()=>{}}
                                        />
                                        <IconButton className={"ml-2"} type={"submit"}>
                                            <AddIcon    />
                                        </IconButton>
                                    </form>
                                </div>

                            </div>

                        </div>

                    </TableCell>

            </TableRow> }
                {this.props.isVisible && <TableRow
                    className={"custom-table-row"}
                    key={1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Matching matching_brands
                    </TableCell>
                    <TableCell align="right">

                        <div className="justify-content-end align-items-center d-flex flex-row">
                            <div className="row mt-2">
                                <div className="col-6">
                            {this.state.matching_brands.map((item, index) =>
                                        <Chip
                                            className={"m-1"}
                                            key={index}

                                           onDelete={()=>this.addOption(null,"matching_brands",item,true)}
                                            label={item}

                                        />
                            )}
                                </div>

                                    <div
                                        className="col-6 text-center "
                                       >
                                        <form className={"d-flex flex-row align-items-center "}
                                              onSubmit={(event)=>
                                              { event.preventDefault(); event.stopPropagation();
                                              this.addOption(event,"matching_brands",null,false)  }}>

                                        <TextFieldWrapper
                                            name={`option`}
                                            variant={"standard"}
                                            required={true}
                                            native
                                            onChange={()=>{}}
                                        />
                                        <IconButton className={"ml-2"} type={"submit"}>
                                        <AddIcon    />
                                        </IconButton>
                                        </form>
                                    </div>

                            </div>

                        </div>

                    </TableCell>
                </TableRow>}

                <TableRow
                    className={"custom-table-row"}
                    key={1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        Notification Settings
                    </TableCell>
                    <TableCell align="right">

                        <Autocomplete
                            className={"m-3"}
                            multiple

                            value={this.state.notification_settings}
                            id="tags-standard"
                            onChange={(event, value, reason, details) =>this.handleChange(value,"notification_settings")}
                            options={this.state.notifSettingsOptions}
                            variant={"standard"}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    style={{ minHeight: "45px" }}
                                    variant="standard"
                                    placeholder=""
                                />
                            )}
                        />



                    </TableCell>
                </TableRow>



            </TableBody>
        </Table>
    </TableContainer>

    <div className={"row"}>

        <div className="col-12 text-center mt-4">

            <BlueButton
                onClick={this.submitSettings}
                fullWidth
                title={"Submit"}
                type={"button"}>

            </BlueButton>


        </div>

    </div>




                        <div className={"d-none"} >
                            <span className={"title-bold mr-2"}>Org Settings</span>
                            <ExpandMore
                                expand={this.state.expanded}
                                onClick={this.handleExpandClick}
                                aria-expanded={this.state.expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>

                            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography>
                                        Set aside off of the heat to let rest for 10 minutes, and then serve.
                                    </Typography>
                                </CardContent>
                            </Collapse>
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
export default connect(mapStateToProps, mapDispatchToProps)(OrgSettings);
