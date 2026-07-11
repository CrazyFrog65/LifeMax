import app from "./app.js";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT || 5000;

// Start listening for incoming connections
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
