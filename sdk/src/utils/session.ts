const sessionIdKey = "[rewind.js]session-id";

const isSessionStorageAvailable = () => typeof sessionStorage !== "undefined";
const isLocalStorageAvailable = () => typeof localStorage !== "undefined";

const setSessionId = () => {
	const id = new Date().getTime().toString();

	if (isSessionStorageAvailable()) sessionStorage.setItem(sessionIdKey, id);
	else if (isLocalStorageAvailable()) localStorage.setItem(sessionIdKey, id);

	return id;
};

export const getSessionId = (): string => {
	let existingSessionId;

	if (isSessionStorageAvailable())
		existingSessionId = sessionStorage.getItem(sessionIdKey);
	else if (isLocalStorageAvailable())
		existingSessionId = localStorage.getItem(sessionIdKey);

	if (existingSessionId) return existingSessionId;

	setSessionId();

	return getSessionId();
};
