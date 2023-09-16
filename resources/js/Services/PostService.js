export const PostService = {
    getPosts(id) {
        return axios.get(`/api/post/${id}`)
            .then((res) => res.data);
    },

    getEnterprisesInfo(id){
        return axios.get(`/api/enterprise-user/${id}`) 
            .then((res) => res.data);
    }
};