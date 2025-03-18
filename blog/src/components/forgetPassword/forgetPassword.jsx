import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from 'react-router-dom';
import { IoReturnDownBack } from "react-icons/io5";
import axios from 'axios';
import bcrypt from 'bcryptjs';

import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";

const ForgetPassword = () => {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        validate,
        watch,
    } = useForm();
    const [forgetMsg, setForgetMsg] = useState("");
    const [userData, setUserData] = useState(null);
    const password = watch("password");

    useEffect(() => {
        // Fetch user data from the API
        const fetchUserData = async (e) => {

            try {
                const response = await axios.get('http://localhost:3002/users');
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);



    const forgotPassword = async (data) => {
        const user = userData.find(user => user.email === data.email);

        if (!user) {
            setForgetMsg("Email not found");
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const response = await axios.put(`http://localhost:3002/users/${user.id}`, {
                ...user,
                password: hashedPassword
            });
            console.log("Password update response:", response.data);
            setForgetMsg("Password reset successful");
            navigate("/login")
            reset();
        } catch (error) {
            console.error("Error updating password:", error);
            setForgetMsg("Error updating password");
        }
    };
    return (
        <>
            <div className="w-screen flex justify-center mt-6 font-roboto">
                <Card color="transparent" shadow={true} className="bg-gray-200 p-8 bg-opacity-80  shadow-2lg shadow-2xl rounded-3xl">
                    <Typography variant="h4" color="blue-gray">
                        Recover Your Account
                    </Typography>

                    <form onSubmit={handleSubmit(forgotPassword)} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-3">
                            <Typography variant="h6" color="blue-gray" >
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
                                onFocus={() => setForgetMsg("")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm  transition-all transition-duration-500 transition-ease">
                                    {errors.email.message}
                                </p>
                            )}
                            <Typography variant="h6" color="blue-gray" >
                                Password <span className="text-red-600">*</span>
                            </Typography>
                            <Input
                                type="password"
                                size="lg"
                                placeholder="********"
                                className={`bg-transparent placeholder:text-slate-400 text-sm border pl-3   transition-duration-100 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xl focus:shadow ${errors.password ? "border-red-500" : "border-gray-500"}`}
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required",
                                    },
                                    maxLength: {
                                        value: 15,
                                        message: "Password should be less than 15 characters",
                                    },
                                    minLength: {
                                        value: 8,
                                        message: "Password should be more than 8 characters",
                                    } ` `

                                })}
                                onFocus={() => setForgetMsg("")}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm transition-all transition-duration-200 transition-ease">
                                    {errors.password.message}
                                </p>
                            )}
                            <Typography variant="h6" color="blue-gray" >
                                Confirm Password <span className="text-red-600">*</span>
                            </Typography>
                            <Input
                                type="password"
                                size="lg"
                                placeholder="********"
                                className={`bg-transparent placeholder:text-slate-400 text-sm border pl-3   transition-duration-100 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xl focus:shadow ${errors.forget ? "border-red-500" : "border-gray-500"}`}
                                {...register("forget", {
                                    required: {
                                        value: true,
                                        message: "Confirm your password",
                                    },
                                    validate: value =>
                                        value === password || "Password and confirm password should be same",
                                })}
                                onFocus={() => setForgetMsg("")}
                            />
                            {errors.forget && (
                                <p className="text-red-500 text-sm transition-all transition-duration-200 transition-ease">
                                    {errors.forget.message}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button variant="gradiant" type="submit" className="h-11 pl-6 w-50 pr-3 text-sm mt-6  cursor-pointer bg-slate-800 text-slate-300 rounded-3xl ">Submit </Button>

                            <NavLink to={"/login"}>
                                <Button variant="gradient" className="bg-slate-900 text-slate-300 p-3 w-50  rounded-3xl   text-sm cursor-pointer mt-6 flex gap-2 items-center justify-center "> <IoReturnDownBack className="text-xl font-bolder" />Return to Login</Button>
                            </NavLink>
                        </div>
                        {forgetMsg && (
                            <Typography color={forgetMsg === "Password reset successful" ? "green" : "red"} className="mt-4 text-center  transition-all transition-duration-200 transition-ease font-semibold">
                                {forgetMsg}
                            </Typography>
                        )}
                    </form>
                </Card>
            </div>
        </>
    )
}

export default ForgetPassword;