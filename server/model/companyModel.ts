import companies from "../database/database.json";
import { writeFileSync } from "fs";
import { OrganizationInterface } from "../interfaces/interface";
import path from "path";

const dbPath = path.resolve(".", "./lib/database/database.json");

function processObj(obj: any) {
  const propertiesToRemove = ["id", "createdAt", "updatedAt"];
  return Object.fromEntries(
    Object.entries(obj).filter((arr) => !propertiesToRemove.includes(arr[0]))
  );
}
function verifyObject(obj: any): boolean {
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
  if (
    mustHaveProperties.every((key) => objKeys.includes(key))
  ) {
    return true;
  } else {
    return false;
  }
}
function findCompany(id: number) {
  return new Promise((resolve, reject) => {
    let company = processObj(
      companies.find((company) => company.id == id) || {}
    );
    if (Object.keys(company).length > 0) {
      resolve(company);
    } else {
      resolve(false);
    }
  });
}

function findAllCompanies() {
  return new Promise((resolve, reject) => {
    resolve(companies.map(processObj));
  });
}

function addCompany(obj: any): boolean {
  if (verifyObject(obj)) {
    console.log("model.addCompany is called...")
    const id = companies.length + 1;
    const createdAt = new Date(Date.now()).toISOString();
    const updatedAt = createdAt;
    obj.noOfEmployees = obj.employees.length;
    companies.push({
      ...obj,
      id,
      createdAt,
      updatedAt,
    });
    writeFileSync(dbPath, JSON.stringify(companies, null, " "));
    return true;
  } else {
    return false;
  }
}

function updateCompany(obj: OrganizationInterface, id: number): boolean {
  const objIndex = companies.findIndex((company) => company.id === +id);
  console.log("object index: ", objIndex, id);
  //get object with the passed id
  const objInDb = companies.find((company) => company.id === +id);
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
    companies.splice(objIndex, 1, updatedObj);
    writeFileSync(dbPath, JSON.stringify(companies, null, " "));
    return true;
  } else {
    return false;
  }
}

function deleteCompany(id: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    //if company not in database return false
    let companyIndex = companies.findIndex((company) => company.id === id);
    if (companyIndex > -1) {
      //delete the company
      companies.splice(companyIndex, 1);
      writeFileSync(dbPath, JSON.stringify(companies, null, " "));
      resolve(true);
      return;
    } else {
      resolve(false);
    }
  });
}

function deleteAllCompany(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    //if company not in database return false
    try {
      companies.length = 0;
      resolve(true);
      writeFileSync(dbPath, JSON.stringify(companies, null, " "));
    } catch {
      resolve(false);
    }
  });
}

export = {
  findCompany,
  findAllCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  deleteAllCompany,
};
