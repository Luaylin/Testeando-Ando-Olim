export const CollegeService = {
    getColleges() {
        return axios.get('/api/colleges')
            .then((res) => res.data);
    },

    getEnterprisesInfo(id){
        return axios.get(`/api/enterprise-user/${id}`) 
            .then((res) => res.data);
    }
};