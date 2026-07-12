#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const mainJs = path.join(__dirname, "website", "main.js");

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(function (resolve) {
    rl.question(question, function (answer) {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("\nPortfolio contact setup");
  console.log("Updates website/main.js with your LinkedIn and email.\n");

  var linkedin = process.argv[2] || (await ask("LinkedIn profile URL: "));
  var email = process.argv[3] || (await ask("Email address: "));

  if (!linkedin || !email) {
    console.error("Both LinkedIn URL and email are required.");
    process.exit(1);
  }
  if (!/^https?:\/\//i.test(linkedin)) {
    console.error("LinkedIn must start with http:// or https://");
    process.exit(1);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Enter a valid email address.");
    process.exit(1);
  }

  var js = fs.readFileSync(mainJs, "utf8");
  js = js.replace(/linkedin:\s*"[^"]*"/, 'linkedin: "' + linkedin.replace(/"/g, '\\"') + '"');
  js = js.replace(/email:\s*"[^"]*"/, 'email: "' + email.replace(/"/g, '\\"') + '"');
  fs.writeFileSync(mainJs, js);

  console.log("\nDone! website/main.js updated.");
  console.log("Commit and push to redeploy:\n  git add website/main.js && git commit -m \"Add contact info\" && git push\n");
}

main().catch(function (e) {
  console.error(e.message || e);
  process.exit(1);
});
