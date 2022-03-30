
//Doi tuong validator
function Validator(options) {

    function getParent(element, selector) {
        while(element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            } else {
                element = element.parentElement;
            }
        }
    }
    
    var selectorRules = {};

    //Ham thuc hien validate
    function validate(inputElement, rule) {
        var parrentElement = getParent(inputElement, options.formGroupSelector);
        var errorElement = parrentElement.querySelector(options.errorSelector);
        var errorMessage;

        //lay ra cac rule cua selector - nhieu test & kiem tra
        //Neu co loi thi dung viec kiem tra
        var ruleTest = selectorRules[rule.selector];
        for (var i = 0; i < ruleTest.length; i++) {
            //Kiem tra cho cac TH la checkbox, radio
            //vi cac type nay khi element.value = chinh atribu value cua no
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = ruleTest[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default: errorMessage = ruleTest[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            parrentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            parrentElement.classList.remove('invalid');
        }

        return !errorMessage;
    }

    //Lay element cua form can validate
    var formElement = document.querySelector(options.form);
    if (formElement) {

        //Xu ly khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;
            //Lap qua tung rule va validate tat ca
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) isFormValid = false;
            });

            if(isFormValid) {
                //TRuong hop submit voi JS
                if (typeof options.onSubmit == 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        
                        switch(input.type) {
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'radio':
                                if (input.matches(':checked')) {
                                    values[input.name] = input.value;
                                }
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default: values[input.name] = input.value;
                        }

                        return values;
                    }, {});

                    options.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }
        }

        //Lap qua moi rule va xu ly
        options.rules.forEach(function(rule) {
            //Save rules cho moi~ input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }


            var inputElements = formElement.querySelectorAll(rule.selector);
            //convert nodeList sang Array
            Array.from(inputElements).forEach(function(inputElement) {
                if (inputElement) {
                    //Xử lí trường hợp blur ra ngoài
                    inputElement.onblur = function() {
                        validate(inputElement, rule);
                    }
    
                    //Xử lý mỗi khi người dùng bắt đầu nhập input
                    var parrentElement = getParent(inputElement, options.formGroupSelector);
                    inputElement.oninput = function() {
                        var errorElement = 
                                parrentElement.querySelector(options.errorSelector);
                        errorElement.innerText = '';
                        parrentElement.classList.remove('invalid');
                    }

                    //Xu ly khi nguoi dung thay doi lua chon - tag select
                    //validate ngay khi có thay đổi 
                    inputElement.onchange = function() {
                        validate(inputElement, rule);
                    }
                }
            });
            
        });
    }
}

//Dinh nghia cac rule:
//Nguyen tac cac rule:
//1. Khi co loi: tra ve message loi
//2. khi hop le: khong return
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined:  message ||'Vui lòng nhập trường này!';
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined:  message || 'Trường này phải là email!';
        }
    }
}

Validator.minLength = function (selector, min, message) {
   return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : 
                    message ||`Vui lòng nhập tối thiểu ${min} kí tự`;
        }
   }

}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value == getConfirmValue() ? undefined: message || 'Giá trị nhập vào không chính xác';
        }
    }
}
