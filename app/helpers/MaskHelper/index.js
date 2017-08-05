class MaskHelper {
    static maskCpf (value) {
        if (parseInt(value, 10) && value.length === 11) {
            return `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9, 11)}`;
        }
        return value;
    }

    static unMaskCpf (value) {
        return value.replace(/[.-]/g, '');
    }

    static maskPhone (value) {
        if (parseInt(value, 10) && value.length === 11) {
            return `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
        }
        return value;
    }

    static unMaskPhone (value) {
        return value.replace(/[()\s-]/g, '');
    }
}

export default MaskHelper;
