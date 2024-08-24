import React, { useState, useEffect } from "react";
import { getReservations } from "@/services/reservationService";
import ReservationItem from "@/components/ReservationItem";

const ReservationList = () => {
	const [reservations, setReservations] = useState([]);

	const [filters, setFilters] = useState({
		status: "",
		date: "",
		shift: "",
		area: "",
	});

	useEffect(() => {
		const data = getReservations();
		setReservations(data);
	}, []);

	const [searchQuery, setSearchQuery] = useState('');

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters({ ...filters, [name]: value });
	};

	const applyFilters = (reservations) => {
		return reservations.filter((reservation) => {
			const isStatusMatch =
				!filters.status || reservation.status === filters.status;

			const isDateMatch =
				filters.date === "" ||
				(filters.date === "past" &&
					new Date(reservation.businessDate) < new Date()) ||
				(filters.date === "future" &&
					new Date(reservation.businessDate) >= new Date());

			const isShiftMatch =
				!filters.shift || reservation.shift === filters.shift;

			const isAreaMatch = !filters.area || reservation.area === filters.area;

			return isStatusMatch && isDateMatch && isShiftMatch && isAreaMatch;
		});
	};

	const filteredReservations = applyFilters(reservations);

	const handleSort = (field) => {
		const sortedReservations = [...reservations].sort((a, b) => {
			if (a[field] < b[field]) return -1;
			if (a[field] > b[field]) return 1;
			return 0;
		});

		setReservations(sortedReservations);
	};

	const handleSearch = (query) => {
		const searchResults = getReservations().filter((reservation) =>
			(reservation.customer.firstName + reservation.customer.lastName)
				.toLowerCase()
				.includes(query.toLowerCase())
		);

		setSearchQuery(query);
		setReservations(searchResults);
	};

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-4'>Upcoming Reservations</h1>

			<div className='mb-4 flex flex-wrap gap-4'>
				<div>
					<label className='text-gray-400 block mb-2'>Filter By Status:</label>
					<select
						name='status'
						onChange={handleFilterChange}
						value={filters.status}
						className='bg-gray-800 p-3 rounded-md w-full'
					>
						<option value=''>All</option>
						<option value='CHECKED OUT'>Checked Out</option>
						<option value='SEATED'>Seated</option>
						<option value='CONFIRMED'>Confirmed</option>
						<option value='NOT CONFIRMED'>Not Confirmed</option>
					</select>
				</div>

				<div>
					<label className='text-gray-400 block mb-2'>Filter By Date:</label>
					<select
						name='date'
						onChange={handleFilterChange}
						value={filters.date}
						className='bg-gray-800 p-3 rounded-md w-full'
					>
						<option value=''>All</option>
						<option value='past'>Past dates</option>
						<option value='future'>Upcoming dates</option>
					</select>
				</div>

				<div>
					<label className='text-gray-400 block mb-2'>Filter By Shift:</label>
					<select
						name='shift'
						onChange={handleFilterChange}
						className='bg-gray-800 p-3 rounded-md w-full'
					>
						<option value=''>All</option>
						<option value='BREAKFAST'>Breakfast</option>
						<option value='LUNCH'>Lunch</option>
						<option value='DINNER'>Dinner</option>
					</select>
				</div>

				<div>
					<label className='text-gray-400 block mb-2'>Filter By Area:</label>
					<select
						name='area'
						onChange={handleFilterChange}
						className='bg-gray-800 p-3 rounded-md w-full'
					>
						<option value=''>All</option>
						<option value='BAR'>Bar</option>
						<option value='MAIN ROOM'>Main Room</option>
					</select>
				</div>

				<div>
					<label className='text-gray-400 block mb-2'>Sort By:</label>
					<select
						onChange={(e) => handleSort(e.target.value)}
						className='bg-gray-800 p-3 rounded-md w-full'
					>
						<option value=''>All</option>
						<option value='businessDate'>Date</option>
						<option value='shift'>Shift</option>
						<option value='area'>Area</option>
						<option value='status'>Status</option>
						<option value='quantity'>Number of Guests</option>
					</select>
				</div>

				<div>
					<label className='text-gray-400 block mb-2'>Search:</label>
					<input
						type='text'
						placeholder='Search by name...'
						onChange={(e) => handleSearch(e.target.value)}
						className='bg-gray-800 p-3 rounded-md'
					/>
				</div>
			</div>

			{filteredReservations.length ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
					{filteredReservations.map((reservation) => (
						<ReservationItem
							key={reservation.id}
							reservation={reservation}
							searchQuery={searchQuery}
						/>
					))}
				</div>
			) : (
				<p className='text-center'>No reservations found</p>
			)}
		</div>
	);
};

export default ReservationList;
