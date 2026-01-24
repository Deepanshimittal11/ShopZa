import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import ChatButton from "../ChatBot/ChatButton";
const UserLayout = () => {
  return (
    <>
    {/* Header */ }
    <Header/>
    {/* Main Content*/}
    <main>
      <Outlet/>
    </main>
    {/* Footer */}
    <Footer/>
    {/* Chat Button */}
    <ChatButton/>
    </>
  )
}

export default UserLayout