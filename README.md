# no-missing-lims
NodeJS powered HTTP server for monitoring laboratory work progress.

This is a learning project for me. I've used it to learn the basics of python and refresh myself on javascript. It's introduced me to node.js, express, and a variety of other technolgies, tools, and ways of thinking about web-development projects.

The working part of this repository are the js and ejs files used by node to launch an http server and then serve and render webpages.

Also included in this repository are the python files I used to load model LIMS database.
On the Labware-LIMS website, I found a table containing describing a default or common database schema. I used that basic description and best-guesses for how the database ought to work as a guide for setting up my own database.

This project currently lacks security, well thought out error handling, and a way for modeling an active state. The rendered page is currently barebones as well and currently only acts as a proof of concept for the site.

My next steps are:
1. make the layout prettier, maybe talk w/ Jenni or others re: what is needed/wanted and how they want to show it
2. write a python script to simulate the i/o nature of the LIMS database. the model is static currently
3. research security layers: sql sanitization/sever-side checks, setting sql permissions, setting up the server for https
4. research putting node server behind nginx server for added stability, speed, security