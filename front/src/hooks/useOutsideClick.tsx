import { useEffect, useRef } from "react"

// eslint-disable-next-line import/no-anonymous-default-export
export default <E extends HTMLElement>(callback: () => any) => {
	const elementRef = useRef<E | null>(null)

	const handleOutsideClick = (e) => {
		if (elementRef.current?.contains(e.target)) {
			callback()
		}
	}

	useEffect(() => {
		window.addEventListener('pointerdown', handleOutsideClick)
		return () => window.removeEventListener('pointerdown', handleOutsideClick)
	}, [])

	return elementRef
}