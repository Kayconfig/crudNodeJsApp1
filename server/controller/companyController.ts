import companyModel from "../model/companyModel";
import { IncomingMessage, ServerResponse } from "http";
import url from "url";
async function getCompanies(req: IncomingMessage, res: ServerResponse) {
  try {
    const companies = await companyModel.findAllCompanies();
    const response  = {
      data:companies
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response, null, " "));
  } catch (err) {
    console.log(err);
  }
}

async function getCompany(req: IncomingMessage, res: ServerResponse) {
  let u = new url.URL(req.url as string, `http://${req.headers.host}`);
  //get id if any from search parameters
  let id = u.searchParams.get("id");
  console.log(id);
  if (id) {
    const company = await companyModel.findCompany(+id);
    if (company) {
      res.writeHead(200, { "Content-Type": "application/json" });
      const response  = {
        data:company
      }
      res.end(JSON.stringify(response, null, " "));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "error!",
          msg: "Company doesn't exist",
        })
      );
    }
  } else {
    getCompanies(req, res);
  }
}

async function addCompany(req: IncomingMessage, res: ServerResponse) {
  //get content of post
  let postData = "";
  req.on("data", (chunk) => {
    postData += chunk;
  });
  req.on("end", () => {
    try {
      // console.log(postData);
      let uploadedObject = JSON.parse(postData);
      console.log(uploadedObject);
      const response = companyModel.addCompany(uploadedObject);
      console.log("response: ", response);
      if (response) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify(
            {
              status: "success",
              msg: "Company added successfully to the database",
            },
            null,
            " "
          )
        );
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "error",
            msg: "Unable to add object, please check what you are trying to upload.",
          })
        );
      }
    } catch(err) {
      console.log(err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "error",
          msg: "malformed object, please check what you are sending.",
        })
      );
    }
    //res.end("This is a post request");
  });
}

async function updateCompany(req: IncomingMessage, res: ServerResponse) {
  let u = new url.URL(req.url as string, `http://${req.headers.host}`);
  //get id if any from search parameters
  let id = u.searchParams.get("id");
  //get data from req
  let postData = "";
  req.on("data", (chunk) => {
    postData += chunk;
  });
  req.on("end", () => {
    try {
      let uploadedObject = JSON.parse(postData);
      console.log(uploadedObject);
      let updated = companyModel.updateCompany(uploadedObject, Number(id));
      console.log(updated, id);
      if (updated) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify(
            {
              status: "success",
              msg: "Company updated successfully to the database",
            },
            null,
            " "
          )
        );
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "error",
            msg: "Unable to add object, please check what you are trying to upload.",
          })
        );
      }
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "error",
          msg: "malformed object, please check what you are sending.",
        })
      );
    }
  });
}

async function deleteCompany(req: IncomingMessage, res: ServerResponse) {
  let u = new url.URL(req.url as string, `http://${req.headers.host}`);
  //get id if any from search parameters
  let id = u.searchParams.get("id") || -1;
  let deleted = false;
  if (id > -1) {
    deleted = await companyModel.deleteCompany(+id);
  } else {
    deleted = await companyModel.deleteAllCompany();
  }
  if (deleted) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        {
          status: "success",
          msg: "Company deleted successfully to the database",
        },
        null,
        " "
      )
    );
  } else {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "error",
        msg: "Unable to delete object.",
      })
    );
  }
}

export = {
  getCompanies,
  getCompany,
  addCompany,
  updateCompany,
  deleteCompany,
};
