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



const MessengerMessagesTwo = ({loading, userDetail, showSnackbar}) => {

    const [allGroups, setAllGroups] = useState([]);
    const [clickedMessage, setClickedMessage] = useState([]);
    const [selectedMenuItemIndex, setSelectedMenuItemIndex] =useState(null);
    const [filteredGroups, setFilteredGroups] = useState([]);

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
        console.log(values)
    }


    const handleGroupDataDisplay = (group, index) => {
        return <MenuItem button divider dense disableGutters key={index} selected={selectedMenuItemIndex === index} style={{whiteSpace: 'normal'}}>
            <MessengerMessagesTwoGroupItem  group={group} index={index} handleGroupClickCallback={handleGroupClickCallback} handleSelectedItemCallback={handleSelectedItemCallback} />
        </MenuItem>
    }


    return <React.Fragment>
        <div className="row">
            <div className="col-md-4">
                <div className="row">
                    <div className="col-md-19">
                        <MessengerMessagesTwoFilterChats handleFilerCallback={(v) => handleFilterCallback(v)} />
                    </div>
                    <div className="col-md-1">
                        <div>{allGroups.length}</div>
                    </div>
                    <div className="col-md-1">
                        FI
                    </div>
                    <div className="col-md-1">
                        N
                    </div>
                </div>

            </div>
            <div className="col-md-8">
                search
            </div>
        </div>

        <div className="row">
            <div className="col-md-4">
                {allGroups.length > 0 && <List sx={{height: '500px', maxHeight: '500px', overflow: 'auto', bgColor: 'background.paper'}}>
                    {allGroups.map((g, index) => handleGroupDataDisplay(g, index))}
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