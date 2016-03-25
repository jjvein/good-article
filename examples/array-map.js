"use strict"
//### 第一个例子
{
let mixedEmails = ['JOHN@ACME.COM', 'Mary@FooBar.com', 'monty@spam.eggs']

function getEmailsInLowercase(emails) {
    var lowercaseEmails = []
    for (var i=0; i< emails.length; i++) {
        lowercaseEmails.push(emails[i].toLowerCase())
    }
    return lowercaseEmails
}

let validData = getEmailsInLowercase(mixedEmails)

console.log("first example: ", validData)
}

//### 第二个例子
{

let mixedEmails = ['JOHN@ACME.COM', 'Mary@FooBar.com', 'monty@spam.eggs']

function getEmailsInLowercase(emails) {
    var lowercaseEmails = []
    emails.map(function(email) {
        lowercaseEmails.push(email.toLowerCase())
    })
    return lowercaseEmails
}
let validData = getEmailsInLowercase(mixedEmails)

console.log("second example: ", mixedEmails)

}

//### 第三个例子
{

let mixedEmails = ['JOHN@ACME.COM', 'Mary@FooBar.com', 'monty@spam.eggs']

function lowercase(str) {
    return str.toLowerCase()
}

var validData = mixedEmails.map(lowercase)

console.log('third example:', validData)
}


//执行方式： node array-map.js
