<?php

// Database connection details
$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "cars";

// Path to the HTML file containing webpage content
$phpFilePath = __DIR__ . '/volkswagen.html';

// Read the content of the file
$content = file_get_contents($phpFilePath);

if ($content === false) {
    die("Error reading PHP file.");
}

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if data already exists in the database
$sqlCheck = "SELECT * FROM Valkswagen";
$result = $conn->query($sqlCheck);

if ($result->num_rows > 0) {
    // If data exists, perform an update query
    $sql = "UPDATE Valkswagen SET content = ? WHERE id = 1"; // Assuming 'id' is the primary key
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Bind parameters and execute the statement
    $stmt->bind_param("s", $content);
    if ($stmt->execute()) {
        echo "Webpage content updated successfully." . PHP_EOL;
    } else {
        echo "Error updating webpage content: " . $stmt->error . PHP_EOL;
    }

    $stmt->close();
} else {
    // If no data exists, perform an insert query
    $sql = "INSERT INTO BMW (content) VALUES (?)";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    // Bind parameters and execute the statement
    $stmt->bind_param("s", $content);
    if ($stmt->execute()) {
        echo "Webpage content inserted successfully." . PHP_EOL;
    } else {
        echo "Error inserting webpage content: " . $stmt->error . PHP_EOL;
    }

    $stmt->close();
}

// Close the database connection
$conn->close();

?>
