import { useState, useEffect } from 'react';
import axios from 'axios';


const createCamCase = (props) => {
    const { token, start, end, group, title } = props;
    // const [response, setResponse] = useState(null);
    // const [error, setError] = useState('');
    // const [loading, setloading] = useState(true);
    
            return axios
                .post(`/api/cameras/archive?token=${token}`,{
                    start: start,
                    end: end,
                    group: group,
                    title: title
                })
                // .then((res) => {
                //     setResponse(res.data);
                // })
                // .catch((err) => {
                //     setError(err);
                // })
                // .finally(() => {
                //     setloading(false);
                // });
       

        // useEffect(() => {
        //     fetchData();
        // }, []);

        // custom hook returns value
        // return { response, error, loading };
    };

export default {
     createCamCase
}
