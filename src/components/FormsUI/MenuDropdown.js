import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function MenuDropdown(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [options, setOptions] = React.useState(props.options);

    const [selectedIndex, setSelectedIndex] = React.useState(props.initialValue?props.options.indexOf(props.initialValue):0);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);


        if (props.setSelection)
        props.setSelection(options[index])
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
                    {options[selectedIndex]}
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
                        key={option}
                        // disabled={option === props.initialValue}
                        // selected={props.initialValue?props.initialValue:index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
