import axios from "axios";

export const AddNewQuestion = async (data: any) => {
    try {
        return await axios.post(`http://localhost:8000/v1/question/add`, data);
    } catch (error) {
        console.log(error);
    }
};

export const GetAllQuestions = async () => {
    try {
        return await axios.get(`http://localhost:8000/v1/question/all`);
    } catch (error) {
        console.log(error);
    }
};

export const FindQuesById = async (id: string) => {
    try {
        return await axios.get(`http://localhost:8000/v1/question/${id}`);
    } catch (error) {
        console.log(error);
    }
};


export const DeleteQuestion = async (id: string) => {
    try {
        return await axios.delete(`http://localhost:8000/v1/question/${id}`);
    } catch (error) {
        console.log(error);
    }
};

export const UpdateQuestion = async (data: any, id: string) => {
    try {
        return await axios.put(`http://localhost:8000/v1/question/${id}`, data);
    } catch (error) {
        console.log(error);
    }
};

export const AddFeedback = async (data: any) => {
    try {
        return await axios.post(`http://localhost:8000/v1/feedbacks/add`, data, {
            headers: {
                "content-type": "multipart/form-data",
            },
        });
    } catch (error) {
        console.log(error);
    }
};

export const AllFeedbacks = async () => {
    try {
        return await axios.get(`http://localhost:8000/v1/feedbacks/all`);
    } catch (error) {
        console.log(error);
    }
};