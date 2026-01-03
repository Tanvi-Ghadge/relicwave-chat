import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
