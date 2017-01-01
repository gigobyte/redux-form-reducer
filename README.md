# redux-form-reducer
>**Dead simple form reducer for less boilerplate and more developer satisfaction**



I have been struggling with forms and validation in React for a long time. After trying out different options I decided to come up with my own solution - one that is lightweight and easily pluggable in any project. This is how redux-form-reducer was born.

This library provides an easy way to setup a reducer that has built-in handling for validation on field change and other nifty things.

## Why Should I Use It?

* Easy to setup
* Extremely lightweight! *Under 2KB* <img width=15 src="http://emojipedia-us.s3.amazonaws.com/cache/ec/ea/ecea30f0a206c2ef20eba907f760f4cc.png"></img>  
* Component-agnostic - no complicated component structures needed, bindings are extremely simple
* Easily pluggable in your existing reducer

## Installation

```
npm install --save redux-form-reducer
```

## How to Use

#### Creating a reducer

```js
import createFormReducer from 'redux-form-reducer'

const myReducer = createFormReducer({
    name: 'exampleForm',
    fields: [
        {name: 'item', default: ''},
        {name: 'price', default: 0, validate: myValidationFunction}
    ],
    nonFieldProperties: {
        submitAjaxCallStatus: null
    },
    extendReducer: function(state, action) {
        if(action.type === 'SUBMIT') {
             return {...state, submitItemAjaxCallStatus: 'pending'}
        }
    }
})
```

First, you want to create your reducer. This is done by calling the ```createFormReducer({name, fields?, nonFieldProperties?, extendReducer?})``` function that is exported by redux-form-reducer.


1.  ```name``` - the name of the form, the only mandatory argument, redux actions are going to be prefixed with that name
2. ```fields``` - an array of objects, each describing a field in the form. A field can have a ```name```, a ```default``` value and a validation function. On error the validation function **MUST** return a string with the error message
3. ```nonFieldProperties``` - since this library is intented only as a plugin, you can set the default values of any non-field properties here
4. ```extendReducer``` - a reducer function for handling any other actions you may have for the form, for example handling form submittion or whatever your heart desires.

The reducer, once added to your store, will produce the following state:

```js
exampleForm: {
    values: {
        item: '',
        price: 0
    },
    errors: {
        price: ''
    },
    submitAjaxCallStatus: null
}
```

#### Updating the store

To update the store you have to dispatch an action with the following signature:
```
{
    type: ${name_of_the_form}/UPDATE_FIELD,
    payload: {
        field: field_name_string,
        value: new_value
    }
}
```

Errors get set automatically by redux-form-reducer, but if you need to set an error manually, you can dispatch the an ```UPDATE_ERROR``` action:
```
{
    type: ${name_of_the_form}/UPDATE_ERROR,
    payload: {
        field: field_name_string,
        value: new_value
    }
}
```

There is also a helper action for easily resetting the form, just dispatch a ```${name_of_the_form}/RESET``` action with no payload

## Example

myReducer.js
```js
function validateUsername(username) {
    if(!username) {
        return 'This field is required'
    }
}

export default function createFormReducer({
    name: 'loginForm',
    fields: [
        {name: 'username', default: '', validate: validateUsername}
    ]
})
```

LoginForm.jsx
```js
@connect((store) => ({
    form: store.loginForm
}))
class LoginForm extends React.Component {
    constructor() {
        super()
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        store.dispatch({
            type: 'loginForm/UPDATE_FIELD',
            payload: {field: 'username', value: event.target.value}
        })
    }

    render() {
        const { values, errors } = this.props
        
        return (
            <input type="text" value={values.username} onChange={this.handleChange} />
            <div class="error-text">{errors.username}</div>
        )
    }
}
```
