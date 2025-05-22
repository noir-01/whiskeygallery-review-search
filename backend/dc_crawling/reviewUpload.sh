#!/bin/bash
. /home/blanc/whiskey-venv/bin/activate
python /home/blanc/whiskey-venv/whiskey/backend/dc_crawling/crawl.py
deactivate
#crontab
# 0 5 * * * /home/blanc/whiskey-venv/whiskey/backend/dccrolling/reviewUpload.sh > /home/blanc/whiskey-venv/whiskey/backend/dccrolling/reviewUpload.log 2>&1
# * * * * * /home/blanc/Documents/monitoring/monitoring.sh > /home/blanc/Documents/monitoring/monitoring.log 2>&1
# 0 14 * * tue,fri lp /home/blanc/test.gif

#sudo crontab
# 0 4 * * * /sbin/shutdown -r now
# 0 5 1 */2 * /usr/local/bin/renew_cert.sh >> /var/log/cert_renewal.log 2>&1

#renew_cert.sh
#!/bin/bash
# sudo service nginx stop
# sudo certbot renew --dry-run
# sudo certbot renew
# sudo service nginx start

#monitoring/monitoring.sh
#cd /home/blanc/Documents/monitoring
#python monitoring.py
