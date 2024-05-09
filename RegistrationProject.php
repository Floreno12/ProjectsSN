<?php
// Database connection
$servername = "localhost";
$username = "users";
$password = "password123";
$dbname = "auto";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted for registration
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user into database
    $sql = "INSERT INTO users (username, password) VALUES ('$username', '$hashed_password')";
    if ($conn->query($sql) === TRUE) {
        // Registration successful, display login form
        $registration_success = true;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Check if form is submitted for login
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Fetch hashed password from database
    $sql = "SELECT password FROM users WHERE username = '$username'";//get password from particular user
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {//check in find username
        $row = $result->fetch_assoc();//get array with table value
        $hashed_password = $row["password"];//get the password dependency from username

        // Verify password
        if (password_verify($password, $hashed_password)) {
            echo "Login successful";
            // Redirect to some page after successful login
            // header("Location: welcome.php");
        } else {
            echo "Invalid username or password";
        }
    } else {
        echo "Invalid username or password";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <?php if (!isset($registration_success) || !$registration_success): ?>
    <!-- Display registration form if not registered or registration failed -->
    <h2>Sign Up</h2>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div>
            <input type="submit" value="Register" name="register">
        </div>
    </form>
    <?php else: ?>
    <!-- Display login form if registration was successful -->
    <h2>Login</h2>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div>
            <input type="submit" value="Login" name="login">
        </div>
    </form>
    <?php endif; ?>
</body>
</html>



//V2OOP
<?php
class UserAuth {
    private $conn;

    // Constructor to establish database connection
    public function __construct($servername, $username, $password, $dbname) {
        $this->conn = new mysqli($servername, $username, $password, $dbname);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    // Method to handle user registration
    public function registerUser($username, $password) {
        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user into database
        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $username, $hashed_password);
        
        if ($stmt->execute()) {
            return true; // Registration successful
        } else {
            return false; // Registration failed
        }
    }

    // Method to handle user login
    public function loginUser($username, $password) {
        // Fetch hashed password from database
        $sql = "SELECT password FROM users WHERE username = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $hashed_password = $row["password"];

            // Verify password
            if (password_verify($password, $hashed_password)) {
                return true; // Login successful
            } else {
                return false; // Invalid password
            }
        } else {
            return false; // User not found
        }
    }

    // Destructor to close database connection
    public function __destruct() {
        $this->conn->close();
    }
}

// Usage example
$servername = "localhost";
$username = "users";
$password = "password123";
$dbname = "auto";

$userAuth = new UserAuth($servername, $username, $password, $dbname);

// Check if form is submitted for registration
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($userAuth->registerUser($username, $password)) {
        // Registration successful, do something
        $registration_success = true;
    } else {
        echo "Error: Registration failed";
    }
}

// Check if form is submitted for login
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($userAuth->loginUser($username, $password)) {
        echo "Login successful";
    } else {
        echo "Invalid username or password";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <?php if (!isset($registration_success) || !$registration_success): ?>
    <!-- Display registration form if not registered or registration failed -->
    <h2>Sign Up</h2>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div>
            <input type="submit" value="Register" name="register">
        </div>
    </form>
    <?php else: ?>
    <!-- Display login form if registration was successful -->
    <h2>Login</h2>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div>
            <input type="submit" value="Login" name="login">
        </div>
    </form>
    <?php endif; ?>
</body>
</html>