'use client'

interface ProductScrollingBannerProps {
  texts?: string[]
  speed?: number
}

const defaultTexts = [
  'Des jeux qui rapprochent, font réfléchir et rendent fiers.',
  'De petites mains pour de grandes découvertes.',
  'Apprendre en s\'amusant, grandir en créant.',
  'Nos jouets font grandir.',
]

export function ProductScrollingBanner({ 
  texts = defaultTexts,
  speed = 30 
}: ProductScrollingBannerProps) {
  const duplicatedTexts = [...texts, ...texts] // Duplicate for seamless loop

  return (
    <>
      <style jsx global>{`
        @keyframes scrollBanner {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scrolling-banner {
          animation: scrollBanner ${speed}s linear infinite;
        }
        .gradient-text-purple-yellow {
          background: linear-gradient(to right, #CCB5D9, #F6F1BF);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gradient-text-yellow-purple {
          background: linear-gradient(to right, #F6F1BF, #CCB5D9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <section className="py-8 bg-white overflow-hidden">
        <div className="relative">
          <div className="flex gap-8 whitespace-nowrap scrolling-banner">
            {duplicatedTexts.map((text, index) => {
              // Alternate gradient direction for each sentence
              const gradientClass = index % 2 === 0 
                ? 'gradient-text-purple-yellow' 
                : 'gradient-text-yellow-purple'
              
              return (
                <span key={index} className={`text-2xl font-bold ${gradientClass}`}>
                  {text}
                </span>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

