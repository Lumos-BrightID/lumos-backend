const db = require('../models/index')

/**
 * create user with ContextId
 * @param token
 * @return {Promise<void>}
 * @constructor
 */
const CreateUser = async (token) => {
    try {
        await db.user.create({
            contextId: token
        })
    } catch (error) {
        console.log(error)
    }
}

/**
 * update user contextId
 * @param user
 * @param token
 * @return {Promise<void>}
 * @constructor
 */
const UpdateUser = async (user, token) => {
    try {
        user.contextId = token
        await user.save()
    } catch (error) {
        console.log(error)
    }
}

/**
 * find user by contextId
 * @return {Promise<Model<any, TModelAttributes>>}
 * @constructor
 * @param obj
 */
const FindUser = async (obj) => {
    try {
        return await db.user.findOne({
            where: obj
        })
    }catch(error){
        console.log(error)
    }
}


module.exports = {
    CreateUser,
    UpdateUser,
    FindUser
}