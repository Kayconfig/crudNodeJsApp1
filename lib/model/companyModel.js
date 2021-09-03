"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const database_json_1 = __importDefault(require("../database/database.json"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(".", "./lib/database/database.json");
function processObj(obj) {
    const propertiesToRemove = ["id", "createdAt", "updatedAt"];
    return Object.fromEntries(Object.entries(obj).filter((arr) => !propertiesToRemove.includes(arr[0])));
}
function verifyObject(obj) {
    if (typeof obj !== "object") {
        return false;
    }
    const mustHaveProperties = [
        "organization",
        "products",
        "marketValue",
        "address",
        "ceo",
        "country",
        "employees",
    ];
    const objKeys = Object.keys(obj);
    if (mustHaveProperties.every((key) => objKeys.includes(key))) {
        return true;
    }
    else {
        return false;
    }
}
function findCompany(id) {
    return new Promise((resolve, reject) => {
        let company = processObj(database_json_1.default.find((company) => company.id == id) || {});
        if (Object.keys(company).length > 0) {
            resolve(company);
        }
        else {
            resolve(false);
        }
    });
}
function findAllCompanies() {
    return new Promise((resolve, reject) => {
        resolve(database_json_1.default.map(processObj));
    });
}
function addCompany(obj) {
    if (verifyObject(obj)) {
        console.log("model.addCompany is called...");
        const id = database_json_1.default.length + 1;
        const createdAt = new Date(Date.now()).toISOString();
        const updatedAt = createdAt;
        obj.noOfEmployees = obj.employees.length;
        database_json_1.default.push({
            ...obj,
            id,
            createdAt,
            updatedAt,
        });
        fs_1.writeFileSync(dbPath, JSON.stringify(database_json_1.default, null, " "));
        return true;
    }
    else {
        return false;
    }
}
function updateCompany(obj, id) {
    const objIndex = database_json_1.default.findIndex((company) => company.id === +id);
    console.log("object index: ", objIndex, id);
    //get object with the passed id
    const objInDb = database_json_1.default.find((company) => company.id === +id);
    console.log("updateCompany says: ", objInDb);
    if (objInDb) {
        //object exist in db
        const updatedAt = new Date(Date.now()).toISOString();
        obj.noOfEmployees = obj.employees.length;
        const updatedObj = {
            ...objInDb,
            ...obj,
            updatedAt,
        };
        database_json_1.default.splice(objIndex, 1, updatedObj);
        fs_1.writeFileSync(dbPath, JSON.stringify(database_json_1.default, null, " "));
        return true;
    }
    else {
        return false;
    }
}
function deleteCompany(id) {
    return new Promise((resolve, reject) => {
        //if company not in database return false
        let companyIndex = database_json_1.default.findIndex((company) => company.id === id);
        if (companyIndex > -1) {
            //delete the company
            database_json_1.default.splice(companyIndex, 1);
            fs_1.writeFileSync(dbPath, JSON.stringify(database_json_1.default, null, " "));
            resolve(true);
            return;
        }
        else {
            resolve(false);
        }
    });
}
function deleteAllCompany() {
    return new Promise((resolve, reject) => {
        //if company not in database return false
        try {
            database_json_1.default.length = 0;
            resolve(true);
            fs_1.writeFileSync(dbPath, JSON.stringify(database_json_1.default, null, " "));
        }
        catch {
            resolve(false);
        }
    });
}
module.exports = {
    findCompany,
    findAllCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    deleteAllCompany,
};
