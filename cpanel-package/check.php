<?php
// LoanBondhu - Basic system check
echo "✅ LoanBondhu is running!<br>";
echo "PHP Version: " . PHP_VERSION . "<br>";
echo "Time: " . date('Y-m-d H:i:s') . "<br>";

if (file_exists('config/database.php')) {
    echo "✅ Database config found<br>";
} else {
    echo "⚠️ Database config missing - <a href='/install.php'>Run Installation</a><br>";
}

if (file_exists('.installed')) {
    echo "✅ Installation completed<br>";
    echo "<a href='/'>Go to Application</a>";
} else {
    echo "⚠️ <a href='/install.php'>Complete Installation</a><br>";
}
?>