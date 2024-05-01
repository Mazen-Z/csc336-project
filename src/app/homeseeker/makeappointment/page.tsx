"use client"

import { useSearchParams } from "next/navigation";
import { Button, Card } from "@tremor/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { makeAppointment, fetchScheduleData } from "@/app/homeseeker/makeappointment/actions";
import { Schedule } from "@/db/homeseeker/schedule";

const AppointmentForm: NextPage = () => {
	const scheduleId = useSearchParams().get('schedule');
	const [schedule, setScheule] = useState<Schedule | null>(null);
	// Get the date input
	const [input, setInput] = useState({
		start: "",
		end: "",
	});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSchedule = async () => {
			try {
				if (scheduleId) {
					const data = await fetchScheduleData(Number(scheduleId));
					setScheule(data);
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchSchedule();
	}, [scheduleId])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (schedule) {
			const output = await makeAppointment(
				schedule.id,
				new Date(`${schedule.start.toISOString().split("T")[0]}T${input.start}`),
				new Date(`${schedule.end.toISOString().split("T")[0]}T${input.end}`),
			)
			if (typeof output === "string") {
				setError(output);
			} else {
				setError(null);
			}
		}
	};

	return (
		<div className="container mx-auto py-20">
			{schedule ? (
				<>
					<Card className="max-w-96 mx-auto">
						<h1 className="mb-5 text-tremor-title font-medium text-center">
							Schedule for an appointment
						</h1>
						<div className="flex flex-col items-center justify-center">
							<p>Start: {new Date(schedule.start).toLocaleString()}</p>
							<p>End: {new Date(schedule.end).toLocaleString()}</p>
						</div>
						<form onSubmit={handleSubmit} className="flex flex-col just-center items-center">
							<div className="mb-5 flex flex-row gap-3">
								<div>
									<input
										required
										name="start"
										type="time"
										placeholder="Select start time in the form 00:00"
										value={input.start}
										onChange={handleChange}
									/>
								</div>
								<div>
									<input
										required
										name="end"
										type="time"
										placeholder="Select end time in the form 00:00"
										value={input.end}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="h-4">
								{error && (
									<small className="pb-5 text-sm text-red-500">{error}</small>
								)}
							</div>
							<div className="items-center">
								<Button type="submit">Make Appointment</Button>
							</div>
						</form>
					</Card>
				</>
			) : (null)}
		</div>
	);
};

export default AppointmentForm;
