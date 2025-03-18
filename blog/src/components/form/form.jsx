import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaBlog } from "react-icons/fa6";
import { Button, } from "@material-tailwind/react";


export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [blogs, setBlogs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [idCounter, setIdCounter] = useState(1);
  const formRef = useRef(null);

  useEffect(() => {

    axios
      .get("http://localhost:3001/blogs")
      .then((response) => {
        console.log("Fetched blogs:", response.data);
        setBlogs(response.data);

        const ids = response.data.map((blog) => Number(blog.id)).filter((id) => !isNaN(id));
        if (ids.length > 0) {
          setIdCounter(Math.max(...ids) + 1);
        }
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const onSubmit = (data,) => {
    // event.preventDefault();
    console.log("Form submitted data:", data);
    if (editIndex !== null) {
      // Edit existing blog
      axios
        .put(`http://localhost:3001/blogs/${blogs[editIndex].id}`, data)
        .then((response) => {
          const updatedBlogs = [...blogs];
          updatedBlogs[editIndex] = response.data;
          setBlogs(updatedBlogs);
          setEditIndex(null);
          console.log("Updated blog data:", response.data);
        })
        .catch((error) => console.error("Error updating blog:", error));
    } else {
      const newBlog = { ...data, id: idCounter.toString() };
      axios
        .post("http://localhost:3001/blogs", newBlog)
        .then((response) => {
          setBlogs([...blogs, response.data]);
          setIdCounter(idCounter + 1);
          console.log("Added blog data:", response.data);
        })
        .catch((error) => console.error("Error adding blog:", error));
    }
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleEdit = (index) => {
    const blog = blogs[index];
    reset(blog);
    console.log("Editing blog:", blog);
    setEditIndex(index);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = (index) => {
    const blogToDelete = blogs[index];
    console.log("Deleting blog with ID:", blogToDelete.id);
    axios
      .delete(`http://localhost:3001/blogs/${blogToDelete.id}`)
      .then(() => {
        const newBlogs = blogs.filter((_, i) => i !== index);
        setBlogs(newBlogs);
        console.log("Deleted blog with ID:", blogToDelete.id);
      })
      .catch((error) => console.error("Error deleting blog:", error));
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.name && blog.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 w-screen">
      <div className="max-w-150 mx-auto mt-10 p-6 bg-gray-200 bg-opacity-90 rounded-2xl  shadow-xl ">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add a New Blog
        </h2>
        <div className="flex justify-end h-7 items-center ">
          <span className="flex items-center justify-center border hover:bg-white h-full pt-6 rounded-xl  bg-opacity-50 placeholder-gray-400 text-gray-700 text-sm  px-3 py-2 transition duration-100 ease focus:outline-none  hover:border-gray-400">
            <IoIosSearch className="mb-4" />
            <input
              type="search"
              placeholder="Search blogs..."
              className="w-30 mb-4 p-2 border-none outline-none rounded-4xl text-xs h-full text-roboto hover:bg-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </span>
        </div>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <div className="w-full">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Blog Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`w-full bg-transparent-500 bg-opacity-50 placeholder-gray-500 text-gray-700 text-sm border rounded-2xl px-3 pb-3 pt-3 transition duration-100 ease focus:outline-none focus:border-blue-500 hover:shadow-xl shadow-sm ${errors.name ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter blog name"
              {...register("name", { required: "Blog name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
              Blog Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              id="description"
              className={`w-full bg-transparent-100 bg-opacity-50 placeholder-gray-500 text-gray-700 text-sm border rounded-2xl pl-3 pt-3 py-2 transition duration-100 ease focus:outline-none focus:border-blue-500 hover:border-gray-400 shadow-lg ${errors.description ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter blog description"
              {...register("description", {
                required: "Blog description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex justify-center items-center">
            <Button type='submit' variant="gradient" className="bg-slate-900 p-3 w-90 rounded-3xl  font-semibold  text-slate-300 text-sm cursor-pointer mt-6 flex justify-center gap-2 items-center">   {editIndex !== null ? "Update Blog" : `Add Blog`} <FaBlog /></Button>
          </div>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">

        {filteredBlogs.map((blog, index) => (

          <div
            key={index}
            className="p-6  border0.3 border-b-violet-300 rounded-lg shadow-xl bg-gray-200 bg-opacity-50 "
          >
            <div

              color="transparent"
              className="m-0 rounded-none"
            >
              <img className="rounded-lg mb-3"
                src={blog.image}
                alt="ui/ux review check"
              />
            </div>
            <Link to={`/blog/${blog.id}`}>
              <h3 className="text-lg font-bold text-gray-600">{blog.name}</h3>
            </Link>
            <p className="text-sm text-gray-500 mt-2">{blog.description}</p>
            <div className="flex  gap-3.5 mt-5 justify-center  h-12 w-full">
              <button
                onClick={() => handleEdit(index)}
                className="px-4 py-2 bg-slate-100 text-xl text-slate-800 rounded-3xl hover:bg-gray-300 transition duration-100 ease cursor-pointer"
              >
                <MdEdit />
              </button>

              <button
                onClick={() => handleDelete(index)}
                className="px-4 py-2 bg-slate-100 text-xl text-red-700 rounded-3xl hover:bg-gray-300 transition-all transition-duration-100  transition-ease cursor-pointer"
              >
                <MdDelete />
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}