Stack used:
===============
FrontEnd: HTML5, AngularJS and Bootstrap<br>
Webservices (End Points): Node.js<br>
DB: MySQL
Execuation:
===============
1)Node.js should be running on localhost on port 8888, file index.js<br>
<b>npm install mysql</b> to install mysql module in order to access MySQL db from Node.js<br>
2)MySQL instance should be created with:<br>
host     : 'localhost',<br>
user     : 'testDbUser',<br>
password : 'test123456',<br>
database : 'test'<br>
3)In "DB" folder I exported test db, so you can just imported it, it will create "users" table and also insert test data<br>
4)"Testing" folder contians the front end, open index.html in browser of your choice<br>
5)First thing the code will check is status of Node.js on localhost and port 8888 and also status of MySQL<br>
6)You can test 4 different endpoints by clicking on different buttons: "Status", "Authentication", "Users" and  "List of files"<br>
7)<b>Pagination:</b> Angular UI Bootstrap - Pagination Directive can be used for this:<br>
data-pagination=""<br> 
data-num-pages="numPages()"<br>
data-current-page="currentPage"<br> 
data-max-size="maxSize"<br>
data-boundary-links="true"<br>
Then in controller you can compute numbr of pages based on records that are pulled divided by how many records should be per page.<br>






