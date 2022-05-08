import { useState, useEffect } from 'react';
import axios from 'axios';

const getCameraClips = (props) => {
	const { token, start } = props;
	const [response, setResponse] = useState(null);
	const [error, setError] = useState('');
	const [loading, setloading] = useState(true);

	const fetchData = () => {
		axios
			.post(
				`/api/cameras/player/records?token=${token}&key=recordedStart`,
				{
					start: start
				}
			)
			.then((res) => {
				setResponse(res.data);
			})
			.catch((err) => {
				setError(err);
			})
			.finally(() => {
				setloading(false);
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	// custom hook returns value
	return { response, error, loading };
};

export default getCameraClips;
