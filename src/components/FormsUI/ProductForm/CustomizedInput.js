import React from 'react'
import InputBase from '@mui/material/InputBase';
import {styled} from '@mui/material/styles';


const CustomizedInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {

        position: 'relative',
        // backgroundColor:  '#fcfcfb' ,
        width: '100%!important',
        // padding: '10px 12px',
        padding: '18.5px 14px',
        borderRadius: 4,
        fontSize: 16,
        border: '1px solid #ced4da',
        // height: "1.188em",
        // height:theme.height,
        transition: theme.transitions.create([
            // 'border-color',
            // 'background-color',
            // 'box-shadow',
        ]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        // '&:focus': {
        //     boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        //     borderColor: theme.palette.primary.main,
        // },
    },
}));


export default CustomizedInput;
