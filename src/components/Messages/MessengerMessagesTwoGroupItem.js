import {ListItem, ListItemText} from "@mui/material";

const MessengerMessagesTwoGroupItem = ({message_group, index}) => {
    return <ListItem alignItems="flex-start">
        <ListItemText primary={message_group.name.replaceAll("+", ", ")} />
    </ListItem>
}

export default MessengerMessagesTwoGroupItem;