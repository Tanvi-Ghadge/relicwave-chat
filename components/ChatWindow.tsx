import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  return (
    <div className="flex flex-1 flex-col">
      <MessageList />
      <ChatInput />
    </div>
  );
}
