# DevTinder
Application for Connecting Developers

#Deployment

create aws account 
launch instance
install node.js
clone github 
Frontend
  - npm install in the repo
  - npm run build
  - sudo apt update (Update packages)
  - sudo apt install nginx
  - sudo systemctl start nginx
  - sudo systemctl enable nginx
  - copy code from dist(build files) to /var/www/html/
  - sudo scp -r dist/* /var/www/html/
  - enable port :80 on our server from ec2 instance

Backend 
  - update db password(not important)
  - allowed ec3 instance ip on mongodb server
  - allow backend port on aws security grp
  - install pm2 (npm install pm2 -g)
  - pm2 start npm -- start --watch
  - pm2 logs (for logs seeing)
  - pm2 flush npm(name of application) ---> for logs clear 
  - pm2 list ( to processes)
  - pm2 stop npm ( to stop the process)
  - pm2 delete npm (to delete the process)
  

make backend to listen to ip/api instead of ip:3000
 - go to sudo /etc/nginx/sites-available/ 
 - edit default 
     - add ip in server_name
     server_name 3.109.211.19;

     - add rule 

       location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    - restart nginx sudo systemctl restart nginx
    - modify the BASE_URL in the frontend to '/api'

# Adding a custom Domain Name 
   - purchased domain name from godaddy
   - signup on cloudflare & add a new domain name 
   - change the nameservers on godaddy and point it to cloudflare
   - wait for dns to get updated on cloudflare 
   - point our ec2 ip to the dns name of our project on cloudflare
   - set up ssl from the clouflare for our dns and can select the type of ssl(full, flexible) this will make our application secure and will be able to access using https
   - go to edge certificates and select automatic HTTPS Rewrites enable

# Sending Emails via SES
  
  - Create a IAM user
  - Give access to AmazonSESFullAccess
  - Amazon SES: Create an Identity
  - Verify your domain name 
  - Verify an email address identity in aws 
  - Install AWS SDK - v3 
  - Setup SESClient
  - Access Credentials should be created in IAM under SecurityCredentials Tab
  - Add the credentials to the env file 
  - Write code for SESClient 
  - Write code for Sending email Address
  - Make the email dynamic by passing more params to the run function



  



