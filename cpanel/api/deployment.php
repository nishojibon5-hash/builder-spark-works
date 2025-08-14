<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../config/database.php';

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Handle deployment notifications and backup records
switch (true) {
    case preg_match('/\/deployment\/notify$/', $path) && $method === 'POST':
        handleDeploymentNotify();
        break;
        
    case preg_match('/\/deployment\/backup$/', $path) && $method === 'POST':
        handleDeploymentBackup();
        break;
        
    case preg_match('/\/deployment\/status$/', $path) && $method === 'GET':
        handleDeploymentStatus();
        break;
        
    case preg_match('/\/deployment\/history$/', $path) && $method === 'GET':
        handleDeploymentHistory();
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

function handleDeploymentNotify() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        // Create deployment log entry
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'status' => $input['status'] ?? 'unknown',
            'deployment_id' => $input['deployment_id'] ?? null,
            'commit' => $input['commit'] ?? null,
            'message' => $input['message'] ?? 'Deployment notification',
            'url' => $input['url'] ?? null
        ];
        
        // Store in deployment log file
        $logFile = '../logs/deployment.log';
        $logDir = dirname($logFile);
        
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
        
        // Update latest deployment status
        file_put_contents('../.deployment_status', json_encode($logEntry));
        
        echo json_encode([
            'success' => true,
            'message' => 'Deployment notification recorded',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to record deployment notification',
            'message' => $e->getMessage()
        ]);
    }
}

function handleDeploymentBackup() {
    // Simple authentication check
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    try {
        $db = Database::getInstance();
        
        // Create deployments table if it doesn't exist
        $db->query("
            CREATE TABLE IF NOT EXISTS deployments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                deployment_id VARCHAR(100) NOT NULL,
                commit_hash VARCHAR(100) NOT NULL,
                commit_message TEXT,
                deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('deployed', 'rolled_back') DEFAULT 'deployed',
                rollback_id VARCHAR(100) NULL,
                INDEX idx_deployment_id (deployment_id),
                INDEX idx_deployed_at (deployed_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        // Insert deployment record
        $deploymentId = $db->insert('deployments', [
            'deployment_id' => $input['deployment_id'],
            'commit_hash' => $input['commit_hash'],
            'commit_message' => $input['commit_message'],
            'status' => $input['status'] ?? 'deployed'
        ]);
        
        echo json_encode([
            'success' => true,
            'backup_id' => $deploymentId,
            'message' => 'Deployment backup recorded'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to create deployment backup',
            'message' => $e->getMessage()
        ]);
    }
}

function handleDeploymentStatus() {
    try {
        $status = [];
        
        // Get latest deployment status
        if (file_exists('../.deployment_status')) {
            $status['latest'] = json_decode(file_get_contents('../.deployment_status'), true);
        }
        
        // Get installation info
        if (file_exists('../.installed')) {
            $status['installed_at'] = filemtime('../.installed');
        }
        
        // Get current backup info
        if (file_exists('../backup-info.json')) {
            $status['current_deployment'] = json_decode(file_get_contents('../backup-info.json'), true);
        }
        
        // Get schema version
        if (file_exists('../.schema_version')) {
            $status['schema_version'] = file_get_contents('../.schema_version');
        }
        
        echo json_encode([
            'status' => $status,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to get deployment status',
            'message' => $e->getMessage()
        ]);
    }
}

function handleDeploymentHistory() {
    try {
        $db = Database::getInstance();
        
        $deployments = $db->fetchAll("
            SELECT * FROM deployments 
            ORDER BY deployed_at DESC 
            LIMIT 20
        ");
        
        echo json_encode([
            'deployments' => $deployments,
            'total' => count($deployments)
        ]);
        
    } catch (Exception $e) {
        // If table doesn't exist yet, return empty
        echo json_encode([
            'deployments' => [],
            'total' => 0,
            'note' => 'No deployment history available yet'
        ]);
    }
}
?>
