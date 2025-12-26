import type { ComparisonRow } from '@/types/productPageContent'

interface ProductComparisonTableProps {
  title?: string
  subtitle?: string
  rows?: ComparisonRow[]
}

const defaultRows: ComparisonRow[] = [
  { feature: 'Solidité & sécurité', ourGame: true, otherToys: false },
  { feature: 'Durabilité', ourGame: true, otherToys: false },
  { feature: 'Adapté dès 3 ans', ourGame: true, otherToys: false },
  { feature: 'Sans bruits perturbateurs', ourGame: true, otherToys: false },
  { feature: 'Évolue avec l\'enfant', ourGame: true, otherToys: false },
]

export function ProductComparisonTable({
  title = "Ce qu'on vous garantit",
  subtitle = "(et pourquoi vous pouvez le commander les yeux fermés)",
  rows = defaultRows
}: ProductComparisonTableProps) {
  return (
    <section className="py-16" style={{ backgroundColor: '#CCB5D9' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
            {subtitle && (
              <p className="text-xl text-white italic">{subtitle}</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-4 text-left" style={{ backgroundColor: '#F6F1BF' }}></th>
                  <th className="p-4 bg-black text-white font-bold">MINIMINDS</th>
                  <th className="p-4 text-primary-600 font-bold">autres jouets</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4 font-medium" style={{ backgroundColor: '#F6F1BF' }}>
                      {row.feature}
                    </td>
                    <td className="p-4 bg-black text-center">
                      {row.ourGame && (
                        <svg className="w-6 h-6 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.otherToys ? (
                        <svg className="w-6 h-6 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

