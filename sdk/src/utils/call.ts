const responseHandler = (resp: Response) => {
	if (resp.status === 401) return { error: true, canSendMoreAPICalls: false }; // No further API Calls

	return { error: null, canSendMoreAPICalls: true };
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
		return { error, canSendMoreAPICalls: true };
	}
};

export default call;
