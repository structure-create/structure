import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalysisResultsProps {
  analysis: {
    score: number
    summary?: string
    issues: {
      category: string
      items: string[]
    }[]
  }
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { score, issues } = analysis

  // Determine score color based on value
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <div className="mt-8 space-y-6 animate-in fade-in-50 duration-500">
      <h3 className="text-2xl font-bold text-center text-navy-900">Analysis Results</h3>

      <div className="flex justify-center">
        <div className={`rounded-full ${getScoreColor()} px-6 py-3 text-center`}>
          <div className="text-sm font-medium">Compliance Score</div>
          <div className="text-4xl font-bold">{score}/100</div>
        </div>
      </div>

      <Card className="border-navy-100">
        <CardHeader className="bg-navy-50 border-b border-navy-100">
          <CardTitle className="text-navy-900">Potential conflicts</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {issues.length > 0 ? (
            <div className="space-y-6">
              {issues.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-navy-800">{section.category}</h4>
                  <ul className="space-y-1 list-disc pl-5">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No issues found in the document.</p>
          )}
        </CardContent>
      </Card>


      {analysis.summary && (
        <Card className="border-navy-100">
          <CardHeader className="bg-navy-50 border-b border-navy-100">
            <CardTitle className="text-navy-900">Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="block w-full text-lg font-bold text-center leading-relaxed">
              {analysis.summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
