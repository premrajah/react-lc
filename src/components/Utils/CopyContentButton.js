import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function CopyContentButton({ value }) {
    return (
        <ContentCopyIcon
            className='click-item' sx={{ "&:hover": { color: "var(--lc-green)" }, "&:active": { color: "var(--lc-purple)" } }}
            onClick={() => navigator.clipboard.writeText(value)}
        />)
}

export default CopyContentButton