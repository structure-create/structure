import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"

import Link from "next/link"
import { AlertCircle } from "lucide-react"

interface AnalysisResultsProps {
  analysis: {
    score: number
    issues: {
      category: string
      /** each string already concatenates: "quote — explanation" */
      items: string[]
    }[]
  }
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { score, issues } = analysis

  // helper ────────────────────────────────────────────────────────────────────
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  // We only care about these categories for the tab UI
  const tabOrder = [
    "Electrical",
    "Zoning",
    "Plumbing",
    "Mechanical",
    "Ambiguity",
  ] as const

  /** quick lookup so we don’t loop repeatedly */
  const issuesByCategory = Object.fromEntries(
    tabOrder.map((name) => {
      const found = issues.find((i) => i.category === name)
      return [name, found?.items ?? []]
    })
  ) as Record<(typeof tabOrder)[number], string[]>

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="mt-8 space-y-6 animate-in fade-in-50 duration-500">
      <h3 className="text-2xl font-bold text-center text-navy-900">
        Analysis Results
      </h3>

      {/* compliance score */}
      <div className="flex justify-center">
        <div className={`rounded-full ${getScoreColor()} px-6 py-3 text-center`}>
          <div className="text-sm font-medium">Compliance Score</div>
          <div className="text-4xl font-bold">{score}/100</div>
        </div>
      </div>

      {/* issues by category ‑ tabbed UI */}
      <Card className="border-black-100">
        <CardHeader className="border-b border-black-100">
            <CardTitle className="text-[#CD6206] flex items-center">
            <AlertCircle className="w-6 h-6 mr-2" />
              Violations
            </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
            <Tabs defaultValue={tabOrder[0]} className="w-full">
            <TabsList className="mb-4 flex w-full overflow-x-auto">
              {tabOrder.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#CD6206]"
              >
                {cat}
              </TabsTrigger>
              ))}
            </TabsList>

            {tabOrder.map((cat) => (
              <TabsContent key={cat} value={cat}>
              {issuesByCategory[cat].length > 0 ? (
              <ul className="list-disc space-y-1 pl-5">
              {issuesByCategory[cat].map((item, idx) => {
                const [quote, explanation] = item.split(" — ");
                return (
                <li key={idx} className="text-gray-700">
                  <span className="font-extrabold underline">{quote}</span> — {explanation}
                </li>
                );
              })}
              </ul>
              ) : (
              <p className="text-sm text-gray-500 italic">
              No {cat.toLowerCase()} issues were detected.
              </p>
              )}
              </TabsContent>
            ))}
            </Tabs>
        </CardContent>
      </Card>

      {/* feedback button */}
      <div className="flex justify-center">
        <Link href="/feedback">
          <button className="mx-auto block rounded-sm bg-[#CD6026] px-8 py-4 text-2xl font-semibold text-white hover:bg-[#A13E0A]">
            Submit your feedback!
          </button>
        </Link>
      </div>
    </div>
  )
}


// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface AnalysisResultsProps {
//   analysis: {
//     score: number
//     violations: {
//       page: number
//       citation: string
//       quote: string
//       reason: string
//     }[]
//   }
// }

// export function AnalysisResults({ analysis }: AnalysisResultsProps) {
//   const { score, violations } = analysis

//   // Determine score color based on value
//   const getScoreColor = () => {
//     if (score >= 80) return "text-green-600 bg-green-50"
//     if (score >= 60) return "text-yellow-600 bg-yellow-50"
//     return "text-red-600 bg-red-50"
//   }

//   return (
//     <div className="mt-8 space-y-6 animate-in fade-in-50 duration-500">
//       <h3 className="text-2xl font-bold text-center text-navy-900">Analysis Results</h3>

//       <div className="flex justify-center">
//         <div className={`rounded-full ${getScoreColor()} px-6 py-3 text-center`}>
//           <div className="text-sm font-medium">Compliance Score</div>
//           <div className="text-4xl font-bold">{score}/100</div>
//         </div>
//       </div>

//       <Card className="border-black-100">
//         <CardHeader className="border-b border-black-100">
//           <CardTitle className="text-gray-900">Potential conflicts</CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           {violations.length > 0 ? (
//             <div className="space-y-6">
//               {violations.map((section, index) => (
//                 <div key={index} className="space-y-2">
//                   <h4 className="font-semibold text-gray-800">{section.category}</h4>
//                   <ul className="space-y-1 list-disc pl-5">
//                     {section.items.map((item, itemIndex) => (
//                       <li key={itemIndex} className="text-gray-700">
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center py-4">No issues found in the document.</p>
//           )}
//         </CardContent>
//       </Card>


//       {analysis.summary && (
//         <Card className="border-navy-100">
//           <CardHeader className="bg-navy-50 border-b border-navy-100">
//             <CardTitle className="text-navy-900">Summary</CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <p className="block w-full text-lg font-bold text-center leading-relaxed">
//               {analysis.summary}
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }
