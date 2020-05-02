# The version of NodeJS available in the official Debian 9 Stretch package repository
# is 4.x, which is very old.
# The official package repository of Debian 9 Stretch does not have NPM.
# In this section, I will install the latest stable version of NodeJS and NPM
# which is at the time of this writing 8.11.1.

# First update the apt package repository cache with the following command:
#--------------------------------------------------------------------------#
sudo apt update
sudo apt install curl
sudo apt install build-essential
# https://github.com/nodesource/distributions/blob/master/README.md
# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt install -y nodejs

node --version
npm --version
#--------------------------------------------------------------------------#
cd ~ #angru user
git clone git@github.com:msoodb/angrui.git
cd angrui
npm install
#--------------------------------------------------------------------------#
# serve with hot reload at localhost:8080
npm run serve
# build for production with minification
npm run build
# run linter
npm run lint
# run unit tests
npm run test:unit
# run e2e tests
npm run test:e2e
#--------------------------------------------------------------------------#
# build deployment
# https://cli.vuejs.org/guide/deployment.html
#--------------------------------------------------------------------------#
/etc/nginx/sites-available$ sudo vi default
  server
  {
    listen 80;
    server_name angrui.com;
    root /home/angru/angrui/dist;
    index   index.html index.htm;
    location / {
      root /home/angru/angrui/dist;
      try_files $uri /index.html;
    }
  }
sudo nginx -t
sudo service nginx restart
# read nginx log
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
#--------------------------------------------------------------------------#
cd ~/angrui/node_modules/element-ui/lib/locale
sudo vi index.js
# var _zhCN = require('element-ui/lib/locale/lang/en');
npm run build
#--------------------------------------------------------------------------#
