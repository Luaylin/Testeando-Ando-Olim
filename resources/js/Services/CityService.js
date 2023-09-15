export const CityService = {
    getCities() {
        return axios.get('/api/cities')
            .then((res) => res.data);
    },

    getCity(id){
        return axios.get(`/api/cities/${id}`) 
            .then((res) => res.data);
    }
};