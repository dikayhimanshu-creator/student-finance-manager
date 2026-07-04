const SummaryCard = ({ title, amount, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
      <div className={`text-3xl p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{amount}</p>
      </div>
    </div>
  )
}

export default SummaryCard