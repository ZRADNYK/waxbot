import path from "path";
import {User} from "./user-model";
import {logger} from "../lib/puppeteer-utils";

const fs = require('fs');
export async function getUsersFromFile(userFile) {
    let users = [];
    logger.log(path.resolve(userFile));
    const allFileContents = fs.readFileSync(path.resolve(userFile), 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line =>  {
        if(line.length > 0) {
            let userData = line.split(':');
            let user = new User(userData[0], userData[1], userData[2], userData[3]);
            users.push(user);
        }
    });
    return users;
}
