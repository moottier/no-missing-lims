# no-missing-lims
NodeJS powered HTTP server for monitoring laboratory work progress.

This is a learning project for me. I've used it to learn the basics of python and refresh myself on javascript. It's introduced me to node.js, express, and a variety of other technolgies, tools, and ways of thinking about web-development projects.

The working part of this repository are the js and ejs files used by node to launch an http server and then serve and render webpages.

Also in the repository are a set ofpython files which I used to load a model MySql LIMS database.

The MySql database was modeled after descriptions of standard tables found on the On the Labware-LIMS website. Closeness of my model database to the actual LIMS db is not guaranteed.

This project currently lacks security, well thought out error handling, and a way for modeling an active state. The rendered page is pretty barebones as well, acting as a proof of concept for the site and not much else.

My next steps are:
1. make the layout prettier, maybe talk w/ Jenni or others re: what is needed/wanted and how they want to show it
2. write a python script to simulate the i/o nature of the LIMS database. the model is static currently
3. research security layers: sql sanitization/sever-side checks, setting sql permissions, setting up the server for https
4. research putting node server behind nginx server for added stability, speed, security