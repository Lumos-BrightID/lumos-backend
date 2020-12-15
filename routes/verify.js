const express = require('express')
const router = express.Router()
const fetch = require('node-fetch');
const QRCode = require('qrcode')
const {
    CONTEXTID_NOT_FOUND,
    CAN_NOT_BE_VERIFIED,
    NOT_SPONSORED,
    CONTEXT_NOT_FOUND

} = require("../utils/responseCode")
const {
    CONTEXT,
    BRIGHT_ID_APP_DEEPLINK,
    BRIGHTID_VERIFICATION_ENDPOINT,
    BRIGHTID_SUBSCRIPTION_ENDPOINT
} = require("../utils/util")
const {v4: uuidv4} = require('uuid');
const isEmpty = require('lodash').isEmpty
const db = require('../models/index')
const nacl = require('tweetnacl');
const B64 = require('base64-js');
const stringify = require('fast-json-stable-stringify');
require('dotenv').config()


/**
 * user login
 */
router.post('/', function (req, res) {
    const contextId = uuidv4()
    const verification = {
        qrCode: BRIGHT_ID_APP_DEEPLINK + contextId,
        deepLink: BRIGHT_ID_APP_DEEPLINK + contextId
    }
    try {
        QRCode.toDataURL(verification.qrCode, (err, url) => {
            // set cookie for current request
            res
                .status(200)
                .cookie('token', contextId, {
                    expires: new Date(Date.now() + 900000) // cookie will be removed after 15 minutes
                })
                .json({
                    qrCode: url,
                    deepLink: verification.deepLink
                })
        })
    } catch (error) {
        res.status(500).json({
            'status': 'internal server error',
            'message': 'something went wrong'
        })
    }
})


router.post('/verify', async function (req, res) {
    const token = req.cookies.token
    // check for cookie
    if (isEmpty(token)) {
        res.status(401).json({
            'status': 'Unauthorized',
            'message': 'you don\'t have a access'
        })
    } else {
        // check if user linked account
        const rawData = await fetch(BRIGHTID_VERIFICATION_ENDPOINT + `/${CONTEXT}/${token}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 60000,
        })
        const data = await rawData.json()
        // check for errors
        if (data.error === true) {
            switch (data.errorNum) {
                case(CONTEXTID_NOT_FOUND):
                    res.status(data.code).json({
                        'message': 'user not linked',
                    })
                    break
                case(CAN_NOT_BE_VERIFIED):
                    res.status(data.code).json({
                        'message': 'user cannot be verified'
                    })
                    break
                case(NOT_SPONSORED):
                    if (await sponserUser(token)) {
                        res.status(200).json({
                            'message': 'sponserd! now you may try again'
                        })
                        break
                    }
                    res.status(data.code).json({
                        'message': 'user not sponserd'
                    })
                    break
                case(CONTEXT_NOT_FOUND):
                    res.status(data.code).json({
                        'message': 'context not found'
                    })
                    break
            }
        } else {
            // check the context id
            if (data.data.contextIds.includes(token)) {
                // 💡⚡ check for older context to replace new context with old one in database 💡⚡ ¯\_(ツ)_/¯
                if (data.data.contextIds.length > 1) {
                    const oldContext = data.data.contextIds[1]
                    const oldUser = await db.user.findOne({
                        where: {contextId: oldContext}
                    })
                    oldUser.contextId = token
                    await oldUser.save()
                    res.clearCookie(token)
                    res
                        .cookie('login', token, {
                            expires: new Date(Date.now() + 3600000) // cookie will be removed after 1 hours
                        })
                        .status(200)
                        .json({
                            'message': 'successfully logged in'
                        })
                } else {
                    const user = await db.user.create({
                        contextId: token
                    })
                    res.clearCookie(token)
                    res
                        .cookie('login', token, {
                            expires: new Date(Date.now() + 3600000) // cookie will be removed after 1 hours
                        })
                        .status(200)
                        .json({
                            'message': 'successfully logged in'
                        })
                }
            }
        }
    }
})


async function sponserUser(contextId) {
    function b64ToUint8Array(str) {
        return new Uint8Array(Object.values(B64.toByteArray(str)));
    }

    function uInt8ArrayToB64(array) {
        const b = Buffer.from(array);
        return b.toString('base64');
    }

    function strToUint8Array(str) {
        return new Uint8Array(Buffer.from(str, 'ascii'));
    }

    function getMessage(op) {
        const signedOp = {};
        for (let k in op) {
            if (['sig', 'sig1', 'sig2', 'hash'].includes(k)) {
                continue;
            }
            signedOp[k] = op[k];
        }
        return stringify(signedOp);
    }


    const timestamp = Date.now();
    const op = {
        'v': 5,
        'name': 'Sponsor',
        'app': process.env.APP_NAME,
        timestamp,
        contextId,
    }
    const message = getMessage(op);
    op.sig = uInt8ArrayToB64(
        Object.values(nacl.sign.detached(strToUint8Array(message), b64ToUint8Array(process.env.sponser_private)))
    );
    const response = await fetch(BRIGHTID_SUBSCRIPTION_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(op),
        json: true
    })
    const data = await response.json()
    return !data.error;

}

module.exports = router