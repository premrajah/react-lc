import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect } from "react";
import ErrorBoundary from "../ErrorBoundary";

import Paper from '@mui/material/Paper';
export default function MenuDropdown(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [options, setOptions] = React.useState(props.options);

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        if (props.initialValue) {
            if (props.valueKey) {
                setSelectedIndex(
                    props.options.findIndex((itemObj) => itemObj._id === props.initialValue)
                );
            } else {
                setSelectedIndex(props.options.indexOf(props.initialValue));
            }
        }
    }, [props.initialValue,options]);



    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);

        if (props.setSelection) {
            if (props.valueKey) {
                props.setSelection(options[index][props.valueKey]);
            } else {
                props.setSelection(options[index]);
            }
        }

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
        <ErrorBoundary skip>
            <List
                style={{ width: "auto",backgroundColor:"none!important" }}
                className={"p-0"}
                component="span"
                aria-label="Device settings"

            >
                <ListItem
                    style={{ background:"none!important" }}
                    button
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded=
                        {open ? "true" : undefined}
                    onClick={handleClickListItem}>
                    {props.option ? options[selectedIndex][props.option] : options[selectedIndex]}

                    {/*{options[selectedIndex]}*/}
                    <KeyboardArrowDownIcon />
                </ListItem>
            </List>

            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                // MenuListProps={{
                //     "aria-labelledby": "lock-button",
                //     role: "listbox",
                // }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={props.valueKey ? props.valueKey : option}
                        onClick={(event) => handleMenuItemClick(event, index)}>
                        {option.name ? option.name : option}
                    </MenuItem>
                ))}
            </Menu>

        </ErrorBoundary>

        </>
    );
}
