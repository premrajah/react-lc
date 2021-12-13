import React from 'react'
import {styled} from '@mui/material/styles';
import Select from "@mui/material/Select";


const CustomizedSelect = styled(Select)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },


    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        // backgroundColor: '#fcfcfb' ,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '100%',
        // padding: '10px 12px',
        padding: '18.5px 14px',
        // height: "1.188em",
        transition: theme.transitions.create([

            // 'background-color',
            // 'box-shadow',
        ]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            // '-apple-system',
            // 'BlinkMacSystemFont',
            // '"Segoe UI"',
            // 'Roboto',
            // '"Helvetica Neue"',
            // 'Arial',
            // 'sans-serif',
            // '"Apple Color Emoji"',
            // '"Segoe UI Emoji"',
            // '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            boxShadow: `none`,
            borderColor: "none",
            outlineColor:"none",
            outline:"none",
            border: '1px solid #ced4da',
            borderRadius: 4
        },
        '&:focused': {
            boxShadow: `none`,
            borderColor: "none",
            outlineColor:"none",
            outline:"none",
            border: '1px solid #ced4da',
            borderRadius: 4
        },
        '&::active': {
            boxShadow: `none`,
            borderColor: "none",
            outlineColor:"none",
            outline:"none",
            border: '1px solid #ced4da',
        },
        // '&:hover': {
        //     boxShadow: `none`,
        //
        //     outlineColor:"none",
        //     outline:"none",
        //     border: 'none!important',
        // },

        // '&::after': {
        //     boxShadow: `none`,
        //     borderColor: "none",
        //     outlineColor:"none",
        //     outline:"none",
        //     border: 'none',
        // },
        // '&::before': {
        //     boxShadow: `none`,
        //     borderColor: "none",
        //     outlineColor:"none",
        //     outline:"none",
        //     border: 'none',
        // },
    },
}));


export default CustomizedSelect;
