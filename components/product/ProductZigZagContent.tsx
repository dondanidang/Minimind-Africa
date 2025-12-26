import Image from 'next/image'
import type { ZigZagItem } from '@/types/productPageContent'

interface ProductZigZagContentProps {
  items?: ZigZagItem[]
}

export function ProductZigZagContent({ items = [] }: ProductZigZagContentProps) {
  if (items.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 space-y-16">
        {items.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              item.alignment === 'right' ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={item.alignment === 'right' ? 'lg:order-2' : ''}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            
            <div className={item.alignment === 'right' ? 'lg:order-1' : ''}>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ 
                  __html: item.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

