require('dotenv').config()
// env Constant
const APP_ENV = process.env.APP_ENV

const CONTEXT = process.env.APP_NAME
// BrightId endpoints
const NODE_URL = `http:%2f%2fnode.brightid.org`
// develop endpoints
// const BRIGHT_ID_ENDPOINT_TEST_V5 = 'http://test.brightid.org/brightid/v5'
// const BRIGHTID_VERIFICATION_TEST_ENDPOINT = `${BRIGHT_ID_ENDPOINT_TEST_V5}/verifications`
// const BRIGHTID_SUBSCRIPTION_TEST_ENDPOINT = `${BRIGHTID_VERIFICATION_TEST_ENDPOINT}/operations`
// const BRIGHT_ID_APP__TEST_DEEPLINK = `brightid://link-verification/${NODE_URL}/${CONTEXT}/`
// const BRIGHTID_LINK_VERIFICATION_TEST_ENDPOINT = `https://app.brightid.org/link-verification/${NODE_URL}/${CONTEXT}/`
// production endpoints
const BRIGHT_ID_ENDPOINT_V5 = 'https://app.brightid.org/node/v5'
const BRIGHTID_VERIFICATION_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/verifications`
const BRIGHTID_SUBSCRIPTION_ENDPOINT = `${BRIGHT_ID_ENDPOINT_V5}/operations`
const BRIGHT_ID_APP_DEEPLINK = `brightid://link-verification/${NODE_URL}/${CONTEXT}/`
const BRIGHTID_LINK_VERIFICATION_ENDPOINT = `https://app.brightid.org/link-verification/${NODE_URL}/${CONTEXT}/`


module.exports = {
    APP_ENV,
    CONTEXT,
    NODE_URL,
    BRIGHT_ID_ENDPOINT_V5,
    BRIGHTID_VERIFICATION_ENDPOINT,
    BRIGHTID_SUBSCRIPTION_ENDPOINT,
    BRIGHT_ID_APP_DEEPLINK,
    BRIGHTID_LINK_VERIFICATION_ENDPOINT,
}