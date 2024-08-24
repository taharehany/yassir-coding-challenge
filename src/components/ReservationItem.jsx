import React from "react";

const highlightText = (text, query) => {
	if (!query) return text;

	const regex = new RegExp(`(${query})`, "gi");

	return text.replace(regex, '<span class="bg-yellow-700 rounded-sm">$1</span>');
};

const ReservationItem = ({ reservation, searchQuery }) => {
	const guestName = `${reservation.customer.firstName} ${reservation.customer.lastName}`;
	const highlightedName = highlightText(guestName, searchQuery);

	const getStatusColor = (status) => {
		switch (status) {
			case "CHECKED OUT":
				return "text-green-500";
			case "NOT CONFIRMED":
				return "text-yellow-500";
			default:
				return "text-red-500";
		}
	};

	return (
		<div className='shadow-md rounded-lg p-5 bg-gray-800'>
			<h3 className='text-xl font-bold mb-3' dangerouslySetInnerHTML={{ __html: highlightedName }} />

			<ul className='list-disc list-inside'>
				<li>Date: {reservation.businessDate}</li>
				<li>Shift: {reservation.shift}</li>
				<li>
					Status:
					<span className={getStatusColor(reservation.status) + " ml-2"}>
						{reservation.status}
					</span>
				</li>
				<li>
					Start Time: {new Date(reservation.start).toLocaleTimeString()}
				</li>
				<li>End Time: {new Date(reservation.end).toLocaleTimeString()}</li>
				<li>Area: {reservation.area}</li>
				<li>Notes: {reservation.guestNotes || "--"}</li>
				<li>Number of Guests: {reservation.quantity}</li>
			</ul>
		</div>
	);
};

export default ReservationItem;
