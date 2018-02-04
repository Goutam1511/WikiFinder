 <?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "parentdata";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
  die("Database connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";

if((isset($_POST['skill'])) and (isset($_POST['parent1'])) and (isset($_POST['parent2']))) 
{ 
$skill= mysqli_real_escape_string($conn, $_POST['skill']);
$parent1=mysqli_real_escape_string($conn, $_POST['parent1']);
$parent2=mysqli_real_escape_string($conn, $_POST['parent2']);

$sql = "SELECT skill_id FROM skill_tree ORDER BY skill_id DESC LIMIT 0,1";
$request=mysqli_query($conn,$sql);
$array = mysqli_fetch_assoc($request);
$req_id =(int)$array['skill_id'];
$req_id=$req_id+1;
$skid=$prid=$rtid=$req_id;

$getinfo1 = "SELECT skill_id, root_id FROM skill_tree WHERE skill ='$parent1'";
$result1 = mysqli_query($conn, $getinfo1);
if(mysqli_num_rows($result1)!=0)
{	$rslt1 = mysqli_fetch_assoc($result1);
	$prid = (int)$rslt1["skill_id"];
	$rtid = (int)$rslt1["root_id"];
	$sql = "INSERT INTO skill_tree (skill_id, skill, parent_id, root_id)
	VALUES ('$skid', '$skill', '$prid', '$rtid')";
	mysqli_query($conn, $sql);
	echo "P1 found";
}
else
{   $getinfo2 = "SELECT skill_id, root_id FROM skill_tree WHERE skill ='$parent2'";
	$result2 = mysqli_query($conn, $getinfo2);
	if(mysqli_num_rows($result2)!=0) {
		$rslt2 = mysqli_fetch_assoc($result2);
		$prid = (int)$rslt2["skill_id"];
		$rtid = (int)$rslt2["root_id"];
		$sql = "INSERT INTO skill_tree (skill_id, skill, parent_id, root_id)
		VALUES ('$skid', '$parent1', '$prid', '$rtid')";
		$prid=$skid;
		$skid=$skid+1;
		$sql = "INSERT INTO skill_tree (skill_id, skill, parent_id, root_id)
		VALUES ('$skid', '$skill', '$prid', '$rtid')";
		mysqli_query($conn, $sql);
		echo "P2 found";
	} 
	else {
		$sql = "INSERT INTO skill_tree (skill_id, skill, parent_id, root_id)
		VALUES ('$skid', '$parent2', '$prid', '$rtid')";
		mysqli_query($conn, $sql);
		$prid=$skid;
		$skid=$skid+1;
		$sql = "INSERT INTO skill_tree (skill_id, skill, parent_id, root_id)
		VALUES ('$skid', '$parent1', '$prid', '$rtid')";
		mysqli_query($conn, $sql);
		$prid=$skid;
		$skid=$skid+1;
		$sql = "INSERT INTO skill_tree (skill_id, skill, parent_id, root_id)
		VALUES ('$skid', '$skill', '$prid', '$rtid')";
		mysqli_query($conn, $sql);
		echo "Neither P1 nor P2 found";
	}
}
}	
	
?>
