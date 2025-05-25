import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
    return (
        <div className="border border-orange-600 rounded-none overflow-hidden shadow-sm bg-[#CD6026]">
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 text-left bg-[#CD6026] transition-colors duration-200 flex justify-between items-center"
            >
                <h3 className="text-3xl max-sm:text-xl font-medium text-white pr-4">{question}</h3>
                <svg
                    className={`w-5 h-5 text-white transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
            >
                <div className="px-6 pb-4 text-xl max-sm:text-lg leading-relaxed bg-[#CD6026] text-white">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export function Faq() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: "How does the drawing approval process work?",
      answer: "Our platform streamlines the drawing approval workflow by allowing you to upload architectural drawings, assign reviewers, and track approval status in real-time. Reviewers can add comments, markups, and approve or request changes directly within the system."
    },
    {
      id: 2,
      question: "What file formats are supported for drawings?",
      answer: "We support all major architectural file formats including DWG, DXF, PDF, and common image formats like PNG and JPEG. Our system automatically processes and optimizes files for fast viewing and collaboration."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-6xl max-sm:text-3xl text-gray-900">Frequently Asked Questions</h2>
      </div>
      
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={item.id}>
            <FAQItem
              question={item.question}
              answer={item.answer}
              isOpen={openItem === item.id}
              onToggle={() => toggleItem(item.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}