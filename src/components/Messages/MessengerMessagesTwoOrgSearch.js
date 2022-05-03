
import React, {useState} from "react";
import AsyncSelect from 'react-select/async';
import {Autocomplete, TextField} from "@mui/material";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

const MessengerMessagesTwoOrgSearch = ({showSnackbar}) => {
    const [inputValue, setInputValue] = useState([]);


    const handleInputChange = (e) => {
        setInputValue(e);
    };

    const handleNewMessageSelectAsync = async (value) => {
        if(!value) return;

        try {
            const result = await axios.get(`${baseUrl}org/search?o=0&s=20&q=${value}`);
            const data = result.data.data;

            return data;

        } catch (error) {
            showSnackbar({
                show: true,
                severity: "warning",
                message: `Org search error ${error.message}`,
            });
        }
    };

    const loadOptions = async (value, callback) => {
        const response = await handleNewMessageSelectAsync(value);
        callback(response.orgs.map(o => ({value: o._id, label: o.name})));

        //   // callback(object.map(i => ({ label: `${i.fields.firstName} - ${i.fields.lasName} , value: i.fields.firstName })))

        // simulate async operation
        // setTimeout(() => {
        //     callback([
        //         { value: "apple", label: "Apple" },
        //         { value: "amazon", label: "Amazon" },
        //         { value: "Microsoft", label: "Microsoft" }
        //     ]);
        // }, 1000);
    };

    return <div>
        <AsyncSelect
            isClearable
            defaultOptions
            placeholder="Search Orgs"
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            isMulti
            noOptionsMessage={i => "Search..."}
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