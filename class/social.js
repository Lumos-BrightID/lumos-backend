const cheerio = require('cheerio')
const cloudscraper = require('cloudscraper')

class Social {

    constructor(username, type) {
        this.type = type
        this.username = username
        this.profile = {}
        this.run()
    }

    run() {
        switch (this.type) {
            case "telegram":
                this.telegram()
                break
            case "twitter":
                this.twitter()
                break
            case "facebook":
                this.facebook()
                break
            case "instagram":
                this.instagram()
                break
            case "email":
                this.email()
                break
            case "mobile":
                this.mobile()
                break
            case "erc20Address":
                this.erc20Address()
                break

        }
    }

    // get user telegram profile
    telegram() {
        let self = this
        const url = `https://t.me/${this.username}`
        const options = {
            method: 'GET',
            url: url
        }
        cloudscraper.get(options).then(function (body) {
            // load html page into cheerio
            const $ = cheerio.load(body)
            $('.tgme_page').each(function (i, element) {
                // get the image source
                self.profile.image = $(this).find('img.tgme_page_photo_image').attr('src')
                // get the display name
                self.profile.displayname = $(this).find('div.tgme_page_title > span').text()
                // get the username
                self.profile.username = $(this).find('.tgme_page_extra').text()
            })
            // remove whitespaces
            self.profile.username = self.profile.username.replace(/(\r\n|\n|\r)/gm, "")
        }).then(() => {
            // return fetched data
            this.profile = self.profile
        }).catch(error => console.log(error))

    }

    instagram() {

    }

    facebook() {

    }

    twitter() {

    }

    email() {

    }

    mobile() {

    }

    erc20Address() {

    }


}

module.exports = Social