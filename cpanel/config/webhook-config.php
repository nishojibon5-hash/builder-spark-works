<?php
// Webhook and deployment configuration
class WebhookConfig {
    
    // Configuration settings
    public static function getConfig() {
        return [
            'webhook' => [
                'secret_key' => self::getWebhookSecret(),
                'allowed_ips' => [
                    // Builder.io webhook IPs (if known)
                    '0.0.0.0/0' // Allow all for now, can be restricted later
                ],
                'rate_limit' => [
                    'max_requests' => 10,
                    'time_window' => 60 // seconds
                ]
            ],
            'github' => [
                'repo' => 'nishojibon5-hash/builder-spark-works',
                'branch' => 'main',
                'token' => self::getGitHubToken(),
                'timeout' => 300 // seconds
            ],
            'deployment' => [
                'max_backups' => 5,
                'backup_retention_days' => 30,
                'deployment_timeout' => 600, // seconds
                'allowed_triggers' => [
                    'builder.io',
                    'manual',
                    'github_webhook'
                ]
            ],
            'security' => [
                'require_signature' => true,
                'log_all_requests' => true,
                'block_suspicious_activity' => true
            ]
        ];
    }
    
    // Get webhook secret from environment or generate one
    private static function getWebhookSecret() {
        // Try to get from environment first
        $secret = getenv('BUILDER_WEBHOOK_SECRET');
        
        if (empty($secret)) {
            // Check if stored in file
            $secretFile = __DIR__ . '/../.webhook_secret';
            if (file_exists($secretFile)) {
                $secret = trim(file_get_contents($secretFile));
            } else {
                // Generate new secret
                $secret = bin2hex(random_bytes(32));
                file_put_contents($secretFile, $secret);
                chmod($secretFile, 0600); // Secure permissions
            }
        }
        
        return $secret;
    }
    
    // Get GitHub token from environment
    private static function getGitHubToken() {
        return getenv('GITHUB_TOKEN') ?: '';
    }
    
    // Validate webhook request
    public static function validateWebhookRequest($payload, $signature = null, $sourceIP = null) {
        $config = self::getConfig();
        
        // Check rate limiting
        if (!self::checkRateLimit($sourceIP)) {
            throw new Exception('Rate limit exceeded');
        }
        
        // Verify signature if required
        if ($config['security']['require_signature'] && $signature) {
            if (!self::verifySignature($payload, $signature)) {
                throw new Exception('Invalid webhook signature');
            }
        }
        
        // Check IP whitelist (if configured)
        if (!empty($config['webhook']['allowed_ips']) && $sourceIP) {
            if (!self::isIPAllowed($sourceIP, $config['webhook']['allowed_ips'])) {
                throw new Exception('IP not allowed');
            }
        }
        
        return true;
    }
    
    // Verify webhook signature
    private static function verifySignature($payload, $signature) {
        $secret = self::getWebhookSecret();
        $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
        
        return hash_equals($expectedSignature, $signature);
    }
    
    // Simple rate limiting
    private static function checkRateLimit($ip) {
        if (!$ip) return true;
        
        $rateLimitFile = __DIR__ . '/../temp/rate_limit_' . md5($ip);
        $config = self::getConfig()['webhook']['rate_limit'];
        
        $now = time();
        $requests = [];
        
        // Load existing requests
        if (file_exists($rateLimitFile)) {
            $data = json_decode(file_get_contents($rateLimitFile), true);
            $requests = $data['requests'] ?? [];
        }
        
        // Remove old requests outside time window
        $requests = array_filter($requests, function($timestamp) use ($now, $config) {
            return ($now - $timestamp) < $config['time_window'];
        });
        
        // Check if limit exceeded
        if (count($requests) >= $config['max_requests']) {
            return false;
        }
        
        // Add current request
        $requests[] = $now;
        
        // Save updated requests
        file_put_contents($rateLimitFile, json_encode(['requests' => $requests]));
        
        return true;
    }
    
    // Check if IP is in allowed list
    private static function isIPAllowed($ip, $allowedIPs) {
        foreach ($allowedIPs as $allowedIP) {
            if ($allowedIP === '0.0.0.0/0') {
                return true; // Allow all
            }
            
            if (self::ipInRange($ip, $allowedIP)) {
                return true;
            }
        }
        
        return false;
    }
    
    // Check if IP is in CIDR range
    private static function ipInRange($ip, $range) {
        if (strpos($range, '/') === false) {
            return $ip === $range;
        }
        
        list($subnet, $bits) = explode('/', $range);
        $ip = ip2long($ip);
        $subnet = ip2long($subnet);
        $mask = -1 << (32 - $bits);
        $subnet &= $mask;
        
        return ($ip & $mask) == $subnet;
    }
    
    // Generate secure tokens
    public static function generateSecureToken($length = 32) {
        return bin2hex(random_bytes($length));
    }
    
    // Log security events
    public static function logSecurityEvent($event, $details = []) {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'event' => $event,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'details' => $details
        ];
        
        $logFile = __DIR__ . '/../logs/security.log';
        $logDir = dirname($logFile);
        
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
    }
    
    // Clean up old files
    public static function cleanup() {
        $config = self::getConfig();
        
        // Clean old backups
        $backupDir = __DIR__ . '/../backup';
        if (is_dir($backupDir)) {
            $backups = glob($backupDir . '/deploy_*');
            
            if (count($backups) > $config['deployment']['max_backups']) {
                // Sort by creation time and remove oldest
                usort($backups, function($a, $b) {
                    return filemtime($a) - filemtime($b);
                });
                
                $toRemove = array_slice($backups, 0, count($backups) - $config['deployment']['max_backups']);
                foreach ($toRemove as $backup) {
                    self::removeDirectory($backup);
                }
            }
        }
        
        // Clean old temp files
        $tempDir = __DIR__ . '/../temp';
        if (is_dir($tempDir)) {
            $tempFiles = glob($tempDir . '/*');
            $cutoff = time() - (24 * 60 * 60); // 24 hours
            
            foreach ($tempFiles as $file) {
                if (filemtime($file) < $cutoff) {
                    if (is_dir($file)) {
                        self::removeDirectory($file);
                    } else {
                        unlink($file);
                    }
                }
            }
        }
        
        // Clean old logs
        $logFiles = [
            __DIR__ . '/../logs/webhook.log',
            __DIR__ . '/../logs/auto-deploy.log',
            __DIR__ . '/../logs/security.log'
        ];
        
        foreach ($logFiles as $logFile) {
            if (file_exists($logFile) && filesize($logFile) > 10 * 1024 * 1024) { // 10MB
                // Rotate log file
                $rotatedFile = $logFile . '.' . date('Y-m-d');
                rename($logFile, $rotatedFile);
                
                // Compress if possible
                if (function_exists('gzopen')) {
                    $content = file_get_contents($rotatedFile);
                    $gz = gzopen($rotatedFile . '.gz', 'w9');
                    gzwrite($gz, $content);
                    gzclose($gz);
                    unlink($rotatedFile);
                }
            }
        }
    }
    
    private static function removeDirectory($dir) {
        if (!is_dir($dir)) return;
        
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? self::removeDirectory($path) : unlink($path);
        }
        rmdir($dir);
    }
}

// Auto-cleanup on load (run occasionally)
if (rand(1, 100) === 1) { // 1% chance
    WebhookConfig::cleanup();
}
?>
