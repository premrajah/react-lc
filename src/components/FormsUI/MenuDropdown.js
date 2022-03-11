import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useEffect} from "react";


export default function MenuDropdown(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [options, setOptions] = React.useState(props.options);

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };



    useEffect(()=>{


        if (props.initialValue) {
            if (props.valueKey) {

                console.log(props.options.findIndex((itemObj)=> itemObj._id===props.initialValue))

                // alert(props.options.findIndex((itemObj)=> itemObj._id===props.initialValue))

                setSelectedIndex(props.options.findIndex((itemObj)=> itemObj._id===props.initialValue))
                // setSelectedIndex(
                //     props.options.indexOf(props.initialValue.findIndex((item)=> item._key===props.initialValue)))

            } else {
                setSelectedIndex(
                    props.options.indexOf(props.initialValue))
            }
        }
    },[options])

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);


        if (props.setSelection){

            if (props.valueKey){
            props.setSelection(options[index][props.valueKey])}
            else{
                props.setSelection(options[index])
            }


        }
        // alert(options[index])
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <List
                className={"p-0"}
                component="span"
                aria-label="Device settings"
                sx={{ bgcolor: 'background.paper' }}
            >
                <ListItem
                    button
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                >
                    {props.option?options[selectedIndex][props.option]:options[selectedIndex]}

                    {/*{options[selectedIndex]}*/}
                    <KeyboardArrowDownIcon/>
                </ListItem>
            </List>
            <Menu
                style={{width:"200px!important",height:props.height}}
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={props.valueKey?props.valueKey:option}
                        // disabled={option === props.initialValue}
                        // selected={props.initialValue?props.initialValue:index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option.name?option.name:option}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
