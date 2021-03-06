---
layout: post
title: Chrome Developer Tools
---
**Chrome Developer Tools**<br/>
-The Chrome Developer Tools are a set of web authoring and debugging tools built into Google Chrome.<br/>
-The DevTools provide web developers deep access into the internals of the browser and their web application.Its used to efficiently track down layout issues, set JavaScript breakpoints and get insights for code optimization.<br/>

**Accessing the DevTools**<br/>
-To access the DevTools, open a web page or web app in Google Chrome;Either:<br/>
+Select the Chrome menu *Chrome Menu* at the top-right of your browser window, then select *Tools* then *Developer Tools*.<br/>
+*Right-click* on any page element and select *Inspect Element*.<br/>
+The DevTools window will then open.<br/>

**The DevTools Window**<br/>
-The DevTools are organised into task-oriented groups in the toolbar at the top of the window. Each toolbar item and corresponding panel let you work with a specific type of page or app information, including DOM(Document Object Model) elements, resources, and sources.<br/>
-The overall main groups of tools available are:<br/>
	1.Elements<br/>
	2.Resources<br/>
	3.Network<br/>
	4.Sources<br/>
	5.Timeline<br/>
	6.Profiles<br/>
	7.Audits<br/>
	8.Console<br/>

**Inspecting the DOM and styles**<br/>
-The **Elements** panel lets you see everything in one DOM tree, and allows inspection and on-the-fly editing of DOM elements.<br/>
-Visit the Elements tabs when you need to identify the HTML snippet for some aspect of the page.<br/>

**Working with the Console**<br/>
-The **JavaScript** Console provides two primary functions for developers testing web pages and applications:<br/>
1.Log diagnostic information in the development process.<br/>
2.A shell prompt which can be used to interact with the document and DevTools.<br/>

-You can log diagnostic information using methods provided by the 9Console API. Such as **console.log()** or **console.profile()**.<br/>
-You can evaluate expressions directly in the console and use the methods provided by the **Command Line API**. These include **'$()'** command for selecting elements or **profile()** to start the CPU profiler.<br/>

**Debugging JavaScript**<br/>
-The **debugging** tool helps quickly discover the cause of an issue and fix it efficiently.<br/>

**Improving network performance**<br/>
-The **Network** panel provides insights into resources that are requested and downloaded over the network in real time.<br/>
-Identifying and addressing those requests taking longer than expected is an essential step in optimizing your page.<br/>

**Audits**<br/>
-The **Audit** panel can analyze a page as it loads. Then provides suggestions and optimizations for decreasing page load time and increase perceived responsiveness.<br/>

**JavaScript & CSS performance**<br/>
-The **Profiles** panel lets you profile the execution time and memory usage of a web app or page. <br/>
-These help you to understand where resources are being spent, and so help you to optimize your code.<br/>
-The provided profilers are:<br/>
1.The **CPU profiler**-shows where execution time is spent in your page's JavaScript functions.<br/>
2.The **Heap profiler** shows memory distribution by your page's JavaScript objects and related DOM nodes.<br/>
3.The **JavaScript** profile shows where execution time is spent in your scripts<br/>

**Inspecting storage**<br/>
-The **Resources** panel lets you inspect resources that are loaded in the inspected page.<br/>
-It lets you interact with HTML5 Database, Local Storage, Cookies, AppCache, etc.<br/>
