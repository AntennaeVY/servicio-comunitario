const { spawn, exec } = require("child_process");
const express = require("express");
const path = require("path");
const fs = require("fs");

// Helper to resolve paths correctly in a `pkg` snapshot
const isPkg = typeof process.pkg !== "undefined";
const resolvePath = (filePath) => {
  return isPkg ? path.join(path.dirname(process.execPath), filePath) : filePath;
};

(async () => {
  try {
    // Function to resolve the `dist` folder path
    const resolveDistPath = () => {
      const distPath = resolvePath("dist");
      if (!fs.existsSync(distPath)) {
        console.error("Error: The 'dist' folder does not exist.");
        console.error(
          "Ensure the 'dist' folder is built and included as an asset when packaging with pkg."
        );
        process.exit(1);
      }
      return distPath;
    };

    // Function to open the URL based on the platform
    const openURL = (url) => {
      const platform = process.platform;
      if (platform === "win32") {
        exec(`start ${url}`);
      } else if (platform === "darwin") {
        exec(`open ${url}`);
      } else {
        exec(`xdg-open ${url}`);
      }
    };

    // Check if running in background mode
    if (process.argv.includes("--background")) {
      const PORT = process.env.PORT || 3000;

      console.log("Starting the server in the background...");

      // Start the server
      const app = express();
      const distPath = resolveDistPath();

      // Serve the dist folder
      app.use(express.static(distPath));

      app.get("*", (req, res) => {
        const indexPath = path.join(distPath, "index.html");
        if (!fs.existsSync(indexPath)) {
          console.error(
            "Error: index.html does not exist in the 'dist' folder."
          );
          res.status(500).send("Server Error: Missing index.html");
          return;
        }
        res.sendFile(indexPath);
      });

      app.listen(PORT, () => {
        const url = `http://localhost:${PORT}`;
        console.log(`Server running at ${url}`);

        // Open the link in the default browser
        openURL(url);
      });
    } else {
      console.log("Detaching process and running in the background...");

      // Generate a writable log file outside the executable's snapshot
      const logFile = path.resolve(process.cwd(), "server.log");

      const subprocess = spawn(process.argv[0], [__filename, "--background"], {
        detached: true,
        stdio: ["ignore", fs.openSync(logFile, "a"), fs.openSync(logFile, "a")], // Redirect output to external log file
      });

      subprocess.unref(); // Fully detach the process
      process.exit(0); // Exit the parent process to close the terminal
    }
  } catch (error) {
    console.error("Error starting the server:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
