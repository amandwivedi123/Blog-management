import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loginMessage, setLoginMessage] = useState("");

    async function MatchData(data) {
        try {
            const response = await axios.get("http://localhost:3002/users");
            const users = response.data;

            const user = users.find(user => user.email === data.email);
            if (user) {
                const passwordMatch = await bcrypt.compare(data.password, user.password);
                if (passwordMatch) {
                    setLoginMessage("Login Success");
                    login();
                    navigate("/home");
                } else {
                    setLoginMessage("password that you've entered is not correct , please try different password");
                }
            } else {
                setLoginMessage("The email address you entered isn't connected to an account");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoginMessage("An error occurred while logging in");
        }
    }

    return (
        <>

            <div className="w-screen flex justify-center mt-6 font-roboto">
                <Card color="transparent" shadow={true} className="bg-gray-200 p-8 bg-opacity-80  shadow-2lg shadow-2xl rounded-3xl">
                    <Typography variant="h4" color="blue-gray">
                        Login
                    </Typography>

                    <form onSubmit={handleSubmit(MatchData)} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-3">
                            <Typography variant="h6" color="blue-gray">
                                Your Email <span className="text-red-600">*</span>
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
                                className={`bg-transparent placeholder:text-slate-400 text-sm border pl-3   transition-duration-100 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xl focus:shadow ${errors.email ? "border-red-500" : "border-gray-500"}`}
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email is required",
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: "Email should be less than 30 characters",
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "Email should be more than 3 characters",
                                    },
                                })}
                                onFocus={() => setLoginMessage("")} // Clear the login message on focus
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm  transition-all transition-duration-500 transition-ease">
                                    {errors.email.message}
                                </p>
                            )}
                            <Typography variant="h6" color="blue-gray">
                                Password <span className="text-red-600">*</span>
                            </Typography>
                            <Input
                                type="password"
                                size="lg"
                                placeholder="********"
                                className={`bg-transparent placeholder:text-slate-400 text-sm border pl-3   transition-duration-100 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xl focus:shadow ${errors.email ? "border-red-500" : "border-gray-500"}`}
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required",
                                    },
                                })}
                                onFocus={() => setLoginMessage("")}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm transition-all transition-duration-200 transition-ease">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button variant="gradiant" type="submit" className="h-11 pl-6 w-50 pr-3 text-sm mt-6  cursor-pointer bg-slate-800 text-slate-300 rounded-3xl ">Login </Button>

                            <NavLink to={"/signup"}>

                                <Button variant="gradient" className="bg-slate-900 text-slate-300 p-3 w-50  rounded-3xl   text-sm cursor-pointer mt-6 ">Create new Account</Button>
                            </NavLink>
                        </div>
                        {loginMessage && (
                            <Typography color={loginMessage === "Login Success" ? "green" : "red"} className="mt-4 text-center  transition-all transition-duration-200 transition-ease font-semibold">
                                {loginMessage}
                            </Typography>
                        )}
                        <Link to="/forget">
                            <p className="mt-3 cursor-pointer hover:text-blue-700 transition-opacity"><u >Forgot your Password</u></p>
                        </Link>
                    </form>
                </Card>
            </div>

        </>
    );
}