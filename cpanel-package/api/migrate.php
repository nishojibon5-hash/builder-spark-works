<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Simple token-based authentication for migrations
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

// Extract token
if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit();
}

$token = $matches[1];
$expectedToken = hash('sha256', 'migration_secret_' . date('Y-m-d')); // Change this to your secret

if (!hash_equals($token, $expectedToken)) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid migration token']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$force = $input['force'] ?? false;

try {
    require_once '../config/database.php';
    $db = Database::getInstance();
    
    $migrations = [];
    $errors = [];
    
    // Check if this is a forced migration or if schema changes are needed
    if ($force || !file_exists('../.schema_version')) {
        
        // Run schema updates
        $schemaFile = '../database/schema.sql';
        if (file_exists($schemaFile)) {
            $schema = file_get_contents($schemaFile);
            $statements = explode(';', $schema);
            
            foreach ($statements as $statement) {
                $statement = trim($statement);
                if (!empty($statement) && !preg_match('/^(INSERT|UPDATE|DELETE)/i', $statement)) {
                    try {
                        $db->query($statement);
                        $migrations[] = "Executed: " . substr($statement, 0, 50) . "...";
                    } catch (Exception $e) {
                        $errors[] = "Failed: " . substr($statement, 0, 50) . "... Error: " . $e->getMessage();
                    }
                }
            }
        }
        
        // Update schema version
        file_put_contents('../.schema_version', date('Y-m-d H:i:s'));
        
        // Run any additional migrations
        $migrationDir = '../database/migrations/';
        if (is_dir($migrationDir)) {
            $migrationFiles = glob($migrationDir . '*.sql');
            sort($migrationFiles);
            
            foreach ($migrationFiles as $migrationFile) {
                $migrationName = basename($migrationFile);
                
                // Check if this migration was already run
                $executed = $db->fetch(
                    "SELECT * FROM migrations WHERE name = ? LIMIT 1",
                    [$migrationName]
                );
                
                if (!$executed) {
                    try {
                        $migrationSQL = file_get_contents($migrationFile);
                        $statements = explode(';', $migrationSQL);
                        
                        foreach ($statements as $statement) {
                            $statement = trim($statement);
                            if (!empty($statement)) {
                                $db->query($statement);
                            }
                        }
                        
                        // Record migration as executed
                        $db->insert('migrations', [
                            'name' => $migrationName,
                            'executed_at' => date('Y-m-d H:i:s')
                        ]);
                        
                        $migrations[] = "Migration executed: " . $migrationName;
                        
                    } catch (Exception $e) {
                        $errors[] = "Migration failed: " . $migrationName . " - " . $e->getMessage();
                    }
                }
            }
        }
    }
    
    // Clear any cached data
    if (function_exists('opcache_reset')) {
        opcache_reset();
    }
    
    $response = [
        'status' => 'success',
        'migrations_run' => count($migrations),
        'migrations' => $migrations,
        'errors' => $errors,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if (count($errors) > 0) {
        $response['status'] = 'partial_success';
        http_response_code(207); // Multi-status
    } else {
        http_response_code(200);
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Migration failed',
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
