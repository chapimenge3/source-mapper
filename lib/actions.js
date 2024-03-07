'use server'
import * as cheerio from 'cheerio';

/**
 * Get the source map url from a given js url
 * @param {string} url
 * @returns {string}
 * @example
 * const mapUrl = getMapUrlFromJsUrl('https://example.com/main.js')
 * console.log(mapUrl) // 'https://example.com/main.js.map'
 */
async function getMapUrlFromJsUrl(siteUrl) {
  const url = new URL(siteUrl)
  const path = url.pathname
  const mapPath = path + '.map'
  return url.origin + mapPath
}


/**
 * Get the content of a given url
 * @param {string} url
 * @returns {string}
 * @example
 * const content = getWebPageContent('https://example.com')
 * console.log(content) // '...'
 */
export async function getWebPageContent(url) {
  try {

    const params = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    }
    const response = await fetch(url, params)
    const content = await response.text()
    return content
  } catch (error) {
    console.log('Error fetching content', error)
    const err = error.toString()
    return `Error fetching content: ${err}`
  }
}

/**
 * Scrape source map from the content of a given url
 * @param {string} domain
 * @param {string} content
 * @returns {Array<string>}
 * @example
 * const sourceMaps = scrapeSourceMapFromContent('https://example.com', '...')
 * console.log(sourceMaps) // ['https://example.com/main.js.map', 'https://example.com/vendor.js.map']
 */
async function scrapeSourceMapFromContent(domain, content) {
  try {

    const $ = cheerio.load(content)

    // find all script tags
    const scriptTags = $('script')
    const sourceMap = []

    // loop through all script tags and find the source map 
    // make sure the js file src is under the same domain as the provided url
    scriptTags.each(async (index, el) => {
      let elSrc = $(el).attr('src')
      console.log('elSrc', elSrc)
      if (!elSrc || elSrc.startsWith('//')) return

      const src = new URL(elSrc, domain)

      // edge case where the src is a not relative to the domain
      if (src.origin !== domain) return

      const mapUrl = await getMapUrlFromJsUrl(src.href)
      console.log('Map url', mapUrl)
      sourceMap.push(mapUrl)
    })

    return sourceMap
  } catch (error) {
    console.log('Error scraping source map', error)
    const err = error.toString()
    return `Error scraping source map: ${err}`
  }
}

/**
 * Get all source maps from a given url
 * @param {string} url
 * @returns {Array<string>}
 * @example
 * const sourceMaps = getAllSourceMaps('https://example.com')
 * console.log(sourceMaps) // ['https://example.com/main.js.map', 'https://example.com/vendor.js.map']
 */
export async function getAllSourceMaps(siteUrl) {
  try {


    const url = new URL(siteUrl)

    // return back the url if it's a source map
    if (url.pathname.endsWith('.map')) {
      return [url.href]
    }

    // check if the url is a js file. it might not end with .js because of query params
    console.log(url.pathname)
    if (url.pathname.endsWith('.js')) {
      const mapUrl = getMapUrlFromJsUrl(url.href)
      return [mapUrl]
    }

    // if the url is domain endpoints, we need to fetch the content and find the source map.
    // prepare a custom header to make update the user agent to avoid being blocked by the server
    const params = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    }
    console.log('Scrapping', url.href)
    const content = await getWebPageContent(url.href)
    // const response = await fetch(url.href, params)
    // console.log(response, response.status)
    // const content = await response.text()
    return await scrapeSourceMapFromContent(url.origin, content)
  } catch (error) {
    console.log('Error getting source maps', error)
    const errStr = error.toString()
    return `Error getting source maps: ${errStr}`
  }
}