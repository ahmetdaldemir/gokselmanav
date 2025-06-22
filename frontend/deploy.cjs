const { NodeSSH } = require('node-ssh');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function deployFrontend() {
  try {
    console.log('🚀 Frontend build başlatılıyor...');
    
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
    const remotePath = '/var/www/html/gokselmanav/frontend';
    
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
    
    ssh.dispose();
    console.log('🎉 Frontend deployment tamamlandı!');
    
  } catch (error) {
    console.error('❌ Deployment hatası:', error);
    process.exit(1);
  }
}

// Script çalıştırıldığında deployment başlat
if (require.main === module) {
  deployFrontend();
}

module.exports = { deployFrontend }; 