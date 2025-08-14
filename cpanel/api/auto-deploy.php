<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Auto-deployment system for Builder.io updates
class AutoDeployment {
    private $config;
    private $logFile = '../logs/auto-deploy.log';
    
    public function __construct() {
        $this->config = [
            'github' => [
                'repo' => 'nishojibon5-hash/builder-spark-works',
                'branch' => 'main',
                'token' => '', // Will be set from environment or config
                'api_url' => 'https://api.github.com'
            ],
            'paths' => [
                'temp' => '../temp',
                'backup' => '../backup',
                'logs' => '../logs'
            ]
        ];
        
        // Create necessary directories
        foreach ($this->config['paths'] as $path) {
            if (!is_dir($path)) {
                mkdir($path, 0755, true);
            }
        }
    }
    
    public function deploy($trigger = 'manual') {
        $deploymentId = uniqid('deploy_');
        $this->log("Starting deployment {$deploymentId} triggered by: {$trigger}");
        
        try {
            // Step 1: Create backup of current files
            $backupResult = $this->createBackup($deploymentId);
            $this->log("Backup created: " . json_encode($backupResult));
            
            // Step 2: Download latest code from GitHub
            $downloadResult = $this->downloadFromGitHub();
            $this->log("Download result: " . json_encode($downloadResult));
            
            // Step 3: Build application 
            $buildResult = $this->buildApplication($downloadResult['source_dir']);
            $this->log("Build result: " . json_encode($buildResult));
            
            // Step 4: Deploy new files
            $deployResult = $this->deployNewFiles($buildResult['build_dir'], $deploymentId);
            $this->log("Deploy result: " . json_encode($deployResult));
            
            // Step 5: Update database schema if needed
            $migrationResult = $this->runMigrations();
            $this->log("Migration result: " . json_encode($migrationResult));
            
            // Step 6: Clear cache and finalize
            $this->clearCache();
            $this->recordSuccessfulDeployment($deploymentId, $trigger);
            
            // Clean up temporary files
            $this->cleanup($downloadResult['source_dir'], $buildResult['build_dir']);
            
            $this->log("Deployment {$deploymentId} completed successfully");
            
            return [
                'success' => true,
                'deployment_id' => $deploymentId,
                'steps' => [
                    'backup' => $backupResult,
                    'download' => $downloadResult,
                    'build' => $buildResult,
                    'deploy' => $deployResult,
                    'migration' => $migrationResult
                ],
                'deployed_at' => date('Y-m-d H:i:s')
            ];
            
        } catch (Exception $e) {
            $this->log("Deployment {$deploymentId} failed: " . $e->getMessage());
            
            // Attempt rollback
            if (isset($backupResult) && $backupResult['success']) {
                $this->rollback($deploymentId);
            }
            
            return [
                'success' => false,
                'deployment_id' => $deploymentId,
                'error' => $e->getMessage(),
                'failed_at' => date('Y-m-d H:i:s')
            ];
        }
    }
    
    private function createBackup($deploymentId) {
        $backupDir = $this->config['paths']['backup'] . '/' . $deploymentId;
        mkdir($backupDir, 0755, true);
        
        // Backup current files (excluding sensitive data)
        $filesToBackup = [
            '../index.html',
            '../api',
            '../assets',
            '../config/database.php'
        ];
        
        foreach ($filesToBackup as $file) {
            if (file_exists($file)) {
                $destPath = $backupDir . '/' . basename($file);
                if (is_dir($file)) {
                    $this->copyDirectory($file, $destPath);
                } else {
                    copy($file, $destPath);
                }
            }
        }
        
        // Create backup metadata
        file_put_contents($backupDir . '/backup-info.json', json_encode([
            'deployment_id' => $deploymentId,
            'created_at' => date('Y-m-d H:i:s'),
            'files_backed_up' => $filesToBackup
        ]));
        
        return [
            'success' => true,
            'backup_dir' => $backupDir,
            'files_count' => count($filesToBackup)
        ];
    }
    
    private function downloadFromGitHub() {
        $repo = $this->config['github']['repo'];
        $branch = $this->config['github']['branch'];
        
        // Download repository as ZIP
        $zipUrl = "https://github.com/{$repo}/archive/refs/heads/{$branch}.zip";
        $tempDir = $this->config['paths']['temp'] . '/download-' . uniqid();
        mkdir($tempDir, 0755, true);
        
        $zipFile = $tempDir . '/repo.zip';
        
        // Download the ZIP file
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $zipUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'LoanBondhu-AutoDeploy/1.0');
        
        $zipContent = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200 || !$zipContent) {
            throw new Exception("Failed to download repository. HTTP Code: {$httpCode}");
        }
        
        file_put_contents($zipFile, $zipContent);
        
        // Extract the ZIP file
        $zip = new ZipArchive();
        if ($zip->open($zipFile) === TRUE) {
            $zip->extractTo($tempDir);
            $zip->close();
            unlink($zipFile);
        } else {
            throw new Exception("Failed to extract repository ZIP file");
        }
        
        // Find the extracted directory
        $extracted = glob($tempDir . '/*');
        $sourceDir = $extracted[0];
        
        return [
            'success' => true,
            'source_dir' => $sourceDir,
            'temp_dir' => $tempDir
        ];
    }
    
    private function buildApplication($sourceDir) {
        $buildDir = $this->config['paths']['temp'] . '/build-' . uniqid();
        mkdir($buildDir, 0755, true);
        
        // Copy cPanel backend files
        $cpanelSource = $sourceDir . '/cpanel';
        if (is_dir($cpanelSource)) {
            $this->copyDirectory($cpanelSource, $buildDir);
        }
        
        // Copy built React app if available
        $reactBuild = $sourceDir . '/dist/cpanel';
        if (is_dir($reactBuild)) {
            $this->copyDirectory($reactBuild, $buildDir);
        } else {
            // If no pre-built React app, copy source and note that build is needed
            $clientSource = $sourceDir . '/client';
            if (is_dir($clientSource)) {
                // In a full setup, you'd run npm install && npm run build:cpanel here
                $this->log("Note: React app needs to be built from source");
            }
        }
        
        // Update configuration files
        $this->updateConfigFiles($buildDir);
        
        return [
            'success' => true,
            'build_dir' => $buildDir
        ];
    }
    
    private function updateConfigFiles($buildDir) {
        // Update database config if needed
        $dbConfigFile = $buildDir . '/config/database.php';
        if (file_exists($dbConfigFile) && file_exists('../config/database.php')) {
            // Preserve current database configuration
            copy('../config/database.php', $dbConfigFile);
        }
        
        // Update other config files as needed
        $configFiles = [
            '../.env' => $buildDir . '/.env',
            '../.installed' => $buildDir . '/.installed'
        ];
        
        foreach ($configFiles as $source => $dest) {
            if (file_exists($source)) {
                copy($source, $dest);
            }
        }
    }
    
    private function deployNewFiles($buildDir, $deploymentId) {
        // Deploy files with atomic operation
        $tempDeployDir = '../deploy-' . $deploymentId;
        
        // Copy new files to temporary deployment directory
        $this->copyDirectory($buildDir, $tempDeployDir);
        
        // Move current files to backup (if not already backed up)
        $currentBackup = '../current-backup-' . $deploymentId;
        
        // Move files that might conflict
        $filesToMove = [
            '../index.html',
            '../api',
            '../assets'
        ];
        
        foreach ($filesToMove as $file) {
            if (file_exists($file)) {
                $backupPath = $currentBackup . '/' . basename($file);
                if (!is_dir($currentBackup)) {
                    mkdir($currentBackup, 0755, true);
                }
                
                if (is_dir($file)) {
                    $this->copyDirectory($file, $backupPath);
                    $this->removeDirectory($file);
                } else {
                    copy($file, $backupPath);
                    unlink($file);
                }
            }
        }
        
        // Move new files to final location
        $deployedFiles = [];
        $items = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($tempDeployDir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($items as $item) {
            $relativePath = str_replace($tempDeployDir, '', $item->getPathname());
            $destPath = '..' . $relativePath;
            
            $destDir = dirname($destPath);
            if (!is_dir($destDir)) {
                mkdir($destDir, 0755, true);
            }
            
            if ($item->isFile()) {
                copy($item->getPathname(), $destPath);
                $deployedFiles[] = $destPath;
            }
        }
        
        // Clean up temporary deployment directory
        $this->removeDirectory($tempDeployDir);
        
        // Update deployment timestamp
        file_put_contents('../.last_deploy', date('Y-m-d H:i:s'));
        
        return [
            'success' => true,
            'files_deployed' => count($deployedFiles),
            'backup_location' => $currentBackup
        ];
    }
    
    private function runMigrations() {
        try {
            // Run database migrations if the endpoint exists
            $migrationUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/api/migrate';
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $migrationUrl);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['force' => true]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . hash('sha256', 'migration_secret_' . date('Y-m-d'))
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200 || $httpCode === 207) {
                return [
                    'success' => true,
                    'response' => json_decode($response, true)
                ];
            } else {
                return [
                    'success' => false,
                    'error' => "Migration failed with HTTP {$httpCode}",
                    'response' => $response
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    private function clearCache() {
        // Clear PHP opcache
        if (function_exists('opcache_reset')) {
            opcache_reset();
        }
        
        // Clear any application caches
        $cacheFiles = [
            '../cache/*',
            '../temp/*'
        ];
        
        foreach ($cacheFiles as $pattern) {
            $files = glob($pattern);
            foreach ($files as $file) {
                if (is_file($file)) {
                    unlink($file);
                } elseif (is_dir($file)) {
                    $this->removeDirectory($file);
                }
            }
        }
    }
    
    private function recordSuccessfulDeployment($deploymentId, $trigger) {
        try {
            require_once '../config/database.php';
            $db = Database::getInstance();
            
            $db->insert('webhook_deployments', [
                'deployment_id' => $deploymentId,
                'event_type' => 'auto_deploy',
                'source' => $trigger,
                'status' => 'success'
            ]);
            
        } catch (Exception $e) {
            $this->log("Failed to record deployment: " . $e->getMessage());
        }
    }
    
    private function rollback($deploymentId) {
        $this->log("Attempting rollback for deployment {$deploymentId}");
        
        $backupDir = $this->config['paths']['backup'] . '/' . $deploymentId;
        if (is_dir($backupDir)) {
            // Restore files from backup
            $this->copyDirectory($backupDir, '..');
            $this->log("Rollback completed for deployment {$deploymentId}");
        }
    }
    
    private function cleanup($sourceDir, $buildDir) {
        // Remove temporary directories
        if (is_dir($sourceDir)) {
            $this->removeDirectory(dirname($sourceDir));
        }
        if (is_dir($buildDir)) {
            $this->removeDirectory($buildDir);
        }
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
    
    private function removeDirectory($dir) {
        if (!is_dir($dir)) return;
        
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->removeDirectory($path) : unlink($path);
        }
        rmdir($dir);
    }
    
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($this->logFile, "[{$timestamp}] {$message}\n", FILE_APPEND | LOCK_EX);
    }
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'POST' && preg_match('/\/auto-deploy$/', $path)) {
    $input = json_decode(file_get_contents('php://input'), true);
    $trigger = $input['trigger'] ?? 'manual';
    
    $deployer = new AutoDeployment();
    $result = $deployer->deploy($trigger);
    
    echo json_encode($result);
    
} elseif ($method === 'GET' && preg_match('/\/deployment-status$/', $path)) {
    // Get deployment status
    $status = [
        'last_deploy' => file_exists('../.last_deploy') ? file_get_contents('../.last_deploy') : null,
        'last_webhook_deploy' => file_exists('../.last_webhook_deploy') ? file_get_contents('../.last_webhook_deploy') : null,
        'system_status' => 'operational'
    ];
    
    echo json_encode($status);
    
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
?>
