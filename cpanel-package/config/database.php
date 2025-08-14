<?php
// Database configuration for cPanel hosting
class Database {
    private static $instance = null;
    private $connection;
    
    // Database credentials - Update these with your cPanel MySQL details
    private $host = 'localhost';
    private $database = 'your_database_name'; // Change this to your cPanel database name
    private $username = 'your_username';      // Change this to your cPanel database username
    private $password = 'your_password';      // Change this to your cPanel database password
    
    private function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host={$this->host};dbname={$this->database};charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ]
            );
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database query error: " . $e->getMessage());
            throw $e;
        }
    }
    
    public function fetch($sql, $params = []) {
        return $this->query($sql, $params)->fetch();
    }
    
    public function fetchAll($sql, $params = []) {
        return $this->query($sql, $params)->fetchAll();
    }
    
    public function insert($table, $data) {
        $fields = implode(',', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        
        $sql = "INSERT INTO {$table} ({$fields}) VALUES ({$placeholders})";
        $this->query($sql, $data);
        
        return $this->connection->lastInsertId();
    }
    
    public function update($table, $data, $where, $whereParams = []) {
        $setClause = '';
        foreach ($data as $key => $value) {
            $setClause .= "{$key} = :{$key}, ";
        }
        $setClause = rtrim($setClause, ', ');
        
        $sql = "UPDATE {$table} SET {$setClause} WHERE {$where}";
        $params = array_merge($data, $whereParams);
        
        return $this->query($sql, $params);
    }
    
    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        return $this->query($sql, $params);
    }
}

// Auto-create database tables if they don't exist
function initializeDatabase() {
    try {
        $db = Database::getInstance();
        $schemaFile = __DIR__ . '/../database/schema.sql';
        
        if (file_exists($schemaFile)) {
            $schema = file_get_contents($schemaFile);
            $statements = explode(';', $schema);
            
            foreach ($statements as $statement) {
                $statement = trim($statement);
                if (!empty($statement)) {
                    $db->query($statement);
                }
            }
            
            return true;
        }
        return false;
    } catch (Exception $e) {
        error_log("Database initialization error: " . $e->getMessage());
        return false;
    }
}

// Initialize database on first run
if (!file_exists(__DIR__ . '/../.installed')) {
    if (initializeDatabase()) {
        file_put_contents(__DIR__ . '/../.installed', date('Y-m-d H:i:s'));
    }
}
?>
