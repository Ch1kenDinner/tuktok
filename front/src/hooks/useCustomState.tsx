/* eslint-disable import/no-anonymous-default-export */
import {useState} from 'react'

export default <T extends Required<Record<string, any>>,>(initState: T) => {
	const [data, setData] = useState<T>(initState)

	const res = {}
	Object.keys(initState).forEach((el) => {
		Object.defineProperty(res, el, {
			get() {return data[el]},
			set(newValue) {
				return setData((prev) => ({...prev, [el]: newValue}))
			}
		})
	})

	return res as T
}