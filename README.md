# PDF to WebP conversion api

A high-performance REST API service built with Deno that converts PDF documents to WebP images. The service processes PDFs, optimizes the images with Sharp, and returns a ZIP archive containing WebP images for each page.

## Features

- 🚀 Fast PDF to WebP conversion
- 📦 Returns all pages as a ZIP archive
- 🛡️ Built with Deno for enhanced security

## Prerequisites

- Deno 2.x or higher

## Installation

1. Clone the repository
2. Install Deno if you haven't already: https://deno.land/manual/getting_started/installation

```bash
deno install --allow-scripts
```

## Usage

### Starting the Server

```bash
deno task start
```

The server will start on port 8787 by default. You can customize the port by setting the `PORT` environment variable.

### API Endpoints

#### Health Check

- **GET /**
- Returns "ok" if the server is running

#### Convert PDF to WebP Images

- **POST /pdf-to-images**
- Content-Type: multipart/form-data
- Request body:
  - `pdf`: PDF file to convert

Response:

- 200: ZIP archive containing WebP images for each page
- 400: Error if no PDF file is uploaded
- 500: Server error with error message

### Example Usage

Using cURL:

```bash
curl -X POST -F "pdf=@/path/to/your/document.pdf" http://localhost:8787/pdf-to-images -o pages.zip
```

## Load Testing

The project includes K6 load testing configuration. To run the load tests:

1. Set the PDF_PATH environment variable to your test PDF file
2. Run the test:

```bash
k6 run --env PDF_PATH=/path/to/your/test.pdf ./k6.js
```

## Docker

Build

```sh
docker build . -t pdf2images:latest
```

Run

```sh
docker run -p 8787:8787 --rm pdf2images:latest
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
