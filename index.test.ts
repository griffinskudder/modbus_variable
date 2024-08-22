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
    expect(client.writeHoldingRegisters.mock.calls[0][1]).toStrictEqual([Number.parseInt('1000000000000000', 2)])
});
const byteData = {holdingRegister: 1, byteIndex: 1, signed: false};

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
    expect(client.writeHoldingRegisters.mock.calls[1][1]).toStrictEqual([5])
})

const intData = {holdingRegister: 2, signed: false};

const intVar = new ModbusIntegerVariable(
    "Test Integer",
    intData.holdingRegister,
    registerData,
    client,
    intData.signed
)

test("ModbusIntegerVariable", () => {
    intVar.value = 16;
    expect(intVar.value).toBe(16);
    expect(client.writeHoldingRegisters.mock.calls).toHaveLength(3);
    expect(client.writeHoldingRegisters.mock.calls[2][1]).toStrictEqual([16])
})

const doubleData = {holdingRegister: 3, signed: false};

const doubleVar = new ModbusDoubleVariable(
    "Test Double",
    doubleData.holdingRegister,
    registerData,
    client,
    doubleData.signed
);

test("ModbusDoubleVariable", () => {
    doubleVar.value = 8;
    expect(doubleVar.value).toBe(8);
    expect(client.writeHoldingRegisters.mock.calls).toHaveLength(4);
    expect(client.writeHoldingRegisters.mock.calls[3][1]).toStrictEqual([0, 8]);
})