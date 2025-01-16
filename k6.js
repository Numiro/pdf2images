// k6 run --env PDF_PATH=/Users/atul/Desktop/test.pdf ./k6.js

import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 30, // Number of virtual users
  duration: "1m", // Duration of the test
};

const binFile = open(__ENV.PDF_PATH, "b");

export default function () {
  const data = {
    field: "this is a standard form field",
    pdf: http.file(binFile, "test.bin"),
  };

  const res = http.post("http://0.0.0.0:8787/pdf-to-images", data);

  // Check the response status and other properties
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response body is not empty": (r) => r.body && r.body.length > 0,
  });

  // sleep(1);
}
