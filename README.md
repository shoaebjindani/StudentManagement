#!/bin/bash

# Variables
REPO_URL="https://github.com/shoaebjindani/StudentManagement"
PROJECT_DIR="StudentManagement"
CONFIG_FILE_PATH="$PROJECT_DIR/src/main/java/com/shoaeb/shoaebjindani/Configuration/Config.yaml"

echo "=============================================="
echo "   StudentManagement - Project Setup Script"
echo "=============================================="

# Clone the repository with the new unified FrameWork submodule
echo "Cloning repository (with submodules)..."
git clone --recurse-submodules $REPO_URL

# Check if the repository was cloned successfully
if [ -d "$PROJECT_DIR" ]; then
    echo "✅ Repository cloned successfully."
else
    echo "❌ Failed to clone repository. Exiting."
    exit 1
fi

# Move into project directory
cd $PROJECT_DIR

# Initialize and update the unified FrameWork submodule
echo "Initializing and updating FrameWork submodule..."
git submodule update --init --recursive

echo "✅ FrameWork submodule ready."

# Create Config.yaml file if it doesn’t exist
echo "Setting up Config.yaml configuration..."
mkdir -p "$(dirname "$CONFIG_FILE_PATH")"

if [ ! -f "$CONFIG_FILE_PATH" ]; then
cat <<EOL > $CONFIG_FILE_PATH
mysqlusername: ""
password: ""
host: ""
port: "3306"
mySqlPath: "1"
schemaName: customizedpos_staging
projectName: shoaebjindani Staging
thread_sleep: 0
isAuditEnabled: "true"
copyAttachmentsToBuffer: "false"
persistentPath: "/home/ubuntu/ags_attachments/"
queryLogEnabled: "false"
sendEmail: "false"
EOL
    echo "✅ Config.yaml file created at $CONFIG_FILE_PATH"
else
    echo "ℹ️ Config.yaml already exists — skipping creation."
fi

echo "=============================================="
echo "✅ Setup complete."
echo "You can now build and run the project:"
echo ""
echo "   cd $PROJECT_DIR"
echo "   mvn clean package"
echo "   java -jar target/*.jar"
echo "=============================================="
