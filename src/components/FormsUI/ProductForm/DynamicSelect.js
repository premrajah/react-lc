import React, {useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CustomPopover from "../CustomPopover";
import InfoIcon from "./InfoIcon";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const DynamicSelectArrayWrapper = (props) => {

    const {label,title,option,initialValue,initialValueTextbox,detailsHeading,details,placeholder,valueKey,subValueKey,subOption,
        name,select,onChange, helperText,disabled,defaultValueSelect,filterKey,editMode,filterData,apiUrl,searchKey,errorNoMessage, defaultValue,options,error, ...rest} = props;

    const [value, setValue] = React.useState(initialValue);
    const [response, setResponse] = React.useState([]);
    const [valueTextbox, setValueTextbox] = React.useState(initialValue);
    const [open, setOpen] = React.useState(false);
    const loading = open && (options?(options.length === 0):(response.length === 0));
    const reset=(clearExistingOptions)=>{


        setValue(null)
        setValueTextbox(null)


        if (onChange)
        onChange(null,null)
    }


    const  handleSearch = (event,searchValue) => {

        loadData(searchValue)

    };
    const handleChange = (event,selectValue) => {

        if (selectValue) {

            if (typeof selectValue === 'string') {
                setValue(selectValue);
                setValueTextbox(selectValue);
                onChange(selectValue,selectValue)
            } else if (subOption) {
                setValue(selectValue[`${valueKey}`][`${subValueKey}`])
                setValueTextbox(selectValue[`${option}`][`${subOption}`])
                if (onChange) {
                    onChange(selectValue[`${valueKey}`][`${subValueKey}`],selectValue[`${option}`][`${subOption}`])
                }
            } else {
                setValue(selectValue[`${valueKey}`])
                setValueTextbox(selectValue[`${option}`])
                if (onChange) {
                    onChange(selectValue[`${valueKey}`],selectValue[`${option}`])
                }
            }
        }else{
            loadData()
           reset(false)
        }

    };

    useEffect(()=>{
                if (!options){
                    loadData()
                }
    },[])


    useEffect(()=>{
        if (initialValue&&initialValueTextbox){
            if (onChange&&!editMode) {
                onChange(initialValue)
            }
            setValue(initialValue)
            setValueTextbox(initialValueTextbox)
        }

    },[initialValue])

     const loadData = (searchValue) =>  {

        let url=apiUrl

         if (searchValue)
         url = url+encodeURI(`&size=10&offset=0&or=${searchKey}~%${searchValue}%`)

         setResponse([])
        axios.get(url).then(
            (res) => {
                let items=res.data.data
                if (filterData&&filterData.length>0){
                    try{
                       items= items.reverse().filter((item)=>
                            typeof item === 'string'
                                ? !(filterData.find(item))
                                : subValueKey
                                    ? !filterData.find(itemTemp=> itemTemp===item[`${valueKey}`][`${subValueKey}`])
                                    : !filterData.find(itemTemp=> itemTemp===item[`${valueKey}`])
                        )
                    }catch (e){
                    }

                   setResponse(items )
                }else{
                    setResponse(items)
                }

            },
            (error) => {
                // let status = error.response.status
                // dispatch({ type: "PRODUCT_LIST", value: [] })
            }
        )
            .catch(error => {});

        // dispatch({ type: "PRODUCT_LIST", value: [] })
    };





    return (
        <>
            {title&& <div className={"custom-label text-bold ellipsis-end text-blue mb-0"}>
                {title} {details&&<CustomPopover heading={detailsHeading} text={details}><InfoIcon/></CustomPopover>}
            </div>}
            <div className={"field-box mb-2"}>
                <FormControl variant="outlined" >
                    {label && <InputLabel >{label}</InputLabel>}
                    <Autocomplete
                        style={{width:"100%", }}
                        value={valueTextbox}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}

                        onChange={
                            (event,value) =>{
                                handleChange(event,value)
                        }}
                        className={`custom-autocomplete ${error&&"border-red-error"}`}
                        renderInput={(params) =>
                            <TextField
                                 onChange={(event) =>handleSearch(event,event.target.value)}
                                 variant="standard" {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        }
                        options={options?options:response}
                        getOptionLabel={(optionTmp) => {

                            return (typeof optionTmp === 'string'
                                ? optionTmp :subOption? optionTmp[`${option}`][`${subOption}`]:optionTmp[`${option}`])
                        }}
                        noOptionsText="No results found"
                        renderOption={(props, optionTmp) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>

                                {typeof optionTmp === 'string'
                                    ? optionTmp
                                    :subOption
                                        ? optionTmp[`${option}`][`${subOption}`]
                                        :optionTmp[`${option}`]
                                }
                            </Box>
                        )}


                        // value={value}

                    />
                    <input name={name}
                           type={"hidden"} value={value}/>

                </FormControl>

                {error && <span style={{color:"#f44336",fontSize: "12px!important"}} className={"text-danger"}> {error.message}</span>}
                {errorNoMessage && <span style={{color:"#f44336",fontSize: "12px!important"}} className={"text-danger"}> Required</span>}

            </div>
        </>
    );
};

export default DynamicSelectArrayWrapper;
