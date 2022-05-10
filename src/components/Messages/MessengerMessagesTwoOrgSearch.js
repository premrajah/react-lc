
import React, {useEffect, useState} from "react";
import AsyncSelect from 'react-select/async';
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

const MessengerMessagesTwoOrgSearch = ({showSnackbar, handleOrgSelectedCallback}) => {
    const [inputValue, setInputValue] = useState([]);

    useEffect(() => {
        setInputValue([]);

        return () => {
            setInputValue([]); // reset orgs selected
            handleOrgSelectedCallback([]);
        }
    }, [])

    const handleInputChange = (e) => {
        setInputValue(e);
    };

    const handleChange = (value) => {
        handleOrgSelectedCallback(value)
    }


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
    };

    return <div>
        <AsyncSelect
            isClearable
            defaultOptions
            placeholder="Search Orgs"
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            onChange={handleChange}
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