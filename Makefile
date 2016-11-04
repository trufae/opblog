all: node_modules
	node index.js

node_modules:
	yarn > /dev/null 2>&1 || npm install

dist:
	rm -rf o
	node .
	rm -rf tmp
	git clone . tmp
	cd tmp && git checkout gh-pages
	cp index.html style.css tmp/
	cp -rf o tmp/o
	cd tmp && git add *
	cd tmp && git commit -a -m update || true
	cd tmp && git push -f git@github.com:trufae/opblog gh-pages
	rm -rf tmp
