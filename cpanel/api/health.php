<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Health check endpoint for deployment verification
try {
    // Check database connection
    require_once '../config/database.php';
    $db = Database::getInstance();
    
    // Test database connection
    $db->query("SELECT 1");
    
    // Check if tables exist
    $tables = $db->fetchAll("SHOW TABLES");
    $tableCount = count($tables);
    
    // Check disk space (if possible)
    $diskSpace = disk_free_space('.');
    
    // Get system info
    $response = [
        'status' => 'healthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'database' => [
            'connected' => true,
            'tables' => $tableCount
        ],
        'server' => [
            'php_version' => PHP_VERSION,
            'disk_free' => $diskSpace ? round($diskSpace / 1024 / 1024, 2) . ' MB' : 'unknown'
        ],
        'deployment' => [
            'last_check' => file_exists('../.installed') ? filemtime('../.installed') : null,
            'version' => '1.0.0'
        ]
    ];
    
    // Check for deployment info
    if (file_exists('../backup-info.json')) {
        $deploymentInfo = json_decode(file_get_contents('../backup-info.json'), true);
        $response['deployment']['info'] = $deploymentInfo;
    }
    
    http_response_code(200);
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'unhealthy',
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
