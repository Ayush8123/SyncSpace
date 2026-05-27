import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

import api from "../api/axios";

function WorkspacePage() {
  const { workspaceId } = useParams();
  const [channels, setChannels] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] =useState("");

  const fetchWorkspace = async () => {
    try {
      const response = await api.get(`/workspaces/${workspaceId}`);

      setWorkspace(response.data.workspace);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchChannels = async () => {
    try {
      const response = await api.get(`/channels/${workspaceId}`);

      setChannels(response.data.channels);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
  if (!selectedChannel) return;
    try {
      const response =
        await api.get(
          `/messages/${selectedChannel.id}`
        );
      setMessages(response.data.messages);
    } 
    catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchWorkspace();
    fetchChannels();
  }, []);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {

  if (!selectedChannel) return;

  socket.emit(
    "join_channel",
    selectedChannel.id
  );

}, [selectedChannel]);

useEffect(() => {

  fetchMessages();

}, [selectedChannel]);

useEffect(() => {

  socket.on(
    "receive_message",
    (message) => {

      setMessages((prev) => [
        ...prev,
        message,
      ]);

    }
  );

  return () => {
    socket.off("receive_message");
  };

}, []);
  const handleCreateChannel = async (e) => {
    e.preventDefault();

    try {
      await api.post("/channels", {
        name: channelName,
        workspaceId,
      });

      setChannelName("");

      fetchChannels();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-10">
        {workspace?.name || "Workspace"}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-bold mb-4">Create Channel</h2>

        <form onSubmit={handleCreateChannel} className="flex gap-4">
          <input
            type="text"
            placeholder="Channel name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="flex-1 border p-3 rounded-lg"
          />

          <button type="submit" className="bg-black text-white px-6 rounded-lg">
            Create
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Channels</h2>

        <div className="space-y-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className={`
    border p-4 rounded-lg cursor-pointer transition
    ${
      selectedChannel?.id === channel.id
        ? "bg-black text-white"
        : "hover:bg-gray-100"
    }
  `}
            >
              <h3 className="text-xl font-semibold"># {channel.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">

  <h2 className="text-2xl font-bold mb-6">
    Messages
  </h2>

  <div className="space-y-4 mb-6">

    {messages.map((message) => (

      <div
        key={message.id}
        className="border p-4 rounded-lg"
      >

        <p className="font-bold">
          {message.sender.username}
        </p>

        <p>
          {message.content}
        </p>

      </div>

    ))}

  </div>

  {selectedChannel && (

    <form
      onSubmit={(e) => {
        e.preventDefault();

        socket.emit(
          "send_message",
          {
            content: messageInput,
            channelId: selectedChannel.id,
            senderId: JSON.parse(
              atob(
                localStorage
                  .getItem("token")
                  .split(".")[1]
              )
            ).userId,
          }
        );

        setMessageInput("");
      }}
      className="flex gap-4"
    >

      <input
        type="text"
        placeholder="Type message..."
        value={messageInput}
        onChange={(e) =>
          setMessageInput(e.target.value)
        }
        className="flex-1 border p-3 rounded-lg"
      />

      <button
        type="submit"
        className="bg-black text-white px-6 rounded-lg"
      >
        Send
      </button>

    </form>

  )}

</div>
    </div>
  );
}

export default WorkspacePage;
