## [Using Try…Catch in javascript](http://www.javascript-coder.com/tricks/javascript-try-catch.phtml)

![try ... catch](http://www.javascript-coder.com/wp-content/uploads/2015/01/javascript-try-catch.png)

Errors are almost inevitable in JavaScript programs. As a JavaScript developer, it is your responsibility to anticipate errors and handle them effectively. This will ultimately help you to create programs which are robust, reliable and efficient. One simple way of handling errors is through try…catch statements.

A try…catch statement is a programming mechanism which enables you to test your code for possible errors, and carry out certain actions in case an error occurs. It is a feature which is common in many programming languages, and in some like Java, it is sometimes mandatory. In JavaScript, the basic anatomy of a try…catch statement is as follows:

```
try{
 
}
catch(error){
 
}
finally{
 
} 
```

This is broken down as follows:

The try { } statement lets you to test a code for possible errors. Place the code within the opening and closing braces. When any error occurs, it will be passed on to the catch statement.

The catch() statement lets you handle the error. The catch is executed only when an error occurs. You can program what to do if an error occurs. In JavaScript, you can include any number of catch statements.

The argument received by the catch (i.e. catch(error)) is a JavaScript ErrorObject. ErrorObject is the object which represents an error. It has a number of properties which contain information about the specific error.

The finally statement lets you to execute a code irrespective of whether or not an error occurs. The finally statement is optional – not every try…catch statement ultimately ends up with a finally statement.

### A Simple Demonstration

Here is a simple demonstration of the try…catch statement at work. Let’s create some code, and deliberately introduce an error to have a taste of the statement.

To start with, we have the following function which prints a simple welcome message:

```
function welcome()
{
    document.getElementById('display').innerHTML = "Welcome to my world!";
} 
function displayMessage()
{
    try
    {
        welcome();      
    }
    catch(error)
    {
        document.getElementById('display').innerHTML =   error.message; 
    }
} 
```
Then we have another function which calls welcome() in a try…catch statement

When no error occurs, this function displays the welcome message. Only the code within the try statement is executed. The code within the catch statement isn’t executed because there is no error to catch.

Now, let’s deliberately introduce an error. Instead of calling the function welcome(), let’s call a function well_come() which we haven’t defined:
This time, the code within the body of the catch statement is executed. It ends up displaying the error message. You can try it out by clicking on the button.

Html

```
	<div id="display2">Welcome to my world!</div>
	<button class="btn" onclick="displayMessage()"> Check It Out 	</button>

```
Javascript

```
function welcome()
{
    document.getElementById('display').innerHTML = "Welcome to my world!";
}
function displayMessage()
{
    try 
    {
        wel_come();		
    }
    catch(error)
    {
        document.getElementById('display2').innerHTML =   error.message;	
    }
}
```

that’s how a try…catch statement is implemented. The one thing which perhaps needs a brief explanation is “error.message”. As mentioned before, the argument given to a catch statement is an ErrorObject.

Whenever an error occurs, the browser automatically creates an ErrorObject and stores details of the error in that object. One of the properties of the ErrorObject is “message” – which in most cases is a description of the error. In our example, the value stored in “message” is “well_come is not defined”

### A More Practical Example

The above example is perfectly illustrates how a try…catch statement works. However, it is rather impractical. After all, it is highly unlikely that you will use try…catch statements to handle errors which you have deliberately created. A more practical use is for dealing with errors which can arise from other sources during the execution of your program.

One common source of errors is from external data. Given the fact that JSON is now considered a standard format of sharing data, most data which is sent to JavaScript is in JSON. To access the data, you have to parse it (using the function JSON.parse()). Poorly formatted data can generate errors which can be problematic. This is where a try…catch statement comes in handy.

Here is a simple implementation of a function which uses a try…catch statement to handle any possible errors in a JSON data string.

```
function validateData(jsonData)
{
    var data;
    try
    {
      data = JSON.parse(jsonData);
    }
    catch(error)
    {
      console.log("Error in the data");
      console.log(error);
      data = null;
    }
    return data;
} 
```
The above function takes string, parses it and returns a JSON data object or an array which can be accessed using JavaScript. It also documents any errors into the browser’s JavaScript error console. This is the standard approach used by most native functions.

The function above can validate any JSON string. Let us modify so that we can have a test of how it would work in a real program. Let’s imagine that our program is expecting a JSON object which looks something like this:

```
{
    "firstName" : "Marigold",
    "lastName" : "Peters",
    "email": "marigold@me.com"
} 
```
We can write the following function to use a try…catch statement for dealing with any errors in the data input

```
function checkData(jsonData)
{
    var data;
    start_animation();
    try
    {
        data = JSON.parse(jsonData);
    }
    catch(e)
    {
        document.getElementById('display3').innerHTML = 
            "<span class='error'> Error: </span> <br>" + e.message;
        data=null;
    }
    finally
    {
      stop_animation();
    }
 
    if(data != null)
    {
      var entry = "Name : " + data.firstName + 
           " " + data.lastName + " <br> Email : "
            + data.email;
      document.getElementById('display3').innerHTML = entry;
    }
    return data;
}
```
Here is a simple program which uses the above function. You can try it to see how it runs. The button labeled “Correct Data” simulates how the script reacts when supplied well formatted data. The button labeled “Faulty Data” simulates how the script reacts to faulty JSON data.

Html

```

	<div id="display3">

	</div>
	<button class="btn" onclick="checkData(data)"> Correct Data </button>
	<button class="btn" onclick="checkData('data')"> Faulty Data </button>
	<div>
	<span class="spinner"> </span>
</div>
```
Javascript

```

var userData = {
    "firstName" : "Marigold",
    "lastName" : "Peters",
    "email": "marigold@me.com"
    }

var data = JSON.stringify(userData);

function start_animation()
{

  document.getElementsByClassName('btn')[0].style.visibility='hidden';
  document.getElementsByClassName('btn')[1].style.visibility='hidden';
  document.getElementsByClassName('spinner')[0].style.visibility='visible';

}
function stop_animation()
{
  document.getElementsByClassName('btn')[0].style.visibility='visible';
  document.getElementsByClassName('btn')[1].style.visibility='visible';
  document.getElementsByClassName('spinner')[0].style.visibility='hidden';

}

function checkData(jsonData)
{
    var data;
    start_animation();
    try
    {
        data = JSON.parse(jsonData);
    }
    catch(e)
    {
        document.getElementById('display3').innerHTML = "<span class='error'> Error: </span> <br>" + e.message;
        data=null;
    }
    finally
    {
      stop_animation();
    }

    if(data != null)
    {
      var entry = "Name : " + data.firstName + " " + data.lastName + " <br> Email : " + data.email;
      document.getElementById('display3').innerHTML = entry;
    }
    return data;
}
```

### The finally Statement

The checkData function uses the finally statement. As mentioned earlier, “finally” is used to specify what should happen irrespective of whether or not an error has occurred. In our example, we are starting an animation while we are busy fetching and parsing the data. It hides the buttons and shows a loading … animation. After the processing is done, we have to restore the buttons and hide the animation. This should happen irrespective of whether the operation was success or not. So we do stop_animation() in the finally block.

( Although when you try the buttons, the animation is not visible because the parse happens too quickly. The code is to show the concept)

It is important to note that the finally statement doesn’t have access to either the try or catch statements. It cannot know whether or not an error has occurred. This is the reason why, it has to test the value of “data” (if data!=null) to ensure that no error has occurred using the variables.

The finally block can be used to reset or reinitialise the status variables as in our example.
The example we just saw is a perfect illustration of that.

### Throwing Errors

The examples we have so far looked at focus on catching errors. But it is also possible to cause your programs to create errors. In programming jargon, this is called “throwing exceptions. And it is implemented using a “throw” statement.

A throw statement enables you to create custom errors. This makes it easy to specify the kind of messages which arise when an error occurs during program execution. A throw statement looks like this:

```
throw "error message"; 
```
To demonstrate how a throw statement works, let us perform a simple form validation. Let’s imagine we have a text box in which we want to capture the user’s email.

```
<form>
<label for="email"> Email : </label> <br>
<input type="text" id="email"> <br>
</form>
<button> Submit </button>
```
Now, when the user clicks the button, we want to validate on two fronts. First of all, we want to ensure that the input box isn’t empty. Secondly, we want to ensure that any text entered includes the “@” sign which is a standard email addresses.

We shall write a function which will check the value, and throw an error in case any of the two conditions are not met.

```
function checkUserEntry()
{
    var userEntry = document.getElementById('email').value;
    if(userEntry.length == 0)
    {
        throw 'please provide an email address';
    }
    else if(userEntry.indexOf('@')===-1)
    {
        throw 'please provide a valid email address';
    }
    document.getElementById('console').innerHTML = 
    "<h3 style='color:green'> Your email is: </h3>" + userEntry;
}
```
We then write a function which calls checkUserEntry() in a try…catch statement.

The above function catches an error thrown by the function checkUserEntry() and displays it. You can try the demo below and see how our custom errors display.

```
function validateEntry()
{
    try
    {
        checkUserEntry();
    }
    catch(error)
    {
        document.getElementById('console').innerHTML = 
        "<h3 style='color:red'> Warning: </h3>" + error;
    }
}
```
The function above catches an error thrown by the function checkUserEntry() and displays it. You can try the demo below and see how our custom errors display.	


```

	<form>
	<label for="email"> Email: </label> <br>
	<input id="email" type="text"> <br>
	</form>
	<button class="btn" onclick="validateEntry()">Submit</button>
	<div id="console">

	</div>
```

That is one way through which you can throw an error. Another way is by creating a Error() object. Error is one of JavaScripts inbuilt error classes (others are TypeError, EvalError, SyntaxError, and URIError). Using this second approach, instead of saying:

throw 'please provide an email address'; 
You’d say

throw new Error ('please provide an email address'); 
This creates a new object which is similar to the ErrorObject we mentioned earlier. To access the error message, we would reference it using its “message attribute”( i.e. error.message) as follows.

```
document.getElementById('console').innerHTML = 
    "<h3 style='color:red'> Warning: </h3>" + error.message; 
```

Those are the basics of how to handle JavaScript errors using try…catch statements. Therefore, the next time you are designing a JavaScript program, kindly take into consideration the possible errors which may arise; then use try…catch statements to handle them in a simple and effective manner.