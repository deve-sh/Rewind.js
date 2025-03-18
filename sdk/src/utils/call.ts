const responseHandler = (resp: Response) => {
	if (resp.status === 401) return { error: true }; // No further API Calls

	if (!resp.ok) return { error: true };

	return { error: null };
};

const call = async (
	endpoint: string,
	data?: any,
	headers?: Record<string, any>
) => {
	try {
		const resp = await fetch(endpoint, {
			body: data ? JSON.stringify(data) : "",
			mode: "cors",
			method: "POST",
			headers: headers || {},
			keepalive: true,
		});
		return responseHandler(resp);
	} catch (error) {
		return { error };
	}
};

export default call;
