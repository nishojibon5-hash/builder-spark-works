<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../auth/auth.php';

// Get request path and method
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api', '', $path);
$method = $_SERVER['REQUEST_METHOD'];

// Route the requests
switch (true) {
    // Authentication routes
    case $path === '/auth/login' && $method === 'POST':
        require_once '../auth/login.php';
        break;
    
    case $path === '/auth/logout' && $method === 'POST':
        require_once '../auth/logout.php';
        break;
    
    case $path === '/auth/verify' && $method === 'GET':
        require_once '../auth/verify.php';
        break;
    
    // Members routes
    case $path === '/members' && $method === 'GET':
        require_once '../routes/members.php';
        handleGetMembers();
        break;
    
    case $path === '/members' && $method === 'POST':
        require_once '../routes/members.php';
        handleCreateMember();
        break;
    
    case preg_match('/^\/members\/(\d+)$/', $path, $matches) && $method === 'GET':
        require_once '../routes/members.php';
        handleGetMember($matches[1]);
        break;
    
    case preg_match('/^\/members\/(\d+)$/', $path, $matches) && $method === 'PUT':
        require_once '../routes/members.php';
        handleUpdateMember($matches[1]);
        break;
    
    // Loans routes
    case $path === '/loans' && $method === 'GET':
        require_once '../routes/loans.php';
        handleGetLoans();
        break;
    
    case $path === '/loans' && $method === 'POST':
        require_once '../routes/loans.php';
        handleCreateLoan();
        break;
    
    case preg_match('/^\/loans\/(\d+)$/', $path, $matches) && $method === 'GET':
        require_once '../routes/loans.php';
        handleGetLoan($matches[1]);
        break;
    
    // Repayments routes
    case $path === '/repayments' && $method === 'POST':
        require_once '../routes/repayments.php';
        handleCreateRepayment();
        break;
    
    case preg_match('/^\/loans\/(\d+)\/repayments$/', $path, $matches) && $method === 'GET':
        require_once '../routes/repayments.php';
        handleGetLoanRepayments($matches[1]);
        break;
    
    // Savings routes
    case $path === '/savings' && $method === 'GET':
        require_once '../routes/savings.php';
        handleGetSavings();
        break;
    
    case $path === '/savings' && $method === 'POST':
        require_once '../routes/savings.php';
        handleCreateSavings();
        break;
    
    // Income/Expense routes
    case $path === '/income-expense' && $method === 'GET':
        require_once '../routes/income_expense.php';
        handleGetIncomeExpense();
        break;
    
    case $path === '/income-expense' && $method === 'POST':
        require_once '../routes/income_expense.php';
        handleCreateIncomeExpense();
        break;
    
    // Worker Salary routes
    case $path === '/worker-salary' && $method === 'GET':
        require_once '../routes/worker_salary.php';
        handleGetWorkerSalaries();
        break;
    
    case $path === '/worker-salary' && $method === 'POST':
        require_once '../routes/worker_salary.php';
        handleCreateWorkerSalary();
        break;
    
    // Statistics/Dashboard routes
    case $path === '/dashboard/stats' && $method === 'GET':
        require_once '../routes/dashboard.php';
        handleGetDashboardStats();
        break;

    // Health check route
    case $path === '/health' && $method === 'GET':
        require_once '../api/health.php';
        break;

    // Migration route
    case $path === '/migrate' && $method === 'POST':
        require_once '../api/migrate.php';
        break;

    // Deployment routes
    case preg_match('/^\/deployment\//', $path):
        require_once '../api/deployment.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
        break;
}

function getJsonInput() {
    $input = json_decode(file_get_contents('php://input'), true);
    return $input ?: [];
}

function sendResponse($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data);
    exit();
}

function sendError($message, $status_code = 400) {
    http_response_code($status_code);
    echo json_encode(['error' => $message]);
    exit();
}
?>
