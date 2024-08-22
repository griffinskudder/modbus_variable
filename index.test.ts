import {
    ModbusIntegerVariable,
    ModbusBooleanVariable,
    ModbusByteVariable,
    ModbusDoubleVariable,
    IModbusClient
} from "./index";

class ModbusClient implements IModbusClient {
    readHoldingRegisters = jest.fn((holdingRegister: number, count: number) => {
        return [Number()];
    });
    writeHoldingRegisters = jest.fn((holdingRegister: number, data: number[]) => {
        return;
    });
}


const client = new ModbusClient();
const buffer = new ArrayBuffer(8);
const registerData = new DataView(buffer);

const booleanData = {holdingRegister: 0, bitIndex: 0};

const boolVar = new ModbusBooleanVariable(
    "Test Boolean",
    booleanData.holdingRegister,
    registerData,
    client,
    booleanData.bitIndex
);

test("ModbusBooleanVariable", () => {
    boolVar.value = true;
    expect(boolVar.value).toBe(true);
    expect(client.writeHoldingRegisters.mock.calls).toHaveLength(1);
    expect(Number(client.writeHoldingRegisters.mock.calls[0][1]).toString(2)).toStrictEqual('1000000000000000')
});
const byteData = {holdingRegister: 0, byteIndex: 1, signed: false};

const byteVar = new ModbusByteVariable(
    "Test Byte",
    byteData.holdingRegister,
    registerData,
    client,
    byteData.signed,
    byteData.byteIndex
);

test("ModbusByteVariable", () => {
    byteVar.value = 5;
    expect(byteVar.value).toBe(5);
    expect(client.writeHoldingRegisters.mock.calls).toHaveLength(2);
    expect(Number(client.writeHoldingRegisters.mock.calls[1][1]).toString(2)).toStrictEqual('1000000000000101')
})
