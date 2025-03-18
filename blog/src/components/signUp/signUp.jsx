import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import bcrypt from "bcryptjs";

export function Signup() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    async function Submit(data) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds)
            console.log(hashedPassword)
            const userData = { ...data, password: hashedPassword };

            await axios.post("http://localhost:3002/users", userData);
            console.log("user data submitted :", userData)
            navigate("/")
        } catch (error) {
            console.error("Error Submittiing user data : ", error)
        }
    }

    return (
        <div className="w-full flex justify-center mt-6">
            <Card color="transparent" shadow={false} className="bg-gray-200 p-5">
                <Typography variant="h4" color="blue-gray">
                    Sign Up
                </Typography>

                <form onSubmit={handleSubmit(Submit)} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-2">
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                            Your Name <span className="text-red-700">*</span>
                        </Typography>
                        <Input
                            type="text"
                            size="lg"
                            placeholder="Enter your name"
                            className={`w-full bg-transparent placeholder:text-FormPlaceHolder text-slate-900 text-sm border rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${errors.name ? "border-red-500" : "border-gray-500"}`}
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "Name is required",
                                },
                                maxLength: {
                                    value: 30,
                                    message: "Name should be less than 30 characters",
                                },
                                minLength: {
                                    value: 3,
                                    message: "Name should be more than 3 characters",
                                },
                            })}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm transition-all ">{errors.name.message}</p>
                        )}
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                            Your Email <span className="text-red-700">*</span>
                        </Typography>
                        <Input
                            type="text"
                            size="lg"
                            placeholder="Enter your email"
                            className={`w-full bg-transparent placeholder:text-FormPlaceHolder text-slate-900 text-sm border rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${errors.email ? "border-red-500" : "border-gray-500"}`}
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Email is required",
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Invalid email address",
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
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm transition-all">{errors.email.message}</p>
                        )}
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            Password <span className="text-red-700">*</span>
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            className={`w-full bg-transparent placeholder:text-FormPlaceHolder text-slate-900 text-sm border rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${errors.password ? "border-red-500" : "border-gray-500"}`}

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
                                },

                            })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>
                    <Checkbox className="mt-4"
                        label={
                            <Typography
                                variant="small"
                                color="gray"
                                className="flex items-center font-normal  "
                            >
                                I agree to the
                                <a
                                    href="#"
                                    className="font-medium transition-colors hover:text-gray-900"
                                >
                                    &nbsp;Terms and Conditions <span className="text-red-500">*</span>
                                </a>
                            </Typography>
                        }

                        {...register("checkbox", {
                            required: {
                                value: true,
                                message: "Please accept Terms and Conditions before submitting",
                            },
                        })}
                    />
                    {errors.checkbox && (
                        <p className="text-red-500 text-sm">{errors.checkbox.message}</p>
                    )}
                    <Button type="submit" variant="gradient" className=" text-slate-300 mt-6 bg-slate-800 rounded-3xl cursor-pointer pl-8 pr-8 text-md w-60 ml-12  pt-2 pb-2  transition-all transition-duration-200 transition-ease font-bold">
                        Sign Up
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Already have an account?{" "}
                        <NavLink to={"/login"}>
                            <strong>Sign In</strong>
                        </NavLink>
                    </Typography>
                </form>
            </Card>
        </div>
    );
}