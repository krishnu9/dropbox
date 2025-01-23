import { useRouter } from "next/router";
import { useLoginStore } from "~/store/loginStore";

const Header = () => {

    const { isLoggedIn, login, logout } = useLoginStore();
    const router = useRouter()

    const buttonText: String = isLoggedIn ? "Logout" : "Login";
    const buttonAction = isLoggedIn ? logout : () => {router.push('/auth/login')};

    return <header className="flex justify-end items-center p-4 bg-themeColor2 text-white sticky top-0 z-10">
        <button className="bg-themeColor3 px-4 py-2 rounded" onClick={buttonAction}>{buttonText}</button>
    </header>
}

export default Header;