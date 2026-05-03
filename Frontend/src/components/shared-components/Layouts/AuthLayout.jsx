import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AuthLayout({ children }) {
  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <main>{children}</main>
    </>
  );
}

export default AuthLayout;
