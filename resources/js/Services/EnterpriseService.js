export const EnterpriseService = {
    getEnterprises() {
        return axios.get('/api/enterprise')
            .then((res) => res.data);
    },

    getEnterprisesInfo(id){
        return axios.get(`/api/enterprise-user/${id}`) 
            .then((res) => res.data);
    }
};