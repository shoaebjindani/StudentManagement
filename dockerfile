FROM tomcat:9.0.76-jre17



COPY context.xml /usr/local/tomcat/conf/context.xml

# Some code that copies the war into the webapps folder
COPY ROOT.war /usr/local/tomcat/webapps/

# Expose the port
#EXPOSE 8080