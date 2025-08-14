<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LoanBondhu Installation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        input, select {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 16px;
        }
        input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        .btn {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
        }
        .btn:hover {
            background: #45a049;
        }
        .success {
            background: #4CAF50;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .error {
            background: #f44336;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info {
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏦 LoanBondhu Installation</h1>
        
        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $host = $_POST['host'] ?? 'localhost';
            $database = $_POST['database'] ?? '';
            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';
            $admin_phone = $_POST['admin_phone'] ?? '01650074073';
            $admin_password = $_POST['admin_password'] ?? 'admin123';
            
            if (empty($database) || empty($username)) {
                echo '<div class="error">Database name and username are required!</div>';
            } else {
                try {
                    // Update database configuration
                    $configFile = __DIR__ . '/config/database.php';
                    $configContent = file_get_contents($configFile);
                    
                    $configContent = str_replace('your_database_name', $database, $configContent);
                    $configContent = str_replace('your_username', $username, $configContent);
                    $configContent = str_replace('your_password', $password, $configContent);
                    
                    file_put_contents($configFile, $configContent);
                    
                    // Test database connection
                    $pdo = new PDO("mysql:host={$host};dbname={$database};charset=utf8mb4", $username, $password);
                    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    
                    // Run database schema
                    $schema = file_get_contents(__DIR__ . '/database/schema.sql');
                    
                    // Update admin user in schema
                    $hashedPassword = password_hash($admin_password, PASSWORD_DEFAULT);
                    $schema = str_replace("'01650074073'", "'{$admin_phone}'", $schema);
                    $schema = str_replace('$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', $hashedPassword, $schema);
                    
                    $statements = explode(';', $schema);
                    foreach ($statements as $statement) {
                        $statement = trim($statement);
                        if (!empty($statement)) {
                            $pdo->exec($statement);
                        }
                    }
                    
                    // Mark as installed
                    file_put_contents(__DIR__ . '/.installed', date('Y-m-d H:i:s'));
                    
                    echo '<div class="success">
                        <h3>✅ Installation Successful!</h3>
                        <p>Database has been configured and tables created.</p>
                        <p><strong>Admin Login:</strong></p>
                        <p>Phone: ' . htmlspecialchars($admin_phone) . '</p>
                        <p>Password: ' . htmlspecialchars($admin_password) . '</p>
                        <p><a href="/" style="color: white;">Go to Application</a></p>
                    </div>';
                    
                    echo '<script>setTimeout(() => window.location.href = "/", 3000);</script>';
                    
                } catch (Exception $e) {
                    echo '<div class="error">Installation failed: ' . htmlspecialchars($e->getMessage()) . '</div>';
                }
            }
        } else {
            // Show installation form
            ?>
            <div class="info">
                <h3>📋 Database Configuration Required</h3>
                <p>Please enter your cPanel MySQL database details below:</p>
                <ul>
                    <li>Create a MySQL database in cPanel</li>
                    <li>Create a database user and assign it to the database</li>
                    <li>Enter the details below</li>
                </ul>
            </div>
            
            <form method="POST">
                <div class="form-group">
                    <label for="host">Database Host:</label>
                    <input type="text" id="host" name="host" value="localhost" required>
                </div>
                
                <div class="form-group">
                    <label for="database">Database Name:</label>
                    <input type="text" id="database" name="database" placeholder="your_cpanel_database_name" required>
                </div>
                
                <div class="form-group">
                    <label for="username">Database Username:</label>
                    <input type="text" id="username" name="username" placeholder="your_cpanel_db_username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Database Password:</label>
                    <input type="password" id="password" name="password" placeholder="your_cpanel_db_password">
                </div>
                
                <hr style="margin: 30px 0; border: 1px solid rgba(255,255,255,0.2);">
                
                <h3>👤 Admin Account Setup</h3>
                
                <div class="form-group">
                    <label for="admin_phone">Admin Phone:</label>
                    <input type="text" id="admin_phone" name="admin_phone" value="01650074073" required>
                </div>
                
                <div class="form-group">
                    <label for="admin_password">Admin Password:</label>
                    <input type="password" id="admin_password" name="admin_password" value="admin123" required>
                </div>
                
                <button type="submit" class="btn">🚀 Install LoanBondhu</button>
            </form>
            <?php
        }
        ?>
    </div>
</body>
</html>
