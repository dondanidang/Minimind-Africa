import type { ProductPageContent } from '@/types/productPageContent'
import { defaultProductPageContent } from './productDefaults'

/**
 * Merges product page content from database with defaults
 * If a section is missing in productContent, it uses the default
 */
export function mergeProductContent(
  productContent?: ProductPageContent | null
): ProductPageContent {
  if (!productContent) {
    return defaultProductPageContent
  }

  return {
    idealFeatures: productContent.idealFeatures || defaultProductPageContent.idealFeatures,
    video: productContent.video || defaultProductPageContent.video,
    scrollingBanner: productContent.scrollingBanner || defaultProductPageContent.scrollingBanner,
    zigzagContent: productContent.zigzagContent || defaultProductPageContent.zigzagContent,
    comparisonTable: productContent.comparisonTable || defaultProductPageContent.comparisonTable,
    guarantees: productContent.guarantees || defaultProductPageContent.guarantees,
    faqs: productContent.faqs || defaultProductPageContent.faqs,
    urgencyCount: productContent.urgencyCount ?? defaultProductPageContent.urgencyCount,
    mainFeatures: productContent.mainFeatures || defaultProductPageContent.mainFeatures,
    whyThisGame: productContent.whyThisGame || defaultProductPageContent.whyThisGame,
  }
}

