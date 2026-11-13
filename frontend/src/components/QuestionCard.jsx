const QuestionCard = ({ question, index, selectedOption, onSelect }) => {
  const options = [
    { label: 'A', text: question.option_a },
    { label: 'B', text: question.option_b },
    { label: 'C', text: question.option_c },
    { label: 'D', text: question.option_d }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-lg font-semibold mb-4">Q{index + 1}. {question.question}</h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <label 
            key={opt.label} 
            className={`block p-3 rounded border cursor-pointer transition ${selectedOption === opt.label ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <input 
              type="radio" 
              name={`question-${question.id}`} 
              value={opt.label} 
              checked={selectedOption === opt.label}
              onChange={() => onSelect(opt.label)}
              className="mr-3"
            />
            {opt.label}. {opt.text}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;