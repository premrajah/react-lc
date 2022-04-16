
const MessengerMessagesTwoSelectedMessage = ({messages}) => {

    const handleSelectedMessageDisplay = (m, index) => {


        return <div key={index}>{m.message.text}</div>
    }

    return <>
        {messages.length > 0 && messages.map((m,i) => handleSelectedMessageDisplay(m, i))}
    </>
}

export default MessengerMessagesTwoSelectedMessage;