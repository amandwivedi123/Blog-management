import Form from "./components/form/form";

export default function Homepage() {
  return (
    <>
      <div className="container flex justify-center h-full  bg-linear-to-r from-red-500 via-orange-400 to-yellow-400 dark:via-none dark:from-blue-500 dark:to-teal-400 max-w-screen ">
        <Form />
      </div>
    </>
  );
}
