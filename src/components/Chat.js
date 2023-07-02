import { useState, useEffect } from "react"
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from "../firebase-config"
import './styles/Chat.css'


export const Chat = (props) => {

    const { room } = props

    const [newMessage, setNewMessage] = useState("")
    const [messages, setNewMessages] = useState([])

    const messageRef = collection(db, "messages")

    useEffect(() => {
        const queryMessages = query(messageRef, where("room", "==", room), orderBy("createAt"))
        onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                queryMessages.push({ ...doc.data(), id: doc.id })
            })
            setNewMessages(messages)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (newMessage === "") return;

        await addDoc(messageRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room
        })
        setNewMessage("")
    }


    return <div className="chat-app">

        <div className="messages">
            {messages.map((message) => {
                <div className="message" key={message.id}>
                    <span className="user">{message.user}</span>
                    {message.text}
                </div>
            })}
        </div>
        <form onSubmit={handleSubmit} className="new-message-form">
            <input className="new-message-input" placeholder="Type your message here..."
                onChange={(e) => setNewMessage(e.target.value)}
                value="newMessa"
            />
            <button type="submit" className="send-button">Send</button>
        </form>
    </div>
}

