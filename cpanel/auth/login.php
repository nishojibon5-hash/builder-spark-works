<?php
$input = getJsonInput();

if (!isset($input['phone']) || !isset($input['password'])) {
    sendError('Phone and password are required', 400);
}

$phone = $input['phone'];
$password = $input['password'];

try {
    $db = Database::getInstance();
    
    $user = $db->fetch(
        "SELECT id, phone, name, email, password, role FROM users WHERE phone = ? AND is_active = 1",
        [$phone]
    );
    
    if (!$user || !Auth::verifyPassword($password, $user['password'])) {
        sendError('Invalid phone or password', 401);
    }
    
    $token = Auth::generateToken($user['id'], $user['phone'], $user['role']);
    
    // Store session in database
    $sessionId = bin2hex(random_bytes(16));
    $db->insert('sessions', [
        'session_id' => $sessionId,
        'user_id' => $user['id'],
        'expires_at' => date('Y-m-d H:i:s', time() + (24 * 60 * 60)),
        'data' => json_encode(['token' => $token])
    ]);
    
    sendResponse([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'phone' => $user['phone'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    sendError('Login failed', 500);
}
?>
