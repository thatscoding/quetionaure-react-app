import { useEffect, useState } from "react";
import { AddFeedback, DeleteQuestion, GetAllQuestions } from "../services/api";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { MdDeleteForever } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";

function Questions() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [cal, setCal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAnserChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  useEffect(() => {
    async function getData() {
      const res = await GetAllQuestions();
      console.log(res?.data.docs);
      setQuizData(res?.data.docs);
      setLoading(false);
    }
    getData();
  }, [refetch]);

  const handleFileChange = (event) => {
    // Get the selected file
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const deleteQuestion = async (id) => {
    console.log(id);
    const res = await DeleteQuestion(id);
    console.log(res);
    setRefetch(!refetch);
    alert("successfully deleted.");
    setLoading(true);
  };

  const checkAnswer = (e, ans) => {
    console.log(e.target.value, "=>", ans);
    setSelectedAnswer((prevSelectedAnswer) => [...prevSelectedAnswer, ans]);
  };

  const handleOptionChange = (selectedOption, questionId) => {
    console.log(selectedOption, questionId);
    setQuizData((prevQuizData) =>
      prevQuizData.map((question) =>
        question._id === questionId
          ? { ...question, selectedAnswer: selectedOption }
          : question
      )
    );
  };
  // console.log(quizData);

  const handleSubmitform = async () => {
    setFormSubmitted(true);
    setCal(true);

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await AddFeedback(formData);
        console.log(res);
        setSelectedFile(null);
        alert("File uploaded successfully");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file");
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <HashLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          <div className="container lg:max-w-6xl mx-auto ">
            <div className="mx-1 sm:mx-0 flex flex-col gap-3 my-8 lg:mx-4">
              <h1 className="my-6 text-center font-bold text-3xl">Questions</h1>

              <Link
                to={"/add-question"}
                className="bg-blue-500 text-white rounded w-36 h-8 flex justify-center items-center"
              >
                Add Questions
              </Link>

              <div className="flex flex-col gap-4">
                {quizData.map((d, index) => (
                  <div className="" key={index}>
                    <div className="flex justify-between text-base bg-gray-200 pl-2 py-1 rounded-md">
                      <h2 className=" font-semibold  capitalize">
                        {index + 1}) {d.title}
                        {d.required == "yes" && (
                          <span className="font-bold text-red-500"> *</span>
                        )}
                      </h2>

                      <span className="flex gap-2 items-center pr-2">
                        <span
                          className="cursor-pointer"
                          onClick={() => deleteQuestion(d._id)}
                        >
                          <MdDeleteForever className="text-red-600" />
                        </span>
                        <Link to={`edit-question/${d._id}`}>
                          <span className="cursor-pointer">
                            <RiFileEditFill className="text-green-600" />
                          </span>
                        </Link>
                      </span>
                    </div>

                    {d.options && d.type == "radioButton" && (
                      <div className="bg-gray-100 rounded-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                          {d.options.map((opt, index) => (
                            <div className=" p-4 text-center key={index}">
                              <div className="flex gap-2 items-center capitalize">
                                <input
                                  type="radio"
                                  checked={d.selectedAnswer === opt.value}
                                  value={opt.value}
                                  // onChange={(e) => checkAnswer(e, d.answer)}
                                  onChange={(e) =>
                                    handleOptionChange(e.target.value, d._id)
                                  }
                                  disabled={isFormSubmitted}
                                />
                                <span>{opt.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {d.options && d.type == "checkBox" && (
                      <div className="bg-gray-100 rounded-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                          {d.options.map((opt, index) => (
                            <div className=" p-4 text-center" key={index}>
                              <div className="flex gap-2 items-center capitalize">
                                <input type="checkbox" />
                                <span>{opt.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {d.type == "text" && (
                      <div className="border border-gray-500 rounded px-2 py-1">
                        <input type="text" placeholder="text" />
                      </div>
                    )}

                    {d.type == "textArea" && (
                      <div className="border border-gray-500 rounded px-2 py-1">
                        <textarea
                          name=""
                          id=""
                          cols="30"
                          rows="3"
                          placeholder="textArea"
                        ></textarea>
                      </div>
                    )}

                    {d.type == "date" && (
                      <div className="border border-gray-500 rounded px-2 py-1">
                        <input type="date" />
                      </div>
                    )}

                    {d.type == "uploadFile" && (
                      <div className="border border-gray-500 rounded px-2 py-1">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          name="avatar"
                        />
                      </div>
                    )}

                    {cal &&
                      d?.selectedAnswer &&
                      (d.answer === d.selectedAnswer ? (
                        <h1 className="text-green-500 font-semibold ">
                          Correct Anser : {d.answer}
                        </h1>
                      ) : (
                        <>
                          <h1 className="text-red-500 font-semibold">
                            Wrong Answer : {d.selectedAnswer}
                          </h1>
                          <h1 className="text-green-500 font-semibold ">
                            Correct Answer : {d.answer}
                          </h1>
                        </>
                      ))}
                  </div>
                ))}

                <div className="flex justify-center">
                  <button
                    // disabled={isFormSubmitted}
                    onClick={() => handleSubmitform()}
                    className={
                      "bg-blue-500 text-white rounded w-36 h-8 flex justify-center items-center cursor-pointer"
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Questions;
