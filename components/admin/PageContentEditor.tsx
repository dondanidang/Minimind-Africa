'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { ProductPageContent, FAQ, ZigZagItem, ComparisonRow, Guarantee, IdealFeature, WhyThisGameItem } from '@/types/productPageContent'

interface PageContentEditorProps {
  value: ProductPageContent | null
  onChange: (value: ProductPageContent | null) => void
}

export function PageContentEditor({ value, onChange }: PageContentEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['faqs', 'video']))
  
  const content = value || {}

  const updateSection = (section: string, data: any) => {
    onChange({ ...content, [section]: data })
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Page Content</h3>

      {/* FAQs Section */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('faqs')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>FAQs</span>
          <span className="text-xl">{expandedSections.has('faqs') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('faqs') && (
          <div className="p-4 border-t space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">FAQs Title</label>
              <input
                type="text"
                value={content.faqs?.title || ''}
                onChange={(e) => updateSection('faqs', { ...content.faqs, title: e.target.value, items: content.faqs?.items || [] })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Questions Fréquentes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">FAQ Items</label>
              {(content.faqs?.items || []).map((faq: FAQ, idx: number) => (
                <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const newItems = [...(content.faqs?.items || [])]
                        newItems[idx] = { ...faq, question: e.target.value }
                        updateSection('faqs', { ...content.faqs, items: newItems })
                      }}
                      placeholder="Question"
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = (content.faqs?.items || []).filter((_, i) => i !== idx)
                        updateSection('faqs', { ...content.faqs, items: newItems })
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const newItems = [...(content.faqs?.items || [])]
                      newItems[idx] = { ...faq, answer: e.target.value }
                      updateSection('faqs', { ...content.faqs, items: newItems })
                    }}
                    placeholder="Answer"
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  updateSection('faqs', {
                    ...content.faqs,
                    items: [...(content.faqs?.items || []), { question: '', answer: '' }]
                  })
                }}
              >
                Add FAQ
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Video Section */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('video')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Video</span>
          <span className="text-xl">{expandedSections.has('video') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('video') && (
          <div className="p-4 border-t space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <input
                type="url"
                value={content.video?.url || ''}
                onChange={(e) => updateSection('video', { ...content.video, url: e.target.value, title: content.video?.title || '' })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Video Title</label>
              <input
                type="text"
                value={content.video?.title || ''}
                onChange={(e) => updateSection('video', { ...content.video, url: content.video?.url || '', title: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Inclus dans la boite"
              />
            </div>
          </div>
        )}
      </div>

      {/* Scrolling Banner */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('scrollingBanner')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Scrolling Banner</span>
          <span className="text-xl">{expandedSections.has('scrollingBanner') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('scrollingBanner') && (
          <div className="p-4 border-t space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Speed</label>
              <input
                type="number"
                value={content.scrollingBanner?.speed || 70}
                onChange={(e) => updateSection('scrollingBanner', { ...content.scrollingBanner, speed: parseInt(e.target.value) || 70, texts: content.scrollingBanner?.texts || [] })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Banner Texts (one per line)</label>
              <textarea
                value={(content.scrollingBanner?.texts || []).join('\n')}
                onChange={(e) => updateSection('scrollingBanner', { ...content.scrollingBanner, texts: e.target.value.split('\n').filter(Boolean), speed: content.scrollingBanner?.speed || 70 })}
                rows={5}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Text 1&#10;Text 2&#10;Text 3"
              />
            </div>
          </div>
        )}
      </div>

      {/* Guarantees */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('guarantees')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Guarantees</span>
          <span className="text-xl">{expandedSections.has('guarantees') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('guarantees') && (
          <div className="p-4 border-t space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={content.guarantees?.title || ''}
                onChange={(e) => updateSection('guarantees', { ...content.guarantees, title: e.target.value, items: content.guarantees?.items || [] })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Guarantee Items</label>
              {(content.guarantees?.items || []).map((guarantee: Guarantee, idx: number) => (
                <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={guarantee.icon}
                      onChange={(e) => {
                        const newItems = [...(content.guarantees?.items || [])]
                        newItems[idx] = { ...guarantee, icon: e.target.value }
                        updateSection('guarantees', { ...content.guarantees, items: newItems })
                      }}
                      placeholder="Icon (emoji)"
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      value={guarantee.title}
                      onChange={(e) => {
                        const newItems = [...(content.guarantees?.items || [])]
                        newItems[idx] = { ...guarantee, title: e.target.value }
                        updateSection('guarantees', { ...content.guarantees, items: newItems })
                      }}
                      placeholder="Title"
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = (content.guarantees?.items || []).filter((_, i) => i !== idx)
                        updateSection('guarantees', { ...content.guarantees, items: newItems })
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={guarantee.subtitle}
                    onChange={(e) => {
                      const newItems = [...(content.guarantees?.items || [])]
                      newItems[idx] = { ...guarantee, subtitle: e.target.value }
                      updateSection('guarantees', { ...content.guarantees, items: newItems })
                    }}
                    placeholder="Subtitle"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  updateSection('guarantees', {
                    ...content.guarantees,
                    items: [...(content.guarantees?.items || []), { icon: '', title: '', subtitle: '' }]
                  })
                }}
              >
                Add Guarantee
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ideal Features */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('idealFeatures')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Ideal Features</span>
          <span className="text-xl">{expandedSections.has('idealFeatures') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('idealFeatures') && (
          <div className="p-4 border-t space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={content.idealFeatures?.title || ''}
                onChange={(e) => updateSection('idealFeatures', { ...content.idealFeatures, title: e.target.value, features: content.idealFeatures?.features || [] })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Features</label>
              {(content.idealFeatures?.features || []).map((feature: IdealFeature, idx: number) => (
                <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={(e) => {
                        const newFeatures = [...(content.idealFeatures?.features || [])]
                        newFeatures[idx] = { ...feature, icon: e.target.value }
                        updateSection('idealFeatures', { ...content.idealFeatures, features: newFeatures })
                      }}
                      placeholder="Icon (emoji)"
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...(content.idealFeatures?.features || [])]
                        newFeatures[idx] = { ...feature, title: e.target.value }
                        updateSection('idealFeatures', { ...content.idealFeatures, features: newFeatures })
                      }}
                      placeholder="Title"
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = (content.idealFeatures?.features || []).filter((_, i) => i !== idx)
                        updateSection('idealFeatures', { ...content.idealFeatures, features: newFeatures })
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...(content.idealFeatures?.features || [])]
                      newFeatures[idx] = { ...feature, description: e.target.value }
                      updateSection('idealFeatures', { ...content.idealFeatures, features: newFeatures })
                    }}
                    placeholder="Description"
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  updateSection('idealFeatures', {
                    ...content.idealFeatures,
                    features: [...(content.idealFeatures?.features || []), { icon: '', title: '', description: '' }]
                  })
                }}
              >
                Add Feature
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Zig-zag Content */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('zigzagContent')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Zig-zag Content</span>
          <span className="text-xl">{expandedSections.has('zigzagContent') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('zigzagContent') && (
          <div className="p-4 border-t space-y-4">
            {(content.zigzagContent || []).map((item: ZigZagItem, idx: number) => (
              <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Item {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = (content.zigzagContent || []).filter((_, i) => i !== idx)
                      updateSection('zigzagContent', newItems)
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={item.image}
                    onChange={(e) => {
                      const newItems = [...(content.zigzagContent || [])]
                      newItems[idx] = { ...item, image: e.target.value }
                      updateSection('zigzagContent', newItems)
                    }}
                    placeholder="Image URL"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...(content.zigzagContent || [])]
                      newItems[idx] = { ...item, title: e.target.value }
                      updateSection('zigzagContent', newItems)
                    }}
                    placeholder="Title"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...(content.zigzagContent || [])]
                      newItems[idx] = { ...item, description: e.target.value }
                      updateSection('zigzagContent', newItems)
                    }}
                    placeholder="Description"
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                  <select
                    value={item.alignment}
                    onChange={(e) => {
                      const newItems = [...(content.zigzagContent || [])]
                      newItems[idx] = { ...item, alignment: e.target.value as 'left' | 'right' }
                      updateSection('zigzagContent', newItems)
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                updateSection('zigzagContent', [...(content.zigzagContent || []), { image: '', title: '', description: '', alignment: 'left' }])
              }}
            >
              Add Zig-zag Item
            </Button>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('comparisonTable')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Comparison Table</span>
          <span className="text-xl">{expandedSections.has('comparisonTable') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('comparisonTable') && (
          <div className="p-4 border-t space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={content.comparisonTable?.title || ''}
                  onChange={(e) => updateSection('comparisonTable', { ...content.comparisonTable, title: e.target.value, subtitle: content.comparisonTable?.subtitle || '', rows: content.comparisonTable?.rows || [] })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={content.comparisonTable?.subtitle || ''}
                  onChange={(e) => updateSection('comparisonTable', { ...content.comparisonTable, subtitle: e.target.value, title: content.comparisonTable?.title || '', rows: content.comparisonTable?.rows || [] })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rows</label>
              {(content.comparisonTable?.rows || []).map((row: ComparisonRow, idx: number) => (
                <div key={idx} className="mb-2 p-2 border rounded bg-gray-50">
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <input
                      type="text"
                      value={row.feature}
                      onChange={(e) => {
                        const newRows = [...(content.comparisonTable?.rows || [])]
                        newRows[idx] = { ...row, feature: e.target.value }
                        updateSection('comparisonTable', { ...content.comparisonTable, rows: newRows })
                      }}
                      placeholder="Feature"
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={row.ourGame}
                        onChange={(e) => {
                          const newRows = [...(content.comparisonTable?.rows || [])]
                          newRows[idx] = { ...row, ourGame: e.target.checked }
                          updateSection('comparisonTable', { ...content.comparisonTable, rows: newRows })
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">Our Game</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={row.otherToys}
                        onChange={(e) => {
                          const newRows = [...(content.comparisonTable?.rows || [])]
                          newRows[idx] = { ...row, otherToys: e.target.checked }
                          updateSection('comparisonTable', { ...content.comparisonTable, rows: newRows })
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">Other Toys</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newRows = (content.comparisonTable?.rows || []).filter((_, i) => i !== idx)
                        updateSection('comparisonTable', { ...content.comparisonTable, rows: newRows })
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  updateSection('comparisonTable', {
                    ...content.comparisonTable,
                    rows: [...(content.comparisonTable?.rows || []), { feature: '', ourGame: false, otherToys: false }]
                  })
                }}
              >
                Add Row
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Features */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('mainFeatures')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Main Features</span>
          <span className="text-xl">{expandedSections.has('mainFeatures') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('mainFeatures') && (
          <div className="p-4 border-t space-y-4">
            {(content.mainFeatures || []).map((feature, idx: number) => (
              <div key={idx} className="mb-2 p-2 border rounded bg-gray-50">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => {
                      const newFeatures = [...(content.mainFeatures || [])]
                      newFeatures[idx] = { ...feature, icon: e.target.value }
                      updateSection('mainFeatures', newFeatures)
                    }}
                    placeholder="Icon (emoji)"
                    className="rounded-md border border-gray-300 px-3 py-2"
                  />
                  <input
                    type="text"
                    value={feature.label}
                    onChange={(e) => {
                      const newFeatures = [...(content.mainFeatures || [])]
                      newFeatures[idx] = { ...feature, label: e.target.value }
                      updateSection('mainFeatures', newFeatures)
                    }}
                    placeholder="Label"
                    className="rounded-md border border-gray-300 px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = (content.mainFeatures || []).filter((_, i) => i !== idx)
                      updateSection('mainFeatures', newFeatures)
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                updateSection('mainFeatures', [...(content.mainFeatures || []), { icon: '', label: '' }])
              }}
            >
              Add Main Feature
            </Button>
          </div>
        )}
      </div>

      {/* Why This Game */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('whyThisGame')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Why This Game</span>
          <span className="text-xl">{expandedSections.has('whyThisGame') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('whyThisGame') && (
          <div className="p-4 border-t space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={content.whyThisGame?.title || ''}
                onChange={(e) => updateSection('whyThisGame', { ...content.whyThisGame, title: e.target.value, items: content.whyThisGame?.items || [] })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Items</label>
              {(content.whyThisGame?.items || []).map((item: WhyThisGameItem, idx: number) => (
                <div key={idx} className="mb-4 p-3 border rounded bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...(content.whyThisGame?.items || [])]
                        newItems[idx] = { ...item, title: e.target.value }
                        updateSection('whyThisGame', { ...content.whyThisGame, items: newItems })
                      }}
                      placeholder="Title"
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = (content.whyThisGame?.items || []).filter((_, i) => i !== idx)
                        updateSection('whyThisGame', { ...content.whyThisGame, items: newItems })
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...(content.whyThisGame?.items || [])]
                      newItems[idx] = { ...item, description: e.target.value }
                      updateSection('whyThisGame', { ...content.whyThisGame, items: newItems })
                    }}
                    placeholder="Description"
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  updateSection('whyThisGame', {
                    ...content.whyThisGame,
                    items: [...(content.whyThisGame?.items || []), { title: '', description: '' }]
                  })
                }}
              >
                Add Item
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Urgency Count */}
      <div className="border rounded-lg bg-white">
        <button
          type="button"
          onClick={() => toggleSection('urgencyCount')}
          className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
        >
          <span>Urgency Count</span>
          <span className="text-xl">{expandedSections.has('urgencyCount') ? '−' : '+'}</span>
        </button>
        {expandedSections.has('urgencyCount') && (
          <div className="p-4 border-t">
            <input
              type="number"
              value={content.urgencyCount || ''}
              onChange={(e) => updateSection('urgencyCount', parseInt(e.target.value) || undefined)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="15"
            />
          </div>
        )}
      </div>
    </div>
  )
}

