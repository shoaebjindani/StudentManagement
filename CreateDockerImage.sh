mvn clean
mvn package
cp target/Attempt10.war ROOT.war
docker build -t shoaebjindani/studentmanagement:latest .