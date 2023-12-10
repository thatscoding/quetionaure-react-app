import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { AddNewQuestion, FindQuesById } from "../services/api";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { useParams } from "react-router-dom";

const typeOptions = [
  { value: "text", label: "Text" },
  { value: "textArea", label: "TextArea" },
  { value: "date", label: "Date" },
  { value: "checkBox", label: "CheckBox" },
  { value: "radioButton", label: "Radio Button" },
  { value: "uploadFile", label: "Upload File" },
];

const genderoptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const sequenceOption = [
  { value: "random", label: "Random" },
  { value: "ascending", label: "Ascending" },
  { value: "decending", label: "Decending" },
];

export default function AddQuestion() {
  const { id } = useParams();
  // question answer
  const [answer, setAnswer] = useState(null);

  // for Question type
  const [selectedQueType, setselectedQueType] = useState(null);

  // for question requirement(madatory)
  const [selectedRequirement, setselectedRequirement] = useState(null);

  // question sequence
  const [selectedSequence, setSelectedSeqeunce] = useState(null);

  //  question options
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setselectedOptions] = useState([]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [refetch, setRefetch] = useState(true);

  const handleAnserChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  useEffect(() => {
    async function getData() {
      const res = await FindQuesById(id);
      console.log(res?.data.doc);
      setData(res?.data.doc);
      setLoading(false);
    }
    getData();
  }, [refetch]);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  let isCheck = false;
  if (
    selectedQueType?.value === "checkBox" ||
    selectedQueType?.value === "radioButton"
  ) {
    isCheck = true;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      // Save the typed option
      const newOption = {
        value: inputValue.toLowerCase(),
        label: inputValue,
      };
      setselectedOptions([...selectedOptions, newOption]);
      setInputValue("");
      event.preventDefault(); // Prevent form submission or unwanted behavior
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: {},
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    console.log(selectedQueType);
    const res = await AddNewQuestion(data);
    console.log(res);
    reset();
    setselectedQueType(null);
    setSelectedSeqeunce(null);
    setAnswer(null);
    setselectedRequirement(null);
    alert("Successfully added");
  });

  const handleChange = (selectedQueType) => {
    setselectedQueType(selectedQueType);
    setValue("QueType", selectedQueType.value);
  };
  const genderHandleChange = (selectedRequirement) => {
    setselectedRequirement(selectedRequirement);
    setValue("QueRequired", selectedRequirement.value);
  };

  const sequenceHandleChange = (selectedSequence) => {
    setSelectedSeqeunce(selectedSequence);
    setValue("QueSequence", selectedSequence.value);
    setValue("options", selectedOptions);
  };

  const handlechangeAnswer = (a) => {
    setAnswer(a);
    setValue("answer", a.value);
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
            <div className="mx-1 sm:mx-0 lg:mx-4">
              <h1 className="text-center text-xl md:text-2xl font-bold my-12">
                Edit Question
              </h1>
              <Link
                to={"/"}
                className="bg-blue-500 text-white rounded w-36 h-8 flex justify-center items-center mb-6"
              >
                All Questions
              </Link>
              <form onSubmit={onSubmit} className="flex flex-col">
                <div className="flex flex-col gap-2">
                  <p>
                    Question Name{" "}
                    <span className="font-bold text-red-500">*</span>
                  </p>
                  <input
                    {...register("QueName")}
                    placeholder="Question Name"
                    className="border rounded pl-2 text-base py-1"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p>
                    Question Type{" "}
                    <span className="font-bold text-red-500">*</span>
                  </p>
                  <Select
                    value={selectedQueType}
                    onChange={handleChange}
                    options={typeOptions}
                    placeholder="Select an option"
                    required
                  />
                </div>

                {isCheck && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p>
                      Options <span className="font-bold text-red-500">*</span>
                    </p>
                    <Select
                      isMulti
                      options={selectedOptions}
                      inputValue={inputValue}
                      onInputChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      isSearchable
                      placeholder="Type Option and press Enter to add the next option"
                    />
                  </div>
                )}

                {isCheck && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p>
                      Select Answer{" "}
                      <span className="font-bold text-red-500">*</span>
                    </p>
                    <Select
                      options={selectedOptions}
                      onChange={handlechangeAnswer}
                      value={answer}
                      placeholder="Select answer"
                      required
                    />
                  </div>
                )}

                {selectedQueType && (
                  <div className="flex flex-col gap-2">
                    <p>
                      Question Requirement{" "}
                      <span className="font-bold text-red-500">*</span>
                    </p>
                    <Select
                      options={genderoptions}
                      onChange={genderHandleChange}
                      value={selectedRequirement}
                      placeholder="is question madatory?"
                      required
                    />
                  </div>
                )}

                {selectedQueType && (
                  <div className="flex flex-col gap-2">
                    <p>
                      Question Sequence{" "}
                      <span className="font-bold text-red-500">*</span>
                    </p>
                    <Select
                      options={sequenceOption}
                      onChange={sequenceHandleChange}
                      value={selectedSequence}
                      placeholder="Select sequence"
                      required
                    />
                  </div>
                )}

                <div className=" flex justify-center mt-8">
                  <input
                    type="submit"
                    className="bg-blue-600 flex justify-center items-center h-8 w-36 text-white rounded "
                  />
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
