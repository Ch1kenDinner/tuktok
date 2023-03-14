import { MutableRefObject, useEffect, useRef, useState } from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default (
  setFile: (file: File) => void,
	types?: string[],
) => {
	const [isDragging, setIsDragging] = useState(false)

  const dragOverflowCountRef = useRef(0);

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (types && !types.includes(e.dataTransfer.files[0].type)) return;
		dragOverflowCountRef.current++;
		setIsDragging(true)
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		dragOverflowCountRef.current--;
		if (dragOverflowCountRef.current > 0) return;
		setIsDragging(false)
	};

	useEffect(() => {
		return () => {
			dragOverflowCountRef.current = 0;
		};
	}, []);

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!e.dataTransfer) return setIsDragging(false)

		const file = e.dataTransfer.files[0];
		setFile(file);
		setIsDragging(false)
	};

	return {isDragging, events: {onDragOver: handleDrag, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDrop: handleDrop}}

};
