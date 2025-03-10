import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

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
  const formRef = useRef(null);

  useEffect(() => {
    // Fetch blogs from API on component mount
    axios
      .get("http://localhost:3001/blogs")
      .then((response) => {
        console.log("Fetched blogs:", response.data);
        setBlogs(response.data);
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const generateCustomId = () => {
    return blogs.length > 0 ? Math.max(...blogs.map((blog) => blog.id)) + 1 : 1; // Generate a custom ID based on the highest existing ID
  };

  const onSubmit = (data, event) => {
    event.preventDefault(); // Prevent default form submission behavior
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
      // Add new blog
      const newBlog = { ...data, id: generateCustomId() };
      axios
        .post("http://localhost:3001/blogs", data)
        .then((response) => {
          setBlogs([...blogs, response.data]);
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
      formRef.current.scrollIntoView({ behavior: "smooth" }); //
    }
  };

  const handleDelete = (index) => {
    const blogToDelete = blogs[index];
    console.log("Deleting blog:", blogToDelete);
    axios
      .delete(`http://localhost:3001/blogs/${blogs[index].id}`)
      .then(() => {
        const newBlogs = blogs.filter((_, i) => i !== index);
        setBlogs(newBlogs);
        console.log("Deleted blog:", blogToDelete);
      })
      .catch((error) => console.error("Error deleting blog:", error));
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      (blog.name &&
        blog.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (blog.description &&
        blog.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6 w-screen">
      <div className="max-w-full mx-auto mt-10 p-6 bg-#232e4d bg-opacity-90 rounded-lg shadow-2lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add a New Blog
        </h2>
        <div className="flex justify-end h-7 items-center ">
          <span className="flex items-center justify-center border hover:bg-white h-full pt-6 rounded-xl  bg-opacity-50 placeholder-gray-400 text-gray-700 text-sm  px-3 py-2 transition duration-100 ease focus:outline-none  hover:border-gray-400">
            <IoIosSearch className="mb-4" />
            <input
              type="search"
              placeholder="Search blogs..."
              className="w-30 mb-4 p-2 border-none outline-none rounded-md text-xs h-full text-roboto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </span>
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="w-full">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Blog Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`w-full bg-transparent-500 bg-opacity-50 placeholder-gray-500 text-gray-700 text-sm border rounded-md px-3 py-2 transition duration-100 ease focus:outline-none focus:border-blue-500 hover:border-gray-400 hover:bg-amber-50 shadow-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter blog name"
              {...register("name", { required: "Blog name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="w-full">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Blog Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              className={`w-full bg-transparent-100 bg-opacity-50 placeholder-gray-500 text-gray-700 text-sm border rounded-md px-3 py-2 transition duration-100 ease focus:outline-none focus:border-blue-500 hover:border-gray-400 shadow-sm hover:bg-amber-50 ${
                errors.description ? "border-red-500" : "border-gray-300"
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
          <button
            type="submit"
            className="w-full mt-4 rounded-md bg-blue-500 py-2 px-4 text-center text-sm text-white hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-100 ease cursor-pointer"
          >
            {editIndex !== null ? "Update Blog" : "Add Blog"}
          </button>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog, index) => (
          <div
            key={index}
            className="p-6  border0.3 border-b-violet-300 rounded-lg shadow-lg bg-white bg-opacity-50"
          >
            <h3 className="text-lg font-bold text-gray-600">{blog.name}</h3>
            <p className="text-sm text-gray-500 mt-2">{blog.description}</p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleEdit(index)}
                className="px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition duration-100 ease cursor-pointer"
              >
                <MdEdit />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-3xl hover:bg-red-600 transition duration-100 ease cursor-pointer"
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
