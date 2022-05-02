
import React, {useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

const MessengerMessagesTwoOrgSearch = ({showSnackbar}) => {

    const [newMsgOrgs, setNewMsgOrgs] = useState([])
    const [open, setOpen] = useState(false)
    const [selectOrgs, setSelectOrgs] = useState([])

    const handleChange = (event, values) => {
        if(!values) return;

        let orgs = [];
        values.forEach((item) => {
            orgs.push(item._key);
        });

        setNewMsgOrgs(orgs);
    };

    const handleReactAsyncOnChange = (e) => {
        const { value, options } = e.target;
        if(!value) return;

        handleNewMessageSelectAsync(value);
        setSelectOrgs([])
    };

    const handleNewMessageSelectAsync = async (inputValue) => {
        try {
            const result = await axios.get(`${baseUrl}org/search?o=0&s=20&q=${inputValue}`);
            const data = result.data.data;


            setSelectOrgs(data.orgs);

        } catch (error) {
            showSnackbar({
                show: true,
                severity: "warning",
                message: `Org search error ${error.message}`,
            });
        }
    };

    return <div>
        {console.log('so ', selectOrgs)}
        <Autocomplete
            className={"m-3"}
            multiple
            onOpen={() => setOpen(true)}
            open={open}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) =>
                option.name === value.name
            }
            // loading={this.state.loading}
            id="messages-search-orgs"
            onChange={() => handleChange()}
            options={
                selectOrgs.length > 0
                    ? selectOrgs
                    : []
            }
            noOptionsText="Enter company name to search"
            variant={"standard"}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
                <TextField
                    {...params}
                    style={{ minHeight: "45px" }}
                    variant="standard"
                    placeholder="Search companies"
                    onChange={(e) => handleReactAsyncOnChange(e)}
                />
            )}
        />
    </div>
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessagesTwoOrgSearch);