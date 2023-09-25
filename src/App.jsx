import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

// const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const App = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Ibrahim Bujawa! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);

      const content = response.choices[0]?.message?.content;
      console.log(response);
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + import.meta.env.VITE_OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          background: "white",

          padding: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            padding: 0,
            margin: 0,
            backgroundColor: "white",
            color: "#355eeb",
            fontStretch: "expanded",
            fontWeight: "bolder",
            textAlign: "left",
          }}
        >
          Chat
          <span style={{ color: "gray" }}>WithMe</span>
        </h1>
      </div>
      <div
        style={{
          position: "relative",
          height: "500px",
          margin: "auto",
          marginTop: 25,
        }}
      >
        <MainContainer style={{ paddingTop: "2rem", borderRadius: 6 }}>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="ChatGPT is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Send a Message"
              onSend={handleSendRequest}
            />
          </ChatContainer>
        </MainContainer>
      </div>
      <footer
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
        }}
      >
        <div>
          <h1
            style={{
              background: "white",
              fontSize: 15,
              color: "gray",
              fontWeight: "bolder",
            }}
          >
            Made by Ibrahim Bujawa{" "}
            <span style={{ color: "#355eeb" }}>U1/19/CSC/1599</span>
          </h1>
        </div>
      </footer>
    </>
  );
};

export default App;
