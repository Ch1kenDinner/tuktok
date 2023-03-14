import customEvents from "./customEvents"

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

export const convertToBase64 = (file: File) => new Promise((resolve, reject) => {
	const fileReader = new FileReader()
	fileReader.readAsDataURL(file)
	fileReader.onload = (res) => resolve(res.currentTarget)
	fileReader.onerror = (err) => reject(err)
})

export const setLocalStorage = (key: string, value: any) => {
	localStorage.setItem(key, JSON.stringify(value))
	window.dispatchEvent(new Event(customEvents.localStorageChange))
}