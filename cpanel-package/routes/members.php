<?php
function handleGetMembers() {
    $user = Auth::requireAuth();
    
    try {
        $db = Database::getInstance();
        
        $members = $db->fetchAll("
            SELECT m.*, 
                   COALESCE(SUM(CASE WHEN l.status = 'active' THEN l.amount - (l.paid_installments * l.installment_amount) END), 0) as outstanding_loan,
                   COALESCE(SUM(CASE WHEN s.transaction_type = 'deposit' THEN s.amount WHEN s.transaction_type = 'withdrawal' THEN -s.amount END), 0) as savings_balance
            FROM members m
            LEFT JOIN loans l ON m.id = l.member_id
            LEFT JOIN savings s ON m.id = s.member_id
            WHERE m.is_active = 1
            GROUP BY m.id
            ORDER BY m.created_at DESC
        ");
        
        sendResponse(['members' => $members]);
        
    } catch (Exception $e) {
        error_log("Get members error: " . $e->getMessage());
        sendError('Failed to fetch members', 500);
    }
}

function handleCreateMember() {
    $user = Auth::requireAdmin();
    $input = getJsonInput();
    
    $required = ['name', 'phone', 'join_date'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            sendError("Field {$field} is required", 400);
        }
    }
    
    try {
        $db = Database::getInstance();
        
        // Generate unique member ID
        $memberIdBase = 'M' . date('Y') . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
        $memberIdCounter = 1;
        $memberId = $memberIdBase;
        
        while ($db->fetch("SELECT id FROM members WHERE member_id = ?", [$memberId])) {
            $memberId = $memberIdBase . '-' . $memberIdCounter;
            $memberIdCounter++;
        }
        
        $memberData = [
            'user_id' => $user['user_id'],
            'member_id' => $memberId,
            'name' => $input['name'],
            'phone' => $input['phone'],
            'email' => $input['email'] ?? null,
            'address' => $input['address'] ?? null,
            'nid_number' => $input['nid_number'] ?? null,
            'join_date' => $input['join_date']
        ];
        
        $newMemberId = $db->insert('members', $memberData);
        
        $member = $db->fetch("SELECT * FROM members WHERE id = ?", [$newMemberId]);
        
        sendResponse(['success' => true, 'member' => $member], 201);
        
    } catch (Exception $e) {
        error_log("Create member error: " . $e->getMessage());
        sendError('Failed to create member', 500);
    }
}

function handleGetMember($memberId) {
    $user = Auth::requireAuth();
    
    try {
        $db = Database::getInstance();
        
        $member = $db->fetch("
            SELECT m.*, 
                   COALESCE(SUM(CASE WHEN l.status = 'active' THEN l.amount - (l.paid_installments * l.installment_amount) END), 0) as outstanding_loan,
                   COALESCE(SUM(CASE WHEN s.transaction_type = 'deposit' THEN s.amount WHEN s.transaction_type = 'withdrawal' THEN -s.amount END), 0) as savings_balance
            FROM members m
            LEFT JOIN loans l ON m.id = l.member_id
            LEFT JOIN savings s ON m.id = s.member_id
            WHERE m.id = ? AND m.is_active = 1
            GROUP BY m.id
        ", [$memberId]);
        
        if (!$member) {
            sendError('Member not found', 404);
        }
        
        // Get member's loans
        $loans = $db->fetchAll("
            SELECT * FROM loans 
            WHERE member_id = ? 
            ORDER BY created_at DESC
        ", [$memberId]);
        
        // Get member's savings transactions
        $savings = $db->fetchAll("
            SELECT * FROM savings 
            WHERE member_id = ? 
            ORDER BY transaction_date DESC 
            LIMIT 10
        ", [$memberId]);
        
        sendResponse([
            'member' => $member,
            'loans' => $loans,
            'savings' => $savings
        ]);
        
    } catch (Exception $e) {
        error_log("Get member error: " . $e->getMessage());
        sendError('Failed to fetch member', 500);
    }
}

function handleUpdateMember($memberId) {
    $user = Auth::requireAdmin();
    $input = getJsonInput();
    
    try {
        $db = Database::getInstance();
        
        $member = $db->fetch("SELECT id FROM members WHERE id = ? AND is_active = 1", [$memberId]);
        if (!$member) {
            sendError('Member not found', 404);
        }
        
        $updateData = [];
        $allowedFields = ['name', 'phone', 'email', 'address', 'nid_number'];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updateData[$field] = $input[$field];
            }
        }
        
        if (empty($updateData)) {
            sendError('No valid fields to update', 400);
        }
        
        $updateData['updated_at'] = date('Y-m-d H:i:s');
        
        $db->update('members', $updateData, 'id = ?', ['id' => $memberId]);
        
        $updatedMember = $db->fetch("SELECT * FROM members WHERE id = ?", [$memberId]);
        
        sendResponse(['success' => true, 'member' => $updatedMember]);
        
    } catch (Exception $e) {
        error_log("Update member error: " . $e->getMessage());
        sendError('Failed to update member', 500);
    }
}
?>
