import {Clock} from 'lucide-react'

export const ProgressBar = ({ current, total, timeLeft }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Question {current + 1} of {total}</span>
        <span className="flex items-center gap-1">
          <Clock size={16} />
          {timeLeft}s
        </span>
      </div>
    </div>
  );
