function Validator(formSelector) {
    var _this = this;

    //Chua cac rule
    var formRules = {
        //name: attribute
    };
    /**
     * Quy uoc dao rule:
     * - Neu co loi thi return `error message`
     * - Neu khong co loi thi return undefined
     */
    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này!';
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined: 'Trường này phải là email!';
        },
        min: function(minValue) {
            return function(value) {
                return value.length >= minValue ? undefined : `Vui lòng nhập tối thiểu ${minValue} kí tự`;
            }
        },
        max: function(maxValue) {
            return function(value) {
                return value.length <= maxValue ? undefined : `Vui lòng nhập tối đa ${maxValue} kí tự`;
            }
        }
    };

    //==========================================//
    function getParent(element, selector) {
        while(element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            } else {
                element = element.parentElement;
            }
        }
    }

    // =======================================//
    //Lay ra form element trong DOM theo formSelector
    var formElement = document.querySelector(formSelector);
    //Chi xu li khi co element trong DOM
    if (formElement) {
        //cac rule duoc luu vao input
        var inputs = formElement.querySelectorAll('[name][rules]');
        //gan gia tri input cho TH checkbox, radio
        var specialInput;
        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|');


            if (input.type === 'checkbox'|| input.type === 'radio') {
                specialInput = input;
            }

            for (var rule of rules) {
                var isRuleHasValue = rule.includes(':');
                var ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    var ruleInfo = rule.split(':');
                    //gan' lai ten rule
                    rule = ruleInfo[0];
                    //gan' function
                    ruleFunc = validatorRules[rule](ruleInfo[1]);
                }

                //dua vao object form rules
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            //Lang nghe su kien de validate (blur, change...)
            input.onblur = handleValidate;

            input.oninput = handleClearError;

            input.onchange = handleValidate;
            
        }

        function hanleForCaseSpecial() {
            var isInvalid = true;
            //Xu li validate rieng cho radio hoac checkbox
            var parentInput = getParent(specialInput, '.form-group');
            if (parentInput) {
                var arrInput = Array.from(parentInput.querySelectorAll('[type]'));
                if (arrInput.length) {
                    for (let input of arrInput) {
                        var isChecked = input.checked;
                        if (isChecked) {
                            isInvalid = false;
                            break;
                        }
                    }
                    
                    var rules = formRules[specialInput.name];
                    var errorMessage;
                    for (let rule of rules) {
                        errorMessage = rule(undefined);
                    }
                    if (isInvalid) {
                        parentInput.classList.add('invalid');
                        parentInput.querySelector('.form-message').innerText = errorMessage;
                    } else {
                        parentInput.classList.remove('invalid');
                        parentInput.querySelector('.form-message').innerText = '';
                    }
                }
            }
            
            return !isInvalid;
        }
        
        //ham thuc hien validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;
            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if (errorMessage) break;
            }

            //neu co loi thi hien thi ra errorMessage ra UI
            if (errorMessage) {
                var formGroup = event.target.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }

        //Ham clear message loi
        function handleClearError(event) {
            var formGroup = event.target.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        }

        //Xu ly hanh vi submit form
        formElement.onsubmit = function(event) {
            event.preventDefault();

            var isValid = true; var isValidtemp = true;
            
            for(var input of inputs) {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    //tra lai ket qua hop le hay khong hop le
                    isValidtemp = hanleForCaseSpecial();
                } else {  
                    if(!handleValidate({target: input})) {
                        isValid = false;
                    }
                }
            }

            //Khi khong co loi thi submit form 
            if (isValid && isValidtemp) {
                if (typeof _this.onSubmit === 'function') {
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

                    //Goi lai ham va tra ve cac gia tri the input cua form
                    _this.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }
        }
    }

}