import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { Button, Input, notification } from "antd";
import React, { useEffect, useState } from "react";


function App() {

  const [connection, setConnection] = useState<null | HubConnection>(null);
  const [inputText, setInputText] = useState("");
  const [userId, setUserInputText] = useState("");

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('https://localhost:44306/chatHub')
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (message) => {
            notification.open({
              message: "New Notification",
              description: message,
            });
          });
          // connection.invoke("GetConnectionId").then(function (connectionId){console.log("ConnectionId ", connectionId)});
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const sendMessage = async (e: any) => {
    e.preventDefault()
    if (connection) await connection.invoke("SendMessageToAll", inputText).catch(err => console.error(err.toString()));
    setInputText("");
  };

  // const getConnectionId = async (e: any) => {
  //   e.preventDefault()
  //   if (connection) await connection.invoke("GetConnectionId").then((response) => console.log('This is your data', response)).catch(err => console.error(err.toString()));
  //   setInputText("");
  // }; 

  const SendMessageToUser = async (e: any) => {
    e.preventDefault()
    if (connection) await connection.invoke("SendMessageToUser",userId,inputText).then((response) => console.log('This is your data', response)).catch(err => console.error(err.toString()));
    setInputText("");
  }; 
  
  return (
    <div className="App">
       <Input
        value={inputText}
        onChange={(input) => {
          setInputText(input.target.value);
        }}
      />
      <Input
        value={userId}
        onChange={(input) => {
          setUserInputText(input.target.value);
        }}
      />
      <Button onClick={sendMessage} type="primary">
        Send
      </Button>
      <Button onClick={SendMessageToUser} type="primary">
        Send Message To SpecificUser
      </Button>
    </div>
  );
}

export default App;
