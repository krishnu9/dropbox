// Create a login page that uses the login store to toggle the login state.
//

import LoginForm from "~/pages/(components)/LoginForm";
import { useLoginStore } from "~/store/loginStore";

const Login = () => {

    return (
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                <LoginForm />
            </div>
    );
}

export default Login;