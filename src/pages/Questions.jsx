import { useEffect, useState } from "react";
import { DeleteQuestion, GetAllQuestions } from "../services/api";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { MdDeleteForever } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";

function Questions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [refetch, setRefetch] = useState(true);

  const handleAnserChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  useEffect(() => {
    async function getData() {
      const res = await GetAllQuestions();
      console.log(res?.data.docs);
      setData(res?.data.docs);
      setLoading(false);
    }
    getData();
  }, [refetch]);

  const deleteQuestion = async (id) => {
    console.log(id);
    const res = await DeleteQuestion(id);
    console.log(res);
    setRefetch(!refetch);
    alert("successfully deleted.");
    setLoading(true);
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
                {data.map((d, index) => (
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
                                  checked={selectedAnswer === opt.value}
                                  value={opt.value}
                                  onChange={(e) => checkAnswer(e, d.answer)}
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
                        <input type="file" />
                      </div>
                    )}

                    <details>
                      <summary className="border border-gray-400 p-1 w-40 flex justify-center items-center rounded mt-4 font-bold">
                        ▶️ Show Answer
                      </summary>
                      <div className="">
                        <p className="pl-6 font-bold capitalize">
                          Answer : {d.answer}
                        </p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Questions;
