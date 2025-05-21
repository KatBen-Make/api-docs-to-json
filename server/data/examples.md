# Examples

## Example 1

### Input:

Body parameters
application/json

subject
string
The subject of the activity

type
string
The type of the activity

owner_id
integer
The ID of the user who owns the activity

### Result:
[
    {
        "name": "subject",
        "label":"Subject",
        "type":"text"
    },
    {
        "name": "type",
        "label":"Type",
        "type":"text"
    },
    {
        "name": "owner_id",
        "label":"Owner ID",
        "type":"integer"
    }
]

