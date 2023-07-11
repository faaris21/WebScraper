const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const fs = require('fs')

const app = express()

const url = 'https://business.fortbendchamber.com/list/ql/public-utilities-environment-19'

axios(url)
  .then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    const articles = []

    $('.mn-phone', html).each(function(index) {
      const number = $(this).text()
      const title = $('.mn-title', html).eq(index).text().trim()
      const websiteElement = $('.mn-website', html).eq(index).find('a')
      const websiteUrl = websiteElement.length > 0 ? websiteElement.attr('href') : ''
      articles.push({
        title,
        number,
        websiteUrl
      })
    })

    // Convert the articles array to CSV format
    const csvContent = articles.map(article => {
      const escapedTitle = `"${article.title.replace(/"/g, '""')}"`;
      const escapedNumber = `"${article.number.replace(/"/g, '""')}"`;
      const escapedWebsiteUrl = `"${article.websiteUrl.replace(/"/g, '""')}"`;
      return `${escapedTitle},${escapedNumber},${escapedWebsiteUrl}`;
    }).join('\n')

    // Define the path and filename for the CSV file
    const csvFilePath = './Public Utilities & Environment.csv'

    // Write the CSV content to the file
    fs.writeFile(csvFilePath, csvContent, 'utf8', function(err) {
      if (err) {
        console.log('Error writing CSV file:', err)
      } else {
        console.log(`CSV file saved to ${csvFilePath}`)
      }
    })
  })
  .catch(err => console.log(err))

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
