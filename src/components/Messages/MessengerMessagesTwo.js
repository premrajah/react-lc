import React, {useEffect, useState} from 'react'
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {Divider, List} from "@mui/material";
import MessengerMessagesTwoGroupItem from "./MessengerMessagesTwoGroupItem";
import MessengerMessagesTwoSelectedMessage from "./MessengerMessagesTwoSelectedMessage";
import MenuItem from "@mui/material/MenuItem";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import MessengerMessagesTwoFilterChats from "./MessengerMessagesTwoFilterChats";
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClearIcon from '@mui/icons-material/Clear';



const MessengerMessagesTwo = ({loading, userDetail, showSnackbar}) => {

    const [allGroups, setAllGroups] = useState([]);
    const [clickedMessage, setClickedMessage] = useState([]);
    const [selectedMenuItemIndex, setSelectedMenuItemIndex] =useState(null);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [filterVisibility, setFilterVisibility] = useState(false);
    const [filterValues, setFilterValues] = useState("");

    useEffect(() => {
        setSelectedMenuItemIndex(0);
        getAllMessageGroups();
    }, [])


    const getAllMessageGroups = () => {
        axios
            .get(`${baseUrl}message-group/non-empty/expand`)
            .then((res) => {
                const data = res.data.data;
                setAllGroups(data);
                setFilteredGroups(data);

                // on first load handle click
                if(selectedMenuItemIndex === 0) {
                    handleGroupClickCallback(data[0].message_group._key)
                }
            })
            .catch(error => {
                showSnackbar({show:true, severity:"warning", message: `${error.message}`})
            })
    }

    const getSelectedGroupMessage = (key) => {
        axios
            .get(`${baseUrl}message-group/${key}/message`)
            .then((res) => {
                setClickedMessage(res.data.data);
            })
            .catch(error => {
                showSnackbar({show:true, severity:"warning", message: `${error.message}`})
            })
    }

    const handleGroupClickCallback = (key) => {
        setClickedMessage([]) // clear selected message
        getSelectedGroupMessage(key);
    }

    const handleSelectedItemCallback = (selectedIndex) => {
        setSelectedMenuItemIndex(selectedIndex);
    }

    const handleFilterCallback = (values) => {
        setFilterValues(values);
        if(filterValues) {
            let temp = allGroups.filter((g, index) => {
                return g.message_group.name && g.message_group.name.toLowerCase().includes(values.toLowerCase());
            })

            setFilteredGroups(temp);

        } else {
            setFilteredGroups(allGroups);
        }


    }

    const handleFilterVisibility = () => {
        setFilterVisibility(!filterVisibility);

        if(filterVisibility) {
            setFilteredGroups(allGroups);
        }
    }

    const handleClearFilterInput = () => {
        setFilteredGroups(allGroups)
        setFilterValues("");
    }


    const handleGroupDataDisplay = (group, index) => {
        return <MenuItem button divider dense disableGutters key={`${index}_${group.message_group._key}`} selected={selectedMenuItemIndex === index} style={{whiteSpace: 'normal'}} >
            <MessengerMessagesTwoGroupItem  group={group} index={index} handleGroupClickCallback={handleGroupClickCallback} handleSelectedItemCallback={handleSelectedItemCallback} />
        </MenuItem>
    }


    return <React.Fragment>
        <div className="row" style={{height: '45px'}}>
            <div className="col-md-4">
                <div className="row" >
                    <div className="col-md-10 d-flex justify-content-around">
                        {filterVisibility && <>
                            <MessengerMessagesTwoFilterChats handleFilerCallback={(v) => handleFilterCallback(v)}/>
                            <div className="d-flex justify-content-start align-items-center" onClick={() => handleClearFilterInput()}>{filterValues.length > 0 &&
                                    <ClearIcon/>}</div>
                            <div className="d-flex justify-content-start align-items-center">{filteredGroups.length}</div>
                        </>}
                    </div>

                    <div className="col-md-1">
                        <div className="d-flex justify-content-center align-items-center" style={{height: '45px'}}>
                            <FilterListIcon onClick={() => handleFilterVisibility()} />
                        </div>
                    </div>

                    <div className="col-md-1">
                        <div className="d-flex justify-content-center align-items-center" style={{height: '45px'}}>
                            <AddCircleIcon />
                        </div>
                    </div>

                </div>

            </div>
            <div className="col-md-8">
                search
            </div>
        </div>

        <div className="row">
            <div className="col-md-4">
                {filteredGroups.length > 0 && <List sx={{height: '500px', maxHeight: '500px', overflow: 'auto', bgColor: 'background.paper'}}>
                    {filteredGroups.map((g, index) => handleGroupDataDisplay(g, index))}
                </List>}
            </div>
            <div className="col-md-8">
                {clickedMessage.length > 0 && <div style={{height: '500px', maxHeight: '500px', overflow: 'auto'}}><MessengerMessagesTwoSelectedMessage messages={clickedMessage} /></div>}
            </div>
        </div>
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessagesTwo);