<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Builder-Signature');

// Builder.io webhook receiver for automatic deployment
class BuilderWebhookHandler {
    private $logFile = '../logs/webhook.log';
    private $secretKey = 'your_builder_webhook_secret'; // Change this to match Builder.io webhook secret
    
    public function __construct() {
        // Ensure log directory exists
        $logDir = dirname($this->logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
    }
    
    public function handleWebhook() {
        try {
            // Get webhook payload
            $payload = file_get_contents('php://input');
            $headers = getallheaders();
            
            $this->log("Webhook received from Builder.io");
            $this->log("Headers: " . json_encode($headers));
            
            // Verify webhook signature (if configured)
            if (isset($headers['X-Builder-Signature'])) {
                if (!$this->verifySignature($payload, $headers['X-Builder-Signature'])) {
                    $this->log("Invalid webhook signature");
                    http_response_code(401);
                    echo json_encode(['error' => 'Invalid signature']);
                    return;
                }
            }
            
            $data = json_decode($payload, true);
            
            if (!$data) {
                $this->log("Invalid JSON payload");
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON']);
                return;
            }
            
            $this->log("Webhook data: " . json_encode($data));
            
            // Check if this is a content update from Builder.io
            $eventType = $data['type'] ?? $data['event'] ?? 'unknown';
            
            $this->log("Event type: " . $eventType);
            
            // Trigger deployment for relevant events
            $deploymentEvents = [
                'content.update',
                'content.publish', 
                'page.publish',
                'model.update',
                'content.save',
                'publish'
            ];
            
            if (in_array($eventType, $deploymentEvents) || $eventType === 'unknown') {
                $this->log("Triggering deployment for event: " . $eventType);
                $result = $this->triggerDeployment($data);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Deployment triggered',
                    'event' => $eventType,
                    'deployment_result' => $result,
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            } else {
                $this->log("Ignoring event type: " . $eventType);
                echo json_encode([
                    'success' => true,
                    'message' => 'Event ignored',
                    'event' => $eventType
                ]);
            }
            
        } catch (Exception $e) {
            $this->log("Webhook error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'error' => 'Webhook processing failed',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    private function verifySignature($payload, $signature) {
        $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $this->secretKey);
        return hash_equals($expectedSignature, $signature);
    }
    
    private function triggerDeployment($webhookData) {
        $this->log("Starting deployment process...");
        
        try {
            // Step 1: Pull latest code from GitHub
            $pullResult = $this->pullFromGitHub();
            $this->log("GitHub pull result: " . json_encode($pullResult));
            
            // Step 2: Build the application
            $buildResult = $this->buildApplication();
            $this->log("Build result: " . json_encode($buildResult));
            
            // Step 3: Deploy to current directory
            $deployResult = $this->deployFiles();
            $this->log("Deploy result: " . json_encode($deployResult));
            
            // Step 4: Update deployment record
            $this->recordDeployment($webhookData);
            
            // Step 5: Send notification
            $this->sendDeploymentNotification('success', $webhookData);
            
            return [
                'status' => 'success',
                'steps' => [
                    'pull' => $pullResult,
                    'build' => $buildResult,
                    'deploy' => $deployResult
                ]
            ];
            
        } catch (Exception $e) {
            $this->log("Deployment failed: " . $e->getMessage());
            $this->sendDeploymentNotification('failed', $webhookData, $e->getMessage());
            
            return [
                'status' => 'failed',
                'error' => $e->getMessage()
            ];
        }
    }
    
    private function pullFromGitHub() {
        $githubConfig = [
            'repo' => 'nishojibon5-hash/builder-spark-works',
            'branch' => 'main',
            'token' => 'your_github_token' // Set this in environment or config
        ];
        
        // Create temporary directory for cloning
        $tempDir = '../temp/github-' . uniqid();
        mkdir($tempDir, 0755, true);
        
        // Clone or pull repository
        $repoUrl = "https://github.com/{$githubConfig['repo']}.git";
        
        if (!empty($githubConfig['token'])) {
            $repoUrl = "https://{$githubConfig['token']}@github.com/{$githubConfig['repo']}.git";
        }
        
        $commands = [
            "cd {$tempDir}",
            "git clone {$repoUrl} .",
            "git checkout {$githubConfig['branch']}"
        ];
        
        $output = [];
        $returnCode = 0;
        
        foreach ($commands as $command) {
            exec($command . " 2>&1", $output, $returnCode);
            if ($returnCode !== 0) {
                throw new Exception("Git command failed: {$command}. Output: " . implode("\n", $output));
            }
        }
        
        return [
            'success' => true,
            'temp_dir' => $tempDir,
            'output' => $output
        ];
    }
    
    private function buildApplication() {
        // For now, we'll copy pre-built files from the cpanel-package
        // In a full setup, you'd run npm build here
        
        $this->log("Building application (copying pre-built files)...");
        
        // Copy cpanel-package contents to temporary build directory
        $buildDir = '../temp/build-' . uniqid();
        mkdir($buildDir, 0755, true);
        
        // Copy static files and PHP backend
        $sourceDir = '../cpanel';
        
        if (is_dir($sourceDir)) {
            $this->copyDirectory($sourceDir, $buildDir);
        }
        
        // Copy any built React files if they exist
        $reactBuildDir = '../dist/cpanel';
        if (is_dir($reactBuildDir)) {
            $this->copyDirectory($reactBuildDir, $buildDir);
        }
        
        return [
            'success' => true,
            'build_dir' => $buildDir
        ];
    }
    
    private function deployFiles() {
        $this->log("Deploying files...");
        
        // In a real scenario, this would:
        // 1. Backup current files
        // 2. Copy new files to production
        // 3. Update database if needed
        // 4. Clear cache
        
        // For now, just update a deployment timestamp
        file_put_contents('../.last_webhook_deploy', date('Y-m-d H:i:s'));
        
        // Clear PHP opcache if available
        if (function_exists('opcache_reset')) {
            opcache_reset();
        }
        
        return [
            'success' => true,
            'deployed_at' => date('Y-m-d H:i:s')
        ];
    }
    
    private function copyDirectory($source, $destination) {
        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }
        
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($iterator as $item) {
            $destPath = $destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName();
            
            if ($item->isDir()) {
                mkdir($destPath, 0755, true);
            } else {
                copy($item, $destPath);
            }
        }
    }
    
    private function recordDeployment($webhookData) {
        try {
            require_once '../config/database.php';
            $db = Database::getInstance();
            
            // Create webhook_deployments table if it doesn't exist
            $db->query("
                CREATE TABLE IF NOT EXISTS webhook_deployments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    webhook_id VARCHAR(100),
                    event_type VARCHAR(50),
                    source VARCHAR(50) DEFAULT 'builder.io',
                    status ENUM('success', 'failed') DEFAULT 'success',
                    webhook_data JSON,
                    deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_deployed_at (deployed_at),
                    INDEX idx_status (status)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            
            $db->insert('webhook_deployments', [
                'webhook_id' => $webhookData['id'] ?? uniqid(),
                'event_type' => $webhookData['type'] ?? $webhookData['event'] ?? 'unknown',
                'webhook_data' => json_encode($webhookData),
                'status' => 'success'
            ]);
            
        } catch (Exception $e) {
            $this->log("Failed to record deployment: " . $e->getMessage());
        }
    }
    
    private function sendDeploymentNotification($status, $webhookData, $error = null) {
        $notification = [
            'status' => $status,
            'source' => 'Builder.io Webhook',
            'event' => $webhookData['type'] ?? $webhookData['event'] ?? 'unknown',
            'timestamp' => date('Y-m-d H:i:s'),
            'error' => $error
        ];
        
        // Store notification
        file_put_contents('../logs/deploy-notifications.log', json_encode($notification) . "\n", FILE_APPEND);
        
        // You can add Discord/Email notifications here
        $this->log("Deployment notification: " . json_encode($notification));
    }
    
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($this->logFile, "[{$timestamp}] {$message}\n", FILE_APPEND | LOCK_EX);
    }
}

// Handle the webhook request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $handler = new BuilderWebhookHandler();
    $handler->handleWebhook();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
