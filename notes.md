# Class Notes

I learned in this assignment about conflict resolution and how to merge branches when there are conflicts


# Caddy Server 
ssh -i ~/.ssh/bargoKP.pem ubuntu@bargojobs.com

# Deploy Script
./deployFiles.sh -k ~/.ssh/bargoKP.pem -h bargojobs.com -s {service}

# Midterm Review
1. In the following code, what does the link element do?
 -  is used to define relationships between the current document and external resources. It is most commonly used to link to external stylesheets to control the presentation (styling) of the HTML document. `<link rel="stylesheet" type="text/css" href="styles.css">`
2. In the following code,  what does a div tag do?
3. In the following code, what is the difference between the #title and .grid selector?
    - `#` is the id selector and `.` is the class selector
4. In the following code, what is the difference between padding and margin?
    - Padding represents the amount of inner space an element has, while the margin is whitespace available surrounding an element. Element, Padding, Border, Margin
5. Given this HTML and this CSS how will the images be displayed using flex?
    - In a flex container, there are two primary axes: the main axis and the cross axis. The main axis is defined by the flex-direction property (either horizontal or vertical), and the cross axis is perpendicular to the main axis.
    - The justify-content property is used to control the alignment and distribution of flex items along the main axis. You can use values like flex-start, flex-end, center, space-between, and space-around to control the positioning of items.
    - align-items and align-content properties control the alignment of flex items along the cross axis. You can use values like flex-start, flex-end, center, stretch, and more.
    - Other key properties include flex-grow, flex-shrink, and flex-basis, which control how flex items grow and shrink within the container.
The order property allows you to reorder flex items within the container.
6. What does the following padding CSS do?
7. What does the following code using arrow syntax function declaration do?
    - Arrow syntax declars anonymous function.
8. What does the following code using map with an array output?
    - The map() method of Array instances creates a new array populated with the results of calling a provided function on every element in the calling array.
9. What does the following code output using getElementByID and addEventListener?
    - The addEventListener() method of the EventTarget interface sets up a function that will be called whenever the specified event is delivered to the target.
10. What does the following line of Javascript do using a # selector?
11. Which of the following are true? (mark all that are true about the DOM)
12. By default, the HTML span element has a default CSS display property value of: 
    - display: inline
13. How would you use CSS to change all the div elements to have a background color of red?
    - div {background-color: red;}
14. How would you display an image with a hyperlink in HTML?
```
    <a href="https://example.com">
        <img src="image.jpg" alt="Description of the Image">
    </a>
```
15. In the CSS box model, what is the ordering of the box layers starting at the inside and working out?
    - Element, padding, border, margin 
16. Given the following HTML, what CSS would you use to set the text "troubl" to green and leave the "double" text unaffected?
    - Use an ID attribute
17. What will the following code output when executed using a for loop and console.log?
18. How would you use JavaScript to select an element with the id of “byu” and change the text color of that element to green?
    - `setAttribute('attribute','value')`
19. What is the opening HTML tag for a paragraph, ordered list, unordered list, second level heading, first level heading, third level heading?
    - `<p>, <ol>, <ul>, <h2>, <h1> , <h3>`
20. How do you declare the document type to be html?
    - `<!DOCTYPE html>`
21. What is valid javascript syntax for if, else, for, while, switch statements?
22. What is the correct syntax for creating a javascript object?
    ```
    Create a single object, using an object literal.
    Create a single object, with the keyword new.
        - const person = new Object();
          person.firstName = "John";
    Define an object constructor, and then create objects of the constructed type.
        function Person(first, last, age, eye) {
        this.firstName = first;
        this.lastName = last;
        this.age = age;
        this.eyeColor = eye;
        }
    Create an object using Object.create().
        const person = {
        isHuman: false,
        printIntroduction: function () {
            console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
        },
        };

        const me = Object.create(person);

        me.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
        me.isHuman = true; // Inherited properties can be overwritten

        me.printIntroduction();
        // Expected output: "My name is Matthew. Am I human? true"
    ```
23. Is is possible to add new properties to javascript objects?
    - Yes but it cannot change its reference
24. If you want to include JavaScript on an HTML page, which tag do you use?
    - `<script>`
25. Given the following HTML, what JavaScript could you use to set the text "animal" to "crow" and leave the "fish" text unaffected?
    - `getItemByID()`
    - `setAttribute()`
26. Which of the following correctly describes JSON?
27. What does the console command chmod, pwd, cd, ls, vim, nano, mkdir, mv, rm, man, ssh, ps, wget, sudo  do?
    - chmod: change permissions for a file or directory on a Unix machine.
    - pwd: print working dir
    - cd: change dir
    - ls: list dir contents
    - vim: text editor for programming
    - nano: another text editor
    - mkdir: create new directory
    - mv: mv [options(s)] [source_file_name(s)] [Destination_file_name]
    - rm: deletes a file
    - man: opens up the manual
    - ssh: creates a secure shell tunnel connection
    - ps: viewing information related with the processes on a system
    - wget: download files from the internet
    - sudo: allows you to run programs with the security privileges of another user 
28. Which of the following console command creates a remote shell session?
    - ssh
29. Which of the following is true when the -la 
parameter is specified for the ls console command?
    - long listing for all files 
30. Which of the following is true for the domain name banana.fruit.bozo.click, which is the top level domain, which is a subdomain, which is a root domain?
    - bozo.click is root, fruit is sub, banana is toplevel
31. Is a web certificate is necessary to use HTTPS.
    - Yes. Certificate has server's encrpyted public key. CA's public key can be used to decrypt server's public key. Shared encryption key can then be set up to use between client and server the rest of the session.
32. Can a DNS A record can point to an IP address or another A record?
    - Yes
33. Port 443, 80, 22 is reserved for which protocol?
    - 443: HTTPS
    - 80: HTTP
    - 22: ssh
34. What will the following code using Promises output when executed?

 