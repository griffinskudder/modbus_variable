export interface IModbusClient {
    readHoldingRegisters: (startRegister: number, count: number) => number[];
    writeHoldingRegisters: (startRegister: number, values: number[]) => void;
}

export abstract class ModbusVariable {
    name: string;
    holdingRegister: number;
    registerData: DataView;
    client: IModbusClient;
    private _value: number | boolean = 0;
    public get value(): number | boolean {
        return this._value;
    }
    public set value(value: number | boolean) {
        this._value = value;
    }

    protected constructor(name: string, holdingRegister: number, registerArray: DataView, client: IModbusClient) {
        this.name = name;
        this.holdingRegister = holdingRegister;
        this.registerData = registerArray;
        this.client = client;
    }
}

export class ModbusBooleanVariable extends ModbusVariable {
    bitIndex: number;

    constructor(name: string, holdingRegister: number, registerArray: DataView, client: IModbusClient, bitIndex: number) {
        super(name, holdingRegister, registerArray, client);
        this.bitIndex = bitIndex;
    }

    get value(): boolean {
        const registerValue = this.registerData.getUint16(Math.floor(this.holdingRegister / 2)).toString(2).padStart(16, '0');
        switch (registerValue[this.bitIndex]) {
            case '0': return false
            case '1': return true
            default: return false
        }
    }

    set value(value: boolean) {
        let registerValue = this.registerData.getUint16(Math.floor(this.holdingRegister / 2)).toString(2).padStart(16, '0');
        switch (value) {
            case false:
                registerValue = registerValue.substring(0, this.bitIndex) + '0' + registerValue.substring(this.bitIndex + 1);
                break;
            case true:
                registerValue = registerValue.substring(0, this.bitIndex) + '1' + registerValue.substring(this.bitIndex + 1);
                break;
            default:
                break;
        }
        this.registerData.setUint16(Math.floor(this.holdingRegister / 2), parseInt(registerValue, 2));
        this.client.writeHoldingRegisters(this.holdingRegister, [this.registerData.getUint16(Math.floor(this.holdingRegister / 2))]);
    }
}

export class ModbusIntegerVariable extends ModbusVariable {
    signed: boolean;

    constructor(name: string, holdingRegister: number, registerArray: DataView, client: IModbusClient, signed: boolean) {
        super(name, holdingRegister, registerArray, client);
        this.signed = signed;
    }

    get value(): number {
        if (this.signed) {
                return this.registerData.getInt16(Math.floor(this.holdingRegister / 2));
        } else {
            return this.registerData.getUint16(Math.floor(this.holdingRegister / 2));
        }
    }

    set value(value: number) {
        if (this.signed) {
            this.registerData.setInt16(Math.floor(this.holdingRegister / 2), value);
            this.client.writeHoldingRegisters(this.holdingRegister, [this.registerData.getInt16(Math.floor(this.holdingRegister / 2))]);
        } else {
            this.registerData.setUint16(Math.floor(this.holdingRegister / 2), value);
            this.client.writeHoldingRegisters(this.holdingRegister, [this.registerData.getUint16(Math.floor(this.holdingRegister / 2))]);
        }
    }
}

export class ModbusDoubleVariable extends ModbusIntegerVariable {
    constructor(name: string, holdingRegister: number, registerArray: DataView, client: IModbusClient, signed: boolean) {
        super(name, holdingRegister, registerArray, client, signed);
    }

    get value(): number {
        if (this.signed) {
            return this.registerData.getInt32(Math.floor(this.holdingRegister / 2));
        } else {
            return this.registerData.getUint32(Math.floor(this.holdingRegister / 2));
        }
    }

    set value(value: number) {
        if (this.signed) {
            this.registerData.setInt32(Math.floor(this.holdingRegister / 2), value);
            this.client.writeHoldingRegisters(this.holdingRegister, [this.registerData.getUint16(Math.floor(this.holdingRegister / 2)), this.registerData.getUint16(Math.floor(this.holdingRegister + 1 / 2))]);
        } else {
            this.registerData.setUint32(Math.floor(this.holdingRegister / 2), value);
            this.client.writeHoldingRegisters(this.holdingRegister, [this.registerData.getUint16(Math.floor(this.holdingRegister / 2)), this.registerData.getUint16(Math.floor(this.holdingRegister + 1 / 2))]);
        }
    }
}

export class ModbusByteVariable extends ModbusIntegerVariable {
    byteIndex: number;

    constructor(name: string, holdingRegister: number, registerArray: DataView, client: IModbusClient, signed: boolean, byteIndex: number) {
        super(name, holdingRegister, registerArray, client, signed);
        this.byteIndex = byteIndex;
    }

    get value(): number {
        if (this.signed) {
            return this.registerData.getInt8(Math.floor(this.holdingRegister / 2) + this.byteIndex);
        } else {
            return this.registerData.getUint8(Math.floor(this.holdingRegister / 2) + this.byteIndex);
        }
    }

    set value(value: number) {
        if (this.signed) {
            this.registerData.setInt8(Math.floor(this.holdingRegister / 2) + this.byteIndex, value);
            this.client.writeHoldingRegisters(this.holdingRegister, [this.registerData.getUint16(Math.floor(this.holdingRegister / 2) + this.byteIndex)]);
        } else {
            this.registerData.setUint8(Math.floor(this.holdingRegister / 2 + this.byteIndex), value);
            this.client.writeHoldingRegisters(this.holdingRegister, [this.registerData.getUint16(Math.floor(this.holdingRegister / 2))]);
        }
    }
}