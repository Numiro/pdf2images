# Use the official Deno Debian image
FROM denoland/deno:debian

# Install required libraries
RUN apt-get update && apt-get install -y \
    libvips \
    libstdc++6

# Set the working directory
WORKDIR /app

# Copy project files
COPY . .

# Cache Deno dependencies
RUN deno cache main.ts

# Expose the application port
EXPOSE 8000

# Start the application with required permissions
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--allow-ffi", "main.ts"]