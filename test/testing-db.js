// import User from "./server";
import mocha from "mocha";
// const mocha = require("mocha");
import assert from "assert";
// const assert = require("assert");
import User from "./db-test";
// const User = require("../db-test")

describe("saving records", ()=>{

    it("saves a record to the database", (done)=>{

        // variable to store a user in
        let char = new User({
            // include all or not fields from the schema
            email: "testing@teamphi.com",
            password: "teamphi"
        });

        char.save().then(()=>{
            assert(char.isNew === false);
            done();
        }); /* goes to localhost:3000 and saves it there */

    });

    // next test if we have to

});