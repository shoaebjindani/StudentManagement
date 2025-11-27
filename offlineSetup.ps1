# Function to check if Docker is installed
function Check-DockerInstalled {
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        return $true  # Docker is installed
    } else {
        return $false  # Docker is not installed
    }
}

# Function to install Docker
function Install-Docker {
    Write-Host "Docker is not installed. Installing Docker..."
    # Add the Docker repository and install Docker
    Invoke-WebRequest -UseBasicParsing -OutFile dockerInstall.ps1 https://get.docker.com/windows
    .\dockerInstall.ps1

    Write-Host "Docker has been installed successfully."
}

# Function to run the MySQL container
function Run-MySQLContainer {
    Write-Host "Running MySQL container..."
    docker run --name mysqldb-container -d -p 3305:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8.0.33-debian
    Write-Host "MySQL container has been started."
}

# Function to run the studentmanagement container
function Run-studentmanagementContainer {
    Write-Host "Running Student Management container..."
    docker run -d --link mysqldb-container -p 8080:8080 `
        -e mysqlusername="root" `
        -e password="root" `
        -e host="mysqldb-container" `
        -e port="3306" `
        -e mySqlPath="1" `
        -e schemaName="customizedpos_local" `
        -e projectName="Student Management Offline" `
        -e thread_sleep=0 `
        -e isAuditEnabled="false" `
        -e copyAttachmentsToBuffer="false" `
        -e persistentPath="/home/ubuntu/society_maintenance_staging/" `
        -e queryLogEnabled="false" `
        -e sendEmail="false" `
        shoaebjindani/studentmanagement
    Write-Host "Student Management container has been started."
}

function Wait-ForMySQL {
    $container_name = "mysqldb-container"
    $max_attempts = 30
    $sleep_duration = 1
    $i = 1

    Write-Host "Waiting for MySQL container to start..."
    while ($i -le $max_attempts) {
        if (docker ps --filter "name=mysqldb-container" --format "{{.Status}}" | ForEach-Object { $_ -match "Up" }) {

            Write-Host "MySQL container is ready."
            return $true
        } else {
            Write-Host "mysql container isn't running yet"
            $i++
            Start-Sleep $sleep_duration
        }
    }

    Write-Host "Timed out waiting for MySQL container to start."
    return $false
}

# Check if Docker is installed
if (Check-DockerInstalled) {
    Write-Host "Docker is already installed."
} else {
    Install-Docker
}

# Run the MySQL container
Run-MySQLContainer

Wait-ForMySQL

# Run the Student Management container
Run-studentmanagementContainer
