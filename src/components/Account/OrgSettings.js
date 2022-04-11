import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import * as actionCreator from "../../store/actions/actions";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeAlphabatically, fetchErrorMessage} from "../../Util/GlobalFunctions";
import {getKey, removeKey, saveKey} from "../../LocalStorage/user-session";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {styled} from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
            expanded:false

        };

    }


     handleExpandClick = () => {
        this.setState({expanded:!this.state.expanded});
    };

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


    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>

    <div>

        <FormGroup>
            <FormControlLabel control={<Switch defaultChecked />} label="Label" />
            <FormControlLabel disabled control={<Switch />} label="Disabled" />
        </FormGroup>
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
