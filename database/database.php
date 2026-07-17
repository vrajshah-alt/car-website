<?php
$host = 'localhost';  
$user = 'root';  
$pass = '1234'; 
$dbname = 'cars'; 
$conn = mysqli_connect($host, $user, $pass, $dbname);  
//if(! $conn )  
//{  
//  die('Could not connect: ' . mysqli_error());  
//}  
//echo 'Connected successfully';  
$sql = "insert into cars(name,email,message) values(?,?,?)";
$name = $_GET['name'];
$email = $_GET['email'];
$message = $_GET['message'];
$res = $conn->prepare($sql);
$res->bind_param("sss",$name,$email,$message);
$res->execute();

if($res->error){
    echo "fail:".$res->error;
}else{
    echo "<script>alert('Thanks For Feedbackus')</script>";
    echo "<script>window.location.href='../login.html'</script>";
}
?>