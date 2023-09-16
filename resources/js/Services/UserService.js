import axios from "axios";

export const UserService = {
    addEnterprisesToUser(enterpriseInfo) {
        return axios.post(`/api/enterprise-user`, enterpriseInfo)
            .then((res) => res.data);
    },

    getEnterprisesInfo(id){
        return axios.get(`/api/enterprise-user/${id}`) 
            .then((res) => res.data);
    },

    removeEnterprisesInfo(id, data){
        return axios.delete(`/api/enterprise-user/${id}`, data) 
            .then((res) => res.data);
    },

    addCollegesToUser(enterpriseInfo) {
        return axios.post(`/api/college-user`, enterpriseInfo)
            .then((res) => res.data);
    },

    getCollegesInfo(id){
        return axios.get(`/api/college-user/${id}`) 
            .then((res) => res.data);
    },

    removeCollegeInfo(id, data){
        return axios.delete(`/api/college-user/${id}`, data) 
            .then((res) => res.data);
    }
};