const { NodeSSH } = require('node-ssh');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function deployBackend() {
  try {
    console.log('🚀 Backend build başlatılıyor...');
    
    // Build işlemi
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build tamamlandı');
    
    // SSH bağlantısı
    console.log('📤 Dosyalar yükleniyor...');
    const ssh = new NodeSSH();
    
    await ssh.connect({
      host: '185.209.228.189',
      username: 'root',
      password: '@198711Ad@',
      port: 22
    });
    
    // Dist klasörünü yükle
    const localPath = path.join(__dirname, 'dist');
    const remotePath = '/var/www/html/gokselmanav/backend';
    
    console.log(`📁 ${localPath} -> ${remotePath}`);
    
    await ssh.putDirectory(localPath, remotePath, {
      recursive: true,
      concurrency: 10,
      validate: function(itemPath) {
        const baseName = path.basename(itemPath);
        return baseName.substr(0, 1) !== '.' && // exclude hidden files
               baseName !== 'node_modules' && // exclude node_modules
               baseName !== '.git'; // exclude .git
      }
    });
    
    // Package.json dosyalarını yükle
    console.log('📦 Package.json dosyaları yükleniyor...');
    await ssh.putFile(path.join(__dirname, 'package.json'), path.join(remotePath, 'package.json'));
    await ssh.putFile(path.join(__dirname, 'package-lock.json'), path.join(remotePath, 'package-lock.json'));
    
    // Environment dosyasını yükle
    console.log('🔧 Environment dosyası yükleniyor...');
    const envContent = `DATABASE_HOST=185.209.228.189\nDATABASE_PORT=5432\nDATABASE_USERNAME=postgres\nDATABASE_PASSWORD=postgres\nDATABASE_NAME=gokselmanav\nJWT_SECRET=your-super-secret-jwt-key-change-this-in-production\nPORT=3100`;
    const envPath = path.join(__dirname, '.deploy-tmp.env');
    fs.writeFileSync(envPath, envContent);
    await ssh.putFile(envPath, path.join(remotePath, '.env'));
    fs.unlinkSync(envPath);
    
    // Dependencies yükle
    console.log('📦 Dependencies yükleniyor...');
    try {
      await ssh.execCommand('npm install --only=production', { cwd: remotePath });
      console.log('✅ Dependencies yüklendi');
    } catch (depError) {
      console.log('⚠️ Dependencies yükleme hatası:', depError.message);
    }
    
    // PM2 restart
    console.log('🔄 PM2 restart ediliyor...');
    try {
      await ssh.execCommand('cd /var/www/html/gokselmanav/backend && pm2 restart gokselmanav-backend');
      console.log('✅ PM2 restart başarılı');
    } catch (pm2Error) {
      console.log('⚠️ PM2 restart hatası (manuel restart gerekebilir):', pm2Error.message);
    }
    
    ssh.dispose();
    console.log('🎉 Backend deployment tamamlandı!');
    
  } catch (error) {
    console.error('❌ Deployment hatası:', error);
    process.exit(1);
  }
}

// Script çalıştırıldığında deployment başlat
if (require.main === module) {
  deployBackend();
}

module.exports = { deployBackend }; 