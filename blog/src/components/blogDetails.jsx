import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import { Button, } from "@material-tailwind/react";
import { IoReturnDownBack } from "react-icons/io5";
import { Link } from "react-router-dom";


export default function BlogDetails() {
    const { id } = useParams();
    console.log(id);
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/blogs/${id}`).then((response) => {
            setBlog(response.data);
        })
            .catch((error) => {
                console.error(`Error fetching blog details: ${error}`);
            });
    }, [id]);

    if (!blog) {
        return <div>Loading Blog...</div>;
    }

    return (
        <>
            <div className="flex h-full justify-center items-center p-5 ">
                <Card className="max-w-[full] overflow-hidden bg-gray-200   ">
                    <CardHeader
                        floated={false}
                        shadow={false} s
                        color="transparent"
                        className="m-0 rounded-none"
                    >
                        <img
                            src={blog.image}
                            alt="ui/ux review check"
                        />
                    </CardHeader>
                    <CardBody>
                        <Typography variant="h4" className="text-gray-700 text-lg font-bold">
                            {blog.name}
                        </Typography>
                        <Typography variant="lead" color="gray" className="mt-3 font-normal">
                            {blog.description}
                        </Typography>
                    </CardBody>
                    <CardFooter className="flex items-center justify-between">
                        <div className="flex items-center -space-x-3"></div>
                        <Typography className="font-normal">January 10</Typography>
                    </CardFooter>

                    <div className="flex justify-center items-center mb-3">  <Link to="/home"><Button variant="gradient" className="bg-slate-900 p-3 w-90 rounded-3xl  font-semibold  text-slate-300 text-sm cursor-pointer mt-6 flex justify-center gap-2 items-center">  <IoReturnDownBack className="text-xl font-bold" /> Return To blogs </Button></Link>     </div>

                </Card>
            </div>
        </>
    );
}   