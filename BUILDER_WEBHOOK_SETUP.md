# 🚀 Builder.io Auto-Update Setup Guide

এই guide অনুসরণ করে আপনি Builder.io প্রজেক্ট আপডেট হলে cPanel সার্ভারে automatic update setup করতে পারবেন।

## 🔄 কিভাবে কাজ করে

```
Builder.io Project Update 
    ↓
Webhook Trigger 
    ↓  
cPanel Server receives webhook
    ↓
Automatically pulls latest code from GitHub
    ↓
Builds and deploys to live site
    ↓
Site updated! 🎉
```

## 🛠️ Setup Process

### 1️⃣ **cPanel এ Webhook Endpoint Setup**

আপনার cPanel site এ এই endpoints available হবে:

```
https://yourdomain.com/api/webhook          (Builder.io webhook receiver)
https://yourdomain.com/api/auto-deploy     (Manual deployment trigger)
https://yourdomain.com/api/deployment-status (Deployment status check)
```

### 2️⃣ **Builder.io এ Webhook Configuration**

1. **Builder.io Dashboard** এ যান
2. **Settings > Webhooks** section এ যান
3. **Add Webhook** ক্লিক করুন
4. নিচের details দিন:

```
Webhook URL: https://yourdomain.com/api/webhook
Events to trigger:
  ✅ Content Published
  ✅ Content Updated  
  ✅ Page Published
  ✅ Model Updated
Secret: your_builder_webhook_secret (optional)
```

### 3️⃣ **Security Configuration**

`cpanel/api/webhook.php` file এ webhook secret update করুন:

```php
private $secretKey = 'your_builder_webhook_secret_here';
```

### 4️⃣ **GitHub Integration**

`cpanel/api/auto-deploy.php` file এ GitHub config update করুন:

```php
'github' => [
    'repo' => 'nishojibon5-hash/builder-spark-works',
    'branch' => 'main',
    'token' => 'your_github_token' // Optional for public repos
]
```

## 📊 **Supported Builder.io Events**

Webhook automatically trigger হবে এই events এর জন্য:

- ✅ `content.update` - Content update হলে
- ✅ `content.publish` - Content publish হলে  
- ✅ `page.publish` - Page publish হলে
- ✅ `model.update` - Model update হলে
- ✅ `content.save` - Content save হলে
- ✅ `publish` - General publish event

## 🔍 **Testing & Monitoring**

### Manual Deployment Test

```bash
curl -X POST https://yourdomain.com/api/auto-deploy \
  -H "Content-Type: application/json" \
  -d '{"trigger": "manual_test"}'
```

### Check Deployment Status

```bash
curl https://yourdomain.com/api/deployment-status
```

### Webhook Test

```bash
curl -X POST https://yourdomain.com/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "content.publish",
    "id": "test-123",
    "data": {
      "contentId": "example",
      "modelName": "page"
    }
  }'
```

## 📝 **Log Files**

Deployment activities track করার জন্য:

```
logs/webhook.log              - Webhook activities
logs/auto-deploy.log          - Deployment process
logs/deploy-notifications.log - Deployment notifications
```

## 🚦 **Deployment Process Steps**

যখন Builder.io থেকে webhook আসবে:

1. **📥 Webhook Received** - Builder.io থেকে event receive
2. **📋 Backup Creation** - Current files এ��� backup
3. **📂 Code Download** - GitHub থেকে latest code download
4. **🏗️ Build Process** - Application build করা
5. **🚀 File Deployment** - New files deploy করা
6. **🗄️ Database Migration** - Schema updates (যদি থাকে)
7. **🧹 Cache Clear** - Cache clear করা
8. **✅ Verification** - Deployment success verify
9. **📨 Notification** - Status notification

## 🔒 **Security Features**

- ✅ **Webhook Signature Verification** - Unauthorized access prevent
- ✅ **Backup System** - Rollback capability
- ✅ **Error Handling** - Failed deployment recovery
- ✅ **Log Monitoring** - Complete activity tracking

## ⚡ **Performance**

- **⏱️ Deployment Time**: 2-5 minutes (depending on file size)
- **📊 Downtime**: Minimal (atomic deployment)
- **🔄 Auto-Rollback**: Failed deployment automatic rollback

## 🐛 **Troubleshooting**

### Webhook Not Triggering

1. Check Builder.io webhook configuration
2. Verify webhook URL accessibility
3. Check webhook secret matching
4. Review webhook logs: `logs/webhook.log`

### Deployment Failing

1. Check GitHub repository access
2. Verify file permissions
3. Check disk space
4. Review deployment logs: `logs/auto-deploy.log`

### Site Not Updating

1. Check if deployment completed successfully
2. Clear browser cache
3. Check .htaccess file
4. Verify file permissions

## 📈 **Benefits**

### ✅ **Instant Updates**
- Builder.io এ content update করলেই live site update
- Manual deployment এর প্রয়োজন নেই

### ✅ **Safe Deployment**
- Automatic backup system
- Rollback capability
- Error handling

### ✅ **Team Collaboration**
- Multiple team members update করতে পারবে
- Centralized content management
- Version control maintained

### ✅ **Monitoring**
- Complete deployment tracking
- Status notifications
- Error logging

## 🔄 **Manual Override**

যদি automatic deployment disable করতে চান:

```php
// webhook.php এ
$deploymentEvents = []; // Empty array করুন
```

Manual deployment:

```bash
curl -X POST https://yourdomain.com/api/auto-deploy
```

## 📞 **Support**

- **Webhook Logs**: `https://yourdomain.com/logs/webhook.log`
- **Deployment Status**: `https://yourdomain.com/api/deployment-status`
- **Health Check**: `https://yourdomain.com/api/health`

---

**🏦 LoanBondhu - Builder.io Auto-Update System**

Setup completed! এখন Builder.io তে content update করলেই automatically cPanel site update হবে! 🚀

## ⚙️ **Configuration Summary**

```json
{
  "webhook_url": "https://yourdomain.com/api/webhook",
  "events": ["content.publish", "content.update", "page.publish"],
  "security": "webhook_signature_verification",
  "deployment": "automatic_github_pull_and_deploy",
  "rollback": "automatic_on_failure",
  "monitoring": "complete_logging_and_status"
}
```

এই system একবার setup করলে ভবিষ্যতে Builder.io থেকে যেকোনো update automatically live site এ reflect হবে! 🎯
