const { useEffect, useState } = require("react");

export default function useShowModal() {
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		showModal
			? (document.body.style.overflow = "hidden")
			: (document.body.style.overflow = "auto");
	}, [showModal]);

	return [showModal, setShowModal];
}
