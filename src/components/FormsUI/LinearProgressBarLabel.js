import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
    return (
        <>
            <Box  sx={{ display: 'flex', alignItems: 'center',margin:0,lineHeight:"unset" }}>
                <span style={{lineHeight:"1"}} className="text-14">{props.label}</span>
            </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress  color={props.white?"secondary":"primary"} variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}`}</Typography>
            </Box>
        </Box>
        </>
    );
}

export default function LinearProgressBarLabel({value,label,white,bgColor}) {
    // const [progress, setProgress] = React.useState(10);
    //
    // React.useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    //     }, 800);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel style={{backgroundColor:`${bgColor?bgColor:"transparent"}`}} label={label} white="white"  value={value} />
        </Box>
    );
}