import React, {useState} from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {alpha, styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const MessengerMessagesTwoFilterChats = ({handleFilerCallback, handleClearInputCallback}) => {

    const [inputValue, setInputValue] = useState("");

    const filterGroups = (e) => {
        setInputValue(e.target.value);
        handleFilerCallback(e.target.value)
    };

    const handleClearFilterInput = () => {
        setInputValue("");
        handleClearInputCallback(true);
    };

    return <>

        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => filterGroups(e)}

                value={inputValue}
            />
        </Search>

        {/*<div className="">*/}
        {/*    <input*/}
        {/*        type="text"*/}
        {/*        placeholder="Filter conversations"*/}
        {/*        onChange={(e) => filterGroups(e)}*/}
        {/*        className="search-input"*/}
        {/*        value={inputValue}*/}
        {/*    />*/}
        {/*</div>*/}
        {/*<div*/}
        {/*    className="d-flex justify-content-start align-items-center"*/}
        {/*    onClick={() => handleClearFilterInput()}>*/}
        {/*    {inputValue.length > 0 && <ClearIcon/>}*/}
        {/*</div>*/}
    </>
}
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,

    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(0),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        border:"1px solid rgb(206, 212, 218)",
        borderRadius: "4px",
        [theme.breakpoints.up('sm')]: {
            width: '15ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },
}));

export default MessengerMessagesTwoFilterChats;
