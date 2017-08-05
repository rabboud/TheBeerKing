import {rules} from 'omz-react-validation/lib/build/validation.rc';
import validator from 'validator';

// React validations
Object.assign(rules, {
    required: {
        rule: (value) => {
            if (!value) {
                return false;
            }
            return true;
        },
        hint: (value) => {
            return 'Campo obrigatório';
        }
    },
    email: {
        rule: (value) => {
            return validator.isEmail(value);
        },
        hint: (value) => {
            return 'Email incorreto';
        }
    },
    hexColor: {
        rule: (value) => {
            return validator.isHexColor(value);
        },
        hint: (value) => {
            return 'Cor inválida';
        }
    },
    url: {
        rule: (value) => {
            return validator.isURL(value, {
                'protocols': ['http', 'https', 'ftp'],
                'require_tld': true,
                'require_protocol': true
            });
        },
        hint: (value) => {
            return 'URL inválida';
        }
    },
    token: {
        rule: (value) => {
            return validator.isLength(value, {
                'min': 32,
                'max': 32
            });
        },
        hint: (value) => {
            return 'Deve conter 32 caracteres';
        }
    },
    password: {
        rule: (value, components) => {
            const password = components.password.state;
            const passwordConfirm = components.passwordConfirm.state;
            const isBothUsed = password
                && passwordConfirm
                && password.isUsed
                && passwordConfirm.isUsed;
            const isBothChanged = isBothUsed && password.isChanged && passwordConfirm.isChanged;

            if (!isBothUsed || !isBothChanged) {
                return true;
            }

            return password.value === passwordConfirm.value;
        },
        hint: (value) => {
            return 'Senhas devem ser iguais';
        }
    }
});

class ValidatorHelper {
    static isImageUrl (value) {
        return validator.matches(value, /https?:\/\/.*\.(?:gif|png|jpg|jpeg)\??[a-z,\-,0-9,=,\?,&%]*/i);
    }

    static isVideoUrl (value) {
        return validator.matches(value, /https?:\/\/.*\.(?:mp4|ogg|mov|webm)\??[a-z,\-,0-9,=,\?,&%]*/i);
    }

    static isAudioUrl (value) {
        return validator.matches(value, /https?:\/\/.*\.(?:aac|mp3|wav|aif)\??[a-z,\-,0-9,=,\?,&%]*/i);
    }

    static isAlpha (value) {
        return validator.isAlpha(value, 'pt-BR');
    }

    static isNumeric (value) {
        return validator.isNumeric(value);
    }

    static isAlphanumeric (value) {
        return validator.isAlphanumeric(value, 'pt-BR');
    }

    static isHexColor (value) {
        return validator.isHexColor(value);
    }
}

export default ValidatorHelper;
