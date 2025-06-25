FROM nginx:stable-alpine

# Copy Nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend build
COPY client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
