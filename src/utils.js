import {dirname} from "path"
import { fileURLToPath } from "url"
export const __dirname=dirname(fileURLToPath(import.meta.url))


//hasheo

import bcrypt from "bcrypt"

/*export const createHash = password => bcrypt.hashSync (password, bcrypt.genSaltSync (10))
export const isValidPassword = (user,password) => bcrypt.compareSync (password, user.password)*/



export const createHash =async password => {
    const saltRounds =10
    return await bcrypt.hash (password,saltRounds)
}

export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password)
