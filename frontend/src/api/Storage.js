class StorageClient {
	constructor(){}
	getDay(dayId){}
	getAllDays(){}
	updateDay(){}
	deleteDay(dayId){}
}

class LocalStorageClient extends StorageClient {
	getLocalStorage = () => {
		if (typeof(Storage) !== "undefined") {
		  return window.localStorage;
		} else {
		  return null;
		}
	}

	getDay = (dayId) => {

	}

	getAllDays = () => {

	}

	updateDay = () => {

	}

	deleteDay = (dayId) => {

	}
}

var localStorageClient = new LocalStorageClient();

export const getDay = localStorageClient.getDay;
export const getAllDays = localStorageClient.getAllDays;
export const updateDay = localStorageClient.updateDay;
export const deleteDay = localStorageClient.deleteDay;