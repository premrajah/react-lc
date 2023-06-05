import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { capitalize, getSite, getTimeFormat } from "../../Util/GlobalFunctions";
import { Link } from "react-router-dom";
import MapIcon from "@mui/icons-material/Place";
import Stack from '@mui/material/Stack';
import axios from "axios";
import { baseUrl, googleApisBaseURL, MIME_TYPES } from "../../Util/Constants";
import { Avatar } from "@mui/material";
import placeholderImg from "../../img/place-holder-lc.png";

const CustomDataGridTable=({data,pageSize,count,actions,linkUrl,currentPage,resetSelection,entityType,
                               linkField,dataKey,loading,loadMore,checkboxSelection,
                               setMultipleSelectFlag,actionCallback, items,element,children, ...otherProps}) =>{

    const [tableHeader,setTableHeader] = useState([]);
    const [list,setList] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [listLoading, setListLoading] = React.useState(false);
    const [sortData, setSortData] = React.useState(null);
    const [visibleFields, setVisibleFields] = React.useState({});
    const [currentData, setCurrentData] = React.useState({});
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const [allowSelection, setAllowSelection] = React.useState([]);
    const [initialHeaderState, setInitialHeaderState] = React.useState(false);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const [sortModel, setSortModel] = React.useState();
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSize,
        page: 0,
    });

    const [rowCountState, setRowCountState] = React.useState(count);
    React.useEffect(() => {
        setRowCountState((prevRowCountState) =>
            count !== undefined ? count : prevRowCountState,
        );
    }, [count, setRowCountState]);


    const onReset = () => {
        setSelectionModel([]);
    };

    useEffect(() => {

        if (selectedRows.length>0){
            setMultipleSelectFlag(selectedRows)
        }else{
            setMultipleSelectFlag([])
        }
    },[selectedRows, setMultipleSelectFlag])

    useEffect(() => {
      setAllowSelection(checkboxSelection)

    },[checkboxSelection])

    useEffect(() => {

        if (resetSelection){
            setMultipleSelectFlag([])
            onReset()
        }


    },[resetSelection, setMultipleSelectFlag])


    useEffect(() => {

        setListLoading(loading)
    },[loading])



    useEffect(() => {

        if (data&&(JSON.stringify(data)!==JSON.stringify(currentData))) {

            setPaginationModel({
                pageSize: pageSize,
                page: data.page,
            })

            setPage(data.page)
            setCurrentData(data)
            let headersTmp = []
            let visibleFields = {}
            data.headers.forEach((item) => {

                if (!item.visible){
                    visibleFields[item.field] = item.visible
                }


                headersTmp.push({
                    field: item.subField ? item.subField : item.field,
                    headerName: item.label,
                    editable: false,
                    sortable: item.sortable,
                    sortingOrder: item.sortingOrder ? item.sortingOrder : ['asc', 'desc', null],
                    flex: item.flex ? item.flex : 1,
                    // hide:!item.visible,
                    // hideable: !item.visible,
                    // colSpan: `${item.field==="category"?3:1}`,
                    // minWidth:`${item.field==="category"?300:50}`,
                    // flex:`${item.field==="category"?1:0.5}`,
                    // minWidth:50,
                    // maxWidth:"unset",
                    renderCell: (params) => (
                        <>

                            {params.field === "_ts_epoch_ms" ? <span>
                            {getTimeFormat(params.value)}
                    </span> : params.field === data.linkField ? <span className="text-blue">
                     <Link to={`/${data.linkUrl}/${params.row.id}?${data.linkParams}`}>
                                     <><span className="text-capitalize d-flex align-items-center flex-row">
                                         {entityType==="Product"&&<GetProductImageThumbnail productKey={params.row.id} />}
                                         {entityType==="Site"&&<GetSiteImageThumbnail geo_codes={params.row.geo_codes} />}
                                         {params.value}{params.row.is_head_office&&<span className="text-pink ms-2 text-12 text-bold">(Head Office)</span>}</span></>
                    </Link>
                    </span> : params.field === "year_of_making" ? <span>{(params.value === 0 ? "" : params.value)}</span> :
                                    params.field === "category" ? <GetCatBox item={params.row}/>:params.field === "site" ?
                                    <span><ActionIconBtn onClick={() => actionCallback(params.row.id, "map")}><MapIcon/></ActionIconBtn>
                                    <Link to={`/ps/${params.row.siteId}?${data.linkParams}`}>{params.value}</Link>
                                    </span>: params.value}
                        </>
                    ),

                })

            })
            setVisibleFields(visibleFields)

            if (actions && actions.length > 0) {

                headersTmp.push({
                    field: "action-key",
                    headerName: "Actions",
                    editable: false,
                    sortable: false,
                    hide: false,
                    hideable: false,
                    flex: 1,
                    //       minWidth: 60,
                    // flex:1,
                    renderCell: (params,index) => (
                        <React.Fragment key={index}>
                            {actions.map((action,ind) =>
                                <React.Fragment key={ind}>
                                <ActionIconBtn
                                    onClick={() => actionCallback(params.row.id, action)}
                                >
                                    {action === "edit" ? <EditIcon/> : action === "view" ?
                                        <VisibilityIcon/> : action === "delete" ? <Delete/> : action === "map" ?
                                            <MapIcon/> : action}
                                </ActionIconBtn>
                                </React.Fragment>
                            )}

                        </React.Fragment>
                    ),
                })

            }
            setTableHeader(headersTmp)
            setSortModel(data.headers.filter(item => item.sort))
        }
    }, [actionCallback, actions, currentData, data, entityType, pageSize])

    useEffect(() => {

        // if (items.length>list.length){

        setTimeout(()=>{

            items.forEach((listItem)=>{
                let Product=listItem[`${data.objKey}`]

                if (Product){

                    let itemTmp={}

                    // console.log(headers)
                    data.headers
                        .forEach((item)=>   {
                            try {

                                if (item.subField) {
                                    itemTmp[`${item.subField}`] = Product[`${item.field}`][`${item.subField}`]
                                } else {

                                    if (item.field==="site"){
                                        itemTmp[`${item.field}`] = getSite(listItem).name
                                    }
                                   else if (item.field==="siteId"){
                                        itemTmp[`${item.field}`] = getSite(listItem)._key
                                    }

                                    else{
                                        itemTmp[`${item.field}`] = Product[`${item.field === "id" ? "_key" : item.field}`]
                                    }
                                }
                            }catch(e){
                                console.log(e)
                            }
                        })
                    listTmp.push(itemTmp)
                }
            })
            // console.log(" set data","new data")
            setList(listTmp)

        },100)
        let listTmp=[]
    }, [data.headers, data.objKey, items])

    const handleChange=(dataTmp)=>{
        setSortModel(dataTmp)

        if (loadMore&&dataTmp.length>0){

            let filter={
                key:dataTmp[0].field==="id"?"_key":dataTmp[0].field,
                sort:dataTmp[0].sort
            }
            loadMore(true,filter)
        }
    }


    const handlePopoverOpen = (event) => {
        const field = event.currentTarget.dataset.field
        const id = event.currentTarget.parentElement.dataset.id;
        const row = list.rows.find((r) => r.id === id);
        setValue(row[field]);
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
       <>
           <div style={{  width:"100%" ,flex:1}}>
               <DataGrid
                   className={`${allowSelection?"":"hide-page"}`}
                   checkboxSelection={Boolean(allowSelection)}
                   keepNonExistentRowsSelected
                   autoHeight
                   columnVisibilityModel={visibleFields}
                   disableColumnMenu={true}
                   page={currentPage}
                   onPageChange={(newPage) => {
                       setPage(newPage)
                       loadMore(false,sortData,newPage)
                   }}
                   onPageSizeChange={(newPageSize) => {
                       // alert("page size "+newPageSize)
                        }}
                   // autoPageSize
                   sortModel={sortModel}
                   // onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                   onSortModelChange={(model) => handleChange(model)}
                   sortingMode="server"
                   rowCount={rowCountState}
                   rows={list}
                   columns={tableHeader}
                   pageSize={pageSize}
                   loading={listLoading}
                   rowsPerPageOptions={[pageSize]}

                   disableSelectionOnClick
                   experimentalFeatures={{ newEditingApi: true }}
                   paginationMode="server"
                   paginationModel={paginationModel}
                   onPaginationModelChange={setPaginationModel}
                   rowSelectionModel={rowSelectionModel}

                   onRowSelectionModelChange={(newRowSelectionModel) => {

                       setRowSelectionModel(newRowSelectionModel);
                   }}
                   selectionModel={selectionModel}
                   // onSelectionModelChange={setSelectionModel}

                   onSelectionModelChange={(ids,) => {
                       // setSelectionModel(ids.selectionModel);
                       setSelectionModel(ids)
                       try {
                           const selectedIDs = new Set(ids);
                           const selectedRows = items.filter((row) =>
                               selectedIDs.has(row[entityType]["_key"])
                       );
                           setSelectedRows(selectedRows);
                       }catch (e){
                           console.log(e)
                       }
                   }}

                   components={{
                       NoRowsOverlay: () => (
                           <Stack height="100%" alignItems="center" justifyContent="center">
                               No results found.
                           </Stack>
                       ),
                       NoResultsOverlay: () => (
                           <Stack height="100%" alignItems="center" justifyContent="center">
                               No results found.
                           </Stack>
                       )
                   }}
               />


               </div>

       </>
    );
}



function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            {/*<GridToolbarFilterButton />*/}
            {/*<GridToolbarDensitySelector />*/}
            {/*<GridToolbarExport />*/}
        </GridToolbarContainer>
    );
}





const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));

function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                width="120"
                height="100"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    />
                    <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                </g>
            </svg>
            <Box sx={{ mt: 1 }}>No Rows</Box>
        </StyledGridOverlay>
    );
}



const GetProductImageThumbnail=({productKey})=>{

    const [artifacts, setArtifacts] = useState(null);

    useEffect(() => {
        getArtifacts(productKey);
    }, [productKey]);
    const getArtifacts = (productId) => {
        axios
            .get(`${baseUrl}product/${productId}/artifact`)
            .then((res) => {
                let data = res.data.data;


                if (data.length > 0) {

                    data=data.filter((image)=>  image.mime_type === MIME_TYPES.JPEG ||
                        image.mime_type === MIME_TYPES.JPG ||
                        image.mime_type === MIME_TYPES.PNG)
                    setArtifacts(data);
                }
            })
            .catch((error) => {
                console.debug("get artifact error ", error);
            });
    };

    return(
        <>
        {artifacts && artifacts.length > 0 ? (
            <div className={"me-1"}>
                <Avatar
                    variant="rounded"
                    sx={{ height: 30, width: 30 }}
                    src={artifacts[0].blob_url}
                />
            </div>
        ) : (
            <div className={"me-1"}>
                <Avatar
                    variant="rounded"
                    sx={{ height: 30, width: 30 }}
                    src={placeholderImg}
                />
            </div>
        )}

        </>)

}

const GetSiteImageThumbnail=(props)=>{

    return(
        <>
            {props.geo_codes && props.geo_codes[0] ?

                <div className={"me-1"}>
                    <Avatar
                        variant="rounded"
                        sx={{ height: 30, width: 30 }}
                        src={`${googleApisBaseURL}staticmap?center=${props.geo_codes[0].address_info.geometry.location.lat},${props.geo_codes[0].address_info.geometry.location.lng}
                            &markers=color:0x212529%7Clabel:C%7C${props.geo_codes[0].address_info.geometry.location.lat},${props.geo_codes[0].address_info.geometry.location.lng}
                            &zoom=12&size=${props.smallItem?"110x110":"185x185"}&scale=2&key=AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM`}
                    />
                </div>

                :
                <div className={"me-1"}>
                    <Avatar
                        variant="rounded"
                        sx={{ height: 30, width: 30 }}
                        src={placeholderImg}
                    />
                </div>
            }

        </>)

}



function CustomPagination(props) {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);



    return (
        <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            page={page + 1}
            count={pageCount}
            // @ts-expect-error
            renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
            // onChange={(event, value) => {apiRef.current.setPage(value - 1)}}
        />
    );
}




const GetCatBox=(props)=>{

    // console.log(props.item)
    return(

        <span  className="text-capitlize mb-1 text-12 text-bold cat-box text-left p-1">
                                <span className="text-capitlize">
                                    {capitalize(props.item.category)}
                                </span>
                                <span className={"m-1 arrow-cat"}>&#10095;</span>
                                <span className=" text-capitlize">
                                    {capitalize(props.item.type)}
                                </span>
                                <span className={"m-1 arrow-cat"}>&#10095;</span>
                                <span className="  text-capitlize">
                                    {capitalize(props.item.state)}
                                </span>
                            </span>
    )
}



export default (CustomDataGridTable);







