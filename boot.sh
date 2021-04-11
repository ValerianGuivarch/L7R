rm -r static
python3 manage.py collectstatic    
sudo gunicorn --daemon --bind 127.0.0.1:8001 LesSeptRois.wsgi
sudo /etc/init.d/apache2 stop  
sudo service nginx restart

