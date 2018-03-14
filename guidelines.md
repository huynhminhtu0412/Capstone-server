#--------------------------------------------------------
# STEPS TO START API SERVER
#--------------------------------------------------------
1. Install node.js (version 6.2.2) --> restart computer (check: node -v)
2. Install posgresql server - PG Admin III (http://www.enterprisedb.com/products-services-training/pgdownload#osx)
3. Go to source/server, run: npm install
4. Create elearning database. Run database migration to generate db schema. 
    + npm install sequelize-cli -g
	+ sequelize db:migrate
	+ sequelize db:seed:all 
5. Start server: node server


#--------------------------------------------------------
# STEP TO GENERATE API DOCS
#--------------------------------------------------------
1. Run command: npm install apidoc -g
2. Run command: npm run-script apidoc
3. Open file: documents/apidoc/index.html


#--------------------------------------------------------
# RUN UNIT TEST
#--------------------------------------------------------
1. Run command: npm test
2. View test results in tests/results/report
3. View test coverage in tests/results/coverage