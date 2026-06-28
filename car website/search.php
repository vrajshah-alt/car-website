<?php

// Database connection details
$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "cars";

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the value of the webpage name from the form
if (isset($_GET['webpage_name'])) {
    $webpage_name = $_GET['webpage_name'];
} else {
    die("Webpage name not provided.");
}

// Check if the user entered the name of the first webpage
if ($webpage_name == "bmw" || $webpage_name == "Bmw" || $webpage_name == "BMW" || $webpage_name == "BMW X1" || 
    $webpage_name == "BMW 7 Series" || $webpage_name == "BMW 2 Series" || $webpage_name == "BMW 3 Series" || 
    $webpage_name == "BMW M340i" || $webpage_name == "BMW Z4" || $webpage_name == "BMW 5 Series" || 
    $webpage_name == "BMW XM" || $webpage_name == "BMW X5" || $webpage_name == "BMW X7" || 
    $webpage_name == "BMW 6 Series GT" || $webpage_name == "BMW X3" || $webpage_name == "BMW M4" || 
    $webpage_name == "BMW M8" || $webpage_name == "BMW M2" || $webpage_name == "BMW iX1" || 
    $webpage_name == "BMW i7" || $webpage_name == "BMW i4" || $webpage_name == "BMW X4 M40i" || 
    $webpage_name == "BMW iX" || $webpage_name == "BMW X3 M40i" || $webpage_name == "BMW X5 M"
    || $webpage_name == "bmw X1" || $webpage_name == "bmw 7 Series" || $webpage_name == "bmw 2 Series" 
    || $webpage_name == "bmw 3 Series" || $webpage_name == "bmw M340i" || $webpage_name == "bmw Z4" 
    || $webpage_name == "bmw 5 Series" || $webpage_name == "bmw XM" || $webpage_name == "bmw X5" 
    || $webpage_name == "bmw X7" || $webpage_name == "bmw 6 Series GT" || $webpage_name == "bmw X3" 
    || $webpage_name == "bmw M4" || $webpage_name == "bmw M8" || $webpage_name == "bmw M2" 
    || $webpage_name == "bmw IX1" || $webpage_name == "bmw I7" || $webpage_name == "bmw I4" 
    || $webpage_name == "bmw X4 M40i" || $webpage_name == "bmw IX" || $webpage_name == "bmw X3 M40i" 
    || $webpage_name == "bmw X5 M" 
    || $webpage_name == "bmw x1" || $webpage_name == "bmw 7 series" || $webpage_name == "bmw 2 series" 
    || $webpage_name == "bmw 3 series" || $webpage_name == "bmw m340i" || $webpage_name == "bmw x4" 
    || $webpage_name == "bmw 5 series" || $webpage_name == "bmw xm" || $webpage_name == "bmw x5" 
    || $webpage_name == "bmw x7" || $webpage_name == "bmw 6 series GT" || $webpage_name == "bmw x3" 
    || $webpage_name == "bmw m4" || $webpage_name == "bmw m8" || $webpage_name == "bmw m2" 
    || $webpage_name == "bmw ix1" || $webpage_name == "bmw i7" || $webpage_name == "bmw i4" 
    || $webpage_name == "bmw x4 m40i" || $webpage_name == "bmw iX" || $webpage_name == "bmw x3 m40i" 
    || $webpage_name == "bmw x5 M") {
    // Query the first table to retrieve webpage content
    $sql = "SELECT * FROM BMW";
} elseif ($webpage_name == "mercedes" || $webpage_name == "Mercedes" || $webpage_name == "MERCEDES" 
|| $webpage_name == "Mercedes-Benz G-Class" || $webpage_name == "Mercedes-Benz A-Class Limousine" || $webpage_name == "Mercedes-Benz C-Class" 
|| $webpage_name == "Mercedes-Benz GLA"|| $webpage_name == "mercedes benz gls" || $webpage_name == "Mercedes-Benz GLE" 
|| $webpage_name == "Mercedes-Benz AMG C 43" || $webpage_name == "Mercedes-Benz Maybach GLS" || $webpage_name == "Mercedes-Benz E-Class"
|| $webpage_name == "Mercedes-Benz S-Class" || $webpage_name == "Mercedes-Benz GLC Coupe" || $webpage_name == "Mercedes-Benz GLB" 
|| $webpage_name == "Mercedes-Benz AMG E53 Cabriolet"|| $webpage_name == "Mercedes-Benz AMG A35" || $webpage_name == "Mercedes-Benz AMG SL55 Roadster" 
|| $webpage_name == "Mercedes-Benz AMG GLA35" || $webpage_name == "Mercedes-Benz AMG GLC43 Coupe" || $webpage_name == "Mercedes-Benz AMG GT 63 S E Performance"
|| $webpage_name == "Mercedes-Benz AMG A45 S" || $webpage_name == "Mercedes-Benz AMG E53" || $webpage_name == "Mercedes-Benz EQB" 
|| $webpage_name == "Mercedes-Benz AMG GLE Coupe"|| $webpage_name == "Mercedes-Benz EQS" || $webpage_name == "Mercedes-Benz AMG GT 63 S E Performance" 
|| $webpage_name == "Mercedes-Benz AMG E63" || $webpage_name == "Mercedes-Benz EQE SUV" || $webpage_name == "Mercedes-Benz EQS") {
    // Query the second table to retrieve webpage content
    $sql = "SELECT * FROM Mercedes";
} elseif ($webpage_name == "Jaguar" || $webpage_name == "jaguar" || $webpage_name == "JAGUAR" 
            || $webpage_name == "Jaguar F-Type" || $webpage_name == "jaguar f-type" || $webpage_name == "JAGUAR F-TYPE" 
            || $webpage_name == "Jaguar F-Pace"|| $webpage_name == "jaguar f-pace" || $webpage_name == "JAGUAR F-PACE" 
            || $webpage_name == "Jaguar I-Pace" || $webpage_name == "jaguar i-pace" || $webpage_name == "JAGUAR I-PACE" 
            || $webpage_name == "Jaguar E-Pace"|| $webpage_name == "jaguar e-pace" || $webpage_name == "JAGUAR E-PACE") {
    // Query the second table to retrieve webpage content
    $sql = "SELECT * FROM Jaguar";
} elseif ($webpage_name == "Kia" || $webpage_name == "kia" || $webpage_name == "KIA" || $webpage_name == "Kia Sonet" 
            || $webpage_name == "kia sonet" || $webpage_name == "KIA SONET" || $webpage_name == "Kia Seltos" 
            || $webpage_name == "kia seltos" || $webpage_name == "KIA SELTOS" || $webpage_name == "Kia Carens" 
            || $webpage_name == "KIA CARENS" || $webpage_name == "kia carens" || $webpage_name == "Kia EV6" 
            || $webpage_name == "KIA EV6" || $webpage_name == "kia ev6" || $webpage_name == "Kia Carnival" 
            || $webpage_name == "KIA CARNIVAL" || $webpage_name == "kia carnival") {
    // Query the second table to retrieve webpage content
    $sql = "SELECT * FROM Kia";
} elseif ($webpage_name == "maruti suzuki"  || $webpage_name == "Maruti Suzuki" || $webpage_name == "MARUTI SUZUKI" 
|| $webpage_name == "Maruti Fronx" || $webpage_name == "Maruti Grand Vitara" || $webpage_name == "Maruti Brezza" 
|| $webpage_name == "Maruti Ertiga"|| $webpage_name == "Maruti Baleno" || $webpage_name == "Maruti Swift" 
|| $webpage_name == "Maruti Alto K10" || $webpage_name == "Maruti Wagon R" || $webpage_name == "Maruti Dzire"
|| $webpage_name == "Maruti Celerio" || $webpage_name == "Maruti XL6" || $webpage_name == "Maruti S-Presso" 
|| $webpage_name == "Maruti Jimny"|| $webpage_name == "Maruti Eeco" || $webpage_name == "Maruti Ciaz" 
|| $webpage_name == "Maruti Invicto" || $webpage_name == "Maruti Ignis" || $webpage_name == "Maruti New-gen Swift"
|| $webpage_name == "Maruti New Dzire" || $webpage_name == "Maruti eVX") {
    // Query the second table to retrieve webpage content
    $sql = "SELECT * FROM Maruti";
} elseif ($webpage_name == "Toyota" || $webpage_name == "toyota" || $webpage_name == "TOYOTA" 
        || $webpage_name == "Toyota Urban Cruiser Hyryder" || $webpage_name == "toyota urban cruiser hyryder" || $webpage_name == "TOYOTA URBAN CRUISER HYRYDER" 
        || $webpage_name == "Toyota Innova Crysta"|| $webpage_name == "toyota innova crysta" || $webpage_name == "TOYOTA Innova CRYSTA" 
        || $webpage_name == "Toyota Innova Hycross" || $webpage_name == "toyota innova hycross" || $webpage_name == "TOYOTA INNOVA HYCROSS"
        || $webpage_name == "Toyota Rumion" || $webpage_name == "toyota rumion" || $webpage_name == "TOYOTA RUMION" 
        || $webpage_name == "Toyota Glanza"|| $webpage_name == "toyota glanza" || $webpage_name == "TOYOTA GLANZA" 
        || $webpage_name == "Toyota Fortuner" || $webpage_name == "toyota fortuner" || $webpage_name == "TOYOTA FORTUNER"
        || $webpage_name == "Toyota Land Cruiser" || $webpage_name == "toyota land cruiser" || $webpage_name == "TOYOTA LAND CRUISER" 
        || $webpage_name == "Toyota Hilux"|| $webpage_name == "toyota hilux" || $webpage_name == "TOYOTA HILUX" 
        || $webpage_name == "Toyota Camry" || $webpage_name == "toyota camry" || $webpage_name == "TOYOTA CAMRY"
        || $webpage_name == "Toyota Fortuner Legender" || $webpage_name == "toyota fortuner legender" || $webpage_name == "TOYOTA FORTUNER LEGENDER"
        || $webpage_name == "Toyota Vellfire" || $webpage_name == "toyota vellfire" || $webpage_name == "TOYOTA VELLFIRE") {
    // Query the second table to retrieve webpage content
    $sql = "SELECT * FROM Toyota";
} elseif ($webpage_name == "Volkswagen" || $webpage_name == "volkswagen" || $webpage_name == "VOLKSWAGEN" 
        || $webpage_name == "Volkswagen Virtus" || $webpage_name == "volkswagen virtus" || $webpage_name == "VOLKSWAGEN VIRTUS" 
        || $webpage_name == "Volkswagen Taigun"|| $webpage_name == "volkswagen taigun" || $webpage_name == "VOLKSWAGEN TAIGUN" 
        || $webpage_name == "Volkswagen ID.4" || $webpage_name == "volkswagen id.4" || $webpage_name == "VOLKSWAGEN ID.4") {
    // Query the second table to retrieve webpage content
    $sql = "SELECT * FROM Valkswagen";
} elseif ($webpage_name == "hundai" || $webpage_name == "Hundai" || $webpage_name == "HUNDAI" 
|| $webpage_name == "Hyundai Creta N Line" || $webpage_name == "Hyundai Creta" || $webpage_name == "Hyundai Exter" 
|| $webpage_name == "Hyundai Venue"|| $webpage_name == "Hyundai Verna" || $webpage_name == "Hyundai i20" 
|| $webpage_name == "Hyundai Grand i10 Nios" || $webpage_name == "Hyundai Aura" || $webpage_name == "Hyundai Alcazar"
|| $webpage_name == "Hyundai i20 N Line" || $webpage_name == "Hyundai Ioniq 5" || $webpage_name == "Hyundai Tucson" 
|| $webpage_name == "Hyundai Venue N Line"|| $webpage_name == "Hyundai Kona Electric" || $webpage_name == "Hyundai Alcazar facelift" 
|| $webpage_name == "Hyundai Stargazer" || $webpage_name == "Hyundai Creta EV" || $webpage_name == "Hyundai New Santa Fe"
|| $webpage_name == "Hyundai Tucson facelift" || $webpage_name == "Hyundai Ioniq 6" || $webpage_name == "Hyundai Palisade") {
    // Query the second table to retrieve webpage content
    $sql = "SELECT * FROM Hundai";
} else {
    die("Invalid webpage name.");
}

// Execute the SQL query
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        // Output or process the retrieved webpage content
        echo " " . $row["content"] . "<br>";
    }
} else {
    echo "No results found.";
}

// Close the database connection
$conn->close();

?>
