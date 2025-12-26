export interface IdealFeature {
  icon: string
  title: string
  description: string
}

export interface ZigZagItem {
  image: string
  title: string
  description: string
  alignment: 'left' | 'right'
}

export interface ComparisonRow {
  feature: string
  ourGame: boolean
  otherToys: boolean
}

export interface Guarantee {
  icon: string
  title: string
  subtitle: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface WhyThisGameItem {
  title: string
  description: string
}

export interface ProductPageContent {
  // Section 2: Ideal Features
  idealFeatures?: {
    title?: string
    features?: IdealFeature[]
  }
  
  // Section 3: Video
  video?: {
    url?: string
    title?: string
  }
  
  // Section 4: Scrolling Banner
  scrollingBanner?: {
    texts?: string[]
    speed?: number
  }
  
  // Section 5: Zig-zag Content
  zigzagContent?: ZigZagItem[]
  
  // Section 6: Comparison Table
  comparisonTable?: {
    title?: string
    subtitle?: string
    rows?: ComparisonRow[]
  }
  
  // Section 7: Reviews (handled separately from database)
  
  // Section 8: Guarantees
  guarantees?: {
    title?: string
    items?: Guarantee[]
  }
  
  // Section 9: FAQs
  faqs?: {
    title?: string
    items?: FAQ[]
  }
  
  // Section 1: Main Section
  urgencyCount?: number
  
  // Main section features banner
  mainFeatures?: Array<{
    icon: string
    label: string
  }>
  
  // Why this game expandable section
  whyThisGame?: {
    title?: string
    items?: WhyThisGameItem[]
  }
}

