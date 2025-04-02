export default function DateSelector({ dates, selectedDate, setSelectedDate }) {
  return (
    <div className="mb-6">
      <label className="mr-2 font-semibold">Select Date:</label>
      <select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {dates.map(date => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>
    </div>
  );
}
