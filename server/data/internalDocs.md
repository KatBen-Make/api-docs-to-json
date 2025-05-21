Internal documentation
======================

The resulting JSON have to follow these rules:

# JSON example
    [
        {
            "name": "recordId",
            "type": "text",
            "label": "Record ID",
            "rpc": {
                "label": "ID finder",
                "url": "rpc://recordSearch",
                "parameters": [
                    {
                        "type": "html",
                        "label": "<div style='color: #205671; background: #E8F6FF; border-radius: 5px; padding: 12px 16px 12px 16px; font-size: 12px;'>If you don't see the result you're looking for, try more specific search criteria.</div>"
                    },
                    {
                        "name": "query",
                        "type": "text",
                        "label": "Query"
                    }
                ]
            }
        },
        {
            "name": "email",
            "type": "email",
            "label": "Email address",
            "required": true
        },
        {
            "name": "name",
            "type": "text",
            "label": "Name",
            "required": true
        },
        {
            "name": "newsletter",
            "type": "boolean",
            "label": "Send newsletter?",
            "default": false,
            "required": true
        },
        {
            "name": "size",
            "type": "select",
            "label": "T-Shirt size",
            "options": [
                {
                    "label": "S",
                    "value": "s"
                },
                {
                    "label": "M",
                    "value": "m"
                },
                {
                    "label": "L",
                    "value": "l"
                }
            ]
        },
        {
            "name": "customerNo",
            "label": "Customer Number",
            "type": "number",
            "help": "Should be null for automatic assigment of the number if you want to create a Customer."
        },
        {
            "name": "interval",
            "label": "Interval",
            "type": "collection",
            "spec": [
                {
                    "name": "from",
                    "type": "number"
                },
                {
                    "name": "to",
                    "type": "number"
                }
            ],
            "help": "Available only if set up in the Company setting."
        },
        {
            "name": "tracking_uuid",
            "label": "Tracking UUID",
            "type": "uuid"
        },
        {
            "name": "recipients",
            "type": "array",
            // Label of the array
            "label": "Recipients",
            "spec": {
                "type": "text",
                // Label of array item(s)
                "label": "Recipient name"
            },
            "labels": {
                // Label of the button to add an array item
                "add": "Add recipient name"
            }
        }
    ]

# Parameters

Common Settings
These settings are basic common settings for all types of parameters.

    {
        "name": <String>,
        "label": <String>,
        "help": <String>,
        "type": <String>,                     // default: text
        "required": <Boolean>,                // default: false
        "default": <Object>,
        "advanced": <Boolean>                 // default: false
    }


### name

Type: String

Required

Internal parameter name. 
This is the key to the resulting object.
Can contain arbitrary characters.
Avoid setting it to any of the reserved words.

### label

Type: String

Required

Parameter label for the user which is displayed in GUI.

### help

Type: String

Parameter description for the user which is displayed in GUI.

### type

Type: String

Default: text

Type of the parameter. Each type has its own documentation page.
Always enter types in lowercase.
Available types of parameters are:

* array - array of items of the same type
* boolean - true or false value
* buffer - binary buffer
* cert - certificate in PEM format
* collection - an object
* color - hexadecimal color input
* date - date or date with time
* email - allows only a valid email address to be filled in
* file - file selection
* filename - file name
* filter - an advanced parameter used for filtering
* folder - folder selection
* hidden - parameter of this type is hidden from the user
* integer - whole number
* number - a number
* path - a path to a file or a folder
* pkey - private key in PEM format
* port - a whole number in the range from 1 to 65535
* select - a selection from predefined values
* text - text value
* time - time in hh:mm or hh:mm:ss or hh:mm:ss.nnn format
* timestamp - unix timestamp
* timezone - time zone name (e.g. Europe/Prague)
* uinteger - positive whole number
* url - URL address
* uuid - UUID


### required

Type: Boolean

Default: false

Specifies if the parameter is required. Required parameters should be always listed on the top of the page.

### default

Type: The type of the parameter

Specifies the default value of the parameter.


### rpc

Type: Object

Adds an extra button to the field which opens an extra form. When the form is submitted, a specified RPC is called and the result is set as a new value of the parameter.

Available parameters:

label: string, The text which is displayed on the button.

url: string, The URL of the RPC to be called.

parameters: array, An array of parameters of the extra form. Uses regular parameters syntax.

For parameters where ID is needed (invoiceId, clientId etc.) we should use ID finder block like this:

    {
        "name": "invoiceId",
        "type": "text",
        "label": "Invoice ID",
        "rpc": {
            "label": "ID finder",
            "url": "rpc://searchInvoices",
            "parameters": [
                {
                    "type": "html",
                    "label": "<div style='color: #205671; background: #E8F6FF; border-radius: 5px; padding: 12px 16px 12px 16px; font-size: 12px;'>If you don't see the result you're looking for, try more specific search criteria.</div>"
                },
                {
                    "name": "query",
                    "type": "text",
                    "label": "Query"
                }
            ]
        }
    }

### Arrays
 If the API is expecting an array of collection

    {
        "recipients": [
            {
                "name": "abc"
            }
        ]
    }
 
 Use this format

    [
        {
            "name": "recipients",
            "type": "array",
            // Label of the array
            "label": "Recipients",
            "spec": {
                "type": "collection",
                // Label of array item(s)
                "label": "Recipient",
                "spec": [
                    {
                        "name": "name",
                        "type": "text",
                        "label": "Name",
                        "required": true
                    }
                ]
            },
            "labels": {
                // Label of the button to add an array item
                "add": "Add recipient"
            }
        }
    ]


 If the API is expecting a primitive array

    {
        "recipients": [
            "name-abc"
        ]
    }
 
 Use this format

    [
        {
            "name": "recipients",
            "type": "array",
            // Label of the array
            "label": "Recipients",
            "spec": {
                "type": "text",
                // Label of array item(s)
                "label": "Recipient name"
            },
            "labels": {
                // Label of the button to add an array item
                "add": "Add recipient name"
            }
        }
    ]


## Parameter Labels

All labels should use sentence case and correct format of abbreviations. 
Examples: "Contact ID", "HTML format", "Web URL", "Mobile phone number", "VAT"

## Parameter Help

The hint for the parameter in "help" should follow these rules:
1. Add only important hints when the parameter's name needs explanation. If the name is contactId and the description is "Insert Contact ID" it is useless information and should be ommitted.
1. If possible, avoid using verbs at the beginning of the hint.
1. The "help" should always be a sentence in correct english and end with a period. It should be in user friendly tone.
1. It should use markdown formatting: backtick for examples of values: "Must be a decimal number. For example, `1.2`." and bold formatting the labels of the parameters: "Either **Name** or **Email** value is required."
1. It should use markdown formatting for links.

