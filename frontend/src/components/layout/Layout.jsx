import Navbar from "./Navbar";

const Layout = ({ children }) => {
    return (
        <div data-theme="linkedin" className="min-h-screen bg-white">
            <Navbar/>
            <main className="max-w-7xl mx-auto px-4 py-6 bg-white">{children}</main>
        </div>
    )
};

export default Layout;